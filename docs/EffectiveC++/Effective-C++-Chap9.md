---
layout: article
title: 杂录
permalink: /Effective-C++-Note/chap9
sidebar:
    nav: effective-c++-reading-notes
tags: Effective-C++ ReadingNotes C++
---

:::info
《Effective C++》英文第三版读书笔记第九章
:::

## Item53:注意编译器的警告
许多程序员习惯性地忽略编译器警告，毕竟要是问题严重的话它就是个error，是吧？在其他的编程语言中，这种想法的危害可能会相对更小些，但是对于C++来说，编译器作者比你更具有经验，比如：
```cpp
class B {
    public:
        virtual void f() const;
};

class D: public B {
    public:
        virtual void f();
};
```
本来的想法是D::f重定义B::f，但是有个错误，B::f是const方法而D::f不是，因此编译器提示`warning: D::f() hides virtual B::f()`{:.warning}，很多不熟练的程序员对此的反应是“当然D::f会覆盖B::f，这就是它应该做的！”，错误！编译器是在告诉你B::f没有在D中重新声明而被完全覆盖，忽略这个警告会带来错误的程序行为，花费大量时间去调试在一开始编译器就检测到的问题。  
当对编译器警告有足够多的经验后，你将会会理解不同信息的真正含义，一旦经验成熟，你可以选择忽略一系列的警告，当然最好不要有警告，即使是在最高级别的警告，无论如何，在忽略警告之前，你要精准地理解其背后的含义，警告和代码实现是不相关的，因此编程不能粗心，单靠编译器帮你指出错误

:::tip 总结
认真对待编译器警告，努力在最高级别下实现编译器零警告；不要依赖编译器警告，不同的编译器对警告实现不同，移植到新的编译器也许会消除你依赖的警告信息
:::

## Item54:熟悉标准库，包括TR1
C++语言标准文档和标准库在1998年提交通过，在2003年，发行了小的bug改动，标准委员会继续着它的工作，但是2.0版本的C++预计在2008左右发布，因为时间的不确定，下个版本的C++被称为“C++ 0x”，因为它是200x版本的C++。C++ 0x的新特性将标准库的补充的形式出现，一些新增的功能在TR1文档(Technical Report1)中说明，在探索TR1的内容之前，我们先回顾下C++98标准库的主要部分：
- 标准模板库(STL)，它包括容器(vector，list，map等)，迭代器，算法(find，sort等)，函数对象(less，greater等)，以及各种容器和函数对象的适配器(stack，priority_queue，mem_fun等)
- Iostream，包括用户自定义缓冲区，国际化IO，以及预定义的对象cin，cout，cerr和clog
- 支持国际化，比如wchar_t(通常是16位)和wstring(由wchar_t组成的字符串)让支持Unicode变得简单
- 支持数值处理，比如复数模板complex和数组模板valarray
- 异常继承体系，包括基类exception，它的派生类logic_error，runtime_error以及其他不同的派生类
- C89标准库，1989发布的C语言标准库也包含在C++中

TR1列举了14个新组件，都包含在std命名空间中，本书的例子展示了以下TR1组件：
- 智能指针，tr1::shared_ptr和tr1::weak_ptr，shared_ptr使用引用计数，但是当对象互相引用时就会失效，这时weak_ptr派上用场，本书多次用到shared_ptr(Item13)，但是没有提到过weak_ptr
- tr1::function，表示任何可调用的对象，它的签名和目标签名一致，如果我们想登记一个回调函数，该函数参数为int返回为string，代码为
```cpp
void registerCallback(std::string func(int));
```
参数名func是可选的，因此也可以写成
```cpp
void registerCallback(std::string (int));
```
注意`std::string (int)`实质是个函数签名，tr1::function让registerCallback更加灵活，接受的参数可以是任何满足如下条件的可调用实体：参数类型是int或者可转换为int，返回类型是string或者可转换为string，tr1::function使用函数模板来实现：
```cpp
void registerCallback(std::tr1::function<std::string (int)> func);
```
对应的例子见Item35
- tr1::bind，在bind1st和bind2nd的基础上改进，支持const和非const方法，支持引用参数，对应的例子见Item35

我把剩下的TR1组件分为两个集合，第一个集合是不相关的独立功能：
- Hash表，Tr1的hash表有tr1::unordered_set，tr1::unordered_multiset，tr1::unordered_map，tr1::unordered_multimap，这些hash表的元素没有特定顺序
- 正则表达式，提供基于正则表达式的搜索，替换，配对等
- 元组，pair模板只能包含两个元素，tr1::tuple能够包含任意数目的元素
- tr1::array，支持begin和end方法的数组，tr1::array的大小在编译期是固定的，并不使用动态内存分配
- tr1::mem_fn，消化并扩展了C++98的mem_fun和mem_fun_ref
- tr1::reference_wrapper，让引用表现的像对象，使得容器可以包含引用(实际上只能包含对象或指针)
- 随机数生成工具，优于从C标准库继承的rand函数的工具
- 数学特定函数，包括Laguerre多项式，Bessel函数，完全椭圆积分等等
- C99兼容扩展，一系列函数和模板用于将C99新特性加入到C++

第二个集合包含对更高尖的模板编程技术的支持，比如模板元编程(见Item48)：
- 类型特性，特性类提供编译时类型信息(见Item47)，给定类型T，TR1特性类揭露T是否为内建类型，是否提供虚构函数，是否是空类(见Item39)，是否隐式转换为其他类型U等等，另外TR1特性类告诉类型合适的对齐方式，这在编写自定义内存分配函数中是十分重要的信息
- tr::result_of，它是一个模板，用于推导函数调用的返回类型，当编写模板时，能够推测出调用函数模板的返回类型十分重要，但是返回类型通过各种复杂方式依赖于函数参数类型，tr1::result_of让引用函数返回类型变得简单

:::tip 总结
C++标准库主要包含STL，iostream，C99标准库等；TR1添加了智能指针，通用函数指针(tr1::function)，基于hash的容器，正则表达式以及其他10个组件；TR1本身只是规范文档，可以使用Boost提供的实现
:::

## Item55:熟悉Boost
还在寻找高质量，开源的，平台/编译器无关的库？看看Boost。想要加入一群有抱负的天才C++开发者，致力于最新的库设计和实现？看下Boost。想要瞄下C++将来长什么样？瞧瞧Boost！Boost既是一个C++开发社区，也是一个免费下载C++库的集合，官方网址https://www.boost.org，它有着两点其他C++社区和网站无法比拟的特征：
- Boost由C++标准委员会成员成立，和C++标准委员会有着亲密的联系，Boost的目标之一作为C++标准新特性的试验场，TR1引入的14个新库中超过2/3由Boost实现
- 公共平等的代码审查

Boost丰富的库处理各种各样的话题，可以分为：
- 字符串和文本处理
- 容器
- 函数对象和高阶编程，其中之一就是lambda表达式：
- 泛型编程
- 模板元编程(见Item48)
- 数学和数值
- 正确性和测试
- 数据结构
- 中介语支持
- 内存
- 其他杂项，如CRC校验

Boost库包含很多东西，但不包含所有，比如它没有提供GUI开发库，数据库连接库，至少在写这本书时没有

:::tip 总结
Boost是开发开源的，平等评估的C++库的社区和网站，对C++标准有着重要影响；Boost提供许多TR1组件的实现，同时还有其他更多库
:::

:::note
Effective C++英文版出版日期为2005年，现在我看这本书时是2020年，书中所提到的智能指针shared_ptr，weak_ptr和function早在2011年开始就已经并入到C++11中，成为C++标准库的一部分，因此在前面涉及到的代码我都改为了`std::shared_ptr`，`std::function`而不是原书中的`tr1::shared_ptr`，第九章并不像前面内容有着特殊的技巧或者注意事项，这里总结为三点：1.重视编译器警告；2.熟悉**现在**C++版本的标准库；3.了解**现在的**Boost以窥视未来C++的特性
:::