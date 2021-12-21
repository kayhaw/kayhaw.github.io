---
layout: article
title: Stateful Operators and Applications
permalink: /Stream-Processing-with-Apache-Flink/Chap07
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第7章读书笔记
示例代码见[flink-example](https://github.com/kayhaw/flink-example)
:::

本章介绍如何实现有状态的用户自定义函数，并讨论有状态应用的性能和健壮性。

## 实现有状态函数

在状态管理中介绍到函数状态可分为键控状态和算子状态两类，Flink提供多种接口来定义有状态函数。

### 在RuntimeContext中声明键控状态

键控状态(Keyed State)类似分布式KV存储，每个函数实例负责维护状态的一部分。**键控状态只用于处理KeyedStream的函数**，Flink提供如下键控状态原语：

1. **`ValueState<T>`**：维护单个值的状态，通过`ValueState.value()`和`ValueState.update(T value)`分别获取、更新状态。
2. **`ListState<T>`**：以链表形式维护多个值的状态，通过`ListState.add(T value)`、`ListState.addAll(List<T> values)`添加值，通过`ListState.get()`获取到所有值的迭代器`Iterable<T>`，通过`ListState.update(List<T> values)`更新状态。
3. **`MapState<K, V>`**：以map形式维护多个值的状态，提供`get(K key)`、`put(K key, V value)`、`contains(K key)`、 `remove(K key)`方法获取更新值。
4. **`ReducingState<T>`**：和ListState类似，但没有addAll()和update()方法，通过ReduceFunction计算得到一个聚合结果value，通过get()方法返回只含有value的Iterable。
5. **`AggregatingState<I, O>`**：和ReducingState类似，使用AggregateFunction计算得到一个结果value，通过get()方法返回只含有value的Iterable。

所有的状态原语通过State.clear()方法清空内容。代码`TemperatureAlert.java`演示如何使用状态保存上一个温度，并在温度差大于指定值时发出报警。

通过StateDescriptor对象获取状态句柄xxxState，描述符包含状态名称和状态数据类型(Class或者TypeInformation)。状态数据类型必须指定，因为Flink需要创建合适的序列化器。

通常状态句柄在RichFunction的open()方法中创建，它仅是状态句柄并不包含状态自身。当函数注册StateDescriptor后，Flink会从状态后端查找是否存在相同名称和类型的状态，如果有的话将状态句柄指向状态，否则返回空。

### 使用ListCheckpointed接口实现算子列表状态

在状态管理中提到，Flink支持3种算子状态：list state、list union state和broadcast state。其中，函数通过实现ListCheckpointed接口来使用list state：

```java
public interface ListCheckpointed<T extends Serializable> {
  // 返回状态快照
  List<T> snapshotState(long checkpointId, long timestamp) throws Exception;
  // 恢复状态
  void restoreState(List<T> state) throws Exception;
}
```

代码`chap7/HighTempCounter.java`演示使用RichFlatMapFunction和ListCheckpointed来计算高于某个温度值的传感器温度个数。**由于算子缩放时需要合并或拆分状态，因此算子状态以列表形式存在而不是单个值。**

:::caution ListCheckpointed和CheckedpointedFunction
ListCheckpointed接口使用Java自带序列化机制，不支持状态迁移或者自定义序列化，使用CheckpointedFunction代替。
:::
