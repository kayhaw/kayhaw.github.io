---
layout: article
title: 部署Flink环境
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

### Apache Hadoop YARN

YARN是Apache Hadoop体系的资源管理组件，它以容器的形式分配资源运行应用。Flink在YARN上以2种模式运行：job模式和session模式。

Job模式下Flink作业执行流程如下图所示。YARN启动一个Flink集群来运行一个作业，当作业终止后，YARN会停止Flink集群并回收所有资源。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap09/Starting-a-Flink-Cluster-on-YARN-in-Job-Mode.png" title="Starting a Flink Cluster on YARN in Job Mode" />

Session模式则会启动一个长期运行的Flink集群，该集群可以运行多个作业且需要手动停止。下图所示为空闲时的Flink Session模式：

<img style={{width:"50%", height:"50%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap09/Starting-a-Flink-Cluster-on-YARN-in-Session-Mode.png" title="Starting a Flink Cluster on YARN in Session Mode" />

如下图所示为Session模式下Flink作业执行流程。当slot数量不足时，Flink的ResourceManager向YARN ResourceManager请求分配容器资源来启动TaskManager。

<img style={{width:"80%", height:"80%"}} src="/img/doc/Stream-Processing-with-Apache-Flink/chap09/Submitting-a-Job-to-a-Flink-YARN-Session-Cluster.png" title="Submitting a Job to a Flink YARN Session Cluster" />

无论是Job模式还是Session模式，运行失败的TaskManager都会被ResourceManager重启，而恢复master进程失败需要[配置高可用](Chap03/#高可用设置)。另外，需要[配置Hadoop依赖](#集成hadoop组件)。

当配置好YARN和HDFS后，使用命令以job模式运行作业：

```bash
./bin/flink run -m yarn-cluster ./path/to/job.jar
```

以session模式运行作业，首先要执行`./bin/yarn-session.sh`命令开启Flink YARN session，然后通过`./bin/flink run ./path/to/job.jar`运行作业。注意此时不需要提供连接信息，因为Flink记住了在YARN上运行的Flink会话的连接详情。

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

JobManager持有应用的元数据，如应用JAR包、JobGraph、保存检查点的指针等，这些信息需要从master故障中恢复。Flink的HA模式依赖于Apache ZooKeeper和持久化存储服务(HDFS、NFS、或S3等)，详见[高可用配置](Chap03/#高可用设置)。为了方便用户调试，Flink提供`${FLINK_HOME}/bin/start-zookeeper-quorum.sh`脚本快速启动ZooKeeper集群，前提是在`${FLINK_HOME}/conf/zoo.cfg`中配置好ZooKeeper的地址和端口号。

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

### 高可用Standalone模式设置

Standalone模式不依赖资源提供方如YARN或者K8S，所有进程都是手动开启且没有监控、重启它们的组件，因此Flink standalone集群需要备用的Dispatcher和TaskManager进程来接管失败进程。

除了启动备用TaskManager外，standalone部署不需要其他额外配置来让TaskManager从故障中恢复。所有启动的TaskManager登记到ResourceManager，通过备用TaskManager弥补故障TaskManager来恢复应用。

当配置高可用后，所有Dispatcher登记到ZooKeeper并且由ZooKeeper选举leader Dispatcher来运行应用。当master进程发生故障，由ZooKeeper重新选举新的leader Dispatcher进行故障恢复。

除了之前提到的配置外，开启高可用standalone模式配置需要在`${FLINK_HOME}/conf/flink-conf.yaml`中设置如下参数：

```yaml
# 推荐项，设置ZooKeeper中Flink集群的路径，区分不同的Flink集群
# 如果多个Flink集群使用同一个ZooKeeper实例时必须设置
high-availability.cluster-id: /cluster-1
```

接着在`${FLINK_HOME}/conf/master`文件中添加主机和端口，然后使用`start.sh`脚本启动高可用standalone集群。

### 高可用YARN设置

YARN是一种集群资源和容器的管理器，默认重启失败的容器，因此不需要运行备用的进程来实现高可用。Flink的master进程作为YARN ApplicationMater启动，YARN自动重启失败的ApplicationMater但但需要配置重启的最大次数来防止无限重启，这通过修改`yarn-site.xml`文件实现：

```xml
<property>
  <name>yarn.resourcemanager.am.max-attempts</name>
  <value>4</value>
  <description>
    The maximum number of application master execution attempts.
    Default value is 2, i.e., an application is restarted at most once.
  </description>
</property>
```

此外，还需要修改flink-conf.yaml中应用重启次数参数，该参数必须小于等于yarn-site.xml配置的重启次数，如下所示：

```yaml
# 重启应用最多3次(包含初始化启动1次)
yarn.application-attempts: 4
```

YARN只统计由于应用失败导致的重启次数，其他情况如抢占、硬件故障或者主机重启导致都不会计算到重启次数中。当使用YARN 2.6+版本，Flink还会自动配置一个有效尝试间隔参数：只有在间隔时间内达到重启次数才会完全取消应用。Flink将间隔参数设置为和conf.yaml文件中的akka.ask.timeout参数相同，默认10s。

在配置好YARN和Flink后，执行`${FLINK_HOME}/bin/flink run -m yarn-cluster`命令以job模式启动Flink集群，或者通过`${FLINK_HOME}/bin/yarn-session.sh`以session模式启动Flink集群。**当以session模式启动Flink集群，需要为每个集群指定不同的id，而job模式下集群id自动设置为应用id，因此不会重复。**

### 高可用K8S设置

在按照[Kubernetes](#kubernetes)一节部署运行Flink集群后，K8S会自动重启故障容器，这足以处理worker故障恢复，而处理master故障需要额外配置。正如之前提到的，需要修改Flink一些配置信息，比如ZooKeeper节点地址，持久化存储路径和集群id。并且官方提供的Flink镜像不能自定义配置，需要自己构建镜像。

## 集成Hadoop组件

Flink可以轻松地集成Hadoop组件如YARN、HDFS以及Hadoop生态组件如HBase，此时Flink需要其类路径上存在这些Hadoop依赖，有3种方式可以为Flink提供Hadoop依赖：

1. 使用Flink官方为特定版本Hadoop构建的二进制发行版
2. 自行为特定版本Hadoop构建Flink

可能官方提供的发行版不能适配当前部署的Hadoop时，比如Hadoop版本不一致，或者当前使用其他发行商版本的Hadoop(例如Cloudera的CDH)。此时需要下载源码自行编译Flink自行编译，然后进入源码目录执行如下命令之一：

```bash
// 为特定版本的Apache Hadoop构建Flink
mvn clean install -DskipTests -Dhadoop.version=2.6.1

// 为特定版本的其他发行商Hadoop构建Flink
mvn clean install -DskipTests -Pvendor-repos -Dhadoop.version=2.6.1-cdh5.0.0
```

构建好的二进制文件在`build-target`目录下。

3. 使用Hadoop无关的Flink发行版，然后手动配置`HADOOP_CLASSPATH`环境变量，比如``export HADOOP_CLASSPATH=`hadoop classpath` ``

处理配置Hadoop依赖路径外，**还需要提供Hadoop配置文件路径**，通过`HADOOP_CONF_DIR`(:heart:优先)或者`HADOOP_CONF_PATH`环境变量指定，这样Flink可以连接到YARN和HDFS服务。

## 文件系统设置

Flink在许多情况下都用到文件系统：比如文件系统source连接器、应用检查点保存、分发应用JAR包等。由于其分布式特性，Flink也要求文件系统能够全局访问，常用的有HDFS、S3和NFS。Flink使用`org.apache.flink.core.fs.FileSystem`类表示文件系统，它提供通用的文件操作：读写文件、创建文件夹、列出文件夹内容列表等。每个JobManager或TaskManger实例化一个FileSystem对象然后共享给本地所有任务，以此确保约束配置(如对打开连接数量的限制)生效。

Flink提供了如下常用文件系统的实现：

1. **本地文件系统**：Flink内置支持本地文件系统，包括本地挂载的网络文件系统(NFS或SAN等)，不需要额外配置，访问路径格式为`file://<URI>`；
2. **Hadoop HDFS**：需要配置Hadoop依赖，见上一小节，访问路径格式为`hdfs://<URI>`;
3. **Amazon S3**：Flink基于Apache Hadoop和Presto实现了2种访问S3的连接器，需要将位于opt文件夹下的`flink-s3-fs-hadoop-${version}.jar`和`flink-s3-fs-presto-${version}.jar`移到lib文件夹中，访问格式为`s3://<URI>`；
4. **OpenStack Swift FS**：Flink基于Apache Hadoop实现Swift FS连接器，需要将opt文件夹下的`flink-swift-fs-hadoop-${version}.jar`移到lib文件夹中，访问格式为`swift://<URI>`。

对于其他未列出的文件系统，通过正确配置，Flink可以委托HDFS连接器来访问，这也是为什么Flink能支持所有HCFS(Hadoop-compatible file systems)。在conf.yaml中可配置的文件系统相关参数如下表所示：

| 参数名                             | 默认值     | 说明                                               |
| --------------------------------   | -------   | -------------------------------------------------- |
| `fs.default-scheme`                | `file://` | 默认文件系统前缀                                     |
| `fs.<scheme>.limit.total`          | 无        | 特定scheme文件系统的连接总数限制，0或-1表示无限制      |
| `fs.<scheme>.limit.input`          | 无        | 特定scheme文件系统的读连接数限制，0或-1表示无限制      |
| `fs.<scheme>.limit.output`         | 无        | 特定scheme文件系统的写连接数限制，0或-1表示无限制      |
| `fs.<scheme>.limit.timeout`        | 无        | 特定scheme文件系统的连接超时限制，单位毫秒，0表示无限制 |
| `fs.<scheme>.limit.stream-timeout` | 无        | 特定scheme文件系统的限制时间限制，单位毫秒，0表示无限制 |

自定义文件系统实现详见官方文档[Adding a new pluggable File System implementation](https://nightlies.apache.org/flink/flink-docs-stable/docs/deployment/filesystems/overview/#adding-a-new-pluggable-file-system-implementation)。

## 系统配置

Flink提供了许多参数来配置行为和调整性能，所有参数在`${FLINK_HOME}/conf/flink-conf.yaml`中以键值对的形式设置。该配置文件会被不同组件使用，比如集群启动脚本`/bin/start-cluster.sh`会读取JVM参数配置，CLI客户端`/bin/flink`会读取连接到master进程的连接信息，**修改配置文件需要重启Flink集群**。

为了让Flink开箱即用，flink-conf.yaml文件预配置为本地启动Flink，在分布式环境下需要调整配置。本节介绍搭建Flink集群需要的配置，更多配置见[官方文档](https://nightlies.apache.org/flink/flink-docs-stable/docs/deployment/config/)。

### Java环境和类加载

Flink默认从`PATH`环境变量中找到java程序来启动进程，如果`PATH`环境变量中不存在Java或者想要换个Java版本，可以通过`JAVA_HOME`环境变量或者flink-conf.yaml中的`env.java.home`参数指定。除此之外，可以通过`env.java.opts`、`env.java.opts.jobmanager`以及`env.java.opts.taskmanager`设置启动进程的JVM参数。

当运行带有外部依赖的作业时，类加载问题并不少见。Flink将每个作业的依赖类登记到分隔的用户加载器中，确保作业之间的依赖互不影响，也不影响Flink运行时，当作业结束后用户加载器也会被销毁。Flink系统加载器从`${FLINK_HOME}/lib`文件夹中加载所有JAR包，而用户类加载器派生自系统加载器。

Flink加载类顺序由参数`classloader.resolve-order`指定，默认为`child-first` ，即Flink先通过用户类加载器解析依赖类然后通过系统加载器解析，避免应用使用和Flink相同的依赖但是版本不同的冲突。将该参数设置为`parent-first`，则顺序相反。

:::caution 注意
由`classloader.parent-first-patterns.default`指定的类总是由系统类加载器解析，通过`classloader.parent-first-patterns.additional`来添加更多这样的类
:::

### CPU

Flink并不会主动限制其CPU资源使用，但会通过slot来控制任务数量。每个槽可以执行应用算子的一个并行任务，因此一个应用所需要的slot数量至少等于其所有算子的最大并行度。任务在TaskManager进程内以线程形式执行，并且尽量占用其所获得的资源。

通过参数`taskmanager.numberOfTaskSlots`设置每个TaskManager提供的slot数量，默认为1。**slot数量通常只需要在standalone模式下配置，在集群资源管理器上运行Flink时可以启动很容易地在每个节点上穹顶多个TaskManager(slot数量为1)。**

### 内存和网络缓冲

Flink的master和worker进程有着不同的内存需求，前者管理计算资源并协调应用执行，而后者处理潜在的大量数据。因此，master进程的内存消耗处于中等，通过`jobmanager.heap.size`配置其堆内存(默认1GB)。

Worker进程的内存设置更加复杂，最重要的堆大小通过`taskmanager.heap.size`参数设置。使用堆的对象包括TaskManager运行时、算子和函数以及传输的数据。注意一个task可能就耗光整个JVM堆内存，如果应用依赖许多包也会造成非堆内存的显著消耗。

除了JVM外，Flink的网络栈也是内存消耗大户。Flink的网络栈基于Netty，它使用本地内存作为网络缓冲区。缓冲区的数量依赖于算子任务的连接方式和并发度，当缓冲区数量不够时作业提交后会抛出`java.io.IOException: Insufficient number of network buffers`异常。通过参数`taskmanager.network.memory.segment-size`指定网络缓冲区大小。

:::caution 注意
原书提到的`taskmanager.network.memory.fraction`、`taskmanager.network.memory.min`和`taskmanager.network.memory.max`参数已经删除，详见[Full TaskManagerOptions](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/deployment/config/#full-taskmanageroptions)
:::

当使用RocksDB作为状态后端时，**Flink会为每个task的键控算子创建一个单独的RocksDB实例**，默认配置下每个column族会消耗200MB到240MB的堆外内存，可以通过RocksDB的配置调整性能。

当配置TaskManager的内存时，需要调整堆内存大小以便留有充足的堆外内存。**注意，一些资源管理器(如YARN)会在容器超出内存分配时立即终止容器。**

### 磁盘存储

Flink worker进程在很多情况下使用本地文件系统存储数据，比如接收应用JAR包、写日志、状态维护等，相关的文件路径参数如下表所示：

| 参数                             | 默认值                    | 说明                                                               |
| -------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `io.tmp.dirs`                    | `java.io.tmpdir`系统变量  | 在Linux和MacOS系统上默认为`/tmp`，该目录会被定时清理，建议重新社会     |
| `env.log.dir`                    | `${FLINK_HOME}/log`      | TaskManager存储日志路径                                             |
| `blob.storage.directory`         | 无                       | Blob server存储路径，用于交换大文件                                  |
| `state.backend.rocksdb.localdir` | `io.tmp.dirs`            | RocksDB存储状态路径                                                 |

### 检查点和状态后端

所有检查点和状态后端的配置都可以通过代码执行，详见[调整检查点和故障恢复](Chap10/#调整检查点和故障恢复)，在配置文件中可设置的相关参数如下表所示：

| 参数                                | 默认值               | 说明                                                                               |
| ----------------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `state.backend`                     | 无                  | 状态后端类型，可选jobmanager，filesystem，rocksdb或者CheckpointStorageFactory工厂类名 |
| `state.backend.async`               | `${FLINK_HOME}/log` | TaskManager存储日志路径                                                             |
| `state.backend.incremental`         | false               | 是否开启增量检查点，不支持增量检查点的状态后端会忽略该配置                              |
| `state.checkpoints.dir`             | 无                  | 检查点数据保存目录                                                                   |
| `state.savepoints.dir`              | 无                  | 保存点数据保存目录                                                                   |
| `state.backend.local-recovery`      | false               | 是否开启本地状态恢复，本地恢复目前只覆盖键控状态后端                                    |
| `taskmanager.state.local.root-dirs` | 无                  | 本地状态副本文件保存目录，用于本地状态恢复                                             |

### 安全

在安全方面，Flink支持Kerberos认证以及通过SSL加密所有网络通信。Flink将Kerberos认证集成到Hadoop及其生态组件，如YARN、HDFS、HBase等，并支持2种认证模式：keytabs和Hadoop授权token。推荐使用keytabs，因为token有时效会导致作业运行失败。**注意证书是和Flink集群绑定而不是某个运行作业**，想要使用不同的证书应该新开一个Flink集群，详见[Kerberos Authentication Setup and Configuration](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/deployment/security/security-kerberos/)。

Flink内部组件之间使用SSL互相认证通信，而Flink与外部系统的通信通过REST/HTTP端点实现，也可以用SSL加密对外通信，但推荐设置一个专门的代理服务。目前还不支持状态查询服务的加密和认证。默认SSL认证未开启，开启步骤详见[Configuring SSL ](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/deployment/security/security-ssl/#configuring-ssl)。

## 总结

1. Flink部署模式分为Standalone、K8S和YARN这3种；
2. Worker故障由Flink自行处理，但master故障恢复需要配置高可用；
3. 集成Hadoop组件有直接下载官方包、自行编译或者手动引入依赖3种方法；
4. 使用HDFS等文件系统需要将opt目录下对应jar包移到lib目录开启使用；
5. Flink详细的系统配置见[Configuration](https://nightlies.apache.org/flink/flink-docs-stable/docs/deployment/config/)。
