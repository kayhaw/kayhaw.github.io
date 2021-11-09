---
layout: article
title: 取消与关闭
permalink: /java-concurrency-in-practice/chap07
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第七章读书笔记
:::

第6章介绍了任务的创建和启动，绝大多数情况下任务会一直运行到结束。然而，有些时候希望提前结束任务(用户点击取消、应用程序被关闭)，一个行为良好的程序应该能够完善地处理这些失败、关闭和取消等操作，本章讨论如何实现。

## 任务取消

**可取消的(Cancellable)**：外部代码能够在某个操作正常完成前将其置为“完成”状态。取消操作的原因：

- 用户请求：用户点击取消按钮
- 时间限制：超时后取消运行任务
- 程序事件：子任务找到答案，取消其他任务
- 程序错误：爬虫任务遇到磁盘已满，取消其他任务
- 程序关闭

Java并没有提供安全的抢占方法来停止线程(stop、suspend存在问题)，但存在一些协作式机制来取消线程，例如使用volatile变量作为“已请求取消”的标志：

```java
public class PrimeGenerator implements Runnable {
    private static ExecutorService exec = Executors.newCachedThreadPool();
    private final List<BigInteger> primes = new ArrayList<BigInteger>();
    private volatile boolean cancelled;

    public void run() {
        BigInteger p = BigInteger.ONE;
        while (!cancelled) {
            p = p.nextProbablePrime();
            synchronized (this) {
                primes.add(p);
            }
        }
    }

    public void cancel() { cancelled = true; }

    public synchronized List<BigInteger> get() {
        return new ArrayList<BigInteger>(primes);
    }

    static List<BigInteger> aSecondOfPrimes() throws InterruptedException {
        PrimeGenerator generator = new PrimeGenerator();
        exec.execute(generator);
        try {
            SECONDS.sleep(1);
        } finally {
            generator.cancel();
        }
        return generator.get();
    }
}
```

PrimeGenerator是一个素数生成，通过cancelled标志确定是否继续生成下一个素数。aSecondOfPrimes方法提交任务，并在执行1秒后取消。

:::tip 取消策略
一个任务必须拥有取消策略：详细定义取消操作的How、What、When要素，即其他代码怎么(how)取消该任务
:::

### 中断

简单地使用volatile作为取消标志也存在问题，如下代码所示：

```java
class BrokenPrimeProducer extends Thread {
    private final BlockingQueue<BigInteger> queue;
    private volatile boolean cancelled = false;

    BrokenPrimeProducer(BlockingQueue<BigInteger> queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            BigInteger p = BigInteger.ONE;
            while (!cancelled)
                queue.put(p = p.nextProbablePrime());
        } catch (InterruptedException consumed) {
        }
    }

    public void cancel() {
        cancelled = true;
    }
}
```

当生产者在put方法中阻塞时，消费者调用cancel方法，但此时生产者永远无法检测到cancelled标志为false。此时，可以选择中断来实现取消操作：

```java
public class PrimeProducer extends Thread {
    private final BlockingQueue<BigInteger> queue;

    PrimeProducer(BlockingQueue<BigInteger> queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            BigInteger p = BigInteger.ONE;
            while (!Thread.currentThread().isInterrupted())
                queue.put(p = p.nextProbablePrime());
        } catch (InterruptedException consumed) {
            /* Allow thread to exit */
        }
    }
    // 将interrupt方法封装在cancel中
    public void cancel() { interrupt(); }
}
```

线程中断是一种协作机制，它通知线程在合适情况下停止当前工作，Thread类提供了如下三种方法：

1. public void interrupt()：中断目标线程
2. public boolean isInterrupted()：返回目标线程中断状态
3. public static boolean interrupted()：清除当前线程中断状态(设置为false)并返回之前的状态，这是清除中断状态的唯一方法

调用interrupt方法并不是意味着立即停止运行线程，只是传递中断请求消息。设计良好的方法应该对中断请求进行处理，设计糟糕的方法忽略中断请求，导致其他代码无法对中断请求进行响应。

:::tip
通常，中断是实现取消的最合理方式
:::

### 中断策略

任务应该包含取消策略，那对应线程也要包含中断策略。合理的中断策略是尽快退出，在必要时进行清理，通知某个线程所有者已经退出。任务不会在自己拥有的线程中运行，应该小心地保存中断状态，这样拥有线程的代码才能响应中断。检查到中断请求后，任务不需要立即放弃所有操作，可以在完成当前任务后抛出InterruptedException，并且调用Thread.currentThread().interrupt()方法恢复中断状态。

:::caution
每个线程有各自的中断策略，别轻易中断线程
:::

### 响应中断

处理中断有两种方式：

1. 传递中断异常：在方法签名上加上throws InterruptedException，自己什么都不处理
2. 恢复中断状态：try-catch捕获InterruptedException后，重新调用Thread.currentThread().interrupt()

对于使用Runnable定义的任务，方式1不可行，只能通过方式2，例如：

```java
public class NoncancelableTask {
    public Task getNextTask(BlockingQueue<Task> queue) {
        boolean interrupted = false;
        try {
            while (true) {
                try {
                    return queue.take();
                } catch (InterruptedException e) {
                    interrupted = true;
                    // 重新尝试
                }
            }
        } finally {
            if (interrupted)
                Thread.currentThread().interrupt();
        }
    }
}
```
