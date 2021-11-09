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

## 找出可利用的并行性

使用Executor需要将任务抽象为一个Runnable，然而并非所有任务边界都是显而易见，本节以一个渲染页面的程序为例展开讨论。该程序的功能是将HTML页面绘制到图像缓存中，假设HTML只包含标签本文、预定义大小的图片和URL。

### 示例：串行的页面渲染器

一种串行处理的方式是先绘制文本元素，期间为图片留出空间，处理完文本后下载图片再绘制，代码如下所示：

```java
public class SingleThreadRenderer {
    void renderPage(CharSequence source) {
        renderText(source);
        List<ImageData> imageData = new ArrayList<ImageData>();
        for (ImageInfo imageInfo : scanForImageInfo(source))
            imageData.add(imageInfo.downloadImage());
        for (ImageData data : imageData)
            renderImage(data);
    }
}
```

串行处理的缺点在于下载图片时都在等待IO操作完成，CPU几乎未工作。为了获得更高的CPU利用率，应该将问题拆分为多个独立任务并发执行。

### 携带任务结果Callable与Future

相比于Runnable表示没有返回值的计算，Callable接口表示有返回值并且会抛出异常的计算(**Callable\<Void\>表示无返回值**)，而Future表示一个任务的生命周期，两者接口定义如下所示：

```java
public interface Callable<V> {
    V call() throws Exception;
}

public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCanceled();
    boolean isDone();
    V get() throws InterruptException, ExecutionException, CancelationException;
    V get(long timeout, TimeUnit unit) throws InterruptException, ExecutionException, CancelationException;
}
```

get方法行为取决于任务状态：

- 任务完成，立即返回结果或者异常
- 任务未完成，阻塞直到任务完成
- 任务抛出异常，get将异常封装为ExecutionException重新抛出
- 任务被取消，get抛出CancelationException异常

ExecutorService接口的所有submit方法接收一个Callable/Runnable并返回一个Future，如下代码所示，ExecutorService使用newTaskFor生成Future对象，默认是FutureTask对象。

```java
// 为指定返回结果的Runnable生成FutureTask
protected <T> RunnableFuture<T> newTaskFor(Runnable runnable, T value) {
    return new FutureTask<T>(runnable, value);
}
// 为Callable生成FutureTask
protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
    return new FutureTask<T>(callable);
}
// 提交Runnable任务
public Future<?> submit(Runnable task) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<Void> ftask = newTaskFor(task, null);
    execute(ftask);
    return ftask;
}
// 提交指定返回值的Runnable任务
public <T> Future<T> submit(Runnable task, T result) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<T> ftask = newTaskFor(task, result);
    execute(ftask);
    return ftask;
}
// 提交Callable任务
public <T> Future<T> submit(Callable<T> task) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<T> ftask = newTaskFor(task);
    execute(ftask);
    return ftask;
}
```

### 示例：使用Future实现页面渲染器

基于Future和Callable，将文本渲染和图片下载分为两个子任务，实现代码如下：

```java
public abstract class FutureRenderer {
    private final ExecutorService executor = Executors.newCachedThreadPool();

    void renderPage(CharSequence source) {
        final List<ImageInfo> imageInfos = scanForImageInfo(source);
        Callable<List<ImageData>> task =
                new Callable<List<ImageData>>() {
                    public List<ImageData> call() {
                        List<ImageData> result = new ArrayList<ImageData>();
                        for (ImageInfo imageInfo : imageInfos)
                            result.add(imageInfo.downloadImage());
                        return result;
                    }
                };

        Future<List<ImageData>> future = executor.submit(task);
        renderText(source);

        try {
            List<ImageData> imageData = future.get();
            for (ImageData data : imageData)
                renderImage(data);
        } catch (InterruptedException e) {
            // Re-assert the thread's interrupted status
            Thread.currentThread().interrupt();
            // We don't need the result, so cancel the task too
            future.cancel(true);
        } catch (ExecutionException e) {
            throw launderThrowable(e.getCause());
        }
    }
}
```

### 在异构任务并行化中存在的局限

通过对异构任务进行并行化获得的性能提升是有限的：

1. 异构任务不能均匀分配给线程
2. 任务负载不同，导致提升不显著
3. 分解任务需要开销

:::tip
只有当**大量互相独立且同构**的任务可以并发处理时，才能体现出将程序负载分配到多个任务中带来的性能提升
:::

### CompletionService:Executor与BlockingQueue

当向Executor提交了**一组**计算任务后，为了获得结果，一种做法是保存每个任务的Future，然后反复调用get方法，将timeout参数设置为0，轮询判断任务是否完成，一种更好的方案是用CompletionService。

CompletionService接口融合了Executor和BlockingQueue，提交Callable任务后使用take和poll操作来获取结果，ExecutorCompletionService实现了CompletionService。

### 示例：使用CompletionService实现页面渲染器

通过CompletionService，为每张图片的下载创建一个独立任务，从而将之前多张图片的串行下载改为并行的。之后，使用take方法让每张图片在下载完毕后立即能够渲染出来，进一步减少了响应时间：

```java
public abstract class Renderer {
    private final ExecutorService executor;

    Renderer(ExecutorService executor) {
        this.executor = executor;
    }

    void renderPage(CharSequence source) {
        final List<ImageInfo> info = scanForImageInfo(source);
        CompletionService<ImageData> completionService =
                new ExecutorCompletionService<ImageData>(executor);
        for (final ImageInfo imageInfo : info)
            completionService.submit(new Callable<ImageData>() {
                public ImageData call() {
                    return imageInfo.downloadImage();
                }
            });

        renderText(source);

        try {
            for (int t = 0, n = info.size(); t < n; t++) {
                Future<ImageData> f = completionService.take();
                ImageData imageData = f.get();
                renderImage(imageData);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (ExecutionException e) {
            throw launderThrowable(e.getCause());
        }
    }
}
```

此外，多个ExecutorCompletionService可以共享一个Executor，因此可以创建一个对特定计算私有，又能共享一个功能Executor的ExecutorCompletionService。此时ExecutorCompletionService相当于一组计算的句柄，可以通过记录提交任务数获得已完成任务数。

### 为任务设置时限

有些时候任务可能无法完成，此时不再需要结果，比如网站加载广告过慢就显示一个默认的，可以通过带有指定超时时间的get方法实现：

```java
public class RenderWithTimeBudget {
    private static final Ad DEFAULT_AD = new Ad();
    private static final long TIME_BUDGET = 1000;
    private static final ExecutorService exec = Executors.newCachedThreadPool();

    Page renderPageWithAd() throws InterruptedException {
        long endNanos = System.nanoTime() + TIME_BUDGET;
        Future<Ad> f = exec.submit(new FetchAdTask());
        // Render the page while waiting for the ad
        Page page = renderPageBody();
        Ad ad;
        try {
            // Only wait for the remaining time budget
            long timeLeft = endNanos - System.nanoTime();
            ad = f.get(timeLeft, NANOSECONDS);
        } catch (ExecutionException e) {
            ad = DEFAULT_AD;
        } catch (TimeoutException e) {
            ad = DEFAULT_AD;
            f.cancel(true);
        }
        page.setAd(ad);
        return page;
    }
}
```

### 示例：旅行预订门户网站

假设有一个旅行预订门户网站，用户输入日期和其他要求，网站给出多条航线、旅店等服务商的报价。可以将获取一个公司的报价视为一个任务，将n个任务提交到线程池获得n个Future，然后使用限时的get方法串行获取结果。这种思路很简单，但还可以使用更简单的invokeAll方法：

```java
public class TimeBudget {
    private static ExecutorService exec = Executors.newCachedThreadPool();

    public List<TravelQuote> getRankedTravelQuotes(TravelInfo travelInfo, Set<TravelCompany> companies,
                                                   Comparator<TravelQuote> ranking, long time, TimeUnit unit)
            throws InterruptedException {
        List<QuoteTask> tasks = new ArrayList<QuoteTask>();
        for (TravelCompany company : companies)
            tasks.add(new QuoteTask(company, travelInfo));

        List<Future<TravelQuote>> futures = exec.invokeAll(tasks, time, unit);

        List<TravelQuote> quotes =
                new ArrayList<TravelQuote>(tasks.size());
        Iterator<QuoteTask> taskIter = tasks.iterator();
        for (Future<TravelQuote> f : futures) {
            QuoteTask task = taskIter.next();
            try {
                quotes.add(f.get());
            } catch (ExecutionException e) {
                quotes.add(task.getFailureQuote(e.getCause()));
            } catch (CancellationException e) {
                quotes.add(task.getTimeoutQuote(e));
            }
        }

        Collections.sort(quotes, ranking);
        return quotes;
    }
}
```

invokeAll接收一组任务，并返回一组Future。所有任务执行完成、调用线程被中断、超过指定时限时invokeAll返回，超过时限后所有为完成任务将会取消，客户端通过get或者isCancelled来判断具体情况。

## 总结

- 将程序分解为独立同构的大量任务，使用并发才能真正提高程序性能
- 分解程序的第一步是找到任务的边界
- Executor框架的意义是将任务提交与执行策略解耦，当需要创建线程运行任务时可以考虑Executor