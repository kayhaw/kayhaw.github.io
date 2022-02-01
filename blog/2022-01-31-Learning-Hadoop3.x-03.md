---
title: Hadoop 3.x学习笔记(3)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Hadoop
  - BigData
description: Hadoop 3.1.3学习笔记(3)
hide_table_of_contents: false
---

:pencil:Hadoop 3.1.3学习笔记第3篇：MapReduce。
<!--truncate-->

## MapReduce简介

MapReduce是一个分布式运算程序的编程框架，核心功能是将用户编写的业务逻辑代码和自带组件整合成完整的分布式运算程序，然后在Hadoop集群上并发运行。

优点:smile:：

1. 易于编程，用户只需要关系业务逻辑；
2. 扩展性好，可以动态增加服务器；
3. 高容错性，计算节点挂点可以将任务转移到其他节点；
4. 适合海量数据计算(TB/PB)。

缺点:angry:：

1. 不适合实时计算；
2. 不适合流式计算；
3. 不适合DAG有向无环图计算。

MapReduce程序分为2个阶段：Map阶段和Reduce阶段。Map阶段的MapTask并发运行互不相干，Reduce阶段的ReduceTask也互不相关，但依赖于MapTask的输出。MapReduce程序只能包含一个Map阶段和一个Reduce阶段，如果业务逻辑非常复杂，那么只能多个MapReduce程序串行执行。

MR程序编写分为3部分：Mapper、Reducer和Driver。

### Mapper类

1. 自定义类继承`org.apache.hadoop.mapreduce.Mapper`类；
2. 定义输入K-V泛型，即泛型参数列表的第1、2个参数；
3. 定义输出K-V泛型，即泛型列表的第3、4个参数；
4. map方法中实现业务逻辑；
5. **map()方法（MapTask进程）对每一个K-V对调用一次**。

```java title=WordCountMapper.java
public class WordCountMapper extends Mapper<LongWritable, Text, Text, IntWritable> {

    // 减少对象创建次数，不要放到map里面
    private Text outK = new Text();
    private IntWritable outV = new IntWritable(1);

    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        // 1. 获取一行
        String line = value.toString();
        // 2. 切分
        String[] words = line.split(" ");
        // 3. 循环写出
        for (String word : words) {
            outK.set(word);
            context.write(outK, outV);
        }
    }

}
```

### Reducer类

1. 自定义类继承`org.apache.hadoop.mapreduce.Reducer`类；
2. 输入K-V泛型是对应Mapper的输出K-V泛型；
3. reduce方法实现业务逻辑；
4. **ReduceTask进程对每一组相同key的K-V组调用一次reduce()方法**。

```java title=WordCountReducer.java
public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

    private IntWritable outV = new IntWritable();

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException,
        InterruptedException {
        int sum = 0;
        for (IntWritable value : values) {
            sum += value.get();
        }
        outV.set(sum);
        context.write(key, outV);
    }
    
}
```

### Driver类

相当于YARN集群的客户端，用于提交MR任务到YARN集群。

```java
public class WordCountDriver {
    public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        // 1. 获取Job
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        // 2. 设置jar路径
        job.setJarByClass(WordCountDriver.class);
        // 3. 关联mapper和reducer
        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReducer.class);
        // 4. 设置mapper输出KV类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        // 5. 设置最终输出的KV类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        // 6. 设置输入输出路径
        FileInputFormat.setInputPaths(job, new Path("wcinput\\words.txt"));
        FileOutputFormat.setOutputPath(job, new Path("wcoutput"));
        // 7. 提交Job
        boolean result = job.waitForCompletion(true);
        System.exit(result ? 0 : 1);
    }
}
```

:::caution 注意

1. 注意导入org.apache.hadoop.mapreduce.\*而不是org.apache.hadoop.mapred.*，前者是Hadoop 2.x/3.x使用，后者是Hadoop 1.x；
2. WordCountDriver中设置输出KV类型代码写错，导致类型不一致报错。
:::

## 序列化

序列化是将内存中对象转为字节序列以便于持久化和网络传输的过程，反序列化是将字节序列转为内存中对象的过程。Java序列化机制(Serializable)过于重量，附带校验信息、Header、继承体系等，不便于网络中高效传输，因此Hadoop自定义了序列化机制(Writable)，具有以下特性：

1. 紧凑：高效使用存储空间；
2. 快速：读写数据开销小；
3. 互操作：支持多语言交互。

对于Java中的基本类型，Hadoop提供如下对应序列化类：

| Java类型 | Hadoop Writable类型 |
| -------- | ------------------- |
| Boolean  | BooleanWritable     |
| Byte     | ByteWritable        |
| Int      | IntWritable         |
| Float    | FloatWritable       |
| Long     | LongWritable        |
| Double   | DoubleWritable      |
| String   | Text                |
| Map      | MapWritable         |
| Array    | ArrayWritable       |
| Null     | NullWritable        |

构建符合Hadoop序列化机制的Bean类需要满足如下条件：

1. 实现Writable接口；
2. 提供一个空参构造器(序列化反射时用)；
3. 重写write和readFields方法，**注意字段读写顺序一致**；
4. **当Bean类作为Key使用时还需要实现Comparable接口**(Shuffle过程使用)；
5. 当需要序列化到文件时需要重写toString方法。

## MapReduce框架

如下图所示，MR框架包含4个组件：InputFormat、Mapper、Reducer和OutputFormat。MapReduce程序执行流程为：由InputFormat将输入数据分为切片(Split)，Mapper调用map方法处理每个切片中数据，通过Shuffle将处理后结果交给Reducer，它又调用reduce方法合并切片结果，最后通过OutputFormat将合并结果输出。

### Job提交流程

在WordCountDriver中调用waitForCompletion方法来提交作业并获取结果，该方法调用流程如下：

1. 调用submit方法，该方法流程如下：
    1. 调用ensureState方法判断当前提交状态，必须是JobState.DEFINE；
    2. 调用setUseNewAPI方法处理新老mapreduce API的兼容性；
    3. 调用connect方法创建Cluster对象，该类的构造方法调用initialize方法，该方法又依次遍历YarnClientProtocolProvider和LocalClientProtocolProvider，确定客户端为LocalJobRunner；
    4. 调用submitJobInternal方法。

2. 展开分析submitJobInternal方法流程：
    1. 调用checkSpecs方法，该方法调用OutputFormat的checkOutputSpecs方法检查输出配置(**对于FileOutputFormat来说它检查输出路径不能为空并且不能已经存在**)；
    2. 调用JobSubmissionFiles.getStagingDir()方法生成一个stage文件夹；
    3. 调用ClientProtocol.getNewJobID()生成jobId；
    4. stage路径和jobId组成路径submitJobDir(例如/tmp/hadoop/mapred/staging/xiaok1378532364/.staging/job_local1378532364_0001)；
    5. 通过调用链copyAndConfigureFiles->uploadResources->uploadResourcesInternal方法，进行生成submitJobDir文件夹，将程序jar包上传到集群(uploadJobJar)等操作；
    6. 调用InputFormat的writeSplits方法得到切片数maps，在submitJobDir下生成切片信息文件(`.job.split.crc`、`.job.splitmetainfo.crc`、`job.split`、`job.splitmetainfo`)，随后将切片数设置到Configuration中；
    7. 调用writeConf方法，在submitJobDir下生成`job.xml`(包含本次作业执行所有的配置信息)和`.job.xml.crc`；
    8. 调用ClientProtocol.submitJob方法提交作业；

3. 将state设置为JobState.RUNNING，回到waitForCompletion；
4. 最后返回isSuccessful()方法结果。

### FileInputFormat切片

writeSplits方法根据是否使用新MapReduce API选择调用writeNewSplits方法或者writeOldSplits，这里分析writeNewSplits代码，它调用InputFormat的getSplits抽象方法。抽象类InputFormat的各个子类xxxInputFormat会实现getSplits方法，以FileInputFormat的getSplits方法为例分析如下：

1. 获得minSize=1，maxSize=Long.MAX_VALUE；
2. 循环遍历输入路径下的所有文件执行步骤3-6；
3. 由isSplitable方法判断该文件是否可切片，FileInputFormat默认为true；
4. 获取块大小blockSize，默认是33554432(本地调试为32MB)；
5. 计算切片大小splitSize=Math.max(minSize, Math.min(maxSize, blockSize))，因此默认切片大小就是块大小；
6. while循环生成切片信息InputSplit列表，注意只有剩余长度/splitSize大于SPLIT_SLOP(默认0.1)时才会切片。

接着调用JobSplitWriter.createSplitFiles在subJobDir中生成切片规划文件，将其提交到YARN上后，MrAppMaster根据切片规划文件来计算MapTask个数。
