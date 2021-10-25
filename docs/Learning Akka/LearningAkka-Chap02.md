---
layout: article
title: Actors and Concurrency
permalink: /learning-akka/chap02
tags:
  - Akka
  - ReadingNotes
---

:::info
《Learning Akka》第二章读书笔记
:::

## Reactive系统设计

关于Akka的书籍一定会提到术语**Reactive(响应式)**，这个词因为[Reactive Manifesto(响应式宣言)](https://www.reactivemanifesto.org/)而变得越来越流行。响应式宣言是一份试图提炼出web应用程序在满足用户需求的同时成功发展所需要的品质的文档，它为响应式系统定义了4点原则：

1. Responsive(敏捷的)：应用需要对请求做出快速反应
2. Elastic(灵活的)：应用能够在不同负载下扩展
3. Resilient(有韧性的)：应用在遇到错误时能够优雅地处理
4. Message Driven(消息驱动)：通过异同的消息驱动系统利用资源，满足前3点

## Actor剖析

以一个Javas实现的Actor为例，它接收"Ping"字符串后返回"Pong"：

```java
public class PongActor extends AbstractActor {
    public PartialFunction receive() {
        return ReceiveBuilder.matchEquals("Ping", s->{
            sender().tell("Pong", ActorRef.noSender());
        }).matchAny(x -> {
            sender().tell(new Status.Failure(new Exception("unknown message")), self());
        }).build();
    }
}
```

1. PongActor继承自AbstractActor，表示它是一种Actor
2. AbstractActor的receive方法必须被重写或者在构造器中调用，返回一个PartialFunction对象
3. 由于PartialFunction使用Scala编写定义，Akka使用Builder设计模式通过ReceiverBuilder类来创建PartialFunction对象
4. 通过ReceiverBuilder类提供各种match方法对消息进行匹配处理，最后调用build方法生成PartialFunction对象
5. 通过调用sender()方法得到ActorRef对象，它可能是发送消息的另一个Actor或者Actor System
6. 通过ActorRef的tell()方法回复消息，第一个参数是消息，第二个参数是回复消息的Actor，通过`ActorRef.noSender()`告诉对方不需要回消息
7. 当处理异常时，返回一个Status.Failure消息，此时会触发supervisor机制

## 创建Actor

和普通对象不同，你永远不能得到actor实例对象，也不能通过对象方法直接或者间接地改变状态，它只能通过消息驱动。如果只通过消息通信，没有必要获取actor实例，只需要一套发送消息和获取消息的机制，在Akka中，通过对actor的引用类ActorRef实现。以下代码创建一个actor对象并返回其引用：

```java
ActorRef actor = actorSystem.actorOf(Props.create(PongActor.class));
```

使用Props.create(Class class, arg1, arg2)生成Props实例，确保PongActor对象被封装不可访问。如果需要构造参数，推荐使用工厂方法生成Props实例。

```java
public static Props props(String response) {
  return Props.create(this.class, response);
}
ActorRef actor = actorSystem.actorOf(PongActor.props("PongFoo"));
```

另一种获取actor引用的方法时actorSelection，通过url获取本地或者远程actor：

```java
ActorSelection selection = system.actorSelection("akka.tcp://actorSystem@kayhaw.github.io:5678/user/kayhaw");
```

:::tip 总结

1. 通过system.actorOf(Props.create(...))创建actor实例并获取包装引用
2. 通过system.actorSelection(String url)获取系统中已有的actor实例包装引用
:::

## Promises, Futures和事件驱动编程模型

在Chap 1中的actor接收消息并保存键值对，那如果要从接收actor获取一些返回值呢？比如说从AkkademyDb Actor中获取一个键值对。

### 阻塞vs事件驱动

以下面一段jdbc代码为例，执行executeQuery方法是阻塞式的，必须等到数据库响应结果(**延迟**)，代码才能继续往下执行，这还没考虑因为网络异常等导致执行失败的情况(**容错**)。对于一个web应用，可能出现线程池被消费大量线程但是都在阻塞状态。

```java
stmt = conn.createStatement();
String sql = "select name from users where id='123'";
ResultSet rs = stmt.executeQuery(sql);
rs.next();
String name  = rs.getString("name");
```

总结起来阻塞式IO的缺点：

1. 代码没有在返回类型中明显表达错误
2. 代码没有在返回类型中明显表达延迟
3. 由于线程池大小限制了吞吐量
4. 过多使用线程会由于上下文切换来带负载

非阻塞式IO流程如下所示，方法调用返回Future对象，里面没有返回值，而是注册一个回调方法，当方法调用完成后激活调用该回调方法。

非阻塞式IO缺点：不能获得详细的堆栈打印信息

### 使用Future获取Actor Response

这里使用Java8 API提供的Future接收Actor响应，但Akka返回Scala定义的Future接口，为此需要添加如下依赖进行转换：

```xml
<dependency>
    <groupId>org.scala-lang.modules</groupId>
    <artifactId>scala-java8-compat_2.11</artifactId>
    <version>0.6.0</version>
</dependency>
```

实现代码如下所示，分别测试返回成功和失败的情况。使用`Patterns.ask()`方法发送消息并设置响应超时时间为1000ms，该方法返回Future对象，使用toJava方法将其转为Java API方法，然后调用get方法获取结果。

```java
public class PongActorTest {
    ActorSystem system = ActorSystem.create();
    ActorRef actorRef = system.actorOf(Props.create(PongActor.class));

    @Test
    public void shouldReplyToPingWithPong() throws Exception {
        Future sFuture = Patterns.ask(actorRef, "Ping", 1000);
        // 把Scala版Future转为Java版的
        final CompletionStage<String> cs = FutureConverters.toJava(sFuture);
        final CompletableFuture<String> jFuture = (CompletableFuture<String>) cs;
        // get方法的超时时间好像多余了？
        assert(jFuture.get(1000, TimeUnit.MILLISECONDS).equals("Pong"));
    }

    @Test
    public void shouldReplyToUnknownMsgWithFailure() throws Exception {
        Future sFuture = Patterns.ask(actorRef, "KayHaw", 1000);
        final CompletionStage<String> cs = FutureConverters.toJava(sFuture);
        final CompletableFuture<String> jFuture = (CompletableFuture<String>) cs;
        jFuture.get(1000, TimeUnit.MILLISECONDS);
    }
}
```


:::info tell和ask区别

- ask：异步api，返回一个消息
- tell：不返回消息
:::

### 理解Futures和Promises

异步调用ask以Future类形式返回作为结果占位符，如下所示代码。askPong方法返回一个`Future<T>`，它要么包含类型为T的的结果或者类型为Throwable的错误。使用thenAccept方法执行一个Consumer回调，表示对返回消息进行消费处理(打印)，若要产生转换消息生成新消息使用thenApply方法。

```java
public CompletionStage<String> askPong(String message) {
    Future sFuture = Patterns.ask(actorRef, "Ping", 1000);
    return FutureConverters.toJava(sFuture);
}

@Test
public void printToConsole() throws Exception {
    // thenAccept接收Consumer接口，消费消息但是没有返回值
    askPong("Ping").thenAccept(x -> System.out.println("Replied with" + x));
    // thenApply接收Function接口，消费消息并且产生新消息
    askPong("Ping").thenApply(x -> x.charAt(0));
    // 嵌套异步回调
    CompletionStage<CompletionStage<String>> futureFuture = askPong("Ping").thenApply(x -> askPong(x));
    // 嵌套异步回调简化写法
    CompletionStage<String> cs = askPong("Ping").thenCompose(x -> askPong(x));
    Thread.sleep(1000);
}
```

可以看到异步调用中还可以嵌套执行另一个异步回调，并且可以使用thenCompose方法简化写法，形成调用链。如果不幸的话，调用链其中一个askPong方法返回异常呢？使用handle方法来处理正确或异常两情况，使用exceptionally方法单独处理异常。Future调用链可以将异常处理放在末尾处理，代码如下所示：

```java
@Test
public void handleException() {
    askPong("Error Msg").handle((x, t) -> {
        if(t != null) {
            log.error("Error: {}", t);
        }
        return null;
    });

    // 同步处理异常
    CompletionStage<String> cs = askPong("Error Msg").exceptionally(t -> "default");
    // 异步处理异常
    askPong("Error Msg").handle((x, t) -> t == null ? CompletableFuture.completedFuture(x) : askPong("Ping")).thenCompose(x -> x);
    // 调用链
    askPong("Ping").thenCompose(x -> askPong("Ping"+x)).handle(
        (x, t) -> t != null ? "default" : x
    );
}
```

此外你还可以使用thenCombine方法获取两个Future的结果，Scala还提供了sequence方法用于将`Future`列表结果转为单个的`Future<List<T>>`，但Java未直接提供等效API：

```java
askPong("Ping").thenCombine(askPong("Ping"), (a, b) -> a+b);
```

:::info Future API对照表
|操作|Scala Future API|Java Scala API|
|----|----|----|
|转化结果|`.map(x=>y)`|`.thenApply(x->y)`|
|异步处理结果|`.flatMap(x=>futureOfY)`|`.thenApply(x->futureOfY)`|
|处理异常|`.recover(t=>y)`|`.exceptionally(t->y)`|
|异步处理异常|`.recoverWith(t=>futureOfY)`|`.handle(t,x->futureOfY).thenCompose(x->x)`|
:::

### 分解分布式系统

从Future API知识中回来，前文提到要构建一个分布式数据库系统，为此分别要创建一个客户端工程和服务端工程。为了让客户端和服务端之间使用message通信，需要在两个工程之间共享message类，为了让工程代码更小，这里将message类放在服务端工程中并将其导入到客户端工程中。

## 准备DB和Message类

首先对应分布式DB，定义如下消息：

- 获取消息：当key存在时返回值
- key不存在异常：当key不存在时返回该消息
- 设置消息：将key设置为指定值并返回响应状态

代码如下：
```java
public class GetRequest implements Serializable {
    public final String key;
    public GetRequest(String key) {
        this.key = key;
    }
}

public class KeyNotFoundException extends Exception implements Serializable {
    public final String key;
    public KeyNotFoundException(String key) {
        this.key = key;
    }
}
```

新的receive方法和入口方法：

```java title=AkkademyDb.java
private AkkademyDb() {
    receive(
        // 匹配Set消息
        ReceiveBuilder.match(SetRequest.class, msg -> {
            log.info("Received Set request: {}", msg);
            map.put(msg.key, msg.value);
            sender().tell(new Status.Success(msg.key), self());
        })
        // 匹配Get消息
        .match(GetRequest.class, msg -> {
            log.info("Received Get request: {}", msg);
            Object value = map.get(msg.key);
            Object response = (value != null) ? value : new Status.Failure(new KeyNotFoundException(msg.key));
            sender().tell(response, self());
            sender().tell(new Status.Success(msg.key), self());
        })
        // 消息不匹配
        .matchAny(o -> {
            sender().tell(new Status.Failure(new ClassNotFoundException()), self());
        })
        .build());
}
```

```java title=Main.java
public class Main {
    public static void main(String[] args) {
        // akkademy是当前服务端Actor System名称，client连接时需要用到
        ActorSystem system = ActorSystem.create("akkademy");
        // akkademy-db是当前服务端Actor名称
        system.actorOf(Props.create(AkkademyDb.class), "akkademy-db");
    }
}
```

## 启动远程功能

为了使远程节点间交换消息，引入如下依赖：

```xml
<dependency>
    <groupId>com.typesafe.akka</groupId>
    <artifactId>akka-remote_2.11</artifactId>
    <version>2.3.6</version>
</dependency>
```

在resource文件夹下添加配置文件application.conf：

```hocon
akka {
  actor {
    provider = "akka.remote.RemoteActorRefProvider"
  }
  remote {
    enabled-transports = ["akka.remote.netty.tcp"]
    netty.tcp {
      hostname = "127.0.0.1"
      port = 2552
    }
  }
}
```

## 创建客户端

工程新建模块akkademy-db-client，添加依赖：

```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>akkademy-db</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>org.scala-lang.modules</groupId>
    <artifactId>scala-java8-compat_2.11</artifactId>
    <version>0.6.0</version>
</dependency>
```

另外需要配置应用文件：

```
akka {
  actor {
    provider = "akka.remote.RemoteActorRefProvider"
  }
  remote.netty.tcp.port = 0
}
```

### client代码

client代码逻辑很简单，通过actorSelection方法获取服务端actor的引用，然后对其方法进行封装以提供数据访问。注意actorSelection第一个地址参数中`akkademy`对应服务端代码创建Actor System时设置的名称，`akkademy-db`对应创建的服务端Actor名称。

```java {6}
public class JClient {
    private final ActorSystem system = ActorSystem.create("LocalSystem");
    private final ActorSelection remoteDb;

    public JClient(String remoteAddress) {
        remoteDb = system.actorSelection("akka.tcp://akkademy@" + remoteAddress + "/user/akkademy-db");
    }

    public CompletionStage set(String key, Object value) {
        return FutureConverters.toJava(Patterns.ask(remoteDb, new SetRequest(key, value), 2000));
    }

    public CompletionStage get(String key) {
        return FutureConverters.toJava(Patterns.ask(remoteDb, new GetRequest(key), 2000));
    }
}
```

### 测试代码

```java
public class JClientIntegrationTest {
    JClient client = new JClient("127.0.0.1:2552");
    @Test
    public void itShouldSetRecord() throws Exception {
        client.set("123", 123);
        Integer result = (Integer)((CompletableFuture) client.get("123")).get();
        System.out.println(result);
        assert (result == 123);
    }
}
```

首先运行服务端Main方法，然后点击运行测试代码JClientIntegrationTest。

:::info 代码地址
<https://github.com/kayhaw/akkademy-db>
:::

## 总结要点

1. 获取Actor对象引用的两种方式：actorOf和actorSelection
2. Future编程常用API
3. 获取并使用远程Actor对象引用
