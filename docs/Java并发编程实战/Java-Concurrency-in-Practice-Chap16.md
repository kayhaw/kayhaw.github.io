---
layout: article
title: Java内存模型
permalink: /java-concurrency-in-practice/chap16
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第十六章读书笔记
:::

## 什么是内存模型，为什么需要它

即使是一条简单的`a=2`，在处理器上执行时，不同的线程在读取变量a时会得到不同的值。这种情况产生因素有许多：编译器生成的指令顺序和代码顺序不同、变量保存在寄存器而不是内存中、处理器乱序或并行执行等。JMM规定了JVM必须遵守的最小保证，规定对变量的写入在何时对其他线程可见，协调多个线程的同步操作，确保并发程序的正确运行。

### 平台的内存模型

在共享内存的多处理器架构中，每个处理器有自己的缓存，通过缓存一致性协议达成共识。但一些处理器架构只提供最小保证，允许不同处理器从同一内存位置上看到不同值。当跨线程共享数据，需要通过特殊指令(内存栅栏)来避免异常情况发生。JMM将内存栅栏透明化，只需要编写正确使用同步的程序即可。

### 重排序

在缺乏同步机制的情况下，指令重排序让程序行为不可预测，如下代码所示：

```java
public class PossibleReordering {
    static int x = 0, y = 0;
    static int a = 0, b = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread one = new Thread(new Runnable() {
            public void run() {
                a = 1;
                x = b;
            }
        });
        Thread other = new Thread(new Runnable() {
            public void run() {
                b = 1;
                y = a;
            }
        });
        one.start();
        other.start();
        one.join();
        other.join();
        System.out.println("( " + x + "," + y + ")");
    }
}
```

最终输出可以是(1,0)、(0,1)或(1,1)，特别地，当线程one指令重排序并且线程按照如下方式执行，会得到输出为(0,0)。

```text
线程one: -> [x=b(0)] ----->重排序------> [a=1]->
线程other:           ->[b=1]->[y=a(0)]->
```

### Java内存模型简介

JMM为程序所有操作定义了一个偏序关系，称为先行发生(Happens-Before)原则。要保证执行操作B的线程看到操作A的结果(无论操作A和B是否由同一个线程执行)，A和B就必须满足先行发生原则，否则JVM可以任意排序A和B。先行发生规则包括：

1. 程序顺序规则：程序中操作A在操作B前，同一个线程执行时A在B前
2. 监视器锁规则：监视器锁的解锁操作在同一个锁的加锁操作之前执行
3. volatile变量规则：对volatile变量的写操作在读操作之前进行
4. 线程启动规则：线程的start调用发生在该线程的任务执行操作之前
5. 线程结束规则：线程的任何操作在其他线程检测到该线程已经结束之前都执行
6. 中断规则：线程B调用线程A的interrupt方法时，线程B必须在线程A检测到中断之前执行
7. 终结器规则：对象的构造函数必须在该对象的终结器之前执行完成
8. 传递性：操作A先行发生于操作B，操作B先行发生于操作C，那么操作A先行发生于操作C

### 借助同步

指将程序顺序规则与监视器锁规则或volatile变量规则结合，对某个未被锁保护的变量的访问操作进行排序。以FutureTask为例，对于一个调用get获取计算结果的线程和另一个调用set设置结果的线程，这两个线程应该按照先行发生进行排序。此时可以简单地将结果变量设置为volatile的，但可以完全使用现有的同步机制来实现。如下代码所示给出FutureTask的innerSet和innerGet方法，innerSet方法在调用releaseShared方法之前写入result，innerGet方法在调用acquireShared之后读取result，确保写入操作在读取操作之前进行。

```java
// FutureTask内部类，已被弃用
private final class Sync extends AbstractQueuedSynchronizer {
  private static final int RUNNING = 1, RAN = 2, CANCELLED = 4;
  private V result;
  private Exception exception;

  void innerSet(V v) {
    while(ture) {
      int s = getState();
      if(ranOrCancelled(s))
        return;
      if(compareAndSetState(s, RAN))
        break;
    }
    result = v;
    releaseShared(0);
    done();
  }

  V innerGet() throws IntertuptedException, ExecutionException {
    acquireSharedInterruptibly(0);
    if(getState() == CANCELLED)
      throw new CancellationException();
    if(exception != null)
      throw new ExecutionException(exception);
    return result;
  }
}
```

:::danger
Java 8的FutureTask已经抛弃了这种写法
:::

可以看到，代码利用现有的先行发生规则而不是专门为结果变量创建一个顺序。其他可借助的先行发生包括：

- 将元素a方位同步容器的操作将在另一个线程从该容器获取a的操作之前执行
- 在CountDownLatch上的倒数操作将在线程从闭锁上的await方法返回之前执行
- 释放Semaphore许可的操作将在从该Semaphore上获得一个许可之前执行
- Future任务的操作将在Future.get返回之前执行
- 向Executor提交任务的操作将在任务开始执行前执行
- 一个线程到达CyclicBarrier或Exchanger的操作在其他到达线程被释放之前执行

## 发布

造成不正确发布的原因是，发布一个对象与另一个线程访问该对象的操作没有构成先行发生关系。

### 不安全的发布

当缺少先行发生关系时，就可能出现指令重排，导致另一个线程看到只被部分构造的对象(见第3章)。如下所示代码，发布的resource就是不安全的：

```java
public class UnsafeLazyInitialization {
    private static Resource resource;

    public static Resource getInstance() {
        if (resource == null)
            resource = new Resource(); // unsafe publication
        return resource;
    }

    static class Resource {
    }
}
```

以上代码可能会出现线程a实例化Resource然后给resource赋值，而在线程b看到的是resource赋值再实例化，因此线程b看到一个部分实例化的Resource实例。

### 安全的发布

在第3章中介绍各种安全的发布模式，但先行发生规则比安全发布提供更强的可见性与顺序保证。那为什么还要介绍安全发布？先行发生是内存访问级别上的，像一种“并发级别汇编语言”，而安全发布的运行级别更接近程序设计。

### 安全初始化模式

当对象构造开销较高时，需要推迟其初始化操作。在UnsafeLazyInitialization的例子中，可以通过加synchronized关键字来安全发布：

```java
public class SafeLazyInitialization {
    private static Resource resource;

    public synchronized static Resource getInstance() {
        if (resource == null)
            resource = new Resource();
        return resource;
    }

    static class Resource {
    }
}
```

除此之外，由于JVM执行静态初始化器是线程安全的，可以将Resource的构造放在static语句中，如下所示：

```java
public class EagerInitialization {
    private static Resource resource = new Resource();

    public static Resource getResource() {
        return resource;
    }

    static class Resource {
    }
}
```

以上代码使得对象的初始化提前了，可以通过“延迟初始化占位类模式”将其改进为延迟的，代码如下所示：

```java
public class ResourceFactory {
    // 本质上是利用静态内部类实现延迟加载
    private static class ResourceHolder {
        public static Resource resource = new Resource();
    }

    public static Resource getResource() {
        return ResourceFactory.ResourceHolder.resource;
    }

    static class Resource {
    }
}
```

### 双重检查加锁

基于双重检查加锁(Double Check Lockm, DCL)的代码如下所示，通过2次检查避免不必要的对象构造和同步加锁，但这段代码并不是线程安全。DCL存在的问题在于线程仍有可能看到一个部分构造的resource对象，正确的版本应该是将reosurce声明为volatile的。

```java
public class DoubleCheckedLocking {
    private static Resource resource;

    public static Resource getInstance() {
        if (resource == null) {
            synchronized (DoubleCheckedLocking.class) {
                if (resource == null)
                    resource = new Resource();
            }
        }
        return resource;
    }

    static class Resource {}
}
```

解决无竞争同步的执行速度慢、JVM启动慢是设计DCL的初衷，但是这些问题已经不复存在，使用延迟初始化占位类模式是比DCL更好的选择。

## 初始化过程中的安全性

当确保初始化过程的安全性，被正确构造的不可变对象在没有同步时也是线程安全的。如下代码所示的SafeStates对象可以安全发布，但是注意对SafeStates的细微修改都会破坏它的线程安全性，比如states不是final类型，存在其他修改states的方法等。

```java
public class SafeStates {
    private final Map<String, String> states;

    public SafeStates() {
        states = new HashMap<String, String>();
        states.put("alaska", "AK");
        states.put("alabama", "AL");
        /*...*/
        states.put("wyoming", "WY");
    }

    public String getAbbreviation(String s) {
        return states.get(s);
    }
}
```

初始化安全性只能保证通过final可达的字段值在构造完成后的可见性，对于非final修饰，或者构造完成后可能被修改的值，需要采用同步来确保可见性。

## 总结

1. 单例模式使用synchronized、static静态构造、延迟初始化占位类的用法
2. 优先选择延迟初始化占位类而不是DCL
3. 不可变对象确保初始化过程的安全性后可以安全发布，但是对类要求很高：不能有其他非final字段，除了构造函数不能有其他方法修改对象
