---
layout: article
title: 简介
slug: /ClickHouse/Introduction
tags:
  - ClickHouse
  - Learning Notes
---

## ClickHouse是什么?

基于列存储的、用于在线分析处理(OLAP)的数据库管理系统(DBMS)。

### 列存储和行存储

传统的行式DBMS存储布局如下所示，同一条记录的所有字段值在物理内存上连续，常见的行式DBMS有MySQL、PostgresSQL和SQLServer。

| 行  | 姓名 | 年龄 | 技能   |
| --- | ---- | ---- | ------ |
| 1   | Kay  | 23   | Java   |
| 2   | Haw  | 24   | Python |
| 3   | Tom  | 25   | C++    |

而列式存储布局如下所示，不同字段的值分开存储，而相同字段的值在物理内存上连续，常见的列式DBMS有HBase、Vertica、Druid。

| 行   | 值1  | 值2    | 值3 |
| ---- | ---- | ------ | --- |
| 姓名 | Kay  | Haw    | Tom |
| 年龄 | 23   | 24     | 25  |
| 技能 | Java | Python | C++ |

### OLAP特性

- 读请求远多于写请求；
- 数据大批更新(多于1000条)而不是单条更新，或者完全不更新；
- 插入数据后不再更新；
- 读请求大量行但是每行只要一小部分字段；
- 都是保存大量字段的宽表；
- 查询频率相对较低；
- 对于简单查询，可以容忍50ms左右的延迟；
- 字段值相当小：都是数值或者短字符串；
- 单个查询需要高吞吐量；
- 不需要事务特性；
- 每个查询有一张大表，其他都是小表；
- 查询结果集远小于源端数据集，即数据被过滤和聚合计算

列式存储更适用于OLAP场景，理由如下图所示：

![Row-oriented DBMS](/img/notes/clickhouse/row-oriented.webp)
![Column-oriented DBMS](/img/notes/clickhouse/column-oriented.webp)

## ClickHouse特性

1. **真正的**列式存储：除了数据本身之外不存储额外数据，比如数值长度；
2. 数据压缩：一些列式数据库并没有使用数据压缩(比如InfiniDB和MonetDB):clown_face:；
3. 基于磁盘：一些列式数据库只能在内存中工作；
4. 多核心并行处理；
5. 分布式：数据可以保存在不同shard上；
6. 支持SQL：兼容ANSI SQL；
7. 向量引擎；
8. 实时更新：支持定义主键，增量存储；
9. 支持索引；
10. 支持**近似计算**：在不要求结果精确的情况下降低计算成本；
11. 自适应Join算法；
12. 支持数据复制和数据完整性；
13. :angry:缺点：1. 没有完整事务支持；2. 不能高频率、低延迟修改删除；3. **稀疏索引不适合单点查询**。
