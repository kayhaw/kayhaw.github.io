---
layout: article
title: 对象的共享
permalink: /java-concurrency-in-practice/chap03
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第三章读书笔记
:::

## 可见性

同步代码块(方法)不仅用于实现原子操作，同时也实现**内存可见性：线程A修改变量对象状态后线程B能够立刻看到最新状态**。 当变量的读和写在不同线程执行时，没有使用同步机制会导致问题，如下所示：

```java
public class NoVisibility {
    private static boolean ready;
    private static int number;

    private static class ReaderThread extends Thread {
        @Override
        public void run() {
            while(!ready) {
                Thread.yield();
            }
            System.out.println(number);
        }
    }

    public static void main(String[] args) {
        new ReaderThread().start();
        number = 42;
        ready = true;
    }
}
```

由于主线程对number和ready的更改对于Reader线程来说是不可见的，因此Reader线程可能打印0，或者永远不会结束。

### 失效数据

NoVisibility例子中number和ready就是典型的**失效数据**：读取到另一个线程已经修改数据的旧值。失效的方法调用计数器可能不会导致太大问题，但是在NoVisibility中导致了输出错误值。

### 非原子的64位操作

失效值起码是旧值，而不是随机值，这称之为**最低安全性**。对于绝大多数变量，最低安全性都成立。但**非volatile类型的64位变量(double和long)**是个例外，JVM允许对64位数据读写分解为2次32位数据读写(设计Java虚拟机规范时，主流处理器还未提供64位数据原子操作)。因此，可能多线程下读取到某个值的高32位和另一个值低32位的组合数，这是个随机值。

:::info
在《深入理解Java虚拟机规范》中提到，这种64位数据操作的异常情况可以不用考虑，不会产生意外问题。
:::

### 加锁与可见性

加锁含义不仅仅时实现互斥行为，还包括内存可见性。所有读写线程在同一个锁上操作确保它们都能获得最新值。

### volatile变量

volatile是一种比synchronized更加轻量，但能力稍弱的同步机制。读取volatile变量总是返回最新值，典型用法是检查某个状态标记以判断是否推出循环，代码如下所示：

```java
volatile boolean asleep;

while(!asleep) {
  countSomeSheep();
}
```

加锁既确保了原子性也确保了可见性，但volatile只确保可见性，没有原子性。因此，当且仅当满足如下所有条件时采用volatile变量：

1. 变量写入不依赖其当前值(++count典型反例)，或者只有一个线程更新值
2. 变量不会和其他状态变量作为不变性条件
3. 访问变量时无需加锁

## 发布与逸出

**发布(Publish)**对象：让对象能够在当前作用域之外的代码中使用。对象**逃逸(Escape)**：并不应该发布的对象被发布。如下代码所示，数组states发生逃逸：

```java
class UnsafeStates {
    private String[] states = new String[] {"KAY", "HAW"};
    public String[] getStates() {return states;}
}
```

当发布对象时，该对象非私有域中引用的所有对象也同样会被发布。另一种产生逸出的情况是发布一个内部的类实例，如下所示：

```java
public class ThisEscape {
    public ThisEscape(EventSource source) {
        source.registerListener(new EventListener() {
            public void onEvent(Event e) {
                doSomething(e);
            }
        });
    }

    void doSomething(Event e) {}

    interface EventSource {void registerListener(EventListener e);}

    interface EventListener {void onEvent(Event e);}

    interface Event {}
}
```

创建内部类EventListener实例时，编译器会自动为其构造函数传递外部类ThisEscape对象this引用作为参数，导致外部类ThisEscape对象逸出。换句话说，在对象构造函数中发布了对象。另一种使this逸出的常见错误是，在构造函数中**启动**一个线程，此时this会被新线程共享。此外，在构造函数中调用可重写方法（没有用private、final修饰）也会使this逸出。如果实在要在构造函数中注册事件监听器或者启动线程，可以将构造器设为私有，使用工厂方法创建对象，代码如下所示：

```java
public class SafeListener {
    private final EventListener listener;

    private SafeListener() {
        listener = new EventListener() {
            public void onEvent(Event e) {
                doSomething(e);
            }
        };
    }

    public static SafeListener newInstance(EventSource source) {
        SafeListener safe = new SafeListener();
        source.registerListener(safe.listener);
        return safe;
    }

    void doSomething(Event e) {}

    interface EventSource {void registerListener(EventListener e);}

    interface EventListener {void onEvent(Event e);}

    interface Event {}
}
```

:::info 构造函数this逃逸的3种常见情况

1. 构造函数中调用内部类构造方法
2. 构造函数中启动新线程
3. 构造函数中调用类自身可重写方法
:::

## 线程封闭

实现线程安全的最简单方法之一就是不共享数据，只在单线程内访问数据，称之为**线程封闭(Thread Confinement)**，下面介绍3中线程封闭方式。

### Ad-hoc线程封闭

Ad-hoc线程封闭指维护线程封闭性的职责完全由程序实现来承担。但Ad-hoc线程封闭是**非常脆弱的**，尽量别用。单线程执行写入操作情况下，volatile变量是线程封闭的。

### 栈封闭

栈封闭指只能通过局部变量访问对象的方式。因为局部变量天生的为线程私有，当局部对象没有发生逸出时，它们就是线程封闭的。因此，程序员需要确保引用对象不会逸出。

### ThreadLocal类

实现线程封闭性的另一种规范方式是ThreadLocal类，它让每个线程都独立保存一份变量副本，并提供get、set方法获取设置副本值。如下代码所示，将JDBC连接保存到ThreadLocal对象中，让每个线程都有自己的JDBC连接：

```java
public class ConnectionDispenser {
    static String DB_URL = "jdbc:mysql://localhost/mydatabase";

    private ThreadLocal<Connection> connectionHolder
            = new ThreadLocal<Connection>() {
                public Connection initialValue() {
                    try {
                        return DriverManager.getConnection(DB_URL);
                    } catch (SQLException e) {
                        throw new RuntimeException("Unable to acquire Connection, e");
                    }
                };
            };

    public Connection getConnection() {
        return connectionHolder.get();
    }
}
```

实现应用程序框架时大量使用ThreadLocal，比如J2EE容器将事务上下文与某个执行中线程联系起来。ThreadLocal增加了隐式的代码耦合性，使用时要格外小心，不要滥用。

## 不变性

如果对象在创建后其状态不能被修改，则称该对象为**不可变的(immutable)**，不可变对象一定就是线程安全的。那如何创建一个不可变对象？需要满足如下条件：

1. 对象创建后状态不可修改
2. 对象所有字段都由final修饰
3. 对象正确创建（构造函数中没有发生this逸出）

不可变对象的内部仍可以包含可变对象，代码如下所示。实际情况程序状态总是不断变化的，那不可变对象用不着啊？注意，**不可变对象!=不可变的对象引用**，可以使用保存新状态的不可变对象来代替旧对象。

```java
 public final class ThreeStooges {
    // stooges是可变对象
    private final Set<String> stooges = new HashSet<String>();

    public ThreeStooges() {
        stooges.add("Moe");
        stooges.add("Larry");
        stooges.add("Curly");
    }

    public boolean isStooge(String name) {
        return stooges.contains(name);
    }

    public String getStoogeNames() {
        List<String> stooges = new Vector<String>();
        stooges.add("Moe");
        stooges.add("Larry");
        stooges.add("Curly");
        return stooges.toString();
    }
}
```

### Final域

final修饰域不可变，当修饰基本类型时意味着值不可变，修饰引用类型时所引用的对象还是可变的。在上一章的CachedFactorizer类中，尝试使用2个AtomicReference变量来解决线程安全问题，但还是无法以原子方式同步更新这2个变量。此时，可以通过不可变对象来提供一种**弱形式的原子性**。

```java
public class OneValueCache {
    private final BigInteger lastNumber;
    private final BigInteger[] lastFactors;

    public OneValueCache(BigInteger i,
                         BigInteger[] factors) {
        lastNumber = i;
        lastFactors = Arrays.copyOf(factors, factors.length);
    }

    public BigInteger[] getFactors(BigInteger i) {
        if (lastNumber == null || !lastNumber.equals(i))
            return null;
        else
            return Arrays.copyOf(lastFactors, lastFactors.length);
    }
}

public class VolatileCachedFactorizer {
    private volatile OneValueCache cache = new OneValueCache(null, null);

    public BigInteger[] getFactors(BigInteger i) {
        BigInteger[] factors = cache.getFactors(i);
        if (factors == null) {
            factors = factor(i);
            cache = new OneValueCache(i, factors);
        }
        return factors;
    }
}
```

如上代码所示，通过不可变类OneValueCache来消除访问和更新多个关联变量时的竞态条件。不可变对象状态更新只能产生新对象，为此，配合使用volatile让新对象能够立即被其他线程感知，从而在没有使用锁的情况下实现线程安全。

:::tip
通过volatile修饰的不可变对象实现线程安全
:::

## 安全发布

到目前为止，实现线程安全的方式要么是干脆不共享(线程封闭)或者让对象不可变。实际场景需要共享对象，那么如何安全发布对象？

### 不正确的发布

如下代码所示，Holder对象的发布是不正确的。线程A执行`Holder h = new Holder(32)`分为3步：:one:申请内存、:two:将n赋值为32、:three:将内存地址传给h。但实际执行顺序可能是:one::arrow_right::three::arrow_right::two:，当线程B在:two:前后读取n值时就会出现不相等的情况。

```java
public class Holder {
    private int n;
    public Holder(int n) {
        this.n = n;
    }
    public void assertSanity() {
        if (n != n)
            throw new AssertionError("This statement is false.");
    }
}
```

### 不可变对象与初始化安全性

任何线程都可以在不需要额外同步的情况下安全地访问不可变对象，即使在发布对象时没有使用同步。比如上例中将n加上final修饰即可解决问题，这种保证还可以衍生到final修饰的域，但是final域指向可变对象时，访问这些可变对象的状态还需要同步。

### 安全发布的常用模式

一个正确构造的对象可以通过如下方式安全发布：

1. 在静态初始化方法初始化一个对象引用
2. 将对象的引用保存到volatile类型字段或者AtomicReference对象中
3. 将对象的引用保存到某个正确构造对象的final类型字段中
4. 将对应的引用保存到一个由锁保护的字段中

将对象放入由JUC提供的线程安全容器，满足如上第4点要求。另外，发布静态构造的对象，最简单也是最安全的方式是使用静态初始化器：

```java
public static Holder holder = new Holder(42);
```

静态初始化器由JVM在类的初始化阶段执行，由JVM提供同步机制。

### 事实不可变对象

对象从技术上说是可变的，但是其状态在发布后不会再改变，称之为**事实不可变对象(Effectively Immutable Object)**，而之前提到的不可变对象(Immutable Object)是**创建后**不可再改变。

### 可变对象

可变对象是构造后可以修改的对象，不仅发布时需要使用同步，而且在每次访问时也需要使用同步。对象的发布需求取决于它的可变性：

- 不可变对象可以通过任意机制发布
- 事实不可变对象必须通过安全方式发布
- 可变对象必须通过安全方式发布，并且是线程安全的或者由某个锁保护起来

### 安全地共享对象

当发布一个对象时，必须明确地说明对象的访问方式。常用的策略包括：

1. **线程封闭**：对象只由一个线程所有
2. **只读共享**：对象不可变或者事实不可变
3. **线程安全共享**：对象内部实现同步
4. **保护对象**：只能通过特定锁来访问

## 总结

对象的共享让对象可见，但是可见性也会带来错误，比如线程B读取旧状态而线程A在设置新状态。为了避免问题，那就直接不共享(线程封闭)。如果要共享，继续看共享对象是否可变。不可变对象发布不受限制，事实不可变对象要安全发布，可变对象不仅要安全发布，还要安全访问(比如通过锁)。