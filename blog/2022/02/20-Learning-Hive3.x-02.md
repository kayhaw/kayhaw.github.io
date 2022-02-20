---
title: Hive 3.x学习笔记(2)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hive
  - BigData
description: Hive 3.1.2学习笔记(2)：hive命令使用和Hive数据类型
hide_table_of_contents: false
---

:pencil:Hive 3.1.2学习笔记第2篇：hive命令使用和Hive数据类型。
<!--truncate-->

## hive命令使用

在${HIVE_HOME}/bin下提供了hive脚本命令，通过执行`hive -help`命令得到如下可选参数：

```bash
[kayhaw@hadoop102 bin]$ hive -help
which: no hbase in (/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/opt/module/jdk1.8.0_212/bin:/opt/module/hadoop-3.1.3/bin:/opt/module/hadoop-3.1.3/sbin:/opt/module/apache-hive-3.1.2/bin:/home/kayhaw/.local/bin:/home/kayhaw/bin)
Hive Session ID = 61f38c61-9723-42c3-97c0-5ca19b080c46
usage: hive
 -d,--define <key=value>          Variable substitution to apply to Hive
                                  commands. e.g. -d A=B or --define A=B
    --database <databasename>     Specify the database to use
 -e <quoted-query-string>         SQL from command line
 -f <filename>                    SQL from files
 -H,--help                        Print help information
    --hiveconf <property=value>   Use value for given property
    --hivevar <key=value>         Variable substitution to apply to Hive
                                  commands. e.g. --hivevar A=B
 -i <filename>                    Initialization SQL file
 -S,--silent                      Silent mode in interactive shell
 -v,--verbose                     Verbose mode (echo executed SQL to the
                                  console)
```

- `-e`和`-f`参数分别用于命令行输入和指定文件来执行HQL；
- **`--hiveconf`在启动hive命令时指定Hive环境变量**，仅在本次会话生效；
- 输入`quit;`或`exit;`退出；
- **输入`dfs`命令操作HDFS文件系统**；
- 输入`set`查看所有配置信息，输入`set <参数名>=<参数值>`修改Hive参数值，仅在输入之后本次会话生效；
- 所有执行命令记录在`${HOME}/.hivehistory`文件中。

## 其他配置

1. 修改Hive日志存放位置：在`${HIVE_HOME}/conf/hive-log4j2.properties.template`文件中默认日志位置为`/tmp/kayhaw/hive.log`，将改文件拷贝为`hive-log4j2.properties`并修改`property.hive.log.dir`参数值，如下所示：

```properties
# property.hive.log.dir = ${sys:java.io.tmpdir}/${sys:user.name}
property.hive.log.dir = ${env:HIVE_HOME}/logs
```

:::tip LOG4J2配置文件使用环境变量
一开始改为`${HIVE_HOME}/logs`发现不生效，因为这是properties文件而不是shell脚本，查看[Environment Lookup](https://logging.apache.org/log4j/2.x/manual/lookups.html#EnvironmentLookup)可知使用`env:`前缀让LOG4J2来查找环境变量。
:::

2. 设置打印库名和列名：在`hive-site.xml`添加如下内容：

```xml
<!-- 打印列名 -->
<property>
  <name>hive.cli.print.header</name>
  <value>true</value>
</property>
<!-- 打印库名 -->
<property>
  <name>hive.cli.print.current.db</name>
  <value>true</value>
</property>
```

**配置加载顺序：hive-default.xml->hive-site.xml->hive命令启动`--hiveconf`->hive命令中`set`，后者覆盖前者同名配置参数。后两步的设置仅限于本次会话，某些系统参数(如log4j2相关)需要通过前两步设置，因此它们在会话建立之前就会读取配置。**

## 数据类型

详见官网信息[Data Types](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types)。

### 基本类型

| 分类     | 名称                      | 长度(字节)/范围 | 备注            |
| -------- | ------------------------- | --------- | ----------------- |
| 整数     | TINYINT                   | 1         | 有符号         |
|          | SMALLINT                  | 2         | 有符号         |
|          | INT [INTEGER]             | 4         | 有符号         |
|          | BIGINT                    | 8         | 有符号         |
| 浮点数    | FLOAT                     | 4         | 单精度浮点数 |
|          | DOUBLE [DOUBLE PERCISION] | 8         | 双精度浮点数 |
|          | DECIMAL [NUMERIC]         |           | NUMRIC自3.0.0引入 |
| 字符串    | STRING                    |           |                   |
|          | CHAR                      |           | since 0.13.0      |
|          | VARCHAR                   |           | since 0.12.0      |
| 时间日期  | TIMESTAMP                 |           | since 0.8.0       |
|          | DATE                      |           | since 0.12.0      |
|          | INTERVAL                  |           | since 1.2.0       |
| 其他     | BOOLEAN                   |           |                   |
|          | BINARY                    |           | since 0.8.0       |

### 复合类型

Hive提供的复合类型包含数组、map、struct和union四种，它们之间可以互相嵌套声明。

| 类型 | 描述                 | 声明语法                                            |
| ------ | ---------------------- | ------------------------------------------------------- |
| array  | 通过`列名[下标]`获取值 | ARRAY<data_type>                                        |
| map    | 通过`列名[key]`获取值 | MAP<primitive_type, data_type>                          |
| struct | 通过`列名.key`获取值 | STRUCT<col_name : data_type [COMMENT col_comment], ...> |
| union  | :question:             | UNIONTYPE<data_type, data_type, ...>                    |

```sql title="复合类型使用示例"
create table test(
  name string,
  friends array<string>,
  children map<string, int>,
  address struct<street:string, city:string>
)
row format delimited fields terminated by ','   # 指定字段分隔符
collection items terminated by '_'              # 指定map、struct和array的元素分隔符
map keys terminated by ':'                      # 指定map中key和value的分隔符
lines terminated by '\n';                       # 指定行分隔符
```

:::info 默认分隔符
Hive默认行分隔符为`'\n'`，默认字段分隔符为`'\001'`(显示为`^A`)，默认元素分隔符为`'\002'`(显示为`^B`)，默认kv分隔符为`'\003'`(显示为`^C`)。
:::

## 类型转换

Hive的类型转换分为隐式转换和显式转换，其中隐式转换由Hive自动完成，规则如下：

1. 所有整数类型可以隐式转为范围更大的类型；
2. 所有整数类型、FLOAT 和**STRING**类型都可以隐式地转换成DOUBLE;
3. TINYINT、SMALLINT和INT可以转换为FLOAT；
4. BOOLEAN 类型不可以转换为任何其它的类型。

显式类型转换通过`CAST`实现，如`CAST('1' AS INT)`把字符串"1"转为整数1，**如果转换失败则返回NULL**。

## 总结

1. Hive配置的优先级和加载顺序；
2. 设置Hive日志路径、命令行显示库名和列名的方法；
3. [Hive还未完全支持UNIONTYPE](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types#LanguageManualTypes-UnionTypesunionUnionTypes)，不建议使用。
