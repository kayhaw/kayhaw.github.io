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

### 使用窗口算子

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

滚动窗口分配器将元素分为固定大小，互不重叠的窗口，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Tumbling-Window-Assigner-Example.png" title="A Tumbling Window Assigner Example" />

对于事件时间语义和处理时间语义，DataStream API分别提供TumblingEventTimeWindows和TumblingProcessingTimeWindows。使用其静态方法`of(Time size, Time offset)`指定窗口大小和偏移量，代码如下所示：

```java
sensorData.keyBy(r -> r.id)
          // timeWindow(Time.hours(1))已过时，它实际上是下面代码的封装
          .window(TumblingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))
          .process(new TemperatureAverager());
```

滚动窗口默认和1970-01-01 00:00:00对齐，以上示例代码定义了[00:15:00-01:15:00)，[00:15:00-02:15:00)...窗口。

- 滑动窗口

滑动窗口分配器将元素分为固定大小，偏移指定大小的窗口，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Sliding-Window-Assigner-Example.png" title="A Sliding Window Assigner Example" />

滚动窗口需要指定窗口大小size和滑动步长slide。**如果slide小于size，那么会有一些元素属于两个窗口，如果slide大于size，那么会有一些元素没有包含在窗口中。**如下代码演示大小为1个小时，步长为15分钟的滑动窗口操作：

```java
sensorData.keyBy(r -> r.id)
          .window(SlidingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))
          .process(new TemperatureAverager());
```

- 会话窗口

会话窗口分配器将元素划分为**大小不同、互不重叠**的窗口，如下图所示，会话窗口的边界由session gap确定：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Session-Window-Assigner-Example.png" title="A Session Window Assigner Example" />

如下所示代码按照15分钟为gap划分会话窗口。**由于分配器不能立即将元素分配到对于会话窗口，它将每个元素划分到以其timestamp为起始时间、大小为gap的独立窗口，然后合并范围重叠的独立窗口。**

```java
sensorData.keyBy(_.id)
           // create event-time session windows with a 15 min gap
          .window(EventTimeSessionWindows.withGap(Time.minutes(15)))
          .process(...)
```

### 窗口函数

窗口函数对窗口内的元素进行计算，可分为两类：

1. 增量聚合函数：每当新元素添加到窗口时触发，优点是节省空间，例如`ReduceFunction`和`AggregateFunction`。

2. 全量窗口函数：窗口所有元素到齐后触发，占用空间多，例如`ProcessWindowFunction`。

- ReduceFunction

接收2个相同类型的元素并产生一个相同类型的新元素作为窗口状态，如下示例代码计算每隔15秒的最低温度：

```java
DataStream<Tuple2<String, Double>> minTempPerWindow = sensorData
    .map(r -> new Tuple<String, Double>(r.id, r.temperature))
    .keyBy(r -> r.f1)
    .window(TumblingEventTimeWindows.of(Time.seconds(15)))
    .reduce((r1, r2) -> (r1.f1, Math.min(r1.f2, r2.f2)));
```

- AggregateFunction

AggregateFunction功能和ReduceFunction类似，但**输入、输出元素和状态元素的类型可以互不相同**，接口定义如下所示：

```java
public interface AggregateFunction<IN, ACC, OUT> extends Function, Serializable {

  // create a new accumulator to start a new aggregate.
  ACC createAccumulator();

  // add an input element to the accumulator and return the accumulator.
  ACC add(IN value, ACC accumulator);

  // compute the result from the accumulator and return it.
  OUT getResult(ACC accumulator);

  // merge two accumulators and return the result.
  ACC merge(ACC a, ACC b);
}
```

- ProcessWindowFunction

ReduceFunction和AggregateFunction用于增量式地处理窗口元素，而有些时候需要窗口所有元素到齐后才能处理，比如计算中位数，此时需要ProcessWindowFunction来处理。

```java
public abstract class ProcessWindowFunction<IN, OUT, KEY, W extends Window>
        extends AbstractRichFunction {

    /** Evaluates the window and outputs none or several elements. */
    public abstract void process(
            KEY key, Context context, Iterable<IN> elements, Collector<OUT> out) throws Exception;

    /** Deletes any state in the Context when the Window expires. */
    public void clear(Context context) throws Exception {}

    /** The context holding window metadata. */
    public abstract class Context implements java.io.Serializable {
        /** Returns the window that is being evaluated. */
        public abstract W window();

        /** Returns the current processing time. */
        public abstract long currentProcessingTime();

        /** Returns the current event-time watermark. */
        public abstract long currentWatermark();

        /** State accessor for per-key and per-window state. */
        public abstract KeyedStateStore windowState();

        /** State accessor for per-key global state. */
        public abstract KeyedStateStore globalState();

        /** Emits a record to the side output identified by OutputTag. */
        public abstract <X> void output(OutputTag<X> outputTag, X value);
    }
}
```

和ProcessFunction类似，ProcessWindowFunction也提供了Context参数扩展函数功能。ProcessWindowFunction的Context对象提供窗口元信息(比如窗口的开始、结束时间)，以及窗口状态(Per-window State)和全局状态(Global state)。

全局状态指不属于任何窗口的键控状态，窗口状态指当前窗口示例的状态。使用窗口状态时需要实现clear()方法清除之前的窗口状态，而全局状态用于状态共享。ProcessWindowFunction使用ListState存储状态，因此比ReduceFunction和AggregateFunction消耗更多的内存。

- 增量聚合:heavy_plus_sign:ProcessWindowFunction

如果既想使用增量聚合又想获取窗口元信息，**DataStream API提供重载的reduce()和aggregate()方法，将ProcessWindowFunction作为第二个参数传入，此时ProcessWindowFuncton的Iterable参数只有一个元素，即增量聚合后的结果**，代码见`CalculateMinMaxTemp.java`。

### 自定义窗口算子

当内置窗口算子无法满复杂的应用逻辑时，DataStream API通过暴露接口支持自定义窗口算子。自定义窗口算子分为3个组件：

- **分配器(Assigner)**：将新接收的元素分配到对应的窗口，如果窗口不存在则创建。
- **触发器(Trigger)**：新元素传递给窗口的同时也会给触发器，由其决定是否计算、清除窗口状态。触发器的行为取决于窗口函数。
  - 增量聚合函数立即触发并发送，如下图所示：
<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Window-Operator-with-an-Incremental-Aggregation-Function.png" title="A Window Operator with an Incremental Aggregation Function" />
  - 全量窗口函数收集所有元素后处理，再发送结果，如下图所示：
<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Window-Operator-with-a-Full-Window-Function.png" title="A Window Operator with a Full Window Function" />
  - 增量函数:heavy_plus_sign:聚合函数，等于以上两者的结合体，如下图所示：
<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Window-Operator-with-an-Incremental-Aggregation-and-Full-WIndow-Function.png" title="A Window Operator with an Incremental Aggregation and Full WIndow Function" />

- **回收器(Evictor)**：可选组件，可在窗口函数执行前后注入，负责将窗口元素清空，只适用于全量窗口函数。

尽管回收器是可选的，但是每个窗口算子都需要一个触发器，每个WindowAssigner都提供一个默认触发器。**注意自定义触发器并不是对默认触发器的功能补充，只有最后自定义的触发器才会生效**。

### 窗口生命周期

一个窗口由WindowAssigner创建，包含如下内容：

- 窗口内容：所有属于窗口的元素或者增量聚合函数的结果
- 窗口对象：WindowAssigner返回0，1或多个窗口对象，每个窗口对象包含各自区分的信息，比如窗口结束时间戳
- 定时器：由触发器注册，用于执行回调，比如清空窗口内容
- 自定义状态：触发器可以定义使用窗口状态，**由触发器控制状态而不是窗口算子**

当到达结束时间，窗口算子删除窗口内容和窗口对象，但是不会清除自定义状态，需要在Trigger.clear()方法中实现以防止内存泄漏。

- Window Assigner

窗口分配器决定元素属于哪个窗口，WindowAssigner接口定义如下，代码`WindowLiftcycle.java#ThirtySecondsWindows`演示如何创建大小为30s的滚动窗口。：

```java
public abstract class WindowAssigner<T, W extends Window> implements Serializable {

    /**
     * Returns a {@code Collection} of windows that should be assigned to the element.
     */
    public abstract Collection<W> assignWindows(
            T element, long timestamp, WindowAssignerContext context);

    /** Returns the default trigger associated with this {@code WindowAssigner}. */
    public abstract Trigger<T, W> getDefaultTrigger(StreamExecutionEnvironment env);

    /**
     * Returns a {@link TypeSerializer} for serializing windows that are assigned by this {@code
     * WindowAssigner}.
     */
    public abstract TypeSerializer<W> getWindowSerializer(ExecutionConfig executionConfig);

    /**
     * Returns {@code true} if elements are assigned to windows based on event time, {@code false}
     * otherwise.
     */
    public abstract boolean isEventTime();

    /**
     * A context provided to the {@link WindowAssigner} that allows it to query the current
     * processing time.
     *
     * <p>This is provided to the assigner by its containing {@link
     * org.apache.flink.streaming.runtime.operators.windowing.WindowOperator}, which, in turn, gets
     * it from the containing {@link org.apache.flink.streaming.runtime.tasks.StreamTask}.
     */
    public abstract static class WindowAssignerContext {

        /** Returns the current processing time. */
        public abstract long getCurrentProcessingTime();
    }
}
```

:::note GlobalWindows
GlobalWindows将所有元素分配到一个全局窗口，其默认触发器(NeverTrigger)策略为永不触发，因此需要自定义触发器和回收器。
:::

MergingWindowAssigner继承WindowAssigner，用于合并多个窗口，比如之前提到的会话窗口EventTimeSessionWindows。当合并窗口时，要确保窗口状态和触发器也能恰当地合并。

- 触发器

触发器定义什么时候窗口处理和发送结果，可以由时间或者特定条件(元素个数，包含某个特定元素等)确定。默认情况下，当处理时间或者水印大于窗口的终止时间时，触发器被调用并返回TirggerResult决定窗口的下一步动作，有以下枚举值：

1. **CONTINUE**：不触发处理，跳过。
2. **FIRE**：调用ProcessWindowFunction并发送结果，如果只有增量聚合函数，发送**当前聚合结果**。**不会改变窗口状态**。
3. **PURGE**：清空当前窗口所有内容，调用ProcessWindowFunction.clear()方法来清空自定义窗口状态。
4. **FIRE_AND_PURGE**：先执行FIRE操作然后执行PURGE操作。

Trigger提供的API能实现各种复杂的逻辑，比如说可以自定义触发几次计算更新但是不发送结果。在自定义Trigger时需要注意两方面：

1. 清空状态：**实现clear()方法清除自定义窗口状态，通过TriggerContext删除所有定时器。**
2. 合并Trigger：canMerge()方法返回触发器是否支持合并，onMerge()方法实现合并逻辑。

代码`WindowLiftcycle.java#OneSecondIntervalTrigger`创建了一个每隔1s触发一次的Trigger。注意使用了自定义状态firstSeen，需要在clear()方法中删除，同时状态类型为ValueState不可合并，因此该Trigger也不能合并(canMerge方法默认返回false)。

- 回收器

回收器是窗口的可选组件，它在窗口函数执行之前或之后负责清除所有元素，接口定义如下：

```java
public interface Evictor<T, W extends Window> extends Serializable {

    /** Optionally evicts elements. Called before windowing function. */
    void evictBefore(
            Iterable<TimestampedValue<T>> elements,
            int size,
            W window,
            EvictorContext evictorContext);

    /** Optionally evicts elements. Called after windowing function. */
    void evictAfter(
            Iterable<TimestampedValue<T>> elements,
            int size,
            W window,
            EvictorContext evictorContext);

    /** A context object that is given to {@link Evictor} methods. */
    interface EvictorContext {

        /** Returns the current processing time. */
        long getCurrentProcessingTime();

        /**
         * Returns the metric group for this {@link Evictor}. This is the same metric group that
         * would be returned from {@link RuntimeContext#getMetricGroup()} in a user function.
         *
         * <p>You must not call methods that create metric objects (such as {@link
         * MetricGroup#counter(int)} multiple times but instead call once and store the metric
         * object in a field.
         */
        MetricGroup getMetricGroup();

        /** Returns the current watermark time. */
        long getCurrentWatermark();
    }
}
```

evictBefore()和evictAfter()方法在窗口函数执行前后调用，其中参数elements表示窗口所有元素，size表示元素个数，EvictorContext提供当前处理时间和水印，元素通过Iterator的remove方法删除。回收器经常应用于GlobalWindow来部分清理窗口，而不是完全清理整个窗口。

## 按时间语义连接流

DataStream API提供2个内置算子：**间隔连接(Interval Join)**和**窗口连接(Window Join)**，它们根据时间条件连接流。如果这两个内置算子不能满足需求，可以通过实现CoProcessFunction，BroadcastProcessFunction或者KeyedBroadcastProcessFunction接口来自定义。

### 间隔连接

间隔连接将来自两个流中**key相同且时间戳间隔不大于指定值**的记录合并为一个流。如下图所示为A和B的间隔连接，当B中元素的时间戳和A中元素的时间戳相比没有早于1个小时也没有晚于15分钟时，合并两个流的元素。间隔连接的语义是对称的，即A中元素相比于B中元素没有早于15分钟也没有晚于1个小时。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/An-Interval-Join-Example.png" title="An Interval Join Example" />

间隔连接仅支持事件时间和**INNER JOIN语义(没有匹配的元素不会输出)**，使用伪代码如下所示：

```java
input1.keyBy(...)
      .between(<lower-bound>, <upper-bound>)
      .process(ProcessJoinFunction)
```

lower-bound和upper-bound可以任意取值，只要lower-bound小于uppder-bound，例如between(Time.hour(-1), Time.minute(15))。间隔连接需要缓存记录：对于第1条流，所有时间戳大于当前水印(upper-bound)的记录被缓存，对于第2条流，所有时间戳大于当前水印加lower-bound的记录被缓存。

### 窗口连接

窗口连接基于窗口机制，伪代码如下所示：

```java
input1.join(input2)
      .where(...)       // 指定input1的key属性
      .equalTo(...)     // 指定input2的key属性
      .window(...)      // 指定窗口分配器
      [.trigger(...)]
      [.evictor(...)]
      .apply(...)       // 指定JoinFunction
```

窗口连接机制如下图所示，2个输入流按照key分配到公共窗口(包含两个流的记录)，再由JoinFunction处理两个流的交叉积。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap06/Operation-of-a-Window-Join.png" title="Operation of a Window Join" />

## 处理延迟数据

DataStream API提供如下策略来处理延迟数据，示例代码见`HandleLateData.java`：

- 丢弃不管
- 重定向到另一个流
- 用迟延数据再次更新结果并输出

### 丢弃

最简单的处理策略，是基于事件时间的窗口算子的默认行为。

### 重定向

将延迟数据重定向到侧输出流，可以使用sideOutputLateData方法或者在ProcessFunction中自行重定向。

### 更新结果

将延迟的记录重新处理生成更新结果并发送，但需要算子满足特定要求。**第一点需要算子保存所有状态，第二点需要下游算子和外部系统支持更新。**窗口算子提供allowedLateness()方法设置额外的延迟时间，当水印大于窗口的终止时间后不会删除窗口，而是再等待相应的延迟事件后才删除。也可以在ProcessFunction中实现等待延迟时间的逻辑。

## 总结

1. 时间语义默认为事件时间可以不设置，使用WatermarkStrategy来设置水印和时间戳
2. 处理函数比转换函数功能更加丰富：获取水印，设置/删除定时器，侧输出等。
3. 一般使用窗口操作只需要指定分配器和提供窗口函数：内置实现的分配器有滚动、滑动和会话，窗口函数分为增量聚合函数(ReduceFunction、AggregateFunction)和全量窗口函数(ProcessWindowFunction)两类。
4. 自定义窗口算子分为3个组件：分配器、触发器和回收器。自定义组件即实现WindowAssigner、Trigger、Evictor这些接口(抽象类)。
5. 触发器的4种结果：CONTINUE、FIRE、PURGE和FIRE_AND_PURGE影响窗口算子下一步操作。回收器是可选组件，通常用于GlobalWindow。
6. 按时间语义连接流的2种方式：间隔连接和窗口连接
7. 处理延迟数据的3种策略：丢弃、重定向和更新结果。重定义可以用sideOutputLateData()或者在ProcessFunction中实现，更新结果需要设置额外延迟事件。
