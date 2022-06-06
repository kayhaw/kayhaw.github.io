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

同步生产者适用事务系统，但是等待响应花费时间，并且broker没有及时响应会导致下游问题。

## 异步生产者

异步生产者通过后台任务将消息保存在阻塞队列中，不会被阻塞，如下图所示：

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
