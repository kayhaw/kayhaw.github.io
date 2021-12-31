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

### Kubernetes

Kubernetes(K8S)是用于自动部署、缩放及管理容器化应用的平台，先介绍几个K8S术语：

- **pod**：Process Domain的缩写，表示K8S管理的容器
- **deployment**：指定特定数量pod的配置，K8S确保所有pod保持运行并自动重启失败pod，deployment可以扩大或缩小pod数量
- **service**：定义一组pod的访问策略，维护pod路由

:::tip 小贴士
可以使用Minikube代替K8S，但部署Flink时需要运行命令`minikube ssh 'sudo ip link set docker0 promisc on'`
:::

使用K8S部署Flink需要两个deployment，分别用于运行master进程和worker进程。其中master deployment配置如下所示：

```yaml title="master-deployment.yaml"
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: flink-master
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: flink
        component: master
    spec:
      containers:
      - name: master
        image: flink:1.7
        args:
        - jobmanager
        ports:
        - containerPort: 6123
          name: rpc
        - containerPort: 6124
          name: blob
        - containerPort: 6125
          name: query
        - containerPort: 8081
          name: ui
        env:
        - name: JOB_MANAGER_RPC_ADDRESS
          value: flink-master
```

该deployment指定运行一个master容器(`replicas: 1`)，运行Flink镜像版本为1.7(`image: flink:1.7`)，通过参数启动master进程(`args: - jobmanager`)，并且配置了4个端口分别用于RPC通信、BLOB管理(交换大文件)、状态查询服务、Web UI REST接口。而worker pod配置如下：

```yaml title="worker-deployment.yaml"
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: flink-worker
spec:
  replicas: 2
  template:
    metadata:
      labels:
        app: flink
        component: worker
    spec:
      containers:
      - name: worker
        image: flink:1.7
        args:
        - taskmanager
        ports:
        - containerPort: 6121
          name: data
        - containerPort: 6122
          name: rpc
        - containerPort: 6125
          name: query
        env:
        - name: JOB_MANAGER_RPC_ADDRESS
          value: flink-master
```

参数基本和master类似，只不过部署2个副本，镜像相同但是启动参数不同，并且设置master deployment的service名称，该service配置如下：

```yaml title="master-service.yaml"
apiVersion: v1
kind: Service
metadata:
  name: flink-master
spec:
  ports:
  - name: rpc
    port: 6123
  - name: blob
    port: 6124
  - name: query
    port: 6125
  - name: ui
    port: 8081
  selector:
    app: flink
    component: master
```

将如上配置分别保存为master-deployment.yaml、worker-deployment.yaml和master-service.yaml文件，通过如下命令注册到K8S容器：

```bash
kubectl create -f master-deployment.yaml
kubectl create -f worker-deployment.yaml
kubectl create -f master-service.yaml
```

通过`kubectl get deployments`命令获取所有deployment状态。由于上述配置并没有对外暴露任何端口，需要通过`kubectl port-forward deployment/flink-master 8081:8081`命令开启端口转发，然后通过[http://localhost:8081](http://localhost:8081)访问Flink Web UI。

由于K8S会自动重启故障的worker pod，再配合检查点就可以实现应用故障恢复。而当master pod发生故障，需要配置高可用(见下一小节)来恢复。通过如下命令关闭Flink集群：

```bash
kubectl delete -f master-deployment.yaml
kubectl delete -f worker-deployment.yaml
kubectl delete -f master-service.yaml
```

:::caution 注意
通过官方提供的Flink Docker镜像来定制Flink部署配置是不可行的，需要自定义build脚本来创建所需的Flink Docker镜像。
:::

## 高可用设置

大多数流应用在理想情况下一直执行，因此需要能自动地从故障中恢复。Worker故障由ResourceManager处理，而JobManager故障需要配置高可用(Highly Available, HA)。

JobManager持有应用的元数据，如应用JAR包、JobGraph、保存检查点的指针等，这些信息需要从master故障中恢复。Flink的HA模式依赖于Apache ZooKeeper和持久化存储服务(HDFS、NFS、或S3等)，详见[高可用配置](xxx)。为了方便用户调试，Flink提供`${FLINK_HOME}/bin/start-zookeeper-quorum.sh`脚本快速启动ZooKeeper集群，前提是在`${FLINK_HOME}/conf/zoo.cfg`中配置好ZooKeeper的地址和端口号。

:::caution 注意
别直接在生产环境中使用Flink提供的ZooKeeper脚本，而是另外维护一个ZooKeeper集群。
:::

在`${FLINK_HOME}/conf/flink-conf.yaml`通过如下参数配置高可用模式：

```yaml
# 必填项，使用ZooKeeper开启高可用模式
high-availability: zookeeper

# 必填项，ZooKeeper仲裁server地址列表
high-availability.zookeeper.quorum: address1:2181[,...],addressX:2181

# 必填项，元数据存放路径
high-availability.storageDir: hdfs:///flink/recovery

# 推荐项，ZooKeeper中Flink集群基础路径，将Flink和其他使用ZooKeeper的框架隔离
high-availability.zookeeper.path.root: /flink
```
