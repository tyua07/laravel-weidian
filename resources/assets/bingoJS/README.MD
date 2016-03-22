参考文档：[http://bingojs.mydoc.io/](http://bingojs.mydoc.io/)

库包下载：[https://git.oschina.net/bingoJS/bingoJS/blob/master/bingo.full.zip](https://git.oschina.net/bingoJS/bingoJS/blob/master/bingo.full.zip)

Demo:[https://git.oschina.net/bingoJS/bingoJS/tree/master/demo](https://git.oschina.net/bingoJS/bingoJS/tree/master/demo)

更新记录:[http://git.oschina.net/bingoJS/bingoJS/blob/master/history.md](http://git.oschina.net/bingoJS/bingoJS/blob/master/history.md)


####1、关于bingoJS
bingoJS是一个前端MV*开发框架， 致力打造最完善的浏览端JS开发框架，在双向绑定方面提取现有MV框架各种优点，并将模块化开发、按需动态加载、依赖注入、服务化等技术集成到框架，而且对现在所有框架都没任何冲突顺利兼容，让你只需简单配置就可以只关注自己业务代码的编写。


####2、双向绑定
jQuery操作dom开发和双向绑定都是一种手段，而双向绑定可以让html与JS很好分离开来，而不用直接操作dom层，让JS专心处理业务代码（组装显示业务数据）。比如业务系统中会存在大量数据收集和提交，这些场景都非合适用绑定手段，看下面例子实现：
```html
<div bg-action="action1">
    名字：<input bg-model="datas.name" />
    年龄：<input bg-model="datas.age" />
    <button bg-click="save">保存</button>
</div>
<script>
    var action1 = bingo.action(function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });
</script>
```

####3、提供MV*开发模式
MVC是一种开发模式，是一种代码组织和规划方式，可以对开发规范和思维的统一，对前端工程迭代，后期维护，交付变得更容易；跟现有前端MV框架比，**bingoJS**拥有最完善MV*开发模式，可以说没有任何配置就可以实现正常的业务开发：

#### 3.1、支持现在常见的MVVM开发，你可以简单定义一个action进行绑定：
```html
<div bg-action="action1">
    名字：<input bg-model="datas.name" />
    年龄：<input bg-model="datas.age" />
    <button bg-click="save">保存</button>
</div>
<script>
    var action1 = bingo.action(function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });
</script>
```
#### 3.2、支持纯前端MV开发，这时可以认为你服务端代码和浏览端代码完全隔离，即retful+前端MV：
```html
<div bg-action="action/demo/user">
    名字：<input bg-model="datas.name" />
    年龄：<input bg-model="datas.age" />
    <button bg-click="save">保存</button>
</div>
<script>
    bingo.module('demo').action('userInfo', function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });
</script>
```
如果上面代码所示，html与js代码是放一块的，如果感觉比较混乱和后期维护难，我们还可以将它们分开来，框架已经会自动帮你做这些识别：

view/demo/user文件

```html
<div bg-action="action/demo/user">
    名字：<input bg-model="datas.name" />
    年龄：<input bg-model="datas.age" />
    <button bg-click="save">保存</button>
</div>
```

action/demo/user文件

```script

    bingo.module('demo').action('userInfo', function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });

```
你会发现它们的内容是没有任何改变，但完全可以将它们分离开来，这里还有一个route url概念，如果有兴趣可以去看说明文档

#### 3.3、支持纯前端MVC开发，这时前端MV已经不能满足你划分业务复杂度，还需再一步细分，即retful+前端MVC：

view/demo/user/list文件

```html
<div bg-action="action/demo/user/info">
    名字：<input bg-model="datas.name" />
    年龄：<input bg-model="datas.age" />
    <button bg-click="save">保存</button>
</div>
```

action/demo/user文件

```script
bingo.module('demo').controller('user', function () {

    bingo.action('list', function ($view, $ajax) {

    });

    bingo.action('info', function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });
});

```

`如果大家细心会发现，上面无论怎么组织代码都是View与Action一一对应（即html与JS）,我们可以说成view和action，其它都是辅助`



####4、按需加载
- 首先统一前端开发动态加载的资源是什么，本框架指js文件和view模板资源（css有些人认为是，但它动态加载严重影响体验）
- 框架所有动态加载资源都是通过route（路由）进行前端资源url design
- 载模块提供一种最单纯加载机制，就是只负责加载（route转发后的地址加载资源）， 因此是兼容所

有现有的JS库，如果要合并打包也就最低限度设置即可。

```script
//可以按需引用
bingo.using('scripts/plugins/jquery.transit.min.js');
bingo.using('services/userService');

bingo.module('demo').controller('user', function () {

    bingo.action('list', function ($view, $ajax) {

    });

    bingo.action('info', function ($view, $ajax) {

        var datas = {
            name: '',
            age: ''
        };

        $view.save = function () {
            $ajax('/rest/save').param(datas).post();
        };

    });
});

```

可以看见，它们组织思维跟后端代码组织思维很相像，这样开发人员很简单就能过度来开发；

####5、兼容性
在JS方面可以说完全兼容到IE6；在dom管理方除了核心编译部分用了原生外，其它都几乎依赖jQuery写的，所以取决于jQuery版本的兼容;