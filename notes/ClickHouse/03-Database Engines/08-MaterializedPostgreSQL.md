---
layout: article
title: 🧪MaterializedPostgreSQL
slug: /ClickHouse/Database-Engines/MaterializedPostgreSQL
tags:
  - ClickHouse
  - Learning Notes
---

MaterializedPostgreSQL库引擎从PostgreSQL库创建快照并加载指定表(来自不同shcema)，并且获取LSN然后获取WAL的更新。当MaterializedPostgreSQL库引擎创建后，源端PostgreSQL的新增表不会自动同步，需要手动执行`ATTACH TABLE db.table`来添加。

该库引擎通过PostgreSQL Logical Replication Protocol实现数据同步，此协议不支持复制DDL，但可以感知破坏性的更改(如字段类型修改、添加/删除字段)。可以通过`SET materialized_postgresql_allow_automatic_update=1`在后台重载表，但最稳妥的方式还是手动执行`ATTACH`/`DETACH`来重新加载表。

:::info
MaterializedPostgreSQL库引擎处于试验阶段，通过`SET allow_experimental_database_materialized_postgresql=1`才能使用。
:::

## 创建语法

```sql
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster]
ENGINE = MaterializedPostgreSQL('host:port', 'database', 'user', 'password') [SETTINGS ...]
```

## 动态添加表

在MaterializedPostgreSQL创建后，不会自动检测源端PostgreSQL新增表，只能通过`ATTACH TABLE postgres_database.new_table;`来手动添加。

:::warning
在v22.1之前，添加表会产生一个不会自动删除的临时文件夹`{db_name}_ch_replication_slot_tmp`，因此需要通过`SELECT pg_drop_replication_slot('{db_name}_ch_replication_slot_tmp')`手动删除。否则磁盘占用不断增长，v22.1起修复了这个问题。
:::

## 动态删除表

```sql
DETACH TABLE postgres_database.table_to_remove;
```

## PostgreSQL schema

在创建MaterializedPostgreSQL库时，schema可以通过如下3种方式配置：

1. 指定一个schema，不带表名：

```sql
CREATE DATABASE postgres_database
ENGINE = MaterializedPostgreSQL('postgres1:5432', 'postgres_database', 'postgres_user', 'postgres_password')
SETTINGS materialized_postgresql_schema = 'postgres_schema';

SELECT * FROM postgres_database.table1;
```

2. 指定带schema的表名列表；

```sql
CREATE DATABASE database1
ENGINE = MaterializedPostgreSQL('postgres1:5432', 'postgres_database', 'postgres_user', 'postgres_password')
SETTINGS materialized_postgresql_tables_list = 'schema1.table1,schema2.table2,schema1.table3',
         materialized_postgresql_tables_list_with_schema = 1;

SELECT * FROM database1.`schema1.table1`;
SELECT * FROM database1.`schema2.table2`;
```

3. 指定多个schema，不带表名：

```sql
CREATE DATABASE database1
ENGINE = MaterializedPostgreSQL('postgres1:5432', 'postgres_database', 'postgres_user', 'postgres_password')
SETTINGS materialized_postgresql_schema_list = 'schema1,schema2,schema3';

SELECT * FROM database1.`schema1.table1`;
SELECT * FROM database1.`schema1.table2`;
SELECT * FROM database1.`schema2.table2`;
```

:rotating_light:**注意：方式2、3的表名不能再包含点号。**

## PostgreSQL配置要求

1. wal_level设置为logical，并且max_relication_slots至少为2；
2. 副本表必须包含主键或者索引。

```sql title=设置索引为副本标识
CREATE TABLE postgres_table (a Integer NOT NULL, b Integer, c Integer NOT NULL, d Integer, e Integer NOT NULL);
CREATE unique INDEX postgres_table_index on postgres_table(a, c, e);
ALTER TABLE postgres_table REPLICA IDENTITY USING INDEX postgres_table_index;
```

ClickHouse优先检查主键，没有则检查设置为副本标识的索引(**只能有一个**)，通过如下命令检查：

```sql
SELECT CASE relreplident
    WHEN 'd' THEN 'default'
    WHEN 'n' THEN 'nothing'
    WHEN 'f' THEN 'full'
    WHEN 'i' THEN 'index'
  END AS replica_identity
FROM pg_class
WHERE oid = 'postgres_table'::regclass;
```

## SETTINGS设置

在创建MaterializedPostgreSQL的SETTINGS部分，有如下配置项：

1. `materialized_postgresql_tables_list`：MaterializedPostgreSQL引擎将要复制的表名，逗号分隔，默认为空表示复制所有表；
2. `materialized_postgresql_schema`：默认为空，使用PostgreSQL默认schema；
3. `materialized_postgresql_schema_list`：默认为空，使用PostgreSQL默认schema；
4. `materialized_postgresql_allow_automatic_update`：是否自动重新加载表，默认为0表示关闭，在v22.1之前不要使用该配置；
5. `materialized_postgresql_max_block_size`：刷回给PostgreSQL库表的最大行数，默认65535；
6. `materialized_postgresql_replication_slot`：用户自定义slot名称，必须和materialized_postgresql_snapshot搭配使用；
7. `materialized_postgresql_snapshot`：用户自定义snapshot名称。

除了materialized_postgresql_tables_list外，以上设置均可通过`ALTER DATABASE`设置，需要通过`ATTACH TABLE`来修改表列表。

```sql
ALTER DATABASE postgres_database MODIFY SETTING materialized_postgresql_max_block_size = <new_size>;
```
