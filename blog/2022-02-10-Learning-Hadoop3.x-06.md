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

回到DFSOutputStream.java的276行，在添加完文件元信息后，在313行创建文件输出流DFSOutputStream对象out，该类的构造方法调用了如下computePacketChunkSize方法来计算Packet包含的chunk数量和packet的大小：

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

默认Packet大小为64KB，chunk大小为512Byte，chunksum大小为4Byte。创建完out对象后，接着调用其start方法：DataStreamer.start()->DataStreamer.run()->dataQueue.wait()。其中dataQueue是`LinkedList<DFSPacket>`类型对象，调用wait方法阻塞队列直到有packet入队。

第二部分：写数据。第一步是写packet，以FSDataOutputStream.write方法为入口：FilterOutputStream.write->FSOutputSummer.write->FSOutputSummer.flushBuffer->FSOutputSummer.writeChecksumChunks->DFSOutputStream.writeChunk->DFSOutputStream.enqueueCurrentPacketFull->DFSOutputStream.enqueueCurrentPacket->DataStreamer.waitAndQueuePacket，第一次写数据队列为空，因此接下来调用queuePacket方法，代码如下所有，它将packet添加在队列末尾，然后调用notifyAll唤醒所有阻塞线程。

```java
void queuePacket(DFSPacket packet) {
  synchronized (dataQueue) {
    if (packet == null) return;
    packet.addTraceParent(Tracer.getCurrentSpanId());
    dataQueue.addLast(packet);
    lastQueuedSeqno = packet.getSeqno();
    LOG.debug("Queued {}, {}", packet, this);
    dataQueue.notifyAll();
  }
}
```

第二步，建立数据传输管理pipeline。回到DataStreamer的run方法，以setPipeline方法为入口：DataStreamer.nextBlockOutputStream->DataStreamer.locateFollowingBlock->DFSOutputStream.addBlock->dfsClient.namenode.addBlock(NameNodeRpcServer.addBlock)->FSNamesystem.getAdditionalBlock->FSDirWriteFileOp.chooseTargetForNewBlock->BlockManager.chooseTarget4NewBlock->BlockPlacementPolicyDefault.chooseTarget->BlockPlacementPolicyDefault.chooseTargetInOrder->

```java
protected Node chooseTargetInOrder(int numOfReplicas, 
                                 Node writer,
                                 final Set<Node> excludedNodes,
                                 final long blocksize,
                                 final int maxNodesPerRack,
                                 final List<DatanodeStorageInfo> results,
                                 final boolean avoidStaleNodes,
                                 final boolean newBlock,
                                 EnumMap<StorageType, Integer> storageTypes)
                                 throws NotEnoughReplicasException {
  final int numOfResults = results.size();
  if (numOfResults == 0) {
    DatanodeStorageInfo storageInfo = chooseLocalStorage(writer,
        excludedNodes, blocksize, maxNodesPerRack, results, avoidStaleNodes,
        storageTypes, true);

    writer = (storageInfo != null) ? storageInfo.getDatanodeDescriptor()
                                    : null;

    if (--numOfReplicas == 0) {
      return writer;
    }
  }
  final DatanodeDescriptor dn0 = results.get(0).getDatanodeDescriptor();
  if (numOfResults <= 1) {
    chooseRemoteRack(1, dn0, excludedNodes, blocksize, maxNodesPerRack,
        results, avoidStaleNodes, storageTypes);
    if (--numOfReplicas == 0) {
      return writer;
    }
  }
  if (numOfResults <= 2) {
    final DatanodeDescriptor dn1 = results.get(1).getDatanodeDescriptor();
    if (clusterMap.isOnSameRack(dn0, dn1)) {
      chooseRemoteRack(1, dn0, excludedNodes, blocksize, maxNodesPerRack,
          results, avoidStaleNodes, storageTypes);
    } else if (newBlock){
      chooseLocalRack(dn1, excludedNodes, blocksize, maxNodesPerRack,
          results, avoidStaleNodes, storageTypes);
    } else {
      chooseLocalRack(writer, excludedNodes, blocksize, maxNodesPerRack,
          results, avoidStaleNodes, storageTypes);
    }
    if (--numOfReplicas == 0) {
      return writer;
    }
  }
  chooseRandom(numOfReplicas, NodeBase.ROOT, excludedNodes, blocksize,
      maxNodesPerRack, results, avoidStaleNodes, storageTypes);
  return writer;
}
```

回到DataStreamer.nextBlockOutputStream方法，在调用locateFollowingBlock后得到上传节点的位置信息后，接着以createBlockOutputStream方法为入口：new Sender(out).writeBlock->Sender.send(out, Op.WRITE_BLOCK, proto.build()发送数据。对应地，DataXceiverServer的run方法执行DataXceiver的run方法，根据发送端的op类型调用processOp进行处理。由于发送端op类型为WRITE_BLOCK，调用Receiver.opWriteBlock(DataInputStream in)方法，继而调用DataXceiver.writeBlock方法：首先通过setCurrentBlockReceiver写块文件，然后判断目标节点个数是否大于0，是的话又用new Sender(mirrorOut).writeBlock写数据（触发写下一个节点的链式调用）。

回到DataStreamer的run方法，在717行调用setPipeline后，接着调用initDataStreaming方法，通过ResponseProcessor线程对象处理写成功响应。

```java title="ResponseProcessor.run(), Line 1179-1183"
lastAckedSeqno = seqno;
pipelineRecoveryCount = 0;
ackQueue.removeFirst();
packetSendTime.remove(seqno);
dataQueue.notifyAll();
```

在发送packet后，不会将该packet删除而是添加到ackQueue中，代码如下所示：

```java title="DataStreamer.run(), Line 753-767"
synchronized (dataQueue) {
  // move packet from dataQueue to ackQueue
  if (!one.isHeartbeatPacket()) {
    if (scope != null) {
      spanId = scope.getSpanId();
      scope.detach();
      one.setTraceScope(scope);
    }
    scope = null;
    dataQueue.removeFirst();
    ackQueue.addLast(one);
    packetSendTime.put(one.getSeqno(), Time.monotonicNow());
    dataQueue.notifyAll();
  }
}
```
