/// <reference path="../services/userService.js" />

bingo.using('service/system/userService');

bingo.module('system', function () {

    bingo.controller('users', function () {

        bingo.action('list', function ($view, userService, $param, $location) {
            $view.$getNode().show();

            $view.list = userService.getUserList();

            $view.info = function (item) {
                $param('info', item);
                $location.href('view/system/users/info');
            };

        });

        bingo.action('info', function ($view, $param) {
            $view.$getNode().show();

            $view.info = $param('info');

        });


    });

});
