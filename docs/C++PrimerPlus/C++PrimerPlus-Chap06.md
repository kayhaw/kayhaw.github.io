---
layout: article
title: 分支语句和逻辑操作符
permalink: /C++-Primer-Plus-Note/chap6
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第六章读书笔记
:::

## if语句
if语句有三种格式可选
- if 一个条件为true执行语句，否则不执行
- if-else 一个条件为true/false执行对应语句
- if-(else-if)*-else 多个条件执行相应语句，等同于switch-case语句

**执行语句块除非只有一条语句，否则都要加上花括号**

## 逻辑表达式
- 逻辑操作符`||`，`&&`的优先级低于算数操作符，因此`y == 2 && 3 < x`中不需要加括号
- **逻辑操作符是一个顺序点，左侧的后置`++`，`--`到了右边就会起作用**，`i++ < 6 || i ==j`中i和j比较时i的值为加1后的值
- `||`和`&&`的短路原则：**逻辑或在左侧为真**时不会判断右侧表达式(`1 || ++x`中x的值不会变，++x没有执行)，同理**逻辑与的在左侧为假**时不会判断右侧表达式，**笔试题常考陷阱**
- x的取值范围为[a，b]对应的代码为`a < x && x < b`，而不能像做数学题一样直接写成`a < x < b`，此时代码没有问题，但是语义出现问题，`a < x < b`被编译器解释为`(a < x) < b`，括号的值要么为1，要么为0，最后变成0/1和b的比较，**这也是笔试题常考陷阱**
- 逻辑操作符`!`的优先级大于所有关系操作符和算数操作符(**单目大于双目**)，**而`&&`优先级大于`||`**
- C++确保**从左往右**计算逻辑表达式
- 以上三种逻辑操作符还可以写成`and`，`or`，`not`

## 字符函数库cctype
- 导入头文件`#include <cctype>`
- 判断是否为字母或数字`isalnum()`
- 判断是否为字母`isalpha()`
- 判断是否为数字`isdigit()`
- 判断大小写`isupper()`，`islower()`
- 大小写转换`toupper()`，`tolower()`
- 判断空格或者水平制表符`isblank()`

## ?:操作符
唯一的三目操作符，`exp1 ? exp2 : exp3`，表达式exp1为真执行exp2，否则执行exp3，优先级仅高于`,`逗号运算符

## switch语句
通用格式如下，其中integer-exp必须是结果为整数值的表达式(**浮点数不行!**)，和Go不一样，配对case后**语句一路往下执行，除非遇到break**，因此常见的用法是每个case执行语句结尾带着break(**笔试题常考陷阱**)
```cpp
switch (integer-exp) {
    case label1: statement1;
    ...
    case labelN: statementN;
    default: statementM;
}
```
default是**其他都没有匹配上**从其对应语句开始执行，如下代码所示打印的结果是023，注意没有break
```cpp
int x = 2;
switch(x) {
    default:
        cout<<0<<endl;
    case 1:
        cout<<2<<endl;
    case 3:
        cout<<3<<endl;
}
```
由于控制流的转移不允许进入变量的作用域，所以在statementN中声明变量一定要通过花括号指出其作用域，下面的代码就会引起[编译错误](https://en.cppreference.com/w/cpp/language/switch)
```cpp
case 1: int x = 0; // initialization
        std::cout << x << '\n';
        break;
default: // compilation error: jump to default: would enter the scope of 'x'
         // without initializing it
        std::cout << "default\n";
        break;
```
- default的位置不一定在所有case之后
- 一定要注意每个statement末尾是否有break
- statement里面有变量声明的话就加上花括号
- 配对标签常是枚举类型，此时枚举提升为int类型
- 涉及取值范围，浮点测试和变量比较应该使用if-else语句而不是switch

## break和continue语句
break结束当前循环，continue语句跳过循环体的剩余部分，在while循环中跳过continue之后的语句(可能包含更新表达式)，在for循环中跳到更新表达式处

## 简单文件IO
- 使用头文件fstream
- 写入文件声明ofstream类对象，使用open方法关联文件，使用close方法关闭文件
- 文件不存在，open方法会新建同名文件，文件存在，open方法默认将其长度截断为0
- 读取文件声明ifstream类对象，使用open方法关联文件，使用close方法关闭文件
- 文件成功打开，方法is_open返回true
- 方法good()判断读取输入是否成功