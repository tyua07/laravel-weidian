#### 1.2.0
1. 修正model.toObject输出内部属性问题

2. 修正render for后with数据不准确问题

3. 添加view.onInitDataSrv事件， 添加一个粒度初始数据, 用于服务或factory初始数据：onInitDataSrv --> onInitData --> onReady

4. 对所有功能进行了测试、优化与适当代码调整

5. 同步更新文档

#### 1.1.0821
1. 删除Class clone方法, clone情况比较复杂，现在只简单提供$prop方法代替

2. 添加Class $prop方法, 设置或获取Prop所有属性

```script
var o = bingo.Class.Base.NewObject();
var prop = o.$prop();
var o111 = bingo.Class.Base.NewObject();
o111.$prop(prop);
```

3.添加ajax方法fromOther，从其它ajax设置属性

```script
var ajax1 = bingo.ajax.ajaxClass.NewObject()
var ajax2 = bingo.Class.Base.NewObject();
ajax2.fromOther(ajax1);
```

4. 删除ajax.deferred方法

5. 优化编译

6. 优化bg-for/bg-render

7. 增强linq的where和select

8. 将$attr.$prop方法改为$attrValue

9. 开放以下开关

```script
bingo.supportWorkspace开关, 支持chorme workspace开发, 默认false

//tmpl缓存正则
bingo.compile.tmplCacheMetas = /\.(htm|html|tmpl|txt)(\?.*)*$/i;

//过滤器正则
bingo.filter.regex = /[|]+[ ]?([^|]+)/g;

//render正则
bingo.render.regex = /\{\{\s*(\/?)(\:|if|else|for|tmpl|header|footer|empty|loading)(.*?)\}\}/g;
```

10. $attr添加onChange和onInit事件，用于$attr之间协同

11. model 添加toDefault方法

12: 添加view注释支持，<!--# comment-->

#### 1.1.0804
1. 优化factory

2. 添加factoryExtend
```script
bingo.factoryExtend('$view', function($view){
    //对$view扩展testEx属性
    $view.testEx = 'test';
});
```

3. 添加bg-render-include和bg-render-if模板标签，支持其内容为render模板
```script
<div bg-render-if="true">
    <script type="text/html">
        {{for item in list}}
            {{: item.id}}:{{: item.name}}
        {{/for}}
    </script>
</div>
```

4. 添加类的onInit和onDispose统一对类初始和销毁扩展
```script
bingo.view.viewClass.onInit(function (obj) {
    obj.onReady(function () {
    });
});
```

5. 添加模板指令bg-action-add
```html
<div bg-action="action1" bg-action-add="action2">
    <div bg-action-add="action3"></div>
</div>
```

6. 添加render属性 $parent/$index/$count/$last/$first/$odd/$even

7. 添加模板指令text/bg-script
```html
<script type="text/bg-script">
    $view.onReady(function(){
        console.log('ready html');
    });
</script>
```

8. 添加模板指令bg-not-compile,  不编译下级提高编译速度
```html
<div bg-not-compile>
    下面不会编译
</div>
```

9. 添加$subs支持优先级参数

10. 修复render 无限循环bug

11. 注入inject添加参数retAll, 是否返回注入全部结果，返回Object, 默认false
```script
bingo.factory('$view').inject(null, true)
```

12. 添加view.onActionBefore事件

13. 修复$view readyAll有时触发

14: 提升编译速度

#### 1.1.720
1.加强模板指令定义属性compilePre, 可以实现模板指令组合,如下面组合bg-render和bg-model
```script
bingo.command('bg-select', function () {
    return {
        compilePre: function ($node) {
            var attrValue = $node.attr('bg-select');
            $node.attr('bg-render', ['item in ', attrValue, '.list'].join(''));
            $node.attr('bg-model', [attrValue, '.id'].join(''));
        }
    };
});
```

2. 优化observer机制

3. 添加对app支持,不影响之前使用，用于解决多前端项目合并时module冲突问题，建议使用app， 一个项目对应一个app
```script
bingo.app('myApp').module('myModuel', function(){
  bingo.action('myAction', function($view){
  
  });
});

```

4. 添加routeLinkQuery方法
```script
/*
//生成路由地址query
bingo.routeLinkQuery('view/system/user/list', { id: '1111' });
    返回结果==>'view/system/user/list$id:1111'
*/
```

5.location添加routeParams方法代替原来的queryParams， queryParams只获取url query部分参数

6.添加linq方法index, 返回索引
```script
bingo.linq([1, 2, 3]).where(function (item) { return item == 2; }).index()
```

#### 1.1.713
1. 添加service和factory名称，如果$不是第一位，认为包函module名称, 如: demo$testSrv认为module('demo').serivce('testSrv')

```script
//定义demo/testSrv
module('demo').serivce('testSrv', function(){
    return {test:function(){}};
});

bingo.using('sevices/demo/testSrv');
//使用demo/testSrv
bingo.action(function (demo$testSrv) {
    demo$testSrv.test();
});
```

2. 优化编译机制

3. 优化ajax缓存机制

4. 添加ajax holdParams属性处理参数问题
```script
bingo.ajax('').holdParams(function () {
    //param 可以改变param内容
    return this.param()
})
```
5. 添加$attr.$resultsNoFilter和$attr.$getValNoFilter方法，提升variable绑定性能

==============================文档

6. 添加bg-enabled模板指令

7. bg-html 支持自动编译html内容(原来不编译)， 如果不想自动编译请用{{}}标签

#### 1.1.0629
1. 优化代码

2. 添加ready方法，代表bingo已经准备好了。
```script
bingo.ready(function(){
  //准备好，得相关逻辑
});
```

3. 添加bingo.location.onHref和bingo.location.onLoaded事件
```script
//监测href
bingo.location.onHref(function(jNode, url, target){
    var $loc = bingo.location(jNode);
    $loc.href(href, target);
    return false;//如果返回false, 取消默认逻辑
});

//监测所有loaction的onLoaded
bingo.location.onLoaded(function(location){
  
});
```

4.修复绑定时this问题(少用)

#### 1.1.0623

1.complies 添加async属性

2.添加bg-route-loaded模板指令, 处理bg-route加载完成
```html
var lcLoad = function(){
    var location = this;
    var url = location.url();
};
<div bg-route="view/user/form1" bg-name="main"
            bg-route-load="lcLoad">
```

3.支持action js代码与view html模板混合
```html
<div bg-action="action/demo/user/list">
    {{title}}
    <div bg-text="title"></div>
    <div bg-text2="title"></div>
    <a href="#view/user/form2">to form2</a>
    <script type="text/javascript">
        bingo.module('demo').controller('user').action('list', function(){
            console.log('user list'+bingo.makeAutoId());
        });
    </script>
</div>
```

4.添加demo, 如何结合bootstrap只需简单搭建bingoJS就可以正常开发业务


#### 1.1.0615
1.添加ajaxClass.holdServer
```script
bingo.ajax.ajaxClass.holdServer = function (ajax, response, isSuccess, xhr) {
    //isSuccess: true or false
    //response 可以改变response内容
    return [response, isSuccess, xhr];
}

```

2.处理bingo多版本共存问题, 以下这种方式处理共存问题
```script
(function(bingo){

    bingo.trim('');

})(bingoV1);//bingo或bingoV1或bingoV1_1两种，注意根据版本引用
```

3.添加支持script标签支持，但只用做模板用，和replace=true本合使用
```html
<script type="text/html" bg-miniTable>
    <columns>
        <item formator="dddd">aaa</item>
        <item formator="dddd" name="bbb" text="aaa">bbb</item>
    </columns>
</script>
```

4. 强化bingo.model
5. 解决ajax请求error时，$view.onReady事件没有发出问题
6. 优化observer
7. 添加事件
8. 添加clearObject对子object.$clearAuto支持
9. 优化bingo.compile, 并onCompilePre和onCompiled事件传送参数为一个jQuery对象
10. 增强模板指令bg-route与location, location: 添加views方法，修改frame为ownerNode, 将bg-route-name统一改为bg-name, 将params修改为queryParams), 添加close方法,onCloseBefore和onClosed事件, 添加isRoute和name属性



#### 1.1.0604
1.添加module.action支持即支持下面三种action方式
```script
//定义action1
var action1 = bingo.action(function($view){
});

bingo.module('demo', function(){

    //定义demo/index action
    bingo.action('index', function($view){
    });

    bingo.controller('user', function(){

        //定义demo/user/list action
        bingo.action('list', function($view){
     
        });
    
        //定义demo/user/info action
        bingo.action('info', function($view){
     
        });
    
    });

});

```
