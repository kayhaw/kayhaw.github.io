---
layout: article
title: 为流应用部署Flink环境
slug: /Stream-Processing-with-Apache-Flink/Chap09
tags:
  - Stream Processing
  - Apache Flink
  - ReadingNotes
---

本章介绍部署Flink的不同方式以及如何配置，包括最重要的JobManager和TaskManager配置。

## 部署模式

本节介绍如何在不同环境下配置和启动Flink，包括standalone集群、Docker、Apache Hadoop YARN和Kubernetes。

### Standalone集群

如下图所示，standalone集群至少包含一个master进程和至少一个TaskManager进程。

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap09/Starting-a-Standalone-Flink-Cluster.png" title="Starting a Standalone Flink Cluster" />

master进程以分隔的线程运行Dispatcher和ResourceManager，随后TaskManager将自己登记到ResourceManager。下图展示一个作业是如何提交到standalone集群上的：

Submitting-an-Application-to-a-Flink-Standalone-Cluster

<img style={{width:"60%", height:"60%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap09/Submitting-an-Application-to-a-Flink-Standalone-Cluster.png" title="Submitting an Application to a Flink Standalone Cluster" />

当客户端向Dispatcher提交任务，Dispatcher新建一个JobManager线程并提供运行执行的JobGraph。JobManager向ResourceManager请求到slot资源后执行任务。

**在standalone模式下，master和workre不会在遇到故障时自动重启**，单一worker故障可以通过其他slot恢复，但是master故障恢复需要配置高可用模式。

配置standalone十分简单：在官网下载压缩包`flink-${flink版本号}-bin-scala_${scala版本号}.tgz`并解压，记解压后Flink目录路径为`${FLINK_HOME}`。进入`${FLINK_HOME}/bin`目录运行start-cluster.sh脚本即启动集群，Flink预配置为都在本机运行的一个master和一个TaskManager，通过`http://localhost:8081`访问Flink Web UI。Java环境通过系统环境变量`JAVA_HOME`或者`${FLINK_HOME}/conf/flink-conf.yaml`文件中的`env.java.home`配置项设置。

要想将配置运行在多个机器上的Flink集群，需要按如下步骤调整默认配置：

- 将添加的TaskManager运行机器ip添加到`${FLINK_HOME}/conf/slaves`文件；
- 对所有TaskManager机器配置免密SSH
- **所有机器的${FLINK_HOME}必须相同**，一会常见实现方式是在每个机器上挂载网络共享的Flink目录
- 通过flink-conf.yaml文件的`jobmanager.rpc.address`项配置运行master的机器ip

以上步骤完成后，重新执行start-cluster.sh脚本启动集群，此时本地会启动一个JobManager进程，并且slaves中配置的每个机器都会运行一个TaskManager进程。通过`stop-cluster.sh`脚本关闭集群。

### Docker

Docker是一种以容器形式打包和运行应用的平台，Flink社区在Docker Hub上提供了Flink各版本镜像。在Docker中运行Flink十分简单，只需要启动2种容器：运行Dispatcher和ResourceManager的master容器、运行TaskManager的worker容器。对应的启动命令如下所示：

```bash
// start master process
docker run -d --name flink-jobmanager \
  -e JOB_MANAGER_RPC_ADDRESS=jobmanager \
  -p 8081:8081 flink:1.7 jobmanager

// start worker process (adjust the name to start more than one TM)
docker run -d --name flink-taskmanager-1 \
  --link flink-jobmanager:jobmanager \
  -e JOB_MANAGER_RPC_ADDRESS=jobmanager flink:1.7 taskmanager
```

以上命令通过JOB_MANAGER_RPC_ADDRESS环境变量设置JobManager地址，通过`-p 8081:8081`参数将master容器8081端口映射到宿主机的8081端口，这样宿主机可以访问Flink Web UI来上传应用JAR包并执行应用，也可以通过`${FLINK_HOME}/bin/flink`命令提交管理应用。

除了手动的启动多个容器来部署Flink集群，也可以创建Docker Compose配置文件来自动配置和启动Flink集群，但需要注意指定网络配置，详见Flink文档。
