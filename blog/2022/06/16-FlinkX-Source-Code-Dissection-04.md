---
title: FlinkX源码剖析(4)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - FlinkX
  - Source code dissection
description: FlinkX源码剖析(4)
hide_table_of_contents: false
---

上一篇文章分析了DtOutputFormatSinkFunction，其run方法本质还是调用InputFormat.nextRecord生成输出记录。由于FlinkX连接器插件的xxxInputFormat都继承自定义的BaseRichInputFormat类(继承关系如下图所示)，这篇文章继续按照该图从上到下地解析源码。

![BaseRichInputFormat](/img/blog/FlinkXDissection/BaseRichInputFormat.png)

<!--truncate-->

## InputSplit

InputFormat并不是一股脑地输出所有记录，而是按照某种逻辑划分为split(分片)，只负责分配到自己的split。顾名思义，InputSplit是划分给InputFormat的split的基本抽象，该接口**只定义了一个方法getSplitNumber**，用于返回split的序号：

```java
public interface InputSplit extends Serializable {
  int getSplitNumber();
}
```

## InputSplitSource

InputSplitSource**泛型接口**是创建InputSplit的抽象表达，源码如下：

```java
public interface InputSplitSource<T extends InputSplit> extends Serializable {

  T[] createInputSplits(int minNumSplits) throws Exception;
  
  InputSplitAssigner getInputSplitAssigner(T[] inputSplits);

}
```

- `T[] createInputSplits(int minNumSplits) throws Exception`

创建不少于minNumSplits个的InputSplit，返回数组。

- `InputSplitAssigner getInputSplitAssigner(T[] inputSplits)`

传入InputSplit数组，返回安排哪些InputSplit到哪些InputFormat的分配器InputSplitAssigner，这里又引出了一个新接口。

### InputSplitAssigner

InputSplitAssigner负责将InputSplit分配到数据源的不同实例，定义了如下2个方法：

- `InputSplit getNextInputSplit(String host, int taskId)`

返回指定id任务的下一个InputSplit，如果没有则返回null。**注意这里也将任务示例所处ip也作为参数传入，从而实现本地分配。**

- `void returnInputSplit(List<InputSplit> splits, int taskId)`

**失败回调方法**，由指定id的任务通知InputSplitAssigner哪些InputSplits它处理失败了。

## InputFormat

SourceFunction是Flink**流**数据源的基本接口，而InputFormat接口是**生成记录的数据源的基本接口**(来自源码注释，有点咬文嚼字了)，后者负责如下功能：

- 描述如何将input分成split；
- 描述如何从split中读取记录；
- 描述如何从input中收集统计指标。

具体地，InputFormat生命周期如下：

1. 通过无参构造器实例化，由configure方法进行配置；
2. [可选]生成基本统计指标；
3. 生成InputSplit；
4. 每个并行任务创建一个InputFormat实例，根据指定split配置、打开实例；
5. 从InputFormat中读取记录；
6. 关闭InputFormat。

:::caution 注意
InputFormat示例关闭后必须能够重新打开，因为该示例负责处理**多个**split。当处理完一个split后，InputFormat的close方法被调用，如果有下一个split待处理，重新调用open方法打开。
:::

InputFormat**泛型**接口签名如下，泛型参数OT表示输出类型，T表示InputSplit类型。

```java
public interface InputFormat<OT, T extends InputSplit> 
  extends InputSplitSource<T>, Serializable {
    ...
}
```

InputFormat接口声明如下方法：

- `void configure(Configuration parameters)`

由于InputFormat通过无参构造器实例化，需要通过Configuration提供基本的配置，该方法在InputFormat实例化后立即调用。

- `BaseStatistics getStatistics(BaseStatistics cachedStatistics) throws IOException`

传入缓存统计值，返回最新统计值。可以直接返回null或者cachedStatistics，保证在configure方法之后调用。

- `T[] createInputSplits(int minNumSplits) throws IOException`
- `InputSplitAssigner getInputSplitAssigner(T[] inputSplits)`

继承自InputSplitSource接口的方法，见[InputSplitSource](#inputsplitsource)。

- `void open(T split) throws IOException`

根据指定split分片打开一个并行InputFormat示例，保证在configure方法之后调用。

- `boolean reachedEnd() throws IOException`

检查当前split处理是否已经完毕，保证在configure方法之后调用。

- `OT nextRecord(OT reuse) throws IOException`

输出下一条记录，保证在configure方法之后调用。

- `void close() throws IOException`

当前split处理完毕后调用，用于关闭通道、释放资源。只有当该方法成功返回后，InputFormat才算正确读取记录。

### BaseStatistics

BaseStatistics是InputFormat基本统计指标的抽象接口，声明如下方法：

- `public long getTotalInputSize()`

获取InputFormat总共输出的数据大小(单位：字节)。

- `public long getNumberOfRecords()`

获取InputFormat总共输出的记录条数。

- `public float getAverageRecordWidth()`

获取InputFormat平均输出的记录大小(单位：字节)。

可以发现，统计指标方法返回基本类型而不是包装类，因此不能返回null表示该指标无法统计，BaseStatistics内定义了如下常量来表示这种情况：

```java
/** Constant indicating that the input size is unknown. */
@PublicEvolving public static final long SIZE_UNKNOWN = -1;

/** Constant indicating that the number of records is unknown; */
@PublicEvolving public static final long NUM_RECORDS_UNKNOWN = -1;

/** Constant indicating that average record width is unknown. */
@PublicEvolving public static final float AVG_RECORD_BYTES_UNKNOWN = -1.0f;
```

:::tip
BaseStatistics的源码注释为*Interface describing the basic statistics that can be obtained from the input*，查看OutputFormat源码发现它没有声明getStatistics方法，哪为什么OutputFormat没有指标统计方法？
:::

## RichInputFormat

RichInputFormat**抽象类**实现InputFormat接口(但没有实现其任何方法)，通过添加runtimeContext字段实现对运行上下文环境的访问(即Rich的含义)，并额外添加如下方法：

- `public void setRuntimeContext(RuntimeContext t)`
- `public RuntimeContext getRuntimeContext()`

运行时上下文的setter和getter方法

- `public void openInputFormat() throws IOException`

打开InputFormat实例，**仅在每个并行format实例上调用一次，用于分配资源，比如数据库连接等**。方法体为空，由子类实现。

- `public void closeInputFormat() throws IOException`

关闭InputFormat实例，**仅在每个并行format实例上调用一次，用于关闭openInputFormat中的资源**。方法体为空，由子类实现。

### InputFormat对比RichInputFormat

1. 从继承关系上看，RichInputFormat抽象类实现了InputFormat接口；
2. 从功能特性上看，RichInputFormat引入runtimeContext字段，并通过setter/getter方法实现运行环境的访问；而InputFormat接口**不具备**这种Rich特性；
3. 从声明方法上看，RichInputFormat继承了InputFormat所有方法，但都没有实现；相反，还自行引入了openInputFormat和closeInputFormat方法。

:::tip
InputFormat的open/close方法处理对象是InputSplit(范围的抽象)，但open方法需要传入参数，而RichInputFormat的openInputFormat/closeInputFormat方法处理对象是数据资源(数据库连接等)，且两个方法都是无参。
:::
