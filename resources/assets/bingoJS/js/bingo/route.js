
(function (bingo) {
    //version 1.0.1
    "use strict";

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
        if (arguments.length == 1)
            return bingo.routeContext(p).toUrl;
        else
            p && context && _routes.add(p, context);
    };

    /*
        //根据url生成routeContext;
        var routeContext = bingo.routeContext('view/system/user/list');
            返回结果==>{
                url:'view/system/user/list',
                toUrl:'modules/system/views/user/list.html',
                params:{ module: 'system', controller: 'user', action: 'list' }
            }
    */
    //
    bingo.routeContext = function (url) {
        return _routes.getRouteByUrl(url);
    };

    /*
        //生成路由地址
        bingo.routeLink('view', { module: 'system', controller: 'user', action: 'list' });
            返回结果==>'view/system/user/list'
    */
    bingo.routeLink = function (name, p) {
        var r = _routes.getRuote(name);
        return r ? _paramToUrl(r.context.url, p, 1) : '';
    };

    /*
        //生成路由地址query
        bingo.routeLinkQuery('view/system/user/list', { id: '1111' });
            返回结果==>'view/system/user/list$id:1111'
    */
    bingo.routeLinkQuery = function (url, p) {
        url || (url = '');
        var urlPath = '';
        if (url.indexOf('$') >= 0 || url.indexOf('?') >= 0) {
            var routeContext = bingo.routeContext(url);
            p = bingo.extend({}, p, routeContext.params.queryParams);
            var sp = url.indexOf('$') >= 0 ? '$' : '?';
            url = url.split(sp)[0];
        }
        bingo.eachProp(p, function (item, n) {
            item = encodeURIComponent(item || '');
            //route参数形式, $aaa:1$bbb=2
            urlPath = [urlPath, '$', n, ':', item].join('');
        });
        return [url, urlPath].join('');
    };

    var _tranAttrRex = /\{([^}]+)\}/gi;
    var _urlToParams = function (url, routeContext) {
        //匹配url, 并生成url参数
        // 如'view/{module}/{contrller}/{action}' ==> {module:'', contrller:'', action:''}
        if (!url || !routeContext.url) return null;
        var matchUrl = routeContext.url;

        //如果包函*符号， 直接认为没有参数， 返回空object
        //if (matchUrl.indexOf('*') >= 0) {
        //    routeContext._reg || (routeContext._reg = new RegExp(matchUrl.replace('*', '.*')));
        //    return routeContext._reg.test(url) ? {} : null;
        //}

        //是否有?*匹配模式
        var isRegMod = bingo.isRegexMapPath(matchUrl);
        if (isRegMod) {
            //去除$后面部分内容, 作为查询条件
            var urlTest = matchUrl.indexOf('$') >= 0 ? matchUrl.split('$')[0] : matchUrl;
            _tranAttrRex.lastIndex = 0;
            urlTest = urlTest.replace(_tranAttrRex, '*');
            routeContext._reg || (routeContext._reg = bingo.makeRegexMapPath(urlTest));
            if (!routeContext._reg.test(url)) return null;
        }

        //url参数部分由$分开， 如aaaa/ssss.html$aaa:1$bb:2
        var urlParams = url.split('$');

        //解释url变量， 如:{module}/{action}/
        var urlList = urlParams[0].split('/'),
            matchUrlList = (routeContext._matchUrlList || (routeContext._matchUrlList = matchUrl.split('/')));
        if (urlList.length != matchUrlList.length) {
            return isRegMod ? {} : null;
        }
        var obj = {},//保存url变量
            isOk = true,//是否全匹配，如果不匹配， 返回null
            sTemp;
        bingo.each(matchUrlList, function (item, index) {
            sTemp = urlList[index];

            //如果没有?和*查询符, 
            if (!(isRegMod && bingo.isRegexMapPath(item))) {
                _tranAttrRex.lastIndex = 0;
                if (_tranAttrRex.test(item)) {
                    obj[item.replace(_tranAttrRex, '$1')] = decodeURIComponent(sTemp || '');
                } else {
                    isOk = (item == sTemp);
                    if (!isOk) return false;
                }

            }
        });

        var queryParams = obj.queryParams = {};

        //如果url匹配， 
        //生成多余参数
        if (isOk && urlParams.length > 1) {
            urlParams = bingo.sliceArray(urlParams, 1);
            bingo.each(urlParams, function (item, index) {
                var list = item.split(':'),
                    name = list[0],
                    val = decodeURIComponent(list[1] || '');
                name && (obj[name] = queryParams[name] = val);
            });
        }

        return isOk ? obj : null;
    }, _getActionContext = function () {
        var context = { app: null, module: null, controller: null, action: null };
        var params = this.params;
        if (params) {
            var appName = params.app;
            var moduleName = params.module;

            var appIn = bingo.isNullEmpty(appName) ? bingo.defaultApp() : bingo.app(appName);
            var moduleIn = bingo.isNullEmpty(moduleName) ? appIn.defaultModule()
                : appIn.module(moduleName);

            var controller = moduleIn ? moduleIn.controller(params.controller) : null;
            var action = controller ? controller.action(params.action) : (moduleIn ? moduleIn.action(params.action) : null);
            context.app = appIn;
            context.module = moduleIn;
            context.controller = controller;
            context.action = action;
        }
        return context;
    }, _makeRouteContext = function (name, url, toUrl, params) {
        //生成 routeContext
        return { name: name, params: params, url: url, toUrl: toUrl, actionContext: _getActionContext };
    }, _paramToUrl = function (url, params, paramType) {
        //_urlToParams反操作, paramType:为0转到普通url参数(?a=1&b=2), 为1转到route参数($a:1$b:2)， 默认为0
        _tranAttrRex.lastIndex = 0;
        if (!url || !params) return bingo.path(url);
        var otherP = '', attr = '', val = '';
        bingo.eachProp(params, function (item, n) {
            attr = ['{', n, '}'].join('');
            val = encodeURIComponent(item || '');

            if (url.indexOf(attr) >= 0) {
                //如果是url变量参数， 如/{module}/{aciont}/aa.txt
                url = bingo.replaceAll(url, attr, val);
            } else if (n != 'module' && n != 'controller' && n != 'action' && n != 'service' && n != 'app' && n != 'queryParams') {
                //如果是其它参数
                if (paramType == 1) {
                    //route参数形式, $aaa:1$bbb=2
                    otherP = [otherP, '$', n, ':', val].join('');
                } else {
                    //普通url参数， ?aaa=1&bbb=2
                    otherP = [otherP, '&', n, '=', val].join('');
                }
            }
        });

        if (otherP) {
            //如果有其它参数， 组装到url参数中
            if (paramType == 1) {
                url = [url, otherP].join('');
            } else {
                if (url.indexOf('?') >= 0)
                    url = [url, otherP].join('');
                else
                    url = [url, otherP.substr(1)].join('?');
            }
        }

        return bingo.path(url);
    };

    var _routes = {
        datas: [],
        defaultRoute: {
            url: '**',
            toUrl: function (url, param) { return url; }
        },
        add: function (name, context) {
            var route = this.getRuote(name);
            if (bingo.isUndefined(context.priority))
                context.priority = 100;
            if (route) {
                route.context = context;
            } else {
                this.datas.push({
                    name: name,
                    context: context
                });
            }
            this.datas = bingo.linq(this.datas).sort(function (item1, item2) { return item2.context.priority - item1.context.priority; }).toArray()
        },
        getRuote: function (name) {
            var item = null;
            bingo.each(this.datas, function () {
                if (this.name == name) { item = this; return false; }
            });
            return item;
        },
        getRouteByUrl: function (url) {
            if (!url) return '';


            var querys = url.split('?');
            if (querys.length > 1) url = querys[0];
            var routeContext = null, name='';
            var params = null;
            bingo.each(this.datas, function () {
                routeContext = this.context;
                params = _urlToParams(url, routeContext);
                //如果params不为null, 认为是要查找的url
                if (params) { name = this.name; return false; }
            });

            //再找组装参数
            if (!params){
                routeContext = _routes.defaultRoute;
                name = 'defaultRoute';
            }
            if (params || routeContext.defaultValue)
                params = bingo.extend({}, routeContext.defaultValue, params);

            if (bingo.isFunction(routeContext.toUrl))
                routeContext.toUrl;


            var toUrl = bingo.isFunction(routeContext.toUrl) ?
                routeContext.toUrl.call(routeContext, url, params)
                : routeContext.toUrl;

            if (querys.length > 1) {
                params || (params = {});
                querys[1].replace(/([^=&]+)\=([^=&]*)/g, function (find, name, value) {
                    params[name] = value;
                });
            }

            var toUrl = _paramToUrl(toUrl, params);

            return _makeRouteContext(name, url,  toUrl, params);
        }
    };

    //设置view资源路由
    bingo.route('view', {
        //优先级, 越大越前, 默认100
        priority: 100,
        //路由url, 如: view/system/user/list
        url: 'view/{module}/{controller}/{action}',
        //路由到目标url, 生成:modules/system/views/user/list.html
        toUrl: 'modules/{module}/views/{controller}/{action}.html',
        //变量默认值, 框架提供内部用的变量: module, controller, action, service
        defaultValue: { module: 'system', controller: 'user', action: 'list' }
    });

    //设置action资源路由
    bingo.route('action', {
        url: 'action/{module}/{controller}/{action}',
        toUrl: 'modules/{module}/controllers/{controller}.js',
        defaultValue: { module: 'system', controller: 'user', action: 'list' }
    });


    //设置viewS资源路由
    bingo.route('viewS', {
        //路由url, 如: view/system/user/list
        url: 'view/{module}/{action}',
        //路由到目标url, 生成:modules/system/views/user/list.html
        toUrl: 'modules/{module}/{action}.html',
        //变量默认值, 框架提供内部用的变量: module, controller, action, service
        defaultValue: { module: 'system', action: 'list' }
    });

    //设置actionS资源路由
    bingo.route('actionS', {
        url: 'action/{module}/{action}',
        toUrl: 'modules/{module}/scripts/{action}.js',
        defaultValue: { module: 'system', action: 'list' }
    });

    //设置service资源路由
    bingo.route('service', {
        url: 'service/{module}/{service}',
        toUrl: 'modules/{module}/services/{service}.js',
        defaultValue: { module: 'system', service: 'user' }
    });

    //设置service资源路由
    bingo.route('serviceS', {
        url: 'service/{service}',
        toUrl: 'modules/services/{service}.js',
        defaultValue: { module: 'system', service: 'user' }
    });

    ////设置src资源路由
    //bingo.route('srv', {
    //    url: 'srv?/{module}/{service}',
    //    defaultValue: { module: 'system', service: 'user' },
    //    toUrl: function (url, params) {
    //        return ['srv', params.module, params.service].join('/');
    //    },
    //});

})(bingo);
