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

:pencil:计算机网络知识总结(1)：TCP/IP。
<!--truncate-->

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

简单来说，4次挥手就是2轮的FIN发送和ACK回复。

:question: **第2、3次握手是否可以合并为1次**：不可以！Server接收到Client的FIN报文时，可能还有一些数据没有发完，因此先回ACK表示接收到了Client的FIN请求，等到其数据发送完毕后再发送FIN表示Server也要断开连接。

:question: **为什么Client进入`TIME_WAIT`状态后要等待2\*MSL才关闭而不是直接进入`CLOSED`状态**：MSL(Maximum Segment Lifetime)s是报文在网络中存在的最长时间，超过改时间的报文会被丢弃。等待2*MSL有两个原因：第一，**确认Server能收到Client的ACK报文**，Server可能没有收到Client第4次挥手的ACK报文，此时Server会重发FIN报文，如果此时Client处于`CLOSED`状态那么重发的FIN报文就找不到对应的连接，让Client处于`TIME_WAIT`能确保响应重发的FIN报文，从而保证Server能收到ACK；第二，**保证本次连接的数据报文从网络中消失**，如果Client发送ACK后直接进入`CLOSED`状态，然后又向Server发送新请求连接，假设端口号不变，旧连接的报文延迟到新连接达到Server，此时Server认为延迟报文是新连接的，由此产生脏数据，因此Client需要等2\*MSL来确保本次连接的所有报文在网络中消失。

### 粘包和拆包

TCP协议面向字节流，发送数据包大小不固定，并且报文也不存在指定数据包大小的字段。由于TCP根据缓冲区的大小进行包的划分，所以在业务上一个完整的包可能会被拆分为多个包发送，或者多个小的数据包合并为一个大的发送，即TCP粘包和拆包。解决方法有如下几种：

1. 消息定长：发送数据包大小固定，不足部分用空格补充；
2. 使用分隔符：例如在数据末尾添加换行符表示完整消息，数据包含分隔符时不适用；
3. 头部指定：将消息分为消息头和消息尾两部分，消息头指定长度。

### 流量控制和拥塞控制

流量控制是TCP发送方和接收方用于确认对方能够接收数据大小的机制，通过滑动窗口实现：在TCP报文头部设计了rwnd(Receiver Window)字段，由接收方用于通知发送方自己剩余可接收数据的缓冲区大小，发送方根据该值来确认发送数据的大小，确保接收方可以及时处理(**接收方会丢失来不及处理的数据**)。发送方维护发送窗口，接收方维护接收窗口，发送窗口和接收窗口的序号的上下界不一定要一样，甚至大小也可以不同。

:::info 流量控制引发的死锁
当发送方收到了窗口为0的应答，便停止发送数据等待接收方的下一个应答；但不幸地是下一个窗口不为0应答在传输中丢失，由此发送方一直等待而接收方以为发送方已经收到应答也在等待，最终导致双方互相等待，形成死锁。解决方法是使用持续计时器，每当发送方接收到大小为0的窗口应答后就开启该计时器，时间一到就主动发送报文查询接收方窗口大小，若接收方仍返回零窗口则重置计时器并等待，否则说明应答报文丢失，此时重置发送窗口后重新开始发送。
:::

滑动窗口只考虑对方的处理能力，但没有考虑整个网络的负载，因此又设计了拥塞控制，它包含慢启动、拥塞避免、快重传和快速恢复4种算法。其中，前2个算法用于拥塞发生前，第3个用于拥塞发生时，第4个用于拥塞解决后。在TCP报文中设置cwnd(Congestion Window)字段表示拥塞窗口大小，它由发送方探测网络情况主动调整。实际中会同时考虑流量控制和拥塞控制，因此**发送方的窗口大小不超过min(rwnd, cwnd)**。

1. **慢启动**：一开始设置cwnd为1，每经过一个传输轮次，cwnd加倍。为了防止cwnd增长过大，还设置了慢开始阈值ssthresh：cwnd小于ssthresh时使用慢开始算法，大于时使用拥塞避免算法，等于任选慢开始和拥塞避免。

2. **拥塞避免**：到cwnd到达ssthresh后，cwnd每经过一次传输轮次加1而不是加倍。无论是慢启动还是拥塞避免阶段，**只要发送方判断出现网络拥塞(判断依据是未按时收到应答)就把ssthresh设置为出现拥塞时的一半(但不小于2)**，然后重新将cwnd设置为1，执行慢启动。
