---
title: MySQL基础知识总结(1)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - MySQL Basic
  - Summary
description: MySQL基础知识总结(1)
hide_table_of_contents: false
---

MySQL基础知识总结-第一篇
<!--truncate-->

## DATETIME和TIMESTAMP异同

DATETIME和TIMESTAMP都可以用来表示`年月日时分秒`的时间（DATE类型只能到`年月日`），但细究起来它们还有如下区别：

|类型|存储长度|范围|精度|
|----|-------|----|---|
|datetime|8字节|1000-01-01 00:00:00.000000到9999-12-31 23:59:59.999999|6|
|timestamp|4字节|1970-01-01 00:00:01.000000到2038-01-19 03:14:07.999999|6|

当TIMESTAMP字段插入一个值时，根据**当前时区**将插入时间转为UTC时间；当读取TIMESTAMP字段值时，又将UTC时间转为客户端当前时区返回。**DATETIME存储值与时区无关**。

:::caution 关于时间精度
DATETIME和TIMESTAMP都的精度都是6位，表示秒级可以精确到小数点后6位，但在较早的MySQL版本(5.6.5之前)中秒级没有小数部分。
:::
