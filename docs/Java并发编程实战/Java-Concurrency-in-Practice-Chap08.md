---
layout: article
title: 线程池的使用
permalink: /java-concurrency-in-practice/chap08
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第八章读书笔记
:::

介绍线程池配置和调优的高级选项，以及使用时需要注意的地方

## 在任务与执行策略之间的隐性耦合

Executor框架将任务的提交与执行策略解耦，但是并非所有任务都能适用所有的执行策略，以下类型任务需要明确地指定执行策略：

- 依赖性任务：当提交任务依赖其他任务时，给执行策略带来了隐含的限制
- 使用线程封闭的任务：使用线程封闭的任务要求Executor是单线程，否则会失去线程安全性
- 响应时间敏感的任务：如GUI程序
- 使用ThreadLocal的任务：只有当线程本地值生命周期受限于任务生命周期，使用ThreadLocal才有意义，而在线程池中的线程不符合这点

### 线程饥饿死锁

当线程池中的任务需要无限期地等待池中其他等待任务提供的资源时，将发生线程饥饿死锁(Thread Starvation Deadlock)，如下所示代码是一个示例：

```java
public class ThreadDeadlock {
    ExecutorService exec = Executors.newSingleThreadExecutor();

    public class RenderPageTask implements Callable<String> {
        public String call() throws Exception {
            Future<String> header, footer;
            header = exec.submit(new LoadFileTask("header.html"));
            footer = exec.submit(new LoadFileTask("footer.html"));
            String page = renderBody();
            // Will deadlock -- task waiting for result of subtask
            return header.get() + page + footer.get();
        }
    }
}
```

当使用单线程的Executor会导致ThreadDeadlock发生死锁，类似地，当线程池不够大，通过栅栏机制协同的任务也会出现死锁。除了显式的线程池大小导致死锁，还可能存在其他资源约束隐式地导致死锁，比入JDBC连接池值包含10个连接，此时线程池大小也表现得限于10，因为其他线程需要获得JDBC连接。

### 运行时间较长的任务

如果线程池大小远小于在稳定状态下执行时间较长的任务数量，最后可能所有线程都运行这些耗时长的任务，影响总体的响应性。一种缓解方式是限定等待资源的时间，等待超时后可以终止任务或者重新放回队列。当线程池总是充满被阻塞的线程时，也可能是线程池规模过小。

## 设置线程池

线程池大小不能在代码中固定，应该由配置机制来提供，或者根据CPU数量来动态计算。对于计算密集型任务，通常设置线程池大小为$N_{cpu}+1$，对于IO密集型任务，给出如下定义：

- $N_{cpu}$：CPU数量
- $U_{cpu}$：目标CPU利用率
- $\frac{W}{C}$：等待时间/计算时间

要达到目标利用率，线程池的大小应设置为：$$N_{threads}=N_{cpu}*U_{cpu}*(1+\frac{W}{C})$$，其中CPU数量可以通过`Runtime.getRuntime().availableProcessors()`得到。CPU周期并不影响线程池大小的唯一因素，例如上节提到的JDB连接池。

## 配置ThreadPoolExecutor

ThreadPoolExecutor构造器提供了7个参数，通过这些参数来定制化ThreadPoolExecutor：

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

### 线程的创建与销毁

基本大小(corePoolSize)是线程池在没有任务执行时的大小，最大大小(maximumPoolSize)是同时活动线程数量的上限。如果某个线程的空闲时间超过keepAliveTime，它将被标记为可回收的，并且线程大小超过基本大小时，线程将会被终止。线程池各个工厂方法配置的策略：

- newFixedThreadPool：基本大小=最大大小=传入参数值，keepAliveTime=0，无界队列
- newCachedThreadPool：基本大小=0，最大大小=Integer.MAX_VALUE，超时时间=60s，SynchronousQueue
- newSingleThreadPool：基本大小=最大大小=1，keepAliveTime=0，无界队列
- newScheduledThreadPool：基本大小=给定值，最大大小=Integer.MAX_VALUE，keepAliveTime=0，DelayedWorkQueue

### 管理队列任务

线程池通过阻塞队列workQueue保存等待执行的任务，可分为3类：无界队列、有界队列和同步移交(synchronous handoff)。newFixedThreadPool和newSingleThreadExecutor默认使用大小为Integer.MAX_VALUE的LinkedBlockingQueue(无界队列)，为了避免资源耗尽，应该使用有界队列(ArrayBlockingQueue、有界LinkedBlockingQueue、PriorityBlockingQueue)，并且注意队列大小和线程池大小同时调节。

对于非常大或者无界的线程池，使用SynchronousQueue来避免任务排队，它并不是真正的队列，而是一种在线程之间移交的机制。只有当线程池是无界的或者可以拒绝任务时，SynchronousQueue才有价值，在newCachedThreadPool就使用到了它。

:::caution
只有当线程互相独立时，为线程池或工作队列设置界限才是合理的，否则会出现线程饥饿死锁问题
:::

### 饱和策略

当有界队列被填满后，由饱和策略handler来处理提交线程。Java类库实现的饱和策略有：

1. AbortPolicy：拒绝任务，抛出未检查的RejectedException
2. DiscardPolicy：悄咪咪地抛弃任务
3. DiscardOldestPolicy：抛弃下一个将被执行任务，然后重新提交新任务，避免和优先级队列一同使用
4. CallerRunsPolicy：将任务回退给调用者
