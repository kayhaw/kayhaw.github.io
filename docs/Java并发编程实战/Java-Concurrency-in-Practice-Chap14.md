---
layout: article
title: 构建自定义的同步工具
permalink: /java-concurrency-in-practice/chap14
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第十四章读书笔记
:::

介绍实现状态依赖性的各种选择，以及提供状态依赖性机制时需要遵守的规则。

## 状态依赖性的管理

在单线程环境下，基于状态的前提条件未得到满足，那该条件永远无法成真，此时程序行为按照失败处理。而在多线程环境下，可能经过几条指令后前提条件又改变了。因此，依赖状态的操作可以一直阻塞到前提条件为真再继续执行，这比让它们先失败再实现起来更方便。可阻塞的状态依赖伪代码如下所示：

```java
获取对象状态的锁
while(状态的前提条件为假) {
  释放锁
  等到前提条件为真
  当被中断或者超时可以选择失败退出
  重新上锁
}
执行操作
释放锁
```

首先构成前提条件的状态变量由锁保护(确保判断时没有其他线程修改状态)，在进行判断，如果为真则执行操作然后释放锁，如果为假则先释放锁再等待前提条件为真，在再次测试前提条件之前都必须重新上锁。

接下来以有界缓存的不同实现来介绍如何处理前提条件失败的问题。首先给出基类BaseBoundBuffer代码实现，该类实现了一个基于数组的循环缓存，各个状态变量都由内置锁保护。

```java
public abstract class BaseBoundedBuffer <V> {
    private final V[] buf;
    private int tail;
    private int head;
    private int count;

    protected BaseBoundedBuffer(int capacity) {
        this.buf = (V[]) new Object[capacity];
    }

    protected synchronized final void doPut(V v) {
        buf[tail] = v;
        if (++tail == buf.length)
            tail = 0;
        ++count;
    }

    protected synchronized final V doTake() {
        V v = buf[head];
        buf[head] = null;
        if (++head == buf.length)
            head = 0;
        --count;
        return v;
    }

    public synchronized final boolean isFull() {
        return count == buf.length;
    }

    public synchronized final boolean isEmpty() {
        return count == 0;
    }
}
```

### 示例：将前提条件的失败传递给调用者

当使用缓存时，必须遵守“缓存为空不能获取，缓存已满不能添加”的前提规则，当前提规则不满足时，一种简单方法是直接抛出异常，如下所示：

```java
public class GrumpyBoundedBuffer <V> extends BaseBoundedBuffer<V> {
    public GrumpyBoundedBuffer() {
        this(100);
    }

    public GrumpyBoundedBuffer(int size) {
        super(size);
    }

    public synchronized void put(V v) throws BufferFullException {
        if (isFull())
            throw new BufferFullException();
        doPut(v);
    }

    public synchronized V take() throws BufferEmptyException {
        if (isEmpty())
            throw new BufferEmptyException();
        return doTake();
    }
}
```

此时，每次调用缓存操作的代码必须处理未检查异常并且重复操作直到成功，代码如下所示：

```java
while (true) {
    try {
        String item = buffer.take();
        // use item
        break;
    } catch (BufferEmptyException e) {
        Thread.sleep(SLEEP_GRANULARITY);
    }
}
```

休眠会降低程序响应性，第二种方式不让调用进入休眠，而是直接重新调用take方法，称之为**忙等待**或者**自旋等待**，但会造成CPU时间浪费。第三种方式是通过Thread.yield方法让出CPU时间片。

### 示例：通过轮询与休眠来实现简单的阻塞

为了免去调用者一直用while-true循环来实现重试逻辑，改写put和take方法，将前提条件的验证管理封装起来从而简化使用，代码如下所示：

```java
public void put(V v) throws InterruptedException {
    while (true) {
        synchronized (this) {
            if (!isFull()) {
                doPut(v);
                return;
            }
        }
        Thread.sleep(SLEEP_GRANULARITY);
    }
}

public V take() throws InterruptedException {
    while (true) {
        synchronized (this) {
            if (!isEmpty())
                return doTake();
        }
        Thread.sleep(SLEEP_GRANULARITY);
    }
}
```

通过synchronized同步块，确保验证前提条件时收到锁保护。若验证失败则释放锁并休眠一段时间，从而确保其他线程能够访问缓存。从调用者角度看，操作要么立即执行，要么阻塞。但这种方式需要注意两点：

- 合适的休眠时间，间隔时间越小响应性越高但是CPU消耗也更大
- 处理InterruptedException，当等待阻塞方法返回时，通过中断来取消方法执行

### 条件队列

通过轮序和休眠可以实现阻塞操作，但一种更好的方式是使用条件队列。每个对象都可以作为一个锁，所有等待该锁的线程形成一个条件队列，而Object类的wait、notify和notifyAll方法构成该队列的API。如下代码通过wait和notifyAll方法实现一个有界缓存：

```java
public synchronized void put(V v) throws InterruptedException {
    while (isFull())
        wait();
    doPut(v);
    notifyAll();
}

public synchronized V take() throws InterruptedException {
    while (isEmpty())
        wait();
    V v = doTake();
    notifyAll();
    return v;
}
```

通过条件队列，在前提条件为假时使用wait挂起线程，当前提条件为真是使用notifyAll唤醒线程，这比使用休眠的有界缓存更加简单高效。

## 使用条件队列

条件队列让构建高响应性的状态依赖类更加容易，但它也会被错误使用。

### 条件谓词

条件谓词是使某个操作成为状态依赖操作的前提条件，它和锁、wait方法组成条件等待的三要素。条件谓词包含多个状态变量，每个状态变量必须由一个锁来保护，并且锁对象和条件队列对象(调用wait、notify等方法的对象)必须相同。

### 过早唤醒

由于内置条件队列可以与多个条件谓词一起使用，wait方法返回时并不一定意味着它所等待的条件谓词为真(例如一个线程由于notifyAll而醒来时，wait方法假装返回)。基于这些原因，线程从wait中唤醒时都必须再次测试条件谓词，即标准的条件等待代码模板如下所示：

```java
void stateDependentMethod() throw InterruptedException {
    synchronized(lock) {
        while (!conditionPredicate()) {
            lock.wait();
        }
        // 操作
    }
}
```

使用条件等待总结：

1. 通过条件谓词测试
2. 在调用wait前，从wait返回后都测试
3. 在while循环中调用wait
4. 使用条件对象相关锁保护状态变量
5. 调用wait、notify或者notifyAll时一定要持有与条件队列相关的锁
6. 检查条件谓词后和开始操作前，都不要释放锁

### 信号丢失

信号丢失属于一种活跃性故障：线程等待已经为真的条件，但是开始等待之前没有检查条件谓词。例如在wait方法之前没有检测条件谓词。

### 通知

当其他线程等待条件时，一定要确保条件谓词为真后通过某种方式发出通知，对于条件队列来说就是notify和notifyAll方法。notify方法随机唤醒一个线程，而notifyAll方法唤醒所有等待线程。由于多个线程可以基于不同条件谓词等待，使用notify将导致**信号劫持问题**：PB成真，同时线程C执行notify操作，唤醒等待PA的线程A，A发现PA为假继续等待，而等待PB的线程B本该执行但还是等待。因此，只有**同时满足**以下两个条件才能使用notify而不是notifyAll：

1. 所有等待线程的类型相同：只有一个条件谓词，执行操作相同
2. 单进单出：通知每次最多唤起一个线程

大部分类不满足这两点要求，优先使用notifyAll通知唤醒以确保类行为正确。为了优化性能，还可以使用**条件通知**，如下代码所示：

```java
public synchronized void alternatePut(V v) throws InterruptedException {
    while (isFull())
        wait();
    boolean wasEmpty = isEmpty();
    doPut(v);
    if (wasEmpty)
        notifyAll();
}
```

单次通知和条件通知可以优化通知性能，但是要遵守“先让程序正确执行，再让程序高效执行”的原则使用。

### 示例：阀门类

在第5章中的TestHarness类中使用二元闭锁来控制线程开始执行的时刻，但闭锁存在缺陷：它们是一次性的，阀门打开后就无法关闭。如下代码通过条件等待实现一个可重新关闭的ThreadGate类：

```java
public class ThreadGate {
    // CONDITION-PREDICATE: opened-since(n) (isOpen || generation>n)
    private boolean isOpen;
    private int generation;

    public synchronized void close() {
        isOpen = false;
    }
    // 打开阀门，通知所有等待线程
    public synchronized void open() {
        ++generation;
        isOpen = true;
        notifyAll();
    }
    // BLOCKS-UNTIL: opened-since(generation on entry)
    public synchronized void await() throws InterruptedException {
        int arrivalGeneration = generation;
        while (!isOpen && arrivalGeneration == generation)
            wait();
    }
}
```

在await方法中的条件谓词稍微复杂些：如果只检查isOpen，当阀门快速开启又关闭时，所有线程可能都无法释放。通过generation计数器检查，每当阀门开启一次，所有线程都能够通过await。

### 子类的安全问题

对于状态依赖类，要么将其等待和通知等协议完全向子类公开，要么完全阻止子类参与到等待和通知过程。前者至少需要公开条件队列和锁，并将条件谓词和同步策略写入文档。后者可以隐藏条件队列、锁和状态变量(声明为private)，或者直接将类声明为final。

### 封装条件队列

通常需要把条件队列封装起来，否则调用者会滥用条件队列。然而这种做法与线程安全类的设计模式冲突，该模式建议使用对象的内置锁保护对象自身的状态，例如BoundedBuffer。可以将BoundedBuffer重新设计为使用私有锁对象和条件队列，此时它不再支持客户端加锁。

### 入口协议与出口协议

入口协议和出口协议是wait和notify方法正确使用的规范。对于每次依赖状态的操作，入口协议是该操作的条件谓词，出口协议包括，检查该操作修改的所有状态变量，确认它们是否改变其他条件谓词，如果是则通知相关条件队列。在AbstractQueuedSynchronizer中使用出口协议，该类并不是由同步器自行执行通知，而是要求同步器方法返回一个值来表示该类的操作是否解除了一个或多个线程的阻塞。

## 显式的Condition对象

内置条件队列存在一些缺陷：每个内置锁只能有一个相关联的条件队列。因此多个线程可能在同一个条件队列上等待不同的条件谓词，并且常见加锁模式会公开条件队列，这些因素都无法满足使用notifyAll时所有等待线程都是同一类型的需求，此时可以使用显示的Lock和Condition。

正如条件队列和内置锁相关联，Condition和Lock关联在一起，通过Lock.newCondition方法得到Condition对象，并且每次Lock可以拥有任意数量的Codition对象。如下所示代码通过两个Condition给出有界缓存的另一种实现：

```java
public class ConditionBoundedBuffer <T> {
    protected final Lock lock = new ReentrantLock();
    // CONDITION PREDICATE: notFull (count < items.length)
    private final Condition notFull = lock.newCondition();
    // CONDITION PREDICATE: notEmpty (count > 0)
    private final Condition notEmpty = lock.newCondition();
    private static final int BUFFER_SIZE = 100;
    private final T[] items = (T[]) new Object[BUFFER_SIZE];
    private int tail, head, count;

    // BLOCKS-UNTIL: notFull
    public void put(T x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length)
                notFull.await();
            items[tail] = x;
            if (++tail == items.length)
                tail = 0;
            ++count;
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }

    // BLOCKS-UNTIL: notEmpty
    public T take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0)
                notEmpty.await();
            T x = items[head];
            items[head] = null;
            if (++head == items.length)
                head = 0;
            --count;
            notFull.signal();
            return x;
        } finally {
            lock.unlock();
        }
    }
}
```

使用Lock和Condition时也必须满足锁、条件谓词和条件变量的三元关系，当需要使用公平的队列操作或者每个锁对应多个等待线程队列等高级功能，优先考虑Condition而不是内置条件队列。

:::caution 注意
在Condition对象中，与wait、notify和notifyAll对应的方法分别时await、signal和signalAll，同时Condition也继承Object，所以也有wait等方法，但是要调用正确的await方法。
:::

## Synchronizer剖析

ReentrantLock和Semaphore作为同步工具存在许多共同点，如下所示代码用ReentrantLock实现了Semaphore：

```java
public class SemaphoreOnLock {
    private final Lock lock = new ReentrantLock();
    // CONDITION PREDICATE: permitsAvailable (permits > 0)
    private final Condition permitsAvailable = lock.newCondition();
    private int permits;

    SemaphoreOnLock(int initialPermits) {
        lock.lock();
        try {
            permits = initialPermits;
        } finally {
            lock.unlock();
        }
    }

    // BLOCKS-UNTIL: permitsAvailable
    public void acquire() throws InterruptedException {
        lock.lock();
        try {
            while (permits <= 0)
                permitsAvailable.await();
            --permits;
        } finally {
            lock.unlock();
        }
    }

    public void release() {
        lock.lock();
        try {
            ++permits;
            permitsAvailable.signal();
        } finally {
            lock.unlock();
        }
    }
}
```

反之使用Semaphore实现ReentrantLock也是可行的，但实际上它们都基于AbstractQueuedSynchronizer(AQS)类实现，该类也是JUC下其他同步工具类的实现基础。

## AbstractQueuedSynchronizer

开发时不会直接使用AQS，因为标准同步工具类能够满足大部分情况。基于AQS的同步工具类中，最基础的是各种形式的获取操作和释放操作。获取操作时一种依赖状态的操作，通常会阻塞，释放操作不会阻塞，释放后所有请求时被阻塞的线程都会开始执行：

```java
boolean acquire() throw InterruptedException {
    while(当前状态不允许获取操作){
        if(需要阻塞获取操作) {
            如果当前线程不在队列中，将其加入队列
            阻塞当前线程
        } else
            返回false
    }
    可能更新同步器状态
    线程位于队列中，将其移除
    返回true
}

boolean release() {
    更新同步器状态
    if(新状态允许某个被阻塞的线程获取成功)
        解除队列中一个或多个线程的阻塞状态
}
```

AQS类管理一个整数，用于表示任意状态。比如ReentrantLock用它来表示所有者线程已经重复获取该锁的次数，Semaphore用它来表示剩余的许可数量，FutureTask用它表示任务状态(未开始、正在运行、已完成和已取消)。如下所示代码使用AQS实现一个二元闭锁：

```java
public class OneShotLatch {
    private final Sync sync = new Sync();

    public void signal() {
        sync.releaseShared(0);
    }

    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(0);
    }

    private class Sync extends AbstractQueuedSynchronizer {
        protected int tryAcquireShared(int ignored) {
            // Succeed if latch is open (state == 1), else fail
            return (getState() == 1) ? 1 : -1;
        }

        protected boolean tryReleaseShared(int ignored) {
            setState(1); // Latch is now open
            return true; // Other threads may now be able to acquire

        }
    }
}
```

oneSlotLatch也可以使用继承AQS的方式实现，但并不推荐，因为它会暴露AQS的公共方法，调用者可能会使用这些公共方法破坏闭锁状态。JUC下的工具类也都没有直接扩展AQS，而是将功能委托给私有的AQS子类。

## JUC同步器类中的AQS

简单介绍ReentrantLock、Semaphore、CountDownLatch等同步器类是如何使用AQS

### ReentrantLock

ReentrantLock只支持独占方式的获取操作，因此实现了tryAcquire、tryRelease和isHeldExclusively方法。如下代码是非公平版本的tryAcquirefangfa方法：

```java
protected boolean tryAcquire(int ignored) {
    final Thread current = Thread.currentThread();
    int c = getState();
    // 没有线程占有，尝试获取锁
    if(c == 0) {
        // 使用CAS修改状态，并返回成功
        if(compareAndSetState(0, 1)) {
            owner = current;
            return true;
        }
    // 当前线程占有，状态计数器加1，返回成功
    } else if(current == owner) {
        setState(c+1);
        return true;
    }
    return false;
}
```

### Semaphore和CountDownLatch

Semaphore将AQS中的同步状态用于保存当前可用许可证的数量，当许可证数量remaining小于0返回该值，否则使用CAS更新许可证数量。CountDownLatch使用AQS的方式与Semaphore相似，只不过逻辑相反：countDown方法调用AQS的release方法，导致计数器递减，await方法调用AQS的acquire方法，当计数器为零时立即返回，否则阻塞。

```java
protected int tryAcquireShared(int acquires) {
    while(true) {
        int available = getState();
        int remaining = available - acuqires;
        // 剩余数量小于0，直接返回表示获取失败
        // 否则尝试修改state
        if(remaining < 0 || compareAndSetState(available, remaining))
            return remaining;
    }
}

protected boolean tryReleaseShared(int releases) {
    // while循环更新state，增加许可证数量
    while(true) {
        int p = getState();
        if(compareAndSetState(p, p + release))
            return true;
    }
}
```

### FutureTask

FutureTask的get方法类似闭锁：某个事件(任务完成或取消)发生时，调用者线程继续执行，否则将停留在队列中直到该事件发生。在FutureTask中，AQS的state用于表示任务状态，此外FutureTask也要维护计算任务抛出的异常或者结果。

### ReentrantReadWriteLock

ReentrantReadWriteLock并没有使用两个AQS对象来实现读锁和写锁，而是用单个AQS对象同时管理读锁和写锁：state的16位表示写锁的技术，另外16位表示读锁的计数。在读锁上使用共享的获取和释放方法，在写锁上使用独占的获取和释放方法。

AQS在内部维护一个等待队列，记录请求线程是独占还是共享访问。当锁可用时，如果队列头是写入线程，该线程获得锁，如果队列头是读取线程，队列中第一个写线程之前的读线程都将会获得锁。


## 总结

1. Lock相比于内置锁可以提供公平性选择(公平锁性能弱于非公平锁，一般用不上)，提供等待线程分类管理(通过Condition)等扩展功能
2. 使用Condition时注意不要调用Object的wait、notify和notifyAll方法
3. 实现状态依赖类的最好方式是使用现有库中的同步工具类，如果功能还不能满足使用AQS来构建自定义同步器
