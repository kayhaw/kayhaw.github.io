---
layout: article
title: 基础构建模块
permalink: /java-concurrency-in-practice/chap05
tags:
  - Java Concurrency
  - ReadingNotes
---

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
