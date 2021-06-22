---
layout: article
title: C++中的代码重用
permalink: /C++-Primer-Plus-Note/chap14
sidebar:
    nav: cpp-reading-notes
tags: C++ ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十四章读书笔记
:::

## 包含对象成员的类
对于has-a关系使用组合，也就是类包含另一种类对象成员来实现
- 初始化被包含的对象在成员初始化列表中使用成员名，被继承的基类在初始化列表中使用类名
- 初始化列表中项目被初始化的顺序是**其被声明的顺序**，而不是在初始化列表中的顺序
- 被包含对象的接口不是公有的，但可以在类方法中使用

## 私有继承
私有继承是另一种实现has-a关系的方法，基类的公有成员和保护成员都将会称为派生类的私有成员，使用组合将对象作为命名的成员添加到类中，使用私有继承将对象作为匿名的继承对象添加到类中，使用术语子对象(subobject)描述通过继承或者包含添加的对象
```cpp
class Student: private std::string, private std::valarray<double>{
    public:
    ...
};
```
这种使用多个基类的继承被称为多重继承(Multiple Inheritance, MI)，后面会提到它所导致的问题和解决方案  
对于继承类，新的构造函数使用类名来初始化对象，`ArrayDb`是`std::valarray<double>`的别名
```cpp
Student(const char *str, const double *pd, int n):std::string(str), ArrayDb(pd, n){}
```
访问基类的方法使用类名加作用域解析操作符
```cpp
double Student::Average() const{
    if(ArrayDb::size() > 0)
        return ArrayDb::sum()/ArrayDb::size();
    else
        return 0;
}
```
使用强制类型转换来访问继承的内存对象
```cpp
const string & Student::Name() const {
    return (const string &) *this;
}
```
访问基类的友元函数不能使用类名加作用域操作符来调用，因为友元不属于基类，可以通过显示转换为基类来调用
```cpp
ostream & operator<<(ostream &os, const Student &stu){
    os<<"Scores for"<<(const string &)stu<<":\n";
    ...
}
```
引用stu不会自动转换为string引用，根本原因是在私有继承中，在不进行显式类型转换的情况下，不能将派生类引用或指针赋值给基类引用或指针，即使是用公有继承，也必须使用显式转换，否则`cout<<stu`将会产生递归调用
```cpp
ostream & operator<<(ostream &os, const Student &stu){
    os<<"Scores for"<<stu<<":\n";       //递归调用
    ...
}
```
另外一个原因是由于使用多重继承，若两个基类都是提供了`operator<<()`方法，则会造成二义性

## 保护继承
保护继承是私有继承的变体，基类的公有成员和保护成员称为派生类的保护成员
```cpp
class Student: protected std::string, protected std::valarray<double>
{
    ...
};
```
使用私有继承，第三类不能使用基类的接口，使用保护继承，基类的公有方法在第二代中为protected，在第三代派生类中可以使用，可以通过using重新定义访问权限
```cpp
class Student: private std::string, private std::valarray<double> {
    public:
        using std::valarray<double>::min;
        using std::valarray<double>::max;
    ...
};
```
上述using声明使得`valarray<double>::min`和`valarray<double>::max`可用，就像是Student类的公有方法，即使是私有继承，注意这里的using声明只使用成员名，没有圆括号，函数特征标和返回类型，这意味着将会导入重载方法的所有版本

## 多重继承
考虑这么一种情况：Singer类和Waiter类继承自Worker类，而SingingWaiter类多重继承Singer类和Waiter类，此时SingingWaiter对象将包含两个Worker子对象，这将引起问题，比如
```cpp
SingingWaiter sw;
Worker *pw = &sw;
```
将会产生二义性，因为sw中有两个Worker子对象，即有两个Worker地址，所以需要使用类型转换来指定：
```cpp
Worker *pw1 = (Waiter *)&sw;
Worker *pw2 = (Waiter *)&sw;
```
实际上应该只包含一个Wroker子对象，为此C++引入虚基类的概念。虚基类使得从多个类中(它们的基类相同)派生出的对象只继承一个基类对象，通过在类声明中使用关键字virtual(virtual和public的位置次序无关紧要)
```cpp
class Singer: virtual public Worker {...};
class Waiter: public virtual Worker {...};
```
- 继承虚基类的构造函数，为了避免冲突，基类是虚拟的时，C++禁止通过中间类来构造基类，以下代码的第一个例子wk是不会被传递给子对象Worker，此时等同于调用Wroker函数默认构造函数`Worker()`，而第二个例子是正确的，虽然看起来有点问题，但在虚基类情况下必须这么写，非虚基类用第一个例子
```cpp
SingingWaiter(const Worker &wk, int p = 0, double d = 0):Waiter(wk, p), Singer(wk, v){}     //Error
SingingWaiter(const Worker &wk, int p = 0, double d = 0):Worker(wk), Waiter(wk, p), Singer(wk, v){} //Correct
```
- 调用方法，多重继承可能导致函数调用的二义性，比如SingingWaiter类从Singer类和Waiter类都继承了working()方法，但是SingingWaiter.working()不知道调用哪个方法，此时可以使用`::`来表明意图，更好的办法是在SingingWaiter中重新定义
```cpp
SingingWaiter hire("kayhaw", 2010, 6);
hire.Singer::working();
// or
void SingingWaiter::working(){
    Singer::working();
}
```
- 当类通过多条虚拟途径和非虚拟途径继承某个特定的基类时，该类将包含一个表示所有的虚拟途径的基类子对象和分别表示各个条非虚拟途径的多个基类子对象
- 使用非虚拟的多继承使用成员名未加类名限定将会导致二义性
- 使用虚基类**不一定**会导致，当某个名称优先于其他所有名称时(派生类中的名称优先于直接或者间接祖先类中的相同名称)，不使用限定符直接用不会导致二义性
- **虚拟二义性规则与访问规则无关**，即使working()方法在Singer类中是私有的，直接hire.working()也会导致二义性

## 类模板
以栈模板为例，类声明和类体外的方法定义都要加上`template <typename T>`，正常方法定义中的类名限定`Stack::`变为`Stack<T>::`
```cpp
template <typename T>
class Stack{
    private:
        enum {MAX=10};
        T items[MAX];
        int top;
    public:
        Stack();
        bool isempty();
        bool isfull();
        bool push(const T &item);
        bool pop(T &item);
}; 

template <typename T>
Stack<T>::Stack(){
    top = 0;
}

template <typename T>
bool Stack<T>::isempty(){
    return 0 == top;
}

template <typename T>
bool Stack<T>::isfull(){
    return MAX == top;
}

template <typename T>
bool Stack<T>::push(const T & item){
    if(top < MAX){
        items[top++] = item;
        return true;
    }
    else
        return false;
}

template <typename T>
bool Stack<T>::pop(Type & item){
    if(top > 0){
        item = items[--top];
        return true;
    }
    else
        return false;
}
```
模板不仅只包含类型参数`typename T`，也可以有非类型参数(表示式参数)，即可以有`template <typename T, int len>`，但是表达式参数有以下限制
- 表达式参数只能是整型，枚举，引用或者指针，float和double是不合法的
- 模板代码不能修改参数的值，也不能使用参数地址，即`++len`和`&len`是不合法的
- 在实例化时传给表达式参数的值必须是常量表达式

可以将用于常规类的技术用于模板类，模板类可以作为基类，组件类，甚至作为其他模板类的类型参数(嵌套模板具体化`Array < Stack<int> > asi`中，需要使用空格区分>>操作符)，模板的使用有以下几点：
- 可以递归具体化模板，`Array< Array<int, 5>, 10 >dp;`等价于`int dp[10][5];`
- 可以使用多个类型参数，`template<typename T, typename S>...`
- 可以为类型参数提供默认值，`template<typename T, typename S=int>...`
- 类模板类型参数可以有默认值，**函数模板不行**，**非**类型参数提供默认值两者都可以

模板的具体化：
- 隐式实例化：如`Stack<int> stk;`，编译器在需要对象之前，不会生成类的隐式实例化
- 显式实例化：当**使用关键字template**并指出所需类型来**声明**类时，编译器将生成显式实例化，`template class Stack<int>;`将`Stack<int>`声明为一个类，虽然没有创建对象，但是编译器将会生成类声明和方法定义
- 显示具体化：针对特定的类型，能在实例化时对模板进行修改
```cpp
template <> class Stack<char*> {...};
template <> class Stack<char*>{         //为特殊的char*类型重新提供定义
    ...
}
```
- 部分具体化：对多个类型参数之一进行限定，在多个模板可选下，编译器选择具体化程度最高的模板
```cpp
template <typename T, typename S> class Pair {...};     //通用模板
template <class T> class Pair<T, int> {...};            //部分具体化
template <> class Pair<int, int> {...};                 //显示具体化
Pair<double, double> p1;
Pair<double, int> p2;
Pair<int, int> p3;
```

## 成员模板
模板可以作为结构，类或者模板类的成员
```cpp
template <typename T>
class beta {
    private:
        template <typename V>
        class hold{
            private:
                V val;
            public:
                hold(V v=0):vak(v){}
                void show() const {std::cout<<val<<std::endl;}
                V Value() const {return val;}
        };
        hold<T> q;
        hold<int> n;
    public:
        beta(T t, int i):q(t), n(i) {}
        template<typename U> U blab(U u, T t) {return (n.Value()+q.Value())*u / t;}
        void Show() const {q.hsow(); n.show();}
};

// 类体外定义
template <typename T>
    template<typename U>
    U beta<T>:blab(U u, T t){
        return (n.Value()+q.Value())*u / t;
    }
```

## 模板类和友元
模板的友元分为3类：
- 非模板友元，可以使用模板类型参数
```cpp
template <typename T>
class HasFriend{
    friend void counts(HasFriend<T> &);
};
friend count(HasFriend<T> &hf);
friend count(HasFriend<int> &hf);
friend count(HasFriend<double> &hf);
```
- 约束模板友元，友元类型取决于模板类实例化的类型，在类声明前面声明友元
```cpp
template <typename T> void counts();
template <typename T> void report(T &);
template <typename TT>
class HasFriend{
    friend void counts(TT)();
    friend void report<> (HasFriend<TT> &)
};
template <typename T> void counts() {...}
template <typename T> void report(T &hf) {...}
```
- 非约束模板友元，友元的所有具体化都是模板类每个具体化的友元，在类声明中声明友元
```cpp
template <typename T>
class ManyFriend {
    template <typename C, typename D> friend void show(C &, D &);
};
```