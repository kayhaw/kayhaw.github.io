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

    public synchronized void addPerson(Person p) { mySet.add(p); }

    public synchronized boolean containsPerson(Person p) { return mySet.contains(p); }

    interface Person {}
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

## 线程安全性的委托

通过Java监视器模式可以高效地组合多个非线程安全类为一个线程安全类，但是类中的组件已经是线程安全的还需要这样做吗？答案是视情况而定。

### 示例：基于委托的车辆追踪器

将表示车辆位置的类改为不可变的，使用同步容器保存位置信息，代码如下所示：

```java
public class Point {
    public final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
}

public class DelegatingVehicleTracker {
    private final ConcurrentMap<String, Point> locations;   // 写时用
    private final Map<String, Point> unmodifiableMap;       // 读时用，并且限定只能用于读

    public DelegatingVehicleTracker(Map<String, Point> points) {
        locations = new ConcurrentHashMap<String, Point>(points);
        unmodifiableMap = Collections.unmodifiableMap(locations);
    }

    // 返回实时更新的车辆位置集合
    public Map<String, Point> getLocations() { return unmodifiableMap; }

    public Point getLocation(String id) { return locations.get(id); }

    public void setLocation(String id, int x, int y) {
        if (locations.replace(id, new Point(x, y)) == null)
            throw new IllegalArgumentException("invalid vehicle name: " + id);
    }

    // 返回一致的车辆位置集合
    public Map<String, Point> getLocationsAsStatic() {
        return Collections.unmodifiableMap(
                new HashMap<String, Point>(locations));
    }
}
```

Point类不可变，在getLocation方法中返回时就不需要复制而是直接发布。注意getLocations方法返回实时更新的位置集合，getLocationsAsStatic返回状态一致的车辆位置集合。

### 独立的状态变量

当多个状态变量之间互相独立时，可以将线程安全性直接委托给多个状态变量，如下代码所示：

```java
public class VisualComponent {
    private final List<KeyListener> keyListeners
            = new CopyOnWriteArrayList<KeyListener>();
    private final List<MouseListener> mouseListeners
            = new CopyOnWriteArrayList<MouseListener>();

    public void addKeyListener(KeyListener listener) { keyListeners.add(listener); }

    public void addMouseListener(MouseListener listener) { mouseListeners.add(listener); }

    public void removeKeyListener(KeyListener listener) { keyListeners.remove(listener); }

    public void removeMouseListener(MouseListener listener) { mouseListeners.remove(listener); }
}
```

管理键盘监听器和鼠标监听器的列表互相独立且各自线程安全，总体的VisualComponent也是线程安全的。

### 委托失效

现实中的情况不会像VisualComponent那样美满，往往状态变量之间存在不变性条件。如下代码所示，尽管尝试维持lower<=upper的不变性条件，但是还是失败：

```java
public class NumberRange {
    // INVARIANT: lower <= upper
    private final AtomicInteger lower = new AtomicInteger(0);
    private final AtomicInteger upper = new AtomicInteger(0);

    public void setLower(int i) {
        // Warning -- unsafe check-then-act
        if (i > upper.get())
            throw new IllegalArgumentException("can't set lower to " + i + " > upper");
        lower.set(i);
    }

    public void setUpper(int i) {
        // Warning -- unsafe check-then-act
        if (i < lower.get())
            throw new IllegalArgumentException("can't set upper to " + i + " < lower");
        upper.set(i);
    }

    public boolean isInRange(int i) {
        return (i >= lower.get() && i <= upper.get());
    }
}
```

可以通过对lower和upper加锁维护不变性条件以确保线程安全性。当类含有复合操作时，仅靠委托并不足以实现线程安全性，除非状态独立且没有无效状态转换操作。

### 发布底层的状态

将线程安全性委托给某个对象的底层状态时，什么时候可以发布这些变量让其他类能够修改它们？答案取决于这些变量的不变性条件。比如计数器Counter类中的value要求正整数，此时不能发布value。如果变量表示当前温度或最新位置，这种情况下则可以发布。再比如VisualComponent中的keyListeners和mouseListeners，将其访问权限修改为public也无伤大雅。

:::tip 总结
线程安全的状态变量在没有其他不变性条件限制时，并且在操作上也没有任何不允许的状态转换，那么就可以安全地发布这个变量
:::

### 示例：发布状态的车辆追踪器

之前车辆位置类是不可变的，即使发布也没问题。现在将其改为可变的线程安全类：

```java
public class SafePoint {
    private int x, y;

    private SafePoint(int[] a) { this(a[0], a[1]); }

    public SafePoint(SafePoint p) { this(p.get()); }

    public SafePoint(int x, int y) { this.set(x, y); }

    public synchronized int[] get() { return new int[]{x, y}; }

    public synchronized void set(int x, int y) { this.x = x; this.y = y;}
}

public class PublishingVehicleTracker {
    private final Map<String, SafePoint> locations;
    private final Map<String, SafePoint> unmodifiableMap;

    public PublishingVehicleTracker(Map<String, SafePoint> locations) {
        this.locations = new ConcurrentHashMap<String, SafePoint>(locations);
        this.unmodifiableMap = Collections.unmodifiableMap(this.locations);
    }

    public Map<String, SafePoint> getLocations() { return unmodifiableMap; }

    public SafePoint getLocation(String id) { return locations.get(id); }

    public void setLocation(String id, int x, int y) {
        if (!locations.containsKey(id))
            throw new IllegalArgumentException("invalid vehicle name: " + id);
        locations.get(id).set(x, y);
    }
}
```

PublishingVehicleTracker将线程安全性委托给ConcurrentHashMap，现在Map中的元素SafePoint是可变的，getLocation方法发布SafePoint对象，并且提供了修改位置的方法set(int x, int y)。

## 在现有的线程安全类中添加功能

假设要实现一个线程安全的列表，它提供一个原子的Put-If-Absent操作，Java类库的同步List提供了大部分功能，可以使用contains和add方法来实现Put-If-Absent操作。要添加新的原子操作，最安全的方法是修改原始类，但是往往源码不可修改，只能通过其他方式实现，具体的编程实现可以有如下几种：

### 扩展类机制

如下代码所示对Vector类进行扩展，新增putIfAbsent方法：

```java
public class BetterVector <E> extends Vector<E> {
    public synchronized boolean putIfAbsent(E x) {
        boolean absent = !contains(x);
        if (absent)
            add(x);
        return absent;
    }
}
```

扩展类比直接将代码添加到类源码中更“脆弱”，由于代码在不同文件中，可能底层类修改了同步策略并选择了不同的锁，此时子类和父类使用不同的锁，线程安全性得不到保障。

### 客户端加锁机制

通过一个辅助类扩展类功能，代码如下所示是一个错误的示例：

```java
class BadListHelper <E> {
    public List<E> list = Collections.synchronizedList(new ArrayList<E>());

    public synchronized boolean putIfAbsent(E x) {
        boolean absent = !list.contains(x);
        if (absent)
            list.add(x);
        return absent;
    }
}
```

问题在于synchronized的锁是BadListHelper的而不是List的，使用不同锁进行同步，当然线程不安全。正确的代码如下所示：

```java
class GoodListHelper <E> {
    public List<E> list = Collections.synchronizedList(new ArrayList<E>());

    public boolean putIfAbsent(E x) {
        synchronized (list) {
            boolean absent = !list.contains(x);
            if (absent)
                list.add(x);
            return absent;
        }
    }
}
```

正确的客户端加锁是指，对使用对象X的客户端代码，使用X本身用户保护状态的锁来保护客户端代码。客户端加锁比扩展类加锁更“脆弱”，因为将加锁代码放到了和类无关的其他类中，并且**破坏了同步策略的封装性**。

### 组合

当为现有类添加原子操作时，更好的方式是组合。如下代码所示，ImprovedList通过自身内置锁添加了一层额外锁，**此时不必关心底层的list是否线程安全**。虽然额外的一层锁会有轻微的性能损耗，但代码更健壮。

```java
public class ImprovedList<T> implements List<T> {
    private final List<T> list;
    // 前提条件：list是线程安全的
    public ImprovedList(List<T> list) { this.list = list; }

    public synchronized boolean putIfAbsent(T x) {
        boolean contains = list.contains(x);
        if (!contains)
            list.add(x);
        return !contains;
    }
    // 其他委托给list的接口方法
    ...
    public synchronized void clear() { list.clear(); }
}
```

以上代码也是Java监视器模式的体现，只要ImprovedList拥有list的唯一引用，它就是线程安全的。

## 将同步策略文档化

在设计代码时就可以在文档中说明客户代码需要了解的线程安全性保证，以及代码维护人员需要了解的同步策略。设计同步策略的方面包括：

- 哪些变量用volatile表示
- 哪些变量用锁保护
- 哪些变量必须是不可变或者封闭在线程中
- 哪些操作必须是原子的

最起码需要描述线程安全性，包括：

- 类是否线程安全
- 执行回调时是否有锁
- 是否有特定锁会影响行为

如果某个类没有明确声明线程安全，就不要假设它线程安全，比如SimpleDateFormat。如果文档解释含糊，从实现者的角度去猜测线程安全性。

## 总结

1. 基于监视器：普通状态变量使用private final防止逸出，每个访问变量的方法通过synchronized锁保护
2. 基于委托：状态变量本身是线程安全的，访问方法不加锁
3. 委托失效：线程安全的状态变量之间存在不变性条件导致委托失效
4. 不可变条件：即两个状态之间无论怎么变换，它们之间的某种条件关系都成立
5. 扩展线程安全类，一定确保使用同一把锁
6. 使用组合方式扩展当前线程安全类
