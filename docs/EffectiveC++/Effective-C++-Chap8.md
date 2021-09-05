---
layout: article
title: 自定义new和delete
permalink: /Effective-C++-Note/chap8
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---

:::info
《Effective C++》英文第三版读书笔记第八章
:::

## Item49:理解new-handler的行为
当new操作符不能完成内存分配的请求，它就会抛出一个异常，很久之前，这样的new会返回空指针，有些老式的编译器还是这样做，但我们最后再谈这点，在抛出异常之前，new操作符会调用一个客户端指定的错误处理函数new-handler(实际情况更复杂，见Item51)，客户端通过set_new_handler来设置这个处理函数，set_new_handler在头文件`<new>`中声明：
```cpp
namespace std {
    typedef void (*new_handler)();
    new_handler set_new_handler(new_handler p) throw();
}
```
如上所示的代码，new_handler是函数指针的别名，该函数参数类型和返回类型为void，set_new_handler的参数为类型new_handler，该参数就是new失败后应该调用的函数，返回类型也为new_handler，表示之前设置的new-handler，如果第一次调用set_new_handler将是空指针。set_new_handler的使用方式如下所示：
```cpp
// new失败调用的函数
void outOfMem() {
    std::cerr<<"Unable to satisfy request for memory\n";
    std::abort();
}

int main() {
    std::set_new_handler(outOfMem);
    int *pBigDataArray = new int[1000000000L];
    ...
}
```
当new操作符不能满足内存请求时，它将会重复调用new-handler函数直到有充足的内存，一个设计良好的new-handler函数应该具备如下条件**之一**：
- 让更多的内存可用。一种方式是在程序开始时预留一大块内存，然后在首次调用new-handler时释放这些内存
- 安装另一个new-handler。当现有的new-handler不能提供更多可用的内存，但也许它知道另一个new-handler可以，然后自动安装这个更好的new-handler
- 卸载new-handler。即给set_new_handler传递参数为空，如果没有安装new-handler，new操作符会抛出异常
- 抛出bac_alloc类异常或者bac_alloc类派生的异常
- 没有返回值，通常调用abort或者exit

有些时候需要根据对象类用不同的方式处理内存分配失败：
```cpp
class X {
    public:
        static void outOfMemory();
    ...
};

class Y {
    public:
        static void outOfMemory();
    ...
};

X* p1 = new X;
Y* p2 = new Y;
```
C++没并有支持特定类型的new-handler，但是也没必要，你可以自己为每个类提供定制化的set_new_handler和operator new函数，类的set_new_handler函数允许客户端指定类的new-handler(就像标准库的set_new_handler允许客户端指定全局的new-handler)。如果你想要自行处理`new Widget`时内存分配失败，需要声明静态成员new_handler指定new-handler函数，Widet类可能如下所示：
```cpp
class Widget {
    public:
        static std::new_handler set_new_handler(std::new_handler p) throw();
        static void* operator new(std::size_t size) throw(std::bad_alloc);
    private:
        static std::new_handler currentHandler;
};
```
静态成员必须在类体外定义(除非是const)，所以加上：
```cpp
std::new_handler Widget::currentHandler = 0;
```
set_new_handler保存传入的new_handler并返回更改之前的new_handler，代码如下所示：
```cpp
std::new_handler Widget::set_new_handler(std::new_handler p) throw()
{
    std::new_handler oldHandler = currentHandler;
    currentHandler = p;
    return oldHandler;
}
```
最后，Widget类的`operator new`将会实现以下功能：
- 调用Widget类的set_new_handler，将Widget类的new-handler作为全局的new-handler
- 调用全局的`operator new`方法执行内存分配，如果失败，全局的`operator new`唤起Widget的new-handler，如果全局的`operator new`最后还是不能分配内存，它会抛出bad_alloc异常，此时，Widget的`operator new`方法必须回执原来的全局new-handler，然后向外抛出异常，为了确保原new-handler总是恢复，Widget类将全局new-handler作为资源保存
- 如果全局的`operator new`能够分配足够多的内存，Widget类的operator new方法返回分配内存的指针，由析构函数恢复全局的new-handler

接下来首先实现资源管理类，它遵循RAII的设计原则：
```cpp
class NewHandlerHolder {
    public:
        explicit NewHandlerHolder(std::new_handler nh)
        : handler(nh) {}
        ~NewHanlderHolder()
        { std::set_new_handler(handler); }
    private:
        std::new_handler handler;
        NewHandlerHolder(const NewHandlerHolder&);              // 防止C++生成自定义的
        NewHandlerHolder& operator=(const NewHandlerHolder&);   // 拷贝函数
};
```
然后实现Widget类的operator new方法：
```cpp
void* Widget::operator new(std::size_t size) throw(std::bad_alloc) {
    NewHandlerHolder                           // 设置全局new-handler为Widget的
    h(std::set_new_handler(currentHandler));   // 利用set_new_handler返回原来的new-handler将其保存
    return ::operator new(size);
}                                              // h的析构函数自动还原全局的new-handler
```
Widget的使用代码如下所示：
```cpp
void outOfMem();

Widget::set_new_handler(outOfMem);      // 将outOfMem设置为Widget的new-handler方法

Widget *pw1 = new Widget;               // new失败调用outOfMem
std::string *ps = new std::string;      // new失败调用全局new-handler(如果有的话)
Widget::set_new_handler(0);             // 设置Widget类的new-handler为空
Widget *pw2 = new Widget;               // new失败抛出异常
```
以上代码的实现与类无关，可以重复使用，因此定义一个模板基类：
```cpp
template<typename T>
class NewHandlerSupport {
    public:
        static std::new_handler set_new_handler(std::new_handler p) throw();
        static void* operator new(std::size_t size) throw(std::bad_alloc);
        ...
    private:
        static std::new_handler currentHandler;
};

template<typename T>
std::new_handler
NewHandlerSupport<T>::set_new_handler(std::new_handler p) throw() {
    std::new_handler oldHandler = currentHandler;
    currentHandler = p;
    return oldHandler;
}

template<typename T>
void* NewHandlerSupport<T>::operator new(std::size_t size) throw(std::bad_alloc) {
    NewHandlerHolder h(std::set_new_handler(currentHandler));
    return ::operator new(size);
}

template<typename T>
std::new_handler NewHandlerSupport<T>::currentHandler = 0;
```
使用这个基类模板很简单：
```cpp
class Widget: public NewHandlerSupport<Widget> {
    ...
};
```
这个代码看起来十分怪异：Widget继承自NewHandlerSupport模板实例化的类，而实例化类型参数又是Widget自己。但仔细观察发现**NewHandlerSupport模板根本没有用到过类型参数T，它也不需要，实际上我们所需要的就是每种不同类型有不同的NewHandlerSupport拷贝，特别的是类静态变量currentHandler，模板参数T只是用来区分不同的继承类，当NewHandlerSupport模板实例化时模板机制自动为每个T类型生成currentHandler拷贝**，这种派生类继承的模板基类以派生类自己为类型参数的技术称为*奇怪递归模板模式(CRTP, curiously recurring template pattern)*。直到1993年，C++还是要求operator new操作失败时返回null，而现在是抛出bad_alloc异常，为了让老代码兼容，C++标准委员会提供了nothrow(在`<new>`头文件中定义)：
```cpp
class Widget { ... };
Widget *pw1 = new Widget;                   // new失败抛出bad_alloc异常
if(pw1 == 0) ...                            // 结果总是false
Widget *pw2 = new (std::nothrow) Widget;    // new失败返回null
if(pw2 == 0) ...                            // 可能是true
```
表达式`new (std::nothrow) Widget`首先调用nothrow版本的operator new操作符函数分配内存，如果内存分配失败，返回空指针，如果成功，然后调用Widget的构造函数，但此时所有的保证都没了，构造函数也可能使用new，而且还不一定使用nothrow版本的new，如果构造函数中的new抛出异常，就会在`new (std::nothrow) Widget`出现。总结？使用nothrow new只保证`operator new`不会抛出异常，但没有保证表达式`new (std::nothrow) Widget`不抛出异常，大多数情况下你可能永远不需要用到nothrow new

:::tip 总结
使用`set_new_handler`指定内存分配失败时调用的函数；Nothrow new的能力有限，只能用于内存分配时，但随后的构造函数还是会有可能抛出异常
:::

## Item50:理解何时替代new和delete才有意义
让我们回到基础，为什么有人想要替代编译器提供的new和delete操作符呢？有着三种常见原因：
- **检测使用错误**，使用new而没有使用delete导致内存泄露，已用new而再次使用delete是未定义行为，如果new含有分配内存地址的列表，delete从该列表中删除地址，可以检测到类似的使用错误；类似地，编译错误也会导致数据overrun(写入数据超过分配内存块的末尾)和underrun(写入数据提前到分配内存块的开头)，自定义的new可以多分配一点内存保存已知的字节模式("签名")，delete可以通过检查签名是否完整来检测是否出现overrun和underrun
- **提高效率**，编译器提供的new和delete是通用设计：它们适应长期运行的程序(Web服务器)，也要适应运行不到1秒的程序，需要考虑堆碎片化等等。new和delete对所有情况都能较好工作，但同时没有对哪种情况进行优化，如果你对自己程序的动态内存使用模式有较好的理解，自定义new和operator可以获得更好的性能
- **收集使用数据**，在开始重定义new和delete之前，收集软件使用动态内存的信息是很精明的事，分配内存块体积的分布如何？生命周期的分布如何？内存块是按照FIFO还是LIFO的顺序分配释放，或者是更随机的顺序？自定义new和delete可以轻易地收集这些数据

从概念上自定义new很简单，如下所示提供了一个自定义new样例，该new操作符检测overrun和underrun，代码里还有一些小瑕疵但是很快就会提到：
```cpp
static const int signature = 0xDEADBEEF;
typedef unsigned char Byte;

// 以下代码有些瑕疵
void* operator new(std::size_t size) throw(std::bad_alloc) {
    using namespace std;
    size_t realSize = size + 2 * sizeof(int);
    void *pMem = malloc(realSize);
    if(!pMem) throw bad_alloc();

    // 在分配内存的开始和末尾写入signature
    *(static_cast<int*>(pMem)) = signature;
    *(reinterpret_cast<int*>(siatic_cast<Byte*>(pMem)+realSize-size)) = signature;
    
    // 返回第一个signature后面的指针地址
    return static_cast<Byte*><pMem> + sizeof(int);
}
```
以上自定义的new操作符的缺点大多数源于它没有坚持C++中new函数的传统，比如，Item51说所有的new操作符应该包含一个循环，并且该循环调用new-handler，可这里的new并没有，Item51详细说明这一点，这里我们关注另一个细微的问题：对齐。许多架构要求特定类型数据存放在特定内存地址，比如指针变量的地址为4的倍数，double变量的地址为8的倍数，如果没有遵循这个规则将会引起运行时的硬件异常，有些架构对此可能会宽容些，但是对齐的话性能会更好。C++要求所有的new操作符返回**对齐任何类型的指针**，malloc满足同样的要求，所有单单使用malloc并返回其地址的new操作符是没有问题的，但样例代码返回的是malloc返回的地址加上一个int大小的偏移，该地址并不保证是对齐的，比如new一个double数组，double为8字节，int为4字节，返回地址没有和8对齐，最后的结果是程序不运行或者运行得更慢。  
许多情况下，你并不需要自定义new和delete，有些编译器已经在其内存管理函数中实现了调试和日志功能，浏览一下编译器的文档可以帮助你打消自定义new和delete的念头，许多商业产品提供可替换内存管理函数的编译器，只需要买下并重新链接即可，另一种选择是开源的内存管理器，比如Boost的Pool库。本节的主题是知道什么时候替换默认的new和delete才有意义，这里总结如下：
- 检测使用错误
- 收集动态分配内存的统计数据
- 提高内存分配和释放的速度
- 减少默认内存管理的内存开销
- 补偿默认分配不佳的对齐
- 集中相关对象
- 获得非传统的行为

:::tip 总结
自定义new和delete的原因有很多，比如改善性能，调试堆使用错误，收集堆使用数据等
:::

## Item51:重写new和delete时坚持惯例
Item50说明了何时重写new和delete，但没有说明重定义时应该遵守的惯例，这些规则不难遵守，只是理解起来没有那么直观，因此了解它们很重要。首先从实现operator new开始，它需要有正确的返回值，内存不足时调用new-handler，应对要求内存大小为0的情况，同时要避免覆盖new的正常形式(详见Item52)。new操作符的返回值看似很简单：如果申请内存成功，返回指针，否则按照Item49的规则抛出bad_alloc异常，但并不简单，因为new会尝试多次分配内存，并在每一次失败后调用new-handler函数，这里的假设是new-handler能够释放一些内存，当new-handle为空时new才会抛出异常。奇怪的是，C++要求new返回一个合法指针，即使申请内存大小为0，以此为例，非成员的operator new伪代码如下所示：
```cpp
void *operator new(std::size_t size) throw(std::bad_alloc) {
    using namespace std;
    if(size == 0) {             // 处理分配大小为0的情况
        size = 1;               // 将大小改为1
    }

    while(true) {
        attempt to allocate size bytes;
        if(the allocation was successful)
            return (a pointer to the memory);
        
        // 内存分配失败
        new_handler globalHandler = set_new_handler(0);
        ser_new_handler(globalHandler);
        if(globaleHandler)
            (*globalHandler)();
        else
            throw std::bad_alloc();
    }
}
```
注意代码中处理size为0的技巧，直接把size改为1，简单但有效，不然要怎么办？另外也会发现new-handler被设置为null，然后重置，这是因为没有办法直接多的new-handle函数指针，只能调用set_new_handler来获得，粗暴但是有效，至少在单线程中，在多线程中需要用锁确保安全。Item49中强调new要包含一个无限循环，以上代码展示了这点，`while(true)`是无限循环，只有当成功分配内存或者失败后完成new-handler的工作(见Item49)才能退出循环。许多人都没有意识到成员函数operator new会被派生类继承，从而导致一些问题，以上的伪代码中把size为0改成1适用于所有情况，但是正如Item51所解释的，自定义的内存管理器是为了优化特定类的内存分配，而不是所有类或者类的派生类而这么做，也就是说，给定类X的成员函数operator new，该方法申请的内存体积就是`sizeof(x)`，不多也不少，但是由于继承，可能会让基类的new操作符函数在派生类对象的创建中被调用：
```cpp
class Base {
    public:
        static void* operator new(std::size_t size) throw(std::bad_alloc);
        ...
};

class Derived: public Base {        // 基类并没有声明
    ...                             // operator new方法
};

Derived *p = new Derived;           // 调用Base::operator new
```
如果Base::operator new没有考虑到这种情况，最好的方法是减少请求调用“错误”大小的内存，而是使用标准(全局)的new，如下所示：
```cpp
void* Base::operator new(std::size_t size) throw(std::bad_alloc) {
    if(size != sizeof(Base))
        return ::operator new(size);
    ...
}
```
“慢着！”我想你已经开始大叫了，“你没有考虑size为0的情况”，实际上，这已经在包含在`size != sizeof(Base)`里面了，C++规定空类的大小不为0(见Item39)，由此`sizeof(Base)`永远不会为0，所以如果size为0，还是会执行`::operator new(size)`。如果想要控制类数组，需要实现`operator new[]`，称之为“array new”，实现array new时要注意，你所做的所有只是分配一块内存，里面没有对象，实际上你甚至不知道数组里面有多少个对象：第一，你不知道每个对象大小，因为基类的`operator new[]`可能会被派生类调用，而派生类对象通常比基类大；第二，传递给`operator new[]`的参数size可能会多一些，正如Item16所说明的，动态分配的内存需要额外空间存储元素个数。以上就是你在重写operator new时所需要遵循的惯例，对于delete来说就很简单了，只需要记住C++保证释放空指针时总是安全的：
```cpp
void operator delete(void *rawMemory) throw() {
    if(rawMemory == 0) return;                      // 空指针直接返回
    释放rawMemory所指向内存
}
```
以上的实现代码是简单的，除非你必须确保被释放的大小，假设你的类方法operator new向`::operator new`要求“错误的”内存大小，你也要通过`::operator delete`释放内存：
```cpp
class Base {
    public:
        static void* operator new(std::size_t size) throw(std::bad_alloc);
        static void operator delete(void* rawMemory, std::size_t size) throw();
    ...
};

void Base::operator delete(void* rawMemory, std::size_t size) throw() {
    if(rawMemory == 0) return;              // 检查空指针
    
    if(size != sizeof(Base)){               // 如果大小是“错误的”
        ::operator delete(rawMemory);       // 使用标准的delete释放内存
        return;
    }

    释放rawMemory所指向内存
    return;
}
```
有趣的是，如果基类析构函数不是虚函数，对于派生类对象来说，operator delete的size参数值大小可能是错误的(同operator new一样)，这就是最好确保基类的析构函数是virtual的原因，Item7的例子有着更可靠的理由，现在你只需要记住如果基类的析构函数没有加virtual的话，operator delete就可能会出问题

:::tip 总结
重写new应该包含一个试着分配内存的无限循环，当分配失败应该调用new-handler，能够处理申请大小为0的情况，特定类版本的new应该处理比预期更大内存块的申请；重写delete在指针为空时什么也不干，特定类版本的delete应该处理比预期更大内存块的释放
:::

## Item52:如果自定义placement new则要自定义对应的delete
Placement new和placement delete并不是在C++动物园中最常见的野兽，不必因为不熟悉它们而惊慌，回顾Item16，17中new的用法：
```cpp
Widget *pw = new Widget;
```
这里调用了两个函数，首先operator new用于申请内存，然后是Widget的默认构造函数。假设第一个函数调用成功但是第二个失败抛出异常，此时我们需要释放第一步中申请的内存，但是客户端代码不能做到，因为Widget构造函数抛出异常，pw没有被赋值，所以责任落到了C++运行时系统身上，它需要调用与步骤1中operator new相对应的operator delete函数，但这仅限于C++运行时系统知道该调用哪个operator delete函数，如果是正常签名的new和delete操作符函数，这并没什么问题：
```cpp
void* operator new(std::size_t) throw(std::bad_alloc);

void operator delete(void *rawMemory) throw();                      // 全局作用域的正常签名
void operator delete(void *rawMemory, std::size_t size) throw();    // 类作用域的正常签名
```
如果只使用普通形式的new和delete不会出现任何问题，运行时系统知道调用哪个delete，但是如果你声明了额外参数的operator new函数，就会出现问题，比如：
```cpp
class Widget {
    public:
        static void* operator new(std::size_t size, std::ostream& logStream)
        throw(std::bad_alloc);
        static void operator delete(void *pMemory, std::size_t size)
        throw();
    ...
};
```
接受额外参数(除了大小参数size外)的operator new函数被称为placement new，比如这里的`Widget::operator new`，placement new的常见用法就是指定对象构造的地址，它的声明为：
```cpp
void* operator new(std::size_t, void* pMemory) throw();
```
实际上，这种版本的new已经包含在C++标准库中，包含头文件`#include <new>`就可以使用，当提到placement new时，其实人们都在说这个特殊的版本，回到Widget，考虑如下客户端代码：
```cpp
Widget *pw = new (std::cerr) Widget;
```
再一次地，如果内存分配成功但是Widget构造函数抛出异常，运行时系统负责回滚operator new的操作，但是，由于运行时系统不能理解`Widget::operator new`的工作，它就不能撤回内存分配操作，转而寻找和`Widget::operator new`配套的，**有的相同数目和相同类型的额外参数**的operator delete函数，也就是：
```cpp
void operator delete(void *, std::ostream&) throw();
```
类比placement new，相配套的称为placement delete，但是到现在Widget也没有声明如上所示的placement delete，因此运行系统找不到配套的delete，结果是它选择什么也不干，因此，为了消除可能的内存泄露，如果定义了额外参数的new操作符，就必须提供对应的delete操作符：
```cpp
class Widget {
    public:
        static void* operator new(std::size_t size, std::ostream& logStream)
        throw(std::bad_alloc);
        static void operator delete(void* pMemory) throw();
        static void operator delete(void* pMemory, std::ostream& logStream) throw();
    ...
};
```
现在当`Widget *pw = new (std::cerr) Widget;`抛出异常时，对应的delete会被调用确保没有内存泄露，如果没有异常抛出，我们会使用delete删除对象`delete pw;`，此时调用的是正常的delete，placement delete只有在placement new抛出异常时才被调用，直接使用delete加指针永远不会调用placement delete，这意味着你需要同时提供正常的delete和placement delete来防止内存泄露。另外，由于成员函数会覆盖类外的同名函数，需要避免类的new操作符函数覆盖其他的new操作符函数：
```cpp
class Base {
    public:
        static void* operator new(std::size_t size, std::ostream& logStream)
        throw(std::bad_alloc);
    ...
};

Base *pb = new Base;                // 错误！
Base *pb = new (std::cerr) Base;    // 正确，调用placement new
```
Base类只声明了placement new，无法使用正常的new，类似的，派生类的new操作符会覆盖全局和继承的new操作符：
```cpp
class Derived: public Base {
    public:
        static void* operator new(std::size_t size)
        throw(std::bad_alloc);
    ...
};

Derived *pd = new (std::clog) Derived;  // 错误，基类的operator new函数被覆盖
Derived *pd = new Derived;
```
Item33讨论了详细讨论了这种名称覆盖的情况，但是对于自定义内存分配函数，你只需要记住默认C++提供以下三种形式的全局operator new：
```cpp
void* operator new(std::size_t) throw(std::bad_alloc);          // 正常new
void* operator new(std::size_t, void*) throw();                 // placement new
void* operator new(std::size_t, const std::nothrow_t&) throw(); // nothrow new
```
如果你在类中声明任何operator new函数，就会覆盖以上的标准形式，除非你故意不使用标准形式的new，确保它们可用，对于每种可用的operator new，确保有对应的operator delete，如果想让这些函数表现正常的行为，只要类成员operator new/delete调用全局operator new/delete即可，一种简单的实现方式是创建包含正常模式new/delete的基类：
```cpp
class StandardNewDeleteForms {
    public:
        // normal new/delete
        static void* operator new(std::size_t size)
        throw(std::bad_alloc) { return ::operator new(size); }
        static void operator delete(void *pMemory) throw()
        { ::operator delete(pMemory); }

        // placement new/delete
        static void* operator new(std::size_t size, void *ptr) throw()
        { return ::operator new(size, ptr); }
        static void operator delete(void *pMemory, void *ptr) throw()
        { return ::operator delete(pMemory, ptr); }

        // nothrow new/delete
        static void* operator new(std::size_t size, const std::nothrow_t& nt)
        { return ::operator new(size, nt); }
        static void operator delete(void *pMemory, const std::nothrow_t& nt)
        { return ::operator delete(pMemory); }
};
```
客户端可以通过继承和using声明(见Item33)在标准形式的基础上增加自定义部分：
```cpp
class Widget: public StandardNewDeleteForms {
    public:
        using StandardNewDeleteForms::operator new;         // 引入基类所有重载版本的new
        using StandardNewDeleteForms::operator delete;      // 引入基类所有重载版本的delete

        static void* operator new(std::size_t size, std::ostream& logStream)
        throw(std::bad_alloc);
        static void operator delete(void *pMemory, std::ostream& logStream)
        throw();
    ...
};
```

:::tip 总结
自定义placement new确保也要自定义对应的delete，否则程序会出现微妙的，间歇的内存泄露；当声明placement new/delete时，除非有意而为之，不要覆盖正常版本的new/delete
:::