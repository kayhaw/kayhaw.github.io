---
title: Hadoop 3.x学习笔记(6)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hadoop
  - BigData
description: Hadoop 3.1.3学习笔记(6)
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第6篇：源码分析。
<!--truncate-->

## NameNode启动源码分析

分析NameNode.java(在hadoop-hdfs.jar包下)，主要有以下流程：启动Web服务、加载镜像文件和编辑日志、初始化RPC服务器、启动资源检查、心跳检测和安全模式。

### 启动Web服务

从NameNode.java的main() -> createNameNode -> NameNode构造方法 -> initialize -> **startHttpServer**方法启动NameNode服务。

```java 
private void startHttpServer(final Configuration conf) throws IOException {
    httpServer = new NameNodeHttpServer(conf, this, getHttpServerBindAddress(conf));
    httpServer.start();
    httpServer.setStartupProgress(startupProgress);
}

protected InetSocketAddress getHttpServerBindAddress(Configuration conf) {
    InetSocketAddress bindAddress = getHttpServerAddress(conf);

    // If DFS_NAMENODE_HTTP_BIND_HOST_KEY exists then it overrides the
    // host name portion of DFS_NAMENODE_HTTP_ADDRESS_KEY.
    final String bindHost = conf.getTrimmed(DFS_NAMENODE_HTTP_BIND_HOST_KEY);
    if (bindHost != null && !bindHost.isEmpty()) {
      bindAddress = new InetSocketAddress(bindHost, bindAddress.getPort());
    }

    return bindAddress;
}
```

其中getHttpServerBindAddress从conf获取`dfs.namenode.http-address`来设置服务的地址和端口号，若没有设置则默认为`0.0.0.0:9870`；接着判断是否配置`dfs.namenode.http-bind-host`，若有设置则用其作为服务地址。

### 加载镜像文件和编辑文件

NameNode.java的loadNameSystem方法，又调用FSNamesystem.loadFromDisk方法，注意加载传入镜像文件和编辑文件两个地址。

```java
static FSNamesystem loadFromDisk(Configuration conf) throws IOException {
    checkConfiguration(conf);
    FSImage fsImage = new FSImage(conf,
        FSNamesystem.getNamespaceDirs(conf),
        FSNamesystem.getNamespaceEditsDirs(conf));
    ...
}
```

### 创建RPC服务

initialize方法调用createRpcServer方法，创建一个NameNodeRpcServer对象，其构造方法包含如下代码来创建Rpc服务器。

```java
lifelineRpcServer = new RPC.Builder(conf)
    .setProtocol(HAServiceProtocolPB.class)
    .setInstance(haPbService)
    .setBindAddress(bindHost)
    .setPort(lifelineRpcAddr.getPort())
    .setNumHandlers(lifelineHandlerCount)
    .setVerbose(false)
    .setSecretManager(namesystem.getDelegationTokenSecretManager())
    .build();
```

### 资源检测

initialize方法调用startCommonServices方法，调用FSNamesystem的startCommonServices方法，该方法包含操作：

1. 创建NameNodeResourceChecker对象，检查元数据存储空间是否剩余100MB可用
2. checkAvailableResources->hasAvailableDiskSpace->areResourcesAvailable->isResourceAvailable，检查资源是否剩余100MB空间

### 心跳检测

startCommonServices通过blockManager.activate->datanodeManager.activate(conf)->heartbeatManager.activate()->heartbeatThread.start()->Monitor.run()->heartbeatCheck()->isDatanodeDead()，判断节点是否挂掉的心跳时长$heartbeatExpireInterval=2*heartbeatRecheckInterval+10*1000*heartbeatIntervalSeconds$，其中$heartbeatRecheckInterval$默认为5分钟，$heartbeatIntervalSeconds$默认为3，即判断节点是否挂掉的心跳时长默认为10分钟加30秒。

### 安全模式开启

FSNamesystem的startCommonServices方法调用blockManager.activate->bmSafeMode.activate(blockTotal)，代码如下所示，调用setBlockTotal方法设置所有块的总数和安全阈值，调用areThresholdsMet判断是否满足可用阈值，相应的设置是否进入安全模式。

```java
void activate(long total) {
  assert namesystem.hasWriteLock();
  assert status == BMSafeModeStatus.OFF;

  startTime = monotonicNow();
  setBlockTotal(total);
  if (areThresholdsMet()) {
    boolean exitResult = leaveSafeMode(false);
    Preconditions.checkState(exitResult, "Failed to leave safe mode.");
  } else {
    // enter safe mode
    status = BMSafeModeStatus.PENDING_THRESHOLD;
    initializeReplQueuesIfNecessary();
    reportStatus("STATE* Safe mode ON.", true);
    lastStatusReport = monotonicNow();
  }
}
```

## DataNode启动源码分析

DataNode启动后，首先向NameNode注册自己，然后定期(6小时)向NN上报所有块信息，每隔3秒向NN发送心跳，如果NN超过10分30秒没有收到DataNode心跳则认为该节点不可用。启动流程如下：

### 初始化DataXceiverServer

以DataNode.java的main方法为入口：secureMain->createDataNode->instantiateDataNode->makeInstance->new DataNode->startDataNode->initDataXceiver，调用`this.dataXceiverServer = new Daemon(threadGroup, xserver);`开启服务线程。

### 初始化HTTP服务

startDataNode方法调用startInfoServer为入口：new DatanodeHttpServer->new HttpServer2，然后开启http服务，提供访问DataNode信息的endpoint。

### 初始化Rpc服务

startDataNode方法调用initIpcServer为入口，创建RPC对象。

### 向NameNode注册

startDataNode方法调用BlockPoolManager.refreshNamenodes方法为入口：doRefreshNamenodes->createBPOS->new BPOfferService->new BPServiceActor，有多少个NameNode就添加多少个BPServiceActor，在调用createBPOS后，调用startAll方法进入注册：bpos.start()->actor.start()->BPServiceActor.run()->connectToNNAndHandshake()->db.connectToNN()->new DatanodeProtocolClientSideTranslatorPB()->createNamenode()->RPC.getProxy()，最终得到代理对象。然后开始注册DataNode信息：register()->bpNamenode.registerDatanode(newBpRegistration)->rpcProxy.registerDatanode()，通过rpc调用**NameNode**的registerDatanode方法。

### 发送心跳

回到BPServiceActor.run()方法，调用offerService为入口：sendHeartBeat->bpNamenode.sendHeartbeat->NameNodeRpcServer.sendHeartbeat->namesystem.handleHeartbeat->blockManager.getDatanodeManager().handleHeartbeat->heartbeatManager.updateHeartbeat->blockManager.updateHeartbeat->node.updateHeartbeat->updateHeartbeatState，由NameNode返回一个HeartbeatResponse对象作为心跳响应。

```java
void updateHeartbeatState(StorageReport[] reports, long cacheCapacity,
    long cacheUsed, int xceiverCount, int volFailures,
    VolumeFailureSummary volumeFailureSummary) {
  updateStorageStats(reports, cacheCapacity, cacheUsed, xceiverCount,
      volFailures, volumeFailureSummary);
  setLastUpdate(Time.now());
  setLastUpdateMonotonic(Time.monotonicNow());
  rollBlocksScheduled(getLastUpdateMonotonic());
}
```

## HDFS文件上传源码分析

第一部分：新增文件元信息。以FileSystem.create(Path path, boolean overwrite)方法为入口，调用抽象方法create->DistributedFileSystem.create()->dfs.create->DFSOutputStream.newStreamForCreate->dfsClient.namenode.create(调用客户端的Rpc创建方法)->namesystem.startFile()[NameNodeRpcServer.java, Line 791]->startFileInt(FSNamesystem.java, Line 2375)->FSDirWriteFileOp.startFile->FSDirWriteFileOp.addFile->fsd.addINode(Line 568)，最后通过addINode方法将路径添加到文件系统元信息中。

```java
public void testPut2() throws IOException {
    FSDataOutputStream fos = fs.create(new Path("/input2"));
    fos.write("hello world".getBytes());
}
```

回到DFSOutputStream.java的276行，在添加完文件元信息后，在313行创建文件输出流DFSOutputStream对象，该类的构造方法调用了如下computePacketChunkSize方法来计算Packet包含的chunk数量和packet的大小：

```java
protected void computePacketChunkSize(int psize, int csize) {
  final int bodySize = psize - PacketHeader.PKT_MAX_HEADER_LEN;
  final int chunkSize = csize + getChecksumSize();
  chunksPerPacket = Math.max(bodySize/chunkSize, 1);
  packetSize = chunkSize*chunksPerPacket;
  DFSClient.LOG.debug("computePacketChunkSize: src={}, chunkSize={}, "
          + "chunksPerPacket={}, packetSize={}",
      src, chunkSize, chunksPerPacket, packetSize);
}
```

默认Packet大小为64KB，chunk大小为512Byte，chunksum大小为4Byte。
