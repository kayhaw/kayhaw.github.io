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

### TextInputFormat和CombineFileInputFormat

FileInputFormat抽象类下针对不同使用场景派生了NLineInputFormat、TextInputFormat、CombineFileInputFormat、KeyValueTextInputFormat等子类，本节介绍常用的TextInputFormat和CombineFileInputFormat。

TextInputFormat是FileInputFormat的默认实现类，源码如下：

```java
public class TextInputFormat extends FileInputFormat<LongWritable, Text> {

  @Override
  public RecordReader<LongWritable, Text> 
    createRecordReader(InputSplit split,
                       TaskAttemptContext context) {
    String delimiter = context.getConfiguration().get(
        "textinputformat.record.delimiter");
    byte[] recordDelimiterBytes = null;
    if (null != delimiter)
      recordDelimiterBytes = delimiter.getBytes(Charsets.UTF_8);
    return new LineRecordReader(recordDelimiterBytes);
  }

  @Override
  protected boolean isSplitable(JobContext context, Path file) {
    final CompressionCodec codec =
      new CompressionCodecFactory(context.getConfiguration()).getCodec(file);
    if (null == codec) {
      return true;
    }
    return codec instanceof SplittableCompressionCodec;
  }

}
```

TextInputFormat切片按照文件一个一个来，不管文件有多小都至少是一个切片，对于大量小文件而言这回产生大量MapTask降低处理效率。而CombineFileInputFormat用于处理这种大量小文件的情况，通过CombineTextInputFormat.setMaxInputSplitSize设置虚拟存储切片大小maxInputSplitSize，并按照如下过程切片：

1. 循环遍历输入文件，得到文件大小fileSize；
2. fileSize < maxInputSplitSize，逻辑上划分为一块虚拟存储；
3. 2 * maxInputSplitSize < fileSize，以maxInputSplitSize切分一块；
4. maxInputSplitSize < fileSize <  2 * maxInputSplitSize，平均分成2块；
5. 遍历所有虚拟存储块，判断大小virtBlockSize是否大于maxInputSplitSize
6. virtBlockSize大于等于maxInputSplitSize，形成一个切片；
7. virtBlockSize小于maxInputSplitSize，与下一个虚拟存储块合并形成一个切片。

### Shuffle

map方法之后reduce方法之前的数据处理过程，包含分区、排序、Combiner等操作。

#### 分区策略

如下代码所示，当未通过`Job.setNumReduceTasks(int tasks)`设置任务数量时，默认partitions为1，此时getPartition返回0，即只有一个分区。

```java
NewOutputCollector(org.apache.hadoop.mapreduce.JobContext jobContext,
                       JobConf job,
                       TaskUmbilicalProtocol umbilical,
                       TaskReporter reporter
                       ) throws IOException, ClassNotFoundException {
  collector = createSortingCollector(job, reporter);
  partitions = jobContext.getNumReduceTasks();
  if (partitions > 1) {
    partitioner = (org.apache.hadoop.mapreduce.Partitioner<K,V>)
      ReflectionUtils.newInstance(jobContext.getPartitionerClass(), job);
  } else {
    partitioner = new org.apache.hadoop.mapreduce.Partitioner<K,V>() {
      @Override
      public int getPartition(K key, V value, int numPartitions) {
        return partitions - 1;
      }
    };
  }
}
```

若设置数量大于1，则通过getPartitionerClass()方法获取分区类并通过反射实例化，默认使用HashPartitioner，也可以通过参数`mapreduce.job.partitioner.class`指定。此时获取分区编号通过key的hash值对任务数量取模得到，如下所示：

```java title=HashPartitioner.java
public class HashPartitioner<K, V> extends Partitioner<K, V> {

  /** Use {@link Object#hashCode()} to partition. */
  public int getPartition(K key, V value,
                          int numReduceTasks) {
    return (key.hashCode() & Integer.MAX_VALUE) % numReduceTasks;
  }

}
```

因此，自定义分区策略有如下3步：

1. 自定义CustomPartitioner类继承Partitioner抽象类，实现getPartition抽象方法；
2. 在驱动类中注册使用，`job.setPartitionerClass(CustomPartitioner.class)`；
3. 设置reduce任务数量，`job.setNumReduceTasks(2)`。

注意getPartition方法返回的分区号必须从0开始，逐一增加。如果设置reduce任务数量和getPartition返回值不同，根据两者关系有如下情况：

1. 如果reduce任务数量大于getPartition返回的最大值，则产生空的输出文件part-r-000xx；
2. 如果1 < reduce任务数量 < getPartition数量，则抛出IOException异常；
3. 如果reduce任务数量为1，则只生成一个输出文件part-r-00000。

#### 排序

MapTask和ReduceTask均会对数据按照key进行排序，这是Hadoop的默认行为，不管程序逻辑上是否需要。

对于MapTask，它会将处理的结果暂时放到环形缓冲区中，当环形缓冲区使用率达到一定阈值后，再对缓冲区中的数据进行一次快速排序，并将这些有序数据溢写到磁盘上，而当数据处理完毕后，它会对磁盘上所有文件进行归并排序。

对于ReduceTask，它从每个MapTask上远程拷贝相应的数据文件，如果文件大小超过一定阈值，则溢写磁盘上，否则存储在内存中。如果磁盘上文件数目达到一定阈值，则进行一次归并排序以生成一个更大文件；如果内存中文件大小或者数目超过一定阈值，则进行一次合并后将数据溢写到磁盘上。当所有数据拷贝完毕后，ReduceTask统一对内存和磁盘上的所有数据进行一次归并排序。

排序要求key类型实现WritableComparable接口，即在Writable接口的基础上实现Comparable接口。

#### Combiner

Combiner作为Reducer的子类，是一种特殊的Reducer。Combiner在每一个MapTask所在的节点运行，而Reducer接收全局所有Mapper的输出结果。Combiner对每个MapTask的输出进行局部汇总，以减少网络传输量。**注意使用Combiner的前提是不影响最终的业务逻辑(比如计算平均数就不行)**，输出K-V和Reducer的输入K-V匹配。

设置setNumReduceTasks为0，Shuffle阶段不存在，因此Combiner也不生效。业务逻辑相同的可以直接使用Reducer作为Combiner。

## MapTask工作机制

### MapTask源码分析

```java
自定义Mapper类的map方法调用`context.write(key, v)`；
    WrappedMapper.write(k, v);
    TaskInputOutputContextImpl.write(k, v);
    MapTask.write(k, v, partitioner.getPartition(key, value, partitions))
        默认使用HashPartitioner的getPartition方法
    MapTask.collect()方法将所有K-V写出
    回到runNewMapper方法中调用output.close() [MapTask.java, Line 805]
        调用collector.flush() [MapTask.java, Line 735]
            调用sortAndSpill()方法 [MapTask.java, Line 1505]，
                调用sorter.sort()方法 [MapTask.java, Line 1625]
            调用mergeParts()方法合并文件 [MapTask.java, Line 1527]
        调用collector.close()，关闭收集器，进入ReduceTask [MapTask.java, Line 739]
```

### ReduceTask源码分析

```java
以ReduceTask.run()为入口
initialize() [ReduceTask.java, Line333]
shuffleConsumerPlugin.init(shuffleContext) [ReduceTask.java, Line 375]
    new ShuffleSchedulerImpl [Shuffle.java, Line77]
        totalMaps = job.getNumMapTasks() [ShuffleSchedulerImpl.java, Line 120]
    merger = createMergeManager(context) [Shuffle.java, Line 80]
        new MergeManagerImpl [Shuffle.java, Line 85]
            this.inMemoryMerger = createInMemoryMerger() [MergeManagerImpl.java, Line 232]
            this.onDiskMerger = new OnDiskMerger(this) [MergeManagerImpl.java, Line 235]
rIter = shuffleConsumerPlugin.run() [ReduceTask.java, Line 375]
    eventFetcher.start()  [开始抓取数据，Shuffle.java, Line 107]
    eventFetcher.shutDown() [抓取完毕，Shuffle.java, Line 141]
    copyPhase.complete() [copy完成Shuffle.java, Line 151]
    taskStatus.setPhase(TaskStatus.Phase.SORT) [开始排序阶段，Shuffle.java, Line 152]
sortPhase.complete() [排序阶段完成，进入reduce，ReduceTask.java, Line 382]
runNewReducer() [进入reducer，ReduceTask.java, Line 390]
    reducer.run() [ReduceTask.java, Line 628]
        setup(); [Reduce.java, Line 168]
        reduce(); [Reduce.java, Line 171]
        cleanup(); [[Reduce.java, Line 179]]
```

## Join

MapReduce程序的Join操作分为Reduce Join和Map Join两种：

- **Reduce Join**：map方法对记录打标签，以连接字段为key，其余字段加标签为value；reduce方法通过标签区分不同来源，然后合并。缺点是所有合并操作在Reduce阶段完成，Map阶段压力小但Reduce阶段压力大，容易产生**数据倾斜**；
- **Map Join**：在Map阶段缓存多张表，提前处理业务逻辑，**适合小表关联大表**。
前者通过打标签来区分不同来源的记录，然后用连接字段为key，其余部分加标签为value进行reduce输出。具体操作如下：

1. Driver类添加缓存文件：`job.addCacheFile(new URI)`；
2. 设置ReduceTask数量为0：`job.setNumberReduceTasks(0)`；
3. Mapper类的setup方法读取缓存文件并保存为集合；
4. map方法根据集合和数据完成关联合并。

## ETL

ETL(Extract-Transform-Load)指数据从源端经过抽取、转换和加载到目标端的过程，在运行核心业务MapReduce程序之前都需要对数据进行清洗，**ETL往往只需要运行Mapper而不需要Reducer**。

## 压缩

Hadoop数据压缩的优点是减少IO次数、减少存储空间，但缺点是增加CPU开销。因此使用压缩的原则是CPU密集型应用少用压缩，而IO密集型应用多用压缩。
