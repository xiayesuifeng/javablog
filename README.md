# javablog

> 个人博客 [goblog](https://gitlab.com/xiayesuifeng/goblog) 的 `java` 复刻版
> 仅供参考，不建议用于搭建你自己的个人博客，如要搭建请用 [goblog](https://gitlab.com/xiayesuifeng/goblog)
>
> 因这是曾经的大作业，故相比 `goblog` 增加了没有意义的注册功能，以及 `goblog` 中的评论功能(`goblog` 实现设定在插件机制中)

## 构架

根据 `goblog` ，这仍然是前后分离的项目

> 前端

* 前端使用 `React`
* UI 框架使用 [material-ui](https://material-ui.com)
* 文章编辑器使用 [tui-editor](http://ui.toast.com/tui-editor)
* 使用 `axios` 进行后端 API 请求

> 后端

* 后端使用 `Springboot+mybaits` 纯 API 实现(前端使用 `axios` 进行请求)
* 后端使用 `Hibernate` 初始化数据库表
* Restful 风 API
* json 库使用 google 的 `gson`

## 博客预览( 使用 [goblog](https://gitlab.com/xiayesuifeng/goblog) )
[夏叶随风](https://blog.firerain.me)

## 前端
> `src/main/resources/static` 下为 `npm run build` 编译的产物
前端源码请切换至 [web](https://gitlab.com/xiayesuifeng/javablog/tree/web) 分支

由于该项目的前端是在 `goblog-web` 的旧版的基础上修改而成，以及他们两并不互相兼容并且缺少新版的特性，故要看最新的前端请移步到 [goblog-web](https://gitlab.com/xiayesuifeng/goblog-web.git)

### 配置
> `src/main/resources/application.yml`

```yml
server:
  # 监听端口
  port: 8080
  tomcat.max-threads: 0
  tomcat.uri-encoding: UTF-8

spring:
  application:
    name: blog
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    # 数据库连接字符串，注：在运行前务必手动创建数据库(如下面的数据库名`blog`)，运行时将自动创建数据表
    url: jdbc:mysql://127.0.0.1:3306/blog
    # 数据库用户名
    username: root
    # 数据库密码
    password: 123
  http:
    converters:
      preferred-json-mapper: gson
  jpa:
    hibernate:
        ddl-auto: update

blog:
  # 博客的logo(base64编码)
  logo: data:image/png;base64,...
  # 博客名
  name: javablog
  # 是否开启博客的分类功能
  useCategory: false
```

## License

javablog is licensed under [GPLv3](LICENSE).
