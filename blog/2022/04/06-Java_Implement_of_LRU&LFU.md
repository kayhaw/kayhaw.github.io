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
   2. key存在，则更新哈希表中对应value，并将其挪到链表头部；
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

## LFU

最不经常使用(Least Recently Used, LRU)算法：当缓存空间不够时，将访问频率最低的记录淘汰后加入新记录。[Leetcode 460. LFU缓存](https://leetcode-cn.com/problems/lfu-cache/)要求实现包含如下方法的LFUCache类来模拟LFU缓存：

1. `LFUCache(int capacity)`：以正整数capacity作为容量初始化LFU缓存；
2. `int get(int key)`：如果关键字key存在于缓存中，则返回对应值，否则返回-1；
3. `void put(int key, int value)`：如果关键字key已经存在，则更新对应值为value；如果key不存在则向缓存中插入key-value，如果插入后键值对个数超过capacity，则淘汰最不经常使用的键值对，**如果使用频率相同，则淘汰最近最久未使用的键值对**。

### 哈希表加平衡二叉树

与实现LRU算法仅靠双向链表就可以实现按照访问时间先后排序同步，LFU算法需要先比频率再比访问时间，这里选择平衡二叉树按照该比较逻辑来维护键值对的顺序。对于每个节点，添加属性freq和time分别表示对应key的访问次数和访问时间：freq越大表示访问频率越高，time越大表示访问时间最新。具体地，对于get、put方法，设计逻辑如下：

1. get方法先判断key是否存在；
   1. key不存在，返回-1；
   2. key存在，返回value。**此时key访问次数加1，访问时间加1**，并且由于这两个属性值改变，需要重新将其从平衡二叉树中删除再插入，以维持二叉树的有序性。
2. put方法先判断key是否存在：
   1. key不存在，**先判断是否缓存是否已满，是的话就淘汰二叉树中最小的节点**，接着设置新节点freq=1，time=1后插入到平衡二叉树中；
   2. key存在，则更新哈希表中对应value，同时访问次数加1，访问时间加1，更新二叉树(先删除再插入)；

```java
public class LFUCache {
    private Map<Integer, Node> map;
    private SortedSet<Node> avl;
    private int capacity;
    // 只有新增记录时time才会加1
    private int time;

    public LFUCache(int capacity) {
        this.map = new HashMap<>();
        this.avl = new TreeSet<>();
        this.capacity = capacity;
        this.time = 0;
    }

    public int get(int key) {
        if(capacity == 0 || !map.containsKey(key)) {
            return -1;
        }
        // 通过哈希表找到Node，更新其频率和访问时间，调整节点在TreeSet中位置(先删除后加入)
        Node node = map.get(key);
        avl.remove(node);
        node.freq += 1;
        node.time = ++time;
        avl.add(node);
        return node.value;
    }

    public void put(int key, int value) {
        if(capacity == 0) {
            return;
        }
        // 1. 已经存在则更新频率和访问时间，逻辑同get命中
        if(map.containsKey(key)) {
            Node node = map.get(key);
            avl.remove(node);
            node.freq += 1;
            node.time = ++time;
            node.value = value;
            avl.add(node);
            map.put(key, node);      // put和return别漏了！
            return;
        }
        // 2. 如果缓存已满，先从从哈希表和平衡二叉树中删除最不常访问节点
        if(map.size() == capacity) {
            Node exile = avl.first();
            map.remove(exile.key);
            avl.remove(exile);
        }
        // 3. 构造新节点加入到哈希表和平衡二叉树中
        Node node = new Node(1, ++time, key, value);
        map.put(key, node);
        avl.add(node);
    }

    private class Node implements Comparable<Node> {
        private int freq;
        private int time;
        private int key;
        private int value;

        private Node(int freq, int time, int key, int value) {
            this.freq = freq;
            this.time = time;
            this.key = key;
            this.value = value;
        }

        // 由于Node作为TreeSet的元素，必须重写equals和hashcode方法
        public boolean equals(Object object) {
            if(this == object) {
                return true;
            }
            if(object instanceof Node) {
                Node node = (Node) object;
                return this.freq == node.freq && this.time == node.time;
            }
            return false;
        }

        public int hashCode() {
            return freq * 1000000007 + time;
        }

        @Override
        public int compareTo(Node another) {
            return (this.freq == another.freq) ? this.time - another.time : this.freq - another.freq;
        }
    }
}
```

在编程时要注意如下几点：

1. Node必须重写equals和hashCode方法，实现comparable接口；
2. 节点访问时间应该使用LFUCache统一维护的时钟，尤其注意更新节点的time不能简单写成`node.time += 1`；
3. 删除、更新二叉树节点时不要忘记对哈希表进行相同操作。

## 总结

1. LinkHashMap在元素访问、删除、插入分别对应3个回调函数，通过修改影响这3个回调函数的变量和方法来实现自定义LRU类；
2. LinkHashMap的双向链表头节点是最老的节点，而尾节点才是最新的节点；
3. **未来开发sourcesflow时，各种读写插件加载后的维护也需要用到LRU算法**；
