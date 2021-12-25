---
layout: article
title: 读写外部系统
slug: /Stream-Processing-with-Apache-Flink/Chap08
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

本章讨论source和sink如何影响Flink流应用的一致性保证，介绍常用的connector，以及如何实现自定义source和sink。

## 应用一致性保证

在[检查点、保存点和状态恢复](xxx)一节中提到，Flink使用周期性检查点进行容错恢复。然而，应用的一致性状态还是不够，需要source和sink连接器也集成到Flink的检查点机制中，才能提供有意义的一致性保证。

为了提供精准一次的一致性状态，source connector应该能重置到上次检查点的位置，否则应用重跑会丢失数据，即只提供最多一次保证。然而，要想实现端到端的精准一次性保证，可重置的source connector还是不够，需要sink connector实现两种特殊的写策略之一：**幂等写**和**事务写**。

### 幂等写

**幂等写(Idempotent Writes)**：无论写入操作执行多少次，结果都只变化一次，比如向HashMap中多次写入**相同的**键值对。幂等写无论重放多少次都不会改变结果，在一定程度上可以减轻检查点重放的影响。注意依赖幂等写实现精准一次性的应用一定要保证在重放时覆盖之前写的结果，比如写到键值存储时要确切地计算更新或插入(upsert)的键。在重放过程中，消费结果的外部程序会观察到历史结果或者结果不一致，当重放结束后结果将会恢复一致状态。

### 事务写

**事务写(Transactional Writes)**：只写入上一个检查点前保存的结果，即使重置到上一个检查点，在该检查点之后没有结果写入。事务写消除了幂等写重放带来的不一致性，但是增加了最终结果的延迟。Flink内置了**写前日志(Write-Ahead-Log, WAL)**和**两阶段提交(Two-Phase-Commit, 2PC)**来实现事务写。

WAL将结果保存在应用状态中，当接收到检查点完成的通知后将结果写入。优点是**适用于任何sink系统**，缺点是不能提供完备的(bulletproof)精准一次性保证、增加应用状态大小以及sink系统需要处理尖峰式的(spiky)写入模式。

2PC要求sink系统提供事务指定或者至少暴露模拟支持的模块。对于每个检查点，sink开启一个事务然后写入结果，当接收到检查点完成的通知后提交事务。2PC依赖于Flink的检查点机制：检查点屏障(barrier)是开启事务的通知，而JobManager发送所有检查点完成的通知即提交事务的指令。和WAL相比，2PC依赖于sink系统和sink自身实现精准一次性保证，并且连续地写入结果而不是想WAL一样尖峰式地写入。

下表所示展示了不同类型source和sink能够达到的端到端一致性保证：

| sink类型 | 不可重置source | 可重置source |
| -------- | -------------- | ------------ |
| 任意sink | 至多一次   | 至少一次 |
| 幂等sink | 至多一次   | 精准一次 |
| WAL sink | 至多一次   | 至少一次 |
| 2PC sink | 至多一次   | 精准一次 |

## 内置连接器

Flink内置多种数据存储系统的连接器(connector)：Apache Kafka、RabbitMQ、Apache Nifi、Cassandra、ElasticSearch和JDBC等。此外，[Apache Bahir项目](https://bahir.apache.org/)提供额外的连接器：ActiveMQ、Akka、Flume、Netty和Redis等。为了使用内置连接器，需要工程引入依赖，详见[添加应用依赖](Chap05#添加应用依赖)，接下来介绍几个常用连接器。

### Kafka Source连接器

Apache Kafka是分布式消息队列，以发布-订阅的模式接收和发送消息。Kafka按照主题(topic)划分消息流，确保每个topic的消息按照其写入顺序发送，并通过分区(partition)分布式地读写topic。Kakka的消息顺序保证只限于同一个分区，当从不同分区读取topic时并不确保有序性，分区的读取位置称之为偏移量(offset)。

Kafka source 连接器从各分区并行地读取事件消息，source任务会记录偏移量并保存为状态，用于故障恢复时使用，而不依赖Kafka提供偏移量跟踪机制(基于消费者组)，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap08/Read-Offset-of-Kafka-Topic-Partitions.png" title="Read Offset of Kafka Topic Partitions" />

Flink提供一个通用版本的Kafka连接器，适用于Kafka 0.11及其以上版本，也有特定版本的连接器。以通用版本为例，引入如下依赖：

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-kafka_${scala.binary.version}</artifactId>
    <version>${flink.version}</version>
</dependency>
```

如下所示代码创建一个Kafka source连接器，构造器需要3个参数，依次为topic名称、反序列化器和连接参数。

```java
Properties properties = new Properties();
properties.setProperty("bootstrap.servers", "localhost:9092");
properties.setProperty("group.id", "test");
FlinkKafkaConsumer<String> kafkaSource = new FlinkKafkaConsumer<>("topicName",
    new SimpleStringSchema(), properties);
// 设置水印
kafkaSource.assignTimestampsAndWatermarks(...);

DataStreamSource<String> kafkaSource = env.addSource(kafkaSource);
```

自0.10.0版本起Kafka支持消息时间戳，此时FlinkKafkaConsumer会自动将消息时间戳设置为事件时间，但还是要手动设置水印。此外，还可以通过如下方法设置读取分区的偏移量：

- FlinkKafkaConsumer.setStartFromGroupOffsets()：**默认行为**，以消费者组上一次的读取位置作为偏移量，消费者组由连接参数`group.id`配置。
- FlinkKafkaConsumer.setStartFromEarliest()：每个分区最早的偏移量。
- FlinkKafkaConsumer.setStartFromLatest()：每个分区最后的偏移量。
- FlinkKafkaConsumer.setStartFromTimestamp(long)：读取大于给定时间戳的记录，需要Kafka 0.10.0+
- FlinkKafkaConsumer.setStartFromSpecificOffsets(Map)：从Map对象获取偏移地址

:::tip 小贴士
以上指定偏移量方法仅适用于Flink应用第1次读取，当从故障恢复或者保存点恢复时，应用从检查点/保存点中的保存偏移量开始读取。
:::

Kafka source连接器还可以配置自动发现新topic和topic下的新partition，通过在Property中添加`flink.partition-discovery.interval-millis`配置开启。

### Kafka Sink连接器

自Flink 0.8起提供Kafka所有版本(0.8+)的sink连接器，也提供一个通用版本(Kafka 0.11+)的连接器。以通用版本为例，依赖引入同source连接器，示例代码如下：

```java
SinkFunction<String> kafkaSink = new FlinkKafkaProducer<>(
    "localhost:9092", 
    "topic_name",
    new SimpleStringSchema());
stream.addSink(kafkaSink);
```

示例代码的构造器接收3个参数，分别是逗号分隔的Kafka broker地址、topic名称和序列化器。其他重载构造器还接收如下类型参数：

- Properties：连接Kafka的配置，例如broker地址列表通过`bootstrap.servers`设置
- FlinkKafkaPartitioner：配置记录如何映射到Kafka的不同分区
- KeyedSerializationSchema：将记录序列化为key和value两个字节数组

#### Kafka Sink的至少一次保证

Flink Kafka sink在如下情况提供至少一次保证：

- 应用开启检查点，所有source都是可重置的。
- 默认情况写入失败会抛出异常使应用重置，也可以配置`retries`进行重写，或者调用`setLogFailuresOnly(true)`在写入失败后不抛出异常而是记录日志。
- 默认情况下sink连接器等待Kafka确认所有记录后完成其检查点，通过调用`setFlushOnCheckpoint(false)`禁用等待操作。

#### Kafka Sink的精准一次保证

Kafka 0.11开始支持事务写，通过Kafka sink连接器参数配置，在开启检查点和source可重置下实现精准一次保证。FlinkKafkaProducer构造器通过Semantic参数设置Kafka sink的语义，有以下枚举值：

- **Semantic.NONE**：没有保证，可能写丢失或者重复写
- **Semantic.AT_LEAST_ONCE**：默认配置，至少一次保证
- **Semantic.EXACTLY_ONCE**：建立在Kafka事务写之上提供精准一次性保证

Kafka的事务机制：在分区日志追加消息，并将这些消息标记为未提交的，消费者通过配置隔离级别(通过`isolation.level`属性)来设置是否能够读取到未提交的记录(read_uncommitted[默认]/read_uncommitted)。如果配置为读已提交的，那么消费者在遇到未提交消息后会停止读取直到其改为已提交。因此，开启事务会导致消费者阻塞并引入显著的延迟。为此，Kafka提供`transaction.timeout.ms`属性配置(默认1个小时)，在超时后关闭未提交的事务。

:::tip 检查你的Kafka配置
Kafka默认配置可能会导致数据丢失，需要注意的配置有：`acks`，`log.flush.interval.messages`，`log.flush.interval.ms`，`log.flush.*`，详见Kafka官方文档。
:::
