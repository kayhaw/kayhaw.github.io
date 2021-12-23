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

### 使用连接广播状态

广播状态顾名思义：每个任务示例都得到该状态的一份拷贝，适用于DataStream和KeyedStream。

BroadcastProcessFunction、KeyedBroadcastProcessFunction与CoProcessFunction的不同之处在于它们的处理函数processElement()和processBroadcastElement()不是对称的，尽管两者的Context参数都能提供getBroadcastState(MapStateDescriptor)返回状态句柄，但是processElement()的状态句柄是只读的。

### 使用CheckpointedFunction接口

CheckpointedFunction是实现**有状态函数的最底层接口**，它支持键控状态和算子状态，并且是唯一能访问list union状态的接口：

```java
public interface CheckpointedFunction {
    void snapshotState(FunctionSnapshotContext context) throws Exception;

    void initializeState(FunctionInitializationContext context) throws Exception;
}
```

- initializeState(FunctionInitializationContext context)：context对象提供OperatorStateStore和KeyedStateStore对象的访问，在task启动或者重启时调用。当函数注册状态，State store尝试从状态后端中恢复，如果是从保存点中恢复，状态初始化为上一次保存结果，如果状态后端没有，则初始化为空。

- snapshotState(FunctionSnapshotContext context)：在检查点保存之前执行，context提供检查点id和时间戳。结合CheckpointListener接口，该方法可以将一致性状态写入到外部存储。

### 接收检查点完成的通知

为了减少同步的性能开销，Flink设计屏障机制让算子异步地执行检查点保存，当所有算子都完成检查点保存后才算一次成功的检查点保存。因此，只有JobManager才知道检查点是否成功。

对于需要了解检查点是否完成的算子，需要实现CheckpointListener接口，该接口提供notifyCheckpointComplete(long chkpntId)方法作为检查点成功的回调。

:::danger 小心
Flink并不保证每一次成功的检查点都会回调notifyCheckpointComplete()。
:::

## 为有状态应用开启故障恢复

在*检查点，保存点和状态恢复*中介绍了Flink创建一致性检查点的机制，JobManager周期性地进行检查点保存，间隔时间通过如下代码指定：

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.enableCheckpointing(10_000L);
```

检查点设置还有更多的调优项，比如一致性保证策略(精准一次还是至少一次)、检查点并发数、检查点保存超时时间等，这些在*检查点和故障恢复调优*中详细介绍。

## 确保有状态应用的可维护性

有状态应用可能执行数周，期间需要修改BUG、调整功能、缩放算子等操作，因此应用状态的迁移十分重要。Flink提供保存点来实现，同时要求所有状态提供如下两个参数：唯一的算子id和最大并行度。本节介绍如何设置这两个参数。

### 指定唯一的算子id

应用的每个算子都应该指定一个唯一的id，它作为元数据写入到保存点中。通过`uid()`方法指定：

```java
DataStream<Tuple3<String, Double, Double>> alerts =
    sensorData.keyBy(r -> r.id)
        .flatMap(new TemperatureAlertFunction(1.7))
        .uid("TempAlert");
```

### 定义键控状态算子的最大并发度

算子的最大并发度定义键控状态划分的组数，通过StreamExecutionEnvironment全局地设置最大并发数，或者在每个算子上设置：

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
// 通过env设置每个算子的最大并发度
env.setMaxParallelism(512);
// 单独设置算子的最大并发度
DataStream<Tuple3<String, Double, Double>> alerts = keyedSensorData
  .flatMap(new TemperatureAlertFunction(1.1))
  .setMaxParallelism(1024);
```

算子默认的最大并发度max取决于第一版应用的算子并发度p：如果p小于等于128，max等于128；否则max=Min(2^15, nextPowerOfTwo(p+p/2))。

## 有状态应用的性能和健壮性

算子和状态交互的方式影响着应用的性能和健壮性，比如状态后端的选择、检查点算法配置、应用状态大小等。本节介绍如何确保长时间运行应用的健壮性和性能。

### 选择状态后端

状态后端是可插拔的——两个应用可以使用不同的状态后端实现，Flink目前提供如下3种状态后端：

- **MemoryStateBakcend**：将状态以常规对象的形式存储在TaskManager的堆中。
  - 优点：读写状态时延迟低
  - 缺点：影响应用健壮性，如果状态过大会造成OOM，垃圾回收的暂停，易失性
  - 总结：仅在开发和调试时使用
- **FsStateBackend**：本地状态和MemoryStateBakcend一样放在TM的堆中，状态检查点保存在远程持久化文件系统中。
  - 优点：兼具本地状态读写快和故障容错性
  - 缺点：受TM内存大小限制，可能还是会受到垃圾回收暂停的影响
- **RocksDBStateBackend**：将状态保存到**本地的**RocksDB实例中，状态检查点保存在远程持久化文件系统中。
  - 优点：支持增量检查点，适用于状态巨大的应用
  - 缺点：读写数据需要序列化/反序列化，相比于在堆中维护开销更高

自定义状态后端只需要实现StateBackend接口，如下所示代码使用RocksDBStateBackend：

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
String checkpointPath = ...
// configure path for checkpoints on the remote filesystem
StateBackend backend = new RocksDBStateBackend(checkpointPath)
// configure the state backend
env.setStateBackend(backend)
```

### 选择状态原语

对于需要序列化/反序列化状态对象的状态后端，状态原语的选择对应用的性能也有很大影响。以RocksDBStateBackend为例，读取ValueState各需要反序列化/序列化一次，读ListState需要对列表的每一项反序列化，而添加一个状态只需要序列化一个对象，读写MapState需要对key和value相对应的序列化/反序列化。因此，使用`MapState<X, Y>`比使用`ValueState<HashMap<X, Y>>`更高效，在写频率大于读频率时，使用`ListState<X>`比`ValueState<List<X>>`更高效。

### 防止内存溢出

Flink并不能自动清理状态、释放内存，因此算子需要控制状态大小防止内存溢出。状态不断增大的一个常见原因是键控状态，函数不确定当前记录是否为对应键的最后一条， 因此会一直保留键控状态。

这个问题不仅出现在自定义状态函数上，也存在于DataStream API的内置算子中。比如在KeyedStream上的min、max等内置聚合操作，它们都会保存每个key对应的状态信息而不会丢弃，**因此使用这些函数需要确保key域是有限的**。

如果key是动态变化的，可以通过定时器清理键控状态，示例代码见`SelfCleaningTemperatureAlert.java`。

## 升级状态应用

状态应用的升级通过兼容的保存点来完成，分为如下3种情况：

1. 不修改、删除状态，只是修改应用逻辑，可以新增状态
2. 删除状态
3. 修改状态：更新状态原因、更新状态基本类型

### 在不修改现有状态下更新应用

没有删除、改变现有状态，应用一直是保存点兼容的，可以从旧版本中恢复。如果添加了新状态，状态将会初始化为空。

:::caution 不能改变算子的基本类型
修改算子的基本类型往往意味着修改内部状态，因此不是保存点兼容的。
:::

### 从应用中删除装状态

默认情况下，删除状态意味着不是所有保存点状态都复原，此时Flink不会启动应用。可以禁用这个安全选项，此时升级应用时可行的。

### 修改算子状态

**添加、删除状态并不会影响保存点兼容型**，但是修改算子状态更复杂，有2种方式修改算子状态：

- 修改状态的数据类型，比如从`ValueState<Int>`到`ValueState<Double>`。
- 修改状态原语的类型，比如从`ValueState<List<String>>`到`ListState<String>`。

修改状态的数据类型是可行的，但是Flink目前不支持修改状态的原语。以下重点介绍修改状态的数据类型：

以`Value<String>`为例，当保存状态时，FLink根据状态数据类型String使用StringSerializer将String对象转为字节。如果将状态改为`Value<Double>`，那么Flink使用DoubleSerializer反序列化字节，显然这种操作会失败。

## 查询状态

许多应用需要和其他应用共享结果，一种常用方式是把结果写到数据库中让其他应用获取结果，但这意味着需要在维护一套单独的系统，Flink提供**可查询状态(Query State)**来处理。

任何键控状态都可以通过**只读K-V存储**的形式暴露，外部应用可以在流应用还在运行时访问状态。注意，可查询状态不能解决所有需要外部存储的问题，当应用重启、缩放或者迁移时状态不可访问，**只支持单点查询而不是范围查询**，一般用于实现实时的监控应用。

### 状态查询架构

如下图所示，Flink的可查询状态服务分为如下3个进程：

- **QueryableStateClient**：外部应用请求和获取状态的客户端。
- **QueryableStateClientProxy**：每个TaskManager运行一个客户端代理，由于键控状态分布在各个算子示例，代理向JobManager请求键控组信息并缓存，然后从state server中获取状态。
- **QueryableStateServer**：每个TaskManager都运行一个状态server，处理客户端代理的请求，返回状态信息。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap07/Architecture-of-Flink's-Queryable-State-Service.png" title="Architecture of Flink's Queryable State Service" />

为了开启状态查询服务，需要将`$FLINK_HOME/lib/flink-queryable-state-runtime_xx.jar`复制到`$FLINK_HOME/lib`目录下，该jar包在classpath中时，状态查询线程会自动启动开启服务。
