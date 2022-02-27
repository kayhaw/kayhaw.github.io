---
title: Hive 3.x学习笔记(6)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(6)：Hive调优
hide_table_of_contents: false
---

:pencil:Hive 3.1.2学习笔记第6篇：Hive调优。
<!--truncate-->

## EXPLAIN命令

[`EXPALIN`](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Explain)用于展示查询语句的执行计划，使用语法如下：

```sql
EXPLAIN [EXTENDED|CBO|AST|DEPENDENCY|AUTHORIZATION|LOCKS|VECTORIZATION|ANALYZE] query
```

### 输出结构

EXPLAIN的输出包含如下2个部分：

1. 依赖图描述。如下所示Stage-1是根步骤，Stage-2在Stage-1之后执行，而Stage-0又在Stage-2之后执行：

```bash
STAGE DEPENDENCIES:
  Stage-1 is a root stage
  Stage-2 depends on stages: Stage-1
  Stage-0 depends on stages: Stage-2
```

2. 每个阶段计划，如下所示：

```
STAGE PLANS:
  Stage: Stage-1
    Map Reduce
      Alias -> Map Operator Tree:
        src
            Reduce Output Operator
              key expressions:
                    expr: key
                    type: string
              sort order: +
              Map-reduce partition columns:
                    expr: rand()
                    type: double
              tag: -1
              value expressions:
                    expr: substr(value, 4)
                    type: string
      Reduce Operator Tree:
        Group By Operator
          aggregations:
                expr: sum(UDFToDouble(VALUE.0))
          keys:
                expr: KEY.0
                type: string
          mode: partial1
          File Output Operator
            compressed: false
            table:
                input format: org.apache.hadoop.mapred.SequenceFileInputFormat
                output format: org.apache.hadoop.mapred.SequenceFileOutputFormat
                name: binary_table
 
  Stage: Stage-2
    Map Reduce
      Alias -> Map Operator Tree:
        /tmp/hive-zshao/67494501/106593589.10001
          Reduce Output Operator
            key expressions:
                  expr: 0
                  type: string
            sort order: +
            Map-reduce partition columns:
                  expr: 0
                  type: string
            tag: -1
            value expressions:
                  expr: 1
                  type: double
      Reduce Operator Tree:
        Group By Operator
          aggregations:
                expr: sum(VALUE.0)
          keys:
                expr: KEY.0
                type: string
          mode: final
          Select Operator
            expressions:
                  expr: 0
                  type: string
                  expr: 1
                  type: double
            Select Operator
              expressions:
                    expr: UDFToInteger(0)
                    type: int
                    expr: 1
                    type: double
              File Output Operator
                compressed: false
                table:
                    input format: org.apache.hadoop.mapred.TextInputFormat
                    output format: org.apache.hadoop.hive.ql.io.IgnoreKeyTextOutputFormat
                    serde: org.apache.hadoop.hive.serde2.dynamic_type.DynamicSerDe
                    name: dest_g1
 
  Stage: Stage-0
    Move Operator
      tables:
            replace: true
            table:
                input format: org.apache.hadoop.mapred.TextInputFormat
                output format: org.apache.hadoop.hive.ql.io.IgnoreKeyTextOutputFormat
                serde: org.apache.hadoop.hive.serde2.dynamic_type.DynamicSerDe
                name: dest_g1
```

上述例子中包含2个map/reduce阶段(Stage-1和Stage-2)，以及一个文件系统相关阶段(Stage-0)。Stage-0本质上就是把一个临时目录中的结果移动到表dest_g1对应的目录。sort order项表示用于排序的列，`+`表示升序而`-`表示降序。

每个map/reduce阶段又包含2部分：

1. 从表别名到Map Operator Tree的映射：告诉mapper用于处理特定表行记录(或前一个stage输出)的operator tree。
2. Reduce Operator Tree：处理map/reduce作业的operator tree。例子中Stage-1的Reducer Operator Tree执行部分聚合，而Stage-2的Reducer Operator根据Stage-1结果计算最终聚合结果。

注意当Hive查询没有执行MR程序时，使用[Fetch Operator](#Fetch)。

### CBO从句

CBO从句输出Calcite优化器产生的执行计划，使用语法如下所示：

```sql
EXPLAIN [FORMATTED] CBO [COST|JOINCOST]
```

- COST选项(默认)表示输出使用Calcite默认消耗模型的结果；
- JOINCOST选项表示输出使用join reordering消耗模型的结果。

### AST从句

输出查询SQL的抽象语法树(Abstract Syntax Tree)。

### DEPENDENCY从句

输出执行计划输入部分的额外信息。

### AUTHORIZATION从句

输出执行查询语句需要授权的条目以及失败的授权，加上FORMATTED则返回JSON格式的输出。

```sql
# 执行语句
EXPLAIN AUTHORIZATION SELECT * FROM src JOIN srcpart;
# 输出结果
INPUTS:
  default@srcpart
  default@src
  default@srcpart@ds=2008-04-08/hr=11
  default@srcpart@ds=2008-04-08/hr=12
  default@srcpart@ds=2008-04-09/hr=11
  default@srcpart@ds=2008-04-09/hr=12
OUTPUTS:
  hdfs://localhost:9000/tmp/.../-mr-10000
CURRENT_USER:
  navis
OPERATION:
  QUERY
AUTHORIZATION_FAILURES:
  Permission denied: Principal [name=navis, type=USER] does not have following privileges for operation QUERY [[SELECT] on Object [type=TABLE_OR_VIEW, name=default.src], [SELECT] on Object [type=TABLE_OR_VIEW, name=default.srcpart]]
```

### LOCKS从句

输出执行查询语句需要获取的锁信息，加上FORMATTED则以JSON格式输出。

```sql
# 执行语句
EXPLAIN LOCKS UPDATE target SET b = 1 WHERE p IN (SELECT t.q1 FROM source t WHERE t.a1=5)
# 输出结果
LOCK INFORMATION:
default.source -> SHARED_READ
default.target.p=1/q=2 -> SHARED_READ
default.target.p=1/q=3 -> SHARED_READ
default.target.p=2/q=2 -> SHARED_READ
default.target.p=2/q=2 -> SHARED_WRITE
default.target.p=1/q=3 -> SHARED_WRITE
default.target.p=1/q=2 -> SHARED_WRITE
```

### VECTORIZATION从句

输出Map和Reduce作业没有向量化的原因。

### ANALYZE从句

输出计划真正执行的行数，格式为`(预计行数)/(实际行数)`。

## Fetch

对于某些特定查询，Hive可以不使用map/reduce任务计算而是使用fetch任务。比如`select * from employees`，Hive可以读取employees对应存储目录下文件，解析并输出记录。该行为通过hive-default.xml中的配置项`hive.fetch.task.conversion`设置，Hive提供3个设置值：

- none：禁用fetch，即所有查询都走MR任务；
- minimal：只有select *，在分区字段上过滤，limit限制才使用fetch；
- more：select，过滤，limit时使用fetch任务，包含tablesample和虚拟字段，**默认**。

## 本地模式

当处理数据量较小时，没有必要使用分布式MR任务计算，Hive提供本地模式在单台机器上处理任务，缩短执行时间，设置如下：

```bash
# 1. 开启本地模式
set hive.exec.mode.local.auto=true;
# 2. 设置本地模式最大输入数据量，超过则使用分布式MR任务，默认128MB
set hive.exec.mode.local.auto.inputbytes.max=50000000;
# 3. 设置本地模式最多输入文件数，超过则使用分布式MR任务，模式4
set hive.exec.mode.local.auto.input.files.max=10;
```

## 表优化

### Map Join

[Map Join](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+JoinOptimization)指当关联查询的两个表大小相差过大时，可以将小表转为HashMap放在内存，在mapper完成join。相关设置如下：

```bash
# 设置开启map join，默认为true
set hive.auto.convert.join = true;
# 设置区分大小表的阈值，默认25MB
set hive.mapjoin.smalltable.filesize = 25000000;
```

1. 本地任务：
    1. 在本地上执行标准的表扫描获取小表数据；
    2. 在内存中构建HashTable；
    3. 将HashTable写到本地磁盘；
    4. 将HashTable上传到HDFS；
    5. 将HashTable添加到分布式缓存；
2. Map任务：
    1. 从本地(分布式缓存)读取HashTable加载到内存；
    2. 根据HashTable匹配记录；
    3. 合并匹配记录并输出；
3. **没有Reduce任务**。

### Join优化

1. 空key过滤
2. 空key转换
3. SMB(Sort Merge Bucket)：两个大的分桶表关联查询，需要设置如下参数

```bash
set hive.optimize.bucketmapjoin = true;
set hive.optimize.bucketmapjoin.sortedmerge = true;
set hive.input.format=org.apache.hadoop.hive.ql.io.BucketizedHiveInputFormat;
```

### Group By优化

默认情况下，Map阶段相同key的数据发送给同一个reducer处理，当某个key的数据远超过其他key的就会发生数据倾斜，此时可以开启map端进行部分聚合。

```bash
# 1. 是否在mapper进行聚合，默认true
set hive.map.aggr = true
# 2. 在mapper进行聚合的条数
set hive.groupby.mapaggr.checkinterval = 100000
# 3. 有数据倾斜时进行负载均衡，默认false
set hive.groupby.skewindata = true
```

设置skewindata为true后，生成的查询计划会有两个MR任务：第一个MR任务的mapper随机输出到reducer，每个reducer做部分聚合操作，使得相同key分布到不到reducer中；第二个MR任务再把预处理结果按照key分发到reducer中，完成最终的聚合操作。

### 其他

- COUNT(DISTINCT)优化：当使用count distinct时可能出现某个reducer数据量过大情况，此时使用先GROUP BY再COUNT的方式优化；
- 笛卡尔积：尽量避免，JOIN时添加有效的ON条件
- 行列过滤：尽量使用分区字段过滤，关联查询时副表的过滤提前

```sql
select o.id from bigtable b join bigtable o on o.id = b.id where o.id <= 10;
select b.id from bigtable b join (select id from bigtable where id <= 10) o on b.id = o.id;
```

## 严格模式

通过设置如下严格模式参数，防止用户进行危险操作：

1. `hive.strict.checks.no.partition.filter`：设置为true要求查询分区表时需要带上分区过滤；
2. `hive.strict.checks.orderby.no.limit`：设置为true要求使用order by的查询语句必须使用limit限制数据量；
3. `hive.strict.checks.cartesian.product`：设置为true要求查询不会产生笛卡尔积。
