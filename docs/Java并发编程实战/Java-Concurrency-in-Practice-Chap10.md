---
layout: article
title: 避免活跃性危险
permalink: /java-concurrency-in-practice/chap10
tags:
  - Java Concurrency
  - ReadingNotes
---

:::info
《Java并发编程》第十章读书笔记
:::

线程安全性和活跃性互相制衡，加锁可以确保线程安全，但是过度加锁会导致死锁。本章讨论导致活跃性故障的问题，以及如何避免。

## 死锁

线程A持有锁a想获得锁b，线程B持有锁b想获取锁a，这种循环依赖等待的情况就是最简单的死锁。在数据库系统设计中考虑了死锁检测和修复：通过在事务等待锁关系的有向图中搜索环来判断是否产生死锁，发现后则牺牲一个事务释放锁，从而让其他事务继续进行。然而，JVM并没有提供解决死锁的能力，此时程序会完全停止或子系统停止，或性能降低，解决的唯一方式就是重启应用。

### 锁顺序死锁

如下代码所示演示了一个简单的锁顺序死锁：当两个线程分别调用leftRight和rightLeft方法，并且交错执行时就会产生死锁。

```java
public class LeftRightDeadlock {
    private final Object left = new Object();
    private final Object right = new Object();

    public void leftRight() {
        synchronized (left) {
            synchronized (right) {
                doSomething();
            }
        }
    }

    public void rightLeft() {
        synchronized (right) {
            synchronized (left) {
                doSomethingElse();
            }
        }
    }
}
```

LeftRightDeadLock引起死锁的原因是两个线程试着以不同顺序来获得相同的锁，如果**所有**线程都以固定的顺序获取锁将不会出现顺序死锁问题。

### 动态的顺序死锁

有些时候加锁的顺序并不是由代码确定的，如下账户转钱方法。看起来只调用一个方法，因此每个线程加锁的顺序都是一样的(先fromAccount后toAccount)，但实际上加锁顺序取决于传入参数顺序。如果线程A从X向Y转账，同时线程B从Y向X转账，那么就会发生死锁。

```java
public static void transferMoney(Account fromAccount,
                                 Account toAccount,
                                 DollarAmount amount)
          throws InsufficientFundsException {
      synchronized (fromAccount) {
          synchronized (toAccount) {
              if (fromAccount.getBalance().compareTo(amount) < 0)
                  throw new InsufficientFundsException();
              else {
                  fromAccount.debit(amount);
                  toAccount.credit(amount);
              }
          }
      }
  }
```

要解决锁顺序死锁问题，就必须定义加锁的顺序。一种方式是通过System.identityHashCode来指定加锁顺序，代码如下所示：

```java
public class InduceLockOrder {
    private static final Object tieLock = new Object();

    public void transferMoney(final Account fromAcct,
                              final Account toAcct,
                              final DollarAmount amount)
            throws InsufficientFundsException {
        class Helper {
            public void transfer() throws InsufficientFundsException {
                if (fromAcct.getBalance().compareTo(amount) < 0)
                    throw new InsufficientFundsException();
                else {
                    fromAcct.debit(amount);
                    toAcct.credit(amount);
                }
            }
        }
        int fromHash = System.identityHashCode(fromAcct);
        int toHash = System.identityHashCode(toAcct);

        if (fromHash < toHash) {
            synchronized (fromAcct) {
                synchronized (toAcct) {
                    new Helper().transfer();
                }
            }
        } else if (fromHash > toHash) {
            synchronized (toAcct) {
                synchronized (fromAcct) {
                    new Helper().transfer();
                }
            }
        } else {
            synchronized (tieLock) {
                synchronized (fromAcct) {
                    synchronized (toAcct) {
                        new Helper().transfer();
                    }
                }
            }
        }
    }
}
```

:::tip identityHashCode方法和hashCode方法比较

1. null不能调用hashCode方法，System.identityHashCode(null)返回0
2. identityHashCode是静态native方法，hashCode是Object示例方法
3. hashCode方法可以被重写修改返回值，identityHashCode返回值不变
:::

注意，在极少数情况下，两个对象还是会有相同的hash值。为此，再引入一个额外的“加时赛”(Tie Breaking)锁tieLock：在获取两个Account锁之前，线程需要先获得这个加时锁，从而确保每次只有一个线程能以特定的顺序获得这两个锁。如果hashcode冲突频率很高，相当于程序只加了一把锁，降低了并发性，实际上System.identityHashCode发生哈希冲突的概率极低。如果Account包含**唯一的、不可变的**主键id，此时不需要加时赛锁。

### 在协作对象之间发生的死锁

获取多个锁的代码并不会向LeftRightDeadLock或者transferMoney那样明显。如下代码所示，出租车到达目的地后向车队(dispatcher)报告，此时先获取Taxi锁再获取Dispatcher，而执行getImage的线程获取锁顺序恰恰相反，就有可能产生死锁。

:::tip
在持有锁的同时调用外部方法，要警惕活跃性问题：外部方法可能获取其他锁或者阻塞过长，导致其他线程无法获取当前锁。
:::

```java
public class CooperatingDeadlock {
    // Warning: deadlock-prone!
    class Taxi {
        private Point location, destination;
        private final Dispatcher dispatcher;

        public Taxi(Dispatcher dispatcher) {
            this.dispatcher = dispatcher;
        }

        public synchronized Point getLocation() {
            return location;
        }

        public synchronized void setLocation(Point location) {
            this.location = location;
            if (location.equals(destination))
                dispatcher.notifyAvailable(this);
        }
        // ... 忽略同步的destination getter setter
    }

    class Dispatcher {
        private final Set<Taxi> taxis;
        private final Set<Taxi> availableTaxis;

        public Dispatcher() {
            taxis = new HashSet<Taxi>();
            availableTaxis = new HashSet<Taxi>();
        }

        public synchronized void notifyAvailable(Taxi taxi) {
            availableTaxis.add(taxi);
        }

        public synchronized Image getImage() {
            Image image = new Image();
            for (Taxi t : taxis)
                image.drawMarker(t.getLocation());
            return image;
        }
    }
}
```

### 开放调用

调用某个方法时不需要持有锁，称之为开放调用。将setLocation和getImage修改为开放调用后的代码如下所示：

```java
public void setLocation(Point location) {
    boolean reachedDestination;
    synchronized (this) {
        this.location = location;
        reachedDestination = location.equals(destination);
    }
    if (reachedDestination)
        dispatcher.notifyAvailable(this);
}

public Image getImage() {
    Set<Taxi> copy;
    synchronized (this) {
        copy = new HashSet<Taxi>(taxis);
    }
    Image image = new Image();
    for (Taxi t : copy)
        image.drawMarker(t.getLocation());
    return image;
}
```

开放调用的本质：确定共享状态操作的最小代码块，然后将同步方法修改为包含同步代码块的普通方法。重写同步方法以使用开发调用会将原子操作修改为**非原子的**，要判断是否能够接受这种变化(对于更新车辆信息和通知调度中心该车可用，这种情况就是可接受的)。注意，在会产生死锁的版本中，getImage生成某个时刻下整个车队位置的快照，而开放调用的版本生成每辆车不同时刻的位置快照。

:::tip
在程序应该尽量使用开放调用，因为它更容易进行死锁分析。
:::

### 资源死锁

**当线程在相同的资源集合上等待时，也会发生死锁**。例如线程A持有数据库D1连接，等待与数据库D2连接，而线程B相反。如果资源池有N个连接，要产生死锁不仅要N个等待线程，还需要大量不恰当执行顺序。另一种资源死锁形式是第8章中的线程饥饿死锁。

## 死锁的避免与诊断

两阶段策略检查死锁：找到获取多个锁的地方，全局分析确保加锁顺序保持一直，使用开放调用可以简化发现获取多个锁的实例。

### 支持定时的锁

使用带超时时间的Lock.tryLock方法来获取锁，超过等待时间后该方法返回失败信息。在获取定时锁失败时，可以重新启动计算而不是关闭整个程序。

### 通过线程Dump信息来分析死锁

Thread Dump包含每个线程持有哪些锁，在哪些栈帧中获取锁，以及被阻塞的线程正在等待哪一个锁。在UNIX下，使用命令`kill -3 进程号`或者按下Ctrl-\键，在Windows下按Ctrl-Break键。

## 其他线程活跃性危险

除了死锁外，并发程序还存在其他活跃性危险，以下介绍：

### 饥饿

线程由于无法访问它所需要的资源而不能继续执行。引发饥饿额常见资源就是CPU时钟周期，例如使用不恰当的线程优先级。因此，在编程时避免使用线程优先级，用默认的线程优先级即可。

### 槽糕的响应性

例如在GUI程序中使用后台线程，此时为了提高响应性应该降低后台线程的优先级。

### 活锁

多个互相协作的线程对彼此进行响应从而修改各自的状态，导致所有线程都无法继续执行。好比两个礼貌的行人在一条路上相遇，两人都换到另一条路又相遇，如此循环。

活锁通常发生在处理事务消息的应用中：消息处理器在处理某个特定消息时失败，进行事务回滚重新放到消息队首，不断循环处理。解决活锁问题，需要在重试机制中加入随机性，比如等待随机长度时间再处理。

## 总结

1. 通过计算hashcode得到偏序关系来设置加锁的顺序，从而避免死锁，如果hashcode相同，额外使用一个锁
2. 锁顺序死锁和资源死锁的区别：前者在两条线程以特定顺序执行操作时出现，后者出现概率受资源池大小和线程数量影响
3. 活跃性危险：死锁、饥饿、活锁。死锁是直接阻塞线程，饥饿是资源不够导致线程不能执行，活锁不阻塞线程
