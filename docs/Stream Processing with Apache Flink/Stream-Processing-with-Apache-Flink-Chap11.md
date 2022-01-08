---
layout: article
title: 何去何从
slug: /Stream-Processing-with-Apache-Flink/Chap11
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第11章读书笔记
:::

到此已经完成了本书所有内容，本章简短地介绍下Flink其他特性以及Flink社区资源。

## Flink生态系统的其他部分

尽管本书主要关注流处理，但实际上Flink是一种通用的分布式数据处理框架，它还提供关联查询、复杂事件处理(Complex Event Processing，CEP)和图处理的领域特定API库。

### 用于批处理的DataSet API

除了处理的数据是有限集合外，DataSet API和DataStream API一样提供了filter、map、join等算子，并且能够执行循环。

当前DataSet和DataStream API使用两种不同的执行环境，但Flink社区致力于将两者融合为一套同时处理有界、无界数据流的API。

### 用于关联查询的Table API和SQL

Table API和SQL是基于DataStream API和DataSet API的高层统一抽象。

Table API是一种为Scala和Java设计的语言级集成查询API(Language-integrated Query，LING)，提供select、映射、聚合和连接等关联查询，并且还有自动补全和语法校验的IDE支持。

Flink SQL遵循ANSI SQL标准并使用[Apache Calcite](https://calcite.apache.org/)来解析查询语句和优化，为批处理查询和流处理查询提供统一语法和语义。由于支持UDF扩展，Flink SQL可以覆盖各种使用场景。Flink SQL可以嵌入到数据流(集)应用中，或者通过SQL CLI客户端提交。

### 用于负责事件处理和模式匹配的FlinkCEP

FlinkCEP是基于DataStream的API库，用于复杂事件的模式检测，使用场景包括金融应用、欺诈检测、复杂系统的监控和告警、网络入侵检测和可疑用户行为检测等。

### 用于图处理的Gelly

Gelly是Flink基于DataSet的图处理API库，提供图转换、集合以及迭代处理，包含常用的图算法。

:::tip
Flink的高级API可以互相集成使用，比如使用CEP从数据流中提取模式，然后使用SQL分析或者使用Table API将表转为图，并使用Gelly分析。
:::

## Flink社区

:mailbox_with_mail: 邮箱：

- user@flink.apache.org
- dev@flink.apache.org
- community@flink.apache.org

:pencil: 博客：

- https://flink.apahce.org/blog
- https://www.ververica.com/blog

:people_holding_hands: 会议：

- https://flink-forward.org
- https://www.meetup.com/topics/apache-flink