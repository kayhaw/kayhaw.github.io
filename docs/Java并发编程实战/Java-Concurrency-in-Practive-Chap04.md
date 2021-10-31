---
layout: article
title: 对象的组合
permalink: /java-concurrency-in-practice/chap04
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第四章读书笔记
:::

## 设计线程安全的类

设计线程安全类的过程可以分为如下3个步骤：

1. 找出构成对象状态的所有变量：基本类型的字段，如果是引用类型字段，还要继续看引用对象的状态
2. 找出约束状态变量的不可变条件
3. 建立对象状态的并发管理策略

### 收集同步需求

了解类的不变性条件和后验条件，并以此做出限制。不变性条件和后验条件约束对象的状态转换，通过原子性操作和封装实现。

### 依赖状态的操作

类的不变性条件和后验条件指出哪些状态和状态转换是有效的，另外类方法也依赖着一些先验条件，称为依赖状态的操作。比如不能从空队列中移除元素，单线程环境下不能满足先验条件的操作只能失败，在并发环境中其他线程操作可以使先验条件为真，但期间线程要一直等待。Java提供阻塞队列来实现依赖状态的方法。

### 状态的所有权

在定义构成对象状态的变量时，只考虑对象拥有的数据。对象封装它拥有的状态，反之也对它封装的状态拥有所有权。

## 实例封闭

封装简化了线程安全类的实现过程，它提供了一种实例封闭机制。通过将数据的访问限制在对象方法上，从而更容易确保线程访问时总持有正确的锁，被封闭的对象一定不能超过它们既定的作用域。如下代码所示，通过将mySet限定为private(不会逸出)，只提供addPerson和containsPerson访问mySet，并且它们在执行时必须获得PersonSet上的锁，即PersonSet状态完全由其内置锁保护，因此PersonSet类是线程安全的。

```java
public class PersonSet {
    private final Set<Person> mySet = new HashSet<Person>();

    public synchronized void addPerson(Person p) {
        mySet.add(p);
    }

    public synchronized boolean containsPerson(Person p) {
        return mySet.contains(p);
    }

    interface Person {
    }
}
```

实例封装是构建线程安全类的最简单方法，它还使在锁策略上有更多选择，只要确保是同一个锁即可保护状态。

### Java监视器模式

Java监视器模式值对象将所有可变状态封装起来，并由自己的内置锁来保护。如下代码所示通过使用私有锁来保护状态：

```java
public class PrivateLock {
    private final Object myLock = new Object();
    Widget widget;

    void someMethod() {
        synchronized (myLock) {
            // Access or modify the state of widget
        }
    }
}
```

使用私有锁的好处在于将锁封装起来，在验证锁是否正确被使用时，不需要查看整个程序而是单个类。

### 示例：车辆追踪

假设一个GUI程序需要展示车辆位置，或者根据输入更改车辆位置，使用Java监视器模式的代码如下所示：

```java
public class MonitorVehicleTracker {
    private final Map<String, MutablePoint> locations;

    public MonitorVehicleTracker(Map<String, MutablePoint> locations) {
        this.locations = deepCopy(locations);
    }

    public synchronized Map<String, MutablePoint> getLocations() {
        return deepCopy(locations);
    }

    public synchronized MutablePoint getLocation(String id) {
        MutablePoint loc = locations.get(id);
        return loc == null ? null : new MutablePoint(loc);
    }

    public synchronized void setLocation(String id, int x, int y) {
        MutablePoint loc = locations.get(id);
        if (loc == null)
            throw new IllegalArgumentException("No such ID: " + id);
        loc.x = x;
        loc.y = y;
    }

    private static Map<String, MutablePoint> deepCopy(Map<String, MutablePoint> m) {
        Map<String, MutablePoint> result = new HashMap<String, MutablePoint>();

        for (String id : m.keySet())
            result.put(id, new MutablePoint(m.get(id)));

        return Collections.unmodifiableMap(result);
    }
}

public class MutablePoint {
    public int x, y;

    public MutablePoint() {
        x = 0;
        y = 0;
    }

    public MutablePoint(MutablePoint p) {
        this.x = p.x;
        this.y = p.y;
    }
}
```

虽然MutablePoint类不是线程安全的，但MonitorVehicleTracker却是。当获取车辆位置信息时，通过MutablePoint的拷贝构造函数来返回。这种通过复制可变数据的方式会产生数据延迟更新的情况，如果需要locations内部保持一致性那是优点，如果需要每辆最新信息那么就是缺点。
