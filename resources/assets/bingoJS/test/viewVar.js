/// <reference path="lib.js" />

//测试bingo.variable的作用
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    //定义action1
    window.actionVar = bingo.action(function ($view, $var, $model) {
        window.$view = $view;

        $view.v = 1;
        $view.var1 = $var('11');

        $view.m = $model({a:1, b:2});

        $view.var1.$subs(function (value) {
            $view.v = '111' + value;
        });
    });

})(bingo, window.jQuery);
