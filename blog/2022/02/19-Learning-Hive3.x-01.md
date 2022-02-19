---
title: Hive 3.x学习笔记(1)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(1)：Hive简介与安装
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第1篇：Hive简介与安装。
<!--truncate-->

## Hive简介

Hive是基于Hadoop的**数据仓库工具(非传统意义上数据库)**，由Facebook开源用于解决海量结构化日志，Hive将结构化数据文件映射为一张表，并提供类SQL(HQL)查询功能，其本质是将HQL翻译为MapReduce程序。

:smile:优点：

1. HQL类似SQL，使用起来容易上手；
2. 避免写MR程序，降低学习成本；
3. 执行延迟高，因此适用于对实时性要求不高且数据量大的场景；
4. 支持自定义函数。

:angry:缺点：

1. HQL无法表达迭代式算法，受限于MapReduce流程；
2. 执行效率低，生成MapReduce作业不够智能化；
3. 调优困难。

### Hive架构

与Metastore交互获取数据文件在HDFS上的位置，编写的HQL依次经过解析器、编译器、优化器和执行器翻译为MapReduce程序执行，如下图所示：

- **解析器**：将HQL转为为抽象语法树AST，并进行语法分析；
- **编译器**：由AST生成逻辑执行计划；
- **优化器**：优化逻辑执行计划；
- **执行器**：将逻辑执行计划转为可以运行的物理计划(MapReduce/Spark程序)。

### Hive特性

1. **数据更新**：Hive为数据仓库而设计，适用读多写少的场景，因此Hive**不建议**改写数据，而传统数据库经常修改；
2. **执行延迟**：Hive查询数据时没有索引需要扫描整个表，并且MapReduce框架也有较高延迟；但在大规模数据下才能体现Hive优势；
3. **数据规模**：Hive基于Hadoop集群可以处理大规模数据

## Hive安装

### 安装包

1. [apache-hive-3.1.2-bin.tar.gz](http://archive.apache.org/dist/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz)
2. [mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar](https://downloads.mysql.com/archives/community/)

<img style={{width:"80%", height:"80%"}} src="/img/blog/HiveNotes/mysql-5.7.28-bundle.png" title="mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar"/>

3. [mysql-connector-java-5.1.37.tar.gz](https://downloads.mysql.com/archives/c-j/)

<img style={{width:"80%", height:"80%"}} src="/img/blog/HiveNotes/mysql-connector-java-5.1.37.png" title="mysql-connector-java-5.1.37"/>

### 安装步骤

1. 将apache-hive-3.1.2-bin.tar.gz解压到/opt/module目录下，并重命名为apache-hive-3.1.2：

```bash
tar -zxvf /opt/software/apache-hive-3.1.2-bin.tar.gz -C /opt/module/
mv /opt/module/apache-hive-3.1.2-bin/ /opt/module/apache-hive-3.1.2
```

2. 添加如下环境变量并使之生效(**`source /etc/profile.d/my_env.sh`**)：

```bash title="/etc/profile.d/my_env.sh"
# HIVE_HOME
export HIVE_HOME=/opt/module/apache-hive-3.1.2
export PATH=$PATH:$HIVE_HOME/bin
```

3. 解决日志jar包冲突，将其重命名使之无法加载：

```bash
mv $HIVE_HOME/lib/log4j-slf4j-impl-2.10.0.jar $HIVE_HOME/lib/log4j-slf4j-impl-2.10.0.bak
```

### 初试Hive

1. **初始化元数据库**：`schematool -dbType derby -initSchema`；
2. 启动hive，直接输入`hive`即可，交互界面类似MySQL客户端可以执行HQL；
3. 新建ssh会话也执行`hive`命令，发现如下报错：

```bash
Caused by: ERROR XSDB6: Another instance of Derby may have already booted 
the database /opt/module/hive/metastore_db.
 at 
org.apache.derby.iapi.error.StandardException.newException(Unknown 
Source)
 at 
org.apache.derby.iapi.error.StandardException.newException(Unknown Source)
 at 
org.apache.derby.impl.store.raw.data.BaseDataFileFactory.privGetJBMSLockO
nDB(Unknown Source)
 at 
org.apache.derby.impl.store.raw.data.BaseDataFileFactory.run(Unknown 
Source)
...
```

由于Hive默认使用derby作为元数据库，但此时不支持其他会话的共享，因此接下来将元数据库由derby改为MySQL。

### 更换元数据库

首先按照如下步骤安装MySQL：

1. 检查并删除CentOS自带的Mariadb相关依赖：

```bash
rpm -qa|grep mariadb
sudo rpm -e --nodeps mariadb-libs
```

2. 解压mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar，得到多个rmp包并安装：

```bash
tar -xf mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar
## 按序执行，后面的依赖于前面
sudo rpm -ivh mysql-community-common-5.7.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-libs-5.7.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-libs-compat-5.7.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-client-5.7.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-server-5.7.28-1.el7.x86_64.rpm
```

3. 删除`/etc/my.cnf`文件中datadir参数指定目录下的所有内容
4. 初始化MySQL数据库：

```bash
sudo mysqld --initialize --user=mysql
```

5. 在MySQL日志中找到生成的root密码(本次为`Mzn7/gl.i!-4`)：

```bash
sudo cat /var/log/mysqld.log
2022-02-18T10:29:24.176884Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
2022-02-18T10:29:24.545101Z 0 [Warning] InnoDB: New log files created, LSN=45790
2022-02-18T10:29:24.593907Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
2022-02-18T10:29:24.655737Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: a49026e8-90a5-11ec-af0f-000c293a2d67.
2022-02-18T10:29:24.658007Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
2022-02-18T10:29:25.387668Z 0 [Warning] CA certificate ca.pem is self signed.
2022-02-18T10:29:26.020911Z 1 [Note] A temporary password is generated for root@localhost: Mzn7/gl.i!-4
```

6. 启动MySQL服务：

```bash
sudo systemctl start mysqld
```

7. 修改root密码为`root123`并设置root账号以任意ip登录：

```bash
[kayhaw@hadoop102 module]$ mysql -u root -p
Enter password: [输入Mzn7/gl.i!-4]
...
mysql> set password = password("root123");
mysql> update mysql.user set host='%' where user='root';
mysql> flush privileges;
```

现在MySQL已经配置好了，接下来进行Hive相关配置：

1. 将MySQL JDBC驱动拷贝到Hive的lib目录下：

```bash
tar -zxvf mysql-connector-java-5.1.37.tar.gz
cp mysql-connector-java-5.1.37/mysql-connector-java-5.1.37-bin.jar $HIVE_HOME/lib
```

2. 在`$HIVE_HOME/conf`目录下新建`hive-site.xml`文件并添加如下内容：

```xml title="$HIVE_HOME/conf/hive-site.xml"
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
 <!-- jdbc 连接的 URL -->
 <property>
 <name>javax.jdo.option.ConnectionURL</name>
 <value>jdbc:mysql://hadoop102:3306/metastore?useSSL=false</value>
</property>
 <!-- jdbc 连接的 Driver-->
 <property>
 <name>javax.jdo.option.ConnectionDriverName</name>
 <value>com.mysql.jdbc.Driver</value>
</property>
<!-- jdbc 连接的 username-->
 <property>
 <name>javax.jdo.option.ConnectionUserName</name>
 <value>root</value>
 </property>
 <!-- jdbc 连接的 password -->
 <property>
 <name>javax.jdo.option.ConnectionPassword</name>
 <value>root123</value>
</property>
 <!-- Hive 元数据存储版本的验证 -->
 <property>
 <name>hive.metastore.schema.verification</name>
 <value>false</value>
</property>
 <!--元数据存储授权-->
 <property>
 <name>hive.metastore.event.db.notification.api.auth</name>
 <value>false</value>
 </property>
 <!-- Hive 默认在 HDFS 的工作目录 -->
 <property>
 <name>hive.metastore.warehouse.dir</name>
 <value>/user/hive/warehouse</value>
 </property>
</configuration>
```

3. 登录MySQL并创建Hive元数据库`metastore`，**注意名称和配置文件中的保持一致**。
4. 初始化Hive元数据库：

```bash
schematool -initSchema -dbType mysql -verbose
```

### 开启metastore服务

到目前为止只是在本地使用hive命令开启会话进行交互，接下来开启元数据服务让远程客户端能够访问Hive服务；

1. `hive-site.xml`添加如下配置：

```xml title="$HIVE_HOME/conf/hive-site.xml"
<!-- 指定存储元数据要连接的地址 -->
<property>
  <name>hive.metastore.uris</name>
  <value>thrift://hadoop102:9083</value>
</property>
```

2. 启动metastore服务：

```bash
[kayhaw@hadoop102 conf]$ hive --service metastore
2022-02-19 23:32:28: Starting Hive Metastore Server
```

注意命令开启前台进程服务，不能退出，此时通过`hive`命令访问的元数据服务由hadoop102:9083提供。

### 开启hiveserver2服务

为了让远程客户端能以JDBC方式访问Hive，还需要开启hiveserver2服务：

1. `hive-site.xml`添加如下配置：

```xml title="$HIVE_HOME/conf/hive-site.xml"
<!-- 指定 hiveserver2 连接的 host -->
<property>
  <name>hive.server2.thrift.bind.host</name>
  <value>hadoop102</value>
</property>
<!-- 指定 hiveserver2 连接的端口号 -->
<property>
  <name>hive.server2.thrift.port</name>
  <value>10000</value>
</property>
```

2. 启动hiveserver2服务：

```bash
[kayhaw@hadoop102 conf]$ hive --service metastore
2022-02-19 23:32:28: Starting Hive Metastore Server
```