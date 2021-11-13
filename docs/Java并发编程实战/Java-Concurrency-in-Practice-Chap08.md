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
