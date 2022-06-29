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

![Exclusive Subscription](/img/doc/Mastering-Apache-Pulsar/chap05/error-on-exclusive-subscription.png)

独家订阅的意义：操作简单(易于调试)、**保证消息有序**。

### 共享订阅

共享(Shared)订阅指消费者和订阅之间是多对一关系，如下图所示，多个消费者将会按照轮询的方式接收消息。

![Shared Subscription](/img/doc/Mastering-Apache-Pulsar/chap05/round-robin-shared-subscription.png)

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

![Key_Shared Subscription](/img/doc/Mastering-Apache-Pulsar/chap05/key_shared_subscription.png)

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

![Failover Subscription](/img/doc/Mastering-Apache-Pulsar/chap05/failover-subscription.png)

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

![Individual Ack](/img/doc/Mastering-Apache-Pulsar/chap05/individual-ack.png)

### 累计ACK

累计ACK是某个偏移位置消息的答应，意味着该消息之前的所有消息都已成功处理(批量应答)，所有订阅模式都支持累计ACK(Cumulative Ack)。

![Cumulative Ack](/img/doc/Mastering-Apache-Pulsar/chap05/cumulative-ack.png)

## 模式

模式(schema)是Pulsar生态中可选但是颇具影响的部分，本节介绍消费者与模式的交互部分。

### 消费者模式管理

消费者和模式的交互有2种：

1. 当topic设置了schema，消费者只需要按照schema解码消息(schema随着消息一块发送)；
2. 当topic没有设置schema，消费者自行注册schema。

## 消费模式

一个一个串行地消费消息可能是最好的，但Pulsar提供额外的消费模式。

### 批处理

批处理(Batching)模式对消费者没有什么重大影响，只不过消费者会对整批的消息响应ACK。在Pulsar 2.8版本之前，如果消费者在处理最后几条消息时挂掉，批处理模式下需要重头开始处理。但自Pulsar 2.8起，引入批索引(batch index)准确地指出上一个批处理的结束位置。

![Batching Consumption](/img/doc/Mastering-Apache-Pulsar/chap05/batching-consumption.png)

### 块处理

块处理模式下消费者接收带有元数据消息块，将其拼接完整后回复ACK，如下图所示：

![Chunk Consumption](/img/doc/Mastering-Apache-Pulsar/chap05/chunk-consumption.png)

## 高级设置

### 延迟消息

延迟消息指延迟发送消息，**只能**在共享订阅下使用。如下图所示，当消费者获取topic中的延迟消息，由DelayedDeliveryTracker配置超时时间后才发送消息给消费者。

![Delayed Messages](/img/doc/Mastering-Apache-Pulsar/chap05/delayed-messages.png)

```java
producer.newMessage().deliverAfter(5L, TimeUnit.Minute).
    value("Hello Moto!").send();
```

### 保留策略

Pulsar提供2个参数来配置**已响应消息**的保留策略：保留时间、保留大小。如下所示通过Pulsar Admin命令行工具设置消息保留时间为3小时，保留大小为10GB：

```bash
pulsar-admin namespaces set-retention 
    my-tenant/new-namespace \
    --size 10G \
    --time 3h
```

| 保留时间 | 保留大小 | 保留策略                    |
| -------- | -------- | ------------------------- |
| -1       | -1       | 永久保留                   |
| -1       | >0       | 达到指定大小后不再保        |
| 0        | -1       | 达到指定时间后不再保留      |
| 0        | 0        | 禁用保留                   |
| 0        | >0       | 无效值                     |
| >0       | 0        | 无效值                     |
| >0       | >0       | 达到指定时间或大小后不再保留 |

### 积压配额

默认情况下，Pulsar保存所有**未响应消息**，通过积压配额(Backlog Quotas)设置未响应消息的保留策略：

```bash
pulsar-admin namespaces set-backlog-quota my-tenant/my-namespace \
  --limit 2G \
  --limitTime 36000 \
  --policy producer_request_hold
```

当未响应消息达到积压配额后，通过`policy`参数设置接下来的行为：

- **producer_request_hold**：broker不再保留消息；
- **producer_exception**：broker断开连接并抛出异常；
- **consumer_backlog_eviction**：broker删除积压消息。

此外，还可以设置消息TTL：

```bash
pulsar-admin namespaces set-message-ttl my-tenant/my-namespace \
    --messageTTL 120 # 单位秒
```

:::info 积压配额和保留策略异同
相同点：

- 提供时间、体积2种配置参数
- 设置级别为namespace

不同点：

- 保留策略直接删除，积压配额行为由设置决定
- 保留策略针对已响应消息，积压配额针对未响应消息
:::

## 消费者配置

### Replay

重放消息(replay)指从头开始读取topic中的消息，Pulsar提供3种方式：

- 代码重置游标：

```java
import org.apache.pulsar.client.api.MessageId;
import org.apache.pulsar.client.api.Reader;

Reader<byte[]> reader = pulsarClient.newReader()
    .topic("read-from-topic")
    .startMessageId(MessageId.earliest) // get data at earliest offset
    .create();

while (true) {
    Message message = reader.readNext();

    // Get messages after this point
}
```

![Replay](/img/doc/Mastering-Apache-Pulsar/chap05/replay.png)

- 设置negative ACK：

```java
Consumer<byte[]> consumer = 
        Client
            .newConsumer()
            .subscriptionType(SubscriptionType.Key_Shared)
            .subscriptionName("abc-sub")
            .topic("abbc")
            .subscribe();
while (true) {
    Message<byte[]> message = consumer.receive(100, TimeUnit.MILLISECONDS);
    if (message != null) {
    System.out.println(new String(message.getData()));
    consumer.negativeAcknowledge(message);
}
```

![Negative ACK](/img/doc/Mastering-Apache-Pulsar/chap05/negative-ack.png)

- 命令行重置游标：

```bash
pulsar-admin topics reset-cursor topic a --subscription my-subscription

POST/admin/persistent/:tenant/:namespace/
    :destination/subscription/:subName/resetcursor
```

### Dead Letter Topics

当遇到不能被处理的消息(模式校验失败、消费者不能及时处理、消费者处理时故障)时，可设置Dead Letter Topic保存失败消息，在Pulsar中消息失败表现为2种：negative ACK、ACK超时。通过如下代码设置订阅的Dead Letter Topic:

```java
Consumer<byte[]> consumer = pulsarClient.newConsumer(Schema.BYTES)
    .topic(topic)
    .subscriptionName("hello-moto")
    .subscriptionType(SubscriptionType.Shared)
    .deadLetterPolicy(DeadLetterPolicy.builder()
        .maxRedeliverCount(maxRedeliveryCount)
        .deadLetterTopic("hello-moto-dlq") // 设置dead letter topic名称
        .build())
    .subscribe();
```

默认dead letter topic的名称为`<topicname>-<subscriptionname>-DLQ`，也可以代码设置。

### Retry Letter Topic

Retry letter topic用于消费者重新获取消息：

```java
Consumer<byte[]> consumer = pulsarClient.newConsumer(Schema.BYTES)
    .topic(topic)
    .subscriptionName("scary-hours")
    .subscriptionType(SubscriptionType.Shared)
    .enableRetry(true)
    .receiverQueueSize(100)
    .deadLetterPolicy(DeadLetterPolicy.builder()
        .maxRedeliverCount(maxRedeliveryCount)
        .retryLetterTopic("persistent://my-property/my-ns/scary-hours-retry-Retry")
        .build())
    .subscriptionInitialPosition(SubscriptionInitialPosition.Earliest)
    .subscribe();
```

## 总结

1. Pular将消费者和topic之间的交互配置抽象为订阅(subscription)，分为如下4种：
   1. 独家订阅：一对一关系；
   2. 共享订阅：一对多关系；
   3. Key_Shared：共享订阅的一种特殊情况；
   4. Failvoer订阅：类似消费者组。
2. 消息者接收到topic消息后给broker回复ACK，分为单个ACK和累计ACK两种；
3. 除了逐个消费外，Pulsar还有批处理和块处理两种模式；
4. 生产者可以设置消息延迟，只适用于共享订阅；
5. 已响应消息处理由保留策略决定，未响应消息处理由积压配额决定；
6. 消费者设置选择replay消息，当处理消息失败时设置dead letter topic保存失败消息。
