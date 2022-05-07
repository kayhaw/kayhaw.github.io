---
layout: article
title: Log Family
slug: /ClickHouse/Table-Engines/Log-Family
tags:
  - ClickHouse
  - Learning Notes
---

Log表引擎家族用于处理多张小表的场景，可以将数据存放在HDFS或者S3，特性如下：

- 写时追加；
- 写时对表上锁，其他查询阻塞，无写操作时读操作并发执行；
- 不支持**mutation**；
- 不支持索引；
- 不支持原子写入，这意味着写操作异常会造成数据损坏。

## Log

Log表引擎通过marks文件，能快速查找指定行数的记录，因此可以多线程读取数据。由于写操作会阻塞其他所有操作，因此该引擎只适用于只写一次的临时数据来测试或演示。

```sql
CREATE TABLE log_table
(
    timestamp DateTime,
    message_type String,
    message String
)
ENGINE = Log;

INSERT INTO log_table VALUES (now(),'REGULAR','The first regular message');
INSERT INTO log_table VALUES (now(),'REGULAR','The second regular message'),(now(),'WARNING','The first warning message');
```

SELECT查询结果以及数据目录结构如下：

```bash
$ select * from log_table;
┌───────────timestamp─┬─message_type─┬─message────────────────────┐
│ 2022-05-07 07:58:36 │ REGULAR      │ The first regular message  │
│ 2022-05-07 07:58:44 │ REGULAR      │ The second regular message │
│ 2022-05-07 07:58:44 │ WARNING      │ The first warning message  │
└─────────────────────┴──────────────┴────────────────────────────┘
$ ls /var/lib/clickhouse/data/default/log_table
__marks.mrk  message.bin  message_type.bin  sizes.json  timestamp.bin
```

## StripeLog

StripeLog表引擎将所有列数据追加写入到`data.bin`文件，并修改`index.mrk`文件记录**每列**数据的偏移量。**不允许修改或者删除操作**。StripLog可以通过mrk文件并发读取数据，这意味着返回数据顺序是不固定的，需要加上`ORDER BY`来排序。

```sql
CREATE TABLE stripe_log_table
(
    timestamp DateTime,
    message_type String,
    message String
)
ENGINE = StripeLog;

INSERT INTO stripe_log_table VALUES (now(),'REGULAR','The first regular message');
INSERT INTO stripe_log_table VALUES (now(),'REGULAR','The second regular message'),(now(),'WARNING','The first warning message');
```

SELECT查询结果以及数据目录结构如下所示：

```bash
$ select * from stripe_log_table;
┌───────────timestamp─┬─message_type─┬─message───────────────────┐
│ 2022-05-07 07:52:55 │ REGULAR      │ The first regular message │
└─────────────────────┴──────────────┴───────────────────────────┘
┌───────────timestamp─┬─message_type─┬─message────────────────────┐
│ 2022-05-07 07:54:57 │ REGULAR      │ The second regular message │
│ 2022-05-07 07:54:57 │ WARNING      │ The first warning message  │
└─────────────────────┴──────────────┴────────────────────────────┘
$ SELECT * FROM stripe_log_table ORDER BY timestamp;
┌───────────timestamp─┬─message_type─┬─message────────────────────┐
│ 2022-05-07 07:52:55 │ REGULAR      │ The first regular message  │
│ 2022-05-07 07:54:57 │ REGULAR      │ The second regular message │
│ 2022-05-07 07:54:57 │ WARNING      │ The first warning message  │
└─────────────────────┴──────────────┴────────────────────────────┘
$ ls /var/lib/clickhouse/data/default/stripe_log_table
data.bin  index.mrk  sizes.json
```

## TinyLog

TinyLog表引擎如其名称一样转为小表打造(最多100万条记录)，使用单线程读取，典型用于写一次读多次的场景，比如作为小批量处理的中间结果。当处理多个小表时，它比Log表引擎更加简单。

```sql
CREATE TABLE tiny_log_table
(
    timestamp DateTime,
    message_type String,
    message String
)
ENGINE = TinyLog;

INSERT INTO tiny_log_table VALUES (now(),'REGULAR','The first regular message')
INSERT INTO tiny_log_table VALUES (now(),'REGULAR','The second regular message'),(now(),'WARNING','The first warning message')
```

SELECT查询结果以及数据目录结构如下：

```bash
$ select * from tiny_log_table;
┌───────────timestamp─┬─message_type─┬─message────────────────────┐
│ 2022-05-07 07:14:44 │ REGULAR      │ The first regular message  │
│ 2022-05-07 07:14:51 │ REGULAR      │ The second regular message │
│ 2022-05-07 07:14:51 │ WARNING      │ The first warning message  │
└─────────────────────┴──────────────┴────────────────────────────┘
$ ls /var/lib/clickhouse/data/default/tiny_log_table
message.bin  message_type.bin  sizes.json  timestamp.bin
```

:::tip 关于`sizes.json`文件
Log表引擎家族的数据目录都包含sizes.json文件，如下所示，它是经过压缩的json文本，记录每个bin文件的字节大小，其中`%2E`是`.`的URL编码。

```javascript
{
  "yandex": {
    "__marks%2Emrk": {
      "size": "48"
    },
    "message%2Ebin": {
      "size": "133"
    },
    "message_type%2Ebin": {
      "size": "77"
    },
    "timestamp%2Ebin": {
      "size": "64"
    }
  }
}
```

:::

## 总结

1. Log引擎家族适用于数量不超过100万的多张小表的读写，使用场景写少读多；
2. 从表数据目录结构比较：
   1. Log和TinyLog引擎为每个列单独设置bin文件，而StripeLog引擎只包含data.bin文件；
   2. Log和引擎生成mrk文件，而TinyLog没有；
   3. 都包含sizes.json文件记录文件大小的元信息。
3. 从读取并发度看，Log和StripLog引擎由于mrk文件可以多线程读取，而TinyLog没有mrk文件只能单线程读取；
4. 从SELECT结果看，StripLog引擎结果无序，按照INSERT插入顺序分批显示，而Log和TinyLog不会。
