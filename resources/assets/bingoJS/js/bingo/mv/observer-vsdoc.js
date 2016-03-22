//todo:
(function (bingo) {
    //version 1.1.0
    "use strict";

    /*
        观察模式类
    */
    var _observerClass = bingo.Class(function () {
        var _newItem = function (watch, context, callback, deep, disposer) {
            return {
                _callback: callback,
                check: function () { return true;},
                dispose: function () { }
            };
        };

        this.Define({
            unSubscribe: function (callback) {
                /// <summary>
                /// 取消订阅
                /// </summary>
                /// <param name="callback">可选, 不传则取消全部订阅</param>
                return this;
            },
            subscribe: function (context, callback, deep, disposer, priority) {
                /// <summary>
                /// 订阅
                /// </summary>
                /// <param name="context">
                ///     观察内容:
                ///         $view的属性, 如, $view.title = '标题', subscribe('title'....
                ///         方法如果subscribe(function(){ return $view.title;}, .....
                /// </param>
                /// <param name="callback">
                ///     观察到改变后执行的内容
                /// </param>
                /// <param name="deep">是否深层比较, 默认简单引用比较</param>
                /// <param name="disposer">自动释放对象, 必须是bingo.Class定义对象</param>
                /// <param name="priority">优先级, 越大越前, 默认50</param>
                return _newItem(this, context, callback, deep, disposer);
            },
            publish: function () {
                /// <summary>
                /// 发布信息
                /// </summary>
                return this;
            },
            publishAsync: function () {
                /// <summary>
                /// 异步发布信息
                /// </summary>
                return this;
            }
        });


    });

    bingo.observer = function (view) {
        /// <summary>
        /// 获取一个新observer对象
        /// </summary>
        /// <param name="view"></param>
        return _observerClass.NewObject();
    };
    bingo.observer.observerClass = _observerClass;

})(bingo);
