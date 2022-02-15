---
title: 计算机网络知识总结(1)
author: 何轲
author_title: Never settle down
author_url: https://github.com/kayhaw
author_image_url: https://avatars.githubusercontent.com/u/16892835?v=4
tags: 
  - Networking Basic
  - Summary
description: 计算机网络知识总结(1)：TCP/IP
hide_table_of_contents: false
---

## 传输层

### TCP3次握手

3次握手指客户端和服务端建立TCP连接的过程，如下图所示：

1. Client向Server发送请求连接报文(标志位SYN=1，序列号seqnum=x，x为随机数)，发送后Client进入`SYN_SENT`状态；
2. Server接收到SYN=1的TCP报文，回复确认报文(标志位SYN=1，ACK=1，ack=x+1，seqnum=y，y为随机数)，发送后Server进入`SYN_RCVD`状态；
3. Client收到确认报文，检查acknum是否为x+1，ACK是否为1，如果正确则恢复确认报文(ACK=1，ack=y+1)，发送后Client进入`ESTABLISHED`状态；Server收到Client的回复报文后也检查ACK为1和ack为y+1，正确则Server进入`ESTABLISHED`状态。

大写的ACK表示标志位，小写的ack表示确认号。

:question: **3次握手是否可以减为2次握手**：不可以。3次握手是连接双方互相告知序列号ack并确认的过程，如果只有2次握手，则只有连接发起方的序列号被确认，由此产生问题：已经失效的连接请求又传到了Server，服务器认为是Client发送连接请求马上建立连接，然后发送确认报文，但Client不会理睬确认报文而Server认为连接已经建立，此时Server一直等待Client发送数据，造成资源浪费。

:question: **3次握手是否可以增加为4次握手**：可以，既然3次握手已经确保连接正确建立，那4次更不在话下，为了提高传输效率选择满足条件的最小次数3。

:question: **第3次握手客户端的ACK确认报文丢失会怎样**：对于Server，它没有收到ACK确认后重发之前的SYN+ACK报文5次，然后进入`CLOSED`状态，此时Client收到重发报文会重新传ACK给Server；对于Client，如果Server在超时重发过程中，此时Client重发ACK确认报文，Server接收后进入`ESTABLISHED`状态，如果Server已经处于`CLOSED`状态，则Client发送数据Server会以RST报文应答。

:question: **已经建立连接但客户端故障会怎样**：Server每收到Client的请求后都会复位一个计时器，默认为2小时，若计时器到点后还未收到Client数据，Server向Client发送探测报文，以后每隔75秒发送一次，如果发送10个探测报文后Client仍无响应则Server认为Client故障并关闭连接。

:question: **第3次握手是否可以携带数据**：可以，此时Client已经确认Server接收、发送正常，但第1次握手不能携带数据，否则可以通过发送含大量数据的SYN报文来攻击Server。

#### 半连接队列与SYN Flooding攻击

Server与Client第1次握手后进入`SYN_RCVD`状态，此时双方还未完全建立连接，Server将该状态下的请求连接放到队列中，称之为**半连接队列**。SYN Flooding攻击指通过发送大量的半连接请求，让Server花费大量CPU和内存资源来维护半连接队列，从而导致系统运行缓慢甚至崩溃，防范措施有设置网关超时、使用SYN网关、SYN代理等。

### TCP4次挥手

4次挥手指客户端和服务端断开TCP连接的过程，如下图所示：

1. Client向Server发送请求断开报文(FIN=1，seq=x)，发送后进入`FIN_WAIT_1`状态；
2. Server接收到FIN报文，返回确认报文(ACK=1, ack=x+1)，发送后进入`CLOSE_WAIT`状态，而Client进入`FIN_WAIT_2`状态；
3. Server向Client发送请求关闭报文(FIN=1, seq=y)，发送后进入`LAST_ACK`状态；
4. Client接收到FIN报文，返回确认报文(ACK=1，seq=y+1)，进入`TIME_WAIT`状态；Server收到后进入`CLOSED`状态，客户端等待2*MSL后也进入`CLOSED`状态。
