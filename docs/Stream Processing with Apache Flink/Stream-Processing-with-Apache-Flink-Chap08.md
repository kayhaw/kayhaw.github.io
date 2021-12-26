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

下表展示了不同类型source和sink能够达到的端到端一致性保证：

| sink类型 | 不可重置source | 可重置source |
| -------- | -------------- | ------------ |
| 任意sink | 至多一次   | 至少一次 |
| 幂等sink | 至多一次   | 精准一次 |
| WAL sink | 至多一次   | 至少一次 |
| 2PC sink | 至多一次   | 精准一次 |

## 内置连接器

Flink内置多种数据存储系统的连接器(connector)：Apache Kafka、RabbitMQ、Apache Nifi、Cassandra、ElasticSearch和JDBC等。此外，[Apache Bahir项目](https://bahir.apache.org/)提供额外的连接器：ActiveMQ、Akka、Flume、Netty和Redis等。为了使用内置连接器，需要工程引入依赖，详见[添加应用依赖](Chap05#添加应用依赖)，接下来介绍几个常用连接器。

### Kafka Source连接器

Apache Kafka是分布式消息队列，以发布-订阅的模式接收和发送消息。Kafka按照主题(topic)划分消息流，确保每个topic的消息按照其写入顺序发送，并通过分区(partition)分布式地读写topic。Kakka的消息顺序保证只限于同一个分区，当从不同分区读取topic时并不确保有序性，分区的读取位置称为偏移量(offset)。

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

Kafka source连接器还可以配置自动发现新topic和topic下的新partition，在Property对象中添加`flink.partition-discovery.interval-millis`属性开启。

### Kafka Sink连接器

自Flink 0.8起提供Kafka所有版本(0.8+)的特定sink连接器，也提供一个通用版本(Kafka 0.11+)的连接器。以通用版本为例，依赖引入同Kafka Source连接器，示例代码如下：

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

#### 自定义分区和写消息时间戳

Flink Kafka sink的一些构造器接受FlinkKafkaPartitioner参数，用于指定消息写入的分区。默认分区映射是将一个sink task的结果写入到同一个Kafka分区，如果task个数大于分区个数，可能会出现某个分区包含多个sink任务的结果；如果分区个数大于task个数， 默认配置下会有些分区为空，此时Flink应用在事件时间语义下消费空分区会出现问题。

除了FlinkKafkaPartitioner指定分区外，还可以根据消息key指定分区，这需要提供KeyedSerializationSchema参数并将FlinkKafkaPartitioner置为空。最后，Flink Kafka Sink可以配置成自动写入消息时间戳(Kafka 0.10+），调用`setWriteTimestampToKafka(true)`即可。

### Filesystem Source连接器

文件系统以合算(cost-efficient)的方式存储大量数据，Flink支持不同类型的文件系统：HDFS、S3以及OpenStack Swift FS等。文件系统source是flink-streaming-java模块的一部分，因此不需要引入依赖，如下所示代码从hdfs文件读取流：

```java
TextInputFormat lineReader = new TextInputFormat(null);
DataStreamSource<String> lineStream = env.readFile(lineReader,
    "hdfs://path/to/data",
    FileProcessingMode.PROCESS_CONTINUOUSLY,
    30_000L);
```

StreamExecutionEnvironment.readFile()方法包含4个参数，依次为：

- FileInputFormat：用于读取文件内容，示例代码设置为null表示路径另外设置。FileInputFormat读取文件分为2步：
  - 第一步，扫描文件路径然后将所有匹配文件划分为input split，每个split通过offset和length定义一个文件上的一个内容范围，将split分发到所有source task用于并行读取文件。根据文件编码格式，可能只划分出一个split；
  - 第二步，接收一个input split然后读取其定义的文件内容。

在数据流应用中，FileInputFormat对象也应该实现CheckpointableInputFormat接口，否则只提供至少一次保证，该接口定义了读取split时如何设置和恢复检查点。Flink内置实现了CheckpointableInputFormat接口并继承FileInputFormat抽象类的有TextInputFormat(及其子类CsvInputFormat、AvroInputFormat)。

- 读取路径，若为目录则读取所有文件。
- 读取模式，有以下枚举值：
  - PROCESS_ONCE：**只扫描一遍路径**然后读取所有匹配文件，split创建后不会保存检查点；
  - PROCESS_CONTINUOUSLY：**周期性**扫描路径然后读取匹配文件，因此会不停地读取新增和修改文件。新增和修改文件通过文件修改时间戳区分，这意味着向一个文件追加写就会导致该文件重头被处理一次。因此，一种常见技术是将追加内容写入到非读取路径下的临时文件，写入完成后将临时文件挪回读取路径。
- 扫描间隔，和PROCESS_CONTINUOUSLY读取模式搭配使用，PROCESS_ONCE模式下忽略该参数。

由于input split由单个进程生成并按照修改时间排序然后轮流分发到各个task，在使用事件时间语义的应用中，为了生成合适的水印时，需要推断task接收记录的最小时间戳。

### Filesystem Sink连接器

Flink提供StreamingFileSink用于写入结果，它和文件系统source连接器一样包含在flink-streaming-java模块中，不需要额外引入依赖。示例代码如下：

```java
StreamingFileSink<String> fileSink = StreamingFileSink.forRowFormat(
            new Path("/base/path"),
            new SimpleStringEncoder<String>(StandardCharsets.UTF_8.name())
        ).withBucketAssigner(...).build();

lineStream.addSink(fileSink);
```

当StreamingFileSink收到一条记录后，将其分配到一个桶(bucket)中。一个桶是StreamingFileSink构造器中path路径(如示例代码中的`/bash/path`)下的子文件夹，通过withBucketAssigner传入一个实现BucketAssigner接口的对象，该接口给出一条记录对应的BucketId，通过BucketId确定记录写入哪个子文件夹。如果没有指定BucketAssigner，默认使用DateTimeBucketAssigner，它以小时为单位创建bucket。

每个bucket包含多个**块文件(part file)**，它们由StreamingFileSink的多个实例并行写入，并且每个实例将输出写到多个块文件，**命名格式为`[base-path]/[bucket-path]/part-[task-idx]-[id]`**。

:::caution 块文件ID不一定会连续
不相邻的id并不意味着有数据缺失，StreamingFileSink仅确保id单调增加，当丢弃挂起文件(:star:)时不会复用其id。
:::

此外，还可以通过withRollingPolicy()方法传入RollingPolicy参数来设置task何时创建新的块文件。默认使用DefaultRollingPolicy，当写入数据超过128MB或者写入时间超过60s时创建新的块文件。StreamingFileSink支持以下2种写入模式:

- **行编码(Row Encoding)**：每条记录单独编码追加到块文件
- **块编码(Bulk Encoding)**：多条记录分批收集和写入

Apache Parquet文件格式就是以块编码写入，如下代码所示，块编码写入调用forBulkFormat()方法，它需要一个BulkWriter.Factory参数，通过实现BulkWriter.Factory接口来自定义写入格式。

```java
StreamingFileSink<String> sink = StreamingFileSink.forBulkFormat(
    new Path("/base/path"),
    ParquetAvroWriters.forSpecificRecord(AvroPojo.class)
).build();
```

:::caution 注意
当以块编码模式写入时，不能选择RollingPolicy而只能是OnCheckpointRollingPolicy。
:::

StreamingFileSink支持精准一次保证，它将文件写入分为不同阶段(状态转换通过重命名实现)：

1. **正写入(In Progress)**：sink开始写块文件A，将该文件标记为in-progress状态；
2. **挂起(Pending)**:star:：根据RollingPolicy设置条件触发写入另一个块文件B时，A关闭然后标记为pending状态；
3. **完成(Finished)**：检查点完成后将A标记为finished状态。

:::caution 注意
某些情况下，pending文件可能永远不会被提交，StreamingFileSink确保没有数据丢失但是不会自动清理这些未提交的文件。如果发现与pending文件的task id相同但是id更高的finished文件，可以手动删除该pending文件。
:::

当遇到故障后，sink task重置in-progress文件的写入位置到上一次检查点时位置，通常使用文件系统truncate操作实现。

:::danger 小心
如果应用没有开启检查点，StreamingFileSink永远不会将文件由pending状态改为finished状态。
:::

### Cassandra Sink连接器

Apache Cassandra是一种可扩展、高可用的列式存储数据库系统，提供类SQL语言CQL读写记录。使用Flink Cassandra Sink连接器需要引入如下依赖：

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-cassandra_${scala.binary.version}</artifactId>
    <version>${flink.version}</version>
</dependency>
```

为了演示Cassandra Sink连接器的使用，通过如下CQL创建键空间example和表sensors：

```sql
CREATE KEYSPACE IF NOT EXISTS example
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

CREATE TABLE IF NOT EXISTS example.sensors (
  sensorId VARCHAR,
  temperature FLOAT,
  PRIMARY KEY(sensorId)
);
```

当写入类型为Tuple或者Row时，需要指定一条CQL插入语句，如下代码所示。执行时按照tuple或者row的元素顺序依次插入到占位符中。

```java
CassandraSink<Tuple2<String, Double>> cassandraSink = CassandraSink.addSink(readings)
    .setHost("localhost")
    .setQuery("INSERT INTO example.sensors(sensorId, temperature) VALUES (?, ?);")
    .build();
```

当写入类型为POJO时，由于其字段没有顺序，需要在POJO类上添加Cassandra注解，如下代码所示：

```java
@Table(keyspace = "example", name = "sensors")
public class SensorReadings {
    @Column(name = "sensorId")
    public String id;

    @Column(name = "temperature")
    public Float temperature;

    public SensorReadings() {}
}
// 不需要设置CQL
DataStream<SensorReadings> readings = ...
CassandraSink.addSink(readings)
    .setHost("localhost")
    .build()
```

Cassandra Sink连接器提供如下配置方法：

- setClusterBuilder(ClusterBuilder)：参数ClusterBuilder设置Cassandra集群管理连接
- setHost(String, [Int])：设置Cassandra地址和端口号，端口没配默认9042
- setQuery(String)：写入数据类型为Tuple、Row时使用，数据类型为POJO时不能配置
- setMapperOptions(MapperOptions)：Cassandra对象映射器配置，比如TTL、null字段处理等，写入类型为Tuple、Row时忽略该配置
- enableWriteAheadLog([CheckpointCommitter])：开启WAL以提供精准一次保证，CheckpointCommitter用于存储完成的检查点信息，如果没有则将检查点信息写入到特定的Cassandra表中，详见[事务型sink连接器]
