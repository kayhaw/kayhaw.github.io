---
layout: article
title: 函数
permalink: /C++-Primer-Plus-Note/chap7
sidebar:
    nav: cpp-reading-notes
tags:
  - C++
  - ReadingNotes
---
:::info
《C++ Primer Plus》中文版第七章读书笔记
:::

## 定义和原型
函数的定义是如下所示的一整个语句块，当typeName为void时表示函数没有返回值，相应的返回语句为`return;`或者不写
```cpp
typeName functionName(parameterList){
    statements
    return value;
}
```
- `value`的类型必须为typeName类型或者**可以被转换为typeName类型**
- 定义中可以写**多条**return语句，但最后肯定只从某个return语句中返回

把定义中的函数头拿出来添加`;`就成了函数原型，函数原型确保编译器检查处理返回值，参数个数和类型
- 函数原型不要求参数名称，只要有类型就够了
- 函数原型的参数名称和定义中的不必相同
- ANSI C和C中函数原型是可选的，在C++中原型是必须的
- C++中原型参数列表为空等同于使用void，即函数不需要参数
- ANSI C中参数列表为空意味着将在后面定义参数列表，C++使用`...`表示

参数和传递方式
- 定义中的参数变量称为形参(parameter)，调用时传递给函数的值称为实参(argument)
- 函数中的变量(包括参数)都是自动(auto)类型，自动分配和释放

:::note
在写计算组合数$C_{n}^{k}$的函数时，使用s=s*n/i格式的乘除交替方式，可以防止整个乘造成溢出
:::

## 函数和数组
- C++中当且仅当在函数头或者函数原型中，int *arr和int arr[]的含义是相同的，即arr是一个int指针
- 不过int arr[]还提醒用户arr不仅指向int，还是int数组的第一个int，而int *arr指向独立的int值
- **指针(数组名)加1，实际上是加上一个与指针指向类型长度相等的值**
```cpp
int d2[2][2] = {1, 2, 3, 4};
cout<<d2<<endl;
cout<<d2+1<<endl;       //加1后的偏移量是2*4
```
- 由于在函数头中数组名退化为指针，数组的长度必须通过另一个参数传递，即`void fillarr(int arr[], int size)`
- 不要在函数中通过sizeof来尝试获得数组大小，得到的是指针大小
- 函数头`int sum(int arr[4])`并不能够传递数组大小

指针和const：const在\*前面，指向内容只读，const在\*后面，指向地址只读(指针常量)
- 当数据类型本身不是指针，可以将const数据或者非const数据的地址赋值给const指针，除此之外只能将非const数据的地址赋值给非const指针
- 通过其他技巧来尝试修改const值都会引起编译器的警惕，在g++中即使能够运行最后const值也不会修改
```cpp
const int **pp2;
int *p1;
const int n = 13;
pp2 = &p1;
*pp2 = &n;
*p1= 10;
cout<<n<<endl;      //还是13
```

## 函数和二维数组
正确的原型声明为`int sum(int (*ar2)[4], int size)`或者`int sum(int ar2[][4], int size)`
- 给*ar2加上括号是必须的，否则int\* ar2[4]解释为指向一个int指针组成的数组 
- 列数[4]是必须的，它指出二维数组的类型为int(*)[4]

## 函数和C风格字符串
表示字符串有3种方式：char数组，引号括起的字符串常量，char指针，在函数中都是char*类型，但C风格字符串和常规char数组的区别在于字符串有内置结束字符'\0'，所以不必将字符串长度作为参数传递给函数
```cpp
while(*str){
    statements
    ++str;
}
```

## 函数和结构体
数组名就是数组第一个元素地址，但是结构体名不是结构的地址，使用'&'来获取，为了避免结构体值复制的麻烦，通常使用地址传递，并且只读取结构体时使用const限制

## 递归
函数自己调用自己，C允许main调用自己，C++不允许

## 函数指针
单纯的函数名就是函数的地址，通常把函数原型中的函数名换成(*f)就得到这类函数的指针，函数指针的赋值要求参数列表和返回类型必须相同
```cpp
double ned(double);
int ted(int);
double (*pf)(int);      //声明函数指针
pf = ned;               //错误
pf = ted;               //错误
```
使用(*pf)(5)来调用对应的函数，**也可以直接写pf(5)**