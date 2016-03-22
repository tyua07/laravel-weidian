
(function (bingo) {

    /*
        //1. 添加或设置路由'view'
        bingo.route('view', {
            //优先级, 越大越前, 默认100
            priority: 100,
            //路由地址
            url: 'view/{module}/{controller}/{action}',
            //路由转发到地址
            toUrl: 'modules/{module}/views/{controller}/{action}.html',
            //默认值
            defaultValue: { module: '', controller: '', action: '' }
        });

        //2. 根据url生成目标url;
            var url = bingo.route('view/system/user/list');
                返回结果==>'modules/system/views/user/list.html'
    */
    //路由
    bingo.route = function (p, context) {
        /// <signature>
        /// <summary>
        /// 取得路径
        /// </summary>
        /// <param name="url" type="String">route url: view/system/user/list</param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 添加或设置路由
        /// </summary>
        /// <param name="name" type="String">路由名称， 如果已经存在为修改路由</param>
        /// <param name="context" type="Object">路由参数, {url:'view/{module}', toUrl:'', defaultValue:{}}, toUrl可以为function(url, params)</param>
        /// </signature>
        if (arguments.length == 1)
            return '/';
    };

    var _getActionContext = function () {
        
        return {
            app:bingo.defaultApp(),
            module: bingo.defaultModule(),
            controller: bingo.defaultModule().controller('_getActionContext'),
            action: function () { }
        };
    };
    /*
        //根据url生成routeContext;
        var routeContext = bingo.routeContext('view/system/user/list');
            返回结果==>{
                url:'view/system/user/list',
                toUrl:'modules/system/views/user/list.html',
                params:{ module: 'system', controller: 'user', action: 'list', queryParams:{} }
            }
    */
    //

    bingo.routeContext = function (url) {
        /// <summary>
        /// 根据route url取得解释结果<br />
        /// bingo.routeContext('view/system/user/list')
        /// </summary>
        /// <param name="url"></param>
        return { name: 'view', params: { queryParams: {} }, url: '/', toUrl: '/', actionContext: _getActionContext };
    };

    /*
        //生成路由地址
        bingo.routeLink('view', { module: 'system', controller: 'user', action: 'list' });
            返回结果==>'view/system/user/list'
    */
    bingo.routeLink = function (name, p) {
        /// <summary>
        /// 根据路由参数， 生成路由地址：view/system/user/list<br />
        /// bingo.routeLink('view', { module: 'system', controller: 'user', action: 'list' })
        /// </summary>
        /// <param name="name">路由名称</param>
        /// <param name="p">参数， { module: 'system', controller: 'user', action: 'list' }</param>
        return '/';
    };

    /*
    //生成路由地址query
    bingo.routeLinkQuery('view/system/user/list', { id: '1111' });
        返回结果==>'view/system/user/list$id:1111'
    */

    bingo.routeLinkQuery = function (url, p) {
        /// <summary>
        /// 生成路由地址query <br />
        /// bingo.routeLinkQuery('view/system/user/list', { id: '1111' })
        /// </summary>
        /// <param name="url"></param>
        /// <param name="p"></param>
        return '/';
    };

})(bingo);
