---
title: Hadoop 3.x学习笔记(1)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hadoop
  - BigData
description: Hadoop 3.1.3学习笔记(1)
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第1篇：基于VMWare虚拟机的Hadoop集群环境搭建。
<!--truncate-->

## 基础环境准备

### 压缩包下载与系统环境

从[Hadoop Releases](http://archive.apache.org/dist/hadoop/common/)下载Hadoop 3.1.3压缩包并拷贝到虚拟机中，然后解压到`/opt/module`目录。从[Java SE 8 Archive Downloads](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)下载JDk 8压缩包并拷贝到虚拟机中，同样解压到`/opt/module`目录。

在`/etc/profile.d`文件夹下创建my_env.sh文件，添加如下内容，**执行命令`source /etc/profile`使环境变量生效**。

```bash
# JAVA_HOME
export JAVA_HOME=/opt/module/jdk1.8.0_212
export PATH=$PATH:$JAVA_HOME/bin

# HADOOP_HOME
export HADOOP_HOME=/opt/module/hadoop-3.1.3
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
```

### 文件同步脚本

为了方便在集群上的各个节点间同步配置文件，编写xsync脚本如下所示。该脚本实际是对rsync命令的封装，与scp相比，rsync只同步差异文件而scp同步所有文件。注意同步文件的双方都安装rsync，并**将xysnc脚本放在${HOME}/bin目录下**以便随处调用。

```bash title=xsync.sh
#!/bin/bash
#1. 判断参数个数
if [ $# -lt 1 ]
then
  echo Not Enough Arguement!
  exit;
fi

#2. 遍历集群所有机器
for host in hadoop102 hadoop103 hadoop104
do
  echo ==================== $host ====================
  #3. 遍历所有目录，挨个发送
  for file in $@
  do
  #4. 判断文件是否存在
  if [ -e $file ]
  then
  #5. 获取父目录
  # dirname是shell命令，列出文件绝对路径，cd -P：对于软连接进入实际目录
  pdir=$(cd -P $(dirname $file); pwd)
  #6. 获取当前文件的名称
  fname=$(basename $file)
  ssh $host "mkdir -p $pdir"         # mkdir -p 在文件夹已经存在时不报错
  rsync -av $pdir/$fname $host:$pdir
  else
  echo $file does not exists!
  fi
  done
done
```

### 免密登录

在xsync脚本中使用ssh登录目标端并创建目录，为了实现免密登录，执行如下命令：

```bash
ssh-genkey -t rsa        # 生成本机密钥对
ssh-copy-id hadoop103    # 本机公钥传到hadoop103，实现免密登录
```

## Hadoop配置与启动

### 节点规划

| 节点角色   | hadoop102         | hadoop103                   | hadoop104                  |
| --------- | ----------------- | --------------------------- | -------------------------- |
| HDFS      | NameNode DataNode | DataNode                    | SecondaryNameNode DataNode |
| YARN      | NodeManager       | ResourceManager NodeManager | NodeManager                |

注意NameNode和SecondaryNameNode不能在相同节点，ResourceManager开销高，不能和NameNode、SecondaryNameNode在相同节点。

### 配置文件

Hadoop配置文件都在`${HADOOP_HOME}/etc/hadoop`目录下，搭建集群环境需要修改的配置文件有core-site.xml、hdfs-site.xml、yarn-site.xml、mapred-site.xml和workers，配置内容如下：

```xml title=core-site.xml
<configuration>
  <!-- 指定NameNode地址(Hadoop内部通信用) -->
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://hadoop102:8020</value>
  </property>
  <!-- 指定Hadoop数据的存储目录 -->
  <property>
    <name>hadoop.tmp.dir</name>
    <value>/opt/module/hadoop-3.1.3/data</value>
  </property>
  <!-- 指定HDFS网页登录使用的静态用户为kayhaw -->
  <property>
    <name>hadoop.http.staticuser.user</name>
    <value>kayhaw</value>
  </property>
</configuration>
```

```xml title=hdfs-site.xml
<configuration>
  <!-- nn web端访问地址(外部访问用) -->
  <property>
  <name>dfs.namenode.http-address</name>
    <value>hadoop102:9870</value>
  </property>
  <!-- 2nn web端访问地址 -->
  <property>
    <name>dfs.namenode.secondary.http-address</name>
    <value>hadoop104:9868</value>
  </property>
</configuration>
```

```xml title=yarn-site.xml
<configuration>
  <!-- 指定MR走shuffle -->
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
  <!-- 指定ResourceManager的地址 -->
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>hadoop103</value>
  </property>
  <!-- 环境变量的继承 -->
  <property>
    <name>yarn.nodemanager.env-whitelist</name> 
    <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CO
NF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAP
RED_HOME</value>
  </property>
  <!-- 开启日志聚集功能 -->
  <property>
    <name>yarn.log-aggregation-enable</name>
    <value>true</value>
  </property>
  <!-- 设置日志聚集服务器地址 -->
  <property> 
    <name>yarn.log.server.url</name> 
    <value>http://hadoop102:19888/jobhistory/logs</value>
  </property>
  <!-- 设置日志保留时间为7天 -->
  <property>
    <name>yarn.log-aggregation.retain-seconds</name>
    <value>604800</value>
  </property>
  <!-- 设置虚拟/物理内存比例 -->
  <property>
    <name>yarn.nodemanager.vmem-pmem-ratio</name>
    <value>3</value>
  </property>
</configuration>
```

其中，设置虚拟/物理内存比例是因为在运行mr任务中出现如下情况：Hadoop根据默认配置的所需物理内存大小(1GB)按照比例2.1(默认)分配虚拟内存2.1GB，实际程序用到2.4GB超过分配大小，因此这里将比例增至3。日志聚集将应用日志保存到HDFS上，方便查看程序运行详情。

```bash
2022-01-29 12:45:55,708 INFO mapreduce.Job: Task Id : attempt_1643428629319_0003_m_000000_2, Status : FAILED
[2022-01-29 12:45:55.069]Container [pid=5003,containerID=container_1643428629319_0003_01_000004] is running 299792896B beyond the 'VIRTUAL' memory limit. Current usage: 137.7 MB of 1 GB physical memory used; 2.4 GB of 2.1 GB virtual memory used. Killing container.
```

```xml title=mapred-site.xml
<configuration>
  <!-- 指定MapReduce程序运行在Yarn上 -->
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <!-- 指定MR环境变量 -->
  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=/opt/module/hadoop-3.1.3/</value>
    </property>
  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=/opt/module/hadoop-3.1.3/</value>
  </property>
  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=/opt/module/hadoop-3.1.3/</value>
  </property>
  <!-- 历史服务器端地址 -->
  <property>
    <name>mapreduce.jobhistory.address</name>
    <value>hadoop102:10020</value>
  </property>
  <!-- 历史服务器web端地址 -->
  <property>
    <name>mapreduce.jobhistory.webapp.address</name>
    <value>hadoop102:19888</value>
  </property>
</configuration>
```

**历史日志服务需要手动输入命令`mapred --daemon start historyserver`启动**。

```yaml title=workers
# 注意不允许出现空行或行尾空格
hadoop102
hadoop103
hadoop104
```

完成如上配置后，一定要记得**使用xsync工具将所有配置文件同步到各个节点**。

### 启动集群

1. 格式化namenode节点：`hdfs namenode -format`，**仅第一次启动Hadoop环境需要**；
2. 在namenode节点上启动HDFS：`start-dfs.sh`，注意不是hdfs:smirk:；
3. 在resourcemanager节点上启动YARN：`start-yarn.sh`；
4. 浏览器输入地址`http://hadoop102:9870`和`http://hadoop103}:8088`分别查看HDFS和YARN情况。

## 脚本工具

为了方便在不同节点上启动、关闭集群，编写如下脚本：

```bash title=myhadoop.sh
#!/bin/bash
if [ $# -lt 1 ]
then
  echo "No Args Input..."
  exit ;
fi
case $1 in
"start")
  echo " =================== 启动 hadoop 集群 ==================="
  echo " --------------- 启动 hdfs ---------------"
  ssh hadoop102 "/opt/module/hadoop-3.1.3/sbin/start-dfs.sh"
  echo " --------------- 启动 yarn ---------------"
  ssh hadoop103 "/opt/module/hadoop-3.1.3/sbin/start-yarn.sh"
  echo " --------------- 启动 historyserver ---------------"
  ssh hadoop102 "/opt/module/hadoop-3.1.3/bin/mapred --daemon start historyserver"
;;
"stop")
  echo " =================== 关闭 hadoop 集群 ==================="
  echo " --------------- 关闭 historyserver ---------------"
  ssh hadoop102 "/opt/module/hadoop-3.1.3/bin/mapred --daemon stop historyserver"
  echo " --------------- 关闭 yarn ---------------"
  ssh hadoop103 "/opt/module/hadoop-3.1.3/sbin/stop-yarn.sh"
  echo " --------------- 关闭 hdfs ---------------"
  ssh hadoop102 "/opt/module/hadoop-3.1.3/sbin/stop-dfs.sh"
;;
*)
  echo "Input Args Error..."
;;
esac
```

为了查看各节点java进程，编写如下脚本：

```bash title=jpsall.sh
#!/bin/bash
for host in hadoop102 hadoop103 hadoop104
do
  echo =============== $host ===============
  ssh $host jps 
done
```

最后将myhadoop.sh和jpsall.sh放在${HOME}/bin目录下，以便随处可用。

## 异常处理

格式化NameNode会产生新集群id，导致NameNode和DataNode的集群id不一致，从而出现异常(DataNode个数为0)，此时可以：

1. 停止集群服务；
2. 删除所有节点上的data和logs目录；
3. 重新格式化nn节点；
4. 重启集群服务。

## 时间同步\[可选\]

当部署在内网时，Hadoop集群需要配置时间同步服务，否则产生节点时间偏差，导致集群执行任务时间不一致。如下操作以hadoop102为时间服务器，让hadoop103、hadoop104每隔1s向其对准时间：

1. 在所有节点上安装ntp服务：`yum -y install ntp`；
2. 在hadoop102上设置开机自启ntpd服务：`systemctl start ntpd`，`systemctl enable ntpd`；
3. 修改`/etc/ntp.conf`文件：
    1. 将restrict一行中的192.168.1.0改为hadoop10x的网关192.168.10.0；
    2. 注释4行`server 0[1,2,3].centos.pool.ntp.org iburst`，不与外网时间同步；
    3. 末尾添加`server 127.127.1.0`；
    4. 末尾添加`fudge 127.127.1.0 stratum 10`；
4. 修改hadoop102的`/etc/sysconf/ntpd`文件，添加`SYNC_HWCLOCK=yes`；
5. hadoop102重启ntpd服务，`systemctl restart ntpd`；
6. **其他节点关闭ntpd服务**，通过命令`sudo crontab -e`打开配置文件并添加一行`*/1 * * * * /usr/sbin/ntpdate hadoop102`。

## 总结

1. 集群服务的启动/终止：`start[stop]-dfs.sh`、`start[stop]-yarn.sh`；节点服务的启动/终止：`hdfs --daemon start[stop] namenode[datanode][secondarynode]`、`yarn --daemon start[stop] resourcemanager[nodemanager]`；
2. 修改配置文件后要重启集群服务，修改环境变量要source一下使其生效；
3. 集群异常情况分析：
    1. 格式化NameNode生成集群id；
    2. 启动HDFS后DataNode生成和NameNode相同的集群id；
    3. 再次格式化NameNode生成另一个集群id，与未删除DataNode的id不一致；
    4. 解决方法是在第2次格式化之前删除DataNode中的信息(data目录)。
