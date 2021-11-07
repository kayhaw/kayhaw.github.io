---
layout: article
title: 任务执行
permalink: /java-concurrency-in-practice/chap06
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第六章读书笔记
:::

并发应用程序围绕“任务执行”来构造，任务是抽象且**离散**的工作单元。把应用程序分解为多个任务，可以**简化结构，提供事务边界来优化错误恢复以及提供一种自然的并行结构来提升并发性**。

## 在线程中执行任务

首先需要确定任务边界，理想情况下各个任务之间是独立的：不依赖其它任务状态、结果或者边界效应。大多数服务器以独立的客户请求为边界。

### 串行地执行任务

一种简单的web服务器实现如下所示，它简单地在一个线程中处理请求：

```java
public class SingleThreadWebServer {
    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(80);
        while (true) {
            Socket connection = socket.accept();
            handleRequest(connection);
        }
    }

    private static void handleRequest(Socket connection) {
        // request-handling logic here
    }
}
```

这意味着所有请求都是串行地被执行，当处理请求动作包含IO时(实时上绝大多数请求都是)，CPU将处于空闲状态，大大降低了服务器资源利用率。

### 显示地为任务创建线程

如下代码通过为每个任务创建线程，从而实现更高的响应性：

```java
public class ThreadPerTaskWebServer {
    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(80);
        while (true) {
            final Socket connection = socket.accept();
            Runnable task = new Runnable() {
                public void run() {
                    handleRequest(connection);
                }
            };
            new Thread(task).start();
        }
    }

    private static void handleRequest(Socket connection) {
        // request-handling logic here
    }
}
```

正常情况下，这种方式能提升串行执行的性能，但问题在于它没有限制可创建线程的数量，请求速率过高时会出现如下问题：

1. 线程生命周期的开销非常高
2. 资源消耗：活跃线程消耗内存，空闲线程占用内存，此时再创建线程反而降低性能
3. 稳定性：可创建线程受JVM和底层操作系统限制，破坏限制会导致OOM异常

## Executor框架

JUC提供Executor框架作为线程池实现，简化了线程的管理，任务被抽象为Exector而不是Thread。

```java
public interface Executor{
    void execute(Runnable command);
}
```

Executor接口只有一个execute方法，但是其子接口和实现类还提供了生命周期支持、统计信息收集和性能监视等机制。Executor框架基于生产者-消费者模式，提供任务的线程相当于生产者，执行任务的线程相当于消费者。

### 示例：基于Executor的Web服务器

使用Executor来改写上述服务器程序代码如下所示，这里使用一种标准Executor实现，即固定长度的线程池：

```java
public class TaskExecutionWebServer {
    private static final int NTHREADS = 100;
    private static final Executor exec
            = Executors.newFixedThreadPool(NTHREADS);

    public static void main(String[] args) throws IOException {
        ServerSocket socket = new ServerSocket(80);
        while (true) {
            final Socket connection = socket.accept();
            Runnable task = new Runnable() {
                public void run() {
                    handleRequest(connection);
                }
            };
            exec.execute(task);
        }
    }

    private static void handleRequest(Socket connection) {
        // request-handling logic here
    }
}
```

通过Executor接口还可以实现前两种线程创建模式：

```java
public class ThreadPerTaskExecutor implements Executor {
    public void execute(Runnable r) {
        new Thread(r).start();
    };
}

public class WithinThreadExecutor implements Executor {
    public void execute(Runnable r) {
        r.run();
    };
}
```

### 执行策略

Executor框架将任务的提交与执行解耦，调用execute方法只是任务提交，实际执行策略由Exectuor确定。执行策略包含如下方面：

- 在什么线程中执行任务？
- 任务按照什么顺序执行(FIFO，LIFO，优先级)？
- 有多少个任务能并发执行？
- 在队列中有多少个任务在等待执行？
- 如果因为系统过载应该拒绝哪个任务的执行？如何通知应用程序任务被拒绝？
- 在执行任务前后应该执行哪些动作？

:::tip 线程池嗅觉
每当看到类似`new Thread(runnable).start()`代码，并且需要灵活执行策略时，考虑使用Executor框架
:::

### 线程池

线程池是管理一组同构工作线程的资源池，Executors提供的静态工厂方法创建执行策略不同的线程池，具体有：

1. newFixedThreadPool：固定长度的线程池
2. newCachedThreadPool：线程池规模超过处理需求时回收空闲线程，还不够再扩展新线程，不限制线程个数
3. newSingleThreadPool：只有一个线程执行，确保按照某种顺序(FIFO、LIFO、优先级)**串行**执行
4. newScheduledThreadPool：固定长度线程池，以延迟或者定时的方式执行任务

除了实现不同的执行策略外，**线程池还提供调用、管理、监视、日志、错误报告**等其他功能。

### Executor的生命周期

Executor的实现会创建线程来执行任务，而JVM只有在所有非守护线程结束后才退出，因此还需要提供关闭方法来结束Executor。为了解决执行任务的生命周期问题，ExecutorService接口扩展了Executor接口，提供了如下方法：

```java
public interface ExecutorService extends Executor {
    void shutdown();
    List<Runnable> shutdownNow();
    boolean isShutdown();
    boolean isTerminated();
    boolean awaitTermination(long timeout, TimeUnit unit);
    ... // 用于任务提交的方法
}
```

ExecutorService生命周期有3种：运行、关闭和已终止。shutdown方法执行温和的关闭策略：不再接收新任务，等待所有任务(运行、未运行)执行完成。shutdownNow方法执行激进的关闭策略：尝试取消所有运行中任务，不再启动未执行任务。ExecutorService关闭后，提交任务由拒绝执行处理器处理，它会抛弃任务，或者使execute方法抛出未检查的RejectedExecutionException异常。等所有任务结束后，ExecutorService进入终止状态。如下代码所示是加入声明周期管理的Web服务器，可以通过直接调用stop方法或者发送终止请求来关闭Web服务。

```java
public class LifecycleWebServer {
    private final ExecutorService exec = Executors.newCachedThreadPool();

    public void start() throws IOException {
        ServerSocket socket = new ServerSocket(80);
        while (!exec.isShutdown()) {
            try {
                final Socket conn = socket.accept();
                exec.execute(new Runnable() {
                    public void run() {
                        handleRequest(conn);
                    }
                });
            } catch (RejectedExecutionException e) {
                if (!exec.isShutdown())
                    log("task submission rejected", e);
            }
        }
    }

    public void stop() { exec.shutdown(); }

    void handleRequest(Socket connection) {
        Request req = readRequest(connection);
        if (isShutdownRequest(req))
            stop();
        else
            dispatchRequest(req);
    }
}
```

### 延迟任务与周期任务

尽管Java类库提供Timer类来管理延迟任务和定时任务，但实现相同功能应该使用ScheduledThreadPoolExecutor来代替。Timer类存在的问题：

- 基于绝对时间，对系统时钟变化敏感
- 执行所有定时任务只会创建一个线程，如果某个线程执行时间过长，将破坏其他线程的定时准确性
- 不会捕获未受检查的异常

由于这些问题，如下所示Timer代码会出现问题，程序并不会在6秒后退出，而是在运行1秒后就报错结束：

```java
public class OutOfTime {
    public static void main(String[] args) throws Exception {
        Timer timer = new Timer();
        timer.schedule(new ThrowTask(), 1);
        SECONDS.sleep(1);
        timer.schedule(new ThrowTask(), 1);
        SECONDS.sleep(5);
    }

    static class ThrowTask extends TimerTask {
        public void run() {
            throw new RuntimeException();
        }
    }
}
```