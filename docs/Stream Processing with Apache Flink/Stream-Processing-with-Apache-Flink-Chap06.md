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
