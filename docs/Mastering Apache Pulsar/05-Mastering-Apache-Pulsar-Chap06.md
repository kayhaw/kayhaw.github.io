---
layout: article
title: 生产者
slug: /Mastering-Apache-Pulsar/Chap06
tags:
  - Apache Pulsar
  - ReadingNotes
---

:::info
*Mastering Apache Pulsar* 第6章读书笔记
:::

## 同步生产者

同步生产者只有在上一条消息响应后才会发送下一条消息，如下图所示：

![Synchronous Producer](/img/doc/Master-Apache-Pulsar/chap06/synchronous-producer.png)

同步生产者适用事务系统，但是等待响应花费时间，并且broker没有及时响应会导致阻塞下游。

## 异步生产者

异步生产者通过后台任务将消息保存在阻塞队列中，消息发送不会被阻塞，如下图所示：

![Asynchronous Producer](/img/doc/Master-Apache-Pulsar/chap06/asynchronous-producer.png)

## 生产者路由

不同于Kafka每个topic都有分区，Pulsar topic默认没有分区。当开启分区后，Pulsar生产者需要将消息路由到正确的分区中。

### Round-Robin路由

Round-Robin路由按序轮流将消息发送到对应分区，如下图所示：

![Round-Robin Route](/img/doc/Master-Apache-Pulsar/chap06/round-robin-route.png)

**当指定key时，broker先哈希然后将消息路由到对应分区；当未指定key时，broker使用批处理设置决定分区：**

```java
String pulsarBrokerRootUrl = "pulsar://localhost:6650";
String topic = "persistent://my-tenant/my-namespace/ggc";

PulsarClient pulsarClient = PulsarClient.builder()
  .serviceUrl(pulsarBrokerRootUrl)
  .build();
Producer<byte[]> producer = pulsarClient.newProducer()
  .topic(topic)
  .messageRoutingMode(MessageRoutingMode.RoundRobin)
  .create();

producer.newMessage().key("my-key")
  .value("A letter to my unborn".getBytes())
  .send();
```

### 单分区路由

将所有消息路由到一个分区，如下图所示：

![Single Partition Route](/img/doc/Master-Apache-Pulsar/chap06/single-partitioned-route.png)

**当指定key时，broker先哈希然后将消息路由到对应分区；当未指定key时，消息被发送到同一个分区：**

```java
String pulsarBrokerRootUrl = "pulsar://localhost:6650";
String topic = "persistent://my-tenant/my-namespace/ggc";

PulsarClient pulsarClient = PulsarClient.builder()
  .serviceUrl(pulsarBrokerRootUrl)
  .build();
Producer<byte[]> producer = pulsarClient.newProducer()
  .topic(topic)
  .messageRoutingMode(MessageRoutingMode.SinglePartition)
  .create();

producer.newMessage().key("my-key")
  .value("A letter to my unborn"
  .getBytes()).send();
```

### 自定义分区路由

对于Java客户端，自定义分区路由只需要实现MessageRouter接口：

```java
public interface MessageRouter extends Serializable {
  int choosePartition(Message msg);
}


public class RandomRouter implements MessageRouter {
  public int choosePartition(Message msg) {
    Random ran = new Random(); 
    int x = ran.nextInt(6) + 5;
    return x;
  }
}

String pulsarBrokerRootUrl = "pulsar://localhost:6650";
String topic = "persistent://my-tenant/my-cluster-my-namespace/ggc";

PulsarClient pulsarClient = PulsarClient.builder()
  .serviceUrl(pulsarBrokerRootUrl)
  .build();
Producer<byte[]> producer = pulsarClient.newProducer()
  .topic(topic)
  .messageRouter(new RandomRouter())
  .create();
producer.send("Hello, Moto".getBytes());
```

## 生产者配置

- topicName：不能包含`/`，默认为null即不会发送到任何消费者，一般使用连字符连接，比如`my-topic`；
- producerName：必须在Pulsar集群内唯一，一般使用`<team>.<application>`格式，没有其他要求；
- sendTimeoutMs：发送者等待ACK的超时时间(毫秒)，默认30000；
- blockQueueFull：用于异步生产者场景，设置为true时，消息队列已满则阻塞，设置为false时(默认)，消息队列已满则抛出异常由生产者处理；
- maxPendingMessages：用于异步生产者场景，消息队列的最大容量，默认1000；
- maxPendingMessagesAcrossPartitions：跨分区排队消息的最大数量，默认5000；
- messageRoutingMode：分区topic的路由模式(见[生产者路由](#生产者路由))；
- hashingScheme：计算消息的哈希算法，默认`JavaStringHash`，可选`Murmur3_32Hash`或`BoostHash`；
- cryptoFailureAction：生产者加密消息失败后的行为(Pulsar默认加密每条消息)，默认不发送消息，可选发送未加密消息；
- batchingMaxPublishDelayMicros：生产者批处理发送给broker的最大等待时间(毫秒)，默认100；
- batchingMaxMessages：批处理的最大消息数量，达到该值后发送消息；
- batchingEnabled：是否开启批处理，默认开启并设置最大批处理量1000条/等待时间1ms；
- compressionType：Pulsar默认不开启消息压缩，支持的压缩算法：LZ4、ZLIB、ZSTD和Snappy。

## 写时模式(Schema on Write)

写时模式值在保存写消息前创建模式，防止消息格式错误但不灵活：修改模式意味着消费者和生产者使用新模式。

### Schema注册

Pulsar默认使用BookKeeper保存schema(内置注册)，也支持三方注册，本节只涉及内置注册。Schema包含3要素：name、payload(schema的二进制表示)和type。其中类型支持基本类型、键值对和复杂结构：

```java
Schema<KeyValue<Integer, String>> kvSchema 
  = Schema.KeyValue(Schema.INT32,Schema.STRING,KeyValueEncodingType.SEPARATED);

Producer<KeyValue<Integer, String>> producer = 
  client.newProducer(kvSchema).topic(TOPIC).create();

// 支持Avro和Protobuf生成
Producer<User> producer = client
  .newProducer(Schema.AVRO(User.class))
  .create();
```

还可以通过Pulsar Admin CLI或者API设置schema：

```bash
pulsar-admin schemas upload --filename <schema-definition-file> <topic-name>

POST /admin/v2/schemas/:tenant/:namespace/:topic/schema
Body {
   "type": "<schema-type>",
   "schema": "<an-utf8-encoded-string-of-schema-definition-data>",
   "properties": {} // the properties associated with the schema
}
```

## 非持久化topic

到目前为止讨论的都是持久化topic，Pulsar也支持非持久化topic。它适用于高吞吐、实时场景，如下图所示，只有在消费者主动获取消息时，生产者才会发送消息，**不支持replay**。

![Nonpersistent Topic](/img/doc/Master-Apache-Pulsar/chap06/nonpersistent-topic.png)

```bash
pulsar-admin topics create non-persistent://public/default/example-np-topic

bin/pulsar-client produce non-persistent://public/default/example-np-topic \
  --num-produce 1 \
  --messages "Surprise!"

bin/pulsar-client consume non-persistent://public/default/example-np-topic \
  --num-messages 0 \
  --subscription-name my-ole-sub \
  --subscription-type exclusive
```

## 事务

Pulsar 2.7.0起引入事务：消息要么被消费并响应，要么回滚，当提交超时或者主动抛弃时事务进行回滚。

```java
Transaction txn = pulsarClient
  .newTransaction()
  .withTransactionTimeout(1, TimeUnit.MINUTES)
  .build()
  .get();

producer.newMessage(txn).value("Surprise".getBytes()).send();
// 事务提交
Message<byte[]> message = consumer.receive();
consumer.acknowledge(message.getMessageId(), txn);
txn.commit().get();
// 事务回滚
Message<byte[]> message = consumer.receive();
consumer.acknowledge(message.getMessageId(), txn);
txn.abort();
```

## 总结

1. 生产者工作模式有同步、异步两种方式；
2. 生产者消息路由有轮询、单个(未指定key时才发送到相同分区)、自定义三种；
3. 生产者端定义schema并将schema随着消息发送到broker；
4. 非持久化topic只有在消费者主动拉取时生产者才发送消息，没有保存消息因此不支持replay。