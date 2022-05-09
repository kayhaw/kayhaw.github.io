---
layout: article
title: PostgreSQL
slug: /ClickHouse/Database-Engines/PostgreSQL
tags:
  - ClickHouse
  - Learning Notes
---

连接到远程PostgreSQL服务器，通过读写操作ClickHouse和PostgreSQL交换数据，支持实时获取表信息，支持表结构更改。

## 创建语法

```sql
CREATE DATABASE test_database
ENGINE = PostgreSQL('host:port', 'database', 'user', 'password'[, `schema`, `use_table_cache`]);
```

- `host:port`：PostgreSQL服务连接地址；
- `database`：远程库名；
- `user`：用户名；
- `password`：密码；
- `schema`：模式名；
- `use_table_cache`：是否开启表结构缓存，默认为0表示不开启。

:::info 表结构缓存
当use_table_cache设置为1时，ClickHouse对PostgreSQL表结构进行缓存，因此无法感知远程PostgreSQL表的结构变化，只能通过DETACH TABLE+ATTACH TABLE操作来刷新。
:::

## 支持类型

| PostgreSQL       | ClickHouse      |
| ---------------- | --------------- |
| DATE             | Date            |
| TIMESTAMP        | DateTime        |
| REAL             | Float32         |
| DOUBLE           | Float64         |
| DECIMAL, NUMERIC | Decimal         |
| SMALLINT         | Int16           |
| INTEGER          | Int32           |
| BIGINT           | Int64           |
| SERIAL           | UInt32          |
| BIGSERIAL        | UInt64          |
| TEXT, CHAR       | String          |
| INTEGER          | Nullable(Int32) |
| ARRAY            | Array           |
