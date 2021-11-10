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

### 示例：计时运行

回顾PrimeGenerator的代码，静态方法aSecondOfPrimes启动一个PrimeGenertor线程，运行1秒后停止，该代码存在的问题是PrimeGenerator运行抛出的异常会被忽略。为了解决异常未捕获的问题，如下代码给出了在指定时间内运行任意一个runnable的示例：

```java
public class TimedRun1 {
    private static final ScheduledExecutorService cancelExec = Executors.newScheduledThreadPool(1);

    public static void timedRun(Runnable r, long timeout, TimeUnit unit) {
        final Thread taskThread = Thread.currentThread();
        // 设置一个取消定时任务
        cancelExec.schedule(new Runnable() {
            public void run() {
                taskThread.interrupt();
            }
        }, timeout, unit);
        r.run();
    }
}
```

该示例直接执行任务r，并设置了一个取消任务，该取消任务在指定时间后中断任务执行。在满足定时运行的要求，任务抛出的异常可以被timedRun方法捕获。这种方法十分简单，但是破坏了规则：**在中断线程前，应该了解它的中断策略**。如果r.run()在timeout前就完成，那么取消任务将会在timedRun返回之后触发，这种行为的后果是未知的(尽管用schedule方法返回的ScheduleFuture来取消任务，但是过于复杂)。并且如果r不响应中断，那timedRun在r结束后返回，此时可能已经超时或者为超时，没有达到限时执行的要求。

如下代码解决了aSecondOfPrimes的异常处理问题和TimedRun1的问题。执行任务task不响应中断，并将其可能遇到的异常保存在t中，timedRun执行限时的task.join(timeout)方法，因此主线程会定时阻塞到task结束，这里有两种情况：

1. task在timeout内结束(正常、异常)，通过rethrow方法重新抛出可能遇到的异常
2. task在timeout内还未结束，此时由cancelExec调用task.interrupt()来使其退出

该方案存在的问题：主线程执行task.rethrow()时，不能确定task是正常退出而返回还是因为join超时而返回。

```java
public class TimedRun2 {
    private static final ScheduledExecutorService cancelExec = newScheduledThreadPool(1);

    public static void timedRun(final Runnable r, long timeout, TimeUnit unit) 
    throws InterruptedException {
        class RethrowableTask implements Runnable {
            private volatile Throwable t;

            public void run() {
                try {
                    r.run();
                } catch (Throwable t) {
                    this.t = t;
                }
            }

            void rethrow() {
                if (t != null)
                    throw launderThrowable(t);
            }
        }

        RethrowableTask task = new RethrowableTask();
        final Thread taskThread = new Thread(task);
        taskThread.start();
        cancelExec.schedule(new Runnable() {
            public void run() {
                taskThread.interrupt();
            }
        }, timeout, unit);
        taskThread.join(unit.toMillis(timeout));
        task.rethrow();
    }
}
```

### 通过Future来实现取消

实际上Future已经提供了取消任务的方法cancel，通过Future来取消任务的示例代码如下所示：

```java
public class TimedRun {
    private static final ExecutorService taskExec = Executors.newCachedThreadPool();

    public static void timedRun(Runnable r, long timeout, TimeUnit unit)
            throws InterruptedException {
        Future<?> task = taskExec.submit(r);
        try {
            task.get(timeout, unit);
        } catch (TimeoutException e) {
            // 运行超时，到finally块执行任务取消
        } catch (ExecutionException e) {
            // 运行未超时中遇到异常，重新抛出异常
            throw launderThrowable(e.getCause());
        } finally {
            // 调用cancel，即使任务已经结束也不会有任务影响
            // 如果任务还在运行，将会被中断
            task.cancel(true);
        }
    }
}
```

cancel方法接受boolean类型参数mayInterruptIfRunning，为true表示中断正在运行的线程，为false表示不要执行还未运行的线程。

:::tip
当Future.get()抛出InterruptedException或者TimeoutException时，若不再需要结果可以调用Future.cancel来取消任务
:::

### 处理不可中断的阻塞

在Java库中，许多可阻塞的方法都是通过提前返回或者抛出InterruptedException来响应中断请求，但是也存在不可响应中断的阻塞方法：

- Java.io包中的同步Socket IO
- Java.io包中的同步IO
- Selector的异步IO
- 获取某个锁

如下代码给出如何封装非标准的取消操作，ReaderThread重写了Thread.interrupt()方法，通过关闭socket来使得执行read或者write的方法抛出SocketException。

```java
public class ReaderThread extends Thread {
    private static final int BUFSZ = 512;
    private final Socket socket;
    private final InputStream in;

    public ReaderThread(Socket socket) throws IOException {
        this.socket = socket;
        this.in = socket.getInputStream();
    }

    public void interrupt() {
        try {
            socket.close();
        } catch (IOException ignored) {
        } finally {
            super.interrupt();
        }
    }

    public void run() {
        try {
            byte[] buf = new byte[BUFSZ];
            while (true) {
                int count = in.read(buf);
                if (count < 0)
                    break;
                else if (count > 0)
                    processBuffer(buf, count);
            }
        } catch (IOException e) { /* Allow thread to exit */ }
    }

    public void processBuffer(byte[] buf, int count) {}
}
```

:::tip
重写线程的interrupt方法，关闭IO流使阻塞方法抛出异常，同时调用super.interrupt方法保证原来的中断逻辑。
:::

### 用newTaskFor来封装非标准的取消

还可以通过重写newTaskFor来进一步封装上面的非标准取消代码。当把一个Callable通过submit方法提交给ExecutorService时，submit方法通过调用newTaskFor方法得到一个Future(提供取消方法cancel)，并将其返回。因此，可以通过定制Future改变Future.cancel的行为，代码如下所示：

<details>
<summary>通过newTaskFor封装非标准的取消操作</summary>

```java
public abstract class SocketUsingTask <T> implements CancellableTask<T> {
    private Socket socket;

    protected synchronized void setSocket(Socket s) { socket = s; }

    public synchronized void cancel() {
        try {
            if (socket != null)
                socket.close();
        } catch (IOException ignored) {
        }
    }

    public RunnableFuture<T> newTask() {
        return new FutureTask<T>(this) {
            public boolean cancel(boolean mayInterruptIfRunning) {
                try {
                    SocketUsingTask.this.cancel();
                } finally {
                    return super.cancel(mayInterruptIfRunning);
                }
            }
        };
    }
}

interface CancellableTask <T> extends Callable<T> {
    void cancel();
    RunnableFuture<T> newTask();
}

class CancellingExecutor extends ThreadPoolExecutor {
    public CancellingExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
    }

    public CancellingExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, threadFactory);
    }

    public CancellingExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, RejectedExecutionHandler handler) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, handler);
    }

    public CancellingExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, threadFactory, handler);
    }

    protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
        if (callable instanceof CancellableTask)
            return ((CancellableTask<T>) callable).newTask();
        else
            return super.newTaskFor(callable);
    }
}
```

</details>

SocketUsingTask实现了CancellableTask接口，并重写了Future.cancel方法来关闭socket和调用super.cancel。通过调用SocketUsingTask的cancel方法同时关闭底层socket并且中断线程。
