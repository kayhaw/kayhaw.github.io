---
layout: article
title: 存储模型
slug: /ClickHouse/StorageStruct
tags:
  - ClickHouse
  - Learning Notes
---

ClickHouse默认存储数据路径为`/var/lib/clickhouse`，其目录结构如下所示，主要关注`data`和`metadata`两个文件夹，它们分别是数据和元数据的存储目录：

```bash
/var/lib/clickhouse
├── access
├── cores
├── data
│   ├── default
│   │   └── t_order_mt -> /var/lib/clickhouse/store/363/363227c2-9607-4851-b632-27c296079851/
│   └── system
│       ├── asynchronous_metric_log -> /var/lib/clickhouse/store/d91/d91d3f42-cca2-4e72-991d-3f42cca25e72/
│       ├── metric_log -> /var/lib/clickhouse/store/7b8/7b88edc1-5cac-4dad-bb88-edc15caccdad/
│       ├── query_log -> /var/lib/clickhouse/store/985/98565903-6902-459e-9856-59036902159e/
│       ├── query_thread_log -> /var/lib/clickhouse/store/853/8538a360-a801-4e24-8538-a360a8013e24/
│       └── trace_log -> /var/lib/clickhouse/store/eff/effebb87-ed11-410d-affe-bb87ed11810d/
├── dictionaries_lib
├── flags
├── format_schemas
├── metadata
│   ├── default -> /var/lib/clickhouse/store/7e7/7e7fbe9e-5da3-4c88-be7f-be9e5da33c88/
│   ├── default.sql
│   ├── system -> /var/lib/clickhouse/store/452/452c9386-1d14-4bcf-852c-93861d149bcf/
│   └── system.sql
├── metadata_dropped
├── preprocessed_configs
├── status
├── store
├── tmp
└── user_files
```

对于data目录，它又以库名划分出多个子目录，每个库目录下又以表名划分出多个子目录，**并且子目录实际上是指向store子目录的软链接**。类似地，metadata目录下以库名划分子目录，该子目录也是store子目录的软链接。

## 表元数据目录

进入default库的元数据目录`metadata/default`，这里存放以表命名的sql文件，类似DDL但并不完全相同：

```sql title=metadata/default/t_order_mt.sql
ATTACH TABLE _ UUID '363227c2-9607-4851-b632-27c296079851'
(
    `id` UInt32,
    `sku_id` String,
    `total_amount` Decimal(16, 2),
    `create_time` DateTime
)
ENGINE = MergeTree
PARTITION BY toYYYYMMDD(create_time)
PRIMARY KEY id
ORDER BY (id, sku_id)
SETTINGS index_granularity = 8192
```

## 表数据目录

进入表t_order_mt的数据目录，其结构如下所示，分别是分区目录、detached目录和版本信息文件。

```bash
/var/lib/clickhouse/data/default/t_order_mt/
├── 20200601_1_1_0
├── ...
├── 20200602_2_2_0
│   ├── checksums.txt     # 数据校验和文件
│   ├── columns.txt       # 列定义文件，包含列名和类型
│   ├── count.txt         # 分区记录总数文件
│   ├── data.bin          # 数据文件
│   ├── data.mrk3         # 数据标记文件，关联primary.idx和data.bin
│   ├── default_compression_codec.txt   # 压缩格式，默认LZ4
│   ├── minmax_create_time.idx          # 最大最小创建时间索引文件
│   ├── partition.dat     # 分区
│   └── primary.idx       # 主键索引文件
├── detached              # DETACH语句执行后分区存放位置
└── format_version.txt
```

其中，分区目录的命名格式为`分区值_最小块号_最大块号_合并次数`，该目录下又包含各个分区数据和元数据信息。文本文件count.txt记录该分区的记录总数，因此ClickHouse查询`select count(*)`可以快速得到结果而不必遍历数据文件。

- [ ] 补充mrk3文件是如何联系idx和bin文件
