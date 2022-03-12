---
title: HashMap知识点总结
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - HashMap
  - Summary
description: HashMap知识点总结
hide_table_of_contents: false
---

:pencil:HashMap知识点总结：包含HashTable、HashMap、ConcurrentHashMap
<!--truncate-->

## HashTable

## HashMap

HashMap继承自AbstractMap类并实现Map接口，是以K-V对进行存储的数据结构。在JDK 1.7中底层数据结构为数组加链表。使用Entry类存储Key和Value，而在JDK 1.8中是数组加链表/红黑树，使用Node类存储Key和Value。

### 元素插入

在插入元素出现Hash冲突时，HashMap使用拉链法将冲突的键值对排列成链表。在JDK 1.7中使用头插法，而在JDK 1.8中使用尾插法(简记七上八下)，这是因为头插法在多线程环境下会出现循环链表问题。

### 链表转红黑树

在JDK 1.7中使用拉链法解决Hash冲突，但当Hash冲突严重时链表会越来越长，查询时需要遍历链表降低效率。因此，在JDK 1.8中，**当链表长度大于8时**调用treeifyBin方法将链表转为红黑树。但treeifyBin方法并不是无脑转化，它先判断当前数组长度是否小于`MIN_TREEIFY_CAPACITY`(固定值64)，如果是的话再调用resize方法进行扩容操作。

```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

### 红黑树转链表

### resize方法

resize方法调用的时机与两个参数有关：capacity(HashMap当前最大容量)，loadFactor(负载因子，默认0.75)。如果输入数据量大于capacity * loadFactor时，则调用resize方法，包含如下两个步骤：

1. 扩容：创建一个新的Entry/Node数组，大小为原数组2倍；
2. Rehash：遍历Entry/Node，将所有Entry/Node重新hash到新数组。

通过公式`hashcode(key) & (length-1)`得到，这里利用对2的整数幂length取模结果等于与length-1按位与运行的结果，因此每次扩容时数组大小增为2倍，并且最开始默认大小也是2的4次方16。

### 其他问题

1. 为什么重写equals方法时还需要重写hashCode方法？
   
HashMap先根据key的hashCode值找到在底层数组中的位置index，当index相同时多个元素形成链表/红黑树，此时通过equals方法比较对象是否相同。如果只重写equals方法，由于任意2个对象的hashCode()返回值不同，即2个相同对象hashCode值不同，此时在第一步判断时HashMap认为这两个对象不相等，显然违背使用Hash表的规则。

2. HashMap线程安全吗？如何做到线程安全的HashMap？

不安全，JDK 1.7的HashMap使用头插法会导致循环链表问题，JDK 1.8的HashMap没有对put操作上锁导致插入数据被覆盖的问题。解决方法：1. 使用Collections.synchronizedMap()包装HashMap；2. 使用HashTable；3. 使用ConcurrentHashMap。

## ConcurrentHashMap