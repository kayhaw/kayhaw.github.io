---
layout: article
title: Starting Life as an Actor
permalink: /learning-akka/chap01
tags:
  - Akka
  - ReadingNotes
---

:::info
《Learning Akka》第一章读书笔记
:::

## Akka简介

以瑞典的一座山命名，通常指一组分布式套件，也是**Actor并发模型**的现代实现。
:::info Actor模型起源
在1973年的论文*A Universal Modular Actor Formalism for 
Artificial Intelligence* 中提出并发理论模型Actor
:::

Actor模型到底是什么？顾名思义，一个进程或线程被看成在某个组织中扮演特定*角色(actor)*（做特定工作）的worker。

面向对象编程模型(OOP)通过调用对象方法或者修改对象属进行工作，但是在多线程环境下需要同步和锁机制来保证线程安全。和OOP模型不同，Actor模型中的对象不能**直接**读取、修改属性或者调用方法，只能通过消息与外界沟通。这意味着actor只能发送、接收和回应消息，这和方法接收参数返回结果本质上是不同，因为这个过程是**异步**的。

![JMM.svg](/img/doc/LearningAkka/Actor_model.svg)

如上图所示是Actor处理消息模型。Actor每次从邮箱中取出一条消息处理，处理结果可能是其内部状态改变、创建更多Actor或者将更多消息发送个其他Actor。谨记如下术语：

- Actor：worker并发原语
- Message：用于进程间通信的一片数据
- Message-passing：一种软件开发范式，其中消息被传递用于调用行为，而不是直接调用行为
- Mailing address：消息发送地址
- Mailbox：消息队列，未被actor处理的消息存放于此
- Actor system：actor、mailbox等加上配置形成的组合

相比于OOP模型，actor更加容易理解（原书举例了一个寿司店中顾客、服务员、厨师同时工作的场景），除此之外，另一个好处是actor每次只处理一条消息，保证了线程安全性。
:::info Actor Evolution
Actor模型对Erlang编程语言有着显著影响。通过Supervision机制，Erlang在actor模型中实现容错性。通过Akka IO和Akka HTTP，Akka实现了分布式，并且添加位置透明(Location Transparency)机制。
:::

## 实战前言

全书围绕两个项目案例展开Akka实战，案例1是开发一个类似Redis的高可用KV数据库(处理分布式状态)，案例2是开发一个读取RSS文章提取其正文的功能(完成分布式任务)。
