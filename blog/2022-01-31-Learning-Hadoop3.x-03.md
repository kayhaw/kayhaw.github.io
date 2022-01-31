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
