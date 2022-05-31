---
layout: article
title: 消费者
slug: /Mastering-Apache-Pulsar/Chap05
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第5章读书笔记
:::

## 消费者意味着什么?

Pulsar topic是不可变的日志文件，该日志由生产者提供由消费者获取。Pulasr提供订阅(subscription)机制规定消费者获取topic的规则。

## 订阅

订阅机制是Pulsar为消费者提供的抽象和配置，如下图所示有4个topic，生产者添加消息后又broker将消息路由到对应的消费者。具体地，订阅机制包含如下几点元数据：

- topic名称或者topic分区名；
- 订阅名称；
- 有关订阅的到期信息；
- 订阅游标：标记消费者获取日志的偏移量。

尽管broker是无状态的，但游标是有状态的。Pulsar将游标信息保存在BookKeeper中，如下图所示，游标保存在ledger中，随着ledger的更新而更新。接下来介绍Pulsar对订阅的分类。

### 独家订阅

独家(Exclusive)订阅指消费者和订阅之间是一对一关系，注意订阅和topic是互相独立的概念，因此在一个topic上可以存在多个独家订阅。

```java
Consumer consumer = client.newConsumer()
    .topic("my-topic")
    .subscriptionName("my-subscription")
    .ackTimeout(10, TimeUnit.SECONDS)
    .subscriptionType(SubscriptionType.Exclusive)     // 订阅类型，可选项
    .subscribe();
```

如果另一个消费者试图加入已有消费者的独家订阅，那它将会被拒绝，如下图所示：

![Exclusive Subscription](/img/doc/Master-Apache-Pulsar/chap05/error-on-exclusive-subscription.png)

独家订阅的意义：操作简单(易于调试)、**保证消息有序**。

### 共享订阅

共享(Shared)订阅指消费者和订阅之间是多对一关系，如下图所示，多个消费者将会按照轮询的方式接收消息。

![Shared Subscription](/img/doc/Master-Apache-Pulsar/chap05/round-robin-shared-subscription.png)

```java
Consumer consumer = client.newConsumer()
        .topic("my-topic")
        .subscriptionName("my-subscription")
        .ackTimeout(10, TimeUnit.SECONDS)
        .subscriptionType(SubscriptionType.Shared)
        .subscribe();
```

共享订阅的局限：

- 不能保证消息有序性：消费者和topic之间没有顺序的概念，不能保证有序性。幸运地是大部分应用不需要有序性。
- 一套确定模式(Acknowledgment Schemas)：共享订阅下一次发送一条消息，那消费者每次都要响应一次，消耗时间和网络带宽。

### Key_Shared订阅

Key_Shared订阅类类似共享订阅，但粒度更细，消费者只能订阅某个主键的消息(主键是消息的一个字段或者多个字段的组合)，如下图所示：

![Key_Shared Subscription](/img/doc/Master-Apache-Pulsar/chap05/key_shared_subscription.png)

共享订阅难以保证消息有序性，因为消息时轮询发送给消费者。而key_shared按照主键划分确保一组消息都由同一个消费者获取，改善了顺序保证性。由于消费者按照主键分类获取消息，因此在定义Key_Shared订阅时，除了给出订阅类型外，还需要给出划分策略。

Pulsar提供2种划分策略：自动哈希和粘性(sticky)哈希。前者使用一致性哈希确保消费者上线、掉线时的负载平衡；后者是客户端手动设置，所有在某个范围内的哈希都会分配到同一个消费者。

```java
Consumer < String > consumer = client.newConsumer(Schema.JSON)
    .subscriptionMode(SubscriptionMode.Durable)
    .topic("our-topic")
    .consumerName("auto-hashed-consumer")
    .subscriptionName("auto-hashed")
    .subscriptionType(SubscriptionType.Key_Shared)
    .keySharedPolicy(KeySharedPolicy.autoSplitHashRange())
    .subscribe();

consumer = client.newConsumer(Schema.STRING)
    .subscriptionMode(SubscriptionMode.Durable)
    .topic("persistent://public/default/sticky")
    .consumerName("my-consumer")
    .subscriptionName("sticky-sub")
    .subscriptionType(SubscriptionType.Key_Shared)
    .keySharedPolicy(KeySharedPolicy.stickyHashRange().ranges(range))
    .subscribe();
```

### Failover订阅

Failover订阅允许多个消费者连接topic，但是broker只会选择一个消费者(通常是第一个订阅的消费者)作为leader，消息将只通过该消费者传递，如下图所示。

![Failover Subscription](/img/doc/Master-Apache-Pulsar/chap05/failover-subscription.png)

```java
Consumer consumer = client.newConsumer()
    .topic("my-topic")
    .subscriptionName("my-subscription")
    .ackTimeout(10, TimeUnit.SECONDS)
    .subscriptionType(SubscriptionType.Failover)
    .subscribe();
```

Failover订阅在确保有序性的同时，还确保消息处理的性能。

## ACK响应

ACK响应指由消费者发送给broker的应答，收到该应答即意味着一组消息已经被消费(broker可以选择删除消息)。Pulsar支持2种ACK：单个ACK和累计ACK。

### 单个ACK

默认情况下，topic的每条消息都对应一个ACK，所有订阅模式都支持单个ACK(Individual Ack)。

![Individual Ack](/img/doc/Master-Apache-Pulsar/chap05/individual-ack.png)

### 累计ACK

累计ACK是某个偏移位置消息的答应，意味着该消息之前的所有消息都已成功处理(批量应答)，所有订阅模式都支持累计ACK(Cumulative Ack)。

![Cumulative Ack](/img/doc/Master-Apache-Pulsar/chap05/cumulative-ack.png)
