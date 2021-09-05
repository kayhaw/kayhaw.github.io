---
layout: article
title: 养成C++好习惯
permalink: /Effective-C++-Note/chap1
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---
:::info
《Effective C++》英文第三版读书笔记第一章
:::

## Item1:将C++视为多种语言的合集
为了弄清楚C++的语言特性本质，你需要认识到它由4种子语言(sublanguage)组成：
- C语言。C++基于C语言，语句，块，预处理器，内建类型，数组，指针这些概念都来自于C
- 面向对象的C++。类，封装，继承，多态，虚函数等都是C++在C基础上扩展部分
- C++模板。这是C++的泛型编程(generic programming)部分，提供新的编程范式，模板元编程(template metaprogramming,TMP)
- STL。标准模板库包含容器，迭代器，算法，函数对象
C++不是一种统一(unified)的单个语法的集合，而是如上4种子语言的联合，每种子语言都有自己的规范。在C中，内置类型的按值传递比按引用传递更高效，但到了面向对象的C++，类的按引用传递比按值传递更好，尤其是在C++模板中，你都不知道类型，但是在STL中迭代器和函数对象建立在C指针模型上，按值传递又适用了。

:::tip 总结
高效的C++编程规范依你所使用的C++子语言部分不同而不同
:::

## Item2:偏向const，enum和inline而不是`#define`
更具体地说是偏向编译器而不是预处理器，例如定义`#define ASPECT_RATIO 1.653`，结果是名称PI不会出现在符号表中，当涉及到这个常量的编译错误后，报错指向1.653，而不是名称ASPECT_RATIO，这让人感到困惑，尤其这个宏定义不是你自己写的，解决方案是把宏换成符号常量`const double AspectRatio = 1.653`。使用const代替define有两点需要注意：
- 定义指针常量最好也把它定义为常量指针，即`const char* const authorName="Scott Meyers";`，对于字符指针使用string代替`const std::string authorName("Scott Meyers");`
- 定义类相关的常量，为了限制其作用域，最好声明为成员变量，为了确保常量只有一个，使用static修饰
```cpp
class GamePlayer{
    private:
        static const int NumTurns;
        int scores[NumTurns];
        ...
};
const int GamePlayer::NumTurns=5;
```

以上只是类成员常量NumTurns的声明和定义，定义时不必加static关键字，没有定义默认的static变量初始值为0。但对于数组来说其大小在编译时就必须确定，所以使用枚举来代替类成员常量，这被称为“the enum hack”
```cpp
class GamePlayer {
    private:
        enum{NumTurns = 5};
        int scores[NumTurns];
        ...
};
```
另一种常见的`#define`不恰当使用是实现看起来像函数但是开销没函数大的宏定义，`#define CALL_WITH_MAX(a, b) f((a) > (b) ? (a) : (b))`，这种宏定义有许多缺点，首先你要记得给所有的参数加上括号，即使这样也有问题，比如
```cpp
int a = 5, b = 0;
CALL_WITH_MAX(++a, b);
CALL_WITH_MAC(++a, b+10);
```
解决方案是使用内联的模板函数
```cpp
template<typename T>
inline void callWithMax(const T& a, const T& b) {
    f(a > b ? a : b);
}
```
:::tip 总结
对于简单常量，使用`const`或者`enum`替换`#define`；对应类函数的宏，使用内联模板函数替换`#define`
:::

## Item3:尽可能地使用const
使用const的神奇之处在于给特定对象加上不能修改的语义限制，并使得编译器强制执行这种限制。const的功能是多变的，在类定义外，使用它来限制全局变量或者命名空间，或者是声明为static的对象，函数和块；在类定义内，可以用于static或非static数据成员；对于指针，你可以指定指针本身是const的，还是所指内容是const的
```cpp
char greeting[] = "Hello";
char *p= greeting;
const char *p = greeting;
char * const p = greeting;
const char* const P = greeting;
```
**如果const出现在`*`号左侧，说明指向内容为不可修改的，如果const出现在`*`号右侧，说明指针本身是不可修改的，同时出现则两者都是不可修改的，如果指针所指向内容是不可修改的，const在类型名的左右侧是等价的**
```cpp
void f1(const Widget *pw);
void f2(Widget const *pw);
```
STL迭代器是基于指针的，也就是说`iterator`类似于`T*`指针，故`iterator const`类似于`T* const`，也就是声明的迭代器不可修改，但是迭代器所指向内容可以修改，如果你想要迭代器指向内容不可修改，则使用`const_iterator`
```cpp
std::vector<int> vec;

const std::vector<int>::iterator iter = vec.begin();
*iter = 10;     // Fine
++iter;         // Error!

std::vector<int>::const_iterator cIter = vec.begin();
*cIter = 10;    // Error!
++cIter;        // Fine
```
const在函数声明中的使用最强大，你可以声明函数返回值，独立参数，甚至整个函数为const的。声明函数返回值为const的可以减少错误的影响范围，考虑如下所示代码
```cpp
class Rational {...};
const Rational operator*(const Rational& lhs, const Rational& rhs);
Rational a, b, c;
```
若不声明返回值为const的，程序员可能写出`if (a * b = c)`这样的错误代码，当a，b是内置类型这是明显的错误，使用const可以预防这种错误，函数参数声明为const可以预防`==`错误为`=`的错误
### const成员函数
const成员函数用于确定哪些是const对象能够调用的函数，第一const成员函数不能修改对象，第二能够正确应对const对象；**许多人忽略const和非const成员函数是可以重载的**，但这是个关键的C++特性：
```cpp
class TextBlock {
    public:
        const char& operator[](std::size_t position) const {
            return text[position];
        }
        char& operator[](std::size_t position) {
            return text[position];
        }
    private:
        std::string text;
};

TextBlock tb("Hello");
std::cout << tb[0];     // Fine, call non-const
tb[0] = 'x';            // Fine, call non-const
const TextBlock ctb("World");
std::cout << ctb[0];    // Fine, call const
ctb[0] = 'x';           // Error! writing a const TextBlock
```
注意这里的错误只和operator[\]的返回类型是否为const有关，同时注意返回的是`char&`而不是`char`，返回char类型的版本使得`tb[0]='x'`不能通过编译，即使通过编译也只是修改tb.text[0]拷贝的值而不是其本身。  
声明const成员函数有两种含义，按位不可修改(bitwise constness)和逻辑不可修改(logic constness)。按位不可修改意味着函数不能修改任何对象的数据成员(**除了static成员**)，不幸的是，许多成员函数并不表现得const，尤其是经常修改指针所指内容的函数，但是当该指针属于成员对象时，函数又被编译器认为是按位不可修改的，不会报错，这是一种违反直觉的做法，如下所示
```cpp
class CTextBlock {
    public:
        char& operator[](std::size_t position) const {
            return pText[position];
        }
    private:
        char* pText;
};

const CTextBlock cctb("Hello");
char *pc = &cctb[0];
*pc = 'J';
```
调用const对象的const方法仍然修改了值，这是错误的，由此引出逻辑不可修改的概念：const成员函数可以修改对象的内容，但是只能通过对象不能检测的方式。如下例所示，CTextBlock类引入缓存长度的成员：
```cpp
class CTextBlock {
    public:
        std::size_t length() const;
    private:
        char *pText;
        std::size_t textLength;     // 上一次计算长度值
        bool lengthIsValid;         // 当前长度值是否有效
};

std::size_t CTextBlock::length() const {
    if(!lengthIsValid) {
        textLength = std::strlen(pText);    // 错误! 不能在const成员函数中
        lengthIsValid = true;               // 对textLength和length进行赋值
    }
    return textLength;
}
```
如上的实现方式修改了成员对象值，违反按位不可改的原则，编译器会报错，对此解决方案是使用C++的关键字`mutable`:它将非static数据对象从按位不可修改的限制中解放出来
```cpp
class CTextBlock {
    public:
        std::size_t length() const;
    private:
        char *pText;

        mutable std::size_t textLength;
        mutable bool lengthIsValid;
}

std::size_t CTextBlock::length() const {
    if(!lengthIsValid) {
        textLength = std::strlen(pText);
        lengthIsValid = true;
    }
    return textLength;
}
```

### 避免const和非const成员函数中的代码重复
mutable解决了"我没想到还有按位不可修改要求"的问题，但是不能解决所有const相关的问题，比如当在operator[\]运算符重载中实现边界检查，日志访问信息，数据集成验证等其他操作时，把这些代码都放到const和非const的operator[]函数中显得有点臃肿：
```cpp
class TextBlock {
    public:
        const char& operator[](std::size_t position) const {
            ...     // 边界检查
            ...     // 日志访问
            ...     // 数据验证
            return text[position];
        }
        
        char& operator[](std::size_t position) {
            ...     // 边界检查
            ...     // 日志访问
            ...     // 数据验证
            return text[position];
        }
    
    private:
        std::string text;
};
```
可以把边界检查等代码封装在一个私有成员函数中来调用，但最后还是两份的调用，两份的return语句；实际上我们想要的是只实现一次operator[\]，调用来两次，也就是非const版本的operator[\]调用const版本的，这需要去const的类型转换。实际上，一般来说强制类型转换是个糟糕的想法，但是在这个例子中两个版本的operator[\]的实现几乎完全一样，const版本返回值去掉const没什么关系，而且调用非const版本的operator[\]肯定也是非const对象，因此直接去掉const是安全的
```cpp
class TextBlock {
    public:
        const char& operator[](std::size_t position) const {
            ...     // 边界检查
            ...     // 日志访问
            ...     // 数据验证
            return text[position];
        }
        
        char& operator[](std::size_t position) {
            return const_cast<char&>(static_cast<const TextBlock&>(*this)[position]);
        }
    
    private:
        std::string text;
};
```
注意这里首先使用`static_cast<const TextBlock&>(*this)`把非const对象强制转换为const对象然后调用const的operator[]方法，否则调用的是非const方法(方法本身)造成递归调用；反过来想要const方法调用非const方法是不现实的，因为非const方法无法确保对象不被修改，实际上调用对象也是const的，还需要使用const_cast来去掉对象的const属性，而非const提升为const是安全的
:::tip 总结
加上const的声明能够让编译器检测到代码错误，可以在任何作用域内加上const；编译器强制const是按位不可修改，但是你应该按逻辑不可修改来编程；当const和非const成员函数实现基本相同，可以通过非const版本调用const版本来消除重复代码
:::

## Item4:确保对象在使用前已被初始化
总是在对象使用之前对其初始化，对于内建类型需要手动初始化`int x=0;`，对于几乎其他类型需要构造函数来执行，规则很简单：确保构造函数初始化对象内的所有东西；这个规则很简单，但是不要将初始化和赋值相混淆
```cpp
class PhoneNumber {...};

class ABEntry {
    public:
        ABEntry(const std::string& name, const std::string& address, const std::list<PhoneNumber>& phones);
    private:
        std::string theName;
        std::string theAddress;
        std::list<PhoneNumber> thePhones;
        int num TimesConsulted;
};

ABEntry::ABEntry(const std::string& name, const std::string& address, const std::list<PhoneNumber>& phones)
{
    theName = name;             // 这些都是赋值
    theAddress = address;       // 而不是初始化
    thePhones = phones;
    numTimesConsulted = 0;
}
```
以上代码虽然产生你所想要的ABEntry对象，但不是最好的办法；C++的规则约定对象的数据成员在进入构造函数体之前进行初始化，在ABEntry构造函数中，theName等是被赋值而不是初始化，更好的办法是使用初始化成员列表
```cpp
ABEntry::ABEntry(const std::string& name, const std::string& address, const std::list<PhoneNumber>& phones)
: theName(name),           // 现在是初始化了
theAddress(address),
thePhones(phones),
numTimesConsulted(0)
{}
```
使用初始化列表的构造函数和使用赋值的构造函数两者效果一样，但效率更高，基于赋值的构造函数首先调用每个成员的默认构造函数来初始化成员，然后进行快速赋值，因此成员默认构造函数的工作全都浪费了，但是初始化列表避免了这种情况；你也可以使用初始化列表默认初始化数据成员，不指定任何参数即可，如下所示
```cpp
ABEntry::ABEntry()
: theName(),
theAddress(),
thePhones(),
numTimesConsulted(0)
{}
```
初始化列表中没有初始化设置的成员会由编译器自动调用默认构造函数初始化，有些程序员认为上面这种方式过度，但是通过初始化列表可以避免漏掉可能未初始化的数据成员。
- 对非static的const成员必须使用初始化列表
- 如果数据成员太多，初始化列表变得复杂，可以把赋值封装到一个私有方法中，当初始化对象的值是从文件或者数据库中获得的，但一般来说通过初始化列表的真初始化优于通过赋值的假初始化
- 初始化顺序：从基类开始到派生类，**成员按照在类中声明的顺序而不是初始化列表中的顺序啊**，但为了不让读者疑惑，初始化列表的顺序和声明顺序保持一致

静态对象(static object)包括全局对象，定义在命名空间内的对象，定义在类中声明为static的对象，定义在函数中声明为static的对象以及在文件作用域内声明为static的对象，其中在函数内声明的称为局部静态对象(local static object)，其他的称为非局部静态对象(non-local static object)  
翻译单元是产生单个目标文件的源代码，基本上是一个源文件和它包含的所有#include头文件  
{:.info}
考虑这么一种情况，一个翻译单元的非局部静态对象使用另一个翻译单元的非局部静态变量，被使用的对象可能还未被初始化，*因为在不同翻译单元中的不同非局部静态变量间的相对初始化顺序是不确定的*，见如下示例代码：
```cpp
// you lib
class FileSystem {
    public:
        std::size_t numDisks() const;
        ...
};

extern FileSystem tfs;

// lib cl
class Directory {
    public:
        Directory(params);
        ...
};

Directory::Directory(params) {
    std::size_t disks = tfs.numDisks();
    ...
};

Directory tempDir(params);
```
这会出现一个问题，除非tfs在tempDir之前初始化，否则tempDir的构造器将会尝试使用在tfs初始化之前使用它，但这种行为是不确定的；解决方法是把非局部静态对象替换为局部静态对象，即
```cpp
class FileSystem {...};     // 代码不变
FileSystem& tfs() {
    static FileSystem fs;
    return fs;
}
class Directory {...};      // 代码不变
Directory::Directory(params) {
    std::size_t disks = tfs().numDisks();
    ...
}
Directory& tempDir() {
    static Directory td;
    return td;
}
```
熟悉设计默认的读者认出这就是单例模式常见的实现：函数定义一个局部静态变量然后返回其**引用**。这种函数的实现非常简单，经常调用它的话还可以提升为内联函数。但在另一方面，包含静态对象的函数在多线程情况下又会出现问题，而且这种方法首先需要有个合理的初始化顺序，假设你需要A在B之前初始化，但是A的初始化又依赖于B的初始化，那就无能为力了。

:::tip 总结
手动地初始化内建类型对象；在构造函数中优先使用成员初始化列表而不是在函数定义中使用赋值，初始化列表中成员顺序和其声明顺序保持一致；通过将非局部静态对象替换为局部静态对象来避免多翻译单元的初始化顺序问题**
:::