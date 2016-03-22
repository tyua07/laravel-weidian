介绍
===

## 开始

自动构建curd还只是一个雏形,我会在实际工作当中慢慢的完善它,使它能帮助您快速的构建模块,减少开发周期!(ps:欢迎pr)

## 注意

* 访问地址: 您的网址/auto-build/home
* 请确保您的项目开启debug模式(这个很重要,细节决定成败,永远不要在生产环境开启debug,所以也不要在生成环境上面可以构建curd代码)


## 首页
![效果图](http://7xojjf.com1.z0.glb.clouddn.com/FireShot%20Capture%2060%20-%20%E6%9E%84%E5%BB%BA%E4%BB%A3%E7%A0%81%20-%20http___www.laravel-admin.com_auto-build_home.png)

## 构建Request 配置信息
![效果图](http://7xojjf.com1.z0.glb.clouddn.com/admin%2Fbuild_request_config1.png)

## 构建Controller 配置信息
![效果图](http://7xojjf.com1.z0.glb.clouddn.com/admin%2Fbuild_controller.png)

## 构建CURD 代码
![效果图](http://7xojjf.com1.z0.glb.clouddn.com/admin%2Fbuild.png)


构建request
===

## 支持的验证规则

```

"accepted"          => "请确认接受服务条款",
"active_url"        => "url格式不正确",
"after"             => ["after:%s", "当前时间不能小于%s"],
"before"            => ["before:%s", "当前时间不能大于%s"],
"alpha"             => "必须全部是数字",
"alpha_dash"        => "字母、数字、破折号（-）以及底线（_）",
"alpha_num"         => "必须是字母、数字",
"array"             => "必须是数组",
"between"           => ["between:%d,%d", "必须在%d-%d之间"],
"confirmed"         => ["confirmed_%s", "重复的%s不正确"],
"date"              => "时间格式不正确",
"date_format"       => ["date_format:%s" , "时间格式不正确"],
"different"         => ["different:%s", "不能和%s相同"],
"digits"            => ["digits:%d", "字段必须是数字,并且长度为%d"],
"digits_between"    => ["digits_between:%d,%d", "字段必须是数并，且长度在%d-%d之间"],
"boolean"           => "必须是boolean值",
"email"             => "邮箱格式不正确",
"exists"            => ["exists:%s,%s", "%s不能重复"],
"image"             => "必须是图片",
"in"                => ["in:%s", "必须为%s清单的其中一个值"],
"integer"           => "必须为整数",
"ip"                => "当前ip格式不正确",
"max"               => ["max:%d", "必须大于%d"],
"mimes"             => ["mimes:%s", "文件的Mime类型必须要为%s清单的其中一个值"],
"min"               => ["min:%d", "必须小于%d"],
"not_in"            => ["not_in:%s", "不能在%s其中"],
"numeric"           => "必须是数字",
"regex"             => ["regex:%s", "格式不正确"],
"required"          => ["required:%s", "%s不能为空"],
"url"               => "url格式不正确",

                
```

> Notice : 如果当前数组对应的value是数组,则表示需要有参数填写.例如 "required" 这个验证规则,就需要指明 "xx不能为空"


构建 Controller
===

## 参数说明

参数|说明
---|---
标题|字段的中文标题
表单类型|字段的内容(用于编辑页面和增加页面)
默认值|默认值
表单提示|用于解释表单的段落
class|自定义的class名称
验证错误提示|js验证错误时,提示的文字
是否允许列表页搜索|如果是true表示该字段可以展示在列表页的搜索栏
是否列表页显示|如果是true表示该字段可以展示在列表页

> Notice : 详细每个参数的说明请参考 form 属性章节


执行 构建curd操作
===

## 支持的验证规则

参数|说明
----|----
Request 文件名| Request 保存的的绝对路径
Request 文件标题|用于文件的注释信息
Model 文件名|Model 保存的的绝对路径
Model 文件标题|用于文件的注释信息
Controller 文件名|Controller 保存的的绝对路径
Controller 文件标题|用于文件的注释信息

## 注意

* 文件保存在 ``` stroage/build/output ``` 文件夹下面,需要自己手动拷贝文件到 ``` app ``` 目录下面,然后设置路由
* 如果控制器文件需要设置某些表单为 (radio|selece|checkbox|multiSelect)等类型表单,需要手动设置数据源信息
* js验证规则需要手动设置(后续会修改成在构建Controller配置文件时设置)
* 文档可能还不是很完善,请多多看看源码,谢谢!

## License
MIT