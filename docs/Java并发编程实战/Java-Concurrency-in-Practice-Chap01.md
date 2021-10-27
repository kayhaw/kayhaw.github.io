---
layout: article
title: 线程安全性
permalink: /java-concurrency-in-practice/chap02
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第二章读书笔记
:::

## 什么是线程安全性

定义：当多个线程访问某个类时，该类始终可以表现出正确的行为。线程**不安全**的两个必要条件：

- 多线程共享状态
- 状态可变

因此，**不可变或者没有状态的对象一定是线程安全的**。

## 原子性

在并发编程中，由于不恰当的执行顺序导致不正确的结果称之为*竞态条件(Race Condition)*。比如多个线程执行代码`++count`统计方法被调用次数，这是典型的*先检查后执行*操作(先获取当前count值，然后加1写回)，在多线程环境下检查的结果可能不正确(已经被其他线程修改但未写回)。

### 示例：延迟初始化中的竞态条件

对于如下延迟初始化的代码，先检查引用instance是否为空，然后才构造对象。当线程A和B同时执行，最终结果取决于不可预测的执行时序。若A、B分别执行都检查instance为空，则getInstance返回两个不同对象，这违背了延迟初始化的初心。

```java
public class LazyInitRace {
    private ExpensiveObject instance = null;

    public ExpensiveObject getInstance() {
        if(instance == null) {
          instance = new ExpensiveObject();
        }
        return instance;
    }
}
```

### 复合操作

为了防止以上竞态条件的出现，需要确保其他线程在修改操作之前或之后读取和修改状态，而不是在修改过程中。由此引出**原子操作**定义：设有操作A和B，从执行A的线程看，另一个线程执行B时，要么B操作全部执行完，要么完全不执行。而如上的“先检查后执行”、“读取-修改-写入”的操作称之为**复合操作**：包含了一组必须以原子方式执行的操作。比如为了修改`++count`导致的竞态条件，将count由Long类型改为AtomicLong。

## 加锁机制

考虑如下代码，使用AtomicReference保存最近分解质因数的数值及其结果，这意味着它是线程安全的吗？

```java
public class CachedFactorizer {
    private final AtomicReference<BigInteger> lastNumber = new AtomicReference<>();
    private final AtomicReference<BigInteger[]> lastFactors = new AtomicReference<>();

    public BigInteger[] getFactors(BigInteger i) {
        if(i.equals(lastNumber.get())) {
            return lastFactors.get();
        } else {
            BigInteger[] factors = factor(i);
            lastNumber.set(i);
            lastFactors.set(factors);
            return factors;
        }
    }
}
```

答案是否定的。尽管lastNumber和lastFactors各自是线程安全的，但是它们不是互相独立的（在lastFactors中的因数之积应该等于lastNumber中数值），需要保证在同一个原子操作内同时更新两者，否则可能线程A在获取这两个值的过程中，线程B修改了它们。

:::tip 总结
要保持状态一致性，需要在原子操作中更新**所有相关的**状态变量。
:::

### 内置锁

为了解决上述问题，Java提供内置锁机制来支持原子性，即同步代码块。它包含两部分：

1. 作为锁的对象引用
2. 作为由该锁保护的代码块

对于如上getFactors方法，只需要使用synchronized关键字修饰使其成为同步方法。每个Java对象都可以作为锁（被称为**内置锁、监视锁或者隐式锁**），线程进入同步代码块时自动获得锁，退出时自动释放锁。内置锁是互斥的，这意味着最多只有一条线程能持有锁，导致性能降低。

### 重入锁

“重入”意味着获取锁的操作的粒度是“线程”而不是“调用”，即获取锁的线程可以再次进入锁保护的代码块，内置锁是可重入的（或者说已获得锁的线程再请求获取同一个锁时会成功）。重入进一步提升加锁的封装性，简化代码开发。

```java
public class Widget {
    public synchronized void doSomething() {...}
}

public class LoggingWidget extends Widget {
    public synchronized void doSomething() {
        System.out.println("Call doSomething");
        super.doSomething();
    }
}
```

如果内置锁不可重入，子类doSomething方法调用super.doSomething()时无法获得锁导致死锁。

## 用锁来保护状态

当用锁来保护状态时，需要**确保共享和可变的变量都只由同一个锁来保护**。因此，常用的编程模板是将所有可变状态封装在某个类中，然后提供使用synchronized修饰的方法提供访问和修改，这样对于该类对象来说，锁都是对象本身。同时也不要滥用锁，并非所有数据都需要加锁。

## 活跃性与性能

在CachedFactorizer的例子中，将整个getFactors方法都设置为同步代码块，这极大降低了程序性能。当多个线程A、B、C调用getFactors方法时，只能依次等待获取锁的线程执行完毕，这称为不良并发(Poor Concurrency)的程序。为此，需要尽量缩小同步代码块的范围，同时维护线程安全性，改进后代码如下所示：

```java
public class CachedFactorizer {
    private BigInteger lastNumber;
    private private BigInteger[] lastFactors;

    public BigInteger[] getFactors(BigInteger i) {
        BigInteger[] factors = null;
        synchronized (this) {
            if(i.equals(lastNumber)) {
                factors = lastFactors.clone();
            }
        }
        if(factors == null) {
            factors = factor(i);
            synchronized (this) {
                lastNumber = i;
                lastFactors = factors.clone();
            }
        }
        return factors;
    }
}
```

改造后的代码去除了原子变量的使用，在访问状态或者复合操作执行时加锁实现线程安全，同时确保尽量小地影响并发。

:::tip 总结

1. 实现同步策略的代码存在简单性(整个方法块同步)和性能的互相制约，不要盲目地为了性能而牺牲简单性
2. 执行时间过长的代码不要加锁
:::
