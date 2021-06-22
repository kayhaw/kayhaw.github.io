---
layout: article
title: 资源管理
permalink: /Effective-C++-Note/chap3
sidebar:
    nav: effective-c++-reading-notes
tags: Effective-C++ ReadingNotes C++
---
:::info
《Effective C++》英文第三版读书笔记第三章
:::

>资源是你从系统中借来使用，用完后必须还给系统的东西，否则坏事将发生。在C++中，最常使用的资源就是动态分配内存，但内存只是资源的冰山一角，其他的常见资源还包括文件描述符，互斥锁，在GUI中的字体和格式刷，数据库连接和网络套接字。无论是哪种资源，使用完后必需释放。

## Item13:使用对象管理资源
假设我们现在要开发一个建模投资的库，不同的投资类型从根类型Investment继承而来，假设库通过工厂函数提供具体的Investment对象，假设函数f()尽职尽责地完成申请，使用，删除一系列操作，看起来ok，但是会有f不能成功删除对象的情形。比如在函数体内的省略部分`...`某处执行了return语句，或者循环中使用continue，或者抛出异常等等，这都会导致delete语句不会被执行，这不仅引起Investment对象内存泄露，也会到导致该对象所持有的其他资源泄露
```cpp
class Investment { ... };
Investment* createInvestment();     // 返回动态申请Investment对象的指针
void f() {
    Investment *pInv = createInvestment();      // 调用工厂函数
    ...                                         // 使用pInv
    delete pInv;                                // 删除对象
}
```
仔细地编写代码可以应对此类错误，但是随着时间推移代码可能更改，仅仅让f处理资源释放是不可行的。为了确保资源总是被正确删除，我们需要把资源放入一个对象中，该对象的析构函数会自动地释放资源，当资源在堆上分配，仅仅在单独的代码块或者函数中使用，在离开代码块或函数时释放资源，标准库的auto_ptr就是针对这种情况：
```cpp
void f() {
    std::auto_ptr<Investment> pInv(createInvestment());
    ...
}           // 离开时自动销毁pInv智能指针对象，同时释放Investment对象资源
```
上面的例子展示了使用对象管理资源的两个要点：
- 获取资源后立即移交给资源管理对象
- 资源管理对象使用析构函数确保资源释放

因为auto_ptr自动删除指向的对象，所以不能有超过一个auto_ptr指向同一对象，否则对象会被删除两次，这是未定义的行为，为了防止此类问题，auto_ptr具有这种特性：**拷贝构造函数和赋值操作符函数的结果是原来的auto_ptr对象指向null，被拷贝的新auto_ptr指向原来的对象，即拷贝是控制转移**。auto_ptr的种种古怪特性使得它并不是管理动态分配资源的最好方式，比如就不适合STL容器，因为STL容器要求拷贝的行为是“自然”的  
另一种替代方式是使用智能引用计数指针(RCSP，Reference-Counting Smart Pointer)，它记录特定资源的引用个数，当引用个数为0时删除资源，但是不能解决循环引用的问题(两个未曾使用的对象互相指向对方)，tr1::shared_ptr就是一种RCSP，函数f可以改写为：
```cpp
void f() {
    ...
    std::tr1::shared_ptr<Investment> pInv(createInvestment());
    ...
}
```
这个代码看起来跟使用auto_ptr的没什么区别，但是shared_ptr的拷贝更自然，可以用在STL容器中：
```cpp
void f() {
    ...
    std::tr1::shared_ptr<Investment> pInv1(createInvestment());
    std::tr1::shared_ptr<Investment> pInv2(pInv1);      // pInv2和pInv1指向相同对象
    pInv1 = pInv2;                                      // 同上
    ...
}
```
**注意auto_ptr和shared_ptr一样在析构函数中使用delete而不是delete []，所以不要用它们来指向动态分配的数组**，实际上很少看到这样的代码因为std::vector和std::string可以作为数组的替代
```cpp
std::auto_ptr<std::string> aps(new std::string[10]);    // Error!
std::tr1::shared_ptr<int> spi(new int[1024]);           // Error!
```
:::tip 总结
为了防止资源泄露，使用RAII(Resource Acquisition Is Initialization)对象管理资源；两个常用的auto_ptr，shared_ptr是常见选择，注意auto_ptr的拷贝将其置为空**
:::
:::caution
**新版本C++已经弃用auto_ptr**
:::

## Item14:在资源管理类中仔细考虑赋值行为
Item13中介绍了使用auto_ptr和shared_ptr来管理基于堆分配的资源，但并不是所有的资源都是堆分配的，此时这两种智能指针就不合适，你需要自己创建资源管理类，比如使用提供C API的lock和unlock函数，用于操作互斥锁对象Mutex：
```cpp
void lock(Mutex *pm);       // 上锁
void unlock(Mutex *pm);     // 解锁
```
为了确保不会忘记给上锁对象解锁，你可能需要创建一个类Lock依照RAII原则来自动管理资源
```cpp
class Lock {
    public:
        explicit Lock(Mutex *pm): mutexPtr(pm) { lock(mutexPtr); }
        ~Lock() { unlock(mutexPtr); }
    private:
        Mutex* mutexPtr;
};
```
使用Lock类很简单，声明对象即可，资源操作按照RAII的方式进行
```cpp
Mutex m;
...
{
    Lock m1(&m);    // 上锁
    ....
}                   // 退出语句块时自动解锁
```
代码看上去没什么问题，但万一Lock对象被拷贝了怎么办？每个设计RAII类的作者都需要考虑这个问题：当RAII对象被拷贝时应该怎么做？通常情况下，有以下几种方案可供选择：
- **禁止拷贝**，很多情况下，对类似Lock类的对象进行拷贝是没有什么意义的，此时应该禁止对象的拷贝，Item6介绍禁止对象拷贝的方法，比如让Lock类继承Uncopyable对象：
```cpp
class Lock: private Uncopyable {
    ...
};
```
- **对底层资源进行引用计数**，有些情况是最后持有资源的对象销毁后资源才销毁，此时RAII对象应该使用引用计数，即使用shared_ptr来实现拷贝操作，shared_ptr的构造函数第二个参数指定销毁函数，所以代码应该是：
```cpp
class Lock {
    public:
        explicit Lock(Mutex *pm): mutexPtr(pm, unlock) {
            lock(mutexPtr.get());
        }
    private:
        shared_ptr<Mutex> mutexPtr;
};
```
注意Lock类并没有实现析构函数，因为没有必要，编译器默认提供的析构函数调用mutexPtr的析构函数，该析构函数会自动调用shared_ptr的删除函数unlock(当且仅当Mutex对象的引用为0时才执行)
- **复制底层资源**，有些时候需要多份资源的拷贝，也就是深度拷贝，比如string类
- **转移底层资源的控制权**，在少数情况下需要让RAII对象在拷贝时指向新的资源，也就是auto_ptr定义的拷贝行为

由于拷贝函数在未显式提供时会由编译器自动构造生成，所以除非编译器的默认定义符合对拷贝行为的预期，否则需要程序员显式编写函数代码

:::tip 总结
拷贝RAII对象需要拷贝其管理的资源，对资源拷贝行为的定义决定RAII对象拷贝行为；常见的RAII对象拷贝行为有拒绝拷贝，引用计数，深度拷贝或者转移资源控制权
:::

## Item15:在资源管理类中提供原生资源的访问
资源管理类有效地预防资源的泄露，完美的情况下你应该不允许任何对资源的直接访问，但是没有完美的东西，许多API更偏向于直接访问资源，除非你保证不会用这些API，否则还是不得不绕过资源管理对象来处理原生资源。比如在Item13中使用智能指针来处理工厂函数的调用`std::shared_ptr<Investment> pInv(createInvestment());`，假设使用Investment对象的函数定义为`int dayHeld(const Investment *pi);`，你可能想通过`int days=daysHeld(pInv);`来调用，但是代码并不会通过编译，因为参数类型为Investment指针，而pInv类型为`shared_ptr<Investment>`，需要把RAII对象转为其包含的资源，有显式/隐式两种方式
- 显式转换，使用shared_ptr和auto_ptr提供的get()方法
```cpp
int days = dayHeld(pInv.get());
```
- 隐式转换，智能指针重载了`*`，`->`操作符
```cpp
class Investment {
    public:
        bool isTaxFree() const;
        ...
};
Investment* createInvestment();
std::shared_ptr<Investment> pi1(createInvestment());
bool taxable1 = !(pi1->isTaxFree());
std::auto_ptr<Investment> pi2(createInvestment());
bool taxable2 = !((*pi2).isTaxFree());
```

有时获取RAII对象内的原生资源，一些RAII类提供了隐式的转换函数，如下所示的RAII类用于提供C接口调用的字体资源：
```cpp
FontHandle getFont();       // 获取字体资源的C API

void releaseFont(FontHandle fh);    // 释放字体资源的C API

class Font {        // 管理字体资源的RAII类
    public:
        explicit Font(FontHandle fh): f(fh) {}
        ~Font() { releaseFont(f); }
    private:
        FontHandle f;       // 原生字体资源
};
```
假设有大量C API调用FontHandle类型，需要把Font类转为FontHandle类型，Font可以提供显式的转换函数get：
```cpp
class Font {
    public:
        FontHandle get() const { return f; }
    ...
};
Font f(getFont());
changeFontSize(f.get(), 25);
```
缺点就是每次需要调用get方法很麻烦，另一种方式是提供隐式的转换函数，使得调用C API变得自然：
```cpp
class Font {
    public:
        operator FontHandle() const { return f; }
    ...
};
Font f(getFont());
changeFontSize(f, 25);
```
隐式转换函数的缺点是增加错误的风险，比如本来想要创建Font对象但误写成了FontHandle：
```cpp
Font f1(getFont());
FontHandle f2 = f1;     // 本来想赋值Font对象但是变成了f1隐式转换为底层资源类型然后赋值
```
当f1销毁后字体资源被释放，而f2成为悬挂对象。RAII类显示/隐式转换取决于资源类型和使用环境，最好的设计方案是让接口正确使用起来很简单，错误使用起来很复杂。你可能会发觉返回原生资源的函数和封装的作用相违背，表面上看起来是一种设计灾难，但实际上RAII类的存在并不是为了封装，而是为了提供资源释放的方式。

:::tip 总结
API经常要求获得原生资源，所以RAII类应该提供相应接口；可以通过显示/隐式两种方式提供接口，显式接口更安全，但隐式接口更方便
:::

## Item16:使用配套的new和delete
考虑如下代码，看上去没什么问题，但实际上有个重大失误，程序的行为未定义，至少100个string对象中的99个不会被正确地释放。
```cpp
std::string *stringArray = new std::string[100];
...
delete stringArray;
```
使用new操作符时首先申请内存，然后1个或多个构造函数被调用，使用delete相反，调用1个或多个析构函数，然后释放内存，内存中有多少个对象成为关键，也就是指针指向的是单个对象还是对象数组。当使用delete时，加上`[]`表示指向的是对象数组，否则默认是单个对象：
```cpp
std::string *stringPtr1 = new std::string;
std::string *stringPtr2 = new std::string[100];
delete stringPtr1;
delete [] stringPtr2;
```
`delete [] stringPtr1`和`delete stringPtr2`都是未定义的行为，new表达式使用`[]`，delete表达式也要有`[]`，当使用`typedef`时，需要格外注意遵守这个规则：
```cpp
typedef std::string AddressLines[4];

std::string *pal = new AddresLines;

delete pal;     // 未定义行为
delete [] pal;  // 正确
```
为了避免混淆，不要使用typedef来声明数组类型，而是使用C++标准库提供的vector

:::tip 总结
new表达式里面有`[]`，相应地delete表达式也要有`[]`，new表达式里面没有`[]`，delete表达式里面一定不要有`[]`
:::

## Item17:使用单独的语句把new创建的对象放在智能指针中
假设有以下两个提供优先级函数和根据优先级进行动态分配Widget类的函数：
```cpp
int priority();
void processWidget(std::shared_ptr<Widget> pw, int priority);
```
注意这里使用智能指针来管理资源，如果使用
```cpp
processWidget(new Widget, priority());
```
来调用processWidget函数将会导致编译错误，因为shared_ptr构造函数声明为explict，不接受这种隐式的类型转换，正确的调用方式为
```cpp
processWidget(std::shared_ptr<Widget>(new Widget), priority());
```
但实现情况中可能还会出现问题，在processWidget的调用过程之前，编译器必须完成下面三件事：
1. 调用priority()函数
2. 执行`new Widget`
3. 调用shared_ptr构造函数

其中C++保证2先于3执行，但是1的相对顺序并不确定，可能最后代码的执行顺序为：
1. 执行`new Widget`
2. 调用priority()函数
3. 调用shared_ptr构造函数

但万一要是priority抛出异常怎么办？此时new返回指针丢失，造成资源泄露。避免这个问题的方法很简单：单独使用一条语句来创建对象并封装为智能指针。
```cpp
std::shared_ptr<Widget> pw(new Widget);
processWidget(pw, priority());
```
此时priority()的执行不会夹在中间

:::tip 总结
在单独的语句中将new创建对象包装在智能指针中，否则会产生难以捉摸的资源泄露
:::