---
layout: article
title: 类继承
permalink: /C++-Primer-Plus-Note/chap13
sidebar:
    nav: cpp-reading-notes
tags:
  - C++
  - ReadingNotes
---
:::info
《C++ Primer Plus》中文版第十三章读书笔记
:::

## 一个简单的基类
从一个类派生出另一个类时，原始类称为基类，继承类统称为派生类，我们声明定义一个简单的基类Person：
```cpp
class Person {
    private:
        int age;
        string name;
    public:
        Person(int age, string name):age(age), name(name){}
        ~Person(){}
        int howold(void) {return age;}
        string getname(void) {return name;}
};
```
由Person派生出Student类的声明:
```cpp
class Student: public Person {
    private:
        int score;
    public:
        Student(int age, string name, int score):Person(age, name),score(score){}
        ~Student(){}
};
```
冒号指出Person是Student类的基类，修饰符public表示从Person类公有派生出Student，使得Person类的公有成员称为派生类的公有成员，基类的私有部分也将成为派生类的一部分，但是只能通过基类的公有和保护方法访问。  
创建派生类对象时，程序首先创建基类对象，**这意味着基类的构造函数应在派生类构造函数之前进行，C++使用成员初始化列表句法来完成这种工作**，如上所示的，若成员初始化列表为空，等同于`Student(int age, string name, int score):Person()`，即调用默认的构造函数

## 派生类和基类的关系
- 派生类可以使用基类的非私有方法
- 基类**指针/引用**可以在不进行显示类型转换的情况下指向派生类，此时只能调用基类方法
- 以上反向不成立，即不能将基类对象和地址赋给派生类引用和指针
- 这意味者参数为基类引用或者基类指针的函数可以传入继承类作为实参

## 继承：is-a关系
C++有公有继承，保护继承，私有继承3种方式，公有继承建立is-a关系，即派生类也是一个基类，所有对基类进行的操作也都可以对派生类对象执行
- 公有继承不建立is-like-a关系，人们比喻老师是蜡烛，但不能从Candle类派生出Teacher类，继承只能在基类的基础上添加属性，但不能删除基类属性
- 公有继承不建立is-implemented-as-a关系，可以用数组实现堆栈，但是从Array类派生出Stack类是不合理的，**应该让堆栈包含Array对象成员**实现has-a关系
- 公有继承不建立uses-a关系，例如计算机使用打印机，但是从Computer类派生出Printer类是没有意义的，可以使用**友元函数**处理对象之间的通信

## 多态公有继承
若希望同一个方法在派生类和基类中的行为是不同，即**多态**，有两种方式实现多态公有继承：
- 在派生类中重新定义基类的方法
- 使用虚函数

我们分别使用这两种方式演示，如下代码所示
```cpp
class Person {
    private:
        int age;
        string name;
    public:
        Person(int age, string name):age(age), name(name){}
        virtual ~Person(){}
        int howold(void) {return age;}
        string getname(void) {return name;}
        void sayhello(void){std::cout<<"hello";};
        virtual saygoodbye(void);
};

class Student: public Person {
    private:
        int score;
    public:
        Student(int age, string name, int score):Person(age, name),score(score){}
        ~Student(){}
        void sayhello(void){std::cout<<"Hello, my name is"<<name;}
};

Person a("kayhaw", 24);
Student b("hawkay", 24);

a.sayhello();
b.sayhello();
```
派生类和基类都定义声明了sayhello()方法，但是不同的对象调用时，根据对象所属的类进行调用，a是Person类就调用Person的sayhello()方法，b是Student类就调用Student类的sayhello()方法，这是最简单的子类重写?，而虚函数saygoodbye的情况更为复杂，**如果virtual方法是通过引用或者指针而不是对象调用，程序将根据引用或者指针指向的对象的类型来选择方法，非virutal方法根据引用类型或者指针类型选择方法**，总结就是:
1. 加了virtual声明为虚函数
2. 引用或者指针调用

**两个条件缺一不可**

- 基类的虚方法在派生类中自动成为虚方法，也可以在类声明
- 被继承的基类析构函数声明为virtual，这是为了正确释放内存的惯例
- virtual关键字只用于类方法声明的原型中，而没用用于方法定义中
- 派生类使用初始化语句来调用基类构造函数
- 派生类在基类方法的基础中添加行为，使用作用域解析操作符来调用基类方法，然后实现自己的行为

为什么需要声明析构函数为virtual？不加virtual，指针/引用表示什么类型，调用相应类型的析构函数，而常用基类指针引用指向派生类对象，导致派生类部分的数据未被析构，加了virtual后，调用实际上的派生类对象的析构函数，然后会自动调用基类的析构函数，此时所有数据都被正确析构。**所以确定会被继承的类，应该声明它的析构函数为virtual**

## 静态联编和动态联编
将源代码中的函数调用解释为执行特定的函数代码称为函数名联编，在C语言中中每个函数名都只对应一个不同的函数，在C++中由于函数重载，编译器需要查看函数名和函数参数才能确定使用哪个函数，在编译过程中就可以确定联编的称为静态(早期)联编，在运行过程中才确定的联编称为动态(晚期)联编
- 编译器对**非虚函数使用静态联编**，即直接根据指针或者引用的类型来调用方法
- 编译器对**虚函数使用动态联编**，即根据指针或者引用表示的实际对象类型来调用方法

## 虚函数注意事项
- 构造函数不能是虚函数
- 析构函数应该是虚函数
- 友元函数不能是虚函数，因为友元不是类成员，可以通过让友元函数使用虚函数实现设计
- 派生类没有重新定义，则使用函数的基类版本，派生类位于派生类中，使用最新的虚函数
- **重新定义将会隐藏方法**，如下代码所示，编译可能会出现警告，**重新定义不会生成函数的两个重载版本，而是隐藏了string参数的基类版本**，简而言之，重新定义继承的方法不是重载
```cpp
class Person{
    public:
        virtual void speak(string a) const;
    ...
};
class Student: public Person {
    public:
        virtual void speak(int a) const;
    ...
};
```

由上例子总结，如果重新定义继承的方法，应该做到以下几点：
- 确保函数原型完全相同
- 函数**返回类型**是基类指针或者引用时可以改为派生类的指针或引用，此例外不适用于**参数**
- 函数在基类中有多个重载版本，派生类应该重新定义**所有**的基类版本，否则**唯一重新定义的版本将覆盖其它版本**
```cpp
class Person{
    public:
        virtual void speak(string a) const;
        virtual void speak(double a) const;
        virtual void speak(int a) const;
    ...
};
class Student: public Person {
    public:
        virtual void speak(string a) const;
        virtual void speak(double a) const;
        virtual void speak(int a) const;
    ...
};
```

## 访问控制：protected
类声明中的protected部分在类外访问时等同于private，只能通过类的公有方法访问，但对于派生类来说，protected部分等同于public，但是这意味着派生类中有暴露了project部分，因此最好对**类数据成员**采用私有访问控制，而对成员函数来说，使用protected很有用

## 抽象基类
抽象基类(Abstract Base Class，ABC)是**包含至少一个纯虚函数**的类，抽象基类**不能创建对象**，只能被继承等派生类来实现它的所有纯虚函数后才能创建对象
- 通过在虚函数的结尾处加`=0`来声明纯虚函数：`virtual speak(int x)=0;`
- **抽象基类的纯虚函数可以有定义**，但是派生类还是需要实现继承的纯虚函数
- ABC理念是给出一种必须实施的规范接口

## 继承和动态内存分配
基类使用动态内存分配并重新定义赋值和复制构造函数，派生类应该注意：
- 派生类不使用new时，派生类不需要定义显式析构函数，复制构造函数和赋值操作符，使用默认的就够了
- 派生类使用了new时，派生类需要定义显式析构函数，复制构造函数和赋值操作符，并且只对自身构造函数的执行工作进行清理
```cpp
Student::Student(const Student &s):Person(s){       // 使用初始化列表调用基类复制构造函数
    ...         // 派生类自己的复制构造函数实现
}
Student & Student::operator=(const Student &s){
    Person::operator=(s);           // 使用基类的=操作符重载
    ...
}
```
对于派生类使用基类友元函数，因为友元函数不是成员函数，只能通过强制类型转换为基类来调用，而不能使用作用域解析操作符

## 类设计回顾
如果程序员没有定义，编译器会生成如下默认函数：
- 默认构造函数：默认构造函数要么没有参数，要么所有参数都有默认值
- 复制构造函数：复制构造函数以类对象作为参数，例如Person类的复制构造函数原型为`Person(const Person & p)`，以下情况使用复制构造函数
  - 新对象初始化为一个同类对象
  - 按值将对象传递个函数
  - 函数按值返回对象
  - 编译器生成临时对象
- 赋值操作符：Person类的赋值操作符原型为`Person & Person::operator=(const Person&)`，编译器生成将一种类型赋给另一种类型的赋值操作符，如希望将字符串赋给Person对象，需要显式定义`Person & Person::operator=(const char *s)`

程序员在定义类时需要注意以下几点：
1. 构造函数不能被继承
2. 析构函数最好加virtual
3. **使用一个参数**就可以调用的构造函数定义了从参数类型到类的转换，给该构造函数加上explicit可以禁止类似`Person p="kayhaw"`的隐式转换，但仍允许`Person p=Person("kayhaw")`显式转换(显式调用构造函数)
4. 传递对象引用优于按值传递对象，另外一点是基类指针/引用参数可以传入派生类对象
5. 函数返回函数中创建的临时对象时不返回引用，返回参数中的引用或指针则按引用返回对象

在使用继承时要注意：
1. 遵循is-a关系
2. 构造/析构函数不能被继承
3. 赋值操作符不能被继承，派生类对象可以赋值给基类对象
4. 基类中将方法声明为virtual表示希望派生类能够重新定义方法，但是不加virtual也无法禁止他人重新定义方法
5. 被继承基类的析构函数应该声明为virtual
6. 友元函数并非类成员，因此不能继承