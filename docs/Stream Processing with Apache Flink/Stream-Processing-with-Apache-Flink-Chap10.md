---
layout: article
title: 运维Flink和流应用
slug: /Stream-Processing-with-Apache-Flink/Chap10
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第10章读书笔记
:::

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

### 配置状态后端

[状态后端](Chap07#选择状态后端)负责维护本地状态、执行检查点和保存点、应用恢复。Flink默认状态后端是MemoryStateBackend，它适用于本地部署Flink而不是生产环境。

[检查点和状态后端](Chap09/#检查点和状态后端)介绍如何在flink-conf.yaml中指定使用的状态后端，也可以通过代码为某个应用指定：

```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.ExecutionEnvironment();

StateBackend memBackend = new MemoryStateBackend();
StateBackend fsBackend = new FsStateBackend("file:///tmp/ckp", true);
StateBackend rocksBackend = new RocksDBStateBackend("file:///tmp/ckp", true);

env.setStateBackend(memBackend);
```

同样地，也可以在代码中状态后端的各种参数：

```java
// Flink内置的状态后端都是可配置的
ConfigurableStateBackend backend = ...;

val sbConfig = new Configuration()
sbConfig.setBoolean("state.backend.async", true)
sbConfig.setString("state.savepoints.dir", "file:///tmp/svp")

val configuredBackend = backend.configure(sbConfig)
```

### 应用恢复配置

当开启检查点的应用故障后，将会重启任务、恢复状态然后继续执行。由于故障期间源端数据累计，应用需要以更高速率处理数据流。因此，应用重启后需要更多资源来赶上速度，这也意味着应用平常处理时不能100%消耗资源。除了考虑资源使用外，接下来介绍应用恢复的另外两个重点：重启策略和本地恢复。

#### 重启策略

为了避免应用在恢复时循环重启，Flink提供如下3种重启策略：

- **Fixed-delay**：重启固定次数，等待设置间隔后再次尝试
- **Failure-rate**：不超过设置频率下重启
- **No-restart**：不重启，直接报错

设置重启策略代码如下所示，**默认重启策略为fixed-delay(尝试次数Integer.MAX_VALUE，间隔10s)。**

```java
val env = StreamExecutionEnvironment.getExecutionEnvironment

env.setRestartStrategy(
  RestartStrategies.fixedDelayRestart(
    5,                            // 重启尝试次数
    Time.of(30, TimeUnit.SECONDS) // 尝试间隔
))
```

#### 本地恢复

除了MemoryStateBackend，Flink的状态后端都将保存点放在远程文件系统，这样一是保存状态二是在工作节点失效时重新分配。但是远程恢复并不高效，*尤其是在同一个工作节点上恢复。*

当应用在同一个机器上重启时，Flink提供**本地恢复(Local Recovery)**机制来加速应用恢复。当开启本地恢复时，状态后端除了将状态数据保存到远程系统，也会在本地磁盘保存一份。当应用重启，Flink试着在原来节点上运行任务，如果成功则从本地磁盘加载检查点数据，否则从远程存储获取。本地恢复失败则从远程获取，也相当于加了一层保险。但是任务只会承认远程写完成才算检查点成功。

本地恢复可以在flink-conf.yaml中设置或者在应用代码中单独设置：

- **state.backend.local-recovery**：是否开启本地恢复，默认false
- **taskmanager.state.local.root-dirs**：状态在本地存放路径

:::caution 注意
本地恢复只对键控状态有效，算子状态不会被本地存储，同时也不支持MemoryStateBackend。
:::

## 监控Flink集群和应用

Flink在运行时提供一套预定义的指标，并且也提供框架让用户能够自定义指标。

### Flink Web UI

通过`http://<jobmanager-hostname>:8081`即可访问Flink Web UI。

### 指标系统

Flink收集统计了应用和系统的一些指标，比如集群等级指标包括运行作业数、可用资源，作业指标包括运行时、重试次数和检查点信息，IO指标包括交互记录数，水印信息，连接器特定指标等。

#### 注册并使用指标

要注册指标首先得获取一个MetricGroup，它通过RuntimeContext的getMetrics()方法获得，代码如下所示：

```java
public static class PositiveFilter extends RichFilterFunction<Integer> {
    private Counter counter;

    @Override
    public void open(Configuration parameters) throws Exception {
        counter = getRuntimeContext().getMetricGroup().counter("droppedElements");
    }

    @Override
    public boolean filter(Integer value) throws Exception {
        if (value > 0) {
            return true;
        } else {
            counter.inc();
            return false;
        }
    }
}
```

#### 指标组

Flink指标通过MetricGroup接口来登记和访问，指标组提供如下指标类型：

- **Counter**：统计数量指标，提供增加和减少的方法；
- **Gauge**：统计某个时间点的指标，指标可以是任意类型，示例代码如下所示：

```java
public class WatermarkGauge implements Gauge<Long> {
  private long currentWatermark = Long.MIN_VALUE;

  public void setCurrentWatermark(long watermark) {
    this.currentWatermark = watermark;
    }

  @Override
  public Long getValue() {
    return currentWatermark;
  }
}
```

:::danger 小心
指标值会以String类型对外暴露，因此确保指标类型实现toString()方法。
:::

- **Histogram**：统计数值指标分布的直方图，可以计算总数量、最大/最小值、方差、平均值等；此外还可以结合DropWizard使用，需要引入依赖。

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-metrics-dropwizard</artifactId>
  <version>${flink-version}</version>
</dependency>
```

```java
// create and register histogram
DropwizardHistogramWrapper histogramWrapper = 
  new DropwizardHistogramWrapper(
    new com.codahale.metrics.Histogram(new SlidingWindowReservoir(500)))
metricGroup.histogram("myHistogram", histogramWrapper)

// update histogram
histogramWrapper.update(value)
```

- **Meter**：统计事件发生频率，也可以和DropWizard结合使用。

#### 指标作用域和格式化

指标的作用域(scope)可以是系统级或者用户级，访问指标的标志符包含3部分：指标名、可选的用户作用域、系统作用域。例如指标名myCounter、用户作用域MyMetrics、系统作用域localhost.taskmanager.512组成最后的标识是`localhost.taskmanager.512.MyMetrics.myCounter.`，分隔符可以通过`metrics.scope.delimiter`参数修改。

系统作用域标识该指标对应的系统组件和上下文信息，比如JobManager、TaskManager、作业、算子和任务。可以在flink-conf.yaml文件中配置指标包含的上下文信息，如下所示：

| 作用域        | 配置参数           | 默认值 |
| ---------------- | ---------------------- | ---------------------- |
| JobManager       | metrics.scope.jm       | <host\>.jobmanager |
| JobManager和Job | metrics.scope.jm.job    | <host\>.jobmanager.<job_name\> |
| TaskManager      | metrics.scope.tm       | <host\>.taskmanager.<tm_id\> |
| TaskManager和Job | metrics.scope.tm.job   | <host\>.taskmana​​ger.<tm_id\>.<job_name\> |
| Task             | metrics.scope.task     | <host\>.taskmanager.<tm_id\>.<job_name\>.<task_name\>.<subtask_index\> |
| Operator         | metrics.scope.operator | <host\>.taskmanager.<tm_id\>.<job_name\>.<operator_name\>.<subtask_index\> |

配置参数值由常量字符串(如“jobmanager”、“taskmanager”)和变量字符串(使用尖括号表示)组成，在运行时会替换为真实值。比如TaskManager的指标标志符就可能是localhost.taskmanager.512，512是TaskManager的id。如下表所示为不同作用域可以设置的变量：

| 作用域      | 可用变量                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| JobManager  | <host\>                                                                             |
| TaskManager | <host\>, <tm_id\>                                                                   |
| Job         | <job_id\>, <job_name\>                                                              |
| Task        | <task_id\>, <task_name\>, <task_attempt_id\>, <task_attempt_num\>, <subtask_index\> |
| Operator    | <operator_id\>, <operator_name\>, <subtask_index\>                                  |

:::danger 小心
可能多个相同Job同时运行，为了避免指标标识符重叠，使用包含<job_id>的标识符。
:::

#### 暴露指标

Flink通过Reporter暴露指标，内置如下实现类：

| Reporter              | 实现类                                                            |
| --------------------- | ----------------------------------------------------------------- |
| JMX                   | org.apache.flink.metrics.jmx.JMXReporter                          |
| Graphite              | org.apache.flink.metrics.graphite.GraphiteReporter                |
| Prometheus            | org.apache.flink.metrics.prometheus.PrometheusReporter            |
| PrometheusPushGateway | org.apache.flink.metrics.prometheus.PrometheusPushGatewayReporter |
| StatsD                | org.apache.flink.metrics.statsd.StatsDReporter                    |
| Datadog               | org.apache.flink.metrics.datadog.DatadogHttpReporter              |
| Slf4j                 | org.apache.flink.metrics.slf4j.Slf4jReporter                      |

如果没有想要的实现类，通过实现接口`org.apache.flink.metrics.reporter.MetricReporter`来自定义Reporter。Reporter需要在flink-conf.yaml文件中配置才能生效：

```yaml
metrics.reporters: my_reporter
Metrics.reporter.my_jmx_reporter.class: org.apache.flink.metrics.jmx.JMXReporter
metrics.reporter.my_jmx_reporter.port: 9020-9040
```

### 监控延迟

[延迟](Chap02/#延迟和吞吐量)是监控流应用的首要指标，它定义为事件处理所需的时间。但是现实中精准地统计延迟会带来问题，比如一个事件属于多个窗口，是要反馈第一次处理的延迟还是所有窗口都处理完的延迟呢？

Flink不严格测量每个事件的延迟，它通过周期性地发送一条特殊记录来大致估算延迟，这条特殊记录称之为延迟标记(Latency Marker)。通过如下代码设置延迟标记的间隔：

```java
// 每个500毫秒发送一个延迟标记
env.getConfig.setLatencyTrackingInterval(500L)
```

当接收到延迟标记，除sink算子外的所有算子**直接将其发送到下游**。延迟标记可以反映记录等待处理的时间，但是不能测量出记录处理时间或者在窗口缓冲区的等待时间。统计sink算子出的延迟标记可以估算出记录在数据流中遍历的时长，如果想要自定义延迟标记在算子处的行为，可以重写processLatencyMarker()方法。

:::danger 小心

1. 开启延迟指标会显著影响Flink集群性能，最好仅用于调试目的
2. 开启延迟需要Flink集群所有机器时钟同步(比如使用NTP)，否则延迟估算不可靠
:::

## 日志配置

[Flink日志](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/deployment/advanced/logging/)默认使用slf4j和log4j的组合，使用日志如下代码所示：

```java
import org.apache.flink.api.common.functions.MapFunction;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class MyMapFunction extends MapFunction<Integer, String> {

  Logger LOG = LoggerFactory.getLogger(MyMapFunction.class)
  
  @Override
  String map(Integer value) {
    LOG.info("Converting value {} to string.", value)
    return value.toString();
  }
}
```

修改log4j日志行为，对应的配置文件为`${FLINK_HOME}/conf/log4j.properties`，通过JVM参数`-Dlog4j.configuration=xxx`来指定一个配置文件。在conf目录下，还提供`log4j-cli.properties`文件配置命令行客户端日志，以及`log4j-yarn-session.properties`文件配置客户端启动YARN session时日志。

Flink也支持使用logback，此时需要删除lib目录下log4j相关jar包，并加入logback-core和logback-classic的jar包。同样地，Flink在conf目录下提供了logback配置文件。

## 总结

1. 保存点是手动开启，对应存储系统上的一个路径；
2. /bin/flink脚本的参数和选项使用；
3. Flink默认开启task chainging机制，通过disableOperatorChaining()方法禁用，也可以通过slot共享组来控制；
4. 没有slot共享组，应用所需slot数量等于算子最大并行度；有slot共享组，slot数量等于每个共享组算子最大并行度之和；
5. 检查点开启及相关配置；
6. 通过指标信息监控Flink集群和应用；
7. 如何修改和配置Flink日志。
