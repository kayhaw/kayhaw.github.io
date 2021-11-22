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
