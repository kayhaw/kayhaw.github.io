---
layout: article
title: Pulsar组件
slug: /Mastering-Apache-Pulsar/Chap04
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第4章读书笔记
:::

如下图所示，Pulsar内部组件包含：brokers、Apache BookKeeper和ZooKeeper。

![Pulsar Components](/img/doc/Master-Apache-Pulsar/chap04/pulsar-components.png)

## Brokers

Pulsar brokers负责如下内容：

- topic数据的临时存储管理(缓存)；
- 与BookKeeper/ZooKeeper通信；
- 模式校验；
- 与其他broker通信；
- 提供Pulsar Functions和Pulsar IO的运行时环境。

![Pulsar Brokers](/img/doc/Master-Apache-Pulsar/chap04/pulsar-brokers.png)

### 消息缓存

与其他消息brokers不同，Pulsar brokers是**无状态的**：不保存消息处理时的任何数据。好处：存算分离，容错性更高；坏处：额外的状态管理系统，额外的抽象将Pulsar存储翻译成其他存储系统。

Pulsar依赖Apache BookKeeper进行存储，并在BookKeeper顶层抽象出managed ledger使用，Managed ledger是broker和BookKeeper ledger之间的桥梁。如下图所示一个典型的Pulsar topic拓扑图：broker1负责读写topic，写topic是将数据写入到每个BookKeeper实例，读topic是从leader节点读取数据。

![Bookies store Data from Topic](/img/doc/Master-Apache-Pulsar/chap04/broker-topic-bookie.png)

在流环境下，每条消息都需要写到BookKeeper，此时broker将最新消息缓存发送给消费者而不是保存到BookKeeper然后再读取，如下图所示。

![Managed Ledger Cache](/img/doc/Master-Apache-Pulsar/chap04/broker-cache-ledger.png)

注意缓存是易失性的，不能作为永久存储。Broker对缓存数据有着生命周期限制，详见第5、6章。

### 与BookKeeper/ZooKeeper通信

ZookKeeper保存所有Pulsar集群的相关元数据：哪个broker是leader节点，服务发现配置和其他管理信息。BookKeeper是Pulsar的存储引擎，保存所有消息数据。因此broker需要与BookKeeper/ZookKeeper通信。

### 模式校验

模式校验确保发布给topic的消息符合预定规范，由broker执行。

### Broker间通信

Broker将元数据存储在ZooKeeper，当客户端请求读写的topic不在某个broker上，该broker负责将客户端指向到正确的broker，如下图所示：

![Inter-broker Communication](/img/doc/Master-Apache-Pulsar/chap04/inter-broker-communication.png)

### Pulsar Function和Pulsar IO

Broker是影响Pulsar吞吐量的主要因素，如果broker忙于处理Pulsar Function或者Pulsar IO，势必会影响系统整体性能。尽管大部分情况下这种性能退化问题不大，但是将Pulsar IO/Function放到其他集群将会改善性能，并且Pulsar提供相应机制。

## Apache BookKeeper

[Apache BookKeeper](https://www.splunk.com/en_us/blog/it/introduction-to-apache-bookkeeper.html)是一个通用型数据存储系统，架构如下图所示：由被称为bookie的服务器组成集群，每个bookie上包含称之为ledger的存储系统。

![BookKeeper Simple Architecture](/img/doc/Master-Apache-Pulsar/chap04/bookkeeper-architecture.png)

Ledger是一种**只能追加**的日志，如下所示，一个ledger包含多个entry，一系列ledger被称为stream：

![BookKeeper Ledger Stream](/img/doc/Master-Apache-Pulsar/chap04/ledger-stream.png)

BookKeeper使用基于候选团的副本机制处理分布式数据存储，这里简化为3个参数：

1. **E**：Ensemble size，节点总数；
2. **Q_w**：Quorum write，每个entry的副本数；
3. **Q_a**：Quorum acknowledgment，每个entry的响应数。

通常节点数量大于等于副本数量，响应数小于等于副本数。如下图所示E=3、Q_w=3、Q_a=3，表示一共3个节点，每个entry有3份副本，每个节点必须响应。

![Ledger Example1](/img/doc/Master-Apache-Pulsar/chap04/ledger-example1.png)

如下图所示E=5、Q_w=3、Q_a=3，表示一共5个节点，每个entry有3份副本，每个副本都需要响应。

![Ledger Example2](/img/doc/Master-Apache-Pulsar/chap04/ledger-example2.png)

实际上一个bookie节点包含一个ledger的一部分(fragment)，以fragment为单位bookie节点上复制，如下图所示。

![Ledger Fragment](/img/doc/Master-Apache-Pulsar/chap04/ledger-fragment.png)

### 写前日志

写前日志(Write-Ahead Log，WAL)在数据库系统中用于提供原子性和持久性。如下图所示，数据库系统将执行的增删改操作写入日志中，然后根据日志检查是否完成操作。写前日志还用于变更数据捕获(Change Data Capture，CDC)，在Pulsar IO正是用数据库的写前日志来实现CDC，详见第7章。

![Write-Ahead Log](/img/doc/Master-Apache-Pulsar/chap04/write-ahead-log.png)

BookKeeper的持久性、容错性和扩展性使其成为实现WAL的选择之一。

### 消息存储

对于Pulsar、Kafka和Pravega来说，消息持久化至关重要。而BookKeeper的ledger存储模型(只追加日志、高持久、易分布)是存储事件流的最佳方案，如下图所示，topic数据有序地存放在ledger中。

![BookKeeper Ledger](/img/doc/Master-Apache-Pulsar/chap04/bookkeeper-ledger.png)

### Object/Blob存储

BookKeeper通过BlobIt提供对象/二进制大对象的存储，支持容错并提供Amazon S3兼容API。

### Pravega

Pravega是类似Pulsar的分布式消息系统，由Dell公司开发。和Pulsar一样使用BookKeeper存储topic数据，如下图所示。值得注意的是，Pravega还可用于处理视频流和大文件流。

![Pravege Architecture](/img/doc/Master-Apache-Pulsar/chap04/pravega-architecture.png)

### Majordodo

Majordodo是处理集群工作调度的资源管理器，由Diennea公司开发。Majordodo使用BookKeeper ledger跟踪集群工作负载情况。

## Apache ZooKeeper

ZooKeeper由雅虎公司开发，基于谷歌工程师Mike Burrows的论文*The Chubby Lock Service for Loosely-Coupled Distributed Systems*而实现。ZooKeeper实现了Paxos和Raft分布式算法，以及两阶段提交协议(如下图所示)。

![ZooKeeper Two](/img/doc/Master-Apache-Pulsar/chap04/zookkeeper-two-phase-commit.png)

ZooKeeper使用场景包括：

### 命名服务

命名服务(Naming Service)将网络资源映射成对应地址，ZooKeeper保存每个节点状态以及leader、follower信息，当节点需要协调时使用ZooKeeper作为查找信息。

### 配置管理

Pulsar有着约150个配置项，它们影响着Pulsar、BookKeeper和ZooKeeper的行为。Pulsar broker将配置项保存在ZooKeeper中，因为ZooKeeper也提供安全可靠的分布式存储。

### Leader选举

Leader选举指在分布式系统中选择承担某些责任的leader(主节点)，在Apache Pulsar中，一个broker就是某个topic的leader。基于命名服务和配置管理，ZooKeeper跟踪leader状态，在其失效后选择新leader。

### 通知系统

ZooKeeper提供高质量的命名服务也意味着其是个出色的通知系统。

### Apache Kafka

Kafka使用ZooKeeper来进行配置管理和leader选举，如下图所示：

![Kafka with ZooKeeper](/img/doc/Master-Apache-Pulsar/chap04/kafka-with-zookeeper.png)

但从v2.8开始，Kafka将ZooKeeper移除，由集群自身实现Raft一致性协议，如下图所示：

![Kafka without ZooKeeper](/img/doc/Master-Apache-Pulsar/chap04/kafka-without-zookeeper.png)

### Apache Druid

Apache Druid是由Metamarkets开发的实时分析数据库，使用ZooKeeper进行配置管和一致性管理。

## Pulsar Proxy

当在私有网络部署Pulsar时，需要Pulsar proxy作为网关来简化向外暴露brokers的过程，如下图所示：

![Pulsar on K8S](/img/doc/Master-Apache-Pulsar/chap04/plusar-on-k8s.png)

![Pulsar Proxy](/img/doc/Master-Apache-Pulsar/chap04/pulsar-proxy.png)

为了减轻proxy压力，需要proxy frontend专门处理来自集群边缘网络的流量。如下图所示，proxy更适合在brokers之间的路由，在其之上引入专门的前端(比如NGINX、HAProxy等)用来做外部请求的负载均衡。

![Proxy without Frontend](/img/doc/Master-Apache-Pulsar/chap04/proxy-without-frontend.png)

![Proxy with Frontend](/img/doc/Master-Apache-Pulsar/chap04/proxy-with-frontend.png)

## JVM

本节介绍为什么Pulsar使用Java开发(这个节标题取得不太好:confused:)。回到启动开发Pulsar的2013年，雅虎经历着爆炸的用户增长，此时大数据技术以Hadoop生态为代表，而Hadoop生态技术都是用Java开发。Java各类场景库应有尽有，包含但不限于：

- Netty：网络服务；
- Apache Spark：基于内存的分布式计算系统；
- Apache Lucene：索引引擎。

## 总结

Pulsar系统由broker、BookKeeper和ZooKeeper组成：

1. Broker提供消息读写以及缓存，模式校验以及Pulsar Functions和Pulsar IO的运行时；
2. BookKeeper负责消息存储，每个节点称为bookie，消息存储抽象为只读日志ledger；
3. BookKeeper依赖于ZooKeeper提供协调服务。
