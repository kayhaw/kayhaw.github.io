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

除了使用现有的饱和策略外，还可以通过Semaphore来限制任务的提交，如下代码所示：

```java
public class BoundedExecutor {
    private final Executor exec;
    private final Semaphore semaphore;

    public BoundedExecutor(Executor exec, int bound) {
        this.exec = exec;
        this.semaphore = new Semaphore(bound);
    }

    public void submitTask(final Runnable command)
            throws InterruptedException {
        semaphore.acquire();
        try {
            exec.execute(new Runnable() {
                public void run() {
                    try {
                        command.run();
                    } finally {
                        semaphore.release();
                    }
                }
            });
        } catch (RejectedExecutionException e) {
            semaphore.release();
        }
    }
}
```

BoundExecutor使用无界队列，并设置信号量上界为线程池大小加上可排队任务数量。

### 线程工厂

线程池通过线程工厂来创建线程，Executors指定的DefaultThreadFactory实现了ThreadFactory接口，它返回一个新的非守护线程，并没有包含其他特殊配置。

```java
// 线程工厂接口定义
public interface ThreadFactory {
    Thread newThread(Runnable r);
}
// Executors的静态内部类DefaultThreadFactory
static class DefaultThreadFactory implements ThreadFactory {
    private static final AtomicInteger poolNumber = new AtomicInteger(1);
    private final ThreadGroup group;
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    private final String namePrefix;

    DefaultThreadFactory() {
        SecurityManager s = System.getSecurityManager();
        group = (s != null) ? s.getThreadGroup() :
                                Thread.currentThread().getThreadGroup();
        namePrefix = "pool-" +
                        poolNumber.getAndIncrement() +
                        "-thread-";
    }

    public Thread newThread(Runnable r) {
        Thread t = new Thread(group, r,
                                namePrefix + threadNumber.getAndIncrement(),
                                0);
        if (t.isDaemon())
            t.setDaemon(false);
        if (t.getPriority() != Thread.NORM_PRIORITY)
            t.setPriority(Thread.NORM_PRIORITY);
        return t;
    }
}
```

在许多情况下需要定制线程工厂，比如：定制UncaughtExceptionHandler、设置优先级、设置线程名称等。如下所示代码给出了一个示例：

```java
public class MyThreadFactory implements ThreadFactory {
    private final String poolName;

    public MyThreadFactory(String poolName) { this.poolName = poolName; }

    public Thread newThread(Runnable runnable) { return new MyAppThread(runnable, poolName);}
}

public class MyAppThread extends Thread {
    public static final String DEFAULT_NAME = "MyAppThread";
    private static volatile boolean debugLifecycle = false;
    private static final AtomicInteger created = new AtomicInteger();
    private static final AtomicInteger alive = new AtomicInteger();
    private static final Logger log = Logger.getAnonymousLogger();

    public MyAppThread(Runnable r) {
        this(r, DEFAULT_NAME);
    }

    public MyAppThread(Runnable runnable, String name) {
        super(runnable, name + "-" + created.incrementAndGet());
        setUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
            public void uncaughtException(Thread t, Throwable e) {
                log.log(Level.SEVERE, "UNCAUGHT in thread " + t.getName(), e);
            }
        });
    }

    public void run() {
        // Copy debug flag to ensure consistent value throughout.
        boolean debug = debugLifecycle;
        if (debug) log.log(Level.FINE, "Created " + getName());
        try {
            alive.incrementAndGet();
            super.run();
        } finally {
            alive.decrementAndGet();
            if (debug) log.log(Level.FINE, "Exiting " + getName());
        }
    }
    // ... 一些getter和setter
}
```

MyAppThread可以定制线程名称便于区分，维护创建线程、存活线程个数等统计信息。此外，若需要利用安全策略控制对代码库的访问权限，还可以通过Executors的PrivilegedThreadFactory来定制线程工厂。

### 构造后定制ThreadPoolExecutor

在调用完ThreadPoolExecutor构造函数后，仍可以通过setter修改构造参数值。除了newSingleThreadExecutor外，Executors的其他工厂方法都可以将返回对象转为ThreadPoolExecutor来修改配置：

```java
ExecutorService exec = Executors.newCachedThreadPool();
if(exec instanceof ThreadPoolExecutor)
    ((ThreadPoolExecutor) exec).setCorePoolSize(10);
else
    throw new AssertionError("Oops, bad assumption");
```

Executors还提供静态方法unconfigurableExecutorService，将ExecutorService包装成不可修改配置的DelegatedExecutorService。由于newSingleThreadExecutor返回的DelegatedScheduledExecutorService对象继承于DelegatedExecutorService，因此它是不可修改的。

## 扩展ThreadPoolExecutor

ThreadPoolExecutor的扩展通过在子类重写beforeExecute、afterExecute和terminated实现。如果任务执行完成或者抛出异常，afterExecute仍会执行(任务抛出错误除外)，当beforeExecute执行抛出RuntimeException，则任务和afterExecute都不会执行。线程池完成关闭后调用terminated方法，即所有任务完成并且工作线程已经关闭后，terminated方法可以用于释放Executor中分配的资源。

如下所示代码通过自定义线程池，添加日志记录和统计信息收集。beforeExecute方法将任务开始时间保存在ThreadLocal中，由afterExecute方法读取来计算任务运行时间，并通过AtomicLong来统计已处理任务和总处理时间：

```java
public class TimingThreadPool extends ThreadPoolExecutor {

    public TimingThreadPool() {
        super(1, 1, 0L, TimeUnit.SECONDS, null);
    }

    private final ThreadLocal<Long> startTime = new ThreadLocal<Long>();
    private final Logger log = Logger.getLogger("TimingThreadPool");
    private final AtomicLong numTasks = new AtomicLong();
    private final AtomicLong totalTime = new AtomicLong();

    protected void beforeExecute(Thread t, Runnable r) {
        super.beforeExecute(t, r);
        log.fine(String.format("Thread %s: start %s", t, r));
        startTime.set(System.nanoTime());
    }

    protected void afterExecute(Runnable r, Throwable t) {
        try {
            long endTime = System.nanoTime();
            long taskTime = endTime - startTime.get();
            numTasks.incrementAndGet();
            totalTime.addAndGet(taskTime);
            log.fine(String.format("Thread %s: end %s, time=%dns",
                    t, r, taskTime));
        } finally {
            super.afterExecute(r, t);
        }
    }

    protected void terminated() {
        try {
            log.info(String.format("Terminated: avg time=%dns",
                    totalTime.get() / numTasks.get()));
        } finally {
            super.terminated();
        }
    }
}
```

## 递归算法的并行化

当串行循环中的各个迭代操作之间彼此**独立**，并且每个迭代操作工作量大于管理新任务的，此时该串行循环就适合并行化，例如第6章中的Renderer。在一些递归设计中同样可以使用相同方法，如下代码所示：

```java
public <T> void sequentialRecursive(List<Node<T>> nodes,
                                        Collection<T> results) {
    for (Node<T> n : nodes) {
        results.add(n.compute());
        sequentialRecursive(n.getChildren(), results);
    }
}

public <T> void parallelRecursive(final Executor exec,
                                    List<Node<T>> nodes,
                                    final Collection<T> results) {
    for (final Node<T> n : nodes) {
        exec.execute(new Runnable() {
            public void run() {
                results.add(n.compute());
            }
        });
        parallelRecursive(exec, n.getChildren(), results);
    }
}
```

由于每个迭代操作不依赖后续递归迭代的结果，因此可以并行化。为了获取最终结果，通过shutdown、awaitTermination方法实现，代码如下所示：

```java
public <T> Collection<T> getParallelResults(List<Node<T>> nodes)
        throws InterruptedException {
    ExecutorService exec = Executors.newCachedThreadPool();
    Queue<T> resultQueue = new ConcurrentLinkedQueue<T>();
    parallelRecursive(exec, nodes, resultQueue);
    exec.shutdown();        // 发出关闭执行，并无限期等待所有任务结束
    exec.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS);
    return resultQueue;
}
```

### 示例：谜题框架

串行递归并行化的一项重要应用就是解决这样一些谜题：找出一系列操作从初始状态转换到目标状态。问题定义为：一个初始位置，一个目标位置以及判断是否有效移动的规则集(包含指定位置处的合法移动以及每次移动的结果位置)。以“搬箱子”

```java
public interface Puzzle <P, M> {
    P initialPosition();

    boolean isGoal(P position);

    Set<M> legalMoves(P position);

    P move(P position, M move);
}

public class PuzzleNode <P, M> {
    final P pos;
    final M move;
    final PuzzleNode<P, M> prev;

    public PuzzleNode(P pos, M move, PuzzleNode<P, M> prev) {
        this.pos = pos;
        this.move = move;
        this.prev = prev;
    }
    // 将之前所有移动操作作为列表返回
    List<M> asMoveList() {
        List<M> solution = new LinkedList<M>();
        for (PuzzleNode<P, M> n = this; n.move != null; n = n.prev)
            solution.add(0, n.move);
        return solution;
    }
}
```

以下search方法给出谜题框架的串行化解决方案，它通过深度优先搜索找到解决方案(不一定是最优方案)。

```java
public class SequentialPuzzleSolver <P, M> {
    private final Puzzle<P, M> puzzle;
    private final Set<P> seen = new HashSet<P>();

    public SequentialPuzzleSolver(Puzzle<P, M> puzzle) {
        this.puzzle = puzzle;
    }

    public List<M> solve() {
        P pos = puzzle.initialPosition();
        return search(new PuzzleNode<P, M>(pos, null, null));
    }

    private List<M> search(PuzzleNode<P, M> node) {
        if (!seen.contains(node.pos)) {
            seen.add(node.pos);
            if (puzzle.isGoal(node.pos))
                return node.asMoveList();
            for (M move : puzzle.legalMoves(node.pos)) {
                P pos = puzzle.move(node.pos, move);
                PuzzleNode<P, M> child = new PuzzleNode<P, M>(pos, move, node);
                List<M> result = search(child);
                if (result != null)
                    return result;
            }
        }
        return null;
    }
}
```

如下代码所示给出并发的谜题解答器。在串行版本中通过Set来保存已经搜索过的位置，避免无限循环，在并发版本中使用ConcurrentHashMap来替代，因为要确保Put-If-Absent操作线程安全性。

```java
public class ConcurrentPuzzleSolver <P, M> {
    private final Puzzle<P, M> puzzle;
    private final ExecutorService exec;
    private final ConcurrentMap<P, Boolean> seen;
    protected final ValueLatch<PuzzleNode<P, M>> solution = new ValueLatch<PuzzleNode<P, M>>();

    public ConcurrentPuzzleSolver(Puzzle<P, M> puzzle) {
        this.puzzle = puzzle;
        this.exec = initThreadPool();
        this.seen = new ConcurrentHashMap<P, Boolean>();
        if (exec instanceof ThreadPoolExecutor) {
            ThreadPoolExecutor tpe = (ThreadPoolExecutor) exec;
            tpe.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardPolicy());
        }
    }

    private ExecutorService initThreadPool() {
        return Executors.newCachedThreadPool();
    }

    public List<M> solve() throws InterruptedException {
        try {
            P p = puzzle.initialPosition();
            exec.execute(newTask(p, null, null));
            // getValue阻塞直到找到答案
            PuzzleNode<P, M> solnPuzzleNode = solution.getValue();
            return (solnPuzzleNode == null) ? null : solnPuzzleNode.asMoveList();
        } finally {
            // 某个线程找到答案后又getValue放行，此时可以关闭线程池
            exec.shutdown();
        }
    }

    protected Runnable newTask(P p, M m, PuzzleNode<P, M> n) {
        return new SolverTask(p, m, n);
    }

    protected class SolverTask extends PuzzleNode<P, M> implements Runnable {
        SolverTask(P pos, M move, PuzzleNode<P, M> prev) {
            super(pos, move, prev);
        }

        public void run() {
            if (solution.isSet()
                    || seen.putIfAbsent(pos, true) != null)
                return; // 找到答案或者遍历过该位置
            if (puzzle.isGoal(pos))
                solution.setValue(this);
            else
                for (M m : puzzle.legalMoves(pos))
                    exec.execute(newTask(puzzle.move(pos, m), m, this));
        }
    }
}
```

为了在找到一个答案后停止，实现带结果的闭锁ValueLatch，代码如下所示：

```java
public class ValueLatch <T> {
    private T value = null;
    private final CountDownLatch done = new CountDownLatch(1);

    public boolean isSet() {
        return (done.getCount() == 0);
    }
    // setValue是同步的，确保只有一个线程执行设置操作
    public synchronized void setValue(T newValue) {
        if (!isSet()) {
            value = newValue;
            done.countDown();
        }
    }

    public T getValue() throws InterruptedException {
        done.await();       // 主线程调用getValue会被阻塞
        synchronized (this) {
            return value;
        }
    }
}
```

在solve方法的finally块中，第一个找到答案的线程会关闭线程池，终止所有任务的同时也阻止新的任务被提交。为了避免处理RejectedExcutionException，将拒绝策略设置为抛弃已提交任务。而正在执行的任务都会失败使得Executor结束。

如果不存在答案，那么getSolution方法永远阻塞。为了处理这种情况，一种方式是记录活动任务数量，在该值为零时将答案设置为null，代码如下所示：

```java
public class PuzzleSolver <P,M> extends ConcurrentPuzzleSolver<P, M> {
    PuzzleSolver(Puzzle<P, M> puzzle) {
        super(puzzle);
    }

    private final AtomicInteger taskCount = new AtomicInteger(0);

    protected Runnable newTask(P p, M m, PuzzleNode<P, M> n) {
        return new CountingSolverTask(p, m, n);
    }

    class CountingSolverTask extends SolverTask {
        CountingSolverTask(P pos, M move, PuzzleNode<P, M> prev) {
            super(pos, move, prev);
            taskCount.incrementAndGet();
        }

        public void run() {
            try {
                super.run();
            } finally {
                if (taskCount.decrementAndGet() == 0)
                    solution.setValue(null);
            }
        }
    }
}
```

除此之外，计算时间可能很长，此时可以加上时间限制：在ValueLatch中实现一个限时的getValue(即使用限时版本的await方法)，当getValue超时，那么关闭线程池并抛出异常。还可以基于其他策略关闭线程池，比如只搜索特定数量的位置。

## 总结

1. ThreadPoolExecutor参数设置(构造前参数指定，构造后setXxx)
2. 定制化线程工厂
3. beforeExecute、afterExecute、terminated方法扩展ThreadPoolExecutor
4. 递归算法并行化的代码实现