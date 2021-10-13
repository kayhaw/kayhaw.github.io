---
title: 每日算法题-链表相关总结
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Algorithm
  - LinkedList
description: 每日算法题-链表相关总结
hide_table_of_contents: false
---

总结反转链表、循环链表、删除倒数节点等经典算法题目
<!--truncate-->

## 反转链表

[题目描述](https://leetcode-cn.com/problems/reverse-linked-list/)：给定单向链表的头结点`head`，就地反转链表并返回新的头结点。
:::tip 思路
就地反转需要用到两个临时变量指针pre和next，pre保存当前节点的上一个节点（同时也是反转链表新的头结点），next保存当前节点的下一个节点，它的作用是让当前节点指针cur能够过渡到右边还没有反转的部分。
:::

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode pre = null, next = null;

        while(head != null) {
            next = head.next;
            head.next = pre;
            pre = head;
            head = next;
        }

        return pre;
    }
}
```

## 删除倒数第N个节点

[题目描述](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)：给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
:::tip 思路
经典快慢指针方案：fast指针先走n步，然后slow指针和fast指针同步走，当fast到达末尾时slow所指位置便是倒数第n个节点。**为了方便删除倒数第n个节点，让slow再慢一步，最终指向所要删除节点的前驱**，这里为了让deleted能被回收将其完全隔离，而不是简单的一行代码`slow.next=slow.next.next`。
:::

```java {4}
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode tmpHead = new ListNode(-1, head);
        ListNode fast = head, slow = tmpHead, deleted;// 注意fast和slow的起始位置不同

        while(n-- > 0) {
            fast = fast.next;
        }

        while(fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        deleted = slow.next;
        slow.next = deleted.next;
        deleted.next = null;

        return tmpHead.next;
    }
}
```

## :banana:链表的第一个重合点

[题目描述](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)：给你两个单链表的头节点`headA`和`headB`，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回`null`。

:::tip 思路

1. 使用HashSet保存A链表所有节点，然后遍历B链表，在HashSet中包含的即为相交节点

2. 特殊的双指针遍历：**当指针a到达完A链表末尾，转而遍历B链表，指针b亦然。当a等于b时即为所求结果**
  
证明：设A、B链表长度分别为m、n，重叠部分长度为k，当指针a和指针b都走了(m+n-k)步时，此时a、b都在链表交点(即a==b)。如果没有交点，最后a和b也都会为null，此时也有a==b。

**在编写代码时注意两点：一是用临时节点保存头结点否则找不到最开始位置，二是while循环内的判断条件是`tmpA==tmpB`而不是`tmpA.next==tmpB.next`。**
:::

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode tmpA = headA;
        ListNode tmpB = headB;
        while(tmpA != tmpB) {
            tmpA = (tmpA == null) ? headB : tmpA.next;
            tmpB = (tmpB == null) ? headA : tmpB.next;
        }
        return tmpA;
    }
}
```
