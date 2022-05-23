---
layout: article
title: 构建者模式
slug: /DesignPatterns/CreationalPattern/Builder
tags:
  - Builder Pattern
  - Design Patterns
---

构建者模式(Builder Pattern)将一个**复杂**对象的构建与其表示分离，通过链式方法调用来一步步地创建复杂对象。以一个JDBC配置类JdbcConf为例，其定义如下：

```java
public class JdbcConf {
  /* JDBC连接地址 */
  public String url;
  /* JDBC用户名 */
  public String username;
  /* JDBC密码 */
  public String password;
  /* Getters and Setters */
  ...
}
```

当想要创建一个该配置实例并设置字段时，代码如下：

```java
JdbcConf conf = new JdbcConf();
conf.setUrl("jdbc://localhost:3306/kayhaw");
conf.setUsername("kayhaw");
conf.setPassword("kayhaw123");
```

现在配置项新增了**可选的**查询sql语句、前置sql语句、后置sql语句，配置规则也更加复杂：创建JdbcConf对象调用更多的setter方法，可选项可以不设置。此时Builder模式派上用场。

## 简单Builder模式

简单Builder模式的实现步骤及其代码如下所示：

1. 目标类添加一个静态内部类Builder，其字段和生成类相同；
2. 目标类添加只带一个Builder参数的构造器，将Builder字段值赋值给目标类；
3. Builder类提供字段setter方法，注意setter方法返回值为Builder自身；
4. Builder类提供build方法调用目标生成类带builder参数的构造器。

```java
public class JdbcConf {
  /* JDBC连接地址 */
  private String url;
  /* JDBC用户名 */
  private String username;
  /* JDBC密码 */
  private String password;

  private JdbcConf(Builder builder) {
    this.url = builder.url;
    this.username = builder.username;
    this.password = builder.password;
  }

  public static class Builder {
    private String url;
    private String username;
    private String password;

    public Builder setUrl(String url) {
      this.url = url;
      return this;
    }

    public Builder setUsername(String username) {
      this.username = username;
      return this;
    }

    public Builder setPassword(String password) {
      this.password = password;
      return this;
    }

    public JdbcConf build() {
      return new JdbcConf(this);
    }
  }
}

JdbcConf conf = new JdbcConf.Builder()
                            .setUrl("jdbc://localhost:3306/kayhaw")
                            .setUsername("kayhaw")
                            .setPassword("kayhaw123")
                            .build();
```

可以看到，用户只许自行选择调用setter方法，最后调用build方法就得到装配好的对象，链式调用也比多行的setter调用更加简洁。此外，还可以给JdbcConf字段加上final修饰，确保状态不可变。

## GoF Builder模式

相比于简单Builder模式，《设计模式》一书中给出的Builder模式(这里称之为GoF Builder)稍微复杂些，增加了Director和ConcreteBuilder两个角色，如下UML图所示：

![builder-pattern.svg](/img/notes/designpatterns/builder-pattern.svg)

首先是Direct类，由它来调用Builder类的各个构建方法(传参固定?:confused:)：

```java title=Director.java
public class Director {
    private Builder builder;

    public Director(Builder builder) {
        this.builder = builder;
    }

    public void construct() {
        builder.reset();
        builder.setUrl("jdbc://localhost:3306/kayhaw");
        builder.setUsername("kayhaw");
        builder.setPassword("kayhaw123");
    }
}
```

其次是Builder抽象类，它定义了各个setter方法和build方法：

```java title=Builder.java
public abstract class Builder {
    public abstract void reset();
    public abstract void setUrl(String url);
    public abstract void setUsername(String username);
    public abstract void setPassword(String password);

    public abstract JdbcConf build();
}
```

接着是Builder抽象类的实现子类JdbcBuilder，它实现了抽象Builder类的setter方法：

```java title=JdbcBuilder.java
public class JdbcBuilder extends Builder {
    private JdbcConf conf;

    public JdbcBuilder() {
        this.conf = new JdbcConf();
    }

    @Override
    public void reset() {
        this.conf = new JdbcConf();
    }

    @Override
    public void setUrl(String url) {
        this.conf.setUrl(url);
    }

    @Override
    public void setUsername(String username) {
        this.conf.setUsername(username);
    }

    @Override
    public void setPassword(String password) {
        this.conf.setPassword(password);
    }

    @Override
    public JdbcConf build() {
        JdbcConf conf = this.conf;
        this.reset();
        return conf;
    }
}
```

基于此的Builder模式使用代码如下：

```java title=Application.java
public class Application {
    public static void main(String[] args) {
        Builder builder = new JdbcBuilder();
        Director director = new Director(builder);
        director.construct();
        JdbcConf conf = builder.build();
    }
}
```

实际场景中多会使用简化版的Builder模式实现而不是GoF Builder模式，因为后者用起来更复杂。

## Builder模式与类继承

在**简单Builder模式**下，假设JdbcConf派生出子类MysqlConf，添加一些MySQL相关配置，此时Builder模式如何实现？这里给出两种实现方式：重写父类setter方法和使用泛型。

### 重写父类setter方法

如果让MysqlConf.Builder直接继承JdbcConf.Builder，在调用JdbcConf.Builder的setter方法后，返回的Builder类型为JdbcConf.Builder，这意味着不能再调用MysqlConf.Builder的setter方法。此时对setter链式调用的顺序有要求，不能先调用父类Builder的setter方法。为了解决这个问题，子类Builder可以重写父类Builder的setter方法，将其返回值类型改为子类Builder，如下代码所示：

```java title=JdbcConf.java
public class JdbcConf {
    /* JDBC连接地址 */
    private String url;
    /* JDBC用户名 */
    private String username;
    /* JDBC密码 */
    private String password;

    protected JdbcConf(Builder builder) {
        this.url = builder.url;
        this.username = builder.username;
        this.password = builder.password;
    }

    public static class Builder {
        private String url;
        private String username;
        private String password;

        public Builder setUrl(String url) {
            this.url = url;
            return this;
        }

        public Builder setUsername(String username) {
            this.username = username;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public JdbcConf build() {
            return new JdbcConf(this);
        }
    }
}
```

```java title=MysqlConf.java
public class MysqlConf extends JdbcConf {
    private String preSql;

    private MysqlConf(Builder builder) {
        super(builder);
        this.preSql = builder.preSql;
    }

    public static class Builder extends JdbcConf.Builder {
        private String preSql;

        Builder setPreSql(String preSql) {
            this.preSql = preSql;
            return this;
        }

        @Override
        public JdbcConf.Builder setUrl(String url) {
            super.setUrl(url);
            return this;
        }

        @Override
        public JdbcConf.Builder setUsername(String username) {
            super.setUsername(username);
            return this;
        }

        @Override
        public JdbcConf.Builder setPassword(String password) {
            super.setPassword(password);
            return this;
        }

        public MysqlConf build() {
            return new MysqlConf(this);
        }
    }
}
```

### 泛型Builder类

仔细分析继承父类Builder后会导致问题的根本原因：调用父类Builder的setter方法后，返回的是父类Builder，导致找不到子类Builder的setter方法。重写父类Builder的setter方法就是直接修改返回类型，但是重写代码太多很容易忘记。如果就想复用父类Builder的代码又让返回类型能够动态改变，该怎么实现？泛型刚好满足这个条件啊，使用泛型参数作为返回类型不就可以吗！实现代码如下所示：

```java title=JdbcConf.java
public class JdbcConf {
    /* JDBC连接地址 */
    private String url;
    /* JDBC用户名 */
    private String username;
    /* JDBC密码 */
    private String password;

    protected JdbcConf(Builder builder) {
        this.url = builder.url;
        this.username = builder.username;
        this.password = builder.password;
    }

    public abstract static class Builder<T extends Builder<T>> {
        private String url;
        private String username;
        private String password;

        public abstract T self();

        public T setUrl(String url) {
            this.url = url;
            return self();
        }

        public Builder setUsername(String username) {
            this.username = username;
            return self();
        }

        public Builder setPassword(String password) {
            this.password = password;
            return self();
        }

        public JdbcConf build() {
            return new JdbcConf(this);
        }
    }
}
```

```java title=MysqlConf.java
public class MysqlConf extends JdbcConf {
    private String preSql;

    private MysqlConf(Builder builder) {
        super(builder);
        this.preSql = builder.preSql;
    }

    public static class Builder extends JdbcConf.Builder<Builder> {
        private String preSql;

        Builder setPreSql(String preSql) {
            this.preSql = preSql;
            return this;
        }

        @Override
        public Builder self() {
            return this;
        }

        public MysqlConf build() {
            return new MysqlConf(this);
        }
    }
}
```

这里的泛型类Builder比较抽象，源自于C++的递归模板模式(Curiously Recurring Template Pattern, CRTP)：泛型类的泛型参数又和泛型类自身有关。另外的关键点是**抽象方法**self()，它必须由子类实现以返回子类Builder，从而解决Builder类继承带来的返回类型不正确问题。
