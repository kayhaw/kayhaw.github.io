---
layout: article
title: 流处理基础
slug: /Stream-Processing-with-Apache-Flink/Chap02
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

:::info
*Stream Processing with Apache Flink* 第2章读书笔记
:::

## 数据流编程简介

介绍一些数据流编程的术语及其概念

### 数据流图

数据流程序由***数据流图(Dataflow Graph)**表示，节点称为**算子(Operator)**，边表示数据依赖。算子接收输入数据，执行计算然后输出数据。特别地，只输出没有输入的算子称之为**数据源(Data Source)**，而只有输入没有输出的算子称之为**数据槽(Data Sink)**，一个数据流程序至少包含一个数据源和数据流。如下图所示为一个提取统计推特关键字个数的数据流程序：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Logical-Dataflow-Graph-Example.png" title="A Logical Dataflow Graph Example" />

上图称之为**逻辑数据流图(Logic Dataflow Graph)**，它表示数据流程序高层的计算逻辑视图。当使用分布式处理引擎计算时，每个算子由几个在不同物理机上的任务并行执行，此时使用如下图所示的**物理数据流图(Physical Dataflow Graph)**来表示数据流程序。物理数据流图上的每个节点表示一个**任务(Task)**。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Physical-Dataflow-Graph-Example.png" title="A Physical Dataflow Graph Example" />

### 数据并行和任务并行

- 数据并行(Data Parallelism)：将输入数据划分为子集，在**相同算子**上并行对数据子集进行计算
- 任务并行(Task Parallelism)：**不同算子**并行处理所有数据

### 数据交换策略

数据交换策略定义了数据如何在**物理数据流图**中传递，如下图所示有4种常用策略：

- Forward：将数据发送给一个下游任务，当上下游算子处于同一个物理机时可以避免网络开销
- Broadcast：将数据发送到算子的每个下游并行任务
- Key-based：根据键值选择发送的下游任务
- Random：随机发送给下游任务

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/Data-Exchange-Strategies.png" title="Data Exchange Strategies" />

## 并行流处理

在并行流处理中，数据流被定义为**无界的事件序列**，例如监控数据、传感器测量数据、信用卡交易数据等。

### 延迟和吞吐量

对于批处理，我们关心一次作业的总运行时间、计算时间等指标，但流处理连续地接收处理数据，并没有总运行时间的概念。取而代之地，延迟和吞吐量成为评估流处理的指标。

- 延迟=计算得到结果时间-事件被接收时间，又分为平均延迟、最大延迟、百分比延迟。低延迟对流处理至关重要，通常为毫秒级，这也是实时应用的基础。而批处理延迟在几分钟到几小时不等，因为需要聚集一批数据后才开始执行。

- 吞吐量=单位时间内处理的事件数量，通常关心系统的最大吞吐量，如果事件到达速率过大，反而会导致吞吐量下降，称之为反压(Backpressure)。

- 延迟vs吞吐量：延迟和吞吐量并不是互相独立的指标，当延迟高时吞吐量低，反之吞吐量低时延迟也高。要想同时达到低延迟、高吞吐，需要在并行地进行流处理。

### 数据流操作

流处理引擎通常提供接收、转化、输出数据流的内置操作，按照是否保存内部状态，分为**有状态操作**和**无状态操作**：

- Stateless Operation
  1. 事件处理独立于到达顺序和其他事件，易于并行化扩展；
  2. 容错恢复只需要重启应用继续从上次位置执行
- Stateful Operation
  1. 不易并行化扩展
  2. 故障恢复更困难

常见操作有：

1. 数据获取、输出(Data Ingestion/Egress)：获取、输出操作是流处理器与外界系统通信的方式，对应的算子称之为数据源和数据槽
2. 转化操作：一种独立、单向的处理数据操作。如下图所示为一个用户自定义函数(UDF)提供的转换操作，它将每个输入事件转为深蓝色事件输出。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-UDF-Transformation-Operation.png" title="A UDF Transformation Operation" />

3. 滚动聚合：每接收输入事件就更新的聚合计算(求和、求最大值、求最小值等)，聚合计算必须满足结合律和交换律，否则需要保存所有历史数据。如下图所示为一个求最小值的滚动聚合操作：

<img style={{width:"50%", height:"50%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Rolling-Minimum-Aggregation-Operation.png" title="A Rolling Minimum Aggregation Operation" />

4. 窗口操作：与每次只接收处理一个事件不同，窗口操作需要缓存多个事件记录来计算结果，例如求中位数。

窗口操作将无界事件流划分为连续的**桶(bucket)**，每个桶是一个有限的事件集合。而根据划分桶的策略(按事件时间、按事件个数)不同，开窗操作又可分为如下几种：

1. 滚动窗口(Tumbling Window)：将无界流分为**固定大小且互不重叠**的桶，如下所示分别为按事件个数和时间划分的滚动窗口：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/Count-based-Tumbling-Window.png" title="Count-based Tumbling Window" />

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/Time-based-Tumbling-Window.png" title="Time-based Tumbling Window" />

2. 滑动窗口(Sliding Window)：将无界流分为**固定大小但有重叠**的桶，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Sliding-Count-based-Window.png" title="A Sliding Count-based Window" />

3. 会话窗口(Session Window)：按照会话划分事件流，会话由一系列连续时间内发生的事件组成，会话之间没有事件的空闲间隔称为会话间隔(Session Gap)，如下图所示：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/Session-Window.png" title="Session Window" />

到目前为止的操作都是在完整的流上进行，实际开发中需要将一个流划分为多个逻辑流然后为每个流定义各自开窗操作，称之为*并行窗口(Parallel Window)*，如下所示按照事件类型划分并对每个流进行长度为2的滚动窗口操作：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Parallel-Tumbling-Window.png" title="A Parallel Tumbling Window" />

窗口操作与流处理的两大关键概念紧密相关：时间语义和状态管理。现实中的事件会延迟或者乱序到达，时间语义定义如何处理这种情况。上述介绍的窗口操作都需要缓存数据来计算出结果，并且容错恢复时也需要恢复状态来保证结果正确性，因此需要状态管理。

## 时间语义

### 1分钟的含义

假设一个流处理程序需要分析用户玩手游时产生的事件，如果小队中所有玩家在1分钟内消灭500个敌人，他们每个人都会升一级。现在Alice每天在坐地铁上下班时玩这个游戏，当穿过隧道时，Alice手机失去信号，但她继续玩游戏并且事件缓存在手机上。当驶出隧道后这些事件继续发送到流处理程序，那么此时1分钟是否包含Alice掉线的这一段事件？

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/An-Online-Mobile-Game-Example-in-Practice.png" title="An Online Mobile Game Example in Practice" />

在这个例子中，流处理程序可以选择2种时间语义：处理时间(Processing Time)和事件时间(Event Time)。

### 处理时间

指流处理程序所在机器的本地时间(事件到达时间)。如下图所示，使用处理时间的程序在Alice掉线时仍会计时，所以掉线的这段时间内她的游戏活动并不算在内：

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Processing-Time-Window-Example.png" title="A Processing Time Window Example" />

### 事件时间

指事件实际发生时间。如下图所示，即使事件延迟到达，使用事件时间也能正确地进行窗口操作，反应真实情况。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap02/An-Event-Time-Window-Example.png" title="An Event Time Window Example" />

**事件时间将处理结果与处理速度完全解耦**：无论流处理速度多快或者事件什么时候到达，处理结果都是相同的。

除了解决事件延迟的问题外，事件时间也解决了事件乱序的问题。处理可回放(Replayable)流时，通过事件时间可以快进历史事件就好像事件流是实时发生的，或者快进到现在发生事件，程序继续按照相同逻辑保持实时。

### Watermarks(水印)

水印用于配置基于事件时间的窗口操作。当设置水印为T，即认为事件时间早于T的事件已经全部接收完毕，没有延迟事件。

在结果可信度和处理延迟之间，水印提供可配置的权衡条件。如果水印过小，则处理延迟低但结果可信度低，反之结果可信度高但处理延迟高。

仅仅依赖于水印是不够的，还需要处理晚于水印的事件。可以选着忽略、打印或者根据之前的结果重新计算。

### 处理时间vs事件时间

处理时间并不是完全没有意义，它尽可能地提供最低延迟，在速度优于准确度的应用中派上用场。另一方面，事件时间保证了确定性的结果，并可以处理延迟甚至无序的事件。

## 状态和一致性模型

状态是在流处理中另一个极其重要的方面。支持有状态的算子需要面对的挑战有：

- 状态管理
- 状态分区
- 状态恢复

### 任务故障

什么是任务故障？在流处理中，每个任务按照3步执行：1.接收事件并缓存，2.更新内部状态，3.产生输出记录。故障(Failure)可能出现在任意一步，若是第一步出现，事件会丢失吗？若是第二步，那恢复后会重新更新内部状态吗？发生故障后最终结果都是确定的吗？

在批处理中可以从头开始计算，因此任务故障不是问题。而流处理根据不同的结果保障(Result Guarantees)来应对故障。

### 结果保障

结果保障指保证流处理器内部状态的一致性，注意这和保证输出结果的一致性不同，当数据发送到数据槽后就很难保证结果正确性，除非数据槽支持事务。有以下几种结果保障：

- **至多一次(At-most-once)**：最简单的策略，什么也不干(不恢复状态，也不重放丢失事件)，这样所有事件要么执行一次(正常执行)，要么没有执行(任务故障)，也称“No Guarantee”
- **至少一次(At-least-once)**：事件回放并重新处理一遍所有事件，这样所有事件都至少被处理过一次。应用对事件出现次数敏感时，会得到错误结果。
- **精准一次(Exactly-once)**：要求最高的保证，每个事件都会被处理一次而没有丢失，输出正确结果就好像没有故障发生过。“精准一次”需要“至少一次”保证，即需要数据回放机制。
- **端到端精准一次(End-to-end exactly-once)**：以上结果保证都是面向由流处理器管理的应用状态，但除了流处理器外还至少有一个数据源和数据槽，“端到端”指包括数据源和数据槽的完整流水线，它的结果保障取决于流水线组件中结果保障性最弱的一个。

## 总结

本章介绍学习数据流处理的基础概念，归纳如下：

1. 逻辑数据流图描述流处理执行过程(静态的)，而物理流数据流图描述实际运行时的情况(动态的)；
2. 数据并行指在相同算子上处理数据子集，任务并行指在不同段素上处理所有数据；
3. 数据交换策略(4种)：转发、广播、基于主键、随机；
4. 评价流处理引用的指标：延迟、吞吐量，两者互相影响；
5. 数据流操作(4种)：只处理单个事件的输入输出、转换，处理多个事件的滚动聚合、窗口操作。其中窗口操作又可分为4种：
    1. 滚动窗口，大小固定**不**重叠；
    2. 滑动窗口，大小固定**会**重叠；
    3. 会话窗口，大小变化**不**重叠；
    4. 并行窗口，单流变多流的窗口操作；
6. 处理时间和事件时间：前者是本地时间，后者是发生时间；
7. 水印是权衡延迟和准确度的一种机制，晚于水印时间可以选择忽略、输出或者重新计算；
8. 结果保证：最多一次啥不干，最少一次有重复，精准一次最完美，整个流水端到端。
