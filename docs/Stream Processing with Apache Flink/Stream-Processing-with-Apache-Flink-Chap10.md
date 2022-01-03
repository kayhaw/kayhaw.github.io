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
