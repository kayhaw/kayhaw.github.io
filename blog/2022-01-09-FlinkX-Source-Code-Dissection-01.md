---
title: FlinkX源码剖析(1)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Flink
  - Source code dissection
description: FlinkX源码剖析(1)
hide_table_of_contents: false
---

:pencil:FlinkX源码剖析(1)：主流程分析。以local模式运行为例分析FlinkX主流程执行逻辑：从运行脚本开始到配置参数的解析、**插件类加载**，最后到Flink流应用构建执行。代码注释见[![FlinkX Dissection](https://img.shields.io/badge/flinkx-1.12__release__dissection-blue)](https://github.com/kayhaw/flinkx/tree/1.12_release_dissection)。
<!--truncate-->

## 启动脚本

FlinkX提供了`bin/flinkx`脚本用于在命令行快速启动同步任务，它本质上就是一个java命令的封装，但还是要展开来仔细地讲讲它用到的一些bash知识。

首先第一行`set -e`，作用是让脚本执行错误时立即退出，因为默认情况下执行命令错误后会继续执行，建议在所有脚本头部都加上。接下来这个设置环境变量的代码就很:smirk:了：

```bash
export FLINKX_HOME="$(cd "`dirname "$0"`"/..; pwd)"
```

从外到内分析，使用`$()`执行2条命令``cd "`dirname "$0"`"/..``和`pwd`。第一条cd命令的参数又由命令`` `dirname "$0"` ``给出，`dirname`是bash内置命令，输出后面参数文件所在的目录路径，而参数`"$0"`表示脚本文件`flinkx`。结合起来的含义就是切换到flinkx这个脚本文件所在的父目录bin下，然后再切换到上一层目录到项目目录，最后打印绝对路径，即设置用户变量FLINKX_HOME为项目文件夹的绝对路径。

- [ ] set、env、export的区别

接下来看当前系统能不能使用java程序，先看`JAVA_HOME`环境是否存在，若不存在再用`command -v java`看能不能直接执行java程序，再没有就报错退出。接下来设置两个shell变量`JAR_DIR`和入口类名`CLASS_NAME`，然后执行命令：

```bash
nohup $JAVA_RUN -cp $JAR_DIR $CLASS_NAME $@ &
```

nohup命令是no hang up命令的缩写，它将后面跟着的命令挂到后台运行并将输出重定向到nohup.out文件，通常跟`&`搭配使用，让命令执行同时忽略SIGINT和SIGHUP信号。变量替换后的命令如下，`$@`表示执行flinkx脚本后面跟着的所有参数。

- [ ] nohup和&的区别
- [ ] `$@`，`$#`，`$1`...`$n`的含义

```bash
java -cp /path-to-flinkx/lib/* com.dtstack.flinkx.client.Launcher $@
```

以运行一个MySQL到Hive的同步任务为例，在Linux执行命令如下：

```bash
bin/flinkx -mode local   \
         -jobType sync \
         -jobName test_kayhaw \
         -job E:\flinkx_job\new_mysql_hive.json \
         -flinkxDistDir E:\flinkx\flinkx-dist \
```

在IEDA运行FlinkX同步任务配置运行参数命令如下图所示，其中Program arguments内容即上述命令参数内容。

<img style={{width:"100%", height:"100%"}} src="/img/blog/FlinkXDissection/FlinkX_IDEA_RunConfig.png" title="FlinkX IDEA Run Configuration" />

## 命令行入口Launcher

从`bin/flinx`脚本得知该命令行运行入口为Launcher类，它位于flinkx-clients模块，接下来对其main方法展开分析。

### 参数解析

首先对命令后面的一大坨参数进行解析，借助于Apache Commons CLI包来完成。为了将参数字符串转为`com.dtstack.flinkx.options.Options`对象，使用反射获取Options的字段，结合Common CLI提供的`DefaultParser.parse()`方法将字符串转为CommandLine对象，然后再遍历Options的字段名称name，通过`CommandLine.getOptionValue(name)`获取参数值，最后设置回给Options对象。

### 默认参数配置

接下来findDefaultConfigDir()方法用于在命令行没有提供的情况下，设置3个文件夹路径参数默认值，分别是FlinkX读写插件包文件夹、Flink配置文件夹和Hadoop配置文件夹：

```java
private static void findDefaultConfigDir(Options launcherOptions) {
    findDefaultFlinkxDistDir(launcherOptions);

    // local模式只需要配置FlinkXDistDir这一个就可以
    if (ClusterMode.local.name().equalsIgnoreCase(launcherOptions.getMode())) {
        return;
    }

    findDefaultFlinkConf(launcherOptions);
    findDefaultHadoopConf(launcherOptions);
}
```

以findDefaultFlinkxDistDir()代码为例：当命令行参数没有flinkDistDir时，看环境变量中有没有配置`FLINX_HOME`，这个查看环境变量方法getSystemProperty()也有讲究，先调用System.getenv()看有没有，没有再看System.getProperty()。如果有环境变量`FLINKX_HOME`，根据它设置flinkx插件包路径，并注册为环境变量`ConfigConstants.ENV_FLINK_PLUGINS_DIR`。

```java
private static void findDefaultFlinkxDistDir(Options launcherOptions) {
    String distDir = launcherOptions.getFlinkxDistDir();
    // 如果运行参数还未设置，通过系统变量来自己找
    if (StringUtils.isEmpty(distDir)) {
        String flinkxHome = getSystemProperty(KEY_FLINKX_HOME);
        if (StringUtils.isNotEmpty(flinkxHome)) {
            flinkxHome = flinkxHome.trim();
            // 还考虑到路径最末尾有没有加路径分隔符，细！
            if (flinkxHome.endsWith(File.separator)) {
                distDir = flinkxHome + PLUGINS_DIR_NAME;
            } else {
                distDir = flinkxHome + File.separator + PLUGINS_DIR_NAME;
            }

            launcherOptions.setFlinkxDistDir(distDir);
        }
    }
    System.setProperty(ConfigConstants.ENV_FLINK_PLUGINS_DIR, distDir);
}
```

findDefaultFlinkConf()方法在有环境变量FLIN**K**_HOME设置的情况下，补充设置Flink的conf目录和lib目录参数。findDefaultHadoopConf()方法类似查看HADOOP_HOME环境变量并设Hadoop conf目录参数。

### 参数转为String列表

这一部分的代码有点迷，首先调用getProgramExeArgList()方法把解析好的Options参数对象转为String列表，具体操作：

1. 查看`-job`选项配置，**把文件路径字符串替换为文件内容字符串**，这个逻辑藏得有点深；
2. 查看每个选项名，加上"-"前缀加入String列表，再加入选项值，形成两两一对的列表。

接下来把这个String列表放到HashMap中便于按键获取，然后取出`-p`选项值s，这是FlinkX提供的特性，s是`"参数名1=参数值1,参数名2=参数值2..."`格式的字符串，拆解成键值对，用于替换`-job`参数值json字符串中类似`${name}`的占位符。比如s="name=kay"，json字符串为`{"name": "${name}"}`，结果替换后json为`{"name": "kayhaw"}`。

:::info 真的好吗？
这里为了实现`-p`参数提供的特性，把Options转为String列表，又转为HashMap，这样来回倒腾，不如一开始从Options里取出job文件名和s，然后读取json文件内容为String，然后再替换变量，可以省略没有意义的转为HashMap和String列表。
:::

接着构造JobDeployer对象，就是Options对象和变量替换后参数列表的封装。然后根据参数`-mode`的类型构造对应的xxxClusterClientHelper对象，由于以local模式运行，对应为LocalClusterClientHelper对象。

然后添加`-addJar`参数指定的扩展包，我们没有提供，跳过。最后执行LocalClusterClientHelper的submit方法，至此Launcher类已经完成了它的使命。

## FlinkX执行入口Main.main()

LocalClusterClientHelper的代码如下所示，它的逻辑很简单：把JobDeployer转为字符串列表args(卧槽，泥在赣神魔！:angry:，又回到字符串了)，然后执行Main.main(args)方法(flinkx-core模块下)。

```java title=LocalClusterClientHelper.java
public class LocalClusterClientHelper implements ClusterClientHelper {
    @Override
    public ClusterClient submit(JobDeployer jobDeployer) throws Exception {
        // 从clients.Launcher的main方法到core包下Main类的main方法
        // 又把对象转成了给main方法的args字符串数组
        String[] args = jobDeployer.getProgramArgs().toArray(new String[0]);
        Main.main(args);
        return null;
    }
}
```

Main.main()方法代码如下：首先又把传入的字符串转为Options对象，并且给job字符串按UF-8重新编码，防止后续使用gson转为json对象时出错。接着获取`-confProp`参数值，我么没有给出，跳过。接着使用EnvFactory工厂类分别创建普通的流执行环境env和表执行环境tEnv(可是使用更加灵活的SQL而不是json)，由于提供的任务类型为sync，因此进入到exeSyncJob方法。

```java title=flinkx-core/src/main/java/com/dtstack/flinkx/Main.java
public static void main(String[] args) throws Exception {
    LOG.info("------------program params-------------------------");
    Arrays.stream(args).forEach(arg -> LOG.info("{}", arg));
    LOG.info("-------------------------------------------");

    // 又把string字符串转为Options对象
    Options options = new OptionParser(args).getOptions();
    // 将json字符串重新编码为UTF-8，后面gson解析需要
    String job = URLDecoder.decode(options.getJob(), Charsets.UTF_8.name());
    // 环境变量，只用于table执行环境
    Properties confProperties = PropertiesUtil.parseConf(options.getConfProp());
    // env用于执行普通同步任务
    StreamExecutionEnvironment env = EnvFactory.createStreamExecutionEnvironment(options);
    // tenv用于执行flink sql同步任务，依赖于env
    StreamTableEnvironment tEnv =
            EnvFactory.createStreamTableEnvironment(env, confProperties, options.getJobName());

    switch (EJobType.getByName(options.getJobType())) {
        case SQL:
            exeSqlJob(env, tEnv, job, options);
            break;
            // 其实我觉得这里可以改名叫JSON
        case SYNC:
            // 开始正式执行
            exeSyncJob(env, tEnv, job, options);
            break;
        default:
            throw new FlinkxRuntimeException(
                    "unknown jobType: ["
                            + options.getJobType()
                            + "], jobType must in [SQL, SYNC].");
    }

    LOG.info("program {} execution success", options.getJobName());
}
```

### 创建流执行环境

EnvFactory工厂类的createStreamExecutionEnvironment和createStreamTableEnvironment方法分别用于创建普通的流执行环境env和以表形式的执行环境tEnv。以前者为例分析，代码如下所示：

```java
public static StreamExecutionEnvironment createStreamExecutionEnvironment(Options options) {
    Configuration flinkConf = new Configuration();
    if (StringUtils.isNotEmpty(options.getFlinkConfDir())) {
        // 给出flink conf文件夹路径并加载，loadConfiguration重载版本还可以再加一个Configuration对象来补充配置
        flinkConf = GlobalConfiguration.loadConfiguration(options.getFlinkConfDir());
    }
    StreamExecutionEnvironment env;
    if (StringUtils.equalsIgnoreCase(ClusterMode.local.name(), options.getMode())) {
        // local模式下，运行参数-flinkConfDir=path_to_flink_conf给出本地flink配置目录的路径
        // 进而配置flink执行环境
        env = new MyLocalStreamEnvironment(flinkConf);
    } else {
        // 其他运行模式下，运行参数-confProp=<json字符串>给出来配置flink执行环境
        Configuration cfg =
                Configuration.fromMap(PropertiesUtil.confToMap(options.getConfProp()));
        env = StreamExecutionEnvironment.getExecutionEnvironment(cfg);
    }
    // 关闭闭包清理，user code已经在每个worker节点下？
    env.getConfig().disableClosureCleaner();
    return env;
}
```

首先调用GlobalConfiguration.loadConfiguration(String conf_dir)方法得到配置类，该方法由Flink Core包提供，用于解析某个目录下的所有配置文件为Configuration对象flinkConf。如果是local模式提交任务，使用flinkConf配置生成的MyLocalStreamEnvironment，该类是FlinkX自定义的。其他模式下，环境的配置参数由`-confProp`指定。

:::caution
local模式提交任务则使用本地的FlinkX conf目录下配置文件作为流执行环境的配置，其他模式远程提交到Flink集群，此时通过`-confProp`参数提供额外的执行环境配置。
:::

接着调用disableClosureCleaner()方法关闭闭包清理器功能(默认开启)，什么是ClosureCleaner？Flink Java API Doc给出的解释如下：

> The closure cleaner is a utility that tries to truncate the closure (enclosing instance) of non-static inner classes (created for inline transformation functions). That makes non-static inner classes in many cases serializable, where Java's default behavior renders them non-serializable without good reason.

在Java编程中，内部类所在的外部类称之为闭包(closure)。当开启闭包清理，Flink会分析用户自定义函数中没有用到的字段，并将其设置为null，这样是的闭包或者匿名内部类是可序列化的，而某些Java工具包不会将其序列化。而用户自定义函数需要通过序列化将其分发到Flink集群的worker节点上。这里关闭了闭包清理，是因为已经在各个节点上部署了FlinkX jar包🤔？。
