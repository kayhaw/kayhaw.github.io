---
layout: article
title: Pulsar IO
slug: /Mastering-Apache-Pulsar/Chap07
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第7章读书笔记
:::

## Pulsar IO架构

Pulsar提供生产和消费消息的框架，基于Pulsar Function实现。

![Pulsar IO Architecture](/img/doc/Mastering-Apache-Pulsar/chap07/pulsar-io-architecture.png)

### 运行时

Pulsar IO的运行时包含broker、Puslar Function、BookKeeper和Puslar IO连接器框架。

### 性能

Pulsar IO性能受限于broker资源，本质是运行在broker上的轻量级JVM进程。

## 使用场景

Pulsar IO是一个提供可重复执行、配置驱动的数据传输框架，典型使用场景包含：

### 简单事件处理流水线

许多流处理应用需要将从topic中读取消息、处理后发布到新topic，Pulsar IO适用于这种简单事件处理流水线，其特点是：

- 单一数据来源(topic)；
- 对topic消息的处理是可重复的；
- 单一数据目标源。

![Simple Event Processing Pipeline](/img/doc/Mastering-Apache-Pulsar/chap07/simple-event-process-pipeline.png)

### 变更数据捕获(CDC)

CDC(Change Data Capture)指跟踪记录的变化，在数据仓库中用于保存事务型数据库的事务。CDC典型实现是写前日志(WAL)，Pulsar IO通过Debezium支持MySQL、PostgreSQL、MongoDB、Cassandra和Oracle等数据库的CDC。

## 注意事项

在使用Pulsar IO时需要注意如下几点：

### 消息序列化

在使用source连接器和sink连接器时，消息序列化是必须考虑的事项。一旦消息schema更改就会导致Pulsar IO出错。

### 流水线稳定性

在构建source/sink连接器时，源端故障需要Pulsar IO连接器重启，目标端故障会导致消息无法响应，这些都是导致流水线不稳定的因素。

### 故障处理

source和sink连接器在连接或写入出错时，Pulsar IO API都提供了异常声明：

```java
/**
  * Open connector with configuration
  *
  * @param config initialization config
  * @param sinkContext
  * @throws Exception IO type exceptions when opening a connector
  */
void open(final Map<String, Object> config,
SinkContext sinkContext) throws Exception;

/**
  * Write a message to Sink
  * @param record record to write to sink
  * @throws Exception
  */
void write(Record<T> record) throws Exception;
```

## 总结

Pulsar IO基于Pulsar Functions，提供外部数据源读取、写入能力。
