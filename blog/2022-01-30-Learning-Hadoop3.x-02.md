---
title: Hadoop 3.x学习笔记(2)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hadoop
  - BigData
description: Hadoop 3.1.3学习笔记(2)
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第2篇：HDFS。
<!--truncate-->

## HDFS简介

HDFS(Hadoop Distributed File System)是一个分布式文件存储系统，适用于一次写入，多次读出的场景。

优点:smile:：

1. 高容错性：数据多副本保存，某个副本丢失后能够自动恢复；
2. 适合处理大数据：大小规模支持TB甚至PB，数量规模支持百万级；
3. 构建成本低：可以在多个廉价机器上构建副本。

缺点:angry:：

1. 数据访问延迟高；
2. 无法高效对大量小文件进行存储：占用NameNode内存来存储文件目录和块信息，并且寻址时间超过读取时间，违反HDFS设计目标；
3. 不支持并发写入、随机修改：一个文件不能多线程同时写，仅支持数据追加，不支持随机修改。

### 组成架构

<img style={{width:"80%", height:"80%"}} src="/static/img/blog/HadoopNotes/hdfsarchitecture.png" title="Hadoop Architecture" />

- NameNode(NN)：管理HDFS命名空间，配置副本策略，管理数据块映射信息，处理客户端读写请求；
- DataNode：存储数据块，执行数据块读写操作；
- SecondaryNameNode：并非NN的热备，在NN挂掉时不能马上替换其功能，用于分担NN工作，比如定期合并Fsimage和Edits并推送给NN。在紧急情况下可辅助恢复NameNode；
- Client：切分文件、与NameNode交互获取文件位置信息、与DataNode交互读写数据、提供HDFS管理命令、提供HDFS增删改查命令。

### 块大小

HDFS文件在物理存储上是分块(Block)存储，通过参数`dfs.blocksize`指定，默认大小为128MB(Hadoop 2.x/3.x，Hadoop 1.x为64MB)。

当寻址时间为传输时间的1%时认为达到最佳状态(:question:)：如果块设置过小，增加寻址时间，如果块设置过大则从磁盘传输数据的时间大于寻址时间。因此，块大小设置取决于磁盘传输速率。

## HDFS Shell操作

两种命令格式：`hadoop fs [options] ...`和`hdfs dfs [options] ...`，通过`hadoop fs -help <选项名>`来查看命令用法。

### 上传文件

- `-moveFromLocal <local_file_path> <hadoop_file_path>`：从本地**剪切**文件到HDFS；
- `-copyFromLocal <local_file_path> <hadoop_file_path>`：从本地**复制**文件到HDFS；
- `-put <local_file_path> <hadoop_file_path>`：同copyFromLocal，推荐使用；
- `-appendToFile <local_file_path> <hadoop_file_path>`：追加文件内容到HDFS文件，本地文件不删除。

### 下载文件

- `-copyToLocal <hadoop_file_path> <local_file_path>`：从HDFS**拷贝**文件到本地；
- `-get <hadoop_file_path> <local_file_path>`：同`-copyToLocal`，推荐使用。

### HDFS文件系统操作

- `-ls`：显示目录信息；
- `-cat`：显示文件内容；
- `-chgrp`、`-chmod`、`-chown`：修改文件属性；
- `-mkdir`：创建目录；
- `-cp`：HDFS内文件拷贝；
- `-mv`：HDFS内文件移动；
- `-tail`：显示文件末尾1KB数据；
- `-rm`：删除文件，加上`-r`参数递归删除文件夹；
- `-du`：统计文件大小，如下所示，前者表示单个文件大小14，后者表示14*3个副本总大小；

```bash
[kayhaw@hadoop102 hadoop-3.1.3]$ hadoop fs -du -h /sanguo
14  42  /sanguo/shu.txt
7   21  /sanguo/weiguo.txt
6   18  /sanguo/wu.txt
```

- `-setrep`：设置文件副本数量，只是记录在NameNode的元数据中，实际副本数量依赖于DataNode数量。

## HDFS API操作

### Windows开发环境准备

从[cdarlint/winutils](https://github.com/cdarlint/winutils)处下载对应版本的依赖包hadoop-3.1.0/bin，配置环境变量%HADOOP_HOME%\bin。

### FileSystem Java API

调用HDFS API的模板代码如下所示：

```java
public void template() throws URISyntaxException, IOException, InterruptedException {
    // 1. 集群连接信息
    URI uri = new URI("hdfs://hadoop102:8020");
    // 2. 创建配置
    Configuration config = new Configuration();
    // 2.1 配置一些参数，优先级最高
    config.set("dfs.replication", "2");
    // 3. 获取客户端
    fs = FileSystem.get(uri, config, "kayhaw");
    // 4. 进行文件系统操作
    fs.xxx();
    // 5. 关闭资源
    fs.close();
}
```

其中，参数优先级按如下顺序优先级依次增高：

1. hadoop集群中hdfs-default.xml
2. hadoop集群中hdfs-site.xml
3. 程序resource目录下hdfs-site.xml
4. 代码中通过Configuration.set()方法设置

常用的API有：

1. 创建文件夹：`boolean mkdirs(Path f) throws IOException`；
2. 上传文件(重载版支持Path数组src进行多文件上传)：

```java
/**
   * The src file is on the local disk.  Add it to the filesystem at
   * the given dst name.
   * delSrc indicates if the source should be removed
   * @param delSrc whether to delete the src
   * @param overwrite whether to overwrite an existing file
   * @param src path
   * @param dst path
   * @throws IOException IO failure
   */
  public void copyFromLocalFile(boolean delSrc, boolean overwrite,
                                Path src, Path dst);
```

3. 下载文件：

```java
/**
   * The src file is under this filesystem, and the dst is on the local disk.
   * Copy it from the remote filesystem to the local dst name.
   * delSrc indicates if the src will be removed
   * or not. useRawLocalFileSystem indicates whether to use RawLocalFileSystem
   * as the local file system or not. RawLocalFileSystem is non checksumming,
   * So, It will not create any crc files at local.
   *
   * @param delSrc whether to delete the src
   * @param src path
   * @param dst path
   * @param useRawLocalFileSystem whether to use RawLocalFileSystem as local file system or not.
   *
   * @throws IOException for any IO error
   */
  public void copyToLocalFile(boolean delSrc, Path src, Path dst,
      boolean useRawLocalFileSystem) throws IOException;
```

4. 删除文件

```java
/** Delete a file.
*
* @param f 
* @param recursive 是否递归删除文件夹
* @return  true if delete is successful else false.
* @throws IOException IO failure
*/
public abstract boolean delete(Path f, boolean recursive) throws IOException;
```

5. 文件重命名(移动)

```java
public abstract boolean rename(Path src, Path dst) throws IOException;
```

6. 遍历文件夹获取文件信息：

```java
public void fileInfo() throws IOException {
    // 获取所有文件信息
    RemoteIterator<LocatedFileStatus> listFiles = fs.listFiles(new Path("/"), true);
    // 遍历文件
    while (listFiles.hasNext()) {
        LocatedFileStatus fileStatus = listFiles.next();
        System.out.println("=======" + fileStatus.getPath() + "=======");
        System.out.println(fileStatus.getPermission());
        System.out.println(fileStatus.getOwner());
        System.out.println(fileStatus.getGroup());
        System.out.println(fileStatus.getLen());
        System.out.println(fileStatus.getModificationTime());
        System.out.println(fileStatus.getReplication());
        System.out.println(fileStatus.getBlockSize());
        System.out.println(fileStatus.getPath().getName());

        // 获取块信息
        BlockLocation[] blockLocations = fileStatus.getBlockLocations();
        System.out.println(Arrays.toString(blockLocations));
    }
}
```

7. 判断是文件还是文件夹：

```java
public void isDirectory() throws IOException {
    // 单个文件查看状态
    FileStatus file = fs.getFileStatus(new Path("/test/heke"));
    System.out.println(file.isDirectory());

    // 文件夹列表查看状态
    FileStatus[] fileStatuses = fs.listStatus(new Path("/"));
    for (FileStatus fileStatus : fileStatuses) {
        if(fileStatus.isDirectory()) {
            System.out.println("目录：" + fileStatus.getPath().getName());
        } else {
            System.out.println("文件：" + fileStatus.getPath().getName());
        }
    }
}
```

## HDFS读写流程

### 写数据

1. 客户端向NameNode请求上传文件
2. NameNode检查路径是否存在、是否具有权限，响应可以上传文件
3. 客户端请求上传第一个block，由NameNode返回DataNode地址
4. NameNode返回dn1、dn2、dn3节点地址
5. 客户端向其中一个节点dn1请求建立block传送通道，由该节点向其他节点请求形成传输通道
6. dn1响应成功
7. 客户端以packet为单位(64KB)传输数据，每个packet由chunk组成(chunk:512B+chunksum:4B)

### 节点距离计算

NameNode将节点距离最近的DataNode返回给客户端，节点距离=两个节点到达最近的公共祖先的距离总和，由此得到：

1. 同一节点上的进程距离为0；
2. 同一机架上的不同节点距离为2；
3. 同一数据中心不同机架上的节点距离为4；
4. 不同数据中心的节点距离为6。

### 机架感知

NameNode返回[数据副本](https://hadoop.apache.org/docs/r3.1.3/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Data_Replication)的存放位置时，通常副本个数为3，按照如下顺序指定3个节点：首先客户端在DataNode上，指定一个节点为本地机器，否则随机选一个节点，然后在另一个机架A上选择一个节点a，最后在机架A上选择一个不同节点b。对应源码见BlockPlacementPolicyDefault类的chooseTargetInOrder方法。

### 读数据

1. 客户端通过DistributedFileSystem向NameNode请求下载文件，NameNode通过查
询元数据，找到文件块所在的DataNode地址；
2. 挑选一台DataNode(就近原则，然后随机)服务器，请求读取数据；
3. DataNode开始传输数据给客户端(从磁盘里面读取数据输入流，以Packet为单位来做校验)；
4. 客户端以Packet为单位接收，先在本地缓存，然后写入目标文件。

## NN和2NN

NameNode的元数据分为2部分：磁盘中的元数据备份fsimage和内存中的增量文件edits。但长时间地添加追剧到edits会导降低效率，因此由SeconaryNameNode专门合并fsimage和edits。Fsimage和Edits文件工作流程如下：

第一阶段，NameNode启动：

1. 如果NameNode第1次初始化则创建fsimage和edits文件，否则加载fsimage和edits到内存；
2. 客户端对元数据进行增删改的请求；
3. NameNode记录操作日志，更新滚动日志；
4. NameNode在内存中对元数据进行增删改。

第二阶段，Secondary NameNode工作：

1. 2NN询问NN是否需要checkpoint；
2. 2NN请求执行checkpoint；
3. NN滚动正在写的edits日志；
4. 将滚动前的edits和fsimage拷贝到2NN；
5. 2NN加载edits和fsimage到内存进行合并；
6. 2NN合并生成fsimage.checkpoint；
7. 2NN将fsimage.checkpoint拷贝到NN；
8. NN将fsimage.checkpoint重命名为fsimage。

### fsimage和Edits

格式化NameNode后，在`${hadoop.tmp.dir}/dfs/name/current`目录下生成如下文件：

- fsimage_0000000000000001081
- fsimage_0000000000000001081.md5
- seen_txid
- VERSION

fsimage文件是HDFS元数据的一个永久性检查点，包含HDFS文件系统的所有目录和文件inode的序列化信息。edits文件存放HDFS所有**更新**操作的路径，客户端的所有写操作被记录到edits中。seen_txid文件只保存一个数字，即最新edit_inprogress文件名的版本后缀。

### oiv和oev

Hadoop提供oiv(**o**ffline fs**i**mage **v**iewer)、oev(**o**ffline **e**dits **v**iewer)命令分别用于查看fsimage和edits文件，基本用法如下：

```bash
hdfs oiv[oev] -p <转换输出文件类型> -i <fsimage/edits文件名> -o <转换输出文件名>
```

### Checkpoint设置

2NN触发checkpoint的条件有2种，第一种是定时触发，默认情况下，2NN每隔一个小时执行一次checkpoint：

```xml title=hdfs-default.xml
<property>
    <name>dfs.namenode.checkpoint.period</name>
    <value>3600s</value>
</property>
```

第二种是定量触发，每隔一段时间(默认60s)检查操作次数是否达到定量(默认100万)来决定是否执行checkpoint：

```xml title=hdfs-default.xml
<property>
    <name>dfs.namenode.checkpoint.txns</name>
    <value>1000000</value>
    <description>操作动作次数</description>
</property>
<property>
    <name>dfs.namenode.checkpoint.check.period</name>
    <value>60s</value>
    <description>1分钟检查一次操作次数</description>
</property>
```

## DataNode工作机制

数据块在DataNode上存储包含2个文件，数据本身和元数据文件，后者包含数据块的长度、检验和以及时间戳。DataNode工作机制如下：

1. DataNode启动后向NameNode注册；
2. DataNode注册成功；
3. DataNode周期性(默认6小时)地向NN报告所有块信息；

```xml
<property>
    <name>dfs.blockreport.intervalMsec</name>
    <value>21600000</value>
    <description>Determines block reporting interval in 
    milliseconds.</description>
</property>
<property>
    <name>dfs.datanode.directoryscan.interval</name>
    <value>21600s</value>
    <description>Interval in seconds for Datanode to scan data 
    directories and reconcile the difference between blocks in memory and on 
    the disk.
    Support multiple time unit suffix(case insensitive), as described
    in dfs.heartbeat.interval.
    </description>
</property>
```

4. DataNode每隔3s向NN发送心跳，如果超过10分钟+30秒没有收到来自DataNode的心跳，NN认为该节点不可用。

### 数据完整性

DataNode使用crc32算法对block进行校验，copyToLocalFile方法最后一个参数设置为false，下载后多一个crc文件。

### 超时设置

当DataNode进程死亡或者由网络故障造成DataNode与NameNode无法通信时，NN不会立即判断该DataNode不可用，而是经过一段超时时长timeout后才判定：

timeout=2 \* dfs.namenode.heartbeat.recheck-interval + 10 \* dfs.heartbeat.interval

默认recheck-interval大小为5分钟，dfs.heartbeat.interval为3秒。

## 总结

1. Block大小与磁盘读写速度相关，一般设置128MB或者256MB；
2. HDFS Shell操作；
3. HDFS读写流程:star:。
