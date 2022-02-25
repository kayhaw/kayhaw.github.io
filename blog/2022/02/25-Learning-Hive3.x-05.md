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