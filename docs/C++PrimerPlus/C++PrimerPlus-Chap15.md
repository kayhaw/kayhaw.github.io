---
layout: article
title: 友元、异常和其他
permalink: /C++-Primer-Plus-Note/chap15
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十五章读书笔记
:::

## 友元
友元不仅可以是函数，也可以是类。友元类的**所有方法**可以访问原始类的私有成员和保护成员，但也可以只将特定的成员函数指定为另一个类的友元。以表示电视机的TV类和表示电视遥控器的Remote类为例
```cpp
// tv.h
class TV{
    public:
        friend class Remote;
        enum {OFF,ON};
        enum {MinVal, MaxVal = 20};
        enum {Antenna, Cable};
        enum {TV, VCR};

        TV(int s = off, int mc = 100):state(s), volume(5), maxchannel(mc), channel(2), mode(Cable), input(TV){}
        void onoff(void){state = (state== ON) ? OFF : ON;}
        bool ison() const {return state == ON;}
        bool volup();
        bool voldown();
        void chanup();
        void chandown();
        void set_mode(){mode = (mode == Antenna) ? Cable : Antenna;}
        void set_input(){input = (input == TV) ? VCR : TV;}
        void settings() const;
    private:
        int state;
        int volume;
        int maxchannel;
        int channel;
        int mode;
        int input;
};

class Remote{
    private:
        int mode;
    public:
        Remote(int m=TV::TV):mode(m) {}
        bool volup(TV &t) {return t.volup();}
        bool voldown(TV &t) {return t.voldown();}
        void onoff(TV &t) {t.onoff();}
        void chanup(TV &t) {t.chanup();}
        void chandown(TV &t) {t.chandown();}
        void set_chan(TV &t, int c) {t.channel = c;}
        void set_mode(TV &t) {t.set_mode();}
        void set_input(TV &t) {t.set_input();}
};

// tv.cpp
#include <iostream>
#include "tv.h"

bool TV::volup() {
    if(volume < MaxVal){
        volume++;
        return true;
    }
    else
        return false;
}

bool TV::voldown() {
    if(volume > MinVal){
        volume--;
        return true;
    }
    else
        return false;
}

void TV::chanup() {
    if(channel < maxchannel)
        channel++;
    else
        channel = 1;
}

void TV::chandown(){
    if(channel > 1)
        channel--;
    else
        channel = maxchannel;
}

void TV::settings() const {
    using std::cout;
    using std::endl;
    cout<<"TV is"<<(state == OFF ? "off" : "on")<<endl;
    if(state == ON){
        cout<<"Volume setting = "<<volume<<endl;
        cout<<"Channel setting = "<<channel<<endl;
        cout<<"Mode = "<<(mode == Antenna ? "antenna" : "canle")<<endl;
        cout<<"Input = "<<(input == TV ? "TV" : "VCT")<<endl;
    }
}
```
由上代码可以看到，除了构造函数外，Remote方法都将一个TV对象引用作为参数，表明遥控器都必须针对特定的电视机，友元类声明`friend class Remote`可以位于公有，私有或者保护部分，因为友元不属于类成员，所以限定符对其无效

## 限定声明和向前声明
上面的代码可以看到其实Remote类除了set_chan()方法，其他方法都是调用TV类方法的公有方法，因此set_chan()是唯一需要作为友元的方法，限定成员函数为友元的声明为
```cpp
class TV{
    friend void Remote::set_chan(TV &t, int c);
    ...
};
```
但仅仅如此还是不够的，因为编译器处理这条语句必须知道Remote的定义，否则无法知道Remote是一个类(还是一个命名空间)，set_chan是这个类的方法，因此需要把Remote的定义放在TV定义前面，但是Remote方法又使用到了TV类，所以TV类定义应该放在Remote类定义之前...如此形成了循环依赖，解决的方法是向前声明
```cpp
// Correct forward declaration
class TV;
class Remote {...};
class TV {...};
```
但是不能像下面这样向前声明，因为编译器在TV类中看到Remote类的set_chan()方法被声明为友元之前，应该看到Remote类的声明和set_chan()方法声明
```cpp
// Wrong forward declaration
class Remote;
class TV {...};
class Remote {...};
```
那上面所谓正确的向前声明代码，Remote方法里面也用到了TV类的方法啊，也不是还没声明定义吗？的确是的，但可以通过把Remote的方法定义放在TV类的后面来写，也就是
```cpp
class TV；
class Remote {
    public:
        bool volup(TV &t);
    ...
};
class TV {
    public:
        bool volup();
}

inline bool Remote::volup(TV &t) {...}
...
```
对于编译器来说，它看到`bool volup(TV &t);`，通过向前声明知道TV是个类就可以了，这里还都只是声明，没有定义调用TV类的方法，所以编译通过，到了真正把TV类声明完后，编译器就知道了TV类的方法，接下来写Remote的方法实现就可以调用这些方法了，注意**定义时添加inline**使方法和之前一样都是内联的。内联函数的链接性是内部的，所以内联函数定义必须放在使用函数的文件中，在这个例子中内联定义放在头文件，定义放在其他源文件也可以，但必须删除inline关键字使函数链接性是外部的  
进一步地，还可以声明Remote和TV类互为友元类，还是要注意被先出现的方法定义在调用方法声明之后
```cpp
class TV {
    friend class Remote;
    public:
        void buzz(Remote &r);
    ...
};
class Remote {
    friend class TV;
    public:
        void Bool volup(TV &t) {t.volup();}
        ...
};
inline void TV::buzz(Remote &r){
    ...
}
```
更近一步地，还可以声明同一个函数为两个类的友元，如下所示，注意使用向前声明来表明Analyzer是一种类
```cpp
class Analyzer；    // forward declaration
class Probe {
    friend void sync(Analyzer &a, const Probe &p);
    friend void sync(Probe &p, const Analyzer &a);
    ...
};
class Analyzer {
    friend void sync(Analyzer &a, const Probe &p);
    friend void sync(Probe &p, const Analyzer &a);
};

inline void sync(Analyzer &a, const Probe &p){
    ...
}

inline void sync(Probe &p, const Analyzer &a){
    ...
}
```
总结就是当你在声明定义之前仅仅只需要表明名称A是某一种类时，使用向前声明`class A;`，但是在A的声明定义之前不能调用A的方法，因为编译器还不知道

## 嵌套类
在一个类中声明另一个类称为嵌套类(nested class)，包含类的成员函数可以创建使用被嵌套类的对象，当且仅当声明位于public部分才能在类外使用嵌套类，而且必须使用作用域解析操作符
```cpp
class Queue {
    class Node{
        public:
            Item item;
            Node *next;
            Node(const Item & i):item(i), next(0) {}
    };
};
```
Node类在Queue类中是私有的，外界不可访问，对于Queue类内部来说，Node类可见，但是Node类中的访问控制也会起到作用，Queue类只能访问Node类中的公有部分

## 异常
C++异常是对程序运行过程中发生的异常情况的响应，由三部分组成
- `throw`抛出异常
- `catch`捕获异常
- `try`标识可能出现异常的代码
以简单的除0异常为例
```cpp
#include <iostream>
double hmean(double a, double b);
int main(void) {
    double x, y, z;
    std::cout<<"Enter two numbers: ";
    while(std::cin>>x>>y){
        try{
            z = hmean(x, y);
        }catch(const char*s){
            std::cout<<s<<std::endl;
            std::cout<<"Enter a new pair of numbers: ";
            continue;
        }
        std::cout<<"Harmonic mean: "<<z<<endl;
    }
    return 0;
}
double hmean(double a, double b){
    if(a == -b)
        throw "bad hmean arguments: a = -b not allowed";
    return 2.0*a*b/(a+b);
}
```

throw和catch后面接异常类型，可以是本例中的字符串，也可以是其他类，throw并不是将控制权返回给调用程序，而是让程序沿函数调用向后退，直到找到包含try块的函数，**如果没有try块或者匹配的catch处理，默认情况下程序将调用abort()函数**，通常异常类型都是定义的类，针对上例可以设计异常类
```cpp
class bad_hmean {
    private:
        double v1;
        double v2;
    public:
        bad_hmean(int a = 0, int b = 0): v1(a), v2(b) {}
        void mesg();
};

inline void bad_hmean::mesg() {
    std::cout<<"Invalid arguments: a = -b\n";
}
```
从而函数hmean可以使用如下代码
```cpp
if(a == -b)
    throw bad_hmean(a, b);  // 构造函数生成匿名对象
```
除此之外，还可以使用异常规范对函数定义进行限定，如`double hmean(double a, double b) throw (bad_hmean);`，也就是函数声明后面加上throw和括号包住，使用逗号分隔的异常类型列表，函数定义也要加上这些信息，提醒用户该函数会引起异常

### 异常特性
- 使用throw语句将控制权返回到**第一个这样的函数：包含能够捕获相应异常的try-catch组合**
- 引发异常时编译器总是创建一个**临时拷贝，即使异常规范和catch块中指定的事引用**，如下所示代码bh是oops的拷贝而不是oops本身，**但还是推荐使用引用，因为基类引用可以执行派生类对象**
```cpp
double hmean(double a, double b){
    if(a == -b){
        bad_hmean oops;
        throw oops;
    }
    ...
}
...
try{
    hmean(a, b);
}
catch (bad_hmean & bh){
    ...
}
...
```
- 因为基类引用可以执行派生类对象，假设一组通过继承关联起来的异常类型，则在异常规范中只需要列出一个基类引用就可以与任何派生类对象匹配，但是要注意catch块的排列顺序要和派生顺序相反，如下所示的代码若catch bad_1放在最前面则bad_2和bad_3异常不会被捕获
```cpp
class bad_1 {...};
class bad_2: public bad_1 {...};
class bad_3: public bad_2 {...};
void duper() throw (bad_1){
    ...
    if(oh_no)
        throw bad_1();
    if(rats)
        throw bad_2();
    if(drat)
        throw bad_3();
}
try {
    duper();
}
catch(bad_3 &be){...}
catch(bad_2 &be){...}
catch(bad_1 &be){...}
```
- 使用`catch(...) {//语句}`，异常类型为`...`表示捕获任何异常，应该放在最后，类似switch语句中的default

### exception类
C++提供头文件`<exception>`定义exception类，该类提供what()虚方法，返回一个字符串，用于被继承类重新定义实现，注意catch异常时要用引用，头文件`<stdexcept>`定义了logic_error和runtime_error类，并派生出不同的继承类
- logic_error: 逻辑错误，通过合理编程可以避免
    - domain_error: 函数定义域错误
    - invalid_argument: 传参错误
    - length_error: 没有足够空间
    - out_of_bounds: 索引错误
- runtime_error: 运行期间发生，难以防范的错误
    - range_error
    - overflow_error
    - underflow_error

### bad_alloc异常和new
当new可能出现内存不够等问题时，C++选这儿返回空指针或者抛出bad_alloc异常，该异常在头文件`<new>`中声明

### 异常，类和继承
**C++中规定，在派生类中重新定义基类方法时，函数特征标必须相同，但返回类型可以不同，前提是派生类的返回类型是直接或者间接地从基类方法的返回类型派生而来**

### 异常何时迷失方向
两种情况：带异常规范的函数引发的异常没有在其异常列表内，catch没有捕获这种异常。未捕获异常程序将会调用terminate()函数，这个函数默认调用abort()函数，通过set_terminate()函数修改terminate()调用的函数，set_terminate()和terminate()函数都在头文件`<exception>`中声明，捕获的异常没有在异常规范列表内，程序调用unexpectd()函数处理，它默认也是调用abort()函数，类似地，通过set_unexpected()函数来修改
set_unexpected也可以throw新的异常，规则为
- 新异常与原来异常规范匹配，程序重新开始正常工作
- 新异常与原来异常规范不匹配，并且异常规范没有包括bad_exception类，程序调用terminate()
- 新异常与原来异常规范不匹配，但异常规范包括bad_exception类，不匹配的异常被bad_exception异常取代

还要注意异常中设计动态内存分配的问题
```cpp
double *ar = new double[10];
...
try {
    if(opps)
        throw exception();
}
catch (exception &ex) {
    delete [] ar;       // 记得在catch中释放内存
    throw;
}
...
delete [] ar;
```

## RTTI
RTTI(Runtime Type Identification)运行阶段类型识别是C++特性之一，包含三种元素
- dynamic_cast: 操作符，将指向基类指针转换指向指向派生类的指针，失败返回空指针
- typeid: 操作符，返回一个支出对象类型的值
- type_info: 结构体，存储有关特定类型的信息

RTTI只适用于包含虚函数的类层次结构，原因在于只有对于这种类层次结构，才应将派生类对象地址赋值给基类指针

### dynamic_cast操作符
指针pt所指类型为Type或者是Type继承类时，表达式`dynamic_cast<Type *> pt`成功地将pt指针转为Type类型指针，否则返回空指针；dynamic_cast也可以用于引用，但是由于没有空引用的概念，所以转换失败时抛出bad_cast异常，bad_cast异常在头文件`<typeinfo>`定义
```cpp
#include <typeinfo>
...
try{
    Superb &rs = dynamic_cast<Superb &>(rg);
    ...
}
catch(bad_cast &) {
    ...
}
```

### typeid操作符和type_info类
typeid操作符返回type_info对象的**引用**，也就是描述类相关信息的类，它接受两种参数
- 类名
- 结果为**对象**的表达式

type_info重载了`==`和`!=`操作符，用于类型比较，提供`name()`方法返回类名字符串，如果`typeid(*pg)`中pg是空指针则抛出bad_typeid异常，该异常也在头文件`<typeinfo>`中定义

## 类型转换操作符
C++提供4种类型转换操作符
- dynamic_cast: 前面已介绍
- const_cast: **只能用于**去掉之前声明的const或volatile修饰，类型不匹配将出错
- static_cast: 使用格式`static_cast <type-name>(expression)`，当type-name可被隐式转换为expression所属的类型或者expressioin可被隐式转为type-name类型，转换才合法，比如把int转为枚举值，double转int，float转long
- reinterpret_cast: 不允许删除const，用于天生危险的类型转换，比如数值转指针地址值，指针转为足以存储指针表示的整型，但是不能将指针转为更小的整型，也不能将函数指针转为数据指针