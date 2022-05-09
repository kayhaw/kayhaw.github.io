---
layout: article
title: MySQL
slug: /ClickHouse/Database-Engines/MySQL
tags:
  - ClickHouse
  - Learning Notes
---

连接到远程MySQL库，可以执行`INSERT`、`SELECT`、`SHOW TABLES`、`SHOW CREATE TABLE`等语句，**不能执行**`RENAME`、`CREATE TABLE`、`ALTER`操作。

## 创建语法

```sql
CREATE DATABASE [IF NOT EXISTS] db_name [ON CLUSTER cluster]
ENGINE = MySQL('host:port', ['database' | database], 'user', 'password')
```

- `host:port`：MySQL服务连接地址；
- `database`：远程库名；
- `user`：用户名；
- `password`：密码。

## 支持类型

| MySQL                            | ClickHouse  |
| -------------------------------- | ----------- |
| UNSIGNED TINYINT                 | UInt8       |
| TINYINT                          | Int8        |
| UNSIGNED SMALLINT                | UInt16      |
| SMALLINT                         | Int16       |
| UNSIGNED INT, UNSIGNED MEDIUMINT | UInt32      |
| INT, MEDIUMINT                   | Int32       |
| UNSIGNED BIGINT                  | UInt64      |
| BIGINT                           | Int64       |
| FLOAT                            | Float32     |
| DOUBLE                           | Float64     |
| DATE                             | Date        |
| DATETIME, TIMESTAMP              | DateTime    |
| BINARY                           | FixedString |

MySQL的其他类型都会被转为ClickHouse的String类型。

**其他MySQL数据类型都会转为ClickHouse的String类型**，支持Nullable。

## 全局变量

ClickHouse也支持`@@version`、`@@max_allowed_packet`等MySQL全局变量的处理，但这些变量都是stub:question:，不对应任何值。

```sql
SELECT @@version;
```
