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
