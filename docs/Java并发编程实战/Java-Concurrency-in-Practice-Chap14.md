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
