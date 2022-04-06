---
title: Java实现LRU和LFU
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - LRU
  - LFU
description: Java实现LRU和LFU
hide_table_of_contents: false
---

:pencil:如何用Java来实现LRU和LFU两种算法
<!--truncate-->

## LRU

最近最少使用算法(Least Recently Used, LRU)是最常用的缓存淘汰算法：当缓存空间不够时，将上一次访问时间最早的记录淘汰后加入新记录。[Leetcode 146. LRU 缓存](https://leetcode-cn.com/problems/lru-cache/)要求实现包含如下方法的LRUCache类来模拟LRU缓存：

1. `LRUCache(int capacity)`：以正整数capacity作为容量初始化LRU缓存；
2. `int get(int key)`：如果关键字key存在于缓存中，则返回对应值，否则返回-1；
3. `void put(int key, int value)`：如果关键字key已经存在，则更新对应值为value；如果key不存在则向缓存中插入key-value，如果插入后键值对个数超过capacity，则淘汰最久未使用的键值对。

### 哈希表加双向链表

可以通过哈希表来维护键值对的唯一性、双向链表来维护元素访问顺序从而实现LRU缓存。设计双向链表的首节点是最新刚被访问的节点，尾节点是最久未被访问的节点，注意“**访问**”包含查询、更新、新增3种操作，因此每次进行如上操作时都需要将对应节点从双向链表中删除并挪动为头节点。具体地，对于get、put方法，设计逻辑如下：

1. get方法先判断key是否存在；
   1. key不存在，返回-1；
   2. key存在，返回value。**此时key是最近被使用的节点，将其挪到双向链表的头部**。
2. put方法先判断key是否存在：
   1. key不存在，直接插入到哈希表，**接着判断是否超过缓存大小，是的话就淘汰链表尾部的键值对**；
   2. key存在，则更新哈希表中对应value；
   3. 将新增key对应节点移到链表头部。

:::info 总结
除了get方法key不存在外，其他情况都需要更新key为双向俩表的头节点(别忘了这个逻辑)。当插入key存在时还需要判断是否需要淘汰key。
:::

```java
public class LRUCache {
    private Map<Integer, Integer> map;
    private Deque<Integer> queue;
    private int capacity;

    public LRUCache(int capacity) {
        this.map = new HashMap<>();
        this.queue = new LinkedList<>();
        this.capacity = capacity;
    }

    public int get(int key) {
        if(map.containsKey(key)) {
            removeToFirst(key);
            return map.get(key);
        } else {
            return -1;
        }
    }

    public void put(int key, int value) {
        if(map.containsKey(key)) {
            removeToFirst(key);
            map.put(key, value);
        } else {
            queue.addFirst(key);
            map.put(key, value);
            if(map.size() > capacity) {
                int last = queue.removeLast();
                map.remove(last);
            }
        }
    }

    public void removeToFirst(int key) {
        queue.remove(key);
        queue.addFirst(key);
    }

}
```

### 继承LinkedHashMap

实际上，Java内置的LinkedHashMap类已经将其所有键值对维护成双向链表，因此可以通过继承LinkedHashMap来快速地实现LRUCache类。LinkedHashMap通过如下3个回调函数维护双向链表的顺序：

1. `void afterNodeAccess(Node<K,V> e)`：访问节点e后，将节点e挪至双向链表尾部；

```java
void afterNodeAccess(Node<K,V> e) { // move node to last
    LinkedHashMap.Entry<K,V> last;
    if (accessOrder && (last = tail) != e) {
        LinkedHashMap.Entry<K,V> p =
            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
        p.after = null;
        if (b == null)
            head = a;
        else
            b.after = a;
        if (a != null)
            a.before = b;
        else
            last = b;
        if (last == null)
            head = p;
        else {
            p.before = last;
            last.after = p;
        }
        tail = p;
        ++modCount;
    }
}
```

2. `void afterNodeRemoval(Node<K,V> e)`：删除节点e后，将节点e从双向链表中删除；

```java
void afterNodeRemoval(Node<K,V> e) { // unlink
    LinkedHashMap.Entry<K,V> p =
        (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
    p.before = p.after = null;
    if (b == null)
        head = a;
    else
        b.after = a;
    if (a == null)
        tail = b;
    else
        a.before = b;
}
```

3. `void afterNodeInsertion(boolean evict)`：插入节点e后，判断是否将头节点从双向链表中删除。

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
    LinkedHashMap.Entry<K,V> first;
    if (evict && (first = head) != null && removeEldestEntry(first)) {
        K key = first.key;
        removeNode(hash(key), key, null, false, true);
    }
}

protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
    return false;
}
```

可以看到，成员变量accessOrder和方法removeEldestEntry影响着访问和插入节点后的回调函数行为。其中accessOrder默认为false，表示元素访问不影响它在双向链表中的位置(按照插入顺序排序而不是访问顺序)，而LRU算法要求按照访问顺序维护双向链表，**因此需要将其设置为true**，此时只能通过`public LinkedHashMap(int initialCapacity,float loadFactor,boolean accessOrder)`构造函数来设置。

另外，removeEldestEntry方法默认返回false，表示元素插入后不淘汰最老的节点，而LRU算法要求缓存容量满时删除最老节点，因此需要重写该方法。综上所述，实现继承自LinkedHashMap的LRUCache类代码如下：

```java
class LRUCache extends LinkedHashMap<Integer, Integer>{
    private int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75F, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    // 这个可不写
    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity; 
    }
}
```

:::caution 注意
在LinkHashMap中，双向链表的头节点表示最老的节点，而尾节点才表示最新的节点。
:::

## 总结

1. LinkHashMap在元素访问、删除、插入分别对应3个回调函数，通过修改影响这3个回调函数的变量和方法来实现自定义LRU类；
2. LinkHashMap的双向链表头节点是最老的节点，而尾节点才是最新的节点；
3. **未来开发sourcesflow时，各种读写插件加载后的维护也需要用到LRU算法**；
