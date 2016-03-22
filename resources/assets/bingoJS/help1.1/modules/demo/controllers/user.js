/// <reference path="../services/userService.js" />

//引用userService
bingo.using('service/demo/userService');

(function () {
    'use strict';

    bingo.module('demo').controller('user', function () {

        bingo.action('list', function ($view, $location, $param, userService) {
            $view.title = '用户列表';

            //从userService取得用户数据
            $view.userList = userService.getUserDatas();

            $view.showForm = function (user) {
                //设置user信息到param
                $param('userinfo', user);
                //连接到user/form
                $location.href('view/demo/user/form');
            };
        });

        bingo.action('form', function ($view, $location, $param) {
            $view.title = '用户信息'

            //从$param取得user信息,
            //注意$param userinfo会自动清除，即再次使用$param('userinfo')已经为undefined
            $view.userInfo = $param('userinfo');

            $view.backList = function () {
                //返回user/list
                $location.href('view/demo/user/list');
            };

        });

    });

})();
