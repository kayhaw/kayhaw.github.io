---
layout: article
title: 构造函数,析构函数和赋值操作符
permalink: /Effective-C++-Note/chap2
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---
:::info
《Effective C++》英文第三版读书笔记第二章
:::

## Item5:了解C++暗中编写和调用了什么函数
若你没有声明拷贝构造函数，赋值操作符函数和析构函数，C++编译器将会自动声明默认版本，并且修饰符都是public和inline，也就是说语句`class Empty{};`相当于
```cpp
class Empty {
    public:
        Empty() {...}
        Empty(const Empty& rhs) {...}
        ~Empty() {...}
        Empty& operator=(const Empty&rhs) {...}
};
```
语句`Empty e1; Empty e2(e1); e2 = e1;`会各自调用以上函数；那这些编译器生成的函数又干了什么事情？默认的构造函数和析构函数主要让编译器实现“幕后”代码比如基类的构造函数和析构函数，以及非static数据成员的构造，**注意默认生成的析构函数不是virtual的，除非基类中声明为virtual**，而默认和拷贝构造函数和赋值操作符函数仅仅复制每个非static数据成员，如下所示
```cpp
template<typename T>
class NamedObject {
    public:
        NamedObject(const char* name, const T& value);
        NamedObject(const std::string& name, const T& value);
        ...
    private:
        std::string nameValue;
        T objectValue;
};
```
以上代码声明了NamedObject的构造函数但没有复制构造和赋值，编译器会自动生成这些函数，所以当遇到`NamedObject<int> no1("Smalltes Prime Number", 2); NamedObject<int> no2(no1);`时，编译器自动生成的复制构造函数使用no1.nameValue和no1.objectValue分别初始化no2.nameValue和no2.objectValue，由于nameValue的类型为string，调用string的复制构造函数，以no1.nameValue为参数来初始化no2.nameValue，另一方面`NamedObject<int>::objectValue`类型为int，no2.objectValue的值通过no1.objectValue按位复制   
编译器生成的赋值操作符函数和这类似，但是产生的代码合法有意义时才能通过，否则编译器拒绝自动生成operator=函数，比如
```cpp
template<typename T>
class NamedObject {
    public:
        NamedObject(std::string &name, const T& value);
        ...
    private:
        std::string& nameValue;
        const T objectValue;
};

std::string newDog("Persephone");
std::string oldDog("Satch");
NamedObject<int> p(newDog, 2);
NamedObject<int> s(oldDog, 36);
p = s;
```
在赋值之前p.nameValue和s.nameValue是不同string对象的引用，那赋值操作符该怎么修改p.nameValue?让p.nameValue引用指向和s.nameValue相同的对象(引用自身的修改)?但是C++不允许引用改变指向对象；修改p.nameValue引用对象值?又会影响其他指向newDog的指针或引用。为此，C++拒绝编译代码，而你需要自己显式地提供赋值操作符函数，**最后还要注意基类声明赋值操作符函数为private，而派生类没显式提供赋值操作符函数的话编译器也会报错，因为编译器生成代码没法调用基类赋值操作符函数**

:::tip 总结
编译器可能会隐式地生成构造函数，析构函数，复制构造函数和赋值操作符函数
:::

## Item6:明确禁止不想要的编译器自动生成函数
假设有表示待售房产的类HomeForSale，实际情况下每个房产都应该是独一无二的，所以复制HomeForSale对象意义不大
```cpp
class HomeForSale {...};
HomeForSale h1;
HomeForSale h2;
HomeForSale h3(h1);     // 不应该复制
h1=h2;                  // 不应该赋值
```
通过不想类支持某个功能不要声明提供这个功能的函数即可，但是这对复制构造函数和赋值操作符不成立，因为不声明的话编译器也会自动生成；解决这个问题的突破口是编译器自动生成的函数是public的，**通过显式地声明为private**，阻止编译器生成版本并且该函数在类体外无法被调用，但是其他成员函数和友元函数仍然可以调用，解决方案是**只声明，不定义**
```cpp
class HomeForSale {
    public:
        ...
    private:
        ...
        HomeForSale(const HomeForSale&);
        HomeForSale& operator=(const HomeForSale&);
};
```
如此定义的类，编译器会阻止HomeForSale类的拷贝，如果在友元函数或成员函数中调用会引起链接器报错；实际上，还可以把链接时报错提前至编译时，做法是声明复制构造函数，赋值操作符函数都为private的基类，然后让HomeForSale类继承它
```cpp
class Uncopyable {
    protected:
        Uncopyable() {}
        ～Uncopyable() {}
    private:
        Uncopyable(const Uncopyable&);
        Uncopyable& operator=(const Uncopyable&);
};

class HomeForSale: private Uncopyable {
    ...
};
```
Uncopyable类的实现和使用也有些微妙之处，比如继承限定符是private而不是public的，基类析构函数没有声明为virtual(因为它不含数据成员)，实际上Boost库提供了相似的类noncopyable

:::tip 总结
为了禁止编译器自动生成函数的使用，将对应的成员函数声明为private并不给出实现，或者使用类似Uncopyable的基类
:::

## Item7:声明多态基类中的析构函数为virtual
假设有以下TimeKeeper基类及其派生类用于计时
```cpp
class TimeKeeper {
    public:
        TimeKeeper();
        ~TimeKeeper();
        ...
};

class AtomicClock: public TimeKeeper {...};
class WaterClock: public TimeKeeper {...};
class WristClock: public TimeKeeper {...};
```
继承类对象不需要只要计时的实现细节，只需要一个返回基类指针的工厂函数`TimeKeeper* getTimeKeeper();`，按照工厂函数的约定，getTimeKeeper函数的返回对象在堆上创建，为了避免内存泄露，返回的对象需要删除
```cpp
TimeKeeper* ptk = getTimeKeeper();
...
delete ptk;
```
问题在于getTimeKeeper返回派生类对象(如AtomicClock)的指针，该对象通过基类指针(TimeKeeper*)删除，并且该基类的析构函数不是virtual的，C++对这种情况处理是未定义的，典型的结果是对象基类部分被销毁但是对象的派生类部分不会被销毁，形成一个“部分销毁”的对象，造成内存泄露。解决的方法很简单：声明基类的析构函数为virtual的，这样删除派生类对象会将包括派生类部分的整个对象彻底销毁：
```cpp
class TimeKeeper {
    public:
        TimeKeeper();
        virtual ~TimeKeeper();
        ...
};
TimeKeeper* ptk = getTimeKeeper();
...
delete ptk;
```
当类不包含虚函数时，暗示着它不会作为基类继承，这种情况下声明析构函数为virtual会带来问题，如下所示：
```cpp
class Point {
    public:
        Point(int xCoord, int yCoord);
        ~Point();
    private:
        int x, y;
};
```
如果int是32位的话，一个Point对象恰好适合一个64为寄存器，进一步地，该对象以64位大小被传给其他语言C，FORTRAN编写的函数，但是Point的析构函数为virtual的话情况就不一样了。虚函数的实现需要对象在运行时提供该调用虚函数的信息，这个通常由一个虚函数表指针`vptr`实现，该指针指向虚函数表`vtbl`，实际调用时由vptr找到vtbl然后在表中搜索对应的函数指针。如果Point类包含虚函数，Point对象的大小将增加，在32位架构上会由64位(32*2)增加到96位(64+32)，在64位架构上会由64位增加到128位(64+64)，Point对象再也不能刚好放到64位寄存器中。  
但是把所有析构函数声明为virtual和都不声明virtual一样都是错误的，总结的经验是**当某个类至少包含一个虚函数时，将其析构函数声明为virtual的**  
某些情况下，即使在没有虚函数情况下也会出现问题，比如标准库string类没有任何虚函数，但是有些程序员就是要拿它当基类使：
```cpp
class SpecialString: public std::string {
    ...
};

SpecialString* pss = new SpecialString("Impending Doom");
std::string *ps;
ps = pss;
delete ps;
```
一开始看上去没什么问题，但当把派生类对象指针(SpecialString\*)强制转换为基类指针(std::string\*)并对基类指针使用delete，又回到了之前的问题。不幸的是，C++没有提供类似Java的final类或者C#的sealed类的阻止继承的机制，所以最好不要继承析构函数非virtual的类。有些时候当你想要一个虚基类，但是又没有其他的纯虚函数，可以把析构函数函数声明为纯虚函数：
```cpp
class AWOV {
    public:
        virtual ~AWOV() = 0;
};
```
但是这里必须要给析构函数提供定义：`AWOV::~AWOV() {}`，因为派生类的析构过程先调用派生类析构函数在调用基类构造函数，编译器会生成~AWOV()的调用，没有定义的话连接器会报错。  
声明基类析构函数为virtual的规则只适用于多态的基类(通过基类接口操作派生类对象)，但并不是所有基类都是为多态而设计的，有些比如std::string类，STL容器类等根本不是为了基类而设计，更不必说多态，而前面提到的Uncopyable类作为基类不是为了通过基类接口操控派生类对象，所以不需要声明析构函数为virtual

:::tip 总结
多态虚基类或者包含虚函数的类应该声明析构函数为virtual的；不是为基类或者多态而设计的类不应该声明析构函数为virtual的
:::

## Item8:阻止异常离开析构函数
C++并不禁止析构函数抛出异常，但是实际上会有问题，如下所示的Widget类：
```cpp
class Widget {
    public:
        ...
        ~Widget() {...}     // 假设这里的代码会抛出异常
};

void doSomething() {
    std::vector<Widget> v;
    ...
}
```
当销毁v时，假设第一个Widget对象的析构函数出现异常，剩下的对象中有出现析构异常，同时出现两个异常导致程序终止或者未定义行为，这里是未定义行为；过早的程序终止或者未定义行为都会导致析构函数出现异常，C++并不喜欢抛出异常的析构函数！那析构函数确实会有抛出失败异常的代码怎么办，比如：
```cpp
class DBConnection {
    public:
        ...
        static DBConnection create();
        void close();
};
```
为了确保每个DBConnection对象都调用close()，一种做法是为DBConnection类创建一个资源管理类，该类的析构函数调用close()函数，如下所示：
```cpp
class DBConn {
    public:
        ...
        ~DBConn() { db.close(); }
    private:
        DBConnection db;
};
// Usage
{
    DBConn dbc(DBConnection::create());
    ...
}               // 离开块dbc对象销毁自动调用DBConnection类的析构函数
```
只要close()方法调用成功这没问题，但是如果调用产生异常，DBConn类析构函数向上抛出这个异常，可以使用两个方法处理这个问题：
- 通过调用`abort()`终止程序
```cpp
DBConn::~DBConn(){
    try{ db.close(); }
    catch(...){
        日志记录close调用失败
        std::abort();
    }
}
```
- 独自咽下，一声不吭
```cpp
DBConn::~DBConn(){
    try{ db.close(); }
    catch(...){
        日志记录close调用失败
    }
}
```

但这两个方法都没有如实地反映close()调用出现了问题，一个更好的方法是重新设计DBConn类的接口，让使用它的代码能够处理抛出的异常
```cpp
class DBConn {
    public:
        ...
        void close(){
            db.close();
            closed = true;
        }
        ~DBConn() {
            if(!closed) {
                try{
                    db.close();
                }catch(...){
                    日志记录close调用失败
                }
            }
        }
    private:
        DBConnection db;
        bool closed;
};
```
这种做法看起来代码更复杂了：DBConn的close方法调用db.close()方法又在析构函数中再次调用db.close()方法；这样设计的目的在于让可以用户选择通过调用DBConn::close()方法处理异常，如果用户认为关闭数据库连接不会出现异常而不调用DBConn::close()，那就由析构函数来关闭，可能出现的异常由用户自己负责，这是他们自己选的

:::tip 总结
析构函数永远不要抛出异常，如果析构函数中调用的函数抛出异常，析构函数应该捕获这个异常，永远不能让异常离开析构函数；如果需要处理某个类操作可能抛出的异常，应该在常规的类方法而不是析构函数中实现这个操作
:::

## Item9:永远不要在构造/析构函数中调用虚函数
假设有个建模股票交易的类，交易的审计十分重要，所以每次创建一个交易对象，审计日志就要新增一条，代码可以如下所示：
```cpp
class Transaction {
    public:
        Transaction();
        virtual void logTransaction() const = 0;
    ...
};

Transaction::Transaction() {
    ...
    logTransaction();
}

class BuyTransaction: public Transaction {
    public:
        virtual void logTransaction() const;
    ...
};

class SellTransaction: public Transaction {
    public:
        virtual void logTransaction() const;
};
```
以上声明的类在使用会出现问题，`BuyTransaction b;`调用派生类BuyTransaction的构造函数，该构造函数首先调用基类Transaction的构造函数，而基类的构造函数调用了纯虚函数logTransaction()，此时这个虚函数是基类版本的还是派生类版本的呢？很遗憾是基类版本的，尽管一开始是构造派生类对象，但是**在基类构造中，虚函数永远不会进入派生类的范畴**，理由是基类构造完后开始初始化派生类部分成员，如果此时调用的是派生类版本的虚函数，该函数通常都会调用未初始化的成员变量，这种做法是危险的，实际上派生类的基类构造时，“对象”的类型会被视为基类，既然派生类部分都没初始化，就当它们不存在；同样的理由适用于析构函数，派生类的析构函数运行开始运行后，对象的派生类部分不再有效，所以C++视它们不存在，一旦进入基类析构函数，对象就变成基类对象，所有的C++虚函数，dynamic_cast，typeid等都会如此看待对象  
对于上述代码，有些编译器可能会警告在构造/析构函数中调用虚函数，但是检测这种行为往往并不容易，比如把虚函数封装在一个非virtual的初始化函数init中：
```cpp
class Transaction {
    public:
        Transaction() { init(); }
        virtual void logTransaction() const = 0;
        ...
    private:
        void init() {
            ...
            logTransaction();
        }
};
```
处理这个问题的方法有很多，一个就是把logTransaction()函数转为非virtual的，然后要求派生类构造函数将必要的日志信息传递个基类构造函数，也就是说，既然不能在基类构造过程中调用虚函数，你可以让派生类传递足够的信息给基类构造函数来补偿
```cpp
class Transaction {
    public:
        explicit Transaction(const std::string& logInfo);
        void logTransaction(const std::string& logInfo) const;
        ...
};
Transaction::Transaction(const std::string& logInfo) {
    ...
    logTransaction(logInfo);
}

class BuyTransaction: public Transaction {
    public:
        BuyTransaction(parameters)
        : Transaction(createLogString(parameters)){ ... }
        ...
    private:
        static std::string createLogString(parameters);
};
```
注意这里将帮忙的函数createLogString声明为static的，这样不会引用还没初始化完全的初期BuyTransaction对象的成员数据(static方法只能访问static类成员)，毕竟前面问题的关键点就是虚函数可能会调用还没初始化的成员数据

:::tip 总结
不要在构造函数或者析构函数中调用虚函数，因为这样的调用永远不会进入派生类的范畴，而是在当前的构造/析构函数范围
:::

## Item10:赋值操作符函数返回*this引用
赋值操作符有两个特性，一是可以像`x=y=z=25;`这样串起来写，二是右结合性的，即`x=y=z=25`等价于`x=(y=(z=25))`，要想类也能达到这种效果，方法是实现赋值操作符函数时返回引用：
```cpp
class Widget {
    public:
        Widget& operator=(const Widget& rhs) {
            ...
            return *this;
        }
        Widget& operator+=(const Widget& rhs) {     // 也适用于-=, *=等操作符
            ...
            return *this;
        }
        Widget& operator=(int rhs) {        // 参数不是常规的类也行
            ...
            return *this;
        }
};
```
:::tip 总结
如果没有特别的理由，让赋值操作符函数返回*this引用
:::

## Item11:处理操作符=赋值给自己的情况
可能会出现这么一种情况
```cpp
class Widget { ... };
Widget w;
w = w;
```
这样的代码看起来很傻，但放心会有人这样做，而且有些自赋值并不是这样显式的，比如`a[i]=a[j]`中i和j相同，`*px=*py`中指针px，py实际上指向同一对象，这些都是由别名(aliasing)引起的：对象有不止一个引用；另外，即使是声明类型不同的两个对象，但是类型存在继承关系，实际上也有可能是同一对象：
```cpp
class Base{ ... };
class Derived: public Base { ... };
void doSomething(const Base& rb, Derived* pd);  // rb和*pd可能是同一对象
```
当你遵循Item13,14，使用对象管理资源，并保证复制时完美工作，但如下所示的代码可能会出现出现自赋值安全和异常安全的问题
```cpp
class Bitmap {...};
class Widget {
    private:
        Bitmap *pb;
    ...
};

Widget& Widget::operator=(const Widget& rhs){
    delete pb;
    pb = new Bitmap(*rhs.pb);
    return *this;
}
```
如果rhs和*this是同一对象的话，`delete pb`不仅删除了当前对象的bitmap，也删除了rhs的bitmap，最后的结果是本来不应该改变的Widget对象的pb指针指向已经删除的bitmap对象(野指针)，防止该错误的传统方法是通过身份测试检查是否赋值给自己
```cpp
Widget& Widget::operator=(const Widget& rhs) {
    if(this == &rhs)
        return *this;
    delete pb;
    pb = new Bitmap(*rhs.pb);
    return *this;
}
```
以上的方法仅仅是解决自赋值的问题，但是没有解决异常安全问题：如果new Bitmap出现异常，最后pb还是个野指针；幸运地是，如下所示代码能够解决异常安全问题还能顺带解决自赋值问题，结果就是人们通常忽略自赋值问题而专注于异常安全
```cpp
Widget& Widget::operator=(const Widget& rhs) {
    Bitmap *pOrig = pb;         // 事先记下原来指针
    pb = new Bitmap(*rhs.pb);   // pb指向新对象
    delete pOrig;               // 删除旧对象                  
    return *this;
}
```
如果new抛出异常，pb和Widget对象内部保持不变；如果是自己赋值给自己，上述代码对原来的bitmap进行拷贝然后删除原来的bitmap，虽然效率不是最好但起码有效解决了问题。另外一种能够同时实现自赋值安全和异常安全的方法是“复制后交换”(copy and swap)，代码如下所示：
```cpp
class Widget {
    void swap(Widget &rhs);
    ...
};

Widget& Widget::operator=(const Widget& rhs) {
    Widget temp(rhs);
    swap(temp);
    return *this;
}

Widget& Widget::operator=(Widget rhs) {     // 通过值传递的swap
    swap(rhs);
    return *this;
}
```
:::tip 总结
处理好operator=自赋值问题，解决方法包括相同测试，改变语句顺序和拷贝后交换；确保任何处理两个以上对象的函数能够正确应对这些对象是同一个对象的情况
:::

## Item12:拷贝对象的所有内容
我们将复制构造函数和拷贝赋值操作符函数统称为拷贝函数，考虑如下所示代码：
```cpp
void logCall(const std::string& funcName);

class Customer {
    public:
        ...
        Customer(const Customer& rhs);
        Customer& operator=(const Customer& rhs);
    private:
        std::string name;
};
Customer::Customer(const Customer& rhs): name(rhs.name) {
    logCall("Customer copy constructor");
}
Customer& Customer::operator=(const Customer& rhs) {
    logCall("Customer copy assignment operator");
    name = rhs.name;        // 这里能够直接访问rhs的私有成员？
    return *this;
}
```
看上去没什么大问题，但是如果Customer新增了新的数据项，那么现有的拷贝函数就变成了部分拷贝(partial copy)，**而且这个时候编译器不会告诉你少拷贝了一项数据**，你需要更新所有拷贝函数的代码
```cpp
class Date { ... };
class Customer {
    public:
        ...     // 不变
    private:
        std::string name;
        Date lastTransaction;       // 新增数据项
};
```
部分拷贝潜在的问题可以通过继承体现：
```cpp
class PriorityCustomer: public Customer {
    public:
        ...
        PriorityCustomer(const PriorityCustomer& rhs);
        PriorityCustomer& operator=(const PriorityCustomer& rhs);
    private:
        int priority;
};
PriorityCustomer::PriorityCustomer(const PriorityCustomer& rhs)
: priority(rhs.priority) {
    logCall("PriorityCustomer copy constructor");
}
PriorityCustomer& PriorityCustomer::operator=(const PriorityCustomer& rhs) {
    logCall("PriorityCustomer copy asignment operator");
    priority = rhs.priority;
    return *this;
}
```
在复制构造函数中，只初始化了派生类的成员priority，没有提到基类的复制构造，此时会调用基类的默认构造函数来初始化；在赋值操作符中也没有提到基类部分，因此基类部分保持不变。在编写派生类的拷贝函数时，任何时候都要记住拷贝基类部分，基类部分通常是私有的，因此只能通过调用相对应的基类方法来实现：
```cpp
PriorityCustomer::PriorityCustomer(const PriorityCustomer& rhs)
: Customer(rhs),                // 显式调用基类复制构造函数
priority(rhs.priority) {
    logCall("PriorityCustomer copy constructor");
}
PriorityCustomer& PriorityCustomer::operator=(const PriorityCustomer& rhs) {
    logCall("PriorityCustomer copy asignment operator");
    Customer::operator=(rhs);           // 显式调用基类赋值操作符函数
    priority = rhs.priority;
    return *this;
}
```
以上例子中，两种拷贝函数都有着相似的行为(调用logCall函数)，但是不要尝试通过其中一个函数来调用另一个函数来减少代码重现，赋值操作符函数针对已经存在的对象，根据传入参数的内容改变对象内容，复制构造函数根据传入参数的内容构造相同内容的对象，一个是对象已经存在，一个是构造还未存在的对象，两者的性质完全不同，如果双方有相似的代码可以通过封装为第三方函数供拷贝函数调用

:::tip 总结
拷贝函数应该拷贝对象的所有数据成员和及其基类部分；不要用复制构造函数来实现赋值操作符函数或者反过来，把相同的拷贝操作放在第三个函数中供调用
:::