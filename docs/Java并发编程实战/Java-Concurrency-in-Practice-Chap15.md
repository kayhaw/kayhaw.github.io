---
layout: article
title: 原子变量与非阻塞同步机制
permalink: /java-concurrency-in-practice/chap15
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第十五章读书笔记
:::

JUC工具类提供比synchronized更好的性能和可伸缩性，本章介绍性能提升的来源：原子变量与非阻塞同步机制

## 锁的劣势

在并发程序中，未获得锁的线程需要经历挂起和恢复的过程，这由JVM借助于操作系统完成。当锁存在竞争激烈时，大量的CPU时间花费在线程调度上而不是实际工作。锁还存在**优先级反转**问题：持有锁的低优先级线程被延迟执行，导致等待锁的高优先级线程无法继续执行。即使忽略这个问题，在细粒度操作上使用锁也是一种高开销，需要一种类似volatile变量的机制来管理线程。

## 硬件对并发的支持

独占锁是一种悲观技术，它确保没有其他线程干扰才执行。而对于细粒度操作，使用冲突检查机制的乐观锁更加高效。在现代处理器中提供了原子的读-改-写指令，例如比较并交换(Compare-and-Swap)、关联加载/条件存储(Load-Linked/Store-Conditional)，通过这些指令，JVM从硬件上来实现锁和并发数据结构。

### 比较并交换

CAS指令包含3个操作数(读写内存位置V，旧值A和新值B)，其语义为：当且仅当V的值为A时将其原子更新为B，否则不执行任何操作。如下代码通过内置锁模拟CAS操作：

```java
public class SimulatedCAS {
    private int value;

    public synchronized int get() {
        return value;
    }

    public synchronized int compareAndSwap(int expectedValue, int newValue) {
        int oldValue = value;
        if (oldValue == expectedValue)
            value = newValue;
        return oldValue;
    }

    public synchronized boolean compareAndSet(int expectedValue, int newValue) {
        return (expectedValue == compareAndSwap(expectedValue, newValue));
    }
}
```

多个线程执行CAS操作只有一个会成功，但是其他线程不会被挂起而是继续尝试，从而在不用锁的情况下实现原子的读-改-写操作。

### 非阻塞的计数器

如下所示代码通过CAS操作实现一个线程安全的计数器。当线程竞争程度不高时，基于CAS的计数器优于基于锁，在没有竞争时甚至更高。从表面代码看，CAS似乎比内置锁更复杂，但JVM管理锁需要遍历复杂的代码逻辑，可能导致操作系统级的锁定、线程挂起和上下文切换，而CAS不需要。CAS的主要缺点是让调用者处理竞争问题(重试、回退、放弃)，而锁机制会自动处理。

```java
public class CasCounter {
    private SimulatedCAS value;

    public int getValue() {
        return value.get();
    }

    public int increment() {
        int v;
        do {
            v = value.get();
        } while (v != value.compareAndSwap(v, v + 1));
        return v + 1;
    }
}
```

### JVM对CAS的支持

自Java 5.0引入底层支持，由JVM编译为底层硬件指令，如果底层平台不支持CAS将使用自旋锁，JUC下的AtomicXxx类使用了这些底层支持。

## 原子变量类

原子变量类将竞争缩小到单个变量上，JUC提供12个原子变量类，可分为4组：标量类、更新器类、数组类以及复合变量类。常用的是标量类(AtomicInteger、AtomicLong、AtomicBoolean和AtomicReference)，其他基本类型可以进行类型转化(如floatToIntBits、doubleToLongBits)来实现模拟。

原子标量类扩展Number类，但是没有扩展基本类型的包装类，实际上也无法扩展。同时原子变量类没有重新定义hashCode或者equals方法，因此不适合作为Map容器的键值。

### 原子变量类是一种更好的volatile

在第4章中的NumberRange类中，由于存在下界小于上界的不变性条件，仅仅使用volatile或者原子类的上下界都是有问题的。如下所示代码通过原子引用类更新来避免静态条件：

```java
public class CasNumberRange {
    // 私有静态内部类
    private static class IntPair {
        // 不变性条件: lower <= upper
        final int lower;
        final int upper;

        public IntPair(int lower, int upper) {
            this.lower = lower;
            this.upper = upper;
        }
    }

    private final AtomicReference<IntPair> values =
            new AtomicReference<IntPair>(new IntPair(0, 0));

    public int getLower() { return values.get().lower; }

    public int getUpper() { return values.get().upper; }

    public void setLower(int i) {
        while (true) {
            IntPair oldv = values.get();
            if (i > oldv.upper)
                throw new IllegalArgumentException("Can't set lower to " + i + " > upper");
            IntPair newv = new IntPair(i, oldv.upper);
            // CAS操作可能失败，因此调用者要使用while-true循环
            if (values.compareAndSet(oldv, newv))
                return;
        }
    }

    public void setUpper(int i) {
        while (true) {
            IntPair oldv = values.get();
            if (i < oldv.lower)
                throw new IllegalArgumentException("Can't set upper to " + i + " < lower");
            IntPair newv = new IntPair(oldv.lower, i);
            if (values.compareAndSet(oldv, newv))
                return;
        }
    }
}
```

### 性能比较：锁与原子变量

使用ReentrantLock、AtomicInteger分别实现随机数生成器，使用不同数量线程测试，结论如下：

1. 竞争程度高时，锁的性能略优于原子变量
2. 竞争程度中等时，原子变量性能是锁性能2倍
3. 使用ThreadLocal时性能最高，说明只有完全消除竞争，才能实现真正的可伸缩性

## 非阻塞算法

非阻塞算法：一个线程的失败或挂起不会导致其他线程失败或挂起
无锁算法：算法的每一个步骤都存在某个线程能执行下去

### 非阻塞的栈

在实现相同功能情况下，使用非阻塞算法比基于锁的更加复杂。如下所示代码通过CAS实现一个非阻塞的栈：

```java
public class ConcurrentStack <E> {
    AtomicReference<Node<E>> top = new AtomicReference<Node<E>>();

    public void push(E item) {
        Node<E> newHead = new Node<E>(item);
        Node<E> oldHead;
        do {
            oldHead = top.get();
            newHead.next = oldHead;
        } while (!top.compareAndSet(oldHead, newHead));
    }

    public E pop() {
        Node<E> oldHead;
        Node<E> newHead;
        do {
            oldHead = top.get();
            if (oldHead == null)
                return null;
            newHead = oldHead.next;
        } while (!top.compareAndSet(oldHead, newHead));
        return oldHead.item;
    }

    private static class Node <E> {
        public final E item;
        public Node<E> next;

        public Node(E item) {
            this.item = item;
        }
    }
}
```

在push和pop方法中使用do-while和CAS，防止在操作过程中因为有其他线程进行出栈入栈操作导致不变性条件被破坏。

### 非阻塞的链表

相比于非阻塞的计数器和栈，实现非阻塞的链表更为复杂。为了实现对链表头尾节点的快速访问，需要单独文虎头尾指针。以尾节点为例，倒数第二个节点的next指针和尾指针都指向它。当插入元素时，这两个指针都需要采用原子更新。

初看起来，这需要执行两个CAS操作，当这两个CAS操作其中一个失败，或者它们执行之间有另一个线程访问，都会出现链表状态不一致的情况。Michael-Scott提出的非阻塞链表算法解决了这个问题，如下给出了链表插入元素的代码实现：

```java
public class LinkedQueue <E> {

    private static class Node <E> {
        final E item;
        final AtomicReference<LinkedQueue.Node<E>> next;

        public Node(E item, LinkedQueue.Node<E> next) {
            this.item = item;
            this.next = new AtomicReference<LinkedQueue.Node<E>>(next);
        }
    }

    private final LinkedQueue.Node<E> dummy = new LinkedQueue.Node<E>(null, null);
    private final AtomicReference<LinkedQueue.Node<E>> head
            = new AtomicReference<LinkedQueue.Node<E>>(dummy);
    private final AtomicReference<LinkedQueue.Node<E>> tail
            = new AtomicReference<LinkedQueue.Node<E>>(dummy);

    public boolean put(E item) {
        LinkedQueue.Node<E> newNode = new LinkedQueue.Node<E>(item, null);
        while (true) {
            LinkedQueue.Node<E> curTail = tail.get();
            LinkedQueue.Node<E> tailNext = curTail.next.get();
            // 这个if检查也很关键
            if (curTail == tail.get()) {
                if (tailNext != null) {
                    // 队列处于中间状态，推进尾节点
                    tail.compareAndSet(curTail, tailNext);
                } else {
                    // 处于稳定状态，尝试插入新节点
                    if (curTail.next.compareAndSet(null, newNode)) {
                        // 插入成功，尝试推进尾节点
                        tail.compareAndSet(curTail, newNode);
                        return true;
                    }
                }
            }
        }
    }
}
```

该算法的基本思路是当链表处于中间状态(尾指针的next不为空)时，由当前线程完成尾指针的设置，使链表恢复为稳定状态。

### 原子的域更新器

在ConcurrentLinkedQueue的实际实现与上一小节的LinkedQueue略有区别，如下代码所示，它并没有将Node的next指针声明为AtomicReference类型而是普通的volatile类型，并使用基于反射的AtomicReferenceFieldUpdater来更新：

```java
private class Node<E> {
    private final E item;
    private valatile Node<E> next;

    public Node(E item) {

    }
}

private static AtomicReferenceFieldUpdater<Node, Node> nextUpdater
    = new AtomicReferenceFieldUpdater
```

在ConcurrentLinkedQueue中，通过nextUpdate的compareAndSet来更新next。虽然代码稍微繁琐，但是它免去了每个Node的AtomicReference创建过程，对于频繁创建生命周期短暂的对象的场景，能够降低插入操作的开销。

### ABA问题

如果内存值由A变为B，再由B变为A，这种情况在某些算法中仍然被认为是发生了变化，但CAS认为没有，这就是ABA问题。一个简单的解决方案是：引入一个版本号，每次更新内存值版本号也更新，同时比较内存值和版本号相同才认为没有发生变化。在JUC中对应的实现是AtomicStampedReference和AtomicmarkableReference类。

## 总结

1. 非阻塞算法通过CAS来实现线程安全性
2. 没有AtomicFloat和AtomicDouble类
3. 在竞争程度中等情况下，使用原子类性能优于锁
4. 非阻塞算法的实现更加困难，见ConcurrentLinkedQueue
5. CAS存在ABA问题，通过引入版本号解决
