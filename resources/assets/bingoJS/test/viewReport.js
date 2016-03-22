/// <reference path="lib.js" />

//打印view 结构
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    //定义action1
    window.actionReport1 = bingo.action(function ($view) {

        window.$view = $view;

        $view.text = 'actionReport1';


        //$view准备好， 并且子孙view也准备好的， 在onReady之后
        $view.onReadyAll(function () {

            mvcTest.reportViewJson();
            mvcTest.reportView();
        });

        //在action1里面定义actionChild
        $view.actionReportChild = bingo.action(function ($view) {

            $view.text = 'actionReportChild';

        });

    });

    //定义action2
    window.actionReport2 = bingo.action(function ($view) {

        $view.text = 'actionReport2';

        $view.click = function () {
            $view.$getNode().remove();
            mvcTest.reportViewJson();
            mvcTest.reportView();
        };

    });

})(bingo, window.jQuery);
