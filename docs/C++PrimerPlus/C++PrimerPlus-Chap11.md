---
layout: article
title: 使用类
permalink: /C++-Primer-Plus-Note/chap11
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十一章读书笔记
:::

## 操作符重载
操作符重载和函数重载同属于C++多态，对于如下声明的Time类，声明并定义了一个加法操作符的重载
```cpp
class Time{
private:
    int hours;
    int minutes;
public:
    Time();
    Time(int h, int m = 0);
    void AddMin(int m);
    void AddHr(int h);
    void Reset(int h = 0; int m = 0);
    Time operator+(const Time &t) const;
    void Show() const;
};

Time Time::operator+(const Time &t) const {
    ...
}
```
使用该加法重载有两种调用方式`a=b.operator+(c);`或者`a=b+c;`
- 重载的操作符不必是成员函数，但**必须至少有一个操作数是用户定义的类型**
- 不能改变操作符原来的句法规则二，比如单目变双目，优先级改变
- **不能定义新的操作符**，比如定义operator**()函数表示求幂
- **不能重载的操作符**有`sizeof`,`.`,`.*`,`::`,`?:`,`typeid`,`const_cast`,`dynamic_cast`,`reinterpret_cast`,`static_cast`，简记为**除了`!`以外所有含点`.`的操作符和*_cast不能重载**
- 大多数操作符都可以通过成员或者非成员函数重载，但`=`，`()`,`[]`,`->`只能通过成员函数重载

## 友元简介
友元有以下三种：
- 友元函数
- 友元类
- 友元成员函数

考虑这么一种情况，为Time类实现了\*操作符重载，这意味着我们只能使用`a = b*2`的调用格式，而不能使用`a = 2*b`，因为2不是Time类，此时可以考虑使用非成员函数的运算符重载，即定义并实现函数`Time operator*(int m, const Time &t)`，但又出现了一个问题：**非成员函数不能访问Time类的私有数据**，而将该非成员函数声明为该类的友元函数即可  
创建友元函数的第一步是将其原型声明放在类声明中，并在前面加上关键字friend，这意味着：
- 该函数虽然在类声明中声明，但**它不是成员函数**，不能通过`.`来调用
- 尽管不是成员函数，但**它与成员函数的访问权限相同**

第二步是写友元函数定义，但**不要在定义中使用关键字friend**，有了这种声明和定以后，`2*b`被解释为`operator*(2, b)`。接下来考虑常见的<<重载，用于对象的格式化打印，此时一般使用友元函数，其定义为
```cpp
ostream & operator<<(ostream & os, const ClassType & obj){
    os << ...
    return os;
}
```
这样做的好处是可以连续使用多个<<把要打印的信息连接起来

## 类型转换
将标准类型变量赋值给另一种标准类型变量，若这两种类型兼容，则C++自动进行类型转换，对于程序员自己定义的class，当定义一个参数的构造函数时如`Time::Time(int m);`，语句`Time t=6;`调用这个构造函数生成临时对象然后将其复制到t中，这是一种隐式的类型转换，如果使用`explicit Time::Time(int m);`，将会关闭这种特性，此时只能通过`Time t=Time(6)`或者`Time t=(Time)6`来显式的进行类型转换，如果把构造函数的参数类型int换成double，则`Time t = 6`首先将int类型6转为double类型6.0，再进行类型转换，但是两者同时存在就会产生二义性  
既然能从int转为Time类型，那么能返回来把Time类型转换为int吗？答案是肯定的，做法是实现C++操作符函数——转换函数，形式为`operator typeName();`，注意以下三点：
- 转换函数必须是类方法
- 转换函数没有返回类型
- 转换函数没有参数

同样地也需要注意二义性，如果同时提供了Time转int和double的转换函数，`cout<<t`或者`double d=t`都会是编译器报错