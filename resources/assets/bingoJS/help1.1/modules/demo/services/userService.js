
(function () {
    'use strict';

    bingo.module('demo').service('userService', function ($view) {

        return {
            getUserDatas: function () {
                return [{ id: 1, name: '张三' }, { id: 2, name: '李四' }];
            }
        };

    });

})();
