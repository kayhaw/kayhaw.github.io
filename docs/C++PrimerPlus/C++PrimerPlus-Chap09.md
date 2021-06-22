---
layout: article
title: 内存模型和名称空间
permalink: /C++-Primer-Plus-Note/chap9
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第九章读书笔记
:::

## 单独编译
- 程序源代码的组织结构为头文件，源代码文件分开，头文件中不能包含函数定义，除非该是内联函数
- 不要使用#include包含源文件代码，这将导致多重声明
- 使用#ifndef和#endif进行头文件管理

## 存储持续性，作用域和链接性
数据的存储持续性区别在于其保留在内存中的时间
- **自动存储持续性**：在函数定义**中**声明的变量(包括函数参数)
- **静态存储持续性**：在函数定义**外**声明的变量和**使用static定义**的变量
- **动态存储持续性**：使用new操作符分配的内存一直存在，直到使用delete操作符将其释放

作用域描述名称在文件(翻译单元)中的可见范围，链接性描述名称如何在不同单元间共享
- 自动变量的名称没有链接性，因为不能共享
- 局部作用域的变量只在定义它的代码块中可用
- 全局(文件)作用域的变量在**定义位置**到文件结尾间都可使用
- 自动变量的作用域为局部，静态变量的作用域是全局还是局部取决于它是如何被定义的
- 在函数原型中使用的名称只在包含参数列表的括号内可用(这就是为什么这些名称不重要的原因)
- C++函数的作用域是整个类或者整个名称空间，但不能是局部的，一是不能在代码块中定义函数，二是定义了代码块内的函数也不能被其他函数调用

自动变量的作用域从声明位置开始到代码块结束，未初始化的自动变量的值是未知的，编译器使用堆栈管理自动变量，和C一样，C++也支持使用register关键字来声明局部变量，表示请求编译器，希望把变量放在存储器中而不是内存堆栈，但编译器不一定会这么做(同inline)，变量被存储在寄存器中则没有内存地址，不能使用&操作符，**这种声明一旦使用register声明就会生效，即使编译器实际上没有使用寄存器存储变量**  
静态变量有外部链接性，内部链接性和无链接性三种，**编译器默认将静态类型的变量设置为0，对于复杂类型，静态结构和数组的每个元素设置0**，如果要自己初始化静态变量只能用**常量表达式**
```cpp
int global = 100;           // 外部链接性
static int local = 10;      // 内部连接性

void fun(int n){
    static int count = 0;   // 无链接性
}
```
写在函数体外面的变量都是静态变量，不是非得要加上static，但加上static后就变成内部连接性的,只能在包含它的文件中使用，但是写在代码块内的就要加上static
- 定义声明：`double warning = 0.3;`
- 引用声明：`extern double warning;`
- **引用声明不能初始化变量**，C++中使用`::warning`来解析warning名称，表示这是个全局变量
- 外部链接性的静态变量只能在一个文件中定义声明，其他文件只能使用`extern`来引用声明，多个文件定义声明会起冲突
- 文件a.cpp定义声明静态外部变量`static int b=2`，文件b.cpp定义声明**同名**常规外部变量`int b=3`，在a.cpp中`b=2`将覆盖`b=3`，即静态变量隐藏常规外部变量
无链接的局部静态变量在代码块中使用static定义，在代码块不活跃时仍然存在，**若初始化了静态局部变量，程序只在启动时进行一次初始化**
```cpp
void reading(char *text){
    static int total = 0;
    int readme = 0;
    while(*text++)
        readme++;
    total += readme;
}
```
上面的代码随着调用reading函数次数增加，每次读取字符个数都会累加到total中，而不是每次开始total又重置为0

## 说明符和限定符
说明符有：`auto`，`register`，`static`，`extern`，`mutable`，在同一个声明中不能使用多个说明符；限定符有：`const`，`volatile`，volatile关键字表明**即使程序代码没有对内存单元进行修改，其值也可能会发生修改**，例如将一个指针指向某个硬件位置，包含来自串口的时间或信息，这种情况下硬件可能会修改其中的内容，针对编译器对频繁访问的变量进行缓存到存储器的优化，volatile关键字告诉编译器不要进行这种优化  
在C++中const限定符对默认存储类型稍有影响，**const全局变量的链接性为内部的**，即函数体外的`const int c=10`等同于`static const int c=10`，要想让其变为外部的，需要加上extern，即`extern const int c=10`，此时是定义声明，而不是引用声明

## 函数链接性
默认函数链接性为外部的，在**原型和定义中都**使用关键字static设置函数为内部的，此时该函数只在它定义的文件中可见

## 语言链接性
C语言一个函数名对应一个函数，但C++一个函数名可能对应多个函数(函数重载)，所以C++编译器需要执行名称矫正，为了区别对待使用函数原型来指出使用哪一种约定：
```cpp
extern "c" void fun(int);
void fun(int);
extern "c++" void fun(int);
```
C++中关键字`extern`的另一种特殊用法

## 动态存储
new和delete控制动态内存，而不是作用域和链接性规则，使用new初始化指针必须在函数中，不能在函数外，因为只能使用常量表达式来初始化静态存储变量
```cpp
// in test.cpp file
int *p = new int[20];       // Error
int fun(int x){
    int *p = new int[20];   // Right
}
```

## 布局new操作符
new负责在堆中找到一个足以满足要求的内存块，还可以通过它指定内存位置，称为布局new操作符，使用时注意以下几点：
- 需要包含头文件`#include <new>`
- 例子中delete s2相当于delete buffer，这是不允许的，因为静态存储区域不是delete管辖的范围

```cpp
#include <new>

struct std {
    char name[20];
    int score;
};

char buffer[50];

int main(void) {
    std *s1, *s2;
    s1 = new std;
    s2 = new (buffer) std;
    delete s1;
    delete s2;      // Error!
    return;
}
```

## 名称空间
C++使用关键字`namespace`定义新的声明区域来创建命名的名称空间，名称空间可以是全局的，也可以在另一个名称空间中，但**不能在代码块内**，因此默认情况下名称空间中的名称是外部链接性的，名称空间是开放的，可以把名称加入到已有的名称空间中
```cpp
namespace Pack {        // 创建命名空间
    double car;
    int bus;
    ...
    void usage();
} 

namespace Pack {
    void print();       // 命名空间添加函数原型
}

namespace Pack {        // 命名空间添加函数定义
    void print(){
        cout<<"hello"<<endl;
    }
}
```
使用域名解析操作符`::`来限定名称，如`Pack::bus=10;`，若不想每次使用名称时都要限定，C++提供using声明和using编译两种指令，前者使得**特定**的标识符可用，后者使得**整个名称空间内的标识符**可用
```cpp
namespace Pack {        // 创建命名空间
    double car;
    int bus;
    ...
    void usage();
} 
char bus;
int main() {
    using Pack::bus;    // using声明，bus作用域为main块
    int bus;            // Error, 已经有了Pack::bus
    cin>>bus;           // 使用Pack::bus
    cin>>::bus;         // 使用全局的bus
    ...
}
```
using声明使得后面的标识符在声明**所属的区域内可用**，上例中把`using Pack::bus`放到main外面，bus就是全局名称；using编译指令使用`using namespace Pack`来使得Pack中的所有名称都可用
- 函数中的using编译指令在其他函数中并不生效
- 名称空间和声明区域定义了相同的名称，**using声明会起冲突**，**using编译局部版本会隐藏名城空间版本**
- 推荐使用using声明
- 名称空间可以嵌套
- 名称空间中可以使用using声明和using编译
- using编译指令是可以传递的，如下所示`using namespace Tool`等于`using namespace Tool`和`using namespace Pack`

```cpp
namespace Pack {
    int x;
}

namespace Tool {
    using namespace Pack;
}
```
- 可以给命名空间创建别名，`namespace tool=hello::world::tool`，用来简化名称
- 未命名的名称空间类似static全局变量，不能在所属文件外其他地方使用

使用名称空间的指导原则：
- 不要在头文件中使用using编译指令
- 导入声明首选作用域解析符或者using声明
- using声明首选将其作用域设置为局部而不是全局