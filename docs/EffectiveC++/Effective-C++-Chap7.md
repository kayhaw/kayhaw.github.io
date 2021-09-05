---
layout: article
title: 模板和泛型编程
permalink: /Effective-C++-Note/chap7
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---

:::info
《Effective C++》英文第三版读书笔记第七章
:::

## Item41:理解隐式接口和编译时多态
面向对象编程的世界以显式接口和运行时多态为中心，比如：
```c++
class Widget {
    public:
        Widget();
        virtual ~Widget();
        virtual std::size_t size() const;
        virtual void normalize();
        void swap(Widget& other);
    ...
};

void doProcessing(Widget& w) {
    if(w.size() > 10 && w != someNastyWidget) {
        Widget temp(w);
        temp.normalize();
        temp.swap(w);
    }
}
```
关于doProcessing函数：
- w声明为Widget类型的，因此必须支持Widget的接口，我们可以在源代码中查看接口详情，我把这叫做**显式接口**
- 由于Widget类的方法有些是虚函数，w调用这些方法是**运行时多态**：基于w的动态类型(见Item37)在运行时决定调用的函数

然而模板和泛型编程的世界截然不同，在这里，显式接口和运行时多态仍存在，但是作用更低，相反，隐式接口和编译时多态脱颖而出。继续以上述代码为例，我们把doProcessing从函数换成函数模板：
```c++
template<typename T>
void doProcessing(T& w) {
    if(w.size() > 10 && w != someNastyWidget) {
        T temp(w);
        temp.normalize();
        temp.swap(w);
    }
}
```
现在关于doProcessing的说法：
- w必须支持的接口现在由模板决定，显然w的类型(T)必须要支持size，normalize和swap方法，复制构造函数和operator!=操作符函数，能够让模板顺利编译的接口称为**隐式接口**
- 涉及w的函数调用如operator>和operator!=需要模板的实例化才能成功，模板实例化出现在编译期，因为使用不同模板参数实例化导致调用的函数不同，这被称为**编译时多态**

编译时多态和运行时多态的区别类似调用哪个重载函数(编译时确定)和虚函数调用的动态绑定(运行时确定)的区别。而显式接口通常由各种函数签名组成，即函数名，参数类型，返回类型。以上面的Widget类为例，它的函数签名有构造函数，析构函数，size，normalize和swap函数，以及编译器生成的拷贝构造函数和拷贝赋值操作符函数。而隐式接口不基于函数签名，它由有效的**表达式**组成，以上面的doProcessing函数模板为例，`w.size() > 10 && w != someNastyWidget`是有效表达式，对应的隐式接口应该有以下限制：
- T类型必须提供方法size，该方法返回整型数值
- T类型必须提供方法operator!=，该方法比较两个T类对象(这里假设someNastyWidget也是T类型)

但由于**操作符重载的存在**，以上的限制不一定都要满足，首先T的确需要提供方法size，但是size的返回类型不一定要是整型的，甚至返回类型都不一定要重载`<`操作符，只要确保返回类型X和int类型之间有合法的operator>可以调用，比如X可以隐式转换为Y类，而Y类重载了和int类型比较的operator>操作符,同理第二条限制也不一定存在，大多数人因为开始这么思考隐式接口而头痛，但实际上没有必要，隐式接口就是由表达式组成，表达式看起来很复杂，但是它们的限制通常是直观的

:::tip 总结
类和模板参数都支持接口和多态；对于类来说，接口是显式的，由函数签名表现，多态通过虚函数在运行时体现；对于模板参数，接口是隐式的，基于有效表达式体现，多态通过编译时的模板实例化和函数重载体现
:::

## Item42:理解typename的两种含义
在下面模板声明中的`class`和`typename`有什么区别吗？
```c++
template<class T> class Widget;
template<typename T> class Widget;
```
答案是没有区别！在声明模板类型参数时，从C++的观点来看，class和typename含义是一样的。但是C++并不总是将class和typename视为等价物，有些时候必须使用typename。假设有模板函数打印容器中的第二个元素：
```c++
template<typename C>
void print2nd(const C& container) {
    if(container.size() >= 2) {
        C::const_iterator iter(container.begin());      // 不是有效的C++代码
        ++iter;
        int value = *iter;
        std::cout<<value;
    }
}
```
这里涉及到了两个局部变量iter和value，其中iter的类型为C::const_iterator，该类型依赖于模板参数C，这种依赖于模板参数的名称称为*依赖名称*，当依赖名称嵌套在类名里面，我叫它*嵌套依赖名称*，C::const_iterator就是嵌套依赖名称，实际上它是*嵌套依赖类型名称*，指向一个类型；而value的类型为int，并不依赖于任何模板参数，称之为*非依赖名称*。依赖名称会使模板解析困难，比如：
```c++
template<typename C>
void print2nd(const C& container) {
    C::const_iterator *x;
    ...
}
```
表面上看起来声明x为C::const_iterator指针，这是因为我们认为C::const_iterator是一种类型，但如果C恰好有个静态数据成员名为const_iterator，而x恰好是全局变量名，此时`C::const_iterator *x`的含义是C::const_iterator和x相乘！除非确定C的类型，否则无法知道C::const_iterator到底是不是一种类型名，但是模板解析时C的类型是不确定的，对此，C++的规则是：如果模板解析遇到嵌套依赖名称，C++会**假设该名称不是一种类型**，除非你告诉它。默认情况下嵌套依赖名称**不是**类型名称(之后会提到例外情况)，回到print2d：
```c++
template<typename C>
void print2nd(const C& container) {
    if(container.size() >= 2) {
        C::const_iterator iter(container.begin());      // C::const_iterator不是类型名
        ...
```
根据上述规则，C++默认不把`C::const_iterator`视为类型名称，而iter的声明只在`C::const_iterator`为类型名称时才有意义，为了纠正这个错误，通过在前面加上`typename`来告诉C++`C::const_iterator`是个类型名称：
```c++
template<typename C>
void print2nd(const C& container) {
    if(container.size() >= 2) {
        typename C::const_iterator iter(container.begin());
        ...
```
由此，通用的规则很简单：无论何时在模板中使用嵌套依赖名，都在其前面加上关键字`typename`(再次声明，也有例外)。`typename`应该只用于嵌套依赖名称而不能是其他名称，比如：
```c++
template<typename C>
void f(const C& container,              // 不要使用typename，非嵌套依赖名称
        typename C::iterator iter);     // 需要使用typename
```
唯一的例外是当嵌套依赖类型名称位于基类列表或者成员初始化列表时，不需要在前面加上typename，比如：
```c++
template<typename T>
class Derived: public Base<T>::Nested {     // 基类列表，不要加typename
    public:
        explicit Derived(int x)
        : Base<T>::Nested(x) {              // 成员初始化成员列表中的基类，不要加typename
            typename Base<T>::Nested temp;
            ...
        }    
    ...
};
```
这种例外情况令人厌烦，但是有了经验之后就很难再忘记它。最后再看一个例子，它代表了你会看到的实际代码，假设我们在编写一个函数模板，它接受一个迭代器并复制迭代器所指对象：
```c++
template<typename IterT>
void workWithIterator(IterT iter) {
    typename std::iterator_traits<IterT>::value_type temp(*iter);
    ...
}
```
别被`std::iterator_traits<IterT>`吓到，它的含义是IterT类型迭代器所指向的类型，如果IterT是`vector<int>::iterator`，那么temp就是int类型，以此类推，因为`std::iterator_traits<IterT>`是嵌套依赖类型名称，所以必须加上typename。如果觉得`std::iterator_traits<IterT>`太长，可以使用typedef来重命名，对于类似value_type的特性类(见Item47)成员，通常取的别名就是成员名，如下所示：
```c++
template<typename IterT>
void workWithIterator(IterT iter) {
    typedef typename std::iterator_traits<IterT>::value_type value_type;
    value_type temp(*iter);
    ...
}
```
编译器对有关typename的规则实现是互不相同的，有的编译器接受本来要加typename却没有加的代码，有的编译器接受不该加typename但却加了的代码，甚至有的老式编译器拒绝typename的出现，这意味着typename和嵌套依赖类型名称会带来轻微的移植问题

:::tip 总结
声明模板类型参数时，class和typename是等效的；使用typename来标记嵌套依赖类型名称，除了在基类列表中和初始化成员列表中的基类标识符
:::

## Item43:知道如何访问模板基类的名称
假设需要编写一个发送消息到几个不同公司的应用，消息可以明文传送也可以加密传送，如果在编译时就可以确定消息去往哪个公司，可以使用模板编程：
```c++
class CompanyA {
    public:
        void sendClearText(const std::string& msg);
        void sendEncrypted(const std::string& msg);
    ...
};

class CompanyB {
    public:
        void sendClearText(const std::string& msg);
        void sendEncrypted(const std::string& msg);
    ...
};

class MsgInfo { ... };

template<typename Company>
class MsgSender {
    public:
        void sendClear(const MsfInfo& info) {
            std::string msg;
            ...     // 编写消息
            Company c;
            c.sendCleartext(msg);
        }
        void sendSecret(const MsgInfo& info) {
            std::string msg;
            ...     // 编写消息
            Company c;
            c.sendEncrypted(msg);
        }
};
```
上述代码可以有效工作，假设还要在每次发送消息时登记日志，使用派生类可以轻松地添加这个功能：
```c++
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
    public:
        void sendClearMsg(const MsgInfo& info) {
            ...     // 发送前写入日志信息
            sendClear(info);        // 调用基类方法
            ...     // 发送后写入日志信息
        }
    ...
};
```
**注意派生类中的发送信息方法名(sendClearMsg)和基类的(sendClear)是不同的，这是个设计点，因为它避免了覆盖继承类名称(见Item33)，并且避免重新定义继承的非虚函数(见Item36)**，但是这份代码并不会编译通过，编译器会抱怨sendClear方法不存在，我们知道sendClear在基类中，但是编译器就是找不到它，这需要理解其中原因：当编译器遇到模板类LoggingMsgSender，并不知道模板类继承的基类，当然，代码指出是`MsgSender<Company>`，但Company是模板类型参数，只有当实例化LoggingMsgSender时才知道Company的具体类型，不知道Company类型就不可能知道`MsgSender<Company>`长什么样，当然也就不知道它有没有包含sendClear方法。为了更加具体地说明这个问题，再举个例子：
```c++
class CompanyZ {
    public:
        void sendEncrypted(const std::string& msg);
    ...
};
```
CompanyZ类只支持加密消息传递而没有sendClear方法，因此并不适合MsgSender类模板。为了处理这个问题，我们需要为CompanyZ类创建一个专门的MsgSender类模板：
```c++
template<>
class MsgSender<CompanyZ> {
    public:
        void sendSecret(const MsgInfo& info) { ... }
    ...
};
```
**注意类定义起始处`template<>`，它说明以下的代码既不是类模板也不是独立的类定义，它表示当模板参数为CompanyZ时，这是对应的专用版本的MsgSender模板**，这被称为*完全模板特型化(total template specilaization)*：特型化意味着这是专门为CompanyZ设计的MsgSender模板类，完全意味着一旦模板类型参数是CompanyZ，模板参数的其他部分不能再变化。现在有了为CompanyZ特型化的MsgSender模板，再看派生类LoggingMsgSender：
```c++
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
    public:
        void sendClearMsg(const MsgInfo& info) {
            ...     // 发送前写入日志信息
            sendClear(info);        // 如果类型参数Company是CompanyZ，该函数调用是无效的
            ...     // 发送后写入日志信息
        }
    ...
};
```
正如注释中所指出的，因为基类`MsgSender<CompanyZ>`没有提供sendClear方法，所以C++拒绝调用：编译器认识到基类模板是特型化的，而且特型化的类模板并没有提供和通用模板相同的接口。因此编译器通常拒绝在模板基类中寻找继承名称，从某种程度上来说，从面向对象的C++跨越到C++模板时(见Item1)继承失效。为了阻止C++这种“不在模板基类中搜索名称”的行为，这里有三种方法：
- 调用基类方法前面加上`this->`
```c++
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
    public:
        void sendClearMsg(const MsgInfo& info) {
            ...     // 发送前写入日志信息
            this->sendClear(info);
            ...     // 发送后写入日志信息
        }
    ...
};
```
- 使用using声明，在Item33中提到过
```c++
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
    public:
        using MsgSender<Company>::sendClear;
        void sendClearMsg(const MsgInfo& info) {
            ...     // 发送前写入日志信息
            sendClear(info);
            ...     // 发送后写入日志信息
        }
    ...
};
```
尽管using声明都能起作用，但处理的情况是不同的，Item33中是继承的基类名称被同名派生类覆盖，而这里是编译器并没有搜索基类名称
- 调用基类方法前面加上基类名称
```c++
template<typename Company>
class LoggingMsgSender: public MsgSender<Company> {
    public:
        void sendClearMsg(const MsgInfo& info) {
            ...     // 发送前写入日志信息
            MsgSender<Company>::sendClear(info);
            ...     // 发送后写入日志信息
        }
    ...
};
```
这种方法是解决问题最不可取的，因为如果调用的是虚函数，就相当于关闭了虚函数的动态绑定。

从名称可见性的角度来看，以上三种方法都在做相同的事：向编译器承诺任何特型化的基类模板都支持通用模板的接口。这种承诺是编译器在处理类似LoggingMsgSender的派生类模板所需要的，但是如果承诺没实现，就会导致后续的编译出错，比如：
```c++
LoggingMsgSender<CompanyZ> zMsgSender;
MsgInfo msgData;
...
zMsgSender.sendClearMsg(msgData);
```
以上对sendClearMsg的调用并不会编译通过，因为编译器知道基类是`MsgSender<CompanyZ>`特型化模板类，但是这个类没有提供sendClearMsg方法调用。最根本的问题在于编译器对基类名称的无效引用的判断是提前(在派生类模板定义解析时)还是稍晚些(在实例化模板时)，C++的策略是偏向早期诊断，因此假设对模板基类的内容一无所知

:::tip 总结
在派生类模板中，通过`this->`前缀，using语句和基类名称前缀来引用基类模板中的名称
:::

## Item44:将类型参数无关的代码从模板中分离
模板是一种节省时间和代码重复的神奇方法，但是如果使用不当会造成*代码膨胀(code bloat)*：程序含有重复的代码和数据。表面上源代码很少，但是目标代码却很多，需要了解如何避免这种问题。主要的方法是*公共分析*和*差异分析*，当你在写一个函数时，发现该函数的部分实现代码和另一个函数的实现代码基本相同，你会选择把公共代码从这两个函数中移出到第三个函数，并让这两个函数调用第三个函数，这就是公共分析和差异分析：把公共部分取出放到新函数，保留原函数的差异部分。类似地，在编写类时发现和另一个类部分重叠，你选择把公共部分整理为另一个类，然后使用继承或组合来让原来的类能够保留差异部分而使用公共部分。在编写模板时，你也在做相同的分析，但不同的是，非模板中的代码重复是明显的，你可以在两个函数或类中看出来，而模板中的代码重复并不是，因为模板只有一份，所以需要训练对模板实例化时代码重复的感知。比如，你要为固定大小的矩阵写个支持求逆的模板：
```c++
template<typename T, std::size_t n>
class SquareMatrix {
    public:
        ...
        void invert();
};
```
该模板使用类型参数T和非类型参数n，非类型参数没有类型参数通用，但都是合法的。现在考虑如下代码：
```c++
SquareMatrix<double, 5> sm1;
sm1.invert();
SquareMatrix<double, 10> sm2;
sm2.invert();
```
这里会实例化两份invert函数，虽然它们没有完全一模一样，但只是除了常数5和10不同，这是典型的模板代码膨胀。你的直觉是使用参数来替代5和10，这是正确的：
```c++
template<typename T>
class SquareMatrixBase {
    protected:
        void invert(std::size_t maxtrixSize);
    ...
};

template<typename T, std::size_t n>
class SquareMatrix: private SquareMatrixBase<T> {
    private:
        using SquareMatrixBase<T>::invert;      // using声明避免覆盖基类名称
    public:
        void invert() { this->invert(n); }      // 调用模板基类名称要加上限定
    ...
};
```
但是，inver函数还需要知道数据才能求逆，只有大小是不够的，为此在SquareMatrixBase中添加成员指针来指向矩阵数据的地址：
```c++
template<typename T>
class SquareMatrixBase {
    protected:
        void invert(std::size_t n, T* pMem)
        :size(n), pData(pMem) {}
        void setDataPtr(T *ptr) { pData = ptr; }
    private:
        std::size_t size;
        T* pData;
    ...
};

template<typename T, std::size_t n>
class SquareMatrix: private SquareMatrixBase<T> {
    public:
        SquareMatrix()
        :SquareMatrixBase<T>(n, data) {}
    private:
        T data[n*n];
};
```
以上代码并没有使用动态内存分配，再次改进下：
```c++
template<typename T, std::size_t n>
class SquareMatrix: private SquareMatrixBase<T> {
    public:
        SquareMatrix()
        :SquareMatrixBase<T>(n, 0), pData(new T[n*n]) {
            this->setDataPtr(pData.get());
        }
    private:
        boost::scoped_array<T> pData;
};
```
先不管数据存储在哪里，现在可能引起代码膨胀的原因是SquareMatrix的方法都是内联的，同时SquareMatrix不同体积的对象是区分开来的，即便`SquareMatrix<double, 5>`和`SquareMatrix<double, 10>`使用`SquareMatrixBase<double>`中的相同方法，也没有办法给接受`SquareMatrix<double, 10>`参数的函数传递一个`SquareMatrix<double, 5>`对象。但是没有免费的午餐，一开始矩阵大小硬编码的invert函数可能比后者体积作为函数参数的invert版本生成更好的代码，比如体积是编译时常量，可以进行优化如作为指令的立即数，而后者不能进行这样的优化。而在另一方面，不同体积矩阵只有一个版本invert方法减少程序体积，提高指令cache的命中率，让程序跑得更快。那到底哪种更好？都试一下比较才能得出结论

:::tip 
模板生成多份类和函数，任何不依赖模板类型参数的代码都会引起代码膨胀；由非类型参数引起的代码膨胀可以通过把该参数替换为函数参数或者类数据成员来消除；由类型参数引起的代码膨胀可以通过共享底层表示类型(指针)来消除
:::

## Item45:使用成员函数模板来接受所有的“兼容类型”
*智能指针*表现得像指针但是添加了额外的功能，在STL中的迭代器几乎就是智能指针实现的，对于链表来说，普通指针不能通过`++`操作符来移动至下个节点，但是list::iterator却可以做到。普通指针表现较好的就是支持隐式转换：
```c++
class Top { ... };
class Middle: public Top { ... };
class Bottom: public Middle { ... };

Top *pt1 = new Middle;
Top *pt2 = new Bottom;
const Top *pct2 = pt1;
```
而用户定义的智能指针类模拟这种转换需要技巧，如下代码所示：
```c++
template<typename T>
class SmartPtr {
    public:
        explicit SmartPtr(T *realPtr);      // 智能指针通常用普通指针初始化
    ...
};

Smart<Top> pt1 = SmartPtr<Middle>(new Middle);
Smart<Top> pt2 = SmartPtr<Bottom>(new Bottom);
Smart<const Top> pct2 = pt1;
```
相同模板的不同实例化之间是没有继承关系的，所以编译器把`SmartPtr<Middle>`和`SmartPtr<Top>`视为不相干的类，为了完成转换，需要编写代码。观察以上的样例代码，每行语句创建一个智能指针对象，所以只要关注于构造函数，但注意不可能写出所有所需要的构造函数，我们可以根据`SmartPtr<Middle>`构造`SmartPtr<Top>`，但是如果将来又添加了新的派生类：
```c++
class BelowBottom: public Bottom { ... };
```
此时需要支持根据`SmartPtr<BlowBottom>`创建`SmartPtr<Top>`对象，又不得不修改SmartPtr模板，这是我们不想要的。原则上构造函数的数量是无限的，因为模板可以生成无限量的函数，似乎可以写一个构造函数模板来生成类成员函数，这种模板被称为*成员函数模板*(或者成员模板)：
```c++
template<typename T>
class SmartPtr {
    public:
        template<typename U>
        SmartPtr(const SmartPtr<U>& other);
    ...
};
```
以上代码说明对于每个类型T和U，`SmartPtr<T>`对象可以根据`SmartPtr<U>`对象创建，像这种从另一种模板实例化出来的类型创建对象的构造函数被称为*通用拷贝构造函数*，注意构造函数故意没有声明为explicit的，这样智能指针类能模拟普通指针的隐式类型转换，但是通用拷贝构造函数过于“通用”，我们可以用`SmartPtr<Top>`对象创建`SmartPtr<Bottom>`对象，但这不是公有继承的含义(派生类是一种基类，反之不成立)，用`SmartPtr<int>`对象创建`SmartPtr<double>`对象，但没有`int*`到`double*`的隐式转换，因此，我们需要挑选通用函数模板生成的函数。假设SmartPtr像auto_ptr一样提供get方法返回其包含的普通指针，我们可以用构造函数模板的实现来限制：
```c++
template<typename T>
class SmartPtr {
    public:
        template<typename U>
        SmartPtr(const SmartPtr<U>& other)
        :heldPtr(other.get()) { ... }
        T* get() const { return heldPtr; }
        ...
    private:
        T *heldPtr;
};
```
这样，只有当`U*`指针能够被隐式转换为`T*`指针时才能编译通过，现在`SmartPtr<T>`拥有通用模板函数，同时又对兼容类型有限制。成员函数模板不仅适用于构造函数，另一个常用场景是赋值。比如std::shared_ptr支持从所有其他普通指针和智能指针构造，以及除std::weak_ptr外的所有指针的赋值，以下是其部分代码摘录：
```c++
template<class T> class shared_ptr {
    public:
        template<class Y>
        explicit shared_ptr(Y *p);
        template<class Y>
        shared_ptr(shared_ptr<Y> const& r);
        template<class Y>
        explicit shared_ptr(weak_ptr<Y> const& r);
        template<class Y>
        explicit shared_ptr(auto_ptr<Y>& r);
        template<class Y>
        shared_ptr& operator=(shared_ptr<Y> const& r);
        template<class Y>
        shared_ptr& operator=(auto_ptr<Y>& r);
        ...
};
```
以上所有构造函数除了通用拷贝构造模板函数都声明为explicit，这意味着从`shared_ptr<Y>`到`shared_ptr<T>`的隐式转化可行，但是从普通指针或者其他指针指针到`shared_ptr<T>`的隐式转换是不可行的(除了显式的强制类型转换)，另外值得注意的是auto_ptrs作为参数的构造函数是没有加const的，因为它们被拷贝时会被修改(见Item13)。成员模板函数不会修改语言的基本特性，在Item5中提到编译器会自动生成拷贝构造函数和赋值操作符函数，当shared_ptr的通用构造模板函数的T和Y相同时，那编译器是自动生成代码还是实例化构造函数模板呢？因为在类中声明通用拷贝构造函数(成员模板)并不妨碍编译器自动生成拷贝构造函数(非模板)，如果想要控制全局，必须同时声明通用拷贝构造函数和“正常”拷贝构造函数，对于赋值操作符函数也一样，以下是shared_ptr的代码摘录：
```c++
template<class T> class shared_ptr {
    public:
        shared_ptr(shared_ptr const& r);
        template<class Y>
        shared_ptr(shared_ptr<Y> const& r);
        
        shared_ptr& operator=(shared_ptr const& r);
        template<class Y>
        shared_ptr& operator=(shared_ptr<Y> const& r);
        ...
};
```

:::tip 总结
使用成员模板函数来生成接受所有兼容类型的函数；声明了通用拷贝构造函数和通用赋值操作符函数(都是成员模板)，还需要声明它们的普通版本
:::

## Item46:当需要类型转换时在模板内定义友元函数
Item24支出当所有参数需要类型转换时使用非成员函数是合适的，通过Rational类的`operator*`操作符重载函数说明，在继续阅读之前最好回顾一下，因为本节将继续扩展该例子，对Ration类和`operating*`都模板化：
```c++
template<typename T>
class Rational {
    public:
        Rational (const T& numerator = 0, 
                  const T& denominator = 1);
        const T numerator() const;
        const T denominator() const;
    ...
};

template<typename T>
const Rational<T> operator*(const Rational<T>& lhs,
                            const Rational<T>& rhs)
                            {...}

Rational<int> oneHalf(1, 2);
Rational<int> result = oneHalf * 2;     // 错误，不能进行编译！
```
正如Item24一样，我们想要内建类型int能和Rational对象进行运算，但和非模板版本的`operator*`函数不一样，这里编译器会报错。编译器尝试实例化`operator*<>`函数模板，函数参数都是`Rational<T>`类型，所以需要根据传入的实参推导出T，在这里，两个实参分别是`Rational<int>`和int，由第一个实参很容易推导出T为int，但是从int推导出T表示什么类型却很难。你可能期望`Rational<int>`的非显式的构造函数把int转换为`Rational<int>`，然后就可以推导出T是int，这样的类型转换在函数调用期发生，但是在调用函数之前，你必须确定存在哪些函数，因此你需要推导参数类型(也就是实例化模板函数)，但是**隐式的类型转换在模板类型参数推导是从来不会被考虑的**。我们可以通过友元函数声明来减缓模板的类型推导，**类模板并不需要推导模板参数(只有函数模板需要)**，因为`Rational<T>`模板类实例化时T的类型总是已知的：
```c++
template<typename T>
class Rational {
    public:
        ...
    friend const Rational operator*(const Rational& lhs,    // 注意这里参数类型写法
                                    const Rational& rhs);   // 和模板函数版本的不同
};

template<typename T>
const Rational<T> operator*(const Rational<T>& lhs, 
                            const Rational<T>& rhs)
                            { ... }
```
现在混合模式调用`operator*`将通过编译，因为当对象oneHalf被声明为`Rational<int>`时，实例化出`Rational<int>`类，同时实例化得到友元函数`const Rational<int> operator*(const Rational<int>& lhs, const Rational<int>& rhs)`，作为声明的函数(而不是函数模板)，编译器可以在该该函数被调用时使用隐式类型转换。但是，所谓的“成功”在这里是假的，代码虽然通过编译但是在并不会链接，这个稍后再看，首先我想再强调下这里使用的一点语法技巧：在类模板内部，模板的名称可以用于模板加参数的缩写，也就是`Rational`用于表示`Rational<T>`，也可以展开写：
```c++
template<typename T>
class Rational {
    public:
        ...
    friend const Rational<T> operator*(const Rational<T>& lhs,
                                       const Rational<T>& rhs);
};
```
两者是等效的，但是缩写让代码更加简洁，回到之前的链接问题，因为没有只提供了声明但没有定义，函数模板实例化后会有定义，和这里的友元函数模板不同，简单的方式就是在声明的同时写上函数体：
```c++
template<typename T>
class Rational {
    public:
        ...
    friend const Rational<T> operator*(const Rational<T>& lhs,
                                       const Rational<T>& rhs)
    {
        return Rational(lhs.numerator() * rhs.numerator(), 
                        lhs.denominator() * rhs.denominator());
    }
};
```
现在一切正常编译运行。有趣的是使用友元和访问类的非公有部分没有关系：为了保证不同类型都能调用`operator*`，需要声明它为非类成员函数，为了让函数自动完成实例化，需要把它的声明放在类里面，这样一来唯一的方式就是声明为友元函数。正如Item30所解释的，定义在类中的函数默认为内联的，你可以通过让内联函数只调用一个helper函数来最小化内联的影响，但在这里没有必要因为它的实现已经是最简单的了，只有一行。实际上Rational是一个模板类意味着helper函数通常也需要是个模板函数，所以定义Rational的头文件的内容可能是：
```c++
template<typename T> class Rational;        // 向前声明

template<typename T>
const Rational<T> doMultiply(const Rational<T>& lhs,
                             const Rational<T>& rhs);

template<typename T>
class Rational {
    public:
        ...
    friend const Rational<T> operator*(const Rational<T>& lhs,
                                       const Rational<T>& rhs)
    { return doMultiply(lhs, rhs); }
    ...
};
```
许多编译器要求把模板定义放在头文件里面，所以需要在头文件中定义doMutiply：
```c++
template<typename T>
const Rational<T> doMultiply(const Rational<T>& lhs,
                             const Rational<T>& rhs)
{
    return Rational<T>(lhs.numerator() * rhs.numerator(), 
                       lhs.denominator() * rhs.denominator());
}
```
作为模板函数，doMultiply不能支持混合模式的乘法，但是它不需要支持，因此它只会被`operator*`，而`operator*`支持混合模式操作

:::tip 
当编写包含支持所有参数隐式转换的函数的模板类时，将函数放在模板类中并定义为友元
:::

## Item47:需要类型信息时使用特性类
STL主要由容器，迭代器和算法的模板组成，但也包含一些工具类，其中之一就是advance函数：
```c++
template<typename IterT, typename DistT>
void advance(IterT& iter, DistT d);
```
从概念上讲，advance就是实现`iter += d`，但实际上是不可行的，因为只有随机访问迭代器才支持`+=`操作符，更弱点的迭代器只能用重复`++`和`--`操作符d次来实现。(⊙o⊙)…不记得STL迭代器的分类了，这里我们稍稍回顾一下，一共分为5种：
- 输入迭代器：只能向前移动，并且每次只能移动一步，只能读取所指数据，并且只能读取一次，这类迭代器建模在指向输入文件的读指针上，以std::istream_iterator为代表
- 输出迭代器：只能向前移动，并且每次只能移动一步，只能写入所指数据，并且只能写入一次，这类迭代器建模在指向输出文件的写指针上，以std::ostream_iterator为代表
- 向前迭代器：以上两种迭代器的所有功能的并集，但读写次数不止一次，适用于多遍历算法
- 双向迭代器：在向前迭代器的基础上支持向后移动，比如STL中list，set，multiset，map和multimap的迭代器
- 随机迭代器：在双向迭代器的基础上支持任意移动步数，比如STL中vector，deque和string的迭代器

对于每种迭代器，C++标准库中都有一个对应的*标记结构体*：
```c++
struct input_iterator_tag {};
struct output_iterator_tag {};
struct forward_iterator_tag: public input_iterator_tag {};
struct bidirectional_iterator_tag: public forward_iterator_tag {};
struct random_access_iterator_tag: public bidirectional_iterator_tag {};
```
这些结构之间的继承表示它们是“is-a”关系(见Item32)：比如向前迭代器是一种输入迭代器。回到advance函数，基于不同迭代器功能，可以选择最合适的随机迭代器，基本的代码如下所示：
```c++
template<typename IterT, typename DistT>
void advance(IterT& iter, DistT d) {
    if(iter is a random access itertor) {
        iter += d;
    } else {
        if(d >= 0) {
            while(d--) ++iter;
        } else {
            while(d++) --iter;
        }
    }
}
```
这需要判断iter是否为随机迭代器，也就是需要知道iter的类型，这时就需要特性类：使用它能够在编译时获取类型信息。traits既不是关键字也不是c++中预先定义好的结构体，该项技术支持内建类型和用户定义类型。特性类保存类型信息，必须和类型无关，所以标准技术是用模板或者特型化模板实现，对于迭代器来说，对应的标准库模板是`iterator_traits`：
```c++
template<typename IterT>
struct iterator_traits;
```
正如你所见，iterator_traits是一个结构体，一般来说都是用结构体实现的，但还是称这个结构体为**特性类**。对于每一种类型IterT，在`iterator_traits<IterT>`结构体内都会对应声明一个iterator_category重命名，该重命名标记IterT所属的迭代器类别。iterator_traits的实现方式分为两部分，第一是它强制要求所有用户定义的迭代器类型都必须包含一个名称为iterator_category的重命名，对应正确的标记结构体，比如一个deque的迭代器的实现可能如下所示：
```c++
template<...>   // 模板参数省略
class deque {
    public:
        class iterator {
            public:
                typedef random_access_iterator_tag iterator_category;
        };
};
```
而list的是双向迭代器，代码可能如下所示：
```c++
template<...>   // 模板参数省略
class list {
    public:
        class iterator {
            public:
                typedef bidirectional_iterator_tag iterator_category;
        };
};
```
iterator_traits类仅仅就是重复类中嵌套的重命名：
```c++
// 使用typename的原因回顾Item42
template<typename IterT>
struct iterator_traits {
    typedef typename IterT::iterator_category iterator_category;
    ...
};
```
**以上实现方式适用于用户定义类，但是对迭代器就是指针不起作用，因为指针里面不可能嵌套重命名**，而iterator_traits的第二部分就是用于处理这种情况，iterator_traits会为指针提供一个部分特型化模板，指针会表现得像随机迭代器：
```c++
template<typename IterT>
struct iterator_traits<IterT*>
{
    typedef random_access_iterator_tag iterator_category;
    ...
}
```
至此，你已经知道了如何设计并实现特性类：
- 确定想要提供的类型信息(比如对迭代器来说就是它们的种类)
- 选择一个标记类型信息的名称(比如iterator_category)
- 提供包含类型信息的模板以及一些特型模板(比如iterator_traits)

鉴于iterator_traits就是std::iterator_traits，我们现在可以完善一开始写的advance函数伪代码：
```c++
template<typename IterT, typename DistT>
void advance(IterT& iter, DistT d)
{
    if(typeid(typename std::iterator_traits<IterT>::iterator_category) == 
       typeid(std::random_access_iterator_tag))
    ...
}
```
这样的代码看上去好像够了，但还是不行。首先它会导致编译错误，这个问题将在Item48中讨论，其次有个更基础的问题：IterT的类型在编译时就知道了，也就是`iterator_traits<IterT>::iterator_category`在编译时就可以确定了，然而if语句是在运行时执行条件选择，为什么本在编译时可以做的事要放在运行时来做？实际上可以使用函数重载来完成这件事情：
```c++
template<typename IterT, typename DistT>
void doAdvance(IterT& iter, DistT d,
               std::random_access_iterator_tag)
{ iter += d; }

template<typename IterT, typename DistT>
void doAdvance(IterT& iter, DistT d,
               std::bidirectional_iterator_tag)
{
    if(d >= 0) {
        while(d--) ++iter;
    } else {
        while(d++) --iter;
    }
}
template<typename IterT, typename DistT>
void doAdvance(IterT& iter, DistT d,
               std::input_iterator_tag)
{
    if(d < 0) {
        throw std::out_of_range("Negative distance");
    }
    while(d--) ++iter;
}
```
因为forward_iterator_tag继承自input_iterator_tag，所以doAdvance的input_iterator_tag重载版本也适用于forward_iterator_tag，注意它的距离参数d不能为负数，否则`while(d--)`将是个很长的循环。现在只需要advance函数调用doAdvance函数即可，重载会匹配最适合的版本：
```c++
template<typename IterT, typename DistT>
void advance(IterT& iter, DistT d) {
    doAdvance(iter, d, typename std::iterator_traits<IterT>::iterator_category());
}
```
现在总结如何使用特性类：
- 创建一系列的worker函数或函数模板，比如doAdvance，这些函数的参数接受不同特性类，根据每种特性类包含的信息实现函数
- 创建调用worker函数的master函数，比如advance，将由特性类提供的类型信息作为实参传递

特性类广泛使用于标准库中，有跟迭代器类别相关的iterator_traits类，它们提供其他关于迭代器的类型信息，比如在Item42中用到的value_type字段，也有char_traits类，包含字节类型信息，以及numeric_limits类(这个名字有点奇怪，其他的都是traits结尾)，包含数字类型信息和它们的最大值/最小值，等等

:::tip 总结
特性类在编译期提供类型信息，它们由模板和特型化模板实现；配合使用函数重载，特性类可以实现编译器的if-else类型测试
:::

## Item48:知道模板元程序
模板元程序(TMP)是就是基于模板编写C++程序的过程，C++一开始并没有设计模板，但是自90年代早期出现TMP后，由于其实用性就被加入C++语言特性中，并实施到标准库中。TMP有两点优势：第一，让原来困难甚至不可实现的编程变得简单；第二，TMP在C++编译期执行，把运行时的工作转移到编译时。TMP的一个好处就是让运行时的错误能够在编译时被检测出，还有就是在几乎任何方面提升效率：更小的可执行程序，更短的运行时间，更少的内存需求，但就是比非TMP的程序要花更多的时间。回顾Item47中的advance函数模板：
```c++
template<typename IterT, typename DistT>
void advance(IterT& iter, DistT d) {
    if(typeid(typename std::iterator_traits<IterT>::iterator_category) == 
       typeid(std::random_access_iterator_tag))
    {
        iter += d;
    } else {
        if(d >= 0) {
            while(d--) ++iter;
        } else {
            while(d++) --iter;
        }
    }
}
```
我们说过以上基于typeid的方式效率更低些，第一类型检测出现在运行时而不是编译时，其次执行运行时类型测试的代码必须出现在二进制程序中，实际上这个例子展示了TMP如何比“正常”C++程序更加高效，因为最后使用的特性类就是TMP，我们还提到过使用typeid的实现方式会出现编译问题，举个例子：
```c++
std::list<int>::iterator iter;
...
advance(iter, 10);
```
设想如上函数调用将会生成的代码：
```c++
void advance(std::list<int>::iterator& iter, int d) {
    if(typeid(typename std::iterator_traits<std::list<int>::iterator>::iterator_category) == 
       typeid(std::random_access_iterator_tag))
    {
        iter += d;      // 出错！
    } else {
        if(d >= 0) {
            while(d--) ++iter;
        } else {
            while(d++) --iter;
        }
    }
}
```
只有随机迭代器支持`+=`操作符，而`list<int>::iterator`属于双向迭代器，因此if判断是false不会执行`iter += d`，但是编译器有义务确保所有的代码都是有效的，即使该代码不执行。TMP的循环并没有真正的循环结构，而是递归，并且是递归模板实例化，如下所示的代码在编译时计算阶乘：
```c++
template<unsigned n>
struct Factorial {
    enum { value = n * Factorial<n-1>::value };
};

template<>
struct Factorial<0> {
    enum { value = 1 };
};

int main() {
    std::cout<<Factorial<5>::value;     // 120
    std::cout<<Factorial<10>::value;    // 3628800
}
```
实例化`Factorial<n>`结构体模板都会再次引用到`Factorial<n-1>`，形成递归的实例化，最后来到特型化模板`Factorial<0>`，如果TMP有真正的循环结构，那么value的值每次都会更新，而实际上是每次实例化产生value的副本，根据下一轮递归的结果确定value的值。Factorial只是展示TMP使用的简单例子，为了更好的了解TMP的意义，最好熟悉它可以完成的任务：
- 确保量纲单位正确性。在科学和工程应用中，确保量纲单位(如质量，距离，时间等)的正确组合十分重要，把质量单位变量赋值给速度单位变量是错误的，但是把距离变量除以时间变量的结果赋值给速度单位是正确的，使用TMP可以保证这些正确性，举个例子，TMP支持在编译期就可以确认$time^{1/2}$就等于$time^{2/4}$
- 优化矩阵操作。Item21解释了包括`operator*`在内的函数必须返回新对象，在Item44中引入了`SquareMatrix`，考虑如下代码：
```c++
typename SuqareMatrix<double, 1000> BigMatrix;
BigMatrix m1, m2, m3, m4, m5;
...
BigMatrix result = m1 * m2 * m3 * m4 * m5;
```
正常地计算result需要生成4个临时对象，使用TMP的表达式模板技术可以减少产生的临时变量，减少内存使用并提高速度
- 生成定制设计模型实现。像Strategy(见Item35)，Observer，Vistor等的设计模式可以通过多种方式实现，使用TMP的技术被称为*基于策略设计(policy-based design)*，用于创建表示独立设计方式(“策略”)的模板，这些策略任意组合生成定制行为的模式，比如使用几个模板实现智能指针行为策略，用于生成几百种不同的智能指针类型，这项技术就是泛型编程的基础

TMP并不适合每一个人，它的句法不直观，工具支持薄弱(给模板元程序调试？Ha！)，但是对程序员尤其是库开发人员，它将会成为主要技术

:::tip 总结
模板元编程可以将工作从运行时转移到编译时，使得更早发现错误以及提高运行性能；TMP可以基于不同策略组合生成定制代码，也可以用于避免生成对特定类型不合适的代码
:::