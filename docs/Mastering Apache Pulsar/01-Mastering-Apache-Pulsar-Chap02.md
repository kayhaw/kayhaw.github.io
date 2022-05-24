---
layout: article
title: 事件流和事件代理
slug: /Mastering-Apache-Pulsar/Chap02
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第2章读书笔记
:::

在实时系统中，**事件流(Event Stream)**指无穷的事件序列，**事件代理(Event Brokers)**指读写、保存事件的技术平台。Apache Pulsar本质上也是事件代理，但它提供的能力不仅于此。为了深入理解Pulsar的独特之处，先分析下当前事件代理的优缺点。

## 发布/订阅

主流的消息中间件都支持发布/订阅模式，它来自于Kenneth Birman和Thomas Joseph在1987年发表的论文*Exploiting virtual synchrony in distributed systems*，论文描述了本质上是异步但能够达到同步效果的发布/订阅模式。如下图所示，发布者无需知道谁是订阅者，只管发布消息，订阅者无需直到消息产生机制，只管获取消息。从而将发布者与订阅者解耦。

![Publish and Subscribe Pattern](/img/doc/Master-Apache-Pulsar/producer-consumer.png)

当发布者和订阅者增加时，用户交互的感觉如同步操作一样，尽管本质是异步的。

事件流实现了发布/订阅机制，但它有个显著不同点：**事件代理必须为每位订阅者维护相同顺序的消息。**

## 队列

与发布/订阅模型让每个订阅者都收到消息不同，队列模型只允许**一个**订阅者获取消息。队列模式处理一种特殊的生产/发布问题：每条消息在等待工作完成，并且由订阅者执行该工作。以一次会议邀请过程为例，邀请任何有权限的人是队列模型，而邀请特定的人是事件流模型。

队列模型比事件流模型更加直接，适用于更大的一类应用：上游获取工作单元将其发布到消息同步，下游执行工作单元。邮箱、取消订阅、删除记录、事件编排和索引等都是属于此类应用。

专为队列模型而设计的消息系统被称为工作队列(work queue)，它的设计包含如下3点目标：

1. 记录所有要完成的工作；
2. 让合适worker执行工作；
3. 报告成功、失败的工作。

Beanstalkd就是一个广泛使用的工作队列，它将工作项编排存在tube(可以看成queue)中，tube包含有序的工作项并带有名字。Beanstalkd的发布者就是接收工作项的客户端，订阅者就是获取工作项的客户端，示例代码如下：

```python title=publisher.py
import beanstalkc
beanstalk = beanstalkc.Connection(host='localhost', port=14711)
# 创建名为worka的tube
beanstalk.use('worka') 
beanstalk.put('my job 123')
```

```python title=subscriber.py
import beanstalkc
beanstalk = beanstalkc.Connection(host='localhost', port=14711)
beanstalk.use('worka')
job = beanstalk.reserve() // 预订tube中的job
job.body // 打印"my job 123"
job.delete() // 删除job，即标记其已完成
```

队列模型的特点：1. 工作完成后没有必要再保存它；2. 预订工作的顺序不一定和工作加入队列顺序相同。

## 故障模型

消息系统故障在传递消息给订阅者时、接收发布者的消息时都有可能发生，鉴于系统的设计和使用场景，不同故障也有着不同严重等级。构建消息系统应该是抗故障的，在消息接收、发送和存储这3块的故障处理需要考虑周到。在下一章给出Pulsar是如何应对这些问题。

## 推送vs拉取

当生产者发布消息到消息系统，有两种方式将消息传递到消费者：推送(push)和拉取(pull)。

在推送模式下，由broker在预先配置下将消息推送到消费者：比如按照频率推送或者每达到多少条消息就推送。现今主流消息系统都采用push机制。但消费者掉线会导致推送失败，此时需要设置故障处理，比如重试或者把消息推送给其他消费者。在拉取模式下，消费者自行请求获取消息，但存在不能按时接收消息或者接收完整消息的情况。

## 为什么需要Pulsar

在了解消息系统的发展、处理模型，以及现有的消息系统RabbitMQ、ActiveMQ和Apache Kafka之后，为什么还再开发另一个？Apache Pulsar和其他现有技术的不同：

1. 统一流模型和事件模型；
2. 模块化；
3. 更好的性能。

### 一体化

事件流处理要求消息有序，但是也存在不关心消息有序性的场景。为了统一处理，Pulsar允许topic是队列或者事件流。

### 模块化

Pulsar的模块化设计令其能够同时处理队列模型和事件流模型，这将在下一章中展开。Pulsar主要功能模块有：

- 保存有限期消息；
- 保存长期消息；
- 确保topic内消息有序。

其中短期存储由Pulsar broker管理，长期存储由BookKeeper处理。此外，将现有消息系统迁移至Pulsar是不可行，因为协议和客户端依赖各不相同。但Pulsar的桥接框架模块提供将AMQP协议翻译成Pulsar理解格式，因此Pulsar可以与现有消息系统共存，再逐步迁移到Pulsar。

Pulsar的模块化设计也在其生态中展现：支持Function as a Service、支持SQL查询和变更数据捕获(Change Data Capture，CDC)。

### 性能更好?

Pulsar通过BookKeeper集群灵活扩展存储节点，真实性能比较见[Benchmarking Pulsar and Kafka - A More Accurate Perspective on Pulsar’s Performance](https://streamnative.io/en/blog/tech/2020-11-09-benchmark-pulsar-kafka-performance/)。

## 总结

1. 事件流和队列模型的区别：
   1. 事件流有多个消息者，消息处理有序，消息数量无限；
   2. 队列模型只有一个消费者，消息处理无序，消息数量有限。
2. Pulsar的独特性在于它能同时支持两种事件流和队列模式。
