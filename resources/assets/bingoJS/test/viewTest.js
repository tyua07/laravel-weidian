
//测试view的定义，父子关系， 事件处理
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    //bingo.factory(function ($view) {

    //}).inject();

    //定义action1
    window.action1 = bingo.action(function ($view, $tmpl) {

        window.$view = $view;

        $view.text = 'action1';
        console.log('action1 init');

        //数据初始事件， 用于异步加载数据时用
        $view.onInitData(function () {
            console.log('action1 onInitData');
        });

        //$view准备好后事件，在onInitData之后(即等待全部异步数据加载完成)
        $view.onReady(function () {
            console.log('action1 onReady');
        });

        //$view准备好， 并且子孙view也准备好的， 在onReady之后
        $view.onReadyAll(function () {
            console.log('action1 onReadyAll');
        });

        //释放事件
        $view.onDispose(function () {
            console.log('action1 onDispose');
        });

        //在action1里面定义actionChild
        $view.actionChild = bingo.action(function ($view) {


            $view.text = 'actionChild';
            console.log('actionChild init');

            $view.onInitData(function () {
                console.log('actionChild onInitData');
            });

            $view.onReady(function () {
                console.log('actionChild onReady');
            });

            $view.onReadyAll(function () {
                console.log('actionChild onReadyAll');
                //for (var i = 0; i < 100000; i++);
            });

            $view.onDispose(function () {
                console.log('actionChild onDispose');
            });

        });

    });

    //定义action2
    window.action2 = bingo.action(function ($view) {

        $view.text = 'action2';
        console.log('action2 init');

        $view.onInitData(function () {
            console.log('action2 onInitData');
        });

        $view.onReady(function () {
            console.log('action2 onReady');

        });

        $view.onReadyAll(function () {
            console.log('action2 onReadyAll');
        });

        $view.onDispose(function () {
            console.log('action2 onDispose');
        });

    });

})(bingo, window.jQuery);
