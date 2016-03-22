
(function (bingo) {

    /*
        //异步执行内容, 并自动同步view数据
        $timeout(function(){
            $view.title = '我的标题';
        }, 100);
    */
    bingo.factory('$timeout', ['$view', function ($view) {
        /// <param name="$view" value="bingo.view.viewClass()"></param>

        return function (callback, time) {
            return $view.$timeout(function () {
                callback && callback();
            }, time);
        };
    }]);

})(bingo);
