

var actionMain = bingo.action(function ($view, $var) {

    $view.listType = $var('userList');

});

var userListAction = bingo.action(function ($view) {
    $view.$getNode().show();

    $view.list = [{
        id: 1,
        name: '张三',
        role: '管理员'
    }, {
        id: 2,
        name: '李四',
        role: '测试员'
    }];
});

var roleListAction = bingo.action(function ($view) {
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
});
