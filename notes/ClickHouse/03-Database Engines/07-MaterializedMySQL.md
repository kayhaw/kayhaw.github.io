---
layout: article
title: 🧪MaterializedMySQL
slug: /ClickHouse/Database-Engines/MaterializedMySQL
tags:
  - ClickHouse
  - Learning Notes
---

和MySQL引擎只是MySQL库的映射代理不同(:confused:个人理解)，MaterializedMySQL引擎会创建一个真实的ClickHouse库，并像MySQL副本节点一样读取binlog并执行DDL和DML语句(不推荐在生产环境中使用MaterializedMySQL，它仍处于试验阶段:test_tube:)。

## 创建语法

```sql
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster]
ENGINE = MaterializedMySQL('host:port', ['database' | database], 'user', 'password') [SETTINGS ...]
[TABLE OVERRIDE table1 (...), TABLE OVERRIDE table2 (...)]
```

其中SETTINGS可配置项如下：

- `max_rows_in_buffer`：内存缓存区条数限制，默认65505，超过则materialize(持久化:question:)；
- `max_bytes_in_buffer`：内存缓存区大小限制(字节)，默认1048576字节，超过则持久化；
- `max_flush_data_time`：内存缓存区周期(毫秒)，默认1000毫秒，超过则持久化；
- `max_wait_time_when_mysql_unavailable`：当MySQL连接不上时重连间隔(毫秒)，默认1000，负数表示不重连；
- `allows_query_when_mysql_lost`：当MySQL连接不上时是否允许查询物化表，默认0(false)；
- `materialized_mysql_tables_list`：物化MySQL库从源MySQL库复制的表，逗号分隔，默认为空表示复制所有表。

要想MaterializedMySQL引擎正确工作，MySQL端必须配置如下：

- `default_authentication_plugin = mysql_native_password`
- `gtid_mode = on`
- `enforce_gtid_consistency = on`
- `enforce_gtid_consistency = on`

## 虚拟列

当使用MaterializedMySQL库引擎，ReplacingMergeTree表将使用2个虚拟列：

- `_version`：事务计数器，类型UInt64；
- `_sign`：删除标志，类型Int8，1表示未删除，-1表示已删除。

## 支持数据类型

| MySQL                 | ClickHouse  |
| --------------------- | ----------- |
| TINY                  | Int8        |
| SHORT                 | Int16       |
| INT24                 | Int32       |
| LONG                  | UInt32      |
| LONGLONG              | UInt64      |
| FLOAT                 | Float32     |
| DOUBLE                | Float64     |
| DECIMAL, NEWDECIMAL   | Decimal     |
| DATE, NEWDATE         | Date        |
| DATETIME, TIMESTAMP   | DateTime    |
| DATETIME2, TIMESTAMP2 | DateTime64  |
| YEAR                  | UInt16      |
| TIME                  | Int64       |
| ENUM                  | Enum        |
| STRING                | String      |
| VARCHAR, VAR_STRING   | String      |
| BLOB                  | String      |
| GEOMETRY              | String      |
| BINARY                | FixedString |
| BIT                   | UInt64      |
| SET                   | UInt64      |

其中，ClickHouse支持空值null，MySQL的TIME类型转为对应的微秒数，其他不支持类型ClickHouse会抛出"Unhandled data type"异常。

## 使用规范

### 兼容限制

除了在数据类型上的限制外，MaterializedMySQL引擎还有如下要求：

- 每个表需要包含主键；
- ENUM字段值不超过范围

### DDL查询

对MySQL查询将会被转为ClickHouse DDL语句执行，如果转换失败则**忽略**。

### 数据复制

MaterializedMySQL引擎对数据的增删改操作使用如下等效数据复制：

- `INSERT`操作转为带`_sign=1`的`INSERT`；
- `DELETE`操作转为带`_sign=-1`的`INSERT`；
- `UPDATE`操作：如果主键改变，转为带`_sign=-1`的`INSERT`和带`_sign=1`的`INSERT`(先删再插)；否则转为带`_sign=1`的`INSERT操作`(直接插入)。

### 数据查询

对MaterializedMySQL表的SELECT查询语句有如下规则：

- `_version`字段未指定，使用FINAL修饰符，即只返回`_version`字段最大的行；
- `_sign`字段未指定，使用`_sign=1`过滤，即只返回未删除的行；
- 查询结果返回字段注释。

### 索引转换

MySQL表DDL中的`PRIMARY KEY`和`INDEX`从句会被转为ClickHouse表中的`ORDER BY`从句，这是ClickHouse数据存储的物理顺序。注意：

1. `_sign=-1`的列不会物理上删除；
2. **不支持级联的`UPDATE/DELETE`**，因为这些操作在binlog中不可见；
3. 副本可以轻易地被打破；
4. **禁止手动操作库表**；
5. optimize_on_insert参数影响着MaterializedMySQL数据。

### 表重载

```sql
CREATE DATABASE db_name ENGINE = MaterializedMySQL(...)
[SETTINGS ...]
[TABLE OVERRIDE table_name (
    [COLUMNS (
        [col_name [datatype] [ALIAS expr] [CODEC(...)] [TTL expr], ...]
        [INDEX index_name expr TYPE indextype[(...)] GRANULARITY val, ...]
        [PROJECTION projection_name (SELECT <COLUMN LIST EXPR> [GROUP BY] [ORDER BY]), ...]
    )]
    [ORDER BY expr]
    [PRIMARY KEY expr]
    [PARTITION BY expr]
    [SAMPLE BY expr]
    [TTL expr]
), ...]
```

表重载用于定制化ClickHouse的DDL语句，允许的表重载操作有：

- 修改字段类型，但要求类型兼容，否则复制失败；
- 修改字段TTL；
- 修改字段压缩编码；
- 添加别名列；
- 添加跳跃索引；
- 添加映射；
- 修改PARTITION BY；
- 修改ORDER BY；
- 修改PRIMARY KEY；
- 添加SAMPLE KEY；
- 添加表TTL。

在CREATE DATABASE执行时没有对表重载进行验证，甚至可以对不存在的表指定表重载。因此使用表重载需要格外小心，否则就会导致表数据同步失败，比如：

1. 通过表重载添加了别名列，然后源端MySQL表又重新添加了同名列，导致ClickHouse执行ALTER TABLE失败；
2. 通过表重载添加可为空的字段，但是这些字段又作为ORDER BY或者PARTITION BY使用。
