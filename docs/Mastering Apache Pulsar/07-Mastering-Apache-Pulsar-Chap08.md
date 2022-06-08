---
layout: article
title: Pulsar Functions
slug: /Mastering-Apache-Pulsar/Chap08
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第8章读书笔记
:::

## 流处理

流处理系统类似消费者，但对消息时间敏感。现有的流处理系统如Spark和Flink通过设计提供完善的流处理功能：状态管理、故障恢复、检查点和水印。Pusar Functions只提供日常使用的流处理功能

## Pulsar Functions架构

### 运行时

Pulsar Function支持3种运行时：基于线程的、基于进程的、基于K8S的。

### 隔离性

Pulsar Functions默认使用基于线程的运行时，线程模型共享内存但是隔离性低，在Go和Python API中Pulsar Functions使用基于进程的运行时，隔离性高但资源开销也更大。使用K8S运行时的Pulsar Functions不仅享受K8S提供的隔离性，并且支持除Java、Go和Python外的其他语言运行时。

## K8S部署的隔离性

Pulsar Functions部署在K8S上将调度从Pulsar移至K8S，并利用K8S提供的资源抽象能力。对于简单使用场景，未来Pulsar Functions将运行在broker上，而K8S部署用于更复杂的使用场景。

## 使用示例

### 创建Pulsar Functions

创建Pulsar Functions有两种方式：Admin CLI、Admin REST API(提前是提供对应的程序文件)。对于Java API，需要实现Function接口：

```java
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;

public class ExclamationFunction implements Function<String, String> {
  @Override
  public String process(String input, Context context) {
    return String.format("%s!", input);
  }
}
```

```bash
bin/pulsar-admin functions create \
  --jar target/my-jar-with-dependencies.jar \
  --classname org.example.functions.ExclamationFunction \
  --tenant public \
  --namespace default \
  --name word-count \
  --inputs persistent://public/default/normal \
  --output persistent://public/default/exclaimed
```

### 简单事件处理

以下程序定义一个过滤设备剩余电量大于10%的简单事件处理，返回设备id：

```java
package org.example.functions;
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;

public class SensorData {
  private String deviceId;
  private Long timestamp;
  private int power;

  public SensorData(String deviceId, Long timestamp, int power) {
    this.deviceId = deviceId;
    this.timestamp = timestamp;
    this.power = power;
  }

   // Standard setters and getters
}

public class DeviceChecker implements Function<SensorData, String> {
  @Override
  public String process(SensorData input, Context context) {
    if(input.power < 10){
      return input.deviceId;
      }
  }
}
```

### Topic清理

对于注册schema的topic，部分消息可能不符合schema定义或者不属于消费者要求的格式，可以使用Pulsar Functions来执行如下消息清理操作。

#### 脱敏

如下Pulsar Function将员工社保号(ssn)脱敏：

```java
package org.example.functions;
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;

public class EmployeeRecord {
  private String name;
  private String jobTitle;
  private String ssn;

  public EmployeeRecord(String name, String jobTitle, String ssn) {
    this.name = name;
    this.jobTitle = jobTitle;
    this.ssn = ssn;
  }

   // Standard setters and getters
}

public class EmployeeScrub implements Function<EmployeeRecord, EmployeeRecord> {
  @Override
  public EmployeeRecord process(EmployeeRecord input, Context context) {
    return new EmployeeRecord(input.name, inpt.jobTitle, "xxx-xx-xxxx");
  }
}
```

#### 翻译

如下Pulsar Function将英语翻译成西班牙语

```java
package org.example.functions;
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;
import org.jowanza.languages.spanish.SpanishTranslator;

public class TranslateToSpanish implements Function<String, String> {
  @Override
  public String process(String input, Context context) {
    return SpanishTranslator.translate(input); // Returns a string
  }
}
```

#### Schema标准化

如下Pulsar Function将所有传感器数据的事件数组转为单个值：

```java
package org.example.functions;
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;

public class SensorData {
  private String deviceId;
  private int[] hours;

  public SensorData(String deviceId, int[] hours) {
    this.deviceId = deviceId;
    this.hours = hours;
  }

  // Standard setters and getters
}

public class NormalizedSensorData {
  private String deviceId;
  private int recentHour;

  public NormalizedSenorData(String deviceId, int recentHour) {
    this.deviceId = deviceId;
    this.recentHour = recentHour;
  }

  // Standard setters and getters
}

public class DataNormalizer implements Function<SensorData,
  NormalizedSensorData> {
  @Override
  public String process(SensorData input, Context context) {
    return new NormalizedSensorData(input.deviceId, input.hours[0]);
  }
}
```

### Topic统计

有状态的Pulsar Function可以统计topic的个数、平均值或其他指标。

#### 累加个数

如下Pulsar Function统计句子中每种单词个数：

```java
package org.example.functions;

import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;

import java.util.Arrays;

public class DoubleWordCountFunction implements Function<String, Void> {
  @Override
  public Void process(String input, Context context) throws Exception {
    Arrays.asList(input.split(" ")).forEach(word -> {
      String counterKey = word.toLowerCase();
      context.incrCounter(counterKey, 1);
    });
    return null;
  }
}
```

#### 状态设置/获取

通过Context对象来设置/获取状态：

```java
public class DataSetter implements Function<String, Void> {
  public void process (String input, Context context) {
    context.setState("jowanza", "good guy".getBytes());
    return null;
  }
}

public class DataGetter implements Function<String, Void> {
  public void process (String input, Context context) {
    context.getState("jowanza"); // Byte Array of "good guy string"
    return null;
  }
}
```

## 总结

1. Pulsar Functions三种运行时：线程、进程、K8S；
2. 通过实现Function接口创建Pulsar Function，然后通过Admin CLI/API使用Function；
3. Pulsar Functions提供状态管理，通过Context对象操作状态。
