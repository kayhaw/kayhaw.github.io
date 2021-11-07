---
layout: article
title: 基础构建模块
permalink: /java-concurrency-in-practice/chap05
tags:
  - Java Concurrency
  - ReadingNotes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
《Java并发编程》第五章读书笔记
:::

上一章介绍构造线程安全类的一些技术，本章介绍Java类库提供的同步工具类，以及使用它们的常用模式。

## 同步容器类

早期同步容器类包括Vector和Hashtable，后续加入Collections.synchronizedXxx工厂方法提供的同步容器封装类。

### 同步容器类的问题

同步容器本身是线程安全的，但在它们身上进行的复合操作（迭代遍历、跳转以及条件运算）会出现问题，如下代码所示：

```java
public class UnsafeVectorHelpers {
    public static Object getLast(Vector list) {
        int lastIndex = list.size() - 1;
        return list.get(lastIndex);
    }

    public static void deleteLast(Vector list) {
        int lastIndex = list.size() - 1;
        list.remove(lastIndex);
    }
}
```

假设线程A调用getLast获取容器最后一个元素，线程B调用deleteLast删除容器最后一个元素。在某种特定的执行顺序下，可能出现A获取B删除的元素，导致getLast抛出索引越界异常。此时可以通过客户端加锁解决这个问题，代码如下所示，客户端加锁粒度过大，牺牲了伸缩性，降低了并发度。

```java
public class SafeVectorHelpers {
    public static Object getLast(Vector list) {
        synchronized (list) {
            int lastIndex = list.size() - 1;
            return list.get(lastIndex);
        }
    }

    public static void deleteLast(Vector list) {
        synchronized (list) {
            int lastIndex = list.size() - 1;
            list.remove(lastIndex);
        }
    }
}
```

:::caution 同步容器到底线程安全吗？
复合操作在某些情况下导致问题，原书描述为*这并不意味着Vector就不是线程安全的，因为Vector状态依然有限，并且抛出的异常也与其规范保持一致*。
:::

### 迭代器与ConcurrentModificationException

遍历同步容器的标准方式是使用迭代器，但迭代作为复合操作也会多线程修改容器下出现问题。**在设计同步容器类的迭代器时并没有考虑并发修改的问题**，当这种情况出现时，会抛出ConcurrentModificationException异常（Fail-Fast机制）。具体的实现方式是维护一个容器大小的计数器，当迭代期间计数器发生变化即抛出该异常。**注意这种检查是没有在同步情况下执行的**，这是设计上的权衡，为了降低检测代码带来的影响。

:::caution 注意
当直接从容器删除元素而不是使用迭代器时，单线程情况下也会抛出ConcurrentModificationException异常。
:::

要想完全消除可能抛出的ConcurrentModificationException异常，有两种解决方式：

1. 对容器加锁：当容器元素很多，访问元素执行操作时间很长时，可能会产生死锁。
2. 克隆容器：在副本上进行迭代，但克隆过程中仍需要对容器加锁

### 隐藏迭代器

注意迭代器操作在代码中可能并没有那么明显，如下代码所示，打印日志操作包含了一个隐藏的迭代操作：

```java {12}
public class HiddenIterator {
    private final Set<Integer> set = new HashSet<Integer>();

    public synchronized void add(Integer i) { set.add(i); }

    public synchronized void remove(Integer i) { set.remove(i); }

    public void addTenThings() {
        Random r = new Random();
        for (int i = 0; i < 10; i++)
            add(r.nextInt());
        System.out.println("DEBUG: added ten elements to " + set);
    }
}
```

编译器将字符串的连接操作转为StringBuilder.append调用，这个方法又会调用set的toString方法，而标准容器的toString方法又会**迭代**容器调用每个元素的toString方法生成最后的字符串，类似的方法还包括hashCode、equals、containsAll等，它们都有可能抛出ConcurrentModificationException异常。

:::danger 小心
状态和保护它们的同步代码之间相隔越远，开发人员越容易忘记使用正确的同步
:::

## 并发容器

鉴于同步容器的性能问题（串行化状态访问），Java 5.0提供了并发容器来改进，如ConcurrentMap接口新增了Put-If-Absent、条件删除等复合操作。Java 5.0新增了Queue和BlockingQueue两种容器，阻塞队列在队列的基础上扩展了可阻塞的插入和获取操作。Java 6也引入了ConcurrentSkipListMap和ConcurrentSkipListSet分别代替TreeMap、TreeSet。

### ConcurrentHashMap

同步容器粗粒度的并发策略使得每次只有一个线程访问容器，ConcurrentHashMap使用粒度更细的分段锁机制来实现最大程度的共享。作为并发容器，它不会抛出ConcurrentModificationException异常，但是返回的迭代器具有弱一致性而非Fast-Fail。ConcurrentHashMap的size、isEmpty等方法语义被削弱，并不代表容器的实际状态，只有当需要对整个Map加锁进行独占访问时才放弃使用ConcurrentHashMap，总体来说利大于弊。

### 额外的原子Map操作

ConcurrentHashMap不能被加锁来执行独占访问，因此无法用客户端加锁方式实现原子操作。但ConcurrentHashMap已经声明并实现了诸如Put-If-Absent、Remove-If-Equal、Replace-If-Equal等复合操作。当在现有同步Map上添加复合操作时，考虑使用ConcurrentHashMap代替。

### CopyOnWriteArrayList

CopyOnWriteArrayList(Set)作为同步List(Set)的替代品，在迭代期间不需要对容器加锁或复制(准确地来说是读时不复制)。“写时复制”容器不会抛出ConcurrentModificationException异常，返回元素与创建迭代器时的一致。仅当读操作远多于写操作时，才应该使用写时复制容器，比例事件通知系统：分发通知时迭代已注册监听器列表并调用监听器，大多数情况下监听器的注册和注销远少于接收事件通知的操作。

## 阻塞队列和生产者-消费者模式

生产者-消费者模式将“找出需要完成的工作”与“执行工作”解耦，同时也将生产数据与使用数据解耦，解决两者速率相差过大的负载问题。而阻塞队列天生支持生产者-消费者模式，提供阻塞的put/take方法和定时的offer/poll方法。阻塞队列分为以下几类：

1. LinkedBlockingQueue/ArrayBlockingQueue，基于FIFO策略的阻塞队列
2. PriorityBlockingQueue，基于优先级的阻塞队列
3. SynchronousQueue，维护一组线程

### 示例：桌面搜索

阻塞队列代码模板，生产者/消费者线程，使用阻塞队列作为成员，在主线程中创建阻塞队列并将引用作为参数传给生产者/消费者线程的构造器：

```java
public class ProducerConsumer {
    static class FileCrawler implements Runnable {
        private final BlockingQueue<File> fileQueue;
        private final FileFilter fileFilter;
        private final File root;

        public FileCrawler(BlockingQueue<File> fileQueue,
                           final FileFilter fileFilter,
                           File root) {
            this.fileQueue = fileQueue;
            this.root = root;
            this.fileFilter = new FileFilter() {
                public boolean accept(File f) {
                    return f.isDirectory() || fileFilter.accept(f);
                }
            };
        }

        private boolean alreadyIndexed(File f) {
            return false;
        }

        public void run() {
            try {
                crawl(root);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        private void crawl(File root) throws InterruptedException {
            File[] entries = root.listFiles(fileFilter);
            if (entries != null) {
                for (File entry : entries)
                    if (entry.isDirectory())
                        crawl(entry);
                    else if (!alreadyIndexed(entry))
                        fileQueue.put(entry);
            }
        }
    }

    static class Indexer implements Runnable {
        private final BlockingQueue<File> queue;

        public Indexer(BlockingQueue<File> queue) {
            this.queue = queue;
        }

        public void run() {
            try {
                while (true)
                    indexFile(queue.take());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        public void indexFile(File file) {
            // Index the file...
        };
    }

    private static final int BOUND = 10;
    private static final int N_CONSUMERS = Runtime.getRuntime().availableProcessors();

    public static void startIndexing(File[] roots) {
        BlockingQueue<File> queue = new LinkedBlockingQueue<File>(BOUND);
        FileFilter filter = new FileFilter() {
            public boolean accept(File file) {
                return true;
            }
        };

        for (File root : roots)
            new Thread(new FileCrawler(queue, filter, root)).start();

        for (int i = 0; i < N_CONSUMERS; i++)
            new Thread(new Indexer(queue)).start();
    }
}
```

### 串行线程封闭

阻塞队列的同步机制使得队列中的对象从生产者线程**发布**到消费者线程是安全的。线程封闭指对象只能有单个线程所有，但是可以安全发布对象来转移对象所有权。若转移后只有一个线程拥有对象且之前所有者不会再访问它，对象仍然是线程封闭的。因此，阻塞队列也可视为一种串行线程封闭，其他类似机制还包括ConcurrentMap的原子方法remove或者AtomicReference的原子方法compareAndSet。

### 双端队列与工作密取

Java 6新增了双端队列Deque（发音同deck）和BlockingDeque分别对Queue和BlockingQueue扩展。双端队列使用于工作密取(Work Stealing)模式，每个消费者线程都有**各自**的双端队列，当完成自己队列中的任务后，还可以从尾端获取其他消费者的双端队列，**适用于既是生产者又是消费者的场景(执行任务时出现了更多任务)**。

## 阻塞方法与中断方法

阻塞队列的put\take等方法会抛出受检查异常InterruptedException，表明该方法是阻塞方法，若方法被中断，它会努力提前结束阻塞状态。每个线程都有一个boolean类型的中断状态，Thread类的interrupt方法检查该状态判断是否被中断，

当调用将抛出InterruptedException异常的方法，此时调用方也成为阻塞方法，需要处理中断，通常有以下两种方法：

- 传递InterruptedException：不捕获异常\捕获后简单处理再次抛出
- 恢复中断：调用interrupt方法恢复中断状态

错误的处理方式是捕获但是不做任何响应，此时线程被中断的证据已经丢失。

## 同步工具类

同步工具类可以是任何一个对象，只要它根据自身状态来协调线程的控制流。除了阻塞队列外，Java类库还提供了其他同步工具类，以下逐一介绍。

### 闭锁

闭锁是一种同步工具类，当闭锁到达结束状态之前，所有等待该闭锁的线程被阻塞，当到达结束状态后，所有线程开始执行并且**闭锁状态不会再改变**。闭锁用于确保某些活动在其他活动完成后才继续执行。

CountDownLatch是一种灵活的闭锁实现，其构造函数接收一个正整数作为，提供countDown方法将计数器减一，提供await方法阻塞线程直达计数器为0。如下示例代码使用CountDownLatch计算所有线程完成工作总时间：

```java
public class TestHarness {
    public long timeTasks(int nThreads, final Runnable task)
            throws InterruptedException {
        final CountDownLatch startGate = new CountDownLatch(1);
        final CountDownLatch endGate = new CountDownLatch(nThreads);

        for (int i = 0; i < nThreads; i++) {
            Thread t = new Thread() {
                public void run() {
                    try {
                        startGate.await();
                        try {
                            task.run();
                        } finally {
                            endGate.countDown();
                        }
                    } catch (InterruptedException ignored) {
                    }
                }
            };
            t.start();
        }

        long start = System.nanoTime();
        startGate.countDown();
        endGate.await();
        long end = System.nanoTime();
        return end - start;
    }
}
```

这里使用了两个闭锁，分别表示起始门和结束门。起始门初始值为1，主线程将其减1，如此确保所有工作线程准备就绪后一同开始执行任务。结束门初始值为工作线程个数，工作线程结束后将其减1，如此确保最后一个工作线程结束后主线程结束。

:::info 为什么要用起始门，一个结束门不就可以吗？
为了确保所有工作线程“同时”开始执行，否则先start的线程先结束，可能导致最后统计时间偏大
:::

### FutureTask

FutureTask也可作为一种闭锁实现，它是Callable计算结果的占位符。FutureTask有3中状态：等待执行、正在执行、运行完成，当进入完成状态后便永远停留在这个状态。

FutureTask.get()方法用于获取结果，若任务完成则立即返回，否则get将阻塞直到任务完成或者抛出异常。如下代码所示，表示一个异步异步加载产品信息的任务。

```java
public class Preloader {
    ProductInfo loadProductInfo() throws DataLoadException { return null; }

    private final FutureTask<ProductInfo> future =
        new FutureTask<ProductInfo>(new Callable<ProductInfo>() {
            public ProductInfo call() throws DataLoadException {
                return loadProductInfo();
            }
        });
    private final Thread thread = new Thread(future);

    public void start() { thread.start(); }

    public ProductInfo get() throws DataLoadException, InterruptedException {
        try {
            return future.get();
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof DataLoadException)
                throw (DataLoadException) cause;
            else
                throw LaunderThrowable.launderThrowable(cause);
        }
    }

    interface ProductInfo {}
}

class DataLoadException extends Exception { }
```

为了避免在构造函数中调用start()方法，包装了start方法来调用线程。注意get方法抛出的异常都会被封装到一个ExecutionException中，需要根据情况分别处理。当异常时受检查异常时，重新抛出，否则使用LaunderThrowable.launderThrowable方法处理，代码如下所示。

```java
public class LaunderThrowable {

    /**
     * Coerce an unchecked Throwable to a RuntimeException
     * <p/>
     * If the Throwable is an Error, throw it; if it is a
     * RuntimeException return it, otherwise throw IllegalStateException
     */
    public static RuntimeException launderThrowable(Throwable t) {
        if (t instanceof RuntimeException)
            return (RuntimeException) t;
        else if (t instanceof Error)
            throw (Error) t;
        else
            throw new IllegalStateException("Not unchecked", t);
    }
}
```

### 信号量

信号量(Semaphore)用于控制访问某个特定资源的操作数量或者某个指定操作的数量，还可以用于实现资源池或者将容器变成有界阻塞容器。示例代码如下所示：

```java
public class BoundedHashSet <T> {
    private final Set<T> set;
    private final Semaphore sem;

    public BoundedHashSet(int bound) {
        this.set = Collections.synchronizedSet(new HashSet<T>());
        sem = new Semaphore(bound);
    }

    public boolean add(T o) throws InterruptedException {
        sem.acquire();
        boolean wasAdded = false;
        try {
            wasAdded = set.add(o);
            return wasAdded;
        } finally {
            if (!wasAdded)
                sem.release();
        }
    }

    public boolean remove(Object o) {
        boolean wasRemoved = set.remove(o);
        if (wasRemoved)
            sem.release();
        return wasRemoved;
    }
}
```

Semaphore构造方法传入一个正数作为初始许可证个数，提供方法release和acquire分别新增和减少一个许可证。当许可证个数为0时，acquire方法被阻塞。

### 栅栏

栅栏(Barrier)类似闭锁，它能阻塞一组线程直到某个事件发生。栅栏和闭锁的区别：

1. 闭锁用于等待事件，栅栏用于等待其他线程
2. 闭锁不可重置复用，栅栏可以使线程反复在栅栏位置汇集
3. CountDownLatch是减1到0后同时执行，Barrier是加1到特定值后同时执行

栅栏提供await方法将阻塞到所有线程都到达栅栏位置，此时栅栏打开，所有线程被释放，同时栅栏被重置供下次使用。如果await调用超时或者await阻塞的线程被中断，那么栅栏被认为打破，所有阻塞await调用抛出BrokenBarrierException。示例代码如下所示：

```java
public class CellularAutomata {
    private final Board mainBoard;
    private final CyclicBarrier barrier;
    private final Worker[] workers;

    public CellularAutomata(Board board) {
        this.mainBoard = board;
        int count = Runtime.getRuntime().availableProcessors();
        this.barrier = new CyclicBarrier(count,
                new Runnable() {
                    public void run() {
                        mainBoard.commitNewValues();
                    }});
        this.workers = new Worker[count];
        for (int i = 0; i < count; i++)
            workers[i] = new Worker(mainBoard.getSubBoard(count, i));
    }

    private class Worker implements Runnable {
        private final Board board;

        public Worker(Board board) { this.board = board; }
        public void run() {
            while (!board.hasConverged()) {
                for (int x = 0; x < board.getMaxX(); x++)
                    for (int y = 0; y < board.getMaxY(); y++)
                        board.setNewValue(x, y, computeValue(x, y));
                try {
                    barrier.await();
                } catch (InterruptedException ex) {
                    return;
                } catch (BrokenBarrierException ex) {
                    return;
                }
            }
        }

        private int computeValue(int x, int y) {
            // Compute the new value that goes in (x,y)
            return 0;
        }
    }

    public void start() {
        for (int i = 0; i < workers.length; i++)
            new Thread(workers[i]).start();
        mainBoard.waitForConvergence();
    }

    interface Board {
        int getMaxX();
        int getMaxY();
        int getValue(int x, int y);
        int setNewValue(int x, int y, int value);
        void commitNewValues();
        boolean hasConverged();
        void waitForConvergence();
        Board getSubBoard(int numPartitions, int index);
    }
}
```

CellularAutomata用于模拟细胞增殖位置，它将问题分为N(=CPU个数)个子线程解决。当这N个子问题都完成计算后(到达栅栏位置)，由栅栏提交这些结果(由最后一个到达的子线程执行)，之后栅栏状态重置，进行下一轮计算。另一种简化形式的栅栏是Exchanger，它只有两个工作线程，用于安全地交换数据。

## 构建高效且可伸缩的结果缓存

作为一种空间换时间的策略，简单的缓存设计可能将性能瓶颈转为可伸缩性瓶颈。首先看一个使用HashMap缓存计算结果的示例：

```java
public class Memoizer1 <A, V> implements Computable<A, V> {
    private final Map<A, V> cache = new HashMap<A, V>();
    private final Computable<A, V> c;

    public Memoizer1(Computable<A, V> c) { this.c = c; }

    public synchronized V compute(A arg) throws InterruptedException {
        V result = cache.get(arg);
        if (result == null) {
            result = c.compute(arg);
            cache.put(arg, result);
        }
        return result;
    }
}

interface Computable <A, V> {
    V compute(A arg) throws InterruptedException;
}

class ExpensiveFunction implements Computable<String, BigInteger> {
    public BigInteger compute(String arg) {
        // after deep thought...
        return new BigInteger(arg);
    }
}
```

缓存类Memoizer1实现Computable接口，调用compute方法时首先尝试在其内部HashMap中找到缓存结果，没有找到则计算并返回。由于HashMap不是线程安全的，这里对整个compute方法进行同步。结果是每次只能有一个线程执行compute方法，当某个线程compute执行时间过长时，使用缓存反而会导致总体计算时间增加。对此，改进措施是使用ConcurrentHashMap来代替HashMap，代码如下所示：

```java
public class Memoizer2 <A, V> implements Computable<A, V> {
    private final Map<A, V> cache = new ConcurrentHashMap<A, V>();
    private final Computable<A, V> c;

    public Memoizer2(Computable<A, V> c) { this.c = c; }

    public V compute(A arg) throws InterruptedException {
        V result = cache.get(arg);
        if (result == null) {
            result = c.compute(arg);
            cache.put(arg, result);
        }
        return result;
    }
}
```

使用ConcurrentHashMap提升了并发度，但是还存在缺陷——两个线程同时调用compute时会计算相同值，这违背了使用缓存的初衷。我们希望能通过某种方式表达线程A正在计算，线程B只需要等待A计算结束然后获取其结果，而FutureTask类恰好能满足这点：

```java
public class Memoizer3 <A, V> implements Computable<A, V> {
    private final Map<A, Future<V>> cache = new ConcurrentHashMap<A, Future<V>>();
    private final Computable<A, V> c;

    public Memoizer2(Computable<A, V> c) { this.c = c; }

    public V compute(A arg) throws InterruptedException {
        Future<V> f = cache.get(arg);
        if (f == null) {
            Callable<V> eval = new Callable<V>() {
                public V call() throws InterruptedException {
                    return c.compute(arg);
                }
            };
            FutureTask<V> ft = new FutureTask<V>(eval);
            f = ft;
            cache.put(arg, ft);
            ft.run();           // 调用c.compute
        }
        try {
            return f.get();
        } catch (ExecutionException e) {
            throw launderThrowable(e.getCause());
        }
    }
}
```

相比于Memoizer2，Memoizer3中cache的put操作是异步的，不必等到compute执行完成。这大大减少了线程重复计算的概率，但是仍会发生，究其原因是复合操作(Put-If-Absent)并不是原子的，继续改进的compute代码如下所示：

```java
public V compute(final A arg) throws InterruptedException {
    while (true) {
        Future<V> f = cache.get(arg);
        if (f == null) {
            Callable<V> eval = new Callable<V>() {
                public V call() throws InterruptedException {
                    return c.compute(arg);
                }
            };
            FutureTask<V> ft = new FutureTask<V>(eval);
            f = cache.putIfAbsent(arg, ft);
            if (f == null) { f = ft; ft.run(); }
        }
        try {
            return f.get();
        } catch (CancellationException e) {
            cache.remove(arg, f);
        } catch (ExecutionException e) {
            throw LaunderThrowable.launderThrowable(e.getCause());
        }
    }
}
```

使用putIfAbsent方法设置缓存，并且第二次判断f是否为null来防止其他线程已经提交了compute任务，杜绝了重复计算。另外，为了解决**缓存污染**的问题，当get方法发生异常时移除该计算任务缓存。

## 总结

以下是对前5章基础知识部分的概念和规则的总结：

1. 可变状态至关重要，越少的可变状态越容易确保线程安全性
2. 尽量将变量声明为final，除非它们可变
3. 不可变对象一定是线程安全的
4. 封装有助于管理复杂性
5. 用锁保护可变变量
6. **当保护同一个不变性条件的所有变量时，要使用同一个锁**
7. **在执行复合操作时要持有锁**
8. 多线程访问同一个可变变量，没有同步机制会出问题
9. 不要故作聪明地推断不需要同步
10. 在设计过程中考虑线程安全，或在文档中明确指出它不是线程安全的
11. 将同步策略文档化
