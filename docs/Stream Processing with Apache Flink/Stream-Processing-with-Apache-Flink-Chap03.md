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

## 事件时间处理

上一章介绍了Flink时间语义的两个重要概念：事件时间和水印。下面具体介绍Flink是如何实现并处理事件时间和水印。

### 时间戳

当应用以事件时间处理时，Flink要求所有记录都必须携带一个时间戳(timestamp)，它表示记录事件的发生时间。Flink将时间戳编码为16字节长数值，表示自1970-01-01 00:00:00.000起的毫秒数。当然，自定义算子可以有自己的内部含义，比如表示微秒数。

### 水印

如下图所示，在Flink中，水印被实现为一种携带时间戳的特殊记录，它跟着正常记录一块被处理：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/A-Stream-with-Timestamped-Records-and-Watermarks.png" title="A Stream with Timestamped Records and Watermarks" />

水印的2个基本属性：

- 携带的时间戳T必须是单调递增的，确保事件时间钟向前走而不是后退
- T表示水印之后的记录事件都大于T

水印的第2个属性用于处理乱序事件时间，比如上图中的时间戳3和5。当记录的时间戳小于水印时间戳，这意味着该条记录已经错失了对应的计算，称其为迟到记录。对于迟到记录，Flink也提供了不同的处理方式。

水印的另一个作用是让应用灵活调整结果完整性和延迟间的平衡，如果水印和记录时间挨得近，延迟小但是结果可能不准确，反之水印太保守会提升结果准确性但延迟高。

### 水印传播和事件时间

每个任务包含一个内置时间服务来维护定时器，当任务接收到水印时开启该服务，具体步骤为(理论)：

1. 任务根据水印时间更新其内部事件时间
2. 任务内置时间服务找到所有时间比水印时间小的定时器，对每个过期的定时器，任务运行回调函数，该回调函数执行计算并向下发送记录
3. 任务发送更新事件时间的水印

根据数据并行和任务并行，Flink将数据流划分了多个分区(partition)，每个分区都有各自的记录和水印。基于当前算子与其前后算子的连接方式，该算子的任务可以从1至多个分区中接收记录和水印，并向下发送1至多个记录和水印。

任务为每个分区维护水印，当它从其中一个分区接收到水印后(具体实现)：

1. 更新对应分区的水印为接收水印和当前水印的较大值
2. 更新其事件时钟为所有分区水印的最小值
3. 如果事件时钟前进，任务处理所有触发的定时器(执行计算)，然后向所有下游任务发送对应的水印

如下图所示给出一个水印更新和传播的例子：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Updating-the-Event-Time-of-a-Task-with-Watermarks.png" title="Updating the Event Time of a Task with Watermarks" />

1. 水印4到达，对应分区水印当前值为2，两者取其较大值，更新分区水印为4
2. 更新任务事件时钟，当前值为2，所有分区水印的最小值为3，直接更新事件时钟为3
3. 事件时钟2->3变大，向下传播新水印3
4. 水印7到达，更新对应分区水印为7，所有水印最小值还是3不变，任务事件时钟没有变大
5. 水印6到达，更新对应分区水印为6，所有水印最小值为4，任务事件时钟变大，向下传播新水印4

:::tip 细品
如果水印不是按照4->7->6的顺序到达，那么task的行为又会是怎样的？实际上，通过每次更新对应分区较大值，更新事件时钟为最小值，这样确保任务向外发送新水印时，该任务对应的操作都已经在每个分区上处理过了，可以看成所有分区“齐头迈进一步”。
:::

当算子的输入流本身就有多个(Union、CoFlatMap算子)，行为和输入流分区一样(任务不会区别对待分区水印和不同流的水印)。由于应用的多个输入流互相独立，当这些流都没有对齐时，就会导致问题，水印更快的流被缓存直到事件时钟更新。对于分区流亦是如此，如果一个分区流水印没有前进或者完全不更新，这会导致延迟和积压状态显著增加。

### 时间戳赋值和水印生成

到目前为止讨论了时间戳和水印的处理，但没有说明它们是怎么来的。由于时间戳的选择是特定于应用程序的，而水印取决于时间戳和流的特征，因此应用需要显式指定时间戳和生成水印。Flink提供如下3种方式：

1. 数据源：由SourceFunction产生，时间戳和记录一块被发送，水印可以在任何时候发送。数据源可以声明自己为idle的，此时Flink将不会处理其分区流，这种机制用于解决之前提到的水印不更新的问题。
2. 周期性assigner：由用户自定义方法AssignerWithPeriodicWatermarks从记录中提取时间戳，然后周期性地查询当前水印。
3. 间断assigner：由用户自定义方法AssignerWithPunctuatedWatermarks从记录中提取时间戳，由特定的记录生成水印。和AssignerWithPeriodicWatermarks不同的是，它不需要从**每条**记录中生成水印。

:::caution
用户自定义的时间戳赋值方法通常应用于尽可能接近数据源(Source Operator)的地方，因为在算子处理记录和它们的时间戳之后，很难判断它们的顺序，并且也不应该在流处理的中间覆盖已有的时间戳和水印，即使可以通过自定义方法实现。
:::

## 状态管理

大多数的流处理应用都是有状态的，如下所示，任务维护并用于计算的数据属于该任务的状态。

<img style={{width:"50%", height:"50%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/A-Stateful-Stream-Processing-Task.png" title="A Stateful Stream Processing Task" />

一个任务接收输入数据，在处理数据时会读取任务自己的状态然后更新状态，并输出结果。任务读取更新状态的逻辑通常直观简单，但是实现高效且可靠的状态管理更难：状态太大内存溢出怎么办、任务故障如何保证状态不丢失。这些问题都需要Flink处理，让开发者只需要关注应用逻辑。根据可见性的不同，状态分为如下两种：

### 算子状态

算子状态(Operator State)仅在同一个算子的并发任务中可见，不同算子或者不同任务的状态互相独立，如下图所示：

<img style={{width:"50%", height:"50%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Tasks-with-Operator-State.png" title="Tasks with Operator State" />

Flink为算子状态提供3个原语：

- List state：以列表形式展示状态
- Union list state：也是以列表形式展示状态，但是在故障恢复时和list state稍有不同
- Broadcast state：为所有算子的任务状态相同时而设计，用于检查点和算子调节(rescaling)

### 键控状态

键控状态(Keyed State)根据操作符的输入流记录中定义的键来维护和访问。如下图所示，根据记录颜色分配到不同task并管理状态：

<img style={{width:"50%", height:"50%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Tasks-with-Keyed-State.png" title="Tasks with Keyed State" />

对于键控状态，Flink提供如下原语：

- Value state：每个键保存一个任意类型的值，支持复杂数据结构
- List state：每个键保存一个列表，列表元素类型任意
- Map state：每个键保存一个map，map的key和value类型任意

### 状态后端

为了在处理记录时高效访问状态，task在**本地**维护其状态。而具体的状态访问、存储、维护由一个称为状态后端(State Backend)的可插拔组件提供，它负责两件事：

- 本地状态管理

将状态保存到本地提供访问，Flink将键控状态作为对象保存在JVM堆中，也可以将对象序列化保存在RocksDB中。前者访问快但存储大小受限，后者访问慢但容量大。

- 状态检查点化

由于Flink是分布式系统并且状态仅在本地维护，当TaskManager故障时状态失效，因此需要状态检查点化将状态保存到远程存储。并且检查点化也有不同策略，比如RocksDB支持增量检查点，在状态体积很大时可以减少开销。

有关状态后端更详细的讨论见第7章*选择状态后端*一节。

### 缩放状态算子

算子的并行度需要根据流的输入速率调整，这种操作称之为**缩放(scaling)**。缩放无状态算子没什么难度，但缩放状态算子更复杂，因为需要对状态重新分区并转移。Flink支持4种缩放模式：

1. 带键控状态的算子通过主键重分配来缩放，如下图所示，**Flink并不会重分配单个键，而是以键组(key group)为单位进行重分配**。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Scaling-an-Operator-with-Keyed-State-out-and-in.png" title="Scaling an Operator with Keyed State out and in" />

2. 对于list状态，将每个列表中的状态重新分发到新的列表状态，如下图所示，注意如果原来列表的元素个数小于新的并行度，那么有的任务状态为空。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Scaling-an-Operator-with-Operator-List-State-out-and-in.png" title="Scaling an Operator with Operator List State out and in" />

3. 对于union list状态，通过将每个任务的状态列表**广播**到新任务实现缩放，新任务可以选择性地接收状态，如下图所示。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Scaling-an-Operator-with-Operator-Union-List-State-out-and-in.png" title="Scaling an Operator with Operator Union List State out and in" />

4. 对于broadcast状态，由于每个task的都有一份状态拷贝，扩展算子并行度只需要拷贝状态到新任务，收缩算子并行度只需要取消多余任务，如下图所示。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Scaling-an-Operator-with-Operator-Broadcast-State-out-and-in.png" title="Scaling an Operator with Operator Broadcast State out and in" />

## 检查点、保存点和状态恢复

介绍Flink如何通过检查点和恢复机制保证精准一次(exactly-once)的状态一致性。

### 一致性检查点

**一致性检查点(Consistent Checkpoint)**指所有任务都处理了完全相同的输入时，每个任务的状态拷贝。一种朴素的实现算法是：

1. 暂停所有输入
2. 等传输中的数据处理完毕
3. 拷贝每个任务的状态到远程持久化存储
4. 恢复所有输入

如下图所示为一个流处理应用的一致性检查点快照，该应用的输入(source operator)为自然数1,2,3...，根据奇偶性分为2个子流并计算总和，设置检查点时输入状态为5(已经被发送处理)，偶数和算子状态为6(2+4)，奇数和算子状态为9(1+3+5)，因此Flink将5,6,9保存到远程存储中。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/A-Consistent-Checkpoint-of-a-Streaming-Application.png" title="A Consistent Checkpoint of a Streaming Application" />

### 从一致性检查点中恢复

在运行流应用过程中，Flink会定时保存一致性检查点，在故障时恢复到最近一次的检查点再重新开始处理，如下图所示，应用通过3步恢复：

1. 重启整个应用
2. 将所有任务状态重置为上一个检查点
3. 恢复所有任务执行

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Recovering-an-Application-from-a-Checkpoint.png" title="Recovering an Application from a Checkpoint" />

检查点和恢复机制提供精准一次的状态一致性，因为所有算子的状态都恢复到上一次检查点时。**注意，数据源是否可以重置取决于其具体系统的实现**，比如Kafka可以但是socket不行，**即只有当所有输入源支持重置时，应用才能实现精准一次的状态一次性**。

尽管会出现数据重复处理的情况，如上图中的6，但检查点恢复机制仍然达到精准一次的状态一致性，因为所有算子状态都被重置就好像6没有被处理过一样。

:::caution 注意
Flink的检查点机制仅重置内部(internal)算子状态，当sink operator是文件系统、数据库时结果可能会被发送多次。Flink也提供实现精准一次输出的sink function，在检查点保存完毕后以事务提交结果。这种要求更高的端到端精准一次性策略在第8章介绍。
:::

### Flink检查点算法

暂停、保存检查点、恢复这种简单的算法会暂停整个Flink应用(stop-the-world)，对于有延迟要求的应用来说不切实际。Flink基于Chandy–Lamport算法实现了分布式检查点快照，该算法不仅不会stop the world而且将数据处理和检查点保存解耦。

如下图所示为一个简单的流应用，它接收2个输入流，按照奇偶性分流并计算总和，最后输出。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Streaming-Application-with-2-Parallelism.png" title="Streaming Application with 2 Parallelism" />

当初始化检查点时，JobManager会发送一条带id的特殊记录，称为检查点屏障(Checkpoint Barrier)给所有数据源任务，如下图所示：

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/JobManager-Initiates-a-Checkpoint.png" title="JobManager Initiates a Checkpoint" />

source operator收到barrier后，1)停止发送记录，2)触发检查点保存，3)**广播**barrier，4)恢复执行。如下图所示，source operator通过注入barrier确定了检查点在流中的位置：

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Sources-Checkpoint-State-and-Emit-a-Checkpoint-Barrier.png" title="Sources Checkpoint State and Emit a Checkpoint Barrier" />

类似于水印，source operator的barrier会被广播到所有任务确保每个任务都从其每个输入流中收到。当一个任务收到barrier后，它会等待其他所有输入的barrier。在等待过程中，任务继续处理还没有接收到barrier的分区流，而已经接收到barrier的分区流暂停处理并缓存其数据(称为**屏障对齐，Barrier Alignment**)，如下图所示。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Tasks-Wait-to-Receive-a-Barrier-on-Each-Input-Partition.png" title="Tasks Wait to Receive a Barrier on Each Input Partition" />

当接收到所有输入分区的barrier后，任务保存检查点并向下游广播barrier，如下图所示：

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Tasks-Checkpoint-State-and-Emit-Barrier.png" title="Tasks Checkpoint State and Emit Barrier" />

当所有barrier被发送后，任务先处理缓存数据，然后才继续处理输入流，如下图所示：

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Tasks-Continue-Regular-Processing-after-Barrier-is-Forward.png" title="Tasks Continue Regular Processing after Barrier is Forward" />

最终barrier到达sink task，它也会执行barrier对齐，保存检查点状态然后告知JobManager已经收到barrier。当JobManager接收所有task的检查点通知后，它将该应用标记为已完成一次检查点保存，最终结果如下图所示：

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Sinks-Acknowledge-JobManager-and-a-Checkpoint-is-Complete.png" title="Sinks-Acknowledge-JobManager-and-a-Checkpoint-is-Complete" />

### 检查点的性能影响

为了最大程度地减少检查点保存的延迟，Flink在特定情况下实现了些小技巧来化解性能影响：

- 状态后端(如文件系统、RocksDB)**异步**保存检查点，此外，RocksDB还可以实现**增量**检查点。
- 调整barrier对齐步骤，当应用对延迟要求很高并且可以接受至少一次保障，Flink可以通过配置让barrier对齐时数据立即被处理而不是缓存起来。

### 保存点

Flink通过周期性的检查点快照来实现故障恢复，保存点(savepoint)实现算法和检查点一样，但有以下不同之处：

- 保存数据：保存点额外对元数据进行快照
- 触发机制：检查点由Flink自动定时触发，保存点需要用户显式触发
- 删除策略：Flink根据配置策略自动删除检查点，但不会自动删除保存点

#### 使用保存点

检查点是一种特殊的保存点，它在相同集群、相同配置、相同应用下启动应用，而保存点提供更多功能：

- 从检查点可以启动一个不同但**兼容**的应用，可以用于修复应用BUG
- 相同应用在并发度缩放下启动(并发度不同)
- 在不同集群下重启应用，可以用于迁移应用到新版本的Flink
- 暂停应用随后重启，可以用于为高优先级应用缓解集群资源
- 为应用创建版本或者存档

#### 从保存点中启动应用

如下图示例是一个含3个算子的应用，算子OP-1含有一个算子状态OS-1，算子OP-2有2个键控状态KS-1、KS-2，当保存点触发时，所有任务的状态被保存到持久化存储。

状态备份通过算子id和状态名称确定(额外的元数据)，当从保存点重启应用时，Flink将保存点分发到对应的算子中。

:::note
保存点并不包含任务信息，因为任务数量(并发度)会改变，在之前的小节中介绍了Flink如何[缩放状态算子](#缩放状态算子)
:::

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap03/Taking-a-Savepoint-from-an-Application-and-Restoring-an-Application-from-a-Savepoint.png" title="Taking a Savepoint from an Application and Restoring an Application from a Savepoint" />

当通保存点启动**不同**的应用时，只有算子id和状态名相同时才能恢复状态。默认情况下，Flink会自动生成唯一的算子id。由于**每个算子id都根据其前置算子id生成**，如果添加或删除算子都会导致保存点恢复失败，因此**强烈推荐手动为算子分配id而不是依赖Flink的默认分配**。

## 总结

1. Flink的流控制类似TCP流量控制，双方按照自己能接收的窗口大小(credit)通信
2. 水印的传播机制：先更新分区水印，再更新task事件时间，事件时间增加则触发计算并向下游广播该水印
3. 算子状态与task实例关联，键控状态与记录管理，它们都由状态后端维护；状态算子的缩放策略根据状态类型而定
4. 检查点流程：源端插入检查点，检查点对齐，检查点保存，检查点恢复
5. 检查点和保存点的区别：检查点是一种特殊的保存点
