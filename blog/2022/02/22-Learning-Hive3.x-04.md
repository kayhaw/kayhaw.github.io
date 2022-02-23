---
title: Hive 3.x学习笔记(4)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(4)：分区表和分桶表
hide_table_of_contents: false
---

:pencil:Hive 3.1.2学习笔记第4篇：分区表和分桶表。
<!--truncate-->

## 分区表

[Hive分区表](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-PartitionedTables)对应HDFS上表数据目录下的子目录，该子目录下包含分区的所有数据文件。Hive分区就是把大数据集按照业务需要分割为小数据集放在不同目录下，比如按天创建分区目录来存储数据，这样在where子句中指定分区可以加快查询速度。

### 基本操作

1. 创建分区表的基本语法如下所示，注意partition加ed。分区字段是表的伪列，因此不能和表字段重名，否则报错"FAILED: Error in semantic analysis: Column repeated in partitioning columns"。

```sql
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name    -- (Note: TEMPORARY available in Hive 0.14.0 and later)
  [(col_name data_type [column_constraint_specification] [COMMENT col_comment], ... [constraint_specification])]
  [COMMENT table_comment]
  [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
```

2. 加载文件到分区表必须指定分区字段，注意partition没有加ed。

```sql
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename PARTITION (partcol1=val1, partcol2=val2 ...)
```

3. 查询分区数据，只需要把分区字段当成普通字段放在where子句中过滤即可。

4. 增加/删除分区，相当于新建/删除文件夹，**注意添加多个分区没有逗号，但删除多个分区有逗号**。

```sql
ALTER TABLE tablename ADD PARTITION(partcol1=val1) [ PARTITION(partcol2=val2)];
ALTER TABLE tablename DROP PARTITION(partcol1=val1) [, PARTITION(partcol2=val2)];
```

5. 查看分区表分区信息:

```sql
SHOW PARTITIONS tablename;
DESC FORMATTED tablename;
```

### 多级分区

当每天的数据量也很大时，可以按照小时继续分区(即在按天为目录下创建按小时的目录)，即创建多级分区(指定多个分区字段)。同样地，对于多级分区表的数据加载，使用LOAD DATA时要指定所有分区字段的值，不然Hive不知道该放哪个子文件夹下(动态分区可以)。

现在通过`dfs -mkdir`自行创建文件夹和`dfs -put`上传数据文件，此时执行SELECT语句查询不到结果。要让分区表和数据关联，有如下3种方式：

1. 执行修复命令`MSCK REPAIR TABLE tablename`；
2. 添加分区`ALTER TABLE tablename PARTITION(partcol1=val1) [ PARTITION(partcol2=val2)]`；
3. 使用`LOAD DATA`上传数据文件。

### 动态分区

静态分区指插入数据时显式指定分区字段名和分区字段值，而动态分区指Hive根据表字段值自动地创建对应分区并将数据插入分区，开启动态分区需要进行如下配置：

1. 配置`hive.exec.dynamic.partition`，默认为true表示开启动态分区；
2. 配置`hive.exec.dynamic.partition.mode`，默认为`strict`表示至少指定一个分区为静态分区，`nostrict`模式表示允许所有分区字段都可以使用动态分区；
3. 配置`hive.exec.max.dynamic.partitions`，表示所有指定MR节点上最多可以创建动态分区的数量，默认1000；
4. 配置`hive.exec.max.dynamic.partitions.pernode`，表示每个MR节点上最多可以创建动态分区的数量，默认100；
5. 配置`hive.exec.max.created.files`，表示整个MR程序中农最大可以创建HDFS文件数量，默认100000；
6. 可选配置`hive.error.on.empty.partition`，表示有空分区生成时是否抛出异常，默认false，不需要设置。

[Hive 3.x新增特性](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML#LanguageManualDML-DynamicPartitionInserts)：动态分区INSERT-SELECT插入可以不用指定分区字段，甚至严格模式都不需要关闭。

## 分桶表

分桶表将表数据文件拆分为多个小文件来更细粒度的管理数据，即分区针对的是数据存储路径，而分桶针对的是数据文件。创建分桶表的基本语法如下：

```sql
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name    -- (Note: TEMPORARY available in Hive 0.14.0 and later)
  [(col_name data_type [column_constraint_specification] [COMMENT col_comment], ... [constraint_specification])]
  [CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]
```

**和分区表要求分区字段必须不能和表字段重名相反，分桶表要求分桶字段一定是表字段名**。和PARTITIONED BY一样注意CLUSTERED BY加了ed。分桶算法是计算分桶字段的哈希值，然后对桶个数取模决定记录放在哪个桶中。操作分桶表时需要注意：

1. 设置reduce个数为-1或者大于桶数，让Job自行决定用多少个reduce；
2. 从HDFS上LOAD数据到分桶表，防止本地文件找不到；
3. 不要使用本地模式。

### 抽样查询

Hive提供TABLESAMPLE从句用于查询抽样数据而不是整个表数据，分为分桶表抽样和块抽样两种，语法如下：

```sql
# 分桶表抽样
selectstatement FROM fromstatement TABLESAMPLE (BUCKET x OUT OF y [ON colname])
# 数据块抽样
selectstatement FROM fromstatement TABLESAMPLE (n PERCENT)
```

对于分桶表抽样，数据根据抽样列colname随机地分成y份，编号从1到y，然后返回编号为x的数据，建议y是表桶数的因子或倍数。colname非分区字段，可以设置为`rand()`表示对整行数据抽样。对于普通表使用TABLESAMPLE从句会扫描整个表数据，导致效率低，因此往往将其运用到分桶表上，并且抽样列colname和分桶字段相同。例如分桶表桶数为32，对于`TABLESAMPLE(BUCKET 3 OUT OF 16 ON id)`，它会选择第3个和第19个桶数据合成32/16=2个桶返回，而对于`TABLESAMPLE(BUCKET 3 OUT OF 64 ON id)`，它会选择第3个桶的1/2数据返回。**注意x必须小于等于y，否则报错**。

对于数据块抽样，它基于行数按照数据块的百分比进行抽样，它不适用所有文件格式。

## 总结

1. 分区就是分目录，多个分区字段对应多层子目录；
2. 在Hive3.x之前，动态分区需要关闭严格模式；
