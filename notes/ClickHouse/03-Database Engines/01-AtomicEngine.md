---
layout: article
title: Atomic
slug: /ClickHouse/Engines/Atomic
tags:
  - ClickHouse
  - Learning Notes
---

Atomic库引擎是ClickHouse默认的库引擎，支持**非阻塞的**表删除和表重命名操作，以及**原子性的**交换表操作。

## 表UUID

Atomic库引擎中的所有表对应一个固定的UUID，并且表数据存放在目录`/<clickhouse_path>/store/xxx/xxxxyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy`下，其中最后一集目录名就是表UUID。通常UUID建表时自动生成，但也可以手动指定(**不建议这么做:no_good:**)：

```sql
CREATE TABLE name UUID '28f1c61c-2970-457a-bffe-454156ddcfef' (n UInt64) ENGINE = ...;
```

通过`set show_table_uuid_in_table_create_query_if_not_nil=1`后，执行`show create table xxx`会显示表UUID，默认不显示。

:::info
表UUID是ClickHouse区分表的标识，也是表元数据和表数据关联的桥梁，在`ReplicatedMergeTree`表引擎中可以用来作为副本路径名。
:::

## 表重命名

通过`RENAME`语句对表进行重命名，它不会修改表UUID或者移动表数据，并且执行是非阻塞的：立即执行而不会等其他语句执行完毕。

## DROP/DETACH表

`DROP TABLE`/`DETACH TABLE`操作先将表**元数据**移动到`/<clickhouse_path>/metadata_dropped/`目录并通知后台线程，经过`database_atomic_delay_before_drop_table_sec`参数指定时间后才将表数据删除(单位秒，默认480秒)。

如果`DROP`/`DETACH`操作加上`SYNC`关键字，则会等待该表其他语句执行完毕后删除数据，此时`database_atomic_delay_before_drop_table_sec`参数失效，也可以通过`set database_atomic_wait_for_drop_and_detach_synchronously = 1`全局地给`DROP`/`DETACH`语句加上`SYNC`。

### DETACH和DROP区别

DETACH让ClickHouse服务“暂时忘记”表(视图、词典)的存在，之后执行该表的查询语句会报表不存在的错误(**SHOW CREATE TBALE可以但是DESC TABLE报错:question:**)，除此之外**不会对**表数据目录和元数据目录做任何操作，可以通过执行ATTACH语句**或者重启ClickHouse服务(`clickhouse restart`)**恢复。如果DETACH带上了`PERMANENTLY`，那么此时只能手动执行ATTACH恢复，重启ClickHouse服务不能恢复。

DROP TABLE先不动表数据目录，而是将表元数据目录下的`<tablename>.sql`移动为`<clickhouse_path>/metadata_dropped/<database>.<tablename>.<uuid>.sql`，并删除`/<clickhouse_path>/data/<database>`中的表目录软连接，此时ATTCH也无力回天，经过一段时间再由后台线程删除metadata_dropped目录和store目录中的表数据和元数据。

:::info 总结

尽管从效果上看，DETACH和DROP都让表“不存在”，但两者仍有以下区别：

1. 对象范围不同：DETACH只能用于表、视图、词典，而DROP能用于库、表、词典、用户、角色、视图和函数等；
2. 有效周期不同：DETACH是临时的可逆操作，通过ATTCH或者重启ClickHouse服务可以恢复，而DROP是永久的不可逆操作；
3. 实际操作不同：DETACH不对数据和元数据进行任何操作，但是DROP会删除数据和元数据。
:::

## EXCHANGE表/词典

`EXCHANGE`语句可以**原子性**地交换表/词典：

```sql
# 非原子性操作
RENAME TABLE new_table TO tmp, old_table TO new_table, tmp TO old_table;

# 原子性操作
EXCHANGE TABLES new_table AND old_table;
```

## 搭配ReplicatedMergeTree

当使用ReplicatedMergeTree表引擎时，**建议不要指定ZooKeeper路径参数和副本名称**，让ClickHouse使用带`{uuid}`宏的配置参数`default_replica_path`，可以确保路径唯一：

```xml
<default_replica_path>/clickhouse/tables/{uuid}/{shard}</default_replica_path>

<default_replica_name>{replica}</default_replica_name>
```

## 总结

1. Atomic是ClickHouse的默认库引擎，它的表删除操作(DROP)是非阻塞有延迟的，能够支持原子性的表交换；
2. 不要自行给表设置UUID，而是由ClickHouse自动生成；
3. DROP和DETACH表的异同；
4. 使用ReplicatedMergeTree的注意事项。
