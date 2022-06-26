---
title: FlinkX源码剖析(5)
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

上一篇文章分析了FlinkX自定义的BaseRichInputFormat类，子类只需要实现openInternal和nextRecordInternal等xxxInternal方法。本篇文章继续分析BaseRichInputFormat是如何实现统一的指标收集、发布功能。

<!--truncate-->

## Flink Metric

Flink本身提供了一套指标注册、发布系统，对于RichFunction子类，可以通过getRuntimeContext().getMetricGroup()获取指标组对象，然后添加指标。更具体地，Flink将指标分为如下4种(对应4个同名接口)：

- Counter：数值类型(long)指标，提供inc和dec方法增减数值。SimpleCounter实现Counter接口，注意它没有添加任何同步机制；
- Gauge：泛型指标，提供getValue方法获取指标对象，通过MetricGroup.gauge(String name, Gauge gauge)方法注册指标；

:::caution 注意
指标发布器会将Gauge指标转为String发布，因此Gauge的泛型参数必须实现toString方法。
:::

- Histogram：数值分布指标；
- Meter：流量指标，统计处理event的速率。

## BaseMetric

### 字段和方法

FlinkX自定义BaseMetric类，它是BaseRichInputFormat和BaseRichOutputFormat中统计指标的抽象，包含如下2个字段存储指标数据：

```java
private final MetricGroup flinkxOutput;
private final Map<String, LongCounter> metricCounters = new HashMap<>();
```

BaseMetric的构造方法传入RuntimContext，调用其getMetricGroup().addGroup方法添加字表：

```java
public BaseMetric(RuntimeContext runtimeContext) {
  flinkxOutput =
    runtimeContext
      .getMetricGroup()
      .addGroup(
        Metrics.METRIC_GROUP_KEY_FLINKX, Metrics.METRIC_GROUP_VALUE_OUTPUT);
// 字符串常量METRIC_GROUP_KEY_FLINKX和METRIC_GROUP_VALUE_OUTPUT分别是
// "flinkx"和"output"，这里"output"不是专指OutputFormat
}
```

MetricGroup接口有2种添加指标组的方法：

1. `MetricGroup addGroup(String name)`
2. `MetricGroup addGroup(String key, String value)`

前者在当前指标组下添加*name*指标组，后者添加*key*指标组然后在key组下又添加*value*组，`addGroup(key).addGroup(value)`和`addGroup(key, value)`的唯一区别是后者额外返回一个键值对。

回到BaseMetric，提供addMetric方法增加新指标，可以看到指标分别添加到成员字段flinkxOutput(MetricGroup类型)和metricCounters(Map<String, LongCounter\>类型)中：

```java
public void addMetric(String metricName, LongCounter counter, boolean meterView) {
  metricCounters.put(metricName, counter);
  flinkxOutput.gauge(metricName, new SimpleAccumulatorGauge<>(counter));
  if (meterView) {
    flinkxOutput.meter(
      metricName + Metrics.SUFFIX_RATE, new SimpleLongCounterMeterView(counter, 20));
  }
}
```

### 添加与获取

在BaseRichInputFormat的initStatisticsAccumulator方法中，创建了3个LongCounter并将其添加到inputMetric指标组：

```java
private void initStatisticsAccumulator() {
  numReadCounter = getRuntimeContext().getLongCounter(Metrics.NUM_READS);
  bytesReadCounter = getRuntimeContext().getLongCounter(Metrics.READ_BYTES);
  durationCounter = getRuntimeContext().getLongCounter(Metrics.READ_DURATION);

  inputMetric = new BaseMetric(getRuntimeContext());
  inputMetric.addMetric(Metrics.NUM_READS, numReadCounter, true);
  inputMetric.addMetric(Metrics.READ_BYTES, bytesReadCounter, true);
  inputMetric.addMetric(Metrics.READ_DURATION, durationCounter);
}
```

除此之外，FlinkX还将以上3个指标数据作为保存到formatState中。Flink自定义FormatState类表示Format状态，它保存了`Map<String, LongCounter\> metric`、numOfSubTask、jobId等数据。BaseRichInputFormat通过getFormatState方法获取/更新Format状态：

```java
public FormatState getFormatState() {
  if (formatState != null && numReadCounter != null && inputMetric != null) {
    formatState.setMetric(inputMetric.getMetricCounters());
  }
  return formatState;
}
```

## FormatState

### 更新与保存

尽管在FlinkX在BaseRichInputFormat上建立了状态(FormatState)，但是Flink框架提供的状态保存、恢复是作用于其上一层SourceFunction(需要实现CheckpointedFunction接口)。为此，DtInputFormatSourceFunction通过`Map<Integer, FormatState> formatStateMap`字段保存其下所有子任务的InputFormat状态(key为子任务编号)。具体地，它实现的2个CheckpointedFunction接口方法如下：

```java
// 进行1次快照备份，注意getFormatState会从inputMetric中重新获取指标数据
public void snapshotState(FunctionSnapshotContext context) throws Exception {
    FormatState formatState = ((BaseRichInputFormat) format).getFormatState();
    if (formatState != null) {
      LOG.info("InputFormat format state:{}", formatState);
      unionOffsetStates.clear();
      unionOffsetStates.add(formatState);
    }
}

// 状态初始化(检查点恢复)
public void initializeState(FunctionInitializationContext context) throws Exception {
  OperatorStateStore stateStore = context.getOperatorStateStore();
  LOG.info("Start initialize input format state, is restored:{}", context.isRestored());
  unionOffsetStates =
    stateStore.getUnionListState(
      new ListStateDescriptor<>(
        LOCATION_STATE_NAME,
        TypeInformation.of(new TypeHint<FormatState>() {})));
  // 检查点恢复formatStateMap状态
  if (context.isRestored()) {
    formatStateMap = new HashMap<>(16);
    for (FormatState formatState : unionOffsetStates.get()) {
      formatStateMap.put(formatState.getNumOfSubTask(), formatState);
      LOG.info("Input format state into:{}", formatState);
    }
  }
  LOG.info("End initialize input format state");
}
```

:::tip 小结

1. `BaseMetric inputMetric`字段是`MetricGroup flinkxOutput`和`Map<String, LongCounter> metricCounters`的封装，只提供指标添加和获取，注意修饰符为transient；
2. `FormatState formatState`是inputMetric中metricCounters和其他数据(子任务编号，任务id等)的封装，作为状态包含指标在内的所有信息；
3. `Map<Integer, FormatState> formatStateMap`是每个InputFormat的formatState聚合封装，key是子任务编号，value是该子任务对应的InputFormat状态，即DtInputFormatSourceFunction的状态是一组FormatState。
:::

### 状态生命周期

1. 如果DtInputFormatSourceFunction从检查点中恢复，调用initializeState方法给formatStateMap赋值；
2. DtInputFormatSourceFunction的open方法，检查formatStateMap是否为null，不是null进行InputFormat的状态设置(调用BaseRichInputFormat的setRestoreState方法，即设置FormatState)；
3. BaseRichInputFormat的open方法调用initRestoreInfo判断FormatState是否为空：
   1. 为空说明是第一次运行，此时自己new一个FormatState
   2. 不为空说明是恢复运行，上层的SourceFunction已经通过setRestoreState将状态恢复，此时重新将状态中的统计指标值添加到当前指标中；
4. DtInputFormatSourceFunction的snapshotState方法(检查点保存)调用BaseRichInputFormat的getFormatState方法，后者从inputMetric中更新FormatState的指标数据后返回。

## AccumulatorCollector

FlinkX自定义AccumulatorCollector类来表示指标累加器收集器，核心是一个**单线程池**，每个BaseRichInputFormat包含一个该类字段accumulatorCollector。

### 初始化和启动

收集器accumulatorCollector在InputFormat的open方法中调用initAccumulatorCollector对其进行初始化，给出要收集指标的名称并启动收集线程，代码如下：

```java
private void initAccumulatorCollector() {
  String lastWriteLocation =
          String.format("%s_%s", Metrics.LAST_WRITE_LOCATION_PREFIX, indexOfSubTask);
  String lastWriteNum =
          String.format("%s_%s", Metrics.LAST_WRITE_NUM__PREFIX, indexOfSubTask);

  accumulatorCollector =
    new AccumulatorCollector(
      context,
      Arrays.asList(
        Metrics.NUM_READS,
        Metrics.READ_BYTES,
        Metrics.READ_DURATION,
        Metrics.WRITE_BYTES,
        Metrics.NUM_WRITES,
        lastWriteLocation,
        lastWriteNum));
  accumulatorCollector.start();
}
```

从代码中可以看到，**accumulatorCollector和intputMetric以及formatState最大的不同是它包含读和写2方面的指标，而后两者单独只是读相关指标**，而start方法会启动线程池周期性地收集指标。

### 收集指标

AccumulatorCollector使用ScheduledExecutorService线程池，每次只启动一个线程，start方法调用后线程池以固定间隔(TaskManager心跳加1秒)运行collectAccumulator方法收集指标，代码如下：

```java
public void collectAccumulator() {
  CompletableFuture<ArchivedExecutionGraph> archivedExecutionGraphFuture =
    gateway.requestJob(Time.seconds(10));
  ArchivedExecutionGraph archivedExecutionGraph;
  try {
    archivedExecutionGraph = archivedExecutionGraphFuture.get();
  } catch (Exception e) {
    // 限制最大出错次数，超过最大次数则使任务失败，如果不失败，统计数据没有及时更新，会影响速率限制，错误控制等功能
    collectErrorTimes++;
    if (collectErrorTimes > MAX_COLLECT_ERROR_TIMES) {
      // 主动关闭线程和资源，防止异常情况下没有关闭
      close();
      throw new RuntimeException(
        "The number of errors in updating statistics data exceeds the maximum limit of 100 times. To ensure the correctness of the data, the task automatically fails");
    }
    return;
  }
  StringifiedAccumulatorResult[] accumulatorResult =
    archivedExecutionGraph.getAccumulatorResultsStringified();
  for (StringifiedAccumulatorResult result : accumulatorResult) {
    ValueAccumulator valueAccumulator = valueAccumulatorMap.get(result.getName());
    if (valueAccumulator != null) {
      valueAccumulator.setGlobal(Long.parseLong(result.getValue()));
    }
  }
}
```

可以看到，accumulatorCollector的收集指标是整个Flink作业的数据，而不是某个子任务的指标，这些全局性指标数据是实现流量控制的关键基础。

### 获取指标

FlinkX使用ValueAccumulator表示累加指标，它包含两个2字段：local表示本地(InputFormat实例)的指标，global表示全局(Flink作业)的指标。相应地分别有2个获取指标方法：

```java
// 获取全局指标值
public long getAccumulatorValue(String name, boolean needWaited) {
  if (needWaited) {
    try {
      TimeUnit.MILLISECONDS.wait(this.period);
    } catch (InterruptedException e) {
      LOG.warn(
        "Interrupted when waiting for valueAccumulatorMap, e = {}",
        ExceptionUtil.getErrorMessage(e));
    }
  }
  ValueAccumulator valueAccumulator = valueAccumulatorMap.get(name);
  if (valueAccumulator == null) {
    return 0;
  }
  return valueAccumulator.getGlobal();
}

public long getLocalAccumulatorValue(String name) {
    ValueAccumulator valueAccumulator = valueAccumulatorMap.get(name);
    if (valueAccumulator == null) {
      return 0;
    }
    return valueAccumulator.getLocal().getLocalValue();
}
```

注意获取全局指标时额外加了个needWaited参数，设置为true表示获取最新一次统计的数值。

## ByteRateLimiter

FlinkX使用ByteRateLimiter对InputFormat的读取字节速率进行限制，其本质是RateLimiter和一个**单线程池**的封装。

### 初始化与启动

BaseRichInputFormat类的open方法调用initByteRateLimiter方法初始化ByteRateLimiter，后者代码如下：

```java
private void initByteRateLimiter() {
  if (config.getSpeedBytes() > 0) {
      this.byteRateLimiter =
        new ByteRateLimiter(accumulatorCollector, config.getSpeedBytes());
      this.byteRateLimiter.start();
  }
}
```

ByteRateLimiter的构造方法传入2个参数：第一个是指标累计器收集器，通过其提供的读取字节总量和读取记录条数计算当前读取读取速率，因此initByteRateLimiter方法必须在initStatisticsAccumulator之后调用；第二个参数是作业配置的限流大小。接着调用start方法，启动线程池运行一个计算读取速率的线程。

### 更新读取速率

同样地，ByteRateLimiter使用ScheduledExecutorService线程池，每次只启动一个线程，start方法调用后线程池以固定间隔(1秒)运行updateRate方法更新读取速率，代码如下：

```java
private void updateRate() {
  // 全局读取字节总数
  long totalBytes = accumulatorCollector.getAccumulatorValue(Metrics.READ_BYTES, false);
  // 当前子任务示例读取纪录数
  long thisRecords = accumulatorCollector.getLocalAccumulatorValue(Metrics.NUM_READS);
  // 全局读取记录数
  long totalRecords = accumulatorCollector.getAccumulatorValue(Metrics.NUM_READS, false);

  // 读取占比
  BigDecimal thisWriteRatio =
    BigDecimal.valueOf(totalRecords == 0 ? 0 : thisRecords / (double) totalRecords);

  // 至少达到1000条、读取字节量不为0、当前任务有读取记录时才更新
  if (totalRecords > MIN_RECORD_NUMBER_UPDATE_RATE
        && totalBytes != 0
        && thisWriteRatio.compareTo(BigDecimal.ZERO) != 0) {
    // 当前字节速率
    double bpr = totalBytes / (double) totalRecords;
    // 当前限定字节速率=给定限制速率 / 当前字节速率 * 读取占比
    double permitsPerSecond = expectedBytePerSecond / bpr * thisWriteRatio.doubleValue();
    rateLimiter.setRate(permitsPerSecond);
  }
}
```
