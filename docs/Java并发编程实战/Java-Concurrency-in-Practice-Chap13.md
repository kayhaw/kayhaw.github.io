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
