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

## 初尝Akka

这本书很早以前就出版，作者使用Typesafe Activator作为开发脚手架，但是给的下载链接早已失效(Typesafe公司改名Lightend，Activator套件也没找到下载包)，这里选择Idea创建Java Maven工程akkademy-db。

### 引入依赖

创建空Maven项目后，需要导入相关依赖，内容如下所示：
```xml
<dependencies>
    <dependency>
        <groupId>com.typesafe.akka</groupId>
        <artifactId>akka-actor_2.11</artifactId>
        <version>2.3.6</version>
    </dependency>
    <dependency>
        <groupId>com.typesafe.akka</groupId>
        <artifactId>akka-testkit_2.11</artifactId>
        <version>2.3.6</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.novocode</groupId>
        <artifactId>junit-interface</artifactId>
        <version>0.10</version>
    </dependency>
</dependencies>
```

:::caution 注意
原书出版很早，依赖包版本都很旧，一开始尝试用新版本Akka但是原书代码会有些API对不上，为了减少学习成本，还是和原书保持一致。
:::
原书使用SBT管理套件，依赖对应的build.sbt内容如下：

```sbt {3}
libraryDependencies ++= Seq(
  "com.typesafe.akka" % "akka-actor_2.11" % "2.3.6",
  "com.typesafe.akka" %% "akka-testkit" % "2.3.6" % "test",
  "junit"             % "junit"           % "4.11"  % "test",
  "com.novocode"      % "junit-interface" % "0.10"  % "test")
```

本质上依赖都是来自Maven仓库的jar包，所以2种依赖文件内容只是在格式上稍有变化。sbt文件用`%`隔开groupId、artifactId、version和scope。

:::info '%%'与'%'区别
由于Scala在不同主版本之间不提供二进制兼容，有些依赖库可能是用不同版本Scala构建并发布。为了解决这个问题，在groupId和artifactId之间用两个'%'让SBT选择正确Scala版本，而不是在artifactId名字上加上Scala版本号。举个例子，在Scala 2.11项目中以下两种写法等价：
``` sbt
"com.typesafe.akka" % "akka-actor_2.11" % "2.3.3"
"com.typesafe.akka" %% "akka-actor" % "2.3.3"
```
:::

### 定义消息类

定义消息类时注意它应该是不可变的(immutable)，这里使用final修饰字段

```java {2-3}
public class SetRequest {
    private final String key;
    private final Object value;

    public SetRequest(String key, Object value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public Object getValue() {
        return value;
    }
}
```

### 定义Actor类

处理消息的Actor类主要做两件事：打印日志和保存消息中的键值对。代码如下所示：

```java
public class AkkademyDb extends AbstractActor {
    protected final LoggingAdapter log = Logging.getLogger(context().system(), this);
    protected final Map<String, Object> map = new HashMap<>();

    private AkkademyDb() {
        receive(ReceiveBuilder.match(SetRequest.class, message -> {
            log.info("Received set request – key: {} value: {}", message.getKey(), message.getValue());
            map.put(message.getKey(), message.
                    getValue());
        }).matchAny(o -> log.info("received unknown message {}", o)).build());
    }
}
```

### 测试运行

代码如下：

```java
public class AkkademyDbTest {
    // 首先需要创建Actor System
    ActorSystem system = ActorSystem.create();

    @Test
    public void itShouldPlaceKeyValueFromSetMessageIntoMap() {
        TestActorRef<AkkademyDb> actorRef = TestActorRef.create(system, Props.create(AkkademyDb.class));
        actorRef.tell(new SetRequest("key", "value"), ActorRef.noSender());
        AkkademyDb akkademyDb = actorRef.underlyingActor();
        assertEquals(akkademyDb.map.get("key"), "value");
    }
}
```
