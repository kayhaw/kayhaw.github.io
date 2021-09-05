---
layout: article
title: 设计和声明
permalink: /Effective-C++-Note/chap4
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---
:::info
《Effective C++》英文第三版读书笔记第四章
:::

## Item18:让接口正确使用起来简单，错误使用起来复杂
C++充满着各种接口：函数接口，类接口，模板接口。开发这些接口的原则应该是让它们正确使用起来简单而错误使用复杂，比如你要设计一个日期类Date：
```cpp
class Date {
    public:
        Date(int month, int day, int year);
        ...
};
```
第一眼看上去没什么大问题，但是使用者可能会犯两个错误
1. 传入参数的顺序错误：
```cpp
Date d(30, 3, 1995);    // 应该是3，30，1995
```
2. 传入月份或者日数的值错误：
```cpp
Date d(2, 30, 1995);    // 应该是3，30，1995
```

许多这种使用错误可以通过引入新类型来解决，类型系统是防止讨厌代码的主要方式，如下所示引入新结构来区分年，月，日：
```cpp
struct Day {
    explicit Day(int d): val(d) {}
    int val;
};
struct Month {
    explicit Month(int m): val(m) {}
    int val;
};
struct Year {
    explicit Year(int y): val(y) {}
    int val;
};
class Date {
    public:
        Date(const Month& m, const Day &d, const Year& y);
        ...
};
Date d(30, 3, 1995);                    // 错误，不正确的类型
Date d(Day(30), Month(3), Year(1995));  // 错误，不正确的类型
Date d(Month(3), Day(30), Year(1995));
```
确保类型没问题后，还需要确定类型的值没有问题，比如月份的有效值只有1-12，这需要在Month类型上体现，一种方式是使用枚举来表示月份，但是枚举不是类型安全的，更安全的一种方式是预定义所有有效月份值：
```cpp
class Month {
    public:
        static Month Jan() { return Month(1); }
        static Month Feb() { return Month(2); }
        ...
        static Month Dec() { return Month(12); }
    private:
        explict Month(int m);
        ...
};
Date d(Month::Mar(), Day(30), Year(1995));
```
另一种方式是限制类型的操作符函数，比如加上const限制，见Item3，其中的指导思想是让你的类型和内建类型的行为保持一致，比如int类型表达式`a*b = c`是非法的，那么Month类可以在实现*操作符时加上const限制。任何需要用户记得去做某件事的接口都很容易错误使用，比如Item13中的createInvestment()工厂函数，需要用户使用delete释放资源，但用户可能忘记delete或者多次delete，Item13使用shared_ptr来封装createInvestment()返回的指针，但是万一忘记使用智能指针怎么办？设计更好的接口应该是createInvestment()直接返回智能指针
```cpp
std::shared_ptr<Investment> createInvestment()
```
更近一步地，假设希望使用特定的getRidOfInvestment()函数来释放资源而不是用delete，在智能指针的构造函数第二个参数中传入函数指针，比如要创建一个指向空Investment的智能指针，并绑定getRidOfInvestment()函数
```cpp
std::shared_ptr<Investment> pInv(0, getRidOfInvestment);    // 错误
std::shared_ptr<Investment> pInv(static_cast<Investment*>(0), getRidOfInvestment);  // 正确
```
构造函数第一个参数是资源类型指针，参数直接设置为0是不正确的，需要使用static_cast强制类型转换，也就是最后createInvestment的代码应该是：
```cpp
std::shared_ptr<Investment> createInvestment() {
    std::shared_ptr<Investment> retVal(static_cast<Investment*>(0), getRidOfInvestment);
    retVal = ...;       // 让retVal指向正确的对象
    return retVal;
}
```
使用shared_ptr的另一个好处是它自动使用指定的deleter(比如上面的getRidOfInvestment)来释放对象，避免了另一种潜在的"跨DLL"问题：当对象在一个动态链接库中使用new创建但是在另一个动态链接库中delete，在许多平台上这种跨DLL的new/delete都会产生运行时问题，但是shared_ptr指定deleter确保对象new和delete来自相同的DLL，比如Stock类派生自Investment：
```cpp
std::shared_ptr<Investment> createInvestment() {
    return std::shared_ptr<Investment>(new Stock);
}
```
creatInvestment函数返回的对象可以自由地在DLL间传递而不必担心跨DLL问题，因为shared_ptr记录着哪个DLL的delete应该被使用。本条款不是shared_ptr的使用而是如何让接口正确使用起来简单而错误使用起来复杂，但是使用shared_ptr是一种消除某些使用错误的方法，它的开销比传统指针大，运行更慢但是能够减少错误

:::tip 总结
坚持正确使用简单，错误使用复杂的接口设计原则；方便接口正确使用的方式包括和和内建类型行为兼容以及接口一致性；防止错误的方式包括创建新类型，限制操作符函数，限制对象值，消除代码使用者管理资源的责任；shared_ptr支持定制deleter，可以防止跨DLL问题，用于实现互斥锁
:::

## Item19:将类(class)设计视为类型(type)设计
作为面向对象编程语言，C++中定义class就是定义一种新类型，如何设计高效的class，你需要思考如下几个问题：
- 你的类应该怎么被创建和销毁？即构造函数和析构函数的设计，以及new，new[\]，delete，delete[\]操作符函数
- 如何让对象的初始化构造和赋值显得不同？即拷贝构造函数和赋值操作符函数设计
- 对象按值传递意味着什么？拷贝构造函数的设计决定如何按值传递
- 应该禁止什么样的标准函数？也就是哪些方法需要声明为private
- 谁可以访问类成员？也就是对象成员声明为private、protected还是public，哪些类、函数声明为friend，以及是否需要类中嵌套声明新类
- 你的类中有哪些"未声明的接口"？也就是类在性能，异常安全，资源使用上能够做出哪些保证
- 你的类有多通用？或许你想要定义的是个通用的模板类
- 这个新类是你真正想要的吗？可能你只需要定义派生类

:::tip 总结
类设计就是类型设计，在定义新类型之前，确保以上所有问题都仔细讨论过
:::

## Item20:优先使用const引用传递而不是值传递
默认情况下，C++按值传递函数参数，除非特定指明，函数形参通过实参的拷贝构造函数得到副本，这使得按值传递成本昂贵，例如以下的代码：
```cpp
class Person {
    public:
        Person();
        virtual ~Person();
        ...
    private:
        std::string name;
        std::string address;
};

class Student: public Person {
    public:
        Student();
        ~Student();
        ...
    private:
        std::string schoolName;
        std::string schoolAddress;
};
```
考虑函数validateStudent，它接受一个Student类型参数(按值)，判断该对象是否验证：
```cpp
bool validateStudent(Student s);
Student plato;
bool platoIsOK = validateStudent(plato);
```
函数调用时首先使用plato初始化形参s，由于当validateStudent()函数返回时s被销毁，所以调用这个函数的代价是一次拷贝构造函数和一次析构函数，但这还不是全部，Student对象包含两个string对象，包含Person子对象，因此Student对象的构造，销毁都需要调用string/Person类的构造，析构函数，总共是6次构造函数和6次析构函数调用！通过使用const引用传递的方式可以避免这些：
```cpp
bool validateStudent(const Student& s);
```
通过引用传递参数不需要调用构造/析构函数，加上const确保这个函数不会修改原来的对象；同时引用传递还能避免切片问题(slicing problem)，当派生类对象作为基类对象进行值传递时，基类的拷贝构造函数被调用，拷贝了派生的基类部分但是派生类多出来的新特性部分并没有复制，就像派生类对象被切片(sliced)了一样，比如在实现图形窗口系统的一些类时：
```cpp
class Window {
    public:
        ...
        std::string name() const;
        virtual void display() const;
};

class WindowWithScrollBars: public Window {
    public:
        ...
        virtual void display() const;
};
```
所有的Window类通过name方法得到名称，通过display方法显示，假设需要编写一个函数打印窗口名称并显示：
```cpp
void printNameAndDisplay(Window w) {    // 错误，可能出现切片问题
    std::cout<<w.name();
    w.display();
}
WindowWithScrollBars wwsb;
printNameAndDisplay(wwsb);
```
以上代码在调用时wwsb按值传递后会表现得像WindowWithSrollBars类被切片一样，具体地说在printNameAndDisplay中调用的display函数是Window::display而不是WindowWithScrollBars::display，作为虚函数的display在基类和派生类中往往行为都是不同的！通过引用传递参数可以解决这个问题：
```cpp
void printNameAndDisplay(const Window& w) {
    std::cout<<w.name();
    w.display();
}
```
仔细观察C++编译器底层，你会发现引用通常就是指针，因此内建类型(如int)使用值传递比使用引用传递效率好(指针还需要解引用)，但这不意味所有小类型的都要按值传递，对象小并不意味着拷贝构造的代价就小，比如绝大所数STL容器只包含指针和另外一点点数据项，但是拷贝这样的对象需要拷贝指针所指向的内容，而且即使是小开销的小类型也会有性能问题，比如编译器拒绝把只包含double类型的对象载入寄存器中，但是对于double类型指针就很乐意。另外用户定义的小类型通常都都不适合按值传递，因为将来它们都会发生改变(小类型变成大类型)

:::tip 总结
优先考虑按值传递，既高效又不会出现切片问题；但是对于STL容器和内建类型等并不适用，按值传递更好
:::

## Item21:当必须返回对象时不要返回引用
许多程序员为了追求极致的效率，使用未存在对象的引用作为返回值，比如有表示有理数的类Rational，该类实现了两个有理数相乘的方法：
```cpp
class Rational {
    public:
        Rational(int numerator = 0, int denominator = 1);
        ...
    private:
        int n, d;
    friend const Rational operator*(const Rational& lhs, const Rational& rhs);
};
```
operator*方法按值返回结果对象，问题是是否需要按值返回？如果条件允许的话可以，但是要记住引用仅仅只是个现有对象的别名。无论何时看到引用声明，你都需要注意其背后表示的对象，在上述例子中，如果方法返回引用，该引用的对象必须是已经存在的，包含两个有理数相乘的结果值，当然在调用operator\*之前不可能存在这样的对象，也就是说，如下代码所示：
```cpp
Rational a(1, 2);
Rational b(3, 4);
Rational c = a * b;
```
如果operator*返回引用，该方法必须自己创建对象，要么在堆上，要么在栈上，通过定义局部变量在栈上创建对象，也就是说：
```cpp
const Rational operator*(const Rational& lhs, const Rational& rhs) {
    Rational result(lhs.n * rhs.n, lhs.d * rhs.d);
    return result;
}
```
你可以立即放弃这个方法定义，因为你的目标是避免构造函数的使用，但是result对象必须先构建，更严重的问题是返回局部对象的引用后果是未知的，因为局部对象在方法调用结束时被销毁。现在考虑在堆上创建对象：
```cpp
const Rational& operator*(const Rational& lhs, const Rational& rhs) {
    Rational *result = new Ratinal(lhs.n * rhs.n, lhs.d * rhs.d);
    return *result;
}
```
好吧，还是需要调用构造函数，并且现在的问题是谁来使用delete删除new出来的对象？即使调用者足够细心，但还是存在不可避免的内存泄露的使用情况如
```cpp
Rational w, x, y, z;
w = x * y * z;
```
在上例中连续使用了两个*调用，new对象的指针不可能知晓，肯定会有内存泄露。也许你发现不管是基于堆还是基于栈的方法都需要调用构造函数，而初衷是尽量避免构造函数的使用，也许你认为还有种只需要调用一次构造函数的实现方法，返回static对象的引用：
```cpp
const Rational& operator*(const Rational& lhs, const Rational& rhs) {
    static Rational result;
    result = ...;
    return result;
}
```
使用static的方式肯定会引起多线程安全问题，但还有一种更明显的问题，考虑Rational类的operator==重载使用：
```cpp
bool operator==(const Rational& lhs, const Rational& rhs);
Rational a, b, c, d;
...
if ((a * b) == (c * d)) {
    ...
} else {
    ...
}
```
在使用static的情况下，`((a * b) == (c * d))`的结果永远为true，为了更好地说明，该表达式等同于`operator==(operator*(a, b), operator*(c, d))`，operator==调用两个operator*的结果，即static对象，如果比较结果不相等才怪。到了这里应该充分说明在类似operator\*的方法中返回引用是在浪费时间，正确的方法就是在需要返回新对象的方法中返回对象本身就是：
```cpp
inline const Rational operator*(const Rational& lhs, const Rational& rhs) {
    return Rational(lhs.n * rhs.n, lhs.d * rhs.d);
}
```
的确，这种写法存在构造/析构函数的成本，但是从长远角度来看，代码很安全，并且C++编译器可以安全地消除构造/析构的成本。

:::tip 总结
永远不要返回局部栈对象的指针或引用，堆分配对象的引用，或者局部static对象的引用/指针(只要存在多次使用static的情况)
:::

## Item22:声明数据成员为private的
从句法一致性来说，所有的数据成员都不是public的，客户端访问数据成员的唯一方式就是通过成员函数，这样客户端不必记住是否需要加上`()`来访问数据成员，此外还可以精准地控制数据访问性，public数据成员都是可读可写的，使用函数可以实现多种访问性：
```cpp
class　AccessLevels {
    public:
        int getReadOnly() const { return readOnly; }
        void setReadWrite(int value) { readWrite = value; }
        int getReadWrite() const { return readWrite; }
        void setWriteOnly(int value) { writeOnly = value; }
    private:
        int noAccess;       // 无外部访问权限
        int readOnly;       // 只读权限
        int readWrite;      // 可读可写
        int writeOnly;      // 只写权限
};
```
细粒度地访问控制十分重要，因为并不是所有数据成员都需要getter和setter。声明数据成员为private的另一点好处是提供封装，比如你正在开发一个自动检测车速的应用：
```cpp
class SpeedDataCollection {
    public:
        void addValue(int speed);       // 添加新的数值
        double averageSoFar() const;    // 返回平均速度
    ...
};
```
现在考虑averageSoFar方法的实现，一种方法是使用数据成员表示速度的平均值，调用averageSoFar就是返回该数据成员的值，另一种方式是让该方法每次都计算平均值。第一种方式增加类的体积，你需要维护平均值，速度总和，数据点个数，但averageSoFar的实现十分简单，而第二种方式让averageSoFar运行起来更慢但类体积更小；两种方式各有其适用的场景，将数据成员隐藏在方法接口后面提供实现的灵活性。

:::tip 总结
声明数据成员为private；protected并不比public更具封装性
:::

## Item23:优先将函数声明为非成员非友元而不是成员函数
假设有表示浏览器的类实现了清除缓存，浏览记录，Cookie的方法，如下所示：
```cpp
class WebBrowser {
    public:
        ...
        void clearCache();
        void clearHistory();
        void removeCookies();
        ...
};
```
许多用户都希望一块清除，因此WebBrowser可以提供方法clearEveryting来实现：
```cpp
class WebBrowser {
    public:
        void clearEverything();
        ...
};
```
另一种方式是通过非成员函数来实现：
```cpp
void clearBroswer(WebBrowser &wb) {
    wb.clearCache();
    wb.clearHistory();
    wv.removeCookies();
}
```
那么哪种更好呢？面向对象的原则暗示数据和方法应该绑定在一起，所以成员方法更好，但曲解了面向对象的原则：数据应该尽可能地封装起来。有悖常理地是，clearEverything实际上比clearBrowser封装性更弱，此外，使用非成员函数为WebBrowser类相关功能提供更多的封装灵活性。使用非成员函数比使用成员函数在许多方面具有优势，从以下几点理解：
- 封装性，封装的东西越多，能够看到的东西越少，从而改变封装的灵活性越大，因为改变只影响所见的部分，这就是把封装放在第一位的原因：它让我们在影响有限客户端的情况下更改
- 考虑对象关联的数据，代码能够看到的数据越少，说明封装的数据越多，意味着能更自由地改变对象数据特性，如成员数量，类型。一种粗粒度地判断代码关联数据的方法是看其能够直接访问数据的函数个数，这样的函数越多封装性越弱

Item22解释了为什么声明数据成员为private，因为如果没有这样声明，所有函数都可以访问它们，毫无封装性可言，而对于private数据成员来说，可访问它们的函数个数是成员函数个数加上友元函数个数，因此在成员函数和非成员函数之间选择，前者能够访问private数据成员，方法，枚举等，而后者什么也访问不到，因此非成员函数的封装性更好。  
这里有两点需要注意，首先该原则只适用于非成员非友元函数，从封装的角度来看，并不是成员和非成员函数之间的选择，而是成员和非成员**非友元**函数之间的选择，因为友元函数也可以访问类的私有成员，其次非成员非友元并不意味着该方法不能是另一个类的成员，比如，可以让clearBrowser成为某些工具类的static成员方法，只要不是WebBrowser类就行，在C++中，常见的方法是把clearBrowser和WebBrowser放在同一个命名空间中：
```cpp
namespace WebBrowserStuff {
    class WebBrowser {...};
    void clearBrowser(WebBrowser &wb);
    ...
};
```
更近一步地，因为不像类声明一样，namespace可以通过多个源文件扩展，对于类似clearBrowser的工具函数来说这很重要。类似WebBrowser的类可能不止一个工具函数，我们可以在多个头文件中声明不同工具函数让代码更加清晰：
```cpp
// "webbrowser.h" 头文件
namespace WebBrowserStuff {
    class WebBrowser {...};
    ...
};

// "webbrowserbookmarks.h"头文件
namespace WebBrowserStuff {
    ...         // 关于书签的工具函数
};

// "webbrowsercookies.h"头文件
namespace WebBrowserStuff {
    ...         // 关于cookie的工具函数
};
```
实际上这正是C++标准库采用的策略，在`<vector>`，`<algorithm>`等头文件中在命名空间std中声明，把工具函数放在多个头文件中的同一个命名空间中，意味着用户可以轻易地扩展工具函数集，只需要在命名空间中添加非成员非友元的函数。

:::tip 总结
优先将函数声明为非成员非友元的而不是成员函数，这样能够增加封装性，灵活性和扩展性
:::

## Item24:当类型转换适用于所有类型时声明为非成员函数
让类支持隐式类型转换是个坏习惯，但是该规则并不适用所有场景，比如当你设计表示有理数的类Rational时，允许整型隐式地转为Rational对象合乎常理：
```cpp
class Rational {
    public:
        Rational(int numerator=0, int denominator = 1);
        int numerator() const;
        int denominator() const;
    private:
        ...
};
```
现在实现有理数加，减，乘，除的四则运算，可选的方式有成员函数，非成员函数，友元函数，直觉告诉你使用面向对象的思想实现一个operator*()操作符重载，但是Item23又说把成员函数是不好的，我们先把这放在一边：
```cpp
class Rational {
    public:
        ...
        const Rational operator*(const Rational& rhs) const;
};
```
这样你就可以很方便地计算两个有理数相乘：
```cpp
Rational oneEight(1, 8);
Rational oneHalf(1, 2);
Rational result = oneHalf * oneEight;
result = result * oneEight;
```
但是当你想要和基本类型进行乘法运算时，只能成功一半：
```cpp
result = oneHalf * 2;       // 正确
result = 2 * oneHalf;       // 错误
```
这是个不好的征兆，因为根据乘法交换律结果都一样，把上述两行代码展开分析：
```cpp
result = oneHalf.operator*(2);
result = 2.operator*(oneHalf);
```
因为2并不属于某种类，编译器尝试在命名空间或者全局范围内寻找能够如此调用的非成员函数operator*，但在本例中并不存在这样的函数，而第一行能够成功编译是因为编译器隐式把int类型2转换为Rational函数，代码变得类似于：
```cpp
const Rational temp(2);
result = oneHalf * temp;
```
当然这在Rational类的构造函数未加explicit关键字时才成立。现在我们的目标是同时支持两种调用形式的函数，解决方法是声明operator*为非成员函数，这样编译器对所有类型参数都可以进行隐式类型转换：
```cpp
class Rational { ... };
const Rational operator*(const Rational& lhs, const Rational& rhs) {
    return Rational(lhs.numerator() * rhs.numerator(),
                    lhs.denominator() * rhs.denominator());
}
Rational oneFourth(1, 4);
Rational result;
result = oneFourth * 2;
result = 2 * oneFourth;
```
现在万事大吉，可operator*函数是否还应该声明为Rational的友元函数，答案是否定的，本例的实现完全使用Rational类的公有接口，不需要将函数声明为友元，尽量避免使用友元函数

:::tip 总结
如果需要对函数所有参数进行类型转化，该函数必须声明为非成员的
:::

## Item25:斟酌不抛出异常的swap函数
swap是个有趣的函数，自STL提供swap函数起，它就是异常安全编程的主干，以及防止自赋值的一种措施，swap函数十分有用，因此需要正确地实现它。STL中swap的实现如下所示：
```cpp
namespace std {
    template<typename T>
    void swap(T& a, T& b) {
        T temp(a);
        a = b;
        b = temp;
    }
}
```
只要类型支持拷贝，默认的swap函数圆满完成了任务，但是它进行了三次拷贝：a到temp，b到a，temp到b，最重要地是有些类可能包含数据指针，常见的"pimpl"(pointer to implementation)惯用，例如下面所示的类：
```cpp
class WidgetImpl {
    public:
        ...
    private:
        int a, b, c;
        std::vector<double> v;
        ...
};

class Widget {
    public:
        Widget(const Widget& rhs);
        Widget& operator=(const Widget& rhs) {
            ...
            *pImpl = *(rhs.pImpl);
            ...
        }
        ...
    private:
        WidgetImpl *pImpl;
};
```
要交换两个Widget对象的值，我们只需要交换它们的pImpl指针值，但是默认的swap算法并不了解这种情况，swap将会拷贝3次Widget对象，3次WidgetImpl对象，极大降低效率。优化方法是告诉std::swap函数在处理Widget类时只需要交换pImpl指针值就可以了，也就是显式具体化swap函数：
```cpp
namespace std {
    template<> void swap<Widget>(Widget &a, Widget &b) {
        swap(a.pImpl, b.pImpl);         // 注意这里还不能编译因为pImpl是私有成员
    }
}
```
以上的代码中开头的`template<>`表示这是swap模板的显式具体化，函数名后面的`<Widget>`表示是针对Widget类型的具体化，即swap参数类型为Widget时使用上述代码定义的swap函数，注意这里还不能够编译，因为pImpl是私有成员，我们可以把具体化声明为友元函数，但传统的做法是声明同名的成员函数swap，然后在Widget::swap中调用std::swap，如下所示：
```cpp
class Widget {
    public:
        ...
        void swap(Widget &other) {
            using std::swap;
            swap(pImpl, other,pImpl);       // 类里面可以访问另一个同类对象的私有成员
        }                                   // 使用std::swap交换WidgetImpl指针
    ...
};

namespace std {
    template<> void swap<Widget>(Widget &a, Widget &b) {
        a.swap(b);                          // 调用类成员函数swap
    }
}
```
一切解决完毕，现在考虑Widget和WidgetImpl都是模板类而不是类的情况：
```cpp
template<typename T>
class WidgetImpl { ... };

template<typename T>
class Widget { ... };
```
按照之前的解决方式，我们在Widget类中添加swap成员函数，但是在具体化std::swap模板时会遇到问题，我们想要这么写：
```cpp
namespace std {
    template<typename T>
    void swap<Widget<T> >(Widget<T> &a, Widget<T> &b) {
        a.swap(b);
    }
}
```
以上的std::swap具体化的代码看起来合情合理，但遗憾地是它是不符合语法的，因为我们尝试部分具体化函数模板，C++允许类模板部分具体化，但不允许函数模板部分具体化，所以该代码不能编译通过。当你想要"部分具体化"函数模板时，通常的办法是重载，如下所示：
```cpp
namespace std {
    template<typename T>
    void swap(Widget<T> &a, Widget<T> &b) {     // std::swap模板的重载
        a.swap(b);                              // 注意函数名后面没有"<...>" 
    }
}
```
一般来说，重载函数模板没什么问题，但是std是特殊的命名空间，最好不要往里面添加新东西，那这时候该怎么办？我们需要声明非成员的swap函数来调用成员函数swap，如下所示：
```cpp
namespace WidgetStuff {
    ...
    template<typename T>
    class Widget { ... };
    ...
    template<typename T>
    void swap(Widget<T> &a, Widget<T> &b) {     // 这里的swap并不属于std命名空间
        a.swap(b);
    }
}
```
现在，使用swap交换Widget对象的代码都会调用WidgetStuff中的swap函数，并且适用于类/模板类，另外在调用swap时使用using声明指明所属的命名空间：
```cpp
template<typename T>
void doSomething(T &obj1, T &obj2) {
    using std::swap;        // 指出到底是哪一个swap
    ...
    swap(obj1, obj2);
    ...
}
```
使用`std::swap(obj1, obj2)`强制指定了std的swap模板，这样其他地方可能效率更高的swap函数就派不上用场，应该避免这种写法

:::tip 总结
当默认的std::swap实现对你的类来说并不高效时，提供一个swap成员函数并确保其不抛出异常；提供非成员的swap函数调用成员函数swap，对于非模板类来说还要具体化std::swap；当进行对象交换时，使用using声明语句using std::swap确保其可见，然后调用时使用不带域名解析前缀的swap让编译器选择最优的swap定义；可以对std模板进行自定义类型的具体化，但是不能往std命名空间里面加东西
:::