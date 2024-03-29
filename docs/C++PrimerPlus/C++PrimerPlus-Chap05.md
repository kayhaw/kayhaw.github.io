---
layout: article
title: 循环和关系表达式
permalink: /C++-Primer-Plus-Note/chap5
sidebar:
    nav: cpp-reading-notes
tags:
  - C++
  - ReadingNotes
---
import useBaseUrl from '@docusaurus/useBaseUrl';

:::info
《C++ Primer Plus》中文版第五章读书笔记
:::

## for循环
for循环分为初始化，循环测试，循环体和循环更新三部分，流程图如下所示

![cpp_for.svg](/img/doc/C++PrimePlus/cpp_for.svg)

注意for循环各部分之间的位置，**循环更新在循环体之后**，测试部分的值不一定要是true或false，可以为任意表达式，值为0的表达式转为false，值非0的表达式转为true，`for`是关键字，不能将函数命名为for
- 赋值表达式的值为其**左侧**成员的值，如`x=20`值为20，复杂点`x=(u=3)+1`值为4，利用这个特性给多个变量赋相同值`x=y=z=1`
- 语句`cout.setf(ios::boolalpha)`设置cout输出bool值为true/false，否则默认为1/0
- 表达式加上分号就成为语句，但反之不成立
- C++在C的基础上对for循环增加了一些特性，可以在初始化部分声明新变量，该变量生命周期等同于for循环

```cpp
for(int i = 0; i < 5; ++i){
    cout<<i<<endl;
}
cout<<i<<endl;          //错误，i只存在于for循环内
```

for循环常用到递增操作符`++`和递减操作符`--`:
- 前缀版本值马上更新，后缀版本值在顺序点之后更新
- 副作用(计算表达式值时同时会修改变量值)没有影响时推荐前缀版本
- **由于前缀版本++，前缀版本--和\*的优先级相同，且都是从右往左结合，所以++\*pt是先解引用再递增，\*++p是先指针+1再解引用**
- **由于后缀版本++，后缀版本--比\*的优先级高，所以\*p++是先对指针+1，然后解引用加1之前的指针值**
- for循环更新步长改变还可以使用组合赋值操作符(+=, -=, *=, /+, %=)，**注意是将右侧的表达式的值和左侧的值进行相应运算后再赋值给左侧**
```
int i = 8,j = 2;
int j *= i + 2;     //j的值为20
```
- for循环的花括号是必须的，除非循环体只有一条语句，推荐无论何时加上花括号，**类似for，while的复合语句内声明的变量是临时的，在复合语句的花括号之外就无法访问**
```cpp
for(int i = 0; i < 5; ++i)
    cout<<i<<endl;
    i += 2;             //不是for循环的语句，i不存在,下面一条语句也是
    cout<<i<<endl;
```
- 作为逗号操作符的','，逗号表达式从左往右执行各个表达式的值，**表达式的值是最右侧的值，但要把这个值赋给其他变量需要加上括号，因为其优先级最低**
```cpp
x = 7, 10;      // 等同于(x = 7),10; 故x赋值为7，
x = (7, 10);    // x赋值为10
```

## 关系表达式
- 关系操作符的优先级低于算术操作符
- 不要混淆赋值操作符`=`和相等操作符`==`，编程规范`20 == x`，把待比较的变量写在右边，常量写在左边，这样少了一个=编译阶段就会报错
- C风格的字符串直接用关系操作符比较大小，而应使用strcmp()函数
- 比较string类的字符串可以直接用关系操作符，而且string对象可以和C风格字符串比较

## while循环
while循环的执行流程一开始就进行判断，判断结果为false就直接退出，循环体一次也不执行，while循环和for循环本质上是相同的，使用时和for循环一样需要注意以下几点
- 循环体语句块始终加上花括号括住(C++不是Python，不要尝试用缩进来表示循环体)
- 不要在判断条件的括号外直接加`;`，否则循环体为空，本来的循环体变成了语句块，**笔试题常考的陷阱**

## do while循环
和while相反，do-while一开始就执行循环体，再进行条件判断，循环体至少会被执行一次，**注意，do while语句的末尾要加上`;`**

## 循环和文本输入
- 使用`cin.get(ch)`获取输入流的下一个字符(包括空白符)，ch为引用参数，之前提到直接`cin.get()`来不保存的获取一个字符，这里体现的是C++的函数重载
- 许多系统采取Ctrl+Z表示文件结尾EOF，使用`cin.fail() == false`检测是否读取到EOF，通常EOF的值被定义为-1

## 嵌套循环和二维数组
使用new创建动态二维数组，但是一定要记得**delete []**
```cpp
int **p = new int*[10]
for(int i = 0; i < 10; ++i) {
    p[i] = new int[10];
    for(int j = 0; j < 10; ++j) {
        p[i][j] = 10 - j + i;
    }
}
for(int i = 0; i < 10; ++i)
    delete [] p[i];
```
