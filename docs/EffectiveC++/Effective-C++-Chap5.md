---
layout: article
title: 代码实现
permalink: /Effective-C++-Note/chap5
sidebar:
    nav: effective-c++-reading-notes
tags: Effective-C++ ReadingNotes C++
---
:::info
《Effective C++》英文第三版读书笔记第五章
:::

## Item26:尽可能地把变量定义延后
当你使用带有构造函数和析构函数的类型时，该类型的对象定义需要调用构造函数，脱离作用域后需要调用析构函数，如果该对象实际并未使用可以避免这些开销，如下所示的代码：
```cpp
std::string encryptPassword(const std::string& password) {
    using namespace std;
    string encrypted;
    if(password.length() < MinimumPassWordLength) {
        throw logic_error("Password is too short");
    }
    ...                     // 明文加密
    return encrypted;
}
```
该函数对明文密码进行加密，当明文过短时抛出异常，这里的问题是当抛出异常时，encrypted对象并没有被使用，由于其定义较早，因此多出来构造函数和析构函数的开销，因此最好把encrypted的定义往后挪动：
```cpp
std::string encryptPassword(const std::string& password) {
    using namespace std;
    if(password.length() < MinimumPassWordLength) {
        throw logic_error("Password is too short");
    }
    string encrypted;
    ...                     // 明文加密
    return encrypted;
}
```
但代码仍有缺陷，encrypted并没有任何初始化参数，也就是它使用默认构造函数初始化，假设明文加密使用函数`void encrypt(std::string& s);`来实现，那么encryptPassword可以按照如下方式实现：
```cpp
std::string encryptPassword(const std::string& password) {
    using namespace std;
    if(password.length() < MinimumPassWordLength) {
        throw logic_error("Password is too short");
    }
    string encrypted(password);         // 复制构造函数的效率优于默认构造加赋值操作符
    encrypt(encrypted);
    return encrypted;
}
```
以上的代码提示“尽量延后”的含义：不仅是直到要使用变量时才声明它，并且直到确定变量的初始化值时才定义它。关于在循环中使用的变量，有以下两种声明方式：
```cpp
// 方式A：在循环体外声明
Widget w;
for(int i = 0; i < n; ++i) {
    w = ...;
    ...
}

// 方式B：在循环体内声明
for(int i = 0; i < n; ++i) {
    Widget w(...);
    ...
}
```
对于方式A的声明方式，需要调用1次构造函数，1次析构函数，和n次赋值操作符函数；对于方式B的声明方式，需要调用n次构造函数，n次析构函数。当类的赋值操作符函数开销小于构造函数加析构函数开销，方式A更高效，尤其是n很大时，否则方式B更高效

:::tip 总结
尽量把变量的定义延后，这样能让程序更加清晰高效
:::

## Item27:减少类型转换
C++的设计原则之一是确保没有类型错误，但是类型转换(cast)打破了这一规则，这带来了许多麻烦，C++提供三种不同的类型转换句法，如下所示：
```cpp
(T) expression  // C风格的类型转换
T(expression)   // 函数式风格的类型转化
```
以上是2种老式的类型转换，C++提供如下的类型转换：
```cpp
const_cast<T>(expression)
dynamic_cast<T>(expression)
reinterpret_cast<T>(expression)
static_cast<T>(expression)
```
其中：
- const_cast用于去除对象的const限制，也是唯一能够做到这点的类型转换
- dynamic_cast主要用于“安全的向下类型转换”，即判断对象是否为继承等级中的某种类型，它是唯一的不能用老式风格替换的类型转换，也是唯一的可能具有显著运行时损耗的类型转换
- reinterpret_cast用于低级的不可兼容类型转换，比如把指针转为int类型
- static_cast用于强制隐式类型转换，如从非const到const，int到double，也可以用于反向的转换，如从void\*指针到int\*指针，基类指针到派生类指针，但是不能用于const到非const，这是const_cast才干的事

老式的cast仍然有效，但是新式的cast更好，第一他们更加容易在代码中确认，简化类型系统的处理，第二，每种cast使用范围更加狭窄，易于编译器发现错误。当想要调用显式的构造函数作为函数参数时我才会使用老式的cast：
```cpp
class Widget {
    public:
        explicit Widget(int size);
        ...
};

void doSomeWork(const Widget& w);

doSomeWork(Widget(15));                 // 使用函数风格创建对象
doSomeWork(static_cast<Widget>(15));    // 使用C++风格的cast创建对象
```
许多程序员错误地认为类型转换就是告诉编译器把一种对象类型看为另一种，这是错误的，任何形式的类型转换(通过cast语句形式或者编译器隐式转换)都导致额外的运行时代码，比如：
```cpp
int x, y;
...
double d = static_cast<double>(x)/y;    // int转为double
```
由int到double的类型转换必然产生额外代码，因为绝大多数的架构中int和double表示是不一样的，这看起来没有新奇，但对于类来说差别很大：
```cpp
class Base { ... };

class Derived: public Base { ... };

Derived d;
Base *pb = &d;      // 派生类指针隐式地转换为基类指针
```
上述代码让基类指针指向派生类对象，但是有时该对象的Derived\*指针和Base\*指针是不相同的，也就是对象可能有两个地址，在C、Java、C#中是不可能的，但是在C++中的确存在，实际上使用多继承时该现象几乎都存在，包括单继承。这意味着你应该避免对C++中的内存布局作出任何假设，以及在这种假设上进行类型转化，例如将对象地址转为char*然后进行指针运算会导致未知的行为；另外在使用类型转换时注意一些错误：
```cpp
class Window {
    public:
        virtual void onReisze() { ... }
    ...
};

class SpecialWindow: public Window {
    public:
        virtual void onResize() {
            static_cast<Window>(*this).onResize();      // 通过向上类型转换为基类来调用对象基类部分的方法
            ...                                         // 实际上并不起作用！
        }
    ...
};
```
实际上代码所做的是**根据*this的基类部分拷贝一个临时的基类对象，然后调用该临时对象的onResize方法**，并没有调用当前对象的Window::onResize方法，你所需要做的是去掉类型转换，用实际的代码告诉编译器调用当前对象基类部分方法，如下所示：
```cpp
class SpecialWindow: public Window {
    public:
        virtual void onResize() {
            Window::onResize();     // 调用本对象基类部分的onResize方法
            ...
        }
};
```
这个例子很好地说明当你想要使用类型转换时，很可能在犯错，尤其是在使用dynamic_cast时。dynamic_cast会降低运行效率，因为常见的实现方式是比较类名，比较次数就是单继承的层数，多继承的结构消耗更大，因此在性能敏感的代码中谨慎使用它。使用dynamic_cast的需求通常因为你想要执行派生来方法但是你只有基类指针/引用指向对象，通常有两种方式避免使用dynamic_cast：  
**一是使用容器时，将元素类型由基类改为派生类**，以Window/SpecialWindow为例，将代码：
```cpp
class Window { ... };
class SpecialWindow: public Window {
    public:
        void blink();       // SpecialWindow子类特有的方法
    ...
};
typedef std::vector<std::shared_ptr<Window> > VPW;
VPW winPtrs;
...
for(VPW::iterator iter = winPtrs.begin(); iter = winPtrs.end(); ++iter) {
    if(SpecialWindow *psw = dynamic_cast<SpecialWindow*>(iter->get()))
        psw->blink();
}
```
替换为
```cpp
typedef std::vector<std::shared_ptr<SpecialWindow> > VPSW;   // 注意元素类型
VPSW winPtrs;
...
for(VPSW::iterator iter = winPtrs.begin(); iter = winPtrs.end(); ++iter) {
    (*iter)->blink();
}
```
这种方式意味着不能方便地应对所有Window的子类型，你只能声明多个不同子类型的容器，**另一种方式是在基类中提供空的虚函数**blink，如下所示：
```cpp
class Window {
    public:
        virtual void blink() {}     // 空定义，子类根据自己要求实现
    ...
};

class SpecialWindow: public Window {
    public:
        virtual void blink() { ... }
    ...
};

typedef std::vector<std::shared_ptr<Window> > VPW;
VPW winPtrs;
...
for(VPW::iterator iter = winPtrs.begin(); iter = winPtrs.end(); ++iter) {
    (*iter)->blink();
}
```
以上两种方式要么使用类型安全的容器，要么将虚函数提升到整个继承体系都可见的范围(基类声明)，当然你也可能想过用级联的dynamic_cast处理，如下所示：
```cpp
class Window { ... };
...         // 各种派生类的定义

typedef std::vector<std::shared_ptr<Window> > VPW;
VPW winPtrs;
...
for(VPW::iterator iter = winPtrs.begin(); iter = winPtrs.end(); ++iter) {
    if(SpecialWindow1 *psw = dynamic_cast<SpecialWindow1*>(iter->get())) {
        ...
    } else if (SpecialWindow2 *psw = dynamic_cast<SpecialWindow2*>(iter->get())) {
        ...
    } else if (SpecialWindow3 *psw = dynamic_cast<SpecialWindow3*>(iter->get()) {
        ...
    }
    ...
}
```
这样写编译器会产生大量的低效率代码，并且代码脆弱，一旦Window类继承发生改变，所有的代码又要在检查一遍，像这种代码都应该用虚函数调用进行替换

:::tip 总结
实践中避免类型转换，尤其在性能敏感的代码中避免使用dynamic_cast；当类型转换不可避免，在函数中实现，而不是让调用者自己进行类型转换再传入参数；优先考虑C++新式的类型转换句法(*_cast)而不是老式的，因为更加具体
:::

## Item28:避免返回对象构件的“句柄”
假设你在设计一个矩形类Rectangle，使用左上角和右下角点的坐标来表示，为了减少Rectangle的体积，使用指针表示这两个点的信息，如下所示：
```cpp
class Point {
    public:
        Point(int x, int y);
        ...
        void setX(int newVal);
        void setY(int newVal);
        ...
};

struct RectData {
    Point ulhc;     // 左上角
    Point lrhc;     // 右下角
};

class Rectangle {
    private:
        std::shared_ptr<RectData> pData;        // 这里不是RectData*
        ...
    public:
        Point& upperLeft() const { return pData->ulhc; }
        Point& lowerRight() const { return pData->lrhc; }
        ...
};
```
为了方便获取左上角，右下角点的坐标信息，Rectangle类还提供了upperLeft和lowerRight两个方法，由于Point是自定义类型，根据Item20这两个方法返回Point引用，以上代码没有编译问题，但是含义又自相矛盾，一方面，upperLeft和lowerRight声明为const方法，因为它们只提供点的信息但允许修改信息，另一方面，返回的引用自己也可以修改坐标信息，如下所示：
```cpp
Point coord1(0, 0);
Point coord2(100, 100);

const Rectangle rec(coord1, coord2);
rec.upperLeft().setX(50);           // 修改了矩形的坐标信息
```
以上得到两点经验：一是数据成员的封装方式与返回其引用的最易访问方法一样，在上例中ulhc和lrhc声明为private，但实际上它们是public的，因为公有方法uppperLeft和lowerRight返回它们的引用，二是如果const方法返回对象相关数据的引用，**该数据又是存储在对象外部**，这意味着调用者可以修改这些数据，只要涉及返回引用的方法，并且该方法返回的是指针或者迭代器，同理相同的问题也会出现。引用，指针，迭代器都是句柄(handle，访问其他对象的方法)，返回对象内存构件的句柄意味着损害对象的封装性，如上所示，即使const方法也会修改对象的信息。  
另外注意，我们通常认为对象的内部"构件"就是数据成员，但非public的方法也属于对象的内部构件，**因此注意成员函数不能返回更低访问权限的成员函数的指针**，实际上返回成员函数指针的成员函数很少见，回到之前的例子中，可以将返回类型加上const限制：
```cpp
class Rectangle {
    public:
        ...
        const Point& upperLeft() const { return pData->ulhc; }
        const Point& lowerRight() const { return pData->lrhc; }
    ...
};
```
这样upperLeft和lowerRight方法真正做到了不能修改Rectangle对象，但实际还是返回对象构件的引用，在其他情况下可能会导致问题，例如悬挂引用(dangling handle)，如下所示：
```cpp
class GUIObject { ... };

const Rectangle boundingBox(const GUIObject& obj);

GUIObject *pgo = new GUIObject();
const Point *pUpperLeft = &(boundingBox(*pgo).upperLeft());
```
函数boundingBox以返回Rectangle对象的方式返回GUI对象的形状，但这是一个新的，临时的匿名Rectangle对象，不妨命名为temp，然后调用temp的upperLeft方法，返回temp构件的指针给pUpperLeft，但是注意语句结束后temp被销毁，这会导致temp指向的Point子对象也会被销毁，最后pUpperLeft指向已经不在的Point对象，也就是悬挂指针。这就是为什么方法返回对象构件句柄是危险的原因，无论句柄是指针，引用还是迭代器，无论方法是否为const，无论返回句柄是否为const，只要这么做了，都会存在风险。但是**这并不意味着永远不要定义返回句柄的方法**，也有例外，比如vector类型的operator[]操作符方法就是返回引用

:::tip 总结
避免返回对象构件的句柄(引用，指针，迭代器)，这有助于增强封装性，让const方法表现的更const，也避免悬挂句柄的出现
:::

## Item29:努力争取异常安全的代码
假设有表示带背景图片的GUI菜单类，该类要在多线程环境下使用，所以它包含了锁，如下所示：
```cpp
class PrettyMenu {
    public:
        ...
        void changeBackground(std::istream& imgSrc);
        ...
    private:
        Mutex mutex;
        Image *bgImage;     // 当前背景图片
        int imageChanges;   // 背景图片改变次数
};

void PrettyMenu::changeBackground(std::istream& imgSrc) {
    lock(&mutex);
    delete bgImage;
    ++imageChanges;
    bgImage = new Image(imgSrc);
    unlock(&mutex);
}
```
从异常安全的角度来看，上述代码存在缺陷，当抛出异常时，所谓异常安全的函数应该做到：
- 不泄露资源，如果`new Image(imgSrc)`抛出异常，unlock将不会执行，无法释放锁资源
- 不允许数据结构毁坏，如果`new Image(imgSrc)`抛出异常，bgImage将指向释放的资源

Itme13介绍了使用对象管理资源防止资源泄露的方法，使用Item14中的Lock类管理锁，如下所示：
```cpp
void PrettyMenu::changeBackground(std::istream& imgSrc) {
    Lock ml(&mutex);

    delete bgImage;
    ++imageChanges;
    bgImage = new Image(imgSrc);
}
```
在继续处理数据损坏的问题之前，让我们先来看下什么是异常安全的函数，异常安全分成三层保证：
- 基础保证(basic guarantee)：**当异常抛出时，程序保留有效状态**，没有数据结构毁坏，但是程序的最终状态不可预测，比如当changeBackground方法抛出异常后背景图片可能还是旧的，可能是默认图片，总之不可预测
- 高强保证(strong guarantee)：**当异常抛出时，程序状态不会改变**，即该函数调用具有原子性，要么完全执行成功，要么执行失败状态保持不变
- 最强保证(nothrow guarantee)：**程序保证永远不会抛出异常**，所有对内建类型(int，指针等)的操作都不会抛出异常(nothrow)，对于空异常列表的函数来说，如`int doSomething() throw()`，这并不意味着doSomething永远不会抛出异常，而是它抛出异常是个错误，unexpected函数将会调用处理

异常安全的函数要提供以上三者之一的保证，最强保证看起来最完美，但实际上很难做到，C++的动态内存分配机制在内存紧缺时会抛出异常，因此只能在基础保证和高强保证中选择。使changeBackground提供高强保证并不难，将普通类型指针改为智能指针，并调整语句顺序，如下所示：
```cpp
class PrettyMenu {
    ...
    std::shared_ptr<Image> bgImage;
    ...
};

void PrettyMenu::changeBackground(std::istream& imgSrc) {
    Lock ml(&mutex);
    bgImage.reset(new Image(imgSrc));       // 替换智能指针值
    ++imageChanges;                         // 在所有操作都完成后次数加1
}
```
代码变得更加简洁，不需要delete删除老的图片资源，由智能指针的reset方法完成；但上述的修改并没有**完全提供高强保证**，如果`new Image(imgSrc)`出现异常，比如输入流imgSrc移走了，那么图片资源并没有更换，也就是只提供了基础保证。实际上有一种更通用的策略，即“复制后交换”(copy and swap)：复制想要修改的对象，在副本上进行修改，如果修改成功，交换副本和原始对象的值，交换不会抛出异常，该策略一般通过“pimpl idiom”方式实现(详见Item31)，具体代码如下所示：
```cpp
struct PMImpl {
    std::shared_ptr<Image> bgImage;
    int imageChanges;
};

class PrettyMenu {
    ...
    private:
        Mutex mutex;
        std::shared_ptr<PMImpl> pImpl;
};

void PrettyMenu::changeBackground(std::istream& imgSrc) {
    using std::swap;
    Lock ml(&mutex);
    std::shared_ptr<PMImpl> pNew(new PImpl(*pImpl));    // 复制构造函数创副本
    pNew->bgImage.reset(new Image(imgSrc));             // 副本对象更新图片
    ++pNew->imageChanges;                               // 更新次数
    swap(pImpl, pNew);                                  // 交换副本和原本
}
```
但要注意复制后交换的策略并不能保证整个函数提供高强保证，如下所示，如果f1和f2不是异常安全的，someFunc也很难是异常安全的：
```cpp
void someFunc() {
    ...     // 复制
    f1();
    f2();
    ...     // 交换
}
```
但是f1和f2都提供高强保证也并不是好事，如果f1执行完成而f2执行抛出异常，那么程序的最终结果并没有回到初始状态因为f1已经改变部分状态，即使f2什么也没干，比如f1是修改数据库并提交，其他数据库客户端看到的是f1更新后的数据，所以在这种情况下函数someFunc并不要求提供高强保证，另外一方面还要复制后交换会降低效率，总的来说，高强保证并不总是100%的有用，这个时候，提供基础保证就够了

:::tip 总结
异常安全的函数不泄露资源，不产生损坏数据，由弱到强依次提供基础，高强，最强保证；高强保证经常通过复制后交换来实现，但并不适用所有情况；函数所能提供的保证等级不会高于其所有调用函数中的最低等级
:::

## Item30:理解内联的本质
内联函数看起来像函数，表现得像函数，比宏定义好太多(见Item2)，调用内联函数没有普通函数调用的开销，还要啥自行车?然而，天下没有免费的午餐，内联就是把函数调用替换为函数体，显然这增加了目标文件的体积，内联代码越大导致越多的页，降低指令缓存命中率，最后的结果是程序性能下降，另一方面如果内联代码**很短**则将有益于程序性能，但是要**牢记内联只是对编译器的请求，而不是命令**，这种请求可以是显式或者隐式的，隐式的请求是在类定义中定义函数，如下所示：
```cpp
class Person {
    public:
        ...
        int age() const { return theAge;}       // 隐式的内联请求
        ...
    private:
        int theAge;
};
```
这种类型的函数一般是成员函数，但是如果是定义在类中的友元函数也是隐式的内联请求。显式的内联请求是在函数定义前加上关键字`inline`，例如：
```cpp
template<typename T>
inline const T& std::max(const T& a, const T& b) {
    return a < b ? b : a;
}
```
max函数是定义在头文件中的内联函数模板，但这不意味着函数模板必须就是内联的：**内联函数代表性地必须在头文件中，因为绝大多数构建环境在编译时内联**，而模板也是典型地在头文件中，因为编译器必须知道模板长什么样才能实例化，但是模板实例化和内联毫不相关。当内联函数过于复杂时(比如包含循环和递归)，编译器会拒绝内联请求，**并且几乎所有的虚函数调用都会拒绝内联**，“virtual”意味着“等到要运行时才决定调用那个函数”，而“inline”意味着“在运行前进行代码替换”，两者是互相矛盾的。总而言之，内联函数是否真正内联取决于编译器，幸运地是，大多数编译器在未能实现内联时会显示警告(见Item53)  
有些时候编译器也会拒绝内联，即使该函数完美适合内联。比如你写的代码要使用该内联函数的地址，这个时候编译器不得不把它当做普通函数了，另外编译器通常并不通过函数指针进行内联调用，如下所示：
```cpp
inline void f() { ... }     // 假设编译器乐意把f当做内联的

void (*pf)() = f;           // 函数指针pf指向f
...
f();                        // 内联函数调用
pf();                       // 普通函数调用
```
但是即使你自己没有用函数指针调用，还是存在其他情况，让你的内联函数不是内联的，比如编译器会生成构造函数和析构函数的拷贝指针，这样在构造和删除对象数组时可以通过函数指针调用，实际上，构造函数和析构函数是糟糕的内联函数候选者，例如：
```cpp
class Base {
    public:
        ...
    private:
        std::string bm1, bm2;
};

class Derived: public Base {
    public:
        Derived() {}        // 空的构造函数
        ...
    private:
        std::string dm1, dm2, dm3;
};
```
派生类Derived的构造函数看起来是内联的不二选择，但是外表具有欺骗性。C++给对象构建和销毁时指定不同的保证：new调用构造函数，delete调用析构函数，对于派生类而的构造函数，首先构建其基类部分，然后是自己的，析构函数反过来执行，当构造函数抛出异常时，已经构建的部分会被销毁...C++说该做**什么(what)**，但是没说**怎么(how)**去做，这由编译器来完成，我们可以想到编译器实现的Derived构造函数代码为：
```cpp
Derived::Derived() {
    Base::Base();           // 调用父类构造函数
    try{ dm1.std::string::string(); }
    catch(...) {
        Base::~Base();
        throw;
    }
    try{ dm2.std::string::string(); }
    catch(...) {
        dm1.std::string::~string();     // 销毁dm1
        Base::~Base();                  // 销毁基类
        throw;
    }
    try{ dm3.std::string::string(); }
    catch(...) {
        dm2.std::string::~string();
        dm1.std::string::~string();
        Base::~Base();
        throw;
    }
};
```
以上代码并不是典型的，但还是反映了Derived的“空”构造函数并不是它看上去的那么简单，如果Base构造函数，string构造函数都是内联的，全部展开的话将会有**5份**string构造函数代码(bm1,bm2,dm1,dm2,dm3)；另外代码库的设计者也需要仔细评估函数内联的影响，如库中的函数f是内联的，库的使用者把f的函数体编译嵌入其应用中，之后库的设计者想要修改f的行为时，所有的使用者都需要重新编译，f是普通函数的话只需要重新链接即可；对于程序开发来说，函数内联也会给调试带来麻烦，怎么可能给不存在的函数设置断点呢？

:::tip 总结
只将经常调用的小体积函数声明为内联的，这有助于调试，程序升级，降低代码屏障优化程序性能；不要因为函数模板在头文件中就将其声明为内联的
:::

## Item31:最小化文件之间的编译依赖
当你尝试修改仅仅一个类的实现时，之后整个程序需要重新编译链接，这让人惊讶又羞愧，原因在于C++并不擅长区分接口和实现，类的定义并不仅仅包括接口还有一部分的实现，例如：
```cpp
class Person {
    public:
        Person(const std::string& name, const Date& birthday, const Address& addr);
        std::string name() const;
        std::string birthDate() const;
        std::string address() const;
        ...
    private:
        std::string theName;        // string类的实现细节
        Date theBirthDate;          // Date类的实现细节
        Address theAddress;         // Address类的实现细节
};
```
这里的Person需要string类，Date类，Address类的实现细节才能编译，因此需要引入相应的头文件：
```cpp
#include <string>
#include "date.h"
#include "address.h"
```
但是这样就建立起定义Person的头文件和这些头文件之间的联系，如果以上3个头文件任一发生改动，或者其所依赖的头文件发生改动，包含Person类的源文件又要重新编译一次，这种级联式的依赖使得项目苦不堪言。你会怀疑C++为什么坚持把类的实现细节放在定义中，能不能像下面这样写：
```cpp
namespace std {
    class string;
}

class Date;
class Address;

class Person {
    public:
        Person(const std::string& name, const Date& birthday, const Address& addr);
        std::string name() const;
        std::string birthday() const;
        std::string address() const;
};
```
这样一来，使用Person的客户端只仅仅需要在Person的接口改变时才重新编译。但这样的代码有两个问题：第一，string并不是类，而是basic_string\<char\>的别名，所以向前声明std::string为class是不准确的，要正确地声明string类也很难，因为这涉及到额外的模板；第二，向前声明给编译器确定对象体积带来困难，例如：
```cpp
int main() {
    int x;
    Person p(...);
    ...
}
```
编译器清楚的知道int的大小，但是并不能够确定Person对象p的大小，也就不能给p分配内存，但是对于其他编程语言，如Smalltalk，Java，当对象定义时编译器只分配指针空间，也就是上述代码在它们的眼中等效于：
```cpp
int main() {
    int x;
    Person *p;
    ...
}
```
当然这也是合法的C++代码，所以你也可以使用这种通过指针隐藏实现细节的把戏，对于Person来说可以把它分成两个类，一个提供接口，一个负责实现，如下所示：
```cpp
#include <string>
#include <memroy>

class PersonImpl;       // 向前声明负责实现的类
class Date;
class Address;

class Person {
    public:
        Person(const std::string& name, const Date& birthday, const Address& addr);
        std::string name() const;
        std::string birthday() const;
        std::string address() const;
        ...
    private:
        std::shared_ptr<PersonImpl> pImpl;
};
```
主类Person只包含数据成员和指针pImpl，该指针是实现类PersonImpl的智能指针封装，这样PersonImpl类，Date类，Address类可以任意修改，而使用Person类的客户端不必再重新编译，真正实现接口和实现分离。实现这种分离的关键在于将定义依赖替换成声明依赖，最小化编译依赖的基础是让你的头文件自给自足，具体来说包括以下3点：
- 当引用和指针可行时，避免使用对象本身
- 依赖于类定义而不是类定义，注意函数所使用的类不需要类定义，即使该函数按值传递和返回该类：
```cpp
class Date;
Date today();                   // 这两个函数在Date类
void clearAppointmens(Date d);  // 未向前声明下也没问题
```
- 在不同的文件头文件中声明和定义
```cpp
#include "datefwd.h"            // 声明Date类的头文件
Date today();
void clearAppointments(Date d);
```

类似Person的类通常被称为句柄类(handle class)，这种类只调用其他类的接口，因此需要事先声明其他类头文件，如下所示：
```cpp
#include "Person.h"
#include "PersonImpl.h"     // 注意PersonImpl类的接口和Person的完全一致

Person::Person(const std::string& name, const std::Date& birthday, 
               const Address& addr)
               :pImpl(new PersonImpl(name, birthday, addr)) {}

std::string Person::name() const {
    return pImpl->name();
}
```
Person类构造函数调用PersonImpl类构造函数，name方法调用PersonImpl类的name方法，让Person成为句柄类并不改变Person类做什么，只是改变Person怎么做。句柄类的一种替换项是让Person类成为一种称之为接口类(interface class)的特殊抽象基类，接口类的用处是为派生类的接口定义规范，所以通常没有数据成员，没有构造函数，带一个虚析构函数，以及一套定义接口的纯虚函数。**接口类的概念类似于Java和.NET的“接口”，但是C++不像它们严格要求不能有数据成员或者函数实现**，Person的接口类可以是：
```cpp
class Person {
    public:
        virtual ~Person();
        virtual std::string name() const = 0;
        virtual std::string birthDate() const = 0;
        virtual std::string address() const = 0;
    ...
};
```
接口类不能知己实例化，只能以指针或者引用的形式出现，和句柄类一样，接口类的客户端不需要在重新编译，除非接口更改。接口类的使用者必须能够创建新对象，为此通常**使用函数调用来替代构造函数的角色，这种函数通常叫做工厂函数(factory function)或者虚构造函数(virtual constructor)，该函数返回支持接口规范的动态创建对象的指针(最好是智能指针)，通常它被声明为静态的**，如下所示：
```cpp
class Person {
    public:
        ...
        static std::shared_ptr<Person> create(const std::string& name, 
            const std::Date& birthday,          // 这里的create实现到底
            const Address& addr);               // 该怎么写？
    ...
};

std::string name;
Date dateOfBirth;
Address address;

// 创建对象
std::shared_ptr<Person> pp(Person::create(name, dateOfBirth, address));
...
std::cout<<pp->name()
        <<" was born on "
        <<pp->birthDate()
        <<" and now lives at "
        <<pp->address();
...
```
当然支持接口类的具体类必须定义并调用真正的构造函数，如下所示：
```cpp
class RealPerson: public Person {
    public:
        RealPerson()(const std::string& name, const std::Date& birthday, 
               const Address& addr)
               :theName(name), theBirthDate(birthday), theAddress(addr) {}
        virtual ~RealPerson() {}

        std::string name() const;           // 这三个函数的实现
        std::string birthDate() const;      // 代码很简单
        std::string address() const;        // 就不展示了
    private:
        std::string theName;
        Date theBirthDate;
        Address theAddress;
};

std::shared_ptr<Person> Person::create(static std::shared_ptr<Person> create(const std::string& name, 
            const std::Date& birthday, 
            const Address& addr)
{
    return std::shared_ptr<Person>(new RealPerson(name, birthday, addr));       // 返回派生类对象指针
}
```
Person::create更切实的实现方式是根据参数类型，数据库或文件的值，环境变量等创建不同派生类型的对象。这里展示使用继承方式实现接口类，另一种方式是多继承(见Item40)。句柄类和接口类都将接口从实现中解耦，减少文件之间的编译依赖，但都有一定代价：句柄类中方法通过指针来访问实际的数据，增加了一层解引用和指针大小的体积，接口类每个函数都是virtual的，需要查虚函数表间接执行，增加虚函数表指针大小体积，最后两者都不能和内联函数配合使用，内联函数一般把函数定义放在头文件中(Item30)

:::tip 总结
最小化编译依赖的普遍方法是让代码依赖声明而不是定义，基于此有句柄类和接口类两种方式；库头文件应该只是完整的声明，无论是否涉及模板
:::