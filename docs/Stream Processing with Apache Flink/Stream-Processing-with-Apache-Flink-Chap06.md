---
layout: article
title: Time-Based and Window Operators
permalink: /Stream-Processing-with-Apache-Flink/Chap06
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第6章读书笔记
示例代码见[flink-example](https://github.com/kayhaw/flink-example)
:::

## 设置时间语义

Flink应用的时间语义由StreamExecutionEnvironment的属性timeCharacteristic确定，它可以设置如下枚举值：

1. **TimeCharacteristic.ProcessingTime**：设置时间语义为处理时间，计算结果快但是不准确，会漏掉延迟数据。

2. **TimeCharacteristic.EventTime**：设置时间语义为事件时间，数据自身提供timestamp。Timestamp可以是数据本身的一个字段，也可以在source算子上赋值。计算结果准确，为了处理乱序数据会有延迟。

3. **TimeCharacteristic.IngestionTime**：指定source算子的处理时间为事件时间，可以视为ProcessingTime和EventTime的结合体。

通过~~`env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)`~~指定应用时间语义，但从Flink 1.12起应用的默认时间语义就是**EventTime**，因此setStreamTimeCharacteristic已经过时，不推荐使用。

## 指定timestamp和生成水印

当设置时间语义为事件时间后，需要指定timestamp和生成水印，这里有2种方式实现：

1. 在SourceFunction中设置

2. 调用~~assignTimestampsAndWatermarks(TimestampAssigner)~~方法

根据**水印生成离数据源越近越安全**的原则，调用assignTimestampsAndWatermarks应该紧跟着source方法之后，位于所有基于事件时间的function之前，最好直接在SourceFunction中生成水印。

TimestampAssigner接口还派生出AssignerWithPeriodicWatermarks和AssignerWithPunctuatedWatermarks，表示不同的生成策略。

### ~~周期性水印~~

周期性水印默认每200ms发送一次水印，通过`StreamExecutionEnvironment.getConfig.setAutoWatermarkInterval(int)`设置发送间隔，或者实现AssignerWithPeriodicWatermarks接口的getCurrentWatermark方法。DataStream API还提供如下2个快捷项：

1. 如果确认输入数据的时间戳单调递增，使用快捷方法assignAscendingTimeStamps设置timestamp和水印。

2. 如果数据乱序到达，使用BoundedOutOfOrdernessTimeStampExtractor设置timestamp和水印。

### ~~间断性水印~~

间断性水印的生成由输入数据的某些属性确定，AssignerWithPunctuatedWatermarks接口定义了checkAndGetNextWatermark()方法，该方法在每次的extractTimestamp()调用后执行，如下所示代码在id包含"sensor_1"时产生水印：

```java
public class SensorTimeAssigner implements AssignerWithPunctuatedWatermarks<SensorReading> {
    @Nullable
    @Override
    public Watermark checkAndGetNextWatermark(SensorReading lastElement, long extractedTimestamp) {
        if("sensor_1".equals(lastElement.id)) {
            return new Watermark(extractedTimestamp - 60*1000);
        } else {
            return null
        }
    }

    @Override
    public long extractTimestamp(SensorReading element, long recordTimestamp) {
        return element.timestamp;
    }
}
```

:::caution 注意
AssignerWithPeriodicWatermarks和AssignerWithPunctuatedWatermarks接口已经过时，使用WatermarkStrategy代替。
:::

### 水印，延迟和完整度

水印用于调整延迟和结果完整度的平衡，即算子在等待多久后触发计算。现实中无法设置完美的水印，因为网络等各种因素影响着结果。水印设置过大，等待时间增加，状态变量增大，但结果更准确。水印设置过小，等待时间缩减但结果不准确。

## 处理函数

DataStream API提供了比转换函数更底层的处理函数(Process Function)，其功能更加丰富，比如可以访问timestamp和水印。Flink提供的处理函数有：

- ProcessFunction
- KeyedProcessFunction
- CoProcessFunction
- ProcessJoinFunction
- BroadcastProcessFunction
- KeyedBroadcastProcessFunction
- ProcessWindowFunction

由于这些接口类似，以KeyedProcessFunction为例介绍，该接口提供如下方法：

1. `processElement(I value, Context ctx, Collector<O> out)`：处理流上的每个记录value，将结果输出到out。Context对象提供timestamp和TimerService。
2. `onTimer(long timestamp, OnTimerContext ctx, Collector<O> out)`：设置定时器的回调方法。

### TimerService和Timer

Context和OnTimerContext都包含TimerService对象，它提供如下方法：

- `long currentProcessingTime()`：返回当前处理时间
- `long currentWatermark()`：返回当前水印
- `void registerProcessingTimeTimer(long time)`：注册一个处理时间定时器
- `void registerEventTimeTimer(long time)`：注册一个事件时间定时器
- `void deleteProcessingTimeTimer(long timestamp)`：删除一个处理时间定时器，如果不存在则什么也不做
- `void deleteEventTimeTimer(long timestamp)`：删除一个事件时间定时器，如果不存在则什么也不做

定时器触发后执行`onTimer()`回调，它和`processElement()`是同步的，避免并发访问状态。定时器会和其他状态一起被检查点保存。

### 发送到Side Outputs

通常情况下DataStream API中算子只输出单个流，只有split算子输出多个流(且基本类型不变)。但处理函数特殊之处在于它们有侧输出(Side Output)，并且基本类型可变，如下所示：

```java
DataStream<SensorReading> monitoredReadings = readings.process(new FreezingMonitor());
// 获取侧输出流并打印
monitorReadings.getSideOutput(new OutputTag<String>("freezing-alarms")).print();

public static class FreezingMonitor extends ProcessFunction<SensorReading, SensorReading> {
    OutputTag<String> freezingAlarmOutput = new OutputTag<>("freezing-alarms");

    @Override
    public void processElement(SensorReading value, Context ctx, Collector<SensorReading> out) throws Exception {
        if(value.temperature < 32.0) {
            ctx.output(freezingAlarmOutput, "Freezing Alarm for " + value.id);
        }
        out.collect(value);
    }
}
```

在processElement方法中通过Context.output()发送侧输出数据，侧输出由OutputTag对象标记识别。

### CoProcessFunction

对于处理2个流的底层操作，DataStream API提供CoProcessFunction。和CoMapFunction类似，它提供processElement1()和processElement2()两个方法分别处理每个流的输入。

## 窗口操作

窗口操作使得在无界的流上进行聚合函数计算称为可能，本节介绍如何定义窗口算子、内置窗口类型、窗口可用函数和如何自定义窗口逻辑。

### 定义窗口算子

KeyedStream或者非KeyedStream都可以使用窗口算子，创建窗口算子需要指定如下两个组件：

1. Window Assigner：决定元素如何组成窗口，即生成WindowedStream或者AllWindowedStream(在非KeyedStream上)。

2. Window Function：处理WindowedStream或者AllWindowedStream的元素

如下所示为窗口操作和窗口函数使用的伪代码：

```java
// define a keyed window operator
stream
  .keyBy(...)                 
  .window(...)                   // specify the window assigner
  .reduce/aggregate/process(...) // specify the window function

// define a nonkeyed window-all operator
stream
  .windowAll(...)                // specify the window assigner
  .reduce/aggregate/process(...) // specify the window function
```

### 内置Window Assigner

Flink内置了许多Window Assigner满足不同使用场景，本节讨论基于时间的窗口操作(基于计数的窗口操作结果不准确)。每个窗口都有一个开始时间和一个结束时间，窗口的范围是**左闭右开**。以下介绍内置的开窗算子：

- 滚动窗口

滚动窗口算子将元素分为固定大小，互不重叠的窗口，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Tumbling-Window-Assigner-Example.png" title="A Tumbling Window Assigner Example" />

对于事件时间语义和处理时间语义，DataStream API分别提供TumblingEventTimeWindows和TumblingProcessingTimeWindows。使用其静态方法`of(Time size, Time offset)`指定窗口大小和偏移量，代码如下所示：

```java
sensorData.keyBy(r -> r.id)
          // timeWindow(Time.seconds(1))已过时，它实际上是下面代码的封装
          .window(TumblingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))
          .process(new TemperatureAverager());
```

滚动窗口默认和1970-01-01 00:00:00对齐，以上示例代码定义了[00:15:00-01:15:00)，[00:15:00-02:15:00)...窗口。

- 滑动窗口

滑动窗口算子将元素分为固定大小，偏移指定大小的窗口，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Sliding-Window-Assigner-Example.png" title="A Sliding Window Assigner Example" />

滚动窗口需要指定窗口大小size和滑动步长slide。**如果slide小于size，那么会有一些元素属于两个窗口，如果slide大于size，那么会有一些元素没有包含在窗口中。**如下代码演示大小为1个小时，步长为15分钟的滑动窗口操作：

```java
sensorData.keyBy(r -> r.id)
          .window(SlidingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))
          .process(new TemperatureAverager());
```
