---
layout: article
title: 🧪Replicated
slug: /ClickHouse/Database-Engines/Replicated
tags:
  - ClickHouse
  - Learning Notes
---

处于试验阶段的Replicated引擎基于Atomic引擎，它将DDL日志上传到ZooKeeper并在给定数据库副本上执行来实现元数据复制。**同一个ClickHouse服务器上可以有多个数据库副本，但是它们不能是同一个Replicated库的副本。**

## 创建语法

```sql
CREATE DATABASE testdb ENGINE = Replicated('zoo_path', 'shard_name', 'replica_name') [SETTINGS ...]
```

- `zoo_path`：ZooKeeper路径，相同路径表示同一个库；
- `shard_name`：分片名，database副本**分组**为多个分片，分片通过`shard_name`标识；
- `relica_name`：副本名，同一个分片的副本明必须互不相同。

:::warning
对于ReplicatedMergeTree表，以上3个参数依次默认为`/clickhouse/tables/{uuid}/{shard}`， `{shard}`，`{replica}`，也可以通过服务器参数`default_replica_path`和`default_replica_name`设置ZooKeeper路径和副本名。宏`{shard}`和`{replica}`由服务器配置值指定，而不是库引擎参数，将来可能会使用'shard_name'和'replica_name'。
:::

## 使用细则

在Replicated库上的DDL查询和在CLUSTER的相似但略有不同：DDL先在提交该语句的主节点上执行，如果失败则返回错误，其他节点不会执行；当前节点成功后，其他节点会重复执行语句直到成功，如果在distributed_ddl_task_timeout(默认180)秒(:question:文档没提单位)内完成，则主节点返回成功。如果DDL执行出错，处理策略由distributed_ddl_output_mode参数指定：

- **throw**：默认值，返回带状态的结果集，如果执行超过distributed_ddl_task_timeout，则返回TIMEOUT_EXCEEDED异常；
- **none**：类似throw，但是不返回结果集；
- **null_status_on_timeout**：如果执行超时，则返回NULL而不是TIMEOUT_EXCEEDED异常；
- **never_throw**：不返回任何异常；

对于Replicated库，官方推荐设置为null_status_on_timeout。

:::warning
**Replicated库只对元数据负责**，它会自动比较本地与ZooKeeper上的元数据，随后进行表删除、添加或者结构更新操作。只有当表使用ReplicatedMergeTree引擎时，才会进行数据复制。类似地，对分区的各种操作(ALTER TABLE ATTACH|FETCH|DROP|DROP DETACHED|DETACH PARTITION|PART)也只是在当前副本进行添加/加载/删除分区目录操作，不会真的把分区内数据一块同步过来(除非是ReplicatedMergeTree表引擎)。
:::
