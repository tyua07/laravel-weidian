/// <reference path="../../services/userService.js" />

bingo.using('service/userService');

bingo.module('system', function () {

    bingo.action('userList', function ($view, userService) {
        $view.$getNode().show();

        $view.list = userService.getUserList();

    });

});