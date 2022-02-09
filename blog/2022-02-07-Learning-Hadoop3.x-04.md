---
title: Hadoop 3.x学习笔记(4)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hadoop
  - BigData
description: Hadoop 3.1.3学习笔记(4)
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第4篇：Yarn。
<!--truncate-->

## Yarn简介

Yarn是一个资源调度平台，负责为运算程序提供服务器运算资源，相当于一个分布式的操作系统平台，而MapReduce等运算程序则相当于运行于操作系统之上的应用程序。

### 基本组件

- ResourceManager(RM)：
  - 处理客户端请求；
  - 监控NodeManager
  - 启动或监控ApplicationMaster
- NodeManager(NM)：
  - 管理单个节点资源
  - 处理来自ResourceManager的命令
  - 处理来自ApplicationMaster的命令
- ApplicationMaster(AM)：
  - 为应用程序申请资源并分配任务
  - 任务监控与容错
- Container：计算资源的抽象，包括内存、CPU、磁盘、网络等

### 工作流程

1. MapReduce程序在客户端节点被提交；
2. YarnRunner向RM申请一个Application；
3. RM将应用程序的资源路径返回给YarnRunner；
4. MR程序将运行资源提交到HDFS上；
5. 资源提交完毕后，申请运行mrAppMaster；
6. RM将用户的请求初始化成一个Task；
7. 其中一个NM领取到Task任务；
8. 该NM创建container，并产生MRAppmaster；
9. Container从HDFS上拷贝资源到本地；
10. MRAppmaster向RM申请运行MapTask资源；
11. RM将运行MapTask任务分配给另外两个NodeManager，另两个NodeManager分别领取任务并创建容器；
12. MR向两个接收到任务的NodeManager发送程序启动脚本，这两个NodeManager分别启动MapTask，MapTask对数据分区排序；
13. MrAppMaster等待所有MapTask运行完毕后，向RM申请容器，运行ReduceTask；
14. ReduceTask向MapTask获取相应分区的数据；
15. 程序运行完毕后，MR会向RM申请注销自己。

### 调度策略

Hadoop作业调度器主要有3种：FIFO、容量调度器(Capacity Scheduler)和公平(Fair Scheduler)。Apache Hadoop默认使用容量调度器，CDH默认使用公平调度器，配置参数见yarn-default.xml：

```xml
<property>
  <description>The class to use as the resource scheduler.</description>
  <name>yarn.resourcemanager.scheduler.class</name>
  <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
</property>
```

#### FIFO

按照任务提交先后顺序依次服务，优点是简单易懂，缺点是不支持多队列，生产环境很少使用。

#### 容量调度器

由Yahoo开发，容量调度器的特点如下：

1. 多队列：每个队列可配置一定的资源量，每个队列采用FIFO调度策略；
2. 容量保证：管理员可为每个队列设置资源最低保证和资源使用上；
3. 灵活性：如果一个队列中的资源有剩余，可以暂时共享给那些需要资源的队列，而一旦该队列有新的应用，程序提交，则其他队列借调的资源会归还给该队列；
4. 多租户：支持多用户共享集群和多应用程序同时运行。为了防止同一个用户的作业独占队列中的资源，该调度器会对同一用户提交的作业所占资源量进行限定。

容量调度器的策略如下：

1. 队列资源分配：从root开始使用深度优先算法，找到资源占用率最低的队列分配；
2. 作业资源分配：默认按作业的优先级、提交时间顺序分配；
3. 容器资源分配：按容器优先级，如果相同按数据本地性原则：任务和数据在相同节点、相同机架、不同机架。

#### 公平调度器

同队列的所有作业共享资源，按时间获得公平的资源。与容量调度器相比：

- 相同点：
  - 支持多队列；
  - 容量保证，可以为每个队列设置最低保证和上限；
  - 灵活性：其他队列的剩余资源可以共享给其他队列，该队列有作业提交后资源归还；
  - 多租户：支持多用户共享集群和多应用程序同时运行，可针对同一用户的作业资源暂用进行限制。
- 不同点；
  - 核心调度策略：容量调度器优先选择资源利用率低的队列安排作业，公平调度器优选选择资源**缺额**比例大的队列安排作业
  - 队列资源分配策略：容量调度器支持FIFO和DRF，公平调度器支持FIFO、FAIR、DRF。

其中，缺额指某个时刻一个作业按照公平分配的资源和实际获取资源的差距。当使用FIFO策略时，公平调度器和容量调度器别无差异。FAIR策略(默认)是一种基于最大最小公平算法实现的资源多路复用方式，资源分配流程与容量调度器一致：选择队列、选择作业、选择容器。每步按照如下流程分配资源：

1. 计算如下参数：实际最小资源份额minshare = Min(资源需求量, 配置的最小资源量)，是否饥饿isNeedy=资源使用量 < minshare，资源分配比minShareRatio = 资源使用量 / Max(mindshare, 1)，资源使用权重比useToWeightRatio = 资源使用量 / 权重。
2. 判断对象饥饿状态，不一致的饥饿优先；
3. 饥饿状态一致，资源分配比小者优先；
4. 资源分配比相等，按照提交顺序优先。

DRF(Dominant Resource Fairness)：之前提到的资源都是单一标准，比如只考虑内存(Yarn默认)，但实际需要考虑CPU、网络带宽等其他因素，此时使用DRF策略对不同应用进行不同资源的一个不同比例的限制。

## Yarn命令

除了通过页面查看外，还可以通过如下命令查看管理Yarn作业：

### 作业查看

- `yarn application -list`：列出所有作业；
- `yarn application -list -appStates <state>`：根据状态查看作业，可选状态有ALL、NEW、NEW_SAVING、SUBMITTED、ACCEPTED、RUNNING、FINISHED、FAILED、KILLED；

### 日志查看

- `yarn logs -applicationId <id>`：查看应用日志；
- `yarn logs -applicationId <ApplicationId> -containerId <ContainerId>`：查看某个容器上的应用日志。

### 应用尝试查看

- `yarn applicationattempt -list <ApplicationId>`：查看尝试应用列表；
- `yarn applicationattempt -status <ApplicationAttemptId>`：查看尝试应用状态。

### 容器查看

- `yarn container -list <ApplicationAttemptId>`：列出所有容器；
- `yarn container -status <ContainerId>`：查看容器状态。

### 节点查看

- `yarn node -list -all`：列出所有节点；

### 更新队列配置

- `yarn rmadmin -refreshQueues`：更新加载队列配置；

### 队列查看

- `yarn queue -status <Queuename>`。
