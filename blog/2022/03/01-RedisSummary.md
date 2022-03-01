---
title: Redis总结
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Redis
  - Summary
description: Redis总结
hide_table_of_contents: false
---

:pencil:Redis总结。
<!--truncate-->

## 数据结构

Redis常用数据结构5种：String、List、Set、ZSet和Hash，这些数据结构又由如下底层数据结构支撑。

### SDS

Redis的字符串类型基于SDS(Simple Dynamic String)，相比于C语言的字符串，它具有如下优势：

1. 字段len记录字符串长度，不需要使用`strlen`方法遍历字符串计算；
2. 空间预分配：为字符串分配空间时会申请额外的空间；
3. 惰性空间释放：SDS缩短时不会回收多余空间，而是使用free字段记录多余空间，后续append操作直接使用减少内存申请次数。

### zipList

压缩列表是list、hash和sorted set底层实现，压缩列表并不是指使用某种压缩算法来节省空间，而是使用连续内存空间来节省，ziplist又分为如下部分：

- zlbytes：4bytes，保存ziplist占用的内存字节数；
- zltail：4bytes，保存尾节点到起始地址的偏移量，可以快速定位到尾节点；
- zllen：2bytes，保存压缩列表中的节点个数；
- entry：列表节点
  - previous_entry_length：前一个节点的长度；
  - encoding：content的内容类型和长度；
  - content：节点内容。
- zlend：表示压缩列表结束的特殊符号`0xFF`。

### skipList

跳表skipList是一种有序的数据结构，Redis的sorted set(zset)基于它实现。

## Redis为什么快？

### 单线程模型

Redis的单线程模式是指Redis网络IO(Redis 5.x之后为多线程)以及K-V读写由一个线程来执行，而Redis持久化、集群同步和异步删除是由其他线程执行，并不是说Redis程序就一个线程工作。Redis键值对的读写是单线程的，具有如下优势：

1. 避免多线程上下文切换时的开销；
2. 避免线程创建开销；
3. 避免多线程竞争问题；
4. 代码清晰，逻辑简单。

### I/O多路复用

Redis使用epoll加自行实现的事件框架来处理连接请求，不会阻塞在某个特定的客户端请求处理上，因此可以同时和多个客户端连接处理请求，提升并发性。

### 全局Hash表

Redis使用一个全局Hash表来保存所有键值对，如下图所示。key类型为String，value类型为redisObject。

### 如何处理Hash冲突

Redis使用链表方解决hash冲突，但是当链表长度过长时就会导致查询性能下降，此时需要增加底层hash数组的长度并rehash来进行扩容。和Java HashMap在hash数组负载达到0.75不同，Redis hash表在负载为1时进行扩容rehash，并且采用**渐进式rehash**。hash表有2个底层数组以及rehashidx标识，初始hash表长度为4，rehashidx为-1，当元素个数达到4时扩容为原来2倍。

1. 为ht[1]分配空间，让全局hash表同时指向ht[0]和ht[1]；
2. 设置rehashxid为0，标识rehash开始；
3. 每次增删改查时，将ht[0]的元素rehash到ht[1]，rehashidx加1；
4. 随着操作执行，最终ht[0]的元素都会被rehash到ht[1]上，此时将rehashidx置为-1，标识rehash结束。

## 持久化

### RDB

### AOF

## 缓存失效情况

### 缓存雪崩

出现原因：极短时间内，查询大量key集中失效，导致所有请求转到数据库，对数据库造成压力。

解决方案：

1. 加锁排队，控制请求；
2. 设置过期标记更新缓存；
3. 构建多级缓存架构；
4. 不同key过期时间分散开，避免集中失效。

### 缓存穿透

出现原因：redis查不到数据，再深一点的就是这个key没有值，或者恶意请求不存在的key，redis没有并且数据库也没有，进行了2次无用的查询。

解决方案：

1. 设置null缓存，设置较短的过期时间
2. 设置白名单，排除恶意请求ip
3. 使用布隆过滤器

### 缓存击穿

出现原因：**某个**key过期，大量访问请求该key，导致数据库压力增大。

解决方案：

1. 预先设置热门数据；
2. 实时调整过期时间；
3. 使用锁。

### 缓存预热

系统上线后先直接把缓存数据加载到redis，不是等到第一次用户请求时先查询数据库在加载到redis。
