---
layout: article
title: 显式锁
permalink: /java-concurrency-in-practice/chap13
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第十三章读书笔记
:::

Java 5.0新增了ReentrantLock，作为内置锁(synchronized、volatile)的一种替代品。

## Lock与ReentrantLock

Lock接口中定义的锁相关操作如下所示。与内置加锁不同，Lock提供**无条件的、可轮询的、定时的以及可中断的锁获取操作**。而ReentrantLock实现了Lock接口，提供了与synchronized一样的互斥性和内存可见性。

```java
public interface Lock {
  void lock();
  // 加锁，阻塞期间可被中断
  void lockInterruptibly() throws InterruptedException;
  // 加锁，失败立即返回false而不是阻塞
  boolean tryLock();
  // 在给定时间内加锁
  boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
  // 解锁
  void unlock();
  Condition newCondition();
}
```

内置锁存在局限性，例如无法中断等待获取锁的线程，无法请求锁时无限期等待，无法实现非阻塞的加锁规则。而Lock加锁机制更加灵活，使用Lock的标准形式如下所示：

```java
Lock lock = new ReentrantLock();
...
lock.lock();
try {
  // 更新对象状态
  // 捕获异常
} finally {
  // 一定不要忘记在finally块中释放锁
  lock.unlock();
}
```

### 轮询锁与定时锁

tryLock方法实现可定时的与可轮询的加锁模式，它相比于无条件的加锁模式具有更加完善的错误恢复机制，从而避免死锁的发生。如下所示代码使用无参的tryLock来解决第10章中的动态顺序死锁问题：当获取锁失败就回退然后重新尝试，通过随机时长休眠避免活锁。

```java
public boolean transferMoney(Account fromAcct,
                             Account toAcct,
                             DollarAmount amount,
                             long timeout,
                             TimeUnit unit)
        throws InsufficientFundsException, InterruptedException {
    long fixedDelay = getFixedDelayComponentNanos(timeout, unit);
    long randMod = getRandomDelayModulusNanos(timeout, unit);
    long stopTime = System.nanoTime() + unit.toNanos(timeout);

    while (true) {
        if (fromAcct.lock.tryLock()) {
            try {
                if (toAcct.lock.tryLock()) {
                    try {
                        if (fromAcct.getBalance().compareTo(amount) < 0)
                            throw new InsufficientFundsException();
                        else {
                            fromAcct.debit(amount);
                            toAcct.credit(amount);
                            return true;
                        }
                    } finally {
                        toAcct.lock.unlock();
                    }
                }
            } finally {
                fromAcct.lock.unlock();
            }
        }
        if (System.nanoTime() < stopTime)
            return false;
        NANOSECONDS.sleep(fixedDelay + rnd.nextLong() % randMod);
    }
}
```

### 可中断的锁获取操作

由于内置锁不可中断的阻塞机制，使得实现可取消任务变得复杂。而lockInterruptibly方法能在获取锁的同时响应中断，如下代码所示：

```java
public class InterruptibleLocking {
    private Lock lock = new ReentrantLock();

    public boolean sendOnSharedLine(String message)
            throws InterruptedException {
        lock.lockInterruptibly();
        try {
            return cancellableSendOnSharedLine(message);
        } finally {
            lock.unlock();
        }
    }

    private boolean cancellableSendOnSharedLine(String message) throws InterruptedException {
        /* send something */
        return true;
    }
}
```

lockInterruptibly和带定时参数的tryLock都可响应中断，因此使用它们的任务都是可取消的。

### 非块结构的加锁

内置锁的获取和释放是处于同一个代码块的，但Lock能够提供更加灵活的加锁规则(锁耦合：链表next节点加锁后释放pre节点锁)。

## 性能考虑因素

当在Java 5.0中引入ReentrantLock，确实比内置锁提供了更好的竞争性能：更少的使用系统调用和上下文切换。在Java 6.0中对内置锁进行改进，此时两者吞吐量已非常接近。

:::caution
内置锁性能低于显示锁(Lock)已经成为过去式，性能不是不断变化的指标。
:::

## 公平性

ReenLock构造方法通过boolean类型参数fair来提供两种公平性选择(默认false)：

- true：创建公平锁，线程按照发出请求的顺序来获取锁
- false：创建非公平锁，允许“插队”：一个线程获取请求锁时，恰好锁可用，此时它直接获取锁而不排队

为什么默认非公平锁？公平锁在挂起和恢复线程时存在开销降低性能，实际中确保被阻塞的线程能获取锁就够了。原书给出的一个性能测试证明，使用公平锁将性能降低了两个数量级。另一个重要原因：恢复被挂起的线程与该线程真正开始执行存在严重延迟。在这段启动延时中让另一个请求锁的活跃线程直接使用、释放这个锁，也没有耽搁原有获取锁的线程，可以达到一种双赢局面，提高吞吐量。而当持有锁时间较长，或者请求所的平均时间间隔较长，应该使用公平锁。

:::tip
内置锁也是非公平的，Java规范并没有要求使用公平方式实现内置锁。
:::

## 在synchronized和ReentrantLock之间选择

当需要一些高级功能时才考虑使用ReentrantLock，这个高级功能包括：可定时的、可轮询的、可中断的锁获取机制，公平队列，非块结构的锁。在Java 5.0中，对于内置锁，可以在线程dump中可以看到哪些调用帧中获得锁请求，以及检测识别死锁，而ReentrantLock的非块结构意味着获取锁操作不能与特定栈帧关联，但这个问题在Java 6.0中已经解决。

除此之外，因为synchronized是JVM内置特性，它能执行一些优化：比如锁消除、锁粗化。

:::caution
除非特殊需要，应该选择synchronized而不是ReentrantLock
:::

## 读写锁

ReentrantLock实现了标准的互斥锁，但当大多数操作都是读取数据时，此时可以放宽加锁需求，允许多个线程同时访问，提升程序性能。接口ReadWriteLock暴露两个Lock对象，分别用于读写操作。尽管看起来两个锁互相独立，但它们是读-写对象的不同视图：

```java
public interface ReadWriteLock {
    Lock readLock();
    Lock writeLock();
}
```

在读锁和写锁之间可以采用多种实现方式：

- 释放优先：写锁释放时，等待队列同时存在读线程和写线程，那么选择读线程、写线程还是最先发出请求的线程？
- 读线程插队：锁由读线程持有，但有写线程等待，新到的读线程能否获得访问权，还是在写线程后面等待？如果允许读线程插队，能提高并发性但是可能造成线程饥饿
- 重入性：读锁和写锁是否可重入？
- 降级：写线程能否在不释放该锁的请求下获得读取锁？
- 升级：读锁能否优于其他读写线程升级为一个写锁？大多数读写锁实现不支持，因为会造成死锁。

对于以上问题，ReentrantReadWriteLock作为一种读写锁实现给出的答案：

- 读锁和写锁都是可重入的
- 实现公平策略时，等待时间最长的线程优先获得锁，如果这个锁由读线程持有而另一个线程请求写锁，其他读线程被阻塞直到写线程使用完并释放写锁
- 实现非公平策略时，线程获取访问顺序不确定
- 写锁降级为读锁可以，但升级不可以

如下所示的ReadWriteMap通过ReentrantReadWriteLock对Map进行包装，从而让它能在多个线程之间被安全地共享。

```java
public class ReadWriteMap <K,V> {
    private final Map<K, V> map;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock r = lock.readLock();
    private final Lock w = lock.writeLock();

    public ReadWriteMap(Map<K, V> map) {
        this.map = map;
    }
    // ... remove等修改方法和put方法类似
    public V put(K key, V value) {
        w.lock();
        try {
            return map.put(key, value);
        } finally {
            w.unlock();
        }
    }
    // ...其他读取方法类似
    public V get(Object key) {
        r.lock();
        try {
            return map.get(key);
        } finally {
            r.unlock();
        }
    }
}
```

## 总结

- 只有在synchronized无法满足需求时，才应该使用ReentrantLock
- 读写锁在读操作为主时能提供程序可伸缩性
