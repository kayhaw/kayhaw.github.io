---
layout: article
title: 对象和类
permalink: /C++-Primer-Plus-Note/chap10
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十章读书笔记
:::

## 抽象和类
C++的类是对物体的抽象，包含类声明(数据成员和方法，概括描述)，类方法定义(描述方法的实现，提供细节)两个部分
```cpp
class Stock {
    private:
        char company[100];
        int shares;
        double price;
        double total;
        void set_tot() {total = shares * price;}
    public:
        void buy(int num, double price);
        void sell(int num, double price);
};          //注意分号！
```
使用类对象的程序直接使用public部分，而private部分只能在通过共有成员函数访问，这种将实现细节和抽象分开的方式称为封装，数据成员通常放在private部分，设计私有方法来处理不属于共有接口的实现细节
- class中默认的访问控制权限是private，声明私有部分时可以省略不写private
- 定义类方法使用`::`指出其所属的类，同时和普通函数区分
- 类方法可以访问private部分
- 定义在类声明中的函数自动称为内联函数，如`set_tot()`
- 在类声明外定义内联函数只需在**定义函数头**加上`inline`

## 构造/析构函数
常规的初始化语句不能用于类，如下所示，由于数据部分默认是private，不能直接访问，把class换成struct或者所有数据成员声明为public可以。实际上，通常所有的数据成员都是private，而只有类成员函数才能访问它们，所以需要一个特殊的成员函数用于对象初始化，称之为类的构造函数
```cpp
class std {
    char name[20];
    int score;
};
std s = {"kayhaw", 60};
```
- 构造函数**没有返回值**，函数名同类名
- 显式地调用构造函数：`Stock food = Stock("world", 250, 1.25);`
- 隐式地调用构造函数：`Stock food("world", 250, 1.25);`
- 使用new调用构造函数：`Stock *food=new Stock("world", 250, 1.25);`
- 无法使用对象来调用构造函数，因为在构造函数构造出对象之前对象是不存在的

默认构造函数是在未提供显示初始化值时(如`Stock stock;`)调用的构造函数，**当且仅当没有定义任何构造函数时，编译器才会提供默认构造函数**，从其调用形式可以看出默认构造函数没有参数列表或者参数列表都是默认值，程序员选择其中之一实现，通常选择后者
- `Stock s;`，`Stock *s=new Stock;`，`Stock s=Stock();`，前两个是默认构造函数隐式调用，第三个是默认构造函数显式调用
- **`Stock s();`是返回类型为Stock的函数声明，不是调用构造函数，笔试题常考陷阱**，隐式调用默认构造函数不需要`()`

析构函数名是在类名前面加上`~`，**没有返回值**，并且和构造函数不同的是，**析构函数没有参数！**
- 通常不应该在代码中显式地调用析构函数而由编译器决定
- 通过new创建的对象delete时自动调用其析构函数
- 程序员没有提供析构函数，编译器将隐式提供默认析构函数
- **析构函数不可以重载，而构造函数可以**
- 良好的编程习惯是在构造函数使用new后在析构函数中用delete

语句`Stock s=Stock("World", 200, 1.25);`和`s=Stock("World", 200, 1.25);`是不同的，前者是对象s的**初始化**，后者是创建临时对象并将其**赋值**给对象s。对于以下的代码片段
```cpp
const Stock s = Stock("World", 200, 1.25);
s.show();
```
因为不能确定show方法是否会修改const对相关s，编译器将拒绝第二行，需要保证show函数不会修改对象，C++的解决方法是**把const关键字放在函数括号后面**，show函数的声明和定义变成
```cpp
void show() const;
void Stock::show() const {
    ...
}
``` 
**const成员函数show()和括号后面没加const的非const成员函数show()属于函数重载**

## this指针
this指针指向用来调用成员函数的对象(this被作为隐藏参数传递给方法)，使用`*this`作为调用对象的别名，在类方法中引用成员`x`实际上等同于使用`this->x`，上述提到的const方法实际上就是给this指针加上const限定使其不能用来修改对象的值

## 对象数组
语句`Stock ss[4];`使用默认构造函数创建对象数组ss的每一个元素对象，也可以调用构造函数
```cpp
Stock ss[4] = {
    Stock("world", 20, 1.25);
    Stock();
}
```
剩下两个没有显式初始化的元素将使用默认构造函数，**要创建类对象数组，最好确保类有默认构造函数**

## 类作用域
在类中声明的名称作用域为整个类，该名称在类外是不可知的，所以Stock类和Person类可以有相同的成员名称name，同时意味着需要通过类名解析操作符来访问成员  
当想要使用一个类作用域的符号常量时有两种方法
- 在类中声明一个枚举
- 使用关键字static