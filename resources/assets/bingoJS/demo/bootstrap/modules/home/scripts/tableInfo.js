/// <reference path="../../../bingojs/site.js" />

(function (bingo, $) {
    "use strict";

    bingo.module('home', function () {

        bingo.action('tableInfo', function ($view, $location, $param) {
            $view.$getNode().show();

            $view.info = $param('info');

            $view.save = function () {
                $location.href('view/home/table');
                return false;
            };


        });

    });

})(bingoV1, window.jQuery);
