---
title: Hive 3.x学习笔记(3)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(3)：Hive SQL
hide_table_of_contents: false
---

:pencil:Hive 3.1.2学习笔记第3篇：Hive SQL。
<!--truncate-->

Hive SQL(HQL)分为DDL(数据定义语言，Data Definition Language)、数据查询和DML(数据操控语言，Data Manipulation Language)，更多内容详见[Hive SQL Language Manual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual)。

## DDL

- 创建数据库：

```sql
CREATE DATABASE [IF NOT EXISTS] database_name
[COMMENT database_comment]
[LOCATION hdfs_path]
[WITH DBPROPERTIES (property_name=property_value, ...)];
```

- 显示数据库信息(加extended显示详情)：`desc database [extended] <dbname>`；

- **创建表**：

```sql
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name    -- (Note: TEMPORARY available in Hive 0.14.0 and later)
  [(col_name data_type [column_constraint_specification] [COMMENT col_comment], ... [constraint_specification])]
  [COMMENT table_comment]
  [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
  [CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]
  [SKEWED BY (col_name, col_name, ...)                  -- (Note: Available in Hive 0.10.0 and later)]
     ON ((col_value, col_value, ...), (col_value, col_value, ...), ...)
     [STORED AS DIRECTORIES]
  [
   [ROW FORMAT row_format] 
   [STORED AS file_format]
     | STORED BY 'storage.handler.class.name' [WITH SERDEPROPERTIES (...)]  -- (Note: Available in Hive 0.6.0 and later)
  ]
  [LOCATION hdfs_path]
  [TBLPROPERTIES (property_name=property_value, ...)]   -- (Note: Available in Hive 0.6.0 and later)
  [AS select_statement];   -- (Note: Available in Hive 0.5.0 and later; not supported for external tables)
 
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name
  LIKE existing_table_or_view_name
  [LOCATION hdfs_path];
```

### 外部表和管理表

Hive默认创建的表都是管理表(Managed Table，也称内部表)，默认将表数据放在`hive.metastore.warehouse.dir`配置项指定的目录下。**当删除管理表时，Hive会删除表数据而删除外部表时不会删除表数据，仅仅删除表元信息**。

:::info 该使用哪种表？
原始数据先保存到外部表，在此基础上统计分析产生的结果保存到内部表
:::

通过`ALTER TABLE <tablename> SET TBLPROPERTIES('EXTERNAL'='TRUE');`或者`ALTER TABLE <tablename> SET TBLPROPERTIES('EXTERNAL'='FALSE');`来转换管理表和内部表，**注意：('EXTERNAL'='TRUE')和('EXTERNAL'='FALSE')为固定写法，区分大小写**。

## DML

根据[Hive DML Wiki](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML)分为：数据导入、数据导出、数据清除、数据更新和数据合并5个部分，其中数据DELETE清除、数据更新UPDATE和数据合并MERGE仅适用于事务表。

### 数据导入

#### 文件导入

通过文件导入数据到表，语法如下。加LOCAL表示从本地文件导入(**拷贝到HDFS，原文件还在**)，否则从HDFS中导入(**移动到表数据目录，原文件“删除”**)。

```sql
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]
 
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)] [INPUTFORMAT 'inputformat' SERDE 'serde'] (3.0 or later)
```

#### 简单插入

简单插入数据到表，语法如下。`INTO`追加写数据，`OVERWRITE`覆盖写数据。

```sql
INSERT INTO[OVERWRITE] TABLE tablename [PARTITION (partcol1[=val1], partcol2[=val2] ...)] VALUES values_row [, values_row ...]
# 其中values_row := ( value [, value ...] )，而value要么是null或者任何有效的SQL字面量
```

#### 查询SQL插入

将SQL查询结果插入到表，语法如下。**注意只有`INSERT OVERWRITE`时才能搭配`IF NOT EXISTS`，表示插入时创建不存在的分区；当表属性`auto.purge`为true并且为管理表时，覆盖写会将旧数据直接删除而不是移到Trash**。标准插入和动态分区插入的区别在于分区字段不要求提供值。

```sql
# 1. 标准语法
INSERT OVERWRITE TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...) [IF NOT EXISTS]] select_statement1 FROM from_statement;

INSERT INTO TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...)] select_statement1 FROM from_statement;

# 2. 多条插入
FROM from_statement
INSERT OVERWRITE TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...) [IF NOT EXISTS]] select_statement1
[INSERT OVERWRITE TABLE tablename2 [PARTITION ... [IF NOT EXISTS]] select_statement2]
[INSERT INTO TABLE tablename2 [PARTITION ...] select_statement2] ...;

FROM from_statement
INSERT INTO TABLE tablename1 [PARTITION (partcol1=val1, partcol2=val2 ...)] select_statement1
[INSERT INTO TABLE tablename2 [PARTITION ...] select_statement2]
[INSERT OVERWRITE TABLE tablename2 [PARTITION ... [IF NOT EXISTS]] select_statement2] ...;

# 3. 动态分区插入
INSERT OVERWRITE TABLE tablename PARTITION (partcol1[=val1], partcol2[=val2] ...) select_statement FROM from_statement;

INSERT INTO TABLE tablename PARTITION (partcol1[=val1], partcol2[=val2] ...) select_statement FROM from_statement;
```

#### 其他方式

1. 根据查询SQL结果创建表并插入数据，用于生成中间表，语法为`CREATE TABLE IF NOT EXISTS tablename AS select_statement FROM from_statement`；
2. 指定加载数据路径创建表；
3. 使用`IMPORT`将数据导入到表，只能使用`EXPORT`输出的内容导入！

:::danger LOAD、INSERT和IMPORT导入数据的区别

- LOAD仅仅是添加、移动HDFS文件，不创建表和分区
- INSERT需要执行MR程序，在向分桶表插入数据时必须使用，不创建表但会创建分区
- IMPORT只能导入EXPORT输出的内容，自动创建表/分区。如果表存在，非分区表要求为空，分区表要求插入分区不存在。
:::

### 数据导出

#### INSERT导出

```sql
# 1. 标准语法
INSERT OVERWRITE [LOCAL] DIRECTORY directory1
  [ROW FORMAT row_format] [STORED AS file_format] (Note: Only available starting with Hive 0.11.0)
  SELECT ... FROM ...

# 2. 多条插入
FROM from_statement
INSERT OVERWRITE [LOCAL] DIRECTORY directory1 select_statement1
[INSERT OVERWRITE [LOCAL] DIRECTORY directory2 select_statement2] ...

row_format
  : DELIMITED [FIELDS TERMINATED BY char [ESCAPED BY char]] [COLLECTION ITEMS TERMINATED BY char]
        [MAP KEYS TERMINATED BY char] [LINES TERMINATED BY char]
        [NULL DEFINED AS char] (Note: Only available starting with Hive 0.13)
```

#### Hadoop命令导出

使用`hadoop fs -get`命令下载表数据文件到本地。

#### Hive Shell命令导出

使用格式：`hive -e[-f] 执行sql或者脚本名 > 输出文件`。

#### EXPORT

`EXPORT`命令用于将表数据**连同元数据**一块导出到特定输出位置，和`IMPORT`搭配使用在两个Hadoop集群之间迁移Hive表(元数据库可以不同)。

```sql
EXPORT TABLE tablename [PARTITION (part_column="value"[, ...])]
  TO 'export_target_path' [ FOR replication('eventid') ]
```

### 数据清除

1. 使用`DELETE`删除表数据：`DELETE FROM tablename [WHERE expression]`；
2. 使用`TRUNCATE`删除表或分区数据，**只适用于管理表**，语法如下：

```sql
# 从Hive 4.0开始TABLE关键字可省略，不指定分区则删除所有分区
TRUNCATE [TABLE] table_name [PARTITION partition_spec];
 
partition_spec:
  : (partition_column = partition_col_value, partition_column = partition_col_value, ...)
```

:::danger DELETE、TRUNCATE和DROP的区别

1. 类型：DELETE属于DML，而TRUNCATE和DROP属于DDL；
2. 是否保留元数据：DELETE和TRUNCATE仅删除表数据，表结构依然存在，但DROP删除表数据同时删除表结构；
3. 对目标表要求：DELETE仅用于事务表，TRUNCATE仅用于管理表。
:::

## 总结

1. LOCAL加载数据复制文件，不加LOCAL则移动文件；
2. 插入数据LOAD、INSERT和IMPORT的区别；
3. 清除数据DELETE、TRUNCATE和DROP的区别；
4. DELETE、UPDATE和MERGE仅适用于事务表。
