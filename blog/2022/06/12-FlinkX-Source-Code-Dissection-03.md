---
title: FlinkX源码剖析(3)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - FlinkX
  - Source code dissection
description: FlinkX源码剖析(3)
hide_table_of_contents: false
---

## DtInputFormatSourceFunction

对于JDBC读插件工厂类JdbcSourceFactory，其createSource方法调用createInput方法，返回DataStream完成输入流接入，代码如下：

```java
protected DataStream<RowData> createInput(
        InputFormat<RowData, InputSplit> inputFormat, String sourceName) {
    Preconditions.checkNotNull(sourceName);
    Preconditions.checkNotNull(inputFormat);
    /**
      * 构造source算子提供一个InputFormat和一个TypeInformation
      * DtInputFormatSourceFunction类没有被继承，
      * 因此是所有数据源SourceFunction的包装类
      * 它封装了inputFormat和TypeInformation，产生数据流由inputFormat提供
      * 所以inputFormat才是sourceconnector异化的本质
      */
    DtInputFormatSourceFunction<RowData> function =
            new DtInputFormatSourceFunction<>(inputFormat, getTypeInformation());
    // 添加source算子，算子名称是工厂类名的全小写模式，如mysqlsourcefactory
    return env.addSource(function, sourceName, getTypeInformation());
}
```

由于JdbcSourceFactory的子类如MysqlSourceFactory等都没有重写createSource方法，因此env.addSource添加的SourceFunction都是DtInputFormatSourceFunction，只不过各子类inputFormat不同而表现差异化。DtInputFormatSourceFunction类继承关系如下图所示，本篇文章就其涉及的Flink核心类按从上到下的顺序进行源码解析(主要是注释翻译吧:smile:)，进一步熟悉Flink API。

![DtInputFormatSourceFunction](/img/blog/FlinkXDissection/DtInputFormatSourceFunction.png)

## Function

Function接口位于org.apache.flink.api.common.functions包下，是Flink用户自定义函数(UDF)的最基本接口。但该接口本身**没有声明任何方法**，这样其子接口就可以只添加一个方法声明(Single Abstract Method)从而可以使用Java 8 Lambda语法。

```java
/**
 * The base interface for all user-defined functions.
 *
 * <p>This interface is empty in order to allow extending interfaces to be SAM (single abstract
 * method) interfaces that can be implemented via Java 8 lambdas.
 */
@Public
public interface Function extends java.io.Serializable {}
```

## RichFunction

RichFunction接口继承自Function接口，是所有富用户自定义函数(rich user-defined functions)的基础接口。**富**函数的rich表现在其声明了多个管理function生命周期的方法，**以及能够访问function所处context的方法**：

- `void open(Configuration parameters) throws Exception`

函数的初始化方法，在计算方法(如map、join)前被调用，用于**一次性的设置工作**。传入的parameters参数提供初始化的各项设置值，一般实现子类不会在该函数做任何事。

```java
public class MyFilter extends RichFilterFunction<String> {
  private String searchString;
  public void open(Configuration parameters) {
    this.searchString = parameters.getString("foo");
  }
    
  public boolean filter(String value) {
    return value.equals(searchString);
  }
}
```

- `void close() throws Exception`

函数的卸载方法，用于计算后的清理工作。

- `RuntimeContext getRuntimeContext()`

获取函数的运行时上下文环境RuntimeContext，它包含函数的并发数(parallelism)、子任务序号、任务名称等信息。同时RuntimeContext也提供Accumulator(累加器)和DistributedCache(分布式缓存)。

- `IterationRuntimeContext getIterationRuntimeContext()`

获取迭代RuntimeContext，包含函数执行的迭代信息。只有在函数使用迭代算法时([IterateExample.java](https://github.com/apache/flink/blob/master/flink-examples/flink-examples-streaming/src/main/java/org/apache/flink/streaming/examples/iteration/IterateExample.java))才有用，否则抛出异常。

- `void setRuntimeContext(RuntimeContext t)`

设置函数的上下文，由Flink框架调用。

## SourceFunction

SourceFunction接口也继承自Function，是所有source数据流的接口。当需要发送数据时，SourceFunction的run方法被调用，通过循环不断地生成数据，调用cancel方法后循环被打断。

- `void run(SourceContext<T> ctx) throws Exception`

开启source数据流，通过ctx发送数据，注意实现检查点的SourceFunction必须使用同步锁来发送数据。

- `void cancel()`

取消source数据流。一般run方法实现是通过while循环发送数据，而cancel方法调用后while循环会被中断。典型实现是将声明为volatile的boolean变量isRunning设置为false，而该变量作为run方法中while循环的条件控制。当source数据流取消后，运行线程会抛出中断异常，因此中断处理器可以判断cancel方法已经执行完毕，建议将运行状态变量声明为volatile以确保可见性。

### CheckpointedFunction

当SourceFunction实现检查点功能时，需要额外实现CheckpointedFunction接口。此时要确保状态更新和发送元素不会同时发生，Flink通过检查点锁对象来将两者隔离开：

```java
public class ExampleCountSource implements SourceFunction<Long>, CheckpointedFunction {
  private long count = 0L;
  private volatile boolean isRunning = true;

  private transient ListState<Long> checkpointedCount;

  public void run(SourceContext<T> ctx) {
    while (isRunning && count < 1000) {
      // this synchronized block ensures that state checkpointing,
      // internal state updates and emission of elements are an atomic operation
      synchronized (ctx.getCheckpointLock()) {
        ctx.collect(count);
        count++;
      }
    }
  }

  public void cancel() {
    isRunning = false;
  }

  public void initializeState(FunctionInitializationContext context) {
    this.checkpointedCount = context
        .getOperatorStateStore()
        .getListState(new ListStateDescriptor<>("count", Long.class));

    if (context.isRestored()) {
      for (Long count : this.checkpointedCount.get()) {
        this.count += count;
      }
    }
  }

  public void snapshotState(FunctionSnapshotContext context) {
    this.checkpointedCount.clear();
    this.checkpointedCount.add(count);
  }
}
```

### SourceContext

SourceFunction接口内部自带SourceContext接口，声明如下方法：

- `void collect(T element)`：从source数据流发送一个元素。

- `void collectWithTimestamp(T element, long timestamp)`：从source数据流发送一个元素，同时给该元素打上时间戳，**仅在EventTime语义下有效**。

- `void emitWatermark(Watermark mark)`：发送指定水印，水印t表示早于时间t的元素都已经发送，之后时间早于t的元素视为延迟数据，**仅在EventTime语义下有效**。

- `void markAsTemporarilyIdle()`：标记source数据流会暂时停止发送元素和水印，**仅在IngestionTime语义下有效**。

- `Object getCheckpointLock()`：获取检查点同步锁。

- `void close()`：关闭上下文环境。
