---
layout: article
title: Apache Flink架构
permalink: /Stream-Processing-with-Apache-Flink/Chap03
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第3章读书笔记
:::

## 系统架构

Flink是为有状态并行数据流处理而设计的分布式系统，而分布式系统需要解决集群内存分配、进程协调、耐久并高可用的数据存储和故障恢复。

Flink并没有全都实现以上的功能，而专注于核心功能——分布式数据流处理，资源调度使用现有集群资源管理方案，如Apache Mesos，YARN，Kubernetes，数据存储使用HDFS、S3等，在高可用设置下的leader选举依赖于Apache ZooKeeper。

### Flink组件

Flink包含4种组件，它们互相协调支撑运行流计算应用，各自功能如下；

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Application-Submission-and-Component-Interactions.png" title="Application Submission and Component Interactions" />

- JobManager(JM)
控制流应用的主进程，它接收流应用(JobGraph:plus:逻辑数据流图:plus:包含所有资源的jar包)，将JobGraph转换为物理数据流图ExecutionGraph，向ResourceManager请求运行资源(task slot)，然后将ExecutionGraph分派给TaskManager执行。在执行过程中还负责协调操作，比如检查点。
- ResourceManager(RM)：
负责管理TaskManager slot，而slot是Flink执行计算的基本单位。
- TaskManager(TM)：
Flink的工作进程，Flink系统包含多个TaskManager，每个TaskManager提供N个slot。TaskManager向ResourceManager注册自己的slot，在ResourceManager指示下为JobManager提供slot。在执行过程中TaskManager之间交互数据。
- Dispatcher：
以REST API接口形式提供任务提交、运行情况查询等操作。因应用部署模式不同，不一定需要Dispatch。

### 应用部署

Flink应用有2种部署方式：

- 框架方式(Framework Style)：Flink应用打成jar包由client提交到某个运行服务(Flink Dispatcher、JobManager、YARN的ResourceManager)。当提交给JobManager，任务立即执行，当提交给Dispatcher或者YARN ResourceManager，由Dispatcher或者YARN ResourceManager启动JobManager并使其执行应用。

- 库方式(Library Style)：Flink应用打包成容器镜像，该镜像也包含ResourceManager和JobManager。容器启动后ResourceManager和JobManager提交作业执行。另外启动一个与作业无关的TaskManager容器向ResourceManager注册其slot。

### 任务执行

一个TaskManger可同时执行多个任务，这些任务可以是同一个算子、不同算子(任务并行)或者不同应用的子任务(对应分别是数据并行、任务并行、作业并行)。如下图所示展示TaskManager、slot、task和operator的关系：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Operators-Tasks-and-Processing-Slots.png" title="Operators, tasks and Processing slots" />

左侧的JobGraph是流处理应用的逻辑数据流图，它一共包含5个算子，其中A和C是source operator而E是sink operator。字母角标数据表示算子的并行度，**由于最大并行度为4，因此该应用至少需要4个可用slot**。假设给出2个TaskManager，每个TM可用2个slot，右侧给出JobGraph对应的ExecutionGraph。在同一个TaskManager上执行的算子可以在同一个进程内交换数据，免去网络通信开销。

TaskManager在同一JVM进程内使用多线程执行任务，线程更加轻量，通信成本低但是一个task出故障就会让整个TaskManager故障以至于所有任务失败。如果每个TaskManager只配置一个slot，就可以跨TaskManager隔离应用。

### 高可用设置

流处理引用都是7x24小时执行，当遇到故障时Flink需要重启应用并恢复状态。本节介绍Flink如何从进程故障中恢复。

- TaskManager故障

假设有个4个TaskManager，每个TaskManager配置2个slot，刚好可以运行最大并行度为8的应用。但是当1个TaskManager故障后，只剩下6个slot，此时JobManager向ResourceManager申请更多的slot，如果这不可行(例如应用以standalone模式运行），JobManager就不能重启应用除非有足够多的slot。

- JobManager故障

JobManager故障比TaskManager故障更难处理，由于JobManager控制流应用的执行并保存其执行状态，因此JobManager故障意味着流应用无法继续执行，即JobManager是Flink应用的单一故障点(single point of failure)。为了处理这个问题，Flink提供高可用模式。

Flink的高可用模式基于Apache ZooKeeper，如下图所示。JobManager将JobGraph和所有相关元数据(如应用jar包)保存到远程持久化存储系统，同时将具体的存储位置保存到ZooKeeper中。另外在应用运行过程中，当所有task成功保存其状态(达到一致性检查点)，JobManager对所有的状态句柄(存储位置)也执行相同操作。因此，JobManager恢复所需的所有数据都保存在外部存储中并且该存储位置指针保存在ZooKeeper中。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/A-Highly-Available-Flink-Setup.png" title="A Highly Available Flink Setup" />

当一个JobManager故障，属于其应用的所有task自动取消，新接管的JobManager执行如下操作：

1. 向ZooKeeper请求远程存储地址，从而获取JobGraph、JAR文件以及应用上一次检查点数据
2. 向ResourceManager请求slot以继续执行应用
3. 重启应用，重置所有任务的状态到上一个检查点

:::caution 注意

1. 当应用以库方式部署在容器环境中，JobManager或TaskManager故障时由容器编排服务自动重启
2. 当在YARN或Mesos上运行，Flink的其他正常组件会触发JobManager或TaskManager的重启
3. 当以standalone模式运行，Flink不重启失败进程
:::

## Flink中的数据转移

运行中的流应用不断地交换数据，这由TaskManager的网络组件完成，它会缓存一些记录再传输而不是一条条地传输，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Data-Transfer-between-TaskManagers.png" title="Data Transfer between TaskManagers" />

每个TaskManager用一个网络缓冲区(默认大小32KB)来发送、接收数据，缓冲区个数为算子并发度的平方。当一个发送task和一个接收task在同一个TaskManager中，发送方先将记录序列化保存在字节缓冲区中，当该缓冲区满了后，又将该缓冲区数据放到一个队列中，接收方再从队列中获取缓冲数据再反序列化，即同一个TaskManager的数据交换不会产生网络通信开销。

:::tip 数据交换中缓冲区的使用
在DataX中数据也是先到Column数组buffer中，如果buffer填满则将其全部导入到阻塞队列queue中
:::

Flink使用不同技术来降低task之间的通信开销，以下介绍基于credit的流控制和任务链。

### 基于credit的流控制

在task间进行网络通信时，每次只发一条记录延迟低但开销高，使用缓冲区收集一批记录再发送可以充分利用网络带宽，但是收集记录会增加延迟。

Flink实现了基于credit的流控制机制提高效率：接收方向发送方给出一个credit，即接收方可用的网络buffer个数；当发送方接收到credit通知，按照credit的大小发送尽可能多的buffer，并且告知接收方其可发送的buffer个数(backlog)；接收方处理发送过来的buffer，并根据所有发送方backlog调整下一次credit的大小。

基于credit的流控制优势：减少延迟(一旦接收方由足够多buffer接收数据，发送方马上传输)，防止数据倾斜(credit由发送方和接收方互相确定)。

### 任务链

当通信的task在同一个TaskManager内执行时，Flink使用任务链(Task Chaining)来降低开销。使用任务链优化必须满足两个要求：1. 多个算子具有相同并行度，2. 算子由本地通道连接，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/An-Operator-Pipeline-Satisfies-the-Requirements-of-Task-Chaining.png" title="An Operator Pipeline Satisfies the Requirements of Task Chaining" />

当满足条件后，Flink会将这些算子的function合并为由单个线程执行的单个task。如下图所示，一个function产生的记录由简单方法调用传递给下一个function，因此记录传递不需要序列化和网络通信开销。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Chained-Task-Execution-with-Fused-Functions.png" title="Chained Task Execution with Fused Functions" />

任务链能够显著地减少本地task的通信开销，但不是所有场景都需要任务链。比如，当某个function开销大时，此时把任务链拆开，让function分配到不同slot更好，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Nochained-Task-Execution.png" title="Nochained Task Execution" />
