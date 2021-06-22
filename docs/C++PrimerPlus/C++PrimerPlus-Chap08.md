---
layout: article
title: 函数探幽
permalink: /C++-Primer-Plus-Note/chap8
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第八章读书笔记
:::

## 内联函数
常规函数调用是程序跳至函数入口地址处，执行后返回，内联函数的编译代码和程序代码“内联”，函数代码替换函数调用，程序无需跳转到另一个位置执行代码，因此内联函数的运行速度比常规函数稍快，但代价是需要占用更多的内存，使用这项特性，需要采取以下措施**之一**：
- 函数声明前加上关键字`inline`
- 函数定义前加上关键字`inline`

通常的做法是省略原型，将整个定义放在原本提供原型的地方，**内联函数是向编译器的请求，当编译器发现该函数过大或者递归等时，并不会把它当做内联函数**，如果C语言的宏执行了类似函数的功能，应考虑将其转换为C++内联函数

## 引用变量
引用是已定义变量的别名，`int a; int &b = a;`定义引用变量b是a的别名，类似`int*`表示指向int的指针，`int&`中&不是地址操作符而是类型标识符的一部分，表明是指向int的引用
### 引用和指针
- 指针可以声明后赋值，而引用必须声明时初始化
- 引用更接近于const指针，在创建时初始化，**一旦与某个变量关联就将一直效忠于它**
- 指针可以为空，但是没有空引用
- 指针可以修改，但是**引用不能修改**
- `int *p = &a; int &c = *p;`，使用指针对引用初始化，c是a的别名，p指向别的变量后c依然指向a

### 引用和函数参数
- 使用引用作为函数参数，和使用指针相比，函数原型中`*`改为`&`，函数定义中不需要使用`*`解引用
- 引用参数没有const修饰，引用比传递值限制更严格，不能使用类似`x+3`的非左值表达式作为实参
- 引用参数有const限制，在**实参类型正确但非左值**或**实参类型不正确但可转换为正确类型**这两种情况下会生成临时变量

```cpp
inline void fun_const(const int &x) {cout<<x;}
inline void fun_normal(int &x) {cout<<x;}

int a = 1;
float b = 1.0;

fun_normal(a);          // OK
fun_normal(a+1);        // Error, 非左值
fun_normal(b);          // Error, 类型不匹配
fun_normal(b+1);        // Error, 非左值且类型不匹配

fun_const(a);           // OK
fun_const(a+1);         // OK, 生成临时变量
fun_const(b);           // OK, 生成临时变量
fun_const(b+1);         // OK, 生成临时变量
```
对于形参为const引用的C++函数，参数不是左值或者不匹配下，C++将创建正确类型的匿名变量，将函数调用的参数值传递给该匿名变量，并让参数来引用该变量，**尽可能的将引用参数声明为const**

### 引用和参数返回值
通常返回机制将返回值复制到临时存储区域中，随后调用程序访问该区域，返回引用意味着调用程序将直接访问返回值而不需要拷贝，返回引用的函数实际上是被引用变量的别名，避免将临时变量引用返回
```cpp
const int &clone(int &x) {
    // 错误
    int a;
    a = x;
    // 正确
    int &a;
    a = x;
    return x;
}
```

## 默认参数
必须通过函数原型来设置默认参数，并且必须从右向左添加默认值，这意味着**某个参数设置默认值，其右侧的所有参数也都要有默认值**，函数定义中可以没有默认参数
```cpp
int fun(int n, int m = 4, int j = 5);       // OK
int fun(int n, int m = 4, int j);           // Error

int fun(int n, int m, int j){
    n = m * j;
    n -= m + j;
    return n;
}
```
## 函数重载
函数重载是C++多态(polymorphism)特性之一，**区分函数是否重载的关键是参数列表，数目类型顺序一一对应的形参列表(也称函数特征标)相同不是重载，不比较形参名，不比较返回类型(也称函数类型)**，注意编译器在检查函数特征标时，把引用类型和类型本身视为同一个特征标，**区分const和非const**
```cpp
double cube(double x);
double cube(double &x);         // Error，非函数重载

double power(double x, double y);
double power(const double x, double y);     // OK, 函数重载

int type(double y);
int typo(float y);              // 函数名不同，非函数重载

int hey(int x);
double hey(int y);              // 函数类型不同非函数重载
```

## 函数模板
一个交换任意类型值的函数模板例子
```cpp
template <typename T>
void swap(T &a, T &b){
    T tmp;
    tmp = a;
    a = b;
    b= temp;
}
```
关键字typename也可以替换为class，模板不能缩短执行时间，最终的代码不包含任何模板，只包含为了程序生成的实际函数
- **函数模板也可以重载**，定义数组交换的函数模板`template <typename T> void swap(T [], T[], int)`
- **并非所有模板参数都必须是模板参数类型T**，如上所示交换数组的swap函数表示数组长度的参数直接写int而不是T

### 函数模板的显式具体化
以下分别是swap函数非模板，模板和具体化的3种原型，它们的优先级是非模板函数 > 具体化模板 > 常规模板，其中第三行`swap<double>`中的`<double>`是可选的，因为函数的参数类型表示，这是一个double的具体化，所以也可以写成`template <> void swap(double &, double &);`，一种老式的写法是`void swap(double &, double &);`，即去掉`template <>`
```cpp
void swap(int &, int &);
template <typename T> void swap(T &, T &);
template <> void swap<double>(double &, double &);
```
编译器使用模板为特定类型生成函数定义时，得到的是模板实例，如`int a=2, b=3; swap(a,b)`编译器自动生成int类型的模板实例，这种实例化方式称为**隐式实例化**，**显示具体化**声明在关键字template后面包含`<>`，而显式实例化没有

## 重载解析
决定为函数调用使用函数定义的过程称为重载解析，编译器选择的优先次序为
1. 完全匹配，但常规函数优于模板
2. 提升转换，如char/short转int，float转double
3. 标准转换，如int转char，long转double
4. 用户定义的转换，如类声明中定义的转换

完全匹配的多个函数模板，最**"具体"**的优先，最具体指编译器推断使用哪种类型时执行的转换最少
```cpp
template <typename T> void fun(T t);
template <typename T> void fun(T *t);

fun("abc");     //使用第二个函数模板
```