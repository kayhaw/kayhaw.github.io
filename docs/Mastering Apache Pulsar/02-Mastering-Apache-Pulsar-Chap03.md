---
layout: article
title: Pulsar
slug: /Mastering-Apache-Pulsar/Chap03
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第3章读书笔记
:::

## Pulsar起源

在2013年，有8亿用户使用雅虎公司提供的各类服务，在雅虎公司以面向服务的架构中，消息系统起着至关作用。在评估现有消息系统技术后，发现没有一项能够满足如此大的规模需求，雅虎公司决定自己开发Pulsar。

## Pulsar设计理念

基本设计原则：模块化同时不向性能妥协，由此衍生的设计点：多租户、异地备份。

### 多租户

通过命名空间（一组topic的集合），Pulsar将允许客户端运行在集群的特定部分，详见第4章。

### 异地备份

### 性能

### 模块化

## Pulsar生态

作为开源项目，广大开发者构建了强大工具集来配合使用Pulsar底层技术，主要有：Pulsar Function、Pulsar IO和Pulsar SQL。

### Pulsar Function

如下图所示，Pulsar Function是**从topic获取数据**、进行计算、**发布到其他topic**的轻量级进程。本着模块化的设计思想，Pulsar Function可以使用Java、Python和Go多种语言开发，其运行时和Pulsar运行时互相独立。

![Pulsar Function](/img/doc/Master-Apache-Pulsar/pulsar-function.png)

### Pulsar IO

连接器框架Pulsar IO让Pulsar topic成为其他系统的输入或输出，如下图所示，MySQL数据库记录先输出到Pulsar topic，接着由Pulsar topic输出到Elastic Search上的某个index。和Pulsar Function一样也是独立模块，详见第7章。

![Pulsar IO Example](/img/doc/Master-Apache-Pulsar/pulsar-io-example.png)

### Pulsar SQL

Pulsar SQL使用Apache Presto来实现通过SQL查询Pulsar topic中的数据，**Pulsar SQL**只能读取数据，而Kafka的KSQL允许创建新topic，详见第10章。

## Pulsar成名之路

通过3家使用Pulsar的公司讲述Pulsar如何帮助它们解决业务问题，分别是雅虎日本、Splunk和Iterable，相关资料：

- [Apache Pulsar at Yahoo!Japan](https://medium.com/streamnative/apache-pulsar-at-yahoo-japan-b7765bb7b58c)
- [Why Splunk Chose Pulsar](https://pulsar-summit.org/en/event/virtual-conference-2020/sessions/why-splunk-chose-pulsar)
- [How Apache Pulsar is Helping Iterable Scale its Customer Engagement Platform](https://www.infoq.com/articles/pulsar-customer-engagement-platform/)

## 总结

Pulsar相比于Kafka等其他消息系统的特点：

1. 低延迟消息传递；
2. 异地备份；
3. 同时兼容队列和事件流模型。
