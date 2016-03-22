bingo.module('system', function () {

    bingo.controller('roles', function () {

        bingo.action('list', function ($view, $param, $location) {
            $view.$getNode().show();

            $view.list = [{
                id: 1,
                name: '管理员',
                desc: '系统管理'
            }, {
                id: 2,
                name: '测试员',
                desc: '系统测试'
            }];

            $view.info = function (item) {
                $param('info', item);
                $location.href('view/system/roles/info');
            };

        });

        bingo.action('info', function ($view, $param) {
            $view.$getNode().show();
            $view.info = $param('info');

        });


    });

});
