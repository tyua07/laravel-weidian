
(function (bingo) {

    /*
        与bg-route同用, 取bg-route的url等相关
        $location.href('view/system/user/list');
        var href = $location.href();
        var params = $location.params();
    
    
        $location.onChange请参考bg-route定义
    */
    var _routeCmdName = 'bg-route',
        _dataKey = '_bg_location_';

    //bingo.location('main') 或 bingo.location($('#id')) 或 bingo.location(docuemnt.body)

    bingo.location = function (p) {
        /// <summary>
        /// location 没有给删除如果dom在一直共用一个
        /// </summary>
        /// <param name="p">可选，可以是字串、jquery和dom node, 默认document.documentElement</param>
        /// <returns value='_locationClass.NewObject()'></returns>
        bingo.isString(p) && (p = '[bg-name="' + p + '"]');
        var $node = null;
        if (bingo.isString(p))
            $node = $(p);
        else if (p)
            $node = $(p).closest('[' + _routeCmdName + ']')

        var isRoute = $node && $node.size() > 0 ? true : false;
        if (!isRoute)
            $node = $(document.documentElement);

        var o = $node.data(_dataKey);
        if (!o) {
            o = _locationClass.NewObject().ownerNode($node).linkToDom($node).isRoute(isRoute).name($node.attr('bg-name')||'');
            $node.data(_dataKey, o);
        }
        return o;
    };

    bingo.location.onHref = bingo.Event();
    bingo.location.onLoaded = bingo.Event();

    var _locationClass = bingo.location.Class = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Prop({
            ownerNode: null,
            //是否路由出来的
            isRoute: false,
            name:''
        });

        this.Define({
            //路由query部分参数
            queryParams: function () {
                return this.routeParams().queryParams
            },
            //路由参数
            routeParams: function () {
                var url = this.url();
                var routeContext = bingo.routeContext(url);
                return routeContext.params;
            },
            href: function (url, target) {
                var frame = bingo.isNullEmpty(target) ? (this.isRoute() ? this.ownerNode() : null) : $('[' + _routeCmdName + '][bg-name="' + target + '"]');
                if (frame && frame.size() > 0) {
                    frame.attr(_routeCmdName, url).trigger('bg-location-change', [url]);
                }
                return this;
            },
            reload: function (target) {
                return this.href(this.url(), target);
            },
            onChange: function (callback) {
                var $this = this;
                this.isRoute() && callback && this.ownerNode().on('bg-location-change', function (e, url) {
                    callback.call($this, url);
                });
            },
            onLoaded: function (callback) {
                var $this = this;
                this.isRoute() && callback && this.ownerNode().on('bg-location-loaded', function (e, url) {
                    callback.call($this, url);
                    bingo.location.onLoaded.trigger([$this]);
                });
            },
            url: function () {
                if (this.isRoute())
                    return this.ownerNode().attr(_routeCmdName);
                else
                    return window.location + '';
            },
            toString: function () {
                return this.url();
            },
            views: function () {
                return bingo.view(this.ownerNode()).$children;
            },
            close: function () {
                if (!this.isRoute()) return;
                if (this.trigger('onCloseBefore') === false) return;
                this.ownerNode().remove();
            },
            onCloseBefore: function (callback) {
                return this.on('onCloseBefore', callback);
            },
            onClosed: function (callback) {
                if (this.__closeed !== true) {
                    this.__closeed = true;
                    this.onDispose(function () {
                        this.trigger('onClosed');
                    });
                }
                return this.on('onClosed', callback);
            }
        });

    });

    bingo.factory('$location', ['node', function (node) {

        return bingo.location(node);

    }]);

})(bingo);
