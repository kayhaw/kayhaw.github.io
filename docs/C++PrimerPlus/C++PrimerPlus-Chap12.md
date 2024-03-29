---
layout: article
title: 类和动态内存分配
permalink: /C++-Primer-Plus-Note/chap12
sidebar:
    nav: cpp-reading-notes
tags:
  - C++
  - ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十二章读书笔记
:::

## 动态内存和类
不能在类声明中初始化静态成员变量，**声明只是描述如何分配内存，但并不分配内存**，静态成员的初始化格式为`typeName className::variable=value`，初始化语句在类声明之外，位于方法文件而不是头文件中，在头文件中初始化会引起多次初始化的错误，**若静态成员变量还使用const修饰，则可以在类声明中初始化**  
- 删除对象可以释放对象本身占用的内存，但是成员指针所指向的内存不能释放，因此必须在析构函数中使用delete释放构造时new分配的内存
- 语句`String a=b;`使用一个对象来**初始化**另一个对象，编译器将自动生成`String (const String&)`的**复制构造函数**，而语句`a=b`是**赋值操作符重载**，区别在于a是否为已经构造完成的对象，前者不是，后者是

C++自动提供了以下成员函数：
- 默认构造函数，若没有定义构造函数
- 复制构造函数，若没有定义
- 赋值操作符重载，若没有定义
- 默认析构函数，若没有定义
- 地址操作符重载，若没有定义

如没有提供任何构造函数，C++创建默认构造函数，该函数参数列表和函数体都是空的，因此对象的值是**未知**的；复制构造函数有如下几种调用形式
```cpp
String b("hello");
String a(b);
String *a = new String(b);
String a = b;
String a = String(b);
```
其共同点都是把已经初始化的对象b的值复制给该没有初始化的对象a，也就是说`=`号左边的变量名有类名，若没有类名，则a是已经构造过的对象，此时就变成了`=`赋值操作符重载，复制构造函数逐个赋值**非静态成员**(也称为**浅复制**)，浅复制只复制指针值，没有复制指针所指向内存，因此需要定义显式的复制构造函数来进行深度复制；将已有的对象赋给另一个对象时使用重载的赋值操作符
- 静态成员函数不能通过对象调用，只能由类名和作用解析操作符使用
- 静态成员函数只能使用静态数据成员，const函数不只能使用const数据成员
- 构造函数的`new`，`new[]`要和析构函数的`delete`，`delete[]`成对出现
- 应该自主地定义能深度复制的复制构造函数

函数返回对象时，若返回传递给它的对象参数，可以通过返回引用来提高效率，返回对象是函数中的局部变量不能按引用返回，而因该要按值返回
- 使用new初始化对象，`className *a = new className(value)`，value类型为typeName，将调用`className(typeName)`的构造函数，而`className *a = new className`将调用默认构造函数

以下情况调用析构函数
- 对象是动态变量，执行完该变量的程序块时，调用该对象的析构函数
- 对象是静态变量，程序结束时调用析构函数
- 对象是new创建的，使用delete时调用析构函数

使用new布局操作符创建的对象需要显式调用析构函数

## 初始化列表
**const成员**，**引用成员**和**类成员**都**必须**使用初始化列表来初始化，初始化列表在构造函数参数列表的右括号值，使用冒号分隔
```cpp
Queue::Queue(int qs):qsize(qs){
    ...
}
```
- 只能用于构造函数
- static const属于静态成员，可以不用在初始化列表中初始化
- 按照初始化列表的出现顺序初始化，而不是声明顺序
- 初始化列表的执行在构造函数体执行之前