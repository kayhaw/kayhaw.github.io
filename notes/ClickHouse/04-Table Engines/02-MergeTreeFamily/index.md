---
title: MergeTree Family
slug: /ClickHouse/Database-Engines/MergeTree-Family
---

MergeTree表引擎家族是ClickHouse数据存储的核心能力，提供弹性并且高性能的数据存取特性：列式存储、自定义分区、稀疏索引和二级索引等。其中MergeTree作为默认表引擎适合广泛场景，ReplicatedMergeTree表引擎提供数据去重，其他表引擎针对特定场景提供额外功能。MergeTree表引擎家族的缺点是过于重量，当处理多张小表时建议使用Log表引擎家族。

顾名思义，MergeTree表引擎家族将大量插入数据按分区快速写入，然后后台执行Merge操作将分区合并，相比于在插入时不断重写数据更加高效。它们的主要特性有：

- 通过主键存储数据；
- 使用分区；
- 支持数据复制；
- 支持数据采样。

:::warning
注意Merge表引擎不属于MergeTree表引擎家族。
:::
