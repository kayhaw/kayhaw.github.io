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
