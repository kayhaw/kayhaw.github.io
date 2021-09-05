---
layout: article
title: 继承和面向对象设计
permalink: /Effective-C++-Note/chap6
sidebar:
    nav: effective-c++-reading-notes
tags:
  - Effective-C++
  - ReadingNotes
  - C++
---
:::info
《Effective C++》英文第三版读书笔记第六章
:::

## Item32:确保公有继承表示“is-a”的关系
当类Derived公有继承自类Base，就相当于告诉C++编译器和用户每一个D类对象都是B类的一种，**反之不成立**，也可以说B是D更普遍的概念，D是B更特殊的概念，可以断言任何在B类的地方可以使用的地方都可以替换成D类，但是需要D类的地方不能替换成B类；如下所示：
```cpp
class Person { ... };

class Student: public Person { ... };

void eat(const Person& p);          // 每个人都可以“吃东西”
void study(const Student& s);       // 只有学生“学习”
Person p;
Student s;
eat(p);                             // ok，p是Person对象
eat(s);                             // ok，s虽然是学生，但也“是一种”人(is-a)
study(s);                           // ok，s是Student对象
study(p);                           // error! p不是Student对象
```
每个学生都是一个人，但并不是每个人都是学生，在C++中，任何接受Person类型(或者指针、引用)为参数的函数也可以接受Student对象(或者Student对象的指针，引用)，但是这仅限于公有继承(public)。公有继承就是“is-a”关系听起来很简单，但有些时候你的直觉会误导你，例如：
```cpp
class Bird {
    public:
        virtual void fly();         // 鸟可以飞
    ...
};

class Penguin: public Bird {        // 企鹅也是一种鸟
    ...
};
```
这里就有问题了，企鹅是不会飞的，这是因为语言的不准确性导致的，当我们说鸟可以飞，并不意味着所有的鸟都可以飞，只是一般来说，当我们更加准确地意识到有几种鸟是不会飞的，更贴切的代码如下所示：
```cpp
class Bird {
    ...             // 没有fly函数
};

class FlyingBird: public Bird {
    public:
        virtual void fly();
    ...
};

class Penguin: public Bird { ... };
```
这种继承体系更加切合试试，但是软件设计取决于系统要做的事情，如果系统并没有“飞”的概念，也不用刻意区分能飞/不能飞的鸟的区别，但是为了切合实际我们可以稍微的区别下，比如让Penguin使用fly时生成运行时错误：
```cpp
void error(const std::string& msg);

class Penguin: public Bird {
    public:
        virtual void fly() { error("Attemp to make a penguin fly!"); }
    ...
};
```
也会对鸟类学的知识不够充分，那么再看一种几何学中的情况：正方形类Square应该公有继承自矩形类Rectangle吗？每个人都会说“当然啊！正方形就是一种特殊的矩形(is-a)”，但是考虑以下代码：
```cpp
class Rectangle {
    public:
        virtual void setHeight(int newHeight);
        virtual void setWidth(int newWidth);

        virtual int height() const;
        virtual int width() cosnt;
    ...
};

void makeBigger(Rectangle& r) {
    int oldHeight = r.height();
    r.setWidth(r.width() + 10);
    assert(r.height() == oldHeight);
}
```
显然，断言永远不会出错，因为并没有改变高度，现在让Square类继承Rectangle类：
```cpp
class Square: public Rectangle { ... };
Square s;
...
assert(s.width() == s.height());
makeBigger(s);
assert(s.width() == s.height());        // 对于正方形来说断言必然通过
```
那么对于正方形来说断言以上代码的两个断言必然通过，但是makeBigger()只增加了宽度并没有增加高度！现在看起来逻辑正确的代码也出现了问题，关键在于**公有继承认为对基类成立的所有方法在派生类中也成立**，每个程序员都应该意识到即使代码编译通过也并不保证代码有效运行。类之间除了“is-a”的关系外，还有“has-a”(Itm38)以及“is-implemented-in-terms-of”(Item39)，确保正确使用这几种关系而不会混淆

:::tip 总结
公有继承意味着“is-a”关系，意味着所有适用于基类的同样适用于派生类
:::

## Item33:避免隐藏继承的名称
名称和继承无关，但和作用域有关，我们都知道如下所示的代码中打印的x是局部变量x而不是全局变量x，这种内部作用域覆盖外部作用域的现象称之为“阴影效应(shadow)”，
```cpp
int x;              // 全局变量x
void someFunc() {
    double x;       // 局部变量x
    std::cin>>x;
}
```
当编译器进入someFunc的范围，遇到变量名x，首先在当前作用域范围内搜索是否有名称x，因为发现的确存在局部变量x，所以就不在往更大的范围搜索，即局部变量x覆盖了全局变量x。对于继承体系来说，当我们在派生类方法中使用基类的名称时，编译器总能够找到这些名称，因为派生类从基类中继承了它们，比如：
```cpp
class Base {
    private:
        int x;
    public:
        virtual void mf1() = 0;
        virtual void mf2();
        void mf3();
    ...
};

class Derived: public Base {
    public:
        virtual void mf1();
        void mf4();
    ...
};
```
上述例子包含了私有，公有的数据成员名和方法名，方法有纯虚函数，虚函数，普通函数，这里是**什么的**名称不重要，重要的是名称本身，如下所示：
```cpp
void Derived::mf4() {
    ...
    mf2();
    ...
}
```
mf4()的实现调用了方法mf2()，编译器首先在mf4内部搜索是否有mf2()的定义，没有则接着在Derived类的声明范围内寻找，没有则在基类Base的声明范围内寻找，最后总算找到了mf2()，如果在Base中还没有mf2，则在包含Base的命名空间中寻找，还没有的话在全局范围内寻找，当然这只是个大概的过程，现在重新变化一下：
```cpp
class Base {
    private:
        int x;
    public:
        virtual void mf1() = 0;
        virtual void mf1(int);
        virtual void mf2();
        void mf3();
        void mf3(double);
    ...
};

class Derived: public Base {
    public:
        virtual void mf1();
        void mf3();
        void mf4();
    ...
};
```
这次让我们在Base中重载mf1和mf3，并为Derived添加mf3，按照覆盖规则Base中的mf1和mf3被Derived的隐藏，就好像他们从未被Derived继承一样，观察以下各种方法调用：
```cpp
Derived d;
int x;
...
d.mf1();        // OK，调用Derived::mf1()
d.mf1(x);       // Error，Base::mf1(int x)已经被隐藏
d.mf2();        // OK，调用Base::mf2()
d.mf3();        // OK，调用Base::mf3()
d.mf3(x);       // Error，Base::mf3(double x)已经被隐藏
```
可以看到，**即使基类和派生类方法的参数类型不同，是否为virtual不同，阴影效应同样适用**，就像本节一开始的例子一样，局部的double类型的x覆盖了全局int类型的x，但是如果想要继承基类的重载函数，但是公有继承都不能继承重载函数，对此解决方案是使用using声明来解除阴影效应：
```cpp
class Base {
    private:
        int x;
    public:
        virtual void mf1() = 0;
        virtual void mf1(int);
        virtual void mf2();
        void mf3();
        void mf3(double);
    ...
};

class Derived: public Base {
    public:
        using Base::mf1;        // 解除Base::mf1的覆盖
        using Base::mf3;        // 解除Base::mf3的覆盖

        virtual void mf1();
        void mf3();
        void mf4();
    ...
};
```
现在之前错误的方法调用都正常执行，这意味着**当继承的基类包含重载方法时，如果想要重新定义这些方法，必须在派生类中使用using声明解除覆盖，否则和派生类同名的方法会被覆盖**，当然你也有可能不想继承所有的基类方法，在公有继承下这种想法并不合适，因为这违背了公有继承就是“is-a”关系的原则，然而在私有继承下可以成立，如下所示：
```cpp
class Base {
    public:
        virtual void mf1() = 0;
        virtual void mf1(int);
    ...
};

class Derived: private Base {                   // 私有继承，Base的mf1在Derived中不可见
    public:
        virtual void mf1() { Base::mf1(); }     // 向前函数，使用内联函数方式实现
        ...
};
Derived d;
int x;
d.mf1();        // OK
d.mf1(x);       // Error
```
在私有继承下之前using声明解除覆盖的方法并不成立，因为私有继承的名称是private的，这里使用另一种称为向前函数(forwarding function)的技术：Derived类自己创建个内联方法，直接调用基类的方法。以上就是关于继承和名称覆盖的所有内容，但当继承和模板结合时，一种全新的“继承名称被覆盖”的问题又出现了，详见Item43

:::tip 总结
派生类的名称覆盖基类的名称，在公有继承下者并不是可取的；解除名称的覆盖使用using声明或者向前函数
:::

## Item34:区别对待接口的继承和实现的继承
公有继承可以看成继承接口和继承实现两个部分，并分别对应方法的声明和实现。作为类设计者，有些时候你想派生类只继承接口，有些时候继承接口和实现，有些时候重写实现，有些时候不允许重写实现，例如：
```cpp
class Shape {
    public:
        virtual void draw() const = 0;
        virtual void error(const std::string& msg);
        int objectID() const;
};

class Rectangle: public Shape { ... };

class Ellipse: public Shape { ... };
```
Shape是抽象类，因为包含了纯虚函数draw，Shape的所有接口都被继承：纯虚函数draw，虚函数error和普通方法objectID，不同的声明方式暗含着什么？纯虚函数的特征是它们**必须在派生类中重新声明**，并且纯虚函数**通常在抽象类中没有定义**，结合这两者可以推断**声明纯虚函数就是让派生类只继承它的接口**，对于draw方法来说这中声明方式最符合意义：每种形状都应该可以画出来，但是Shape并不指出到底该怎么画，由派生类自己实现，因为画矩形和画椭圆的方式是不同，Shape::draw告诉派生类：“你自己必须提供一种draw方法的实现，我不知道你是怎么具体实现的”。**顺便提下，为纯虚函数提供实现是合法的**，但是只能通过类名限定符来调用它：
```cpp
Shape *ps = new Shape;          // 错误，抽象类不能实例化

Shape *ps1 = new Rectangle;
ps1->draw();                    // 正确，调用Rectangle::draw()

Shape *ps2 = new Ellipse;
ps2->draw();                    // 正确，调用Ellipse::draw()

ps1->Shape::draw();             // 正确，调用Shape::draw()
ps2->Shape::draw();             // 正确，调用Shape::draw()
```
**而声明虚函数就是让派生类继承接口以及其默认实现**，比如Shape::error()，它告诉派生类：“你必须支持error方法，如果不想自己实现，调用的error方法就是我写的默认版本”，但事实证明让简单的虚函数指定接口和默认实现是危险的，比如：
```cpp
class Airport { ... };

class Airplane {
    public:
        virtual void fly(const Airport& destination);
    ...
};

void Airplane::fly(const Airport& destination) {
    ...         // 给定目的飞机场，默认的飞行方式实现
}

class ModelA: public Airplane { ... };
class ModelB: public Airplane { ... };
```
现在，我们添加新的飞行模式ModelC，但是它和ModelA和ModelB的飞行模式不同，但是如果ModelC忘记重新定义fly方法，这在航空领域中是个重大失误。问题在于ModelC类并没有显式地说明它并不想继承Airplane的fly方法，我们可以设计新的fly方法，提供默认的行为但不指定，代码如下所示：
```cpp
class Airplane {
    public:
        virtual void fly(const Airport& destination) = 0;
    ...
    protected:
        void defaultfly(const Airport& destination);
};

void Airplane:defaultfly(const Airport& destination) {
    ...         // 给定目的飞机场，默认的飞行方式实现
}
```
现在fly是纯虚函数，只提供接口，该接口默认的实现代码是defaultfly，像ModelA，ModelB这样使用默认行为的类可以通过内联调用defaultfly来实现fly方法：
```cpp
class ModelA: public Airplane {
    public:
        virtual void fly(const Airport& destination) { defaultFly(destination); }
    ...
};

class ModelB: public Airplane {
    public:
        virtual void fly(const Airport& destination) { defaultFly(destination); }
    ...
};
```
而对于ModelC来说，现在它只能自己实现fly方法，就没有什么忘记覆盖默认定义而出错的情况了：
```cpp
class ModelC: public Airplane {
    public:
        virtual void fly(const Airport& destination);
    ...
};

void ModelC::fly(const Airport& destination) {
    ...         // 给定目的飞机场，ModelC的飞行方式实现
}
```
注意defaultfly是protected的普通函数，因为它的设计目的就是用于提供派生类默认行为，默认行为不应该再被修改，以上这种设计模式虽然不是万无一失的，但是至少比原来的设计模式可靠。有些人反对类似fly和defaultfly这种分别提供接口和实现的设计思想，其中一点是两个方法名相关联(fly，defaultfly)污染类命名空间，但是他们并不反对这种接口和设计分离的原则，该如何解决这个问题呢？答案是之前提到的纯虚函数也可以提供实现的特性，如下所示：
```cpp
class Airplane {
    public:
        virtual void fly(const Airport& destination) = 0;
    ...
};

void Airplane::fly(const Airport& destination) {
    ...         // 给定目的飞机场，默认的飞行方式实现
}

class ModelA: public Airplane {
    public:
        virtual void fly(const Airport& destination) { Airplane::fly(destination); }
    ...
};

class ModelB: public Airplane {
    public:
        virtual void fly(const Airport& destination) { Airplane::fly(destination); }
    ...
};

class ModelC: public Airplane {
    public:
        virtual void fly(const Airport& destination);
    ...
};

void ModelC::fly(const Airport& destination) {
    ...         // 给定目的飞机场，ModelC的飞行方式实现
}
```
现在，纯虚函数Airplane::fly的函数体代替了独立方法Airplane::defaultfly，基本上fly方法已经分成两块，派生类必须使用的接口，有默认定义的实现(使用默认需要手动显式指出)。最后我们来看普通方法objectID，普通方法使得**派生类继承接口及其强制性的实现**，Shape::objectID告诉所有派生类：“每种形状对象都有id，Shape::objectID定义产生这个id的方式，派生类不应该修改其实现”。在决定声明函数属于以上三者哪种之前，应该避免以下两种常见的错误：
- 声明所有的方法为非虚函数。这使得派生类不能专门化这些方法，比如非虚的析构函数(Item7)，当然如果设计类不是用来作为基类的可以这么考虑，但是这种类经常是因为对虚函数损耗未经证实的担忧或者对虚函数、非虚函数没有区别概念的结果，事实就是几乎所有用作基类的类都有虚函数
- 声明所有的方法为虚函数。有些时候接口类是这么做的，但是这也是一种类设计者没有担当的迹象，他们并不能决定函数是否应该在派生类被重新定义，当方法的定义需要变换时，大胆地使用虚函数

:::tip 总结
继承接口和继承接口的实现是不同的，对于公有继承来说，派生类总是继承基类接口；纯虚函数只指定继承接口；虚函数指定接口及其默认实现；普通函数指定接口加上强制性的实现
:::

## Item35:思考虚函数的替代方案
假设你正在开发一款游戏，并设计游戏中人物的继承体系，游戏中人物会受伤，因此你决定提供方法healthValue返回表示人物健康值的整数，由于每种人物有着不同计算健康值的方式，所以声明healthValue为虚函数似乎是最明显的设计方式：
```cpp
class GameCharacter {
    public:
        virtual int healthValue() const;
    ...
};
```
GameCharacter并没有声明为纯虚函数暗示它有着默认的计算健康值的算法，以上的设计方式是显而易见的，但接下来让我们考虑以下其他的设计方式：
### 使用非虚接口的模板方法模式
有种观点认为虚函数应该是私有的，按照这种观点我们把healthValue改为普通函数，但是通过私有的虚函数doHealthValue来完成真正的计算工作：
```cpp
class GameCharacter {
    public:
        int healthValue() const {
            ...                                 // 预备工作
            int retVal = doHealthValue();
            ...
            return retVal;                      // 善后工作
        }
    ...
    private:
        virtual int doHealthValue() const { ... }
};
```
这里直接把函数定义放在了类声明里面，使得函数是内联的，但是本节讨论的重点是设计方式，函数是否内联并无关系，这种客户端通过公有方法间接调用私有虚函数的设计方式被称为NVI(non-virtual interface)，它是一种称为Template Method(和C++模板并没有关系)设计模式的特殊表现，由代码注释可以看出，我们调用代码进行“预备工作”(比如上锁，日志登记，参数验证等)和“善后工作”(比如解锁等)，如果让客户调用虚函数来进行这些操作并不是个好点子。你可能会对此产生怀疑：NVI调用的私有虚函数只能是派生类来重新定义啊！关于这一点，定义虚函数是确定该做什么，调用虚函数是确定该什么时候做，两者关注点不同，NVI允许派生类重定义虚函数但是基类保留了何时调用这个虚函数的权利。在NVI中，虚函数并不强制要求为私有的，前面的例子中有protected的虚函数，甚至必须是public的，例如构造函数
### 使用函数指针的策略模式
另一种更引人注目的设计是说人物的健康值和其类型无关，计算健康值不需要是人物的一部分，比如我们可以让构造函数需要一个函数指针来初始化类，通过这个指定的函数来计算健康值：
```cpp
class GameCharacter;        // 向前声明

int defaultHealthCalc(const GameCharacter& gc);    // 默认的健康值计算方法

class GameCharacter {
    public:
        typedef int (*HealthCalcFunc)(const GameCharacter&);
        explicit GameCharacter(HealthCalcFunc hcf = defaultHealthCalc)
        : healthFunc(hcf) {}
        int healthValue() const { return healthFunc(*this); }
    private:
        HealthCalcFunc healthFunc;
};
```
这种设计模式称为Strategy，它提供以下特性：
- 相同类的不同实例可以有着不同的健康值计算方法
```cpp
class EvilBadGuy: public GameCharacter {
    public:
        explicit EvilBadGuy(HealthCalcFunc hcf = defaultHealthCalc)
        : healthFunc(hcf) { ... }
    ...
};
int loseHealthQuickly(const GameCharacter&);
int loseHealthSlowly(const GameCharacter&);
EvilBadGuy ebg1(loseHealthQuickly);
EvilBadGuy ebg2(loseHealthSlowly);
```
- 计算特定人物健康值的方法可以在运行时改变，比如GameCharacter可以提供方法setHealthCalcculator来替换默认的计算方法

另一方面，健康值计算函数不再是成员函数意味着计算健康值只能访问对象的公有部分，当必须访问类的私有数据成员才能计算健康值时，只能通过声明为友元函数或者提供公有访问函数来提供信息，但这将会弱化类的封装性，这点需要仔细考虑
### 使用std::function的策略模式
当你习惯于模板和隐式接口后，使用函数指针的方式看起来很僵硬，为什么计算健康值必须是函数而不是更简单的表现得像函数的东西，比如函数对象？如果一定是函数，为什么不能是成员函数？为什么必须返回int类型而不能是其他能够转换为int的类型？这些疑惑将不复存在，如果使用std::function来替代函数指针：
```cpp
class GameCharacter;        // 向前声明

int defaultHealthCalc(const GameCharacter& gc);    // 默认的健康值计算方法

class GameCharacter {
    public:
        // 现在HealthCalcFunc表示任何可以调用实体
        // 该实体接受任何兼容GameCharacter
        // 并返回兼容int的类型
        typedef std::function<int (const GameCharacter&)> HealthCalcFunc;
        explicit GameCharacter(HealthCalcFunc hcf = defaultHealthCalc)
        : healthFunc(hcf) {}
        int healthValue() const { return healthFunc(*this); }
    private:
        HealthCalcFunc healthFunc;
};
```
如你所见，现在HealthCalcFunc是std::function实例的别名，它表现得像一般的函数指针，仔细观察`std::function<int (const GameCharacter&)>`，尤其是签名部分，它指出函数使用const GameCharacter引用作为参数并返回int，并且HealthCalcFunc具有兼容性，即参数可以是能隐式转为const GameCharacter的类型，返回类型可以是隐式转换为int的类型。和上一种实现方式相比，两者几乎是一样，其中的差别几乎可以忽略，**除了后者对计算函数的指定更加灵活**：
```cpp
short calcHealth(const GameCharacter&);

struct HealthCalculator {
    int operator()(const GameCharacter&) const { ... }
};

class GameLevel {
    public:
        float health(const GameCharacter&) const;
        ...
};

class EvilBadGuy: public GameCharacter { ... };
class EyeCandyCharacter: public GameCharacter { ... };

EvilBadGuy ebg1(calcHealth);                    // 函数指针
EyeCandyCharacter ecc1(HealthCalculator());     // operator()操作符函数
GameLevel currentLevel;                         
...
EvilBadGuy ebg2 {
    std::bind(&GameLevel::health, currentLevel, _1) // 另一种类的方法
};
```
这里要解释下最后一个例子，GameLeve::health表面上声明只接受一个参数(GameCharacter的引用)，但实际上还有一个隐含参数(this指针)，而GameCharacter的健康值计算方法只有一个参数，为此我们只能使用bind函数将currentLevel作为GameLevel对象绑定到ebg2的健康值计算函数中，`_1`表示GameLevel::health的第一个参数和GameCharacter::HealthCalcFunc的第一个参数匹配
### 经典策略模式
一种更加传统的策略模式是让计算健康值函数称为独立的继承体系中的虚成员函数：
```cpp
class GameCharacter;

class HealthCalcFunc {
    public:
        ...
        virtual int calc(const GameCharacter& gc) const { ... }
    ...
};

HealthCalcFunc defaultHealthCalc;

class GameCharacter {
    public:
        explicit GameCharacter(HealthCalcFunc *phcf = &defaultHealthCalc)
        : pHealthCalc(phcf) {}
        int healthValue() const { return healthFunc(*this); }
        ...
    private:
        HealthCalcFunc *pHealthCalc;
};
```
这种是人们熟悉的“标准”策略模式的实现方式，它让现有的健康值算法通过派生类重新定义来调整

:::tip 总结
虚函数的替代方案包括NVI和策略设计模式的变体，NVI自身是模板方法设计模式的特例；将成员函数移到类体外边的缺点是非成员函数不能访问非公有成员；std::function表现得像一般函数指针，但是可以调用所有兼容的目标签名
:::

## Item36:永远不要重新定义继承的非虚函数
假设有以下代码：
```cpp
class B {
    public:
        void mf();
    ...
};
class D: public B { ... };
D x;
B *pB = &x;
pB->mf();
D *pD = &x;
pD->mf();
```
两次调用mf的结果实际上可能有所不同，这有点奇怪，调用同一个对象的相同函数怎么会不同？当mf不是虚函数并且D自己声明mf时调用结果不同：
```cpp
class D: public B {
    public:
        void mf();
    ...
};
pB->mf();       // 调用B::mf
pD->mf();       // 调用D::mf
```
调用结果不同是因为B::mf和D::mf都不是虚函数，使用静态绑定(见Item37)，这意味者pB声明为指向B的指针，通过pB调用的非虚函数一定是在B自己定义的，即使pB实际上指向D对象，还是调用B::mf；而对于虚函数，使用动态绑定，因此无论是通过pB还是pD调用mf，最后调用的都是实际对象所属类型D的函数D::mf。所以当你在编写D类时，如果重新定义继承而来的非虚函数mf，以上例子显示调用mf的结果和对象本质的类型无关而和声明指针的类型相关，造成不一致的行为，这种问题把指针换成引用也同样存在。  
派生类D重新定义继承的方法mf是矛盾的，如果D真的要在mf的行为上和B表现不同，说明D并不是B的一种，这种情况下D不应该公有继承自B，另一方面，如果D真的需要公有继承自B，也真的需要mf表现不同，那么mf应该声明为virtual的，总结就是D公有继承自B，就不能也不应该修改非虚函数mf。也许你回忆起在Item7中解释为什么多态基类的析构函数必须声明为虚函数，如果违背了这条原则，也就相当于违背了本节的原则，因为派生类总是会修改继承而来的非虚的基类析构函数，即使派生类没有自己定义析构函数，因为编译器会自动生成默认析构函数，本质上Item7就是本节Item的一种特例

:::tip 总结
永远不要重新定义继承的非虚函数
:::

## Item37:永远不要重新定义继承函数的默认参数值
派生类继承的函数有两种：虚函数和非虚函数。在Item36中提出不能重新定义继承的非虚函数，在本节中我们考虑虚函数带默认参数的情况：虽然虚函数是动态绑定的，但默认参数是静态绑定的。给出下面一段代码：
```cpp
class Shape {
    public:
        enum ShapeColor { Red, Green, Blue };
        // 所有的形状都提供绘画的方法
        virtual void draw(ShapeColor color = Red) const = 0;
    ...
};

class Rectangle: public Shape {
    public:
        // 注意默认参数发生改变
        virtual void draw(ShapeColor color = Green) const;
    ...
};

class Circle: public Shape {
    public:
        virtual void draw(ShapeColor color) const;
    ...
};

Shape *ps;
Shape *pc = new Circle;
Shape *pr = new Rectangle;
```
在这个例子中，ps，pc和pr都声明为Shape指针，也就是它们的**静态类型**都是Shape，静态类型和它们实际上所指对象的类型无关，而**动态类型**由**当前**所指对象的类型确定，即动态类型决定对象的表现行为，pc的动态类型是Circle，pr的动态类型是Rectangle，而ps的动态类型还没有确定。动态类型的名称提示它们在程序运行中变化，通常通过赋值：
```cpp
ps = pc;    // ps的动态类型是Circle
ps = pr;    // ps的动态类型是Rectangle
```
虚函数是动态绑定的，这意味着被调用的函数由对象的动态类型确定：
```cpp
pc->draw(Shape::Red);       // 调用Circle::draw(Shape::Red)
pr->draw(Shape::Red);       // 调用Rectangle::draw(Shape::Red)
```
虚函数都是老生常谈，但是考虑带默认参数的虚函数时，由于默认参数的静态绑定的，这意味着你可能调用在派生类定义的虚函数但是其默认参数是在基类中定义的默认值而不是派生类中定义的默认值：
```cpp
pr->draw();                 // 调用Rectangle::draw(Shape::Red)
```
上面一行代码，pr的动态类型是Rectangle，调用虚函数是Rectangle::draw，但是在Rectangle::draw的默认参数是Green，但是最后调用的默认参数是基类Shape中定义的Red，这和ps，pc和pr的动态类型无关，使用引用也存在同样的问题，问题的关键在于**draw是虚函数，并且其默认参数在派生类中重新定义**。为什么C++要这么设计？答案是为了运行是效率，如果默认参数也是动态绑定的，编译器需要花费额外的时间来确定最终的参数值。那如果我们依照这个规则在基类和派生类中都提供默认参数：
```cpp
class Shape {
    public:
        enum ShapeColor { Red, Green, Blue };
        virtual void draw(ShapeColor color = Red) const = 0;
    ...
};

class Rectangle: public Shape {
    public:
        virtual void draw(ShapeColor color = Red) const;
    ...
};
```
不好了，代码重复，更严重地，这是有依赖的代码重复：如果Shape中的默认参数发生改变，那么所有重复它的派生类都需要改变，否则就是重新定义继承的默认参数值。当你想要按自己的方式定义虚函数，Item35提供了替代方案，比如NVI：
```cpp
class Shape {
    public:
        enum ShapeColor { Red, Green, Blue };
        virtual void draw(ShapeColor color = Red) const
        {
            doDraw(color);
        }
    private:
        virtual void doDraw(ShapeColor color) const = 0;
    ...
};

class Rectangle: public Shape {
    public:
        ...
    private:
        virtual void doDraw(ShapeColor color) const;
        ...
};
```
因为非虚函数不会被派生类重写(Item36)，因此draw的默认参数值一直都是Red

:::tip 总结
永远不要重新定义继承函数的默认参数值，因为默认参数是静态绑定的，而你唯一需要重写的虚函数是动态绑定的
:::

## Item38:通过组合模拟“has-a”或者“is-implemented-in-terms-of”的关系
一个类型的对象包含另一种类型的对象时称之为组合关系，比如：
```cpp
class Address { ... };
class PhoneNumber { ... };
class Person {
    public:
        ...
    private:
        std::string name;
        Address address;
        PhoneNumber voiceNumber;
        PhoneNumber faxNumber;
};
```
Item32解释了公有继承就是“is-a”的关系，而组合也有两种含义：“has-a”或者“is-implemented-in-terms-of”。当程序中的对象对应于真实世界的东西时，比如“人”，“自行车”等，这种对象属于应用域(application domain)，而当对象仅仅对应于人工产物，比如“缓冲区”，“锁”，“搜索树”等，该对象称属于实现域(implementation domain)，当应用域的对象进行组合时，表达“has-a”的关系，当实现域的对象进行组合时，表达“is-implemented-in-terms-of”的关系。分辨“has-a”和“is-a”关系很简单，你会说“人有名字和地址”，而不会说“人是名字或地址”，大部分人不会混淆，但难的是区分“is-a”和“is-implemented-in-terms-of”，比如你要设计表示集合的模板类，集合的性质是没有重复元素，显然使用标准库的set模板类就可以，但是std::set使用平衡搜索树实现，当时间优于空间时这是个合理的设计，但是你的应用中空间优于时间，因此std::set并不适合，最后还是要自行实现。  
作为一个编程专家，你很快想到了使用std::list，特别地，你决定让Set模板继承list，毕竟每个Set对象是一种list对象(“is-a”)，代码为：
```cpp
template<typename T>
class Set: public std::list<T> { ... };
```
一切似乎合情合理，但是根据Item32，在“is-a”的关系中，对派生类成立的一切在基类中也成立，但是Set不包含重复对象，在list可以包含，这说明两者根本不是“is-a”的关系，正确的理解是Set对象可以通过list对象来实现：
```cpp
template<class T>
class Set {
    public:
        bool member(const T& item) const;
        void insert(const T& item);
        void remove(const T& item);
        std::size_t size() const;
    private:
        std::list<T> rep;
};
```
Set类的方法可以依赖于list以及标准库提供的方法来实现：
```cpp
template<typename T>
bool Set<T>::member(const T& item) const {
    return std::find(rep.begin(), rep.end(), item) != rep.end();
}

template<typename T>
void Set<T>::insert(const T& item) {
    if(!member(item))
        rep.push_back(item);
}

template<typename T>
void Set<T>::remove(const T& item) {
    typename std::list<T>::iterator it = std::find(rep.begin(), rep.end(), item);
    if(it != rep.end())
        rep.erase(it);
}

template<typename T>
std::size_t Set<T>::size() const {
    return rep.size();
}
```

:::tip 总结
组合和公有继承的含义完全不同；在应用域，组合意味着“has-a”关系，在实现域，组合意味着“is-implemented-in-terms-of”关系
:::

## Item39:明断地使用私有继承
Item32告诉我们C++将**公有**继承看成“is-a”的关系，那么**私有**继承呢？
```cpp
class Person { ... };
class Student: private Person { ... };

void eat(const Person& p);
void study(const Student& s);

Person p;
Student s;

eat(p);         // OK
eat(s);         // Error!
```
代码的运行结果告诉我们私有继承并不意味着“is-a”，那它意味着什么呢？我们先看下私有继承的行为：当Student私有继承自Person时，编译器并不会把派生类对象转换为基类对象，因此`eat(s)`运行失败，另外基类中所有类型成员(private, protected, public)在派生类中都是私有的(private)。这样看来，私有继承表示“is-implemented-in-terms-of”的关系：如果D私有继承自B，说明你想要利用一些B的特性，但是B和D之间并没有概念关系，私有继承完全是一种实现技术，使用Item34的术语，私有继承意味着应该只是继承实现，而忽略接口。**私有继承在软件设计中不重要，只在软件实现中有意义**  
这令人感到困惑，因为组合也代表“is-implemented-in-terms-of”关系(Item38)，那么是选择组合还是私有继承？答案很简单：**当你可以使用组合时就使用组合，当你必须使用私有继承时才使用私有继承**。那什么情况才算必须使用？主要是涉及保护成员或者虚函数时，以及一些例外情况(稍后提及)。假设我们正在设计一个Widget类，需要跟踪该类每个方法被调用次数，在运行时会动态检查这个数值，为了完成这项工作，需要一个计时器来提醒收集数据，恰好这里有现成的代码可以用：
```cpp
class Timer {
    public:
        explicit Timer(int tickFrequency);
        virtual void onTick() const;
    ...
};
```
Timer类正是我们所需要的，它可以通过频率来配置，在每次滴答时调用虚函数onTick，我们可以重新定义这个虚函数来收集Widget信息，完美！为了重写onTick函数，Widget类必须继承Timer类，但是公有继承显然不合适，因为Widget对象不应该能够调用onTick方法，这不属于Widget接口的概念，允许这种调用很容易让客户端错误地使用Widget接口，违背了让接口错误使用起来困难的原则(Item18)，因此使用私有继承：
```cpp
class Widget: private Timer {
    private:
        virtual void onTick() cosnt;
    ...
};
```
通过私有继承，Timer类的公有方法onTick在Widget类中是私有的，防止误导客户端调用这个接口。这是个漂亮的设计，但是我们还**可以**使用组合，在Widget类内嵌套声明然后公有继承：
```cpp
class Widget {
    private:
        class WidgetTimer: public Timer {
            public:
                virtual void on Tick() const;
            ...
        };
        WidgetTimer timer;
    ...
};
```
这种设计比只使用私有继承更复杂，涉及到了公有继承和组合，并引入了新类WidgetTimer，老实说，这主要是提醒你不止有一种设计方案，尽管如此，可以列出以下两点说明公有继承加组合比私有继承好：
- 第一，你可能想要Widget类派生出其他类，但是又不想让Widget的派生类重新定义onTick，当Widget继承Timer时这是不可能的，但是在WidgetTimer为Widget私有成员并公有继承自Timer时，Widget的派生类无法访问WidgetTimer，因此无法继承或者重新定义，现在你知道怎么用C++模拟Java的final方法或者C#的sealed方法
- 第二，你可能想要最小化Widget的编译依赖，如果Widget继承自Timer，Timer的定义必须在Widget编译时确定，也就是可能需要添加头文件`#include "Timer.h"`；此外，如果WidgetTimer挪到Widget外部定义，让Widget只包含WidgetTimer的指针，这样Widget的声明大大简化(Item31)，不需要包括Timer头文件，对于大型系统来说这样的解耦是十分重要的

之前提到过私有继承主要用于派生类需要访问基类的保护成员，或者重新定义虚函数，但它们的关系还是“is-implemented-in-terms-of”而不是“is-a”，除了这些外还有十分边缘的例外情况：*空类(Empty Class)*，这种类的数据成员都是static的，函数成员都不是虚函数(否则会添加虚函数表指针)，没有虚基类(虚基类会添加内存开销，见Item40)。从概念上来说，这种空类对象应该不占用内存，但是C++规定**独立**的空类对象体积不能为0，也就是说对于
```cpp
class Empty {};     // 空类

class HoldsAnInt {
    private:
        int x;
        Empty e;
};
```
你会发现`sizeof(HoldsAnInt) > sizeof(int)`，**对于大多数编译器来说，`sizeof(Empty)`的结果是1**，因为C++规定空类对象要插入一个char字符来表示，并且**由于对齐，HoldsAnInt对象实际上是两个int大小**，也许你注意到了前面强调的是独立对象的大小不是0，而当继承Empty而不是包含Empty对象时：
```cpp
class HoldsAnInt: private Empty {
    private:
        int x;
};
```
此时你会发现`size(HoldsAnInt`等于`sizeof(int)`，这被称为*空基类优化(Empty Base Optimization)*，并且注意EBO通常只能用于单继承而不能是多继承，实际上，STL中许多地方都用到空类来包含有用的成员(通常是typedef别名)，由于EBO使得继承这些类不会增加体积。因为大部分类都不是空类，所以EBO是少见的私有继承的合理使用，此外，大多数继承表示“is-a”关系，特别是由公有继承表示，组合和私有继承都表示“is-implemented-in-terms-of”，但是组合更容易理解，所以说能使用组合的话就尽可能地使用组合  
但是私有继承经常在处理不是“is-a”关系的两种类，并且其中一个类要访问另一个的保护成员或者重写虚函数时用到，当然这种情况也可以通过公有继承加组合来生产同样的效果，**明断地使用私有继承意味着在考虑所有可能的替代方案后，私有继承是最好的方案**

:::tip 总结
私有继承表示“is-implemented-in-terms-of”的关系，它通常比使用组合更差，除了涉及保护成员和虚函数重定义时；私有继承可以发挥EBO的优势，而组合不能，这对想要最小化对象体积的库发开者们很重要
:::

## Item40:明断地使用多继承
当谈到多继承(MI, Multiple Inheritance)时，C++社区对其的看法可以分为两派：一部分人认为既然单继承(SI, Single Inheritance)已经如此优秀，多继承肯定会更好，另一派人认为单继承已经足够，使用多继承没有必要。  
首先使用多继承可能会继承相同的名称，因此会导致歧义：
```cpp
class BorrowableItem {
    public:
        void checkOut();
    ...
};

class ElectronicGadget {
    private:
        bool checkOut() const;
    ...
};

class MP3Player: public BorrowableItem, public ElectronicGadget
{ ... };

MP3Player mp;
mp.checkOut();          // 调用的是哪个checkOut方法？
```
调用checkOut的代码是模棱两可的，即使两个函数只有一个是公有的，根据C++处理重载函数的规则：在根据函数是否可访问之前，C++首先确定调用语句最匹配的函数，之后才检查访问性。在上例中，BorrowableItem::checkOut和ElectronicGadget::checkOut都可以匹配，没有最佳匹配，因此也不会去检查ElectronicGadget::checkOut的访问性。消除歧义的方法是指定调用哪个基类的方法：
```cpp
mp.BorrowableItem::checkOut();
```
如果尝试`mp.ElectronicGadget::checkOut()`的话，编译器就会抛出错误“试图调用私有方法”。多继承仅仅意味着继承多个基类，但是很少见到多继承之上还有基类，这会导致著名的“死亡MI菱形“：
```cpp
class File { ... };
class InputFile: public File { ... };
class OutputFile: public File { ... };
class IOFile: public InputFile, public OutputFile
{ ... };
```
在继承体系图中，当派生类和基类存在不止一条路径时，每条路径对应一次基类数据成员的副本，例如File类包含数据成员fileName，这意味着IOFile类包含两个fileName数据成员，这是违反逻辑，fileName字段不应该重复。C++对此并没有站队，它乐意支持两种选择，一种默认选择是执行复制，另一种选择是通过**虚继承**来消除复制：
```cpp
class File { ... };
class InputFile: virtual public File { ... };
class OutputFile: virtual public File { ... };
class IOFile: public InputFile, public OutputFile
{ ... };
```
C++标准库中包含的多继承就是这么实现的，除了模板类，实际上File，InputFile，OutputFile和IOFile对应于标准库的类名为basic_ios，basic_istream，basic_ostream，basic_iostream。从行为正确的角度来看，公有继承应该是virtual的，如果只是这么看，那任何使用公有继承时都加上virtual，可惜，但从正确性考虑太狭隘，避免继承字段的重复需要编译器背后“使花招”，结果是使用虚继承的对象体积不使用虚继承的更大，访问成员数据的速度也更慢，编译器的实现细节各不相同，但结果都是一样的：虚继承是有开销的。此外，虚基类的初始化规则比非虚基类的更复杂，虚基类的初始化由继承体系最底端的派生类负责，这暗示着两点：
- 派生类必须知道它们的虚基类，无论在继承体系上离它们多远
- 派生类必须承担其虚基类(无论是直接的基类还是间接的)的初始化任务

我对使用虚继承的建议很简单：一、不要使用虚基类**除非必须**；二、必须使用的话，避免在虚基类中放数据成员，这样就不用担心虚基类奇特的初始化。值得一体的是，在Java和.NET中和C++虚基类对标的“接口”就不允许包含数据成员。接下来让我们使用C++接口类(Item31)来建模人物：
```cpp
class IPerson {
    public:
        virtual ~IPerson();
        virtual std::string name() const = 0;
        virtual std::string birthDate() const = 0;
};
```
客户端只能通过IPerson类的指针和引用来编程，因为抽象类不允许实例化，为了创建可以操作的IPerson实例，客户端需要使用工厂函数来实例化IPerson的派生类：
```cpp
// 创建Person对象的工厂函数
std::shared_ptr<IPerson> makePerson(DatabaseID personId);

// 从用户获得数据库ID
DatabaseID askUserForDatabaseID();

DatabaseID id(askUserForDatabaseID());
std::shared_ptr<IPerson> pp(makePerson(id));
...
```
显然，IPerson类必须派生出具体类让makePerson能够实例化，假设派生出CPerson类，它需要实现继承自IPerson的纯虚函数，可以重头手写实现，但是利用现有的代码会更好，假设就有老旧的PersonInfo类提供满足CPerson类所需功能：
```cpp
class PersonInfo {
    public:
        explicit PersonInfo(DatabaseID pid);
        virtual ~PersonInfo();
        virtual const char* theName() const;
        virtual const char* theBirthDate() const;
        ...
    private:
        virtual const char* valueDelimOpen() const;
        virtual const char* valueDelimClose() const;
        ...
};
```
PersonInfo看起来就是老的代码，因为它的方法返回类型const char*而不是string，但是方法名如此契合干嘛不用呢？随后发现该类提供以不同格式打印数据库字段的方法，打印字段的前缀和后缀由特定的字符串指定，默认是方括号，比如打印字段“Ring-tailed Lemur”的结果是`[Ring-tailed Lemur]`，实现如下所示：
```cpp
const char* PersonInfo::valueDelimOpen() const {
    return "[";
}

const char* PersonInfo::valueDelimClose() const {
    return "]";
}

const char* PersonInfo::theName() const {
    static char value[Max_Formatted_Field_Value_Length];
    std::strcpy(value, valueDelimOpen());
    ...         // 添加字段，注意防止缓冲区溢出
    std::strcat(value, valueDelimClose());
    return value;
}
```
但是也有会对PersonInfo::theName产生质疑，使用固定大小的static缓冲区会出现多线程问题，除此以外，因为valueDelimOpen和valueDelimClose都是虚函数，这意味着theName的结果不仅取决于PersonInfo，还有PersonInfo的派生类。CPerson类和PersonInfo类的联系在于PersonInfo类的方法恰好是CPerson类实现所需要的，也就是“is-implemented-in-terms-of”的关系，之前提到，建模这种关系的要么组合，要么私有继承，但是其中涉及到虚函数，所有这里选择私有继承，但是CPerson类又必须实现IPerson接口，最后的结果是多继承：
```cpp
class IPerson {
    public:
        virtual ~IPerson();
        virtual std::string name() const = 0;
        virtual std::string birthDate() const = 0;
};

class DatabaseID { ... };

class PersonInfo {
    public:
        explicit PersonInfo(DatabaseID pid);
        virtual ~PersonInfo();

        virtual const char* theName() const;
        virtual const char* theBirthDate() const;

        virtual const char* valueDelimOpen() const;
        virtual const char* valueDelimClose() const;
        ...
};

class CPerson: public IPerson, private PersonInfo {
    public:
        explicit CPerson(DatabaseID pid): PersonInfo(pid) {}
        virtual std::string name() const {
            return PersonInfo::theName();
        }
        virtual std::string birthDate() const {
            return PersonInfo::theBirthDate();
        }
    private:
        const char* valueDelimOpen() const { return ""; }
        const char* valueDelimClose() const { return ""; }
};
```
这个例子说明了多继承是有好处并且可以理解的，虽然比起单继承，多继承通常更加复杂去使用和理解，如果你有能够替代多继承的单继承方案，单继承就是不二之选，如果你只能想到多继承的方案，应该再努力思考是否可以使用单继承，总而言之，明断地使用多继承

:::tip 总结
多继承通常比单继承更复杂，会出现歧义问题，需要使用虚继承；虚继承对体积，速度，类初始化和类赋值的复杂度都有开销，当虚基类没有数据时是最实用的；多继承也有合法的使用，比如公有继承接口类并私有继承实现类
:::