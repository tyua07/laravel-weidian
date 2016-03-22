
bingo.service('userService', function () {
    return {
        getUserList: function () {
            return [{
                id: 1,
                name: '张三',
                role: '管理员'
            }, {
                id: 2,
                name: '李四',
                role: '测试员'
            }];
        }
    };
});