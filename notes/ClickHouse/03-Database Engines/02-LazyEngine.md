---
layout: article
title: Lazy
slug: /ClickHouse/DataBase-Engines/Lazy
tags:
  - ClickHouse
  - Learning Notes
---

Lazy库引擎将表放在内存中，经过指定`expiration_time_in_seconds`时间后自动删除，**只适用于Log系列表引擎**。Lazy库引擎针对存储多个小数据量的Log表优化，其特点是每次访问间隔很长。

```sql
CREATE DATABASE testlazy ENGINE = Lazy(expiration_time_in_seconds);
```
