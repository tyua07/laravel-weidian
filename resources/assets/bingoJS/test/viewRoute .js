/// <reference path="lib.js" />

//测试route
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    //设置view资源路由
    bingo.route('view', {
        //路由url, 如: view/system/user/list
        url: 'view/{controller}/{action}',
        //路由到目标url, 生成:modules/system/views/user/list.html
        toUrl: 'test/view/{controller}/{action}.html',
        //变量默认值, 框架提供内部用的变量: module, controller, action, service
        defaultValue: { module: 'test', controller: 'user', action: 'list' }
    });

    //设置action资源路由
    bingo.route('action', {
        url: 'action/{controller}/{action}',
        toUrl: 'test/controller/{controller}.js',
        defaultValue: { module: 'test', controller: 'user', action: 'list' }
    });

    //设置service资源路由
    bingo.route('service', {
        url: 'service/{service}',
        toUrl: 'test/service/{service}.js',
        defaultValue: { module: 'test', service: 'userService' }
    });

})(bingo, window.jQuery);
