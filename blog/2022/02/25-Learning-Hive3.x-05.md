---
title: Hive 3.x学习笔记(5)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(5)：文件压缩和存储
hide_table_of_contents: false
---

:pencil:Hive 3.1.2学习笔记第5篇：文件压缩和存储。
<!--truncate-->

## 文件压缩

Hadoop支持的压缩算法如下表所示：

| 压缩格式  | 算法    | 扩展名   | 是否可切分     | 解/编码器                                   | Hadoop是否自带 |
| -------- | ------- | -------- | ------------- | ------------------------------------------ | -------------- |
| deflate  | DEFLATE | .deflate | 否            | org.apache.hadoop.io.compress.DefaultCodec | 是            |
| Gzip     | DEFLATE | .gz      | 否            | org.apache.hadoop.io.compress.GzipCodec    | 是            |
| bzip2    | bzip2   | .bz2     | 是            | org.apache.hadoop.io.compress.BZip2Codec   | 是            |
| LZO      | LZO     | .lzo     | 是(需要建索引) | com.hadoop.compression.lzo.LzopCodec       | 否            |
| Snappy   | Snappy  | .snappy  | 否            | org.apache.hadoop.io.compress.SnappyCodec  | 否            |

各压缩算法性能比较：

- 压缩比：bzip2(gzip) > lzo(snappy)
- 压缩、解压速率：snappy(lzo) > gzip > bzip

:::info 为什么Hadoop没有自带LZO和Snappy？
LZO和Snappy采用GPL协议，而Hadoop是Apache协议。
:::

### 压缩配置

修改mapred-site.xml文件或者通过hive set命令，相关参数如下所示：

| 参数名 | 默认值 | 备注 |
| ----- | ------ | --- |
| io.compression.codecs | org.apache.hadoop.io<br/>.compress.DefaultCodec  | Hadoop根据文件扩展名判断是否支持某种解码器，在core-site.xml中配置 |
| mapreduce.map<br/>.output.compress | false | 设置为true开启压缩 |
| mapreduce.map<br/>.output.compress.codec  | org.apache.hadoop.io<br/>.compress.DefaultCodec | Mapper压缩格式 |
| mapreduce.output<br/>.fileoutputformat.compress | false  | 设置为true开启压缩 |
| mapreduce.output<br/>.fileoutputformat.compress.codec | org.apache.hadoop.io<br/>.compress.DefaultCodec | 使用gzip或者bzip2 |
| mapreduce.output<br/>.fileoutputformat.compress.type  | RECORD | **SequenceFile**输出使用的压缩类型，另可选NONE和BLOCK |

### 开启Mapper压缩

1. 开启Hive中间传输数据压缩：`set hive.exec.compress.intermediate=true;`；
2. 开启Hadoop中Mapper输出压缩：`set mapreduce.map.output.compress=true;`；
3. 设置Hadoop中Mapper压缩格式：`set mapreduce.map.output.compress.codec=org.apache.hadoop.io.compress.SnappyCodec;`；

### 开启Reducer压缩

1. 开启Hive最终输出数据压缩功能：`set hive.exec.compress.output=true;`；
2. 开启Hadoop中Reducer输出压缩：`set mapreduce.output.fileoutputformat.compress=true;`；
3. 设置Hadoop中Reducer压缩格式：`set mapreduce.output.fileoutputformat.compress.codec=org.apache.hadoop.io.compress.SnappyCodec;`；
4. 设置Hadoop中Reducer压缩单位：`set mapreduce.output.fileoutputformat.compress.type=BLOCK;`；

其中mapreduce.output.fileoutputformat.compress.type参数仅用于编码方式设置为SequenceFile时，默认为RECORD，但建议使用BLOCK。

## 文件存储

Hive支持的文件存储格式有TEXTFILE、SEQUENCEFILE、ORC和PARQUET。其中TEXTFILE和SEQUENCEFILE基于行存储，而ORC和PARQUET基于列存储。

### 行/列式存储

行式存储和列式存储如下图所示，前者以一行数据为单位依次存储，后者以一列数据为单位依次存储。

查询满足条件的一行数据时，列式存储需要取每个聚集的字段找到对应列值，而行存储只需要找到其中一个值，其余值都在相邻地方，此时行式存储查询速度优于列式存储。

由于每个字段的数据聚集存储，当只需要查询少数几个字段时大大减少读取数据量。由于每个字段类型相同，列式存储可以设计更好的压缩算法。

### TEXTFILE格式

Hive使用的默认格式，不要压缩数据，数据存储、解析开销大。可结合Gzip、Bzip2使用，但使用Gzip时Hive不对切分数据，因此无法并行操作。

### ORC格式

ORC(Optimized Row Columnar)是一种二进制文件，由1至多个stripe、file footer和postscript组成，每个stripe包含3部分：index data、row data、stripe footer，如下所示为orc文件结构图：

<img style={{width:"80%", height:"80%"}} src="/img/blog/HiveNotes/OrcFileLayout.png" title="Orc File Layout"/>

- stripe
  - index data：轻量级index，默认每隔1w行做一个索引，表示字段数据在row data中的offset；
  - row data：具体数据，分成多个stream；
  - stripe footer：存放stream类型、长度等信息；
- file footer：存放stripe、column数据类型等；
- postscript：存放文件压缩类型和file footer长度等。

读取ORC文件时，先seek到文件尾部读取postscript，得到file footer长度，再读filefooter，得到stripe信息，最后读写stripe得到列数据，即从后往前读取解析。

### PARQUET格式

和ORC文件一样，PARQUET文件也是一种二进制文件，包含数据和元数据，因此PARQUET是自解析的，如下所示为parquet结构图：

<img style={{width:"80%", height:"80%"}} src="/img/blog/HiveNotes/ParquetFileLayout.gif" title="Parquet File Layout"/>

- Magic Number：4字节内容`PAR1`，标识其为PARQUET文件
- 行组(Row Group)：每个行组包含一定行数，一个PARQUET文件至少存储一个行组，类似stripe；
  - 列块(Column Chunk)：行组中的每一列存在一个列块中，所有列连续存储在行组文件中，每个列块中数据类型相同，但可以使用不同压缩算法；
    - 页(Page)：每一个列块划分为多个页，页是最小的编码单位，同一个列块的不同页可以使用不同编码方式。
- Footer
  - Column meta data
- Footer Length：4字节存储文件元数据长度
- Magic Number：4字节内容`PAR1`，标识其为PARQUET文件

parquet文件首尾是固定的4字节内容'PAR1'，从底往上走是footer length表示元数据长度，通过footer length和文件长度可以计算出元数据偏移量从而读取。元数据包含行组元数据信息、该文件存储数据的schema信息以及页元数据。
