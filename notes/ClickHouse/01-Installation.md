---
layout: article
title: 安装使用
slug: /ClickHouse/Installation
tags:
  - ClickHouse
  - Learning Notes
---

## 安装ClickHouse

ClickHouse官网给出了多种[安装方法](https://clickhouse.com/docs/en/getting-started/install)，这里介绍在CentOS上通过RPM包安装的两种方式。

### 手动下载包安装

到[https://packages.clickhouse.com/rpm/stable/](https://packages.clickhouse.com/rpm/stable/)上下载如下4个rpm文件到空目录clickhouse下：

1. clickhouse-common-static-21.7.11.3-2.x86_64.rpm
2. clickhouse-common-static-dbg-21.7.11.3-2.x86_64.rpm
3. clickhouse-server-21.7.11.3-2.noarch.rpm
4. clickhouse-client-21.7.11.3-2.noarch.rpm

进入clickhouse目录，执行`sudo rpm -ivh clickhouse-*.rpm`，期间会要求输入default用户的密码，这里直接按回车键表示不设置密码。

```bash
Creating log directory /var/log/clickhouse-server/.
Creating data directory /var/lib/clickhouse/.
Creating pid directory /var/run/clickhouse-server.
 chown --recursive clickhouse:clickhouse '/var/log/clickhouse-server/'
 chown --recursive clickhouse:clickhouse '/var/run/clickhouse-server'
 chown clickhouse:clickhouse '/var/lib/clickhouse/'
 groupadd -r clickhouse-bridge
 useradd -r --shell /bin/false --home-dir /nonexistent -g clickhouse-bridge clickhouse-bridge
 chown --recursive clickhouse-bridge:clickhouse-bridge '/usr/bin/clickhouse-odbc-bridge'
 chown --recursive clickhouse-bridge:clickhouse-bridge '/usr/bin/clickhouse-library-bridge'
Enter password for default user: [按回车键]
```

从输出日志可以看到，安装程序默认将日志目录设置为`/var/log/clickhouse-server`，数据目录设置为`/var/lib/clickhouse`，并将目录所属权限递归地赋给clickhouse组的clickhouse用户。

### 添加官方源安装

```bash
# 1. 添加官方仓库
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://packages.clickhouse.com/rpm/clickhouse.repo
# 2. 安装服务端和客户端
sudo yum install -y clickhouse-server clickhouse-client
# 3. 启动服务
sudo /etc/init.d/clickhouse-server start
clickhouse-client # or "clickhouse-client --password" if you set up a password.
```

上述命令执行后将在`/etc/yum.repos.d`目录下生成`clickhouse.repo`文件，默认使用stable仓库并安装最新版本。通过如下命令安装指定版本：

```bash
# 1. 列出所有版本
yum search clickhouse --showduplicates
# 2. 安装指定版本
sudo yum install -y clickhouse-server-<版本号> clickhouse-client-<版本号>
...
Creating log directory /var/log/clickhouse-server/.
Creating data directory /var/lib/clickhouse/.
Creating pid directory /var/run/clickhouse-server.
 chown --recursive clickhouse:clickhouse '/var/log/clickhouse-server/'
 chown --recursive clickhouse:clickhouse '/var/run/clickhouse-server'
 chown clickhouse:clickhouse '/var/lib/clickhouse/'
 groupadd -r clickhouse-bridge
 useradd -r --shell /bin/false --home-dir /nonexistent -g clickhouse-bridge clickhouse-bridge
 chown --recursive clickhouse-bridge:clickhouse-bridge '/usr/bin/clickhouse-odbc-bridge'
 chown --recursive clickhouse-bridge:clickhouse-bridge '/usr/bin/clickhouse-library-bridge'
Password for default user is empty string. See /etc/clickhouse-server/users.xml and /etc/clickhouse-server/users.d to change it.
```

通过输出日志可以看到，该安装方式默认将default用户的密码设置为空。

## 服务启动

ClickHouse服务可以通过多种命令启动：

1. `sudo clickhouse start`：自带工具`clickhouse`启动，推荐使用:+1:；
2. `sudo systemctl start clickhouse-server`；
3. `sudo service clickhouse-server start`；
4. `sudo /etc/init.d/clickhouse-server start`;
5. `clickhouse-server --config-file=/etc/clickhouse-server/config.xml`。

通过`--config-file`指定启动加载的配置文件，没有提供的话默认`./config.xml`。

## `clickhouse-client`使用

原生的命令行客户端工具`clickhouse-client`支持连接不同版本的ClickHouse服务端，但若版本低于服务端版本就不能使用新版本特有功能，并提示"ClickHouse client version is older than ClickHouse server. It may lack support for new features"。该命令行工具使用分为交互式和非交互式(也称批处理)两种模式。

### 批处理模式

批处理模式下，不会进入交互终端，通过`--query`参数执行**一条**sql语句，或者通过`--queries-file`执行sql脚本，如下所示：

```bash
clickhouse-client -q "select version()"
clickhoust-client --queries-file demo.sql test.sql
```

:::caution
短格式参数值用空格隔开：`-q "select version()"`，长格式参数值用`=`连接或者空格隔开均可：`--query="select version"`
:::

如果提供选项`--multiline`/`-m`，一条查询语句可以分成多行输入，并以分号作为结束标识，否则每次回车立即执行当前行的内容，**除非加上\转义**，如下所示：

```bash
$ cat << _EOF | clickhouse-client -m
> select
> version()
> _EOF
21.7.11.3
```

如果提供选项`--multiquery`/`-n`，则可以输入**多条**语句，否则报错，如下所示：

```bash
$ clickhouse-client --query="select * from t_order_mt;select version();"
Code: 62. DB::Exception: Syntax error (Multi-statements are not allowed): failed at position 25 (end of query): ;select version();. 
$ clickhouse-client -n --query="select * from t_order_mt;select version();"
```

### 交互模式

当执行`clickhouse-client`命令不带`--query`或者`--queries-file`参数，则进入终端窗口输入SQL语句。运行`clickhouse-client`时指定选项`-E`可以将结果垂直输出，或者在终端输入每个查询语句时，结尾带上`\G`(这是为了兼容MySQL CLI)。

### 退出与终止

按下`Ctrl+D`组合键，或者输入`exit`，`quit`，`logout`，`exit`，`quit;`，`logout;`，`q`，`Q`，`:q`都将退出交互模式；如果想要终止长期执行的语句，可以按下`Ctrl+C`组合键，再次按下退出交互模式。

### 查询参数

为了避免在客户端格式化查询语句，可以在语句中使用参数并通过`--param_<参数名>`来赋值，如下所示：

```bash
clickhouse-client \
--param_tuple_in_tuple="(10, ('dt', 10))" \
-q "SELECT * FROM table WHERE val = {tuple_in_tuple:Tuple(UInt8, Tuple(String, UInt8))}"

clickhouse-client \
--param_tbl="numbers" --param_db="system" --param_col="number" \
--query "SELECT {col:Identifier} FROM {db:Identifier}.{tbl:Identifier} LIMIT 10"
```

带参查询语句的语法是`<参数名>:<参数类型>`，并且参数类型支持嵌套。

### 选项配置

clickhouse-client所有参数都有默认值，可以通过命令行或者配置文件设置，优先级为命令行 > 配置文件 > 默认值。所有可设置的参数选项如下表所示：

| 长格式                    | 短格式  | 默认值     | 说明                                                       |
| ------------------------- | ------ | --------- | ---------------------------------------------------------- |
| --host                    | -h     | localhost | ClickHouse服务端地址                                        |
| --port                    |        | 9000      | ClickHouse服务端口，注意HTTP接口使用不同端口                  |
| -user                     | -u     | default   | 用户名                                                      |
| --password                |        | <空>      | 密码                                                        |
| --query                   | -q     |           | 和`query`/`queries-file`搭配使用                            |
| --queries-file            | -qf    |           | 查询sql文件路径                                             |
| --database                | -d     | default   | 链接数据库                                                  |
| --multiline               | -m     |           | 允许一条语句分为多行输入，而不是输入回车就认为是一次查询        |
| --multiquery              | -n     |           | 以分号分割的多语句查询                                       |
| --format                  | -f     |           | 指定结果输出格式                                            |
| --vertical                | -E     |           | 结果垂直输出，等效于--format=Vertical                        |
| --time                    | -t     |           | 非交互模式下将执行时间输出到stderr                           |
| --stacktrace              |        |           | 打印异常堆栈                                                |
| --config-file             |        |           | 指定配置文件                                                |
| --secure                  |        |           | 通过TLS连接服务，需要配置证书                                |
| --history_file            |        |           | 历史命令文件                                                |
| --param_<name\>           |        |           | 查询参数值                                                 |
| --hardware-utilization    |        |           | 打印资源使用情况                                            |
| --print-profile-events    |        |           | 打印ProfileEvents包                                        |
| --profile-events-delay-ms |        |           | 打印ProfileEvents包之间的延迟，-1统计总延时，0统计每个延时    |

配置文件的来源按照如下顺序依次查找加载：

1. 参数`--config-file`指定；
2. 当前路径下：`./clickhouse-client.xml`；
3. 用户目录下：`~/.clickhouse-client/config.xml`；
4. 系统目录下：`/etc/clickhouse-client/config.xml`

:::info
在交互模式下，每次查询都生成一个UUID，在配置文件中通过{query_id}占位符来生成格式化字符串，这可以用来生成分析查询性能的URL，如下所示：

```xml
<config>
  <query_id_formats>
    <speedscope>http://speedscope-host/#profileURL=qp%3Fid%3D{query_id}</speedscope>
  </query_id_formats>
</config>
```
