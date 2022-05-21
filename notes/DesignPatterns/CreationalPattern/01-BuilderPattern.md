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

  public static Builder {
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

## GOF Builder模式

相比于简单Builder模式，《设计模式》一书中给出的Builder模式(这里称之为GOF Builder)稍微复杂些：增加了Director和ConcreteBuilder两个角色。

## Builder模式与类继承

在**简单Builder模式**下，假设JdbcConf派生出子类MysqlConf，添加一些MySQL相关配置，此时Builder模式如何实现？这里给出两种实现方式：重写父类setter方法和使用泛型。

### 重写父类setter方法

### 泛型Builder类
