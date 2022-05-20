---
title: Flink中Row和RowData区别
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Flink
  - Fliny开发笔记
description: Flink中Row和RowData区别
hide_table_of_contents: false
---

开发Flinky时发现，FlinkX的BashRichInputFormat类使用RowData作输出类型，而Flink JDBC connector模块的JdbcInputFormat类使用Row作为输出类型。今天就写篇文章研究下它们的区别，最后给出Flinky到底该使用Row还是RowData。
<!--truncate-->

## Row

Row类的全路径为`org.apache.flink.types.Row`，并且被修饰为`final`，即不可被继承。源码注释翻译如下：

> Row是一种固定长度、可为null的复合类型，按照固定字段顺序存储多个值。每个字段都可以为null，但字段类型不能自动推导，因此需要提供类型信息。
>
> Row被设计的主要目的是作为Flink Table/SQL API和其他API的桥梁，因此Row不仅包含schema部分(提供字段数据)，还包含一个kind字段来记录changelog类型。比如在批处理场景下，changlog是包含插入行的有界流，其kind字段值为枚举值RowKind.INSERT。kind字段提供getter和setter方法。
>
> 获取Row字段数据有基于索引和基于名称两种模式，开发者自行选择哪种模式。由Flink框架产生的Row同时支持两种模式。
>
> 基于索引的字段模式：通过`withPositions(int)`静态方法创建**固定长度**的Row对象。字段通过`getField(int)`和`setField(int, Object)`方法进行获取和设置，默认每个字段初始化为null。
>
> 基于名称的字段模式：通过`withNames()`静态方法创建**可变长度**的Row对象。字段通过`getField(String)`和`setField(String,Object)`方获进行获取和设置，同时每个字段由setField设置初始值。Flink框架将缺失字段设置为null，并且在序列化或输入转换时对字段排序，最后变成固定长度的复合类型。因此基于名称的Row性能弱于基于索引的，但是简化了Row创建和代码可读性。
>
> 混合模式：由Flink框架进行反序列化或者输出转换后的Row同时兼容两种模式看，通过`getField(int)`、`setField(int, Object)`、`getField(String)`和`setField(String,Object)`来获取和设置字段值。但是，不能通过`setField(String,Object)`来添加新字段，hashCode()方法只对基于索引的Row有效。
>
> Row对象实现Serializable接口，可以包含非序列化字段，但序列化会失败，除非使用Flink序列化栈。

从源码分析，Row类包含如下字段：

```java
/** The kind of change a row describes in a changelog. */
private RowKind kind;

/** Fields organized by position. Either this or {@link #fieldByName} is set. */
private final @Nullable Object[] fieldByPosition;

/** Fields organized by name. Either this or {@link #fieldByPosition} is set. */
private final @Nullable Map<String, Object> fieldByName;

/** Mapping from field names to positions. Requires {@link #fieldByPosition} semantics. */
private final @Nullable LinkedHashMap<String, Integer> positionByName;
```

当使用静态方法withPositions或者withNames创建Row对象时，对应地fieldByName或者fieldByPosition为空，Flink根据这个条件判断Row处于哪种访问模式，而RowKind作为枚举类具有`INSERT`、`UPDATE_BEFORE`、`UPDATE_AFTER`和`DELETE`4个值。

## RowData

RowData作为接口，其类全路径为`org.apache.flink.table.data.RowData`，源码注释翻译如下：

> RowData是Flink Table系统中表示RowType数据的基本数据接口，所有在Table API/SQL流水线传输的顶层记录都实现RowData接口，它也包含一个RowKind字段表示changelog类型。注意RowData的字段类型都必须是Flink内部数据类型。
>
> 在不同场景下，RowData接口有着不同的实现类：比如BinaryRowData面向二进制数据，依赖于MemeorySegment类而不是Java对象来减少序列化/反序列化开销；GenericRowData面向对象数据，依赖于Object数组实现高效更新和易于构建。当要求使用Flink内部数据结构时，推荐使用GenericRowData。Flink API/SQL数据类型对应的Flink内部数据类型如下表所示(略...)

从源码分析，RowData接口并没有包含任何字段(RowKind字段放到了实现类中)，大部分是声明getXxx方法**(基于索引获取字段)**，其中Xxx是Java基本类型或者Flink内部类型：

```java
...
/** Returns the double value at the given position. */
double getDouble(int pos);

/** Returns the string value at the given position. */
StringData getString(int pos);

/**
  * Returns the decimal value at the given position.
  *
  * <p>The precision and scale are required to determine whether the decimal value was stored in
  * a compact representation (see {@link DecimalData}).
  */
DecimalData getDecimal(int pos, int precision, int scale);

/**
  * Returns the timestamp value at the given position.
  *
  * <p>The precision is required to determine whether the timestamp value was stored in a compact
  * representation (see {@link TimestampData}).
  */
TimestampData getTimestamp(int pos, int precision);
...
```

## 总结

Row和RowData不同之处在于：

1. Row是final class，位于flink-core包；RowData是接口，位于flink-table-common包；
2. Row包含字段数据和RowKind，而RowData只声明方法，字段数据和RowKind在其子类中声明；
3. Row提供2种字段模式，而RowData只基于索引。

FlinkX提供以Flink SQL执行同步任务的功能，因此输出类型选择和Flink Table/SQL API更加贴近的RowData。这里我还是先选择使用Row作为Flinky的输出输入类型，以后再扩展接入Flink Table/SQL API。
