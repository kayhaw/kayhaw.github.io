---
layout: article
title: SQLite
slug: /ClickHouse/Database-Engines/SQLite
tags:
  - ClickHouse
  - Learning Notes
---

连接到SQLite库，通过执行插入和查询语句在ClickHouse和SQLite之间交换数据。

## 创建语法

```sql
CREATE DATABASE sqlite_database ENGINE = SQLite('db_path')
```

- `db_path`：SQLite数据库文件路径。

## 支持类型

| SQLite  | ClickHouse |
| ------- | ---------- |
| INTEGER | Int32      |
| REAL    | Float32    |
| TEXT    | String     |
| BLOB    | String     |

## 使用细则

SQLite使用单个文件保存整个数据库信息和元信息，在写数据期间会对整个文件上锁，因此写操作是串行的，但读操作可以并行。SQLite不需要服务管理或者基于GRANT语句的权限管理，权限管理靠数据库文件权限实现。
