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
