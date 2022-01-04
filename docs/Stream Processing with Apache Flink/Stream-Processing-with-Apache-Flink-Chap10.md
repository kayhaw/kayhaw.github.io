---
layout: article
title: 运维Flink和流应用
slug: /Stream-Processing-with-Apache-Flink/Chap10
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

本章介绍如何使用Flink提供的工具运维长期运行的流引用，包括如何收集运行指标、监控应用、更新应用等。

## 流应用的运行和管理

流处理应用的维护比批处理应用更加复杂。由于周期性运行，批处理只要在运行间隔内进行应用的重配置、缩放和更新。而流处理持续运行，这些操作更加具有挑战性，但Flink提供了如下接口来简化流处理的运行和管理：

1. 一个命令行客户端工具，用于提交和控制应用；
2. Web UI，提供Flink集群和运行应用的信息，也能用于提交和管理应用；
3. REST API，客户端和Web UI所使用的底层接口，提供所有指标信息和应用提交、管理的端点。

本节介绍保存点的使用方面，以及如何通过以上接口来启动、终止、暂停/恢复、缩放和升级流应用。

### 保存点

保存点基本等同于检查点，只是两者生命周期不同。检查点由Flink自动生成、故障时加载和删除，而保存点必须由用户手动或者外部服务触发，并且用于不会被Flink自动删除。

从文件系统上看，保存点就是一个目录，它的子目录包含所有任务的状态和一个包含所有数据文件绝对路径的二进制元数据文件。由于元数据保存的是绝对路径，因此挪动保存点目录就会导致其失效。保存点的路径格式和含义如下表所示：

| 路径                                                       | 含义                 |
| ---------------------------------------------------------- | ---------------------- |
| `/savepoints/`                                             | 检查点根路径     |
| `/savepoints/savepoint-:shortjobid-:savepointid/`          | 某个检查点路径  |
| `/savepoints/savepoint-:shortjobid-:savepointid/_metadata` | 某个检查点的元数据文件 |
| `/savepoints/savepoint-:shortjobid-:savepointid/:xxx`      | 算子状态检查点路径 |

### 使用命令行管理应用

Flink的命令行客户端`${FLINK_HOME}/bin/flink`从`${FLINK_HOME}/conf/flink-conf.yaml`文件读取集群配置，并提供启动、终止和管理应用的功能。以下命令均默认当前工作目录为Flink根目录。

#### 启动应用

启动应用所使用的命令参数及其含义如下表所示：

| 命令示例                                               | 含义                                                                                 |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `./bin/flink run ~/myApp.jar`                         | 以jar包中META-INF/MANIFEST.MF文件中的program-class属性指定类名的main方法为入口运行应用 |
| `./bin/flink run ~/myApp.jar my-arg1 my-arg2 my-arg3` | 追加应用运行参数                                                               |
| `./bin/flink run -d ~/myApp.jar`                      | 选项`-d`表示detached模式运行，此时不会等待应用结束而是返回JobID |
| `./bin/flink run -p 16 ~/myApp.jar`                   | 选项`-p`指定默认并行度为16                                                   |
| `./bin/flink run -c my.app.MainClass ~/myApp.jar`     | 选项`-c`指定入口类                                                              |
| `./bin/flink run -m myMasterHost:9876 ~/myApp.jar`    | 选项`-m`指定Flink master进程，默认使用`conf/flink-conf.yaml`指定值       |

#### 列出运行应用

所有对于运行应用的操作都需要提供JobID，它可以从Web UI或者命令行获得，使用`./bin/flink list -r`列出所有运行应用。

#### 保存点操作

使用`./bin/flink savepoint <jobId> [savepointPath]`存储一个保存点。由于保存点会占用大量空间且不会被Flink自动删除，通过`./bin/flink savepoint -d <savepointPath>`删除保存点。

:::danger 小心
必须在另一个检查点或者保存点完成后才能删除保存点，否则故障恢复失败。
:::

#### 取消应用

取消应用可以选择是否进行一次保存点操作，命令如下所示。通过`-s`区分是否进行保存点操作，如果未指定保存点路径则使用flink-conf.yaml中的参数值。**如果保存点失败则应用继续进行，需要再次尝试取消应用。**

```bash
./bin/flink cancel <jobId>    # 不带保存点取消应用
./bin/flink cancel -s [savepointPath] <jobId>   # 带保存点取消应用
```

#### 从保存点中启动应用

命令格式为`./bin/flink run -s <savepointPath> [options] <jobJar> [arguments]`。应该确保应用的每个算子使用`uid()`设置了唯一id，当应用修改后存在如下3中兼容型情况：

1. 添加状态，该状态初始化为空；
2. 删除状态，Flink为了安全不会启动应用，通过`-n`选项强制启动；
3. 改变状态原语或者状态数据类型，应用启动失败。

#### 缩放应用

如果应用算子的并行度是硬编码在应用中与默认并行度无关，缩放应用分为保存点、取消应用、以新并行度重启3个步骤。如果应用算子的并行度依赖于默认并行度，缩放应用可以简单地通过`./bin/flink modify <jobId> -p <newParallelism>`命令实现。具体细节见[缩放状态算子](Chap03/#缩放状态算子)。

### 通过REST API管理应用

Dispatcher进程中运行的web服务器同时提供REST API和Web UI服务，默认端口为8081，在flink-conf.yaml文件中通过`rest.port`参数修改，指定值-1将会禁用REST API和Web UI。通常使用curl工具与REST API交互，使用格式如下：

```bash
curl -X <HTTP-Method> [-d <parameters>] http://hostname:port/v1/<REST-point>
```

接下来介绍Flink提供的一些重要REST接口，完整列表见[REST API](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/ops/rest_api/)

#### 管理和监控Flink集群

| 请求方式   | 请求路径 | 功能 |
| --------- | -------- | --- |
| GET       | /overview | Flink集群概览 |
| GET       | /jobmanager/config | 返回集群配置 |
| GET       | /taskmanagers | 返回所有taskmanager概览 |
| GET       | /jobmanager/metrics | 返回jobmanager上的统计指标，通过`get`参数指定具体指标 |
| GET       | /taskmanagers/<tmId\>/metrics | 返回某个TaskManager上的统计指标，通过`get`参数指定具体指标 |
| DELETE    | /cluster | 关闭集群，**在standalone模式下master终止但是worker进程继续运行** |

#### 管理和监控Flink应用

| 请求方式 | 请求路径                    | 功能 |
| -------- | -------------------------- | -------------------------------------- |
| POST     | /jars/upload               | 上传应用jar包，成功则返回存储路径 |
| GET      | /jars                      | 查看所有jar包信息，包含id、上传时文件名、上传时间等 |
| DELETE   | /jars/<jarId\>            | 删除指定id jar包 |
| POST     | /jars/<jarId\>/run        | 指定jar包运行，返回job id |
| GET      | /jobs                      | 获取所有job id |
| GET      | /jobs/<jobId\>            | 获取指定id的作业运行信息 |
| PATCH    | /jobs/<jobId\>            | 取消应用 |
| POST     | /jobs/<jobId\>/savepoints | 对指定应用进行保存点操作，需要传入json描述保存点位置和是否取消任务。返回一个请求id，用于检查保存是否成功 |
| POST     | /savepoint-disposal        | 查看检查点处理情况，请求体包含request-id |
| PATCH    | /jobs/<jobId\>/rescaling  | 修改应用并行度，会进行保存点、取消然后重启应用，请求参数parallelism设置新的并行度 |

### 以容器形式绑定和部署应用

Flink的[应用部署](Chap03/#应用部署)有2种方式：提交给集群的framework模式和应用与容器绑定的library模式。目前为止启动应用的方式都是framework模式。

Library模式下应用与Flink Docker镜像绑定，然后以JobManager或者TaskManager形式启动。当镜像作为JobManager启动，容器会启动Flink master进程然后立即执行绑定的应用；当镜像作为TaskManager启动，它会将其登记到JobManager下，等slot充足后JobManager执行绑定应用。本节介绍如何构建应用绑定的Docker镜像并将其部署在K8S上。

#### 构建应用特定的Flink Docker镜像

Flink提供了一个构建特定应用的Docker镜像脚本，它位于源码仓库(`${repository_dir}/flink-container/docker/build.sh`)而不包含在二进制发行版本中。脚本使用示例如下：

```bash
cd ./flink-container/docker
./build.sh \
    --from-archive <path-to-Flink-1.14.0-archive> \
    --job-jar <path-to-example-apps-JAR-file> \
    --image-name kayhaw
```

该脚本所需3个参数依次为Flink二进制包、应用jar包和打包镜像名，构建成功后运行`docker images`命令可以看到名为`kayhaw`的镜像。除了build.sh外该目录也包含了`docker-compose.yml`文件，结合`docker-compose`用于部署Flink应用，使用示例如下：

```bash
FLINK_DOCKER_IMAGE_NAME=flink-book-jobs \
  FLINK_JOB=io.github.streamingwithflink.chapter1.AverageSensorReadings \
  DEFAULT_PARALLELISM=3 \
  docker-compose up -d
```

#### 在K8S上运行应用特定的Docker镜像

在K8S上运行应用特定的Flink Docker镜像和在[K8S](Chap09/#Kubernetes)启动集群的操作类似，只需要修改下yaml文件即可。Flink源码也提供了yaml文件模板(`${repository_dir}flink-container/kubernetes`目录下)，分别是配置master容器的*job-cluster-job.yaml.template*文件和配置worker容器的*task-manager-deployment.yaml.template*文件。

使用该模板文件时需要为3个参数设置值，分别是`${FLINK_IMAGE_NAME}`(镜像名称，比如上一小节生成的`kayhaw`)、`${FLINK_JOB}`(入口类名)和`${FLINK_JOB_PARALLELISM}`(任务并发度，也是worker容器数量)。可以看到这3个参数和上一小节使用docker-compose命令时一样，另外在kubernetes目录下也提供了定义K8S service的*job-cluster-service.yaml*文件。当所有模板文件都配置好后，使用`kubectl`命令启动服务：

```bash
kubectl create -f job-cluster-service.yaml
kubectl create -f job-cluster-job.yaml
kubectl create -f task-manager-deployment.yaml
```

## 控制任务调度

Flink应用的性能依赖于任务调度：task分配给哪个worker进程、task之间配合关系、task实例数等都影响着应用性能。

在[任务执行](Chap03/#任务执行)中介绍Flink如何给task分配slot以及利用task chaining减少数据交换开销。本节介绍如何调整默认行为以及控制task chaining、任务分配来改善应用性能。

### 控制Task Chaining

Flink默认开启task chaining机制，它将多个算子的并行任务融合为单个任务并以线程运行。融合任务之间通过方法调用实现数据交换，因此免去了通信开销。

但是task chaining并不是对所有应用都有好处，比如运行开销高的函数就应该在不同slot上进行。此时可以通过如下代码禁用应用的task chaining：

```java
StreamExecutionEnvironment.disableOperatorChaining()
```

如果需要更细粒度的控制task chaining，可以在特定算子上调用`disableChaining()`方法，此时该算子不会和其前置、后继节点融合为chain。

```java
DataStream<Y> result = input
  .filter(new Filter1())
  .map(new Map1())
  // disable chaining for Map2
  .map(new Map2()).disableChaining()
  .filter(new Filter2())
```

通过`startNewChain()`方法开启新task chain，此时节点与其后继节点融合为一个新chain：

```java
DataStream<Y> result = input
  .filter(new Filter1())
  .map(new Map1())
  // start a new chain for Map2 and Filter2
  .map(new Map2()).startNewChain()
  .filter(new Filter2())
```

### 定义slot共享组

Flink默认的任务调度策略是将程序的一个slice分配给一个slot，每个slice包含程序算子最多一个示例任务。这种默认策略可能会使某个slot负荷过大，Flink提供slot共享组机制能让用户手动的控制任务分配。

Slot共享组与算子一一对应，同一共享组内的算子任务使用同一个slot。在Slot共享组内，每个slot只分配算子的一个task示例，因此**一个slot共享组所需的slot数量等于算子的最大并行度**。

每个算子默认分配到*default*共享组，算子可以通过`slotSharingGroup(String)`显式指定共享组，如下代码所示。一个算子从其前置算子继承相同的共享组，否则是*default*组。

```java
// a设置slot共享组green
DataStream<A> a = env.createInput(...)
  .slotSharingGroup("green")
  .setParallelism(4)
DataStream<B> b = a.map(...)
// b从a继承slot共享组green
  .setParallelism(4)

// c设置slot共享组yellow
val c: DataStream[C] = env.createInput(...)
  .slotSharingGroup("yellow")
  .setParallelism(2)

// d设置slot共享组blue
val d: DataStream[D] = b.connect(c.broadcast(...)).process(...)
  .slotSharingGroup("blue")
  .setParallelism(4)
val e = d.addSink()
// e从d继承共享组blue
  .setParallelism(2)
```

如上代码对应的物理流图如下所示，一共需要10个slot(4+4+2)。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap10/Controlling-Task-Scheduling-with-Slot-Sharing-Groups.png" title="Controlling Task Scheduling with Slot-sharing Groups" />

## 调整检查点和故障恢复

Flink通过周期性检查点确保容错性，但是检查点每次对状态进行快照的开销巨大。增加检查点间隔可以减少开销，但是也增加了程序恢复时处理的数据量。本节介绍如何通过Flink提供的参数调优检查点和状态后端性能。

### 配置检查点

首先在开启检查点的同时需要指定运行间隔，如下代码所示：

```java
StreamExecutionEnvironment env = ...
// 开启间隔为10s的检查点
env.enableCheckpointing(10000);
```

通过CheckpointConfig对象可以设置检查点的更多选项，它从StreamExecutionEnvironment中获取：

```java
CheckpointConfig cpConfig = env.getCheckpointConfig();
```

默认检查点提供精准一次性保证，也可以设置为至少一次，如下代码所示：

```java
// 设置检查点模式为至少一次
cpConfig.setCheckpointingMode(CheckpointingMode.AT_LEAST_ONCE);
```

检查点可能会花费几分钟时间完成，这往往大于设置的间隔时间。默认情况下，Flink只允许一个检查点在保存，因此只有当上一个检查点结束后下一个检查点才会开始。为了确保不会有大量进程在进行检查点操作而不是计算，可以指定两个检查点之前的最小间隔，代码如下所示：

```java
// 设置检查点的最小间隔时间30s
cpConfig.setMinPauseBetweenCheckpoints(30000);
```

有些情况下还是希望检查点按照指定间隔进行，即使它们花费时间大于间隔时间。比如外部数据流延迟高，导致检查点花费时间久但是消耗资源少。此时可以通过配置并发检查点的数量：

```java
// 允许最多3个检查点同时进行
cpConfig.setMaxConcurrentCheckpoints(3);
```

:::tip 保存点不受检查点影响
保存点和检查点同步进行，由于显式触发，保存点不会因为检查点而被延迟。
:::

为了避免检查点长时间运行，可以配置超时时间(默认10s)，如下所示：

```java
// 检查点必须在5分钟内完成，否则取消
cpConfig.setCheckpointTimeout(300000);
```

最后，可以设置检查点失败后是否抛出异常终止任务，默认为true。

```java
// 检查点失败后应用继续运行
cpConfig.setFailOnCheckpointingErrors(false);
```

#### 开启检查点压缩

Flink支持对检查点和保存点进行压缩，目前还只支持Snappy压缩算法，通过如下代码开启：

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
// 开启检查点压缩
env.getConfig.setUseSnapshotCompression(true)
```

:::caution 注意
压缩对增量式检查点没有作用，因为增量检查点使用RocksDB内部格式，使用现成的snappy压缩。
:::

#### 在应用停止后保存检查点

检查点用于应用故障时恢复，因此在应用失败或者取消时会清除检查点。此时可以通过**外部检查点(Externalized Checkpoints)**来继续保留检查点：

```java
// 开启检查点外部化
cpConfig.enableExternalizedCheckpoints(
  ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION)
```

检查点外部化有两种策略：

1. **RETAIN_ON_CANCELLATION**：在应用完全失败或者取消时保留检查点
2. **DELETE_ON_CANCELLATION**：只有在应用完全失败后才保留检查点，如果应用取消则删除检查点

:::tip 小贴士
外部化检查点并不是用来取代保存点，外部化检查点依赖状态后端并且不支持缩放。因此相比于保存点，外部化检查点恢复应用更加高效，但是没有那么灵活。
:::
