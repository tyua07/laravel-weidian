
(function (bingo) {
    //version 1.0.1
    "use strict";
    var undefined;

    var _loadedJS = [], //已经加载的js
        _loadingJS = [], //加载中的js
        _squareJS = [], //预备的js
        _loadingCallback = [[],[]]; //加载中的callback

    var _inArray = function (element, list) {
        return bingo.inArray(function (item) { return bingo.isStringEquals(item, element); }, list);
    };

    var _hasJS = function (js) {
        return (_inArray(js, _loadedJS) >= 0
            || _inArray(js, _loadingJS) >= 0
            || _inArray(js, _squareJS) >= 0);
    };

    var _loadFun = function (jsList, callback, pos) {
        !bingo.isNumeric(pos) && (pos = bingo.usingPriority.Normal);

        _makeNeedList(jsList);

        _loadingCallback[pos] || (_loadingCallback[pos] = []);

        _loadingCallback[pos].push(callback);
        if (_squareJS.length > 0) {
            _loadJS();
        } else {
            //如果没有js, 或js已经加载
            setTimeout(function () {
                if (_isLoadEnd())
                    _endDone();
            }, 1);
        }
        //callback = jsList = null;
    },
    _makeNeedList = function (jsList) {
        var pathTemp = bingo.stringEmpty;
        bingo.each(jsList, function (pathItem) {
            if (bingo.isNull(pathItem)) return;
            pathTemp = bingo.route(pathItem);

            //路由
            pathTemp = _getMapPath(pathTemp);
            //如里有prdtVersion, 添加prdtVersion, query
            if (!bingo.supportWorkspace && !bingo.isNullEmpty(bingo.prdtVersion))
                pathTemp = [pathTemp, pathTemp.indexOf('?') >= 0 ? '&' : '?', '_version_=', bingo.prdtVersion].join('');

            //js文件是否已经存在
            if (!_hasJS(pathTemp)) {
                _squareJS.push(pathTemp); //加入预备
            }

        });
    };
    //var _isloading = false;
    var _loadJS = function () {
        //console.log("_loadJS", _squareJS, _loadingJS, _loadedJS);
        if (_squareJS.length > 0) {
            var squareJSTemp = _squareJS;
            _squareJS = [];//清空_squareJS
            bingo.each(squareJSTemp, function (path) {
                _loadingJS.push(path);//放入_loadingJS
                bingo.fetch(path, _fetchCallback);
            });
        }
    };
    var _isLoadEnd = function () {
        return (_squareJS.length <= 0 && _loadingJS.length <= 0);
    };
    var _fetchTimeId = undefined;
    var _fetchCallback = function (url, id) {
        _loadedJS.push(url);//放入_loadedJS
        _loadingJS = bingo.removeArrayItem(url, _loadingJS);//从_loadingJS删除

        if (_fetchTimeId != undefined)
            clearTimeout(_fetchTimeId);
        _fetchTimeId = setTimeout(function () {
            _fetchTimeId = undefined;
            if (_isLoadEnd()) {
                _endDone();
            }
        }, 5);

    };
    var _endDone = function () {
        var isAllDone = true;
        bingo.each(_loadingCallback, function (item , pos) {
            var loadingCallbackTemp = _loadingCallback[pos];//.reverse();
            _loadingCallback[pos] = [];
            bingo.each(loadingCallbackTemp, function (callback) {
                if (bingo.isFunction(callback))
                    callback();
            });
            if (_loadingCallback[pos].length > 0) {
                isAllDone = false;
                return false;
            }
        });

        //如果没有全部运行
        if (!isAllDone) {
            //如果加载完成, 没有新的js加载
            if (_isLoadEnd()) {
                _endDone();
            }
        }
    };

    //map========================================
    var _mapList = [],    //{path:"", mapPath:""}
        _createMapItem = function (mapPath, path) {
            return { path: path, mapPath: mapPath, pathReg: _makeRegexMapPath(path) };
        },
        _addMap = function (mapPath, path) {

            mapPath = bingo.route(mapPath);
            path = bingo.route(path);

            var oldmap = _getMap(path);
            if (bingo.isNull(oldmap)) {
                _mapList.push(_createMapItem(mapPath, path));
            } else {
                oldmap.mapPath = mapPath;
            }
        },
        _getMap = function (path, checkReg) {
            var index = bingo.inArray(function (item) {
                if (checkReg === true && item.pathReg) {
                    item.pathReg.lastIndex = 0;
                    return item.pathReg.test(path);
                }
                else
                    return bingo.isStringEquals(item.path, path);
            }, _mapList);
            return index >= 0 ? _mapList[index] : null;
        },
        _getMapPath = function (path) {
            var mapItem = _getMap(path, true);
            return (mapItem && mapItem.mapPath) || path;
        };

    
    //makeRegexMapPath
    var _makeRegexPath = /(\W)/g,
        _makeRegexPathSS = /(\\([?*]))/g,//查找 ?和*符号
        _makeRegexPathAll = /\\\*\\\*/g,//查找 ?和*符号
        _urlQueryPart = /\?[^?=]+\=.*$/,//查找query部分, ?aaa=111&b=222
        _hasRegPath = /[?*]+/,
        _isRegexMapPath = function (path) {
            return (!bingo.isNullEmpty(path)
                    && _hasRegPath.test(path.replace(_urlQueryPart, '')));
        }, _makeRegexMapPath = function (path) {
            if (!_isRegexMapPath(path)) return null;

            //去除query部分/aaa/ssss.?js?aaa=dfsdf  ==结果==> /aa?a/ssss.?js
            var query = path.match(_urlQueryPart);
            if (query) {
                //如果查找到返回数组:[''], 如果没有返回null
                query = query[0];
                path = path.replace(query, '');
                query = query.replace(_makeRegexPath, "\\$1");
            } else
                query = '';

            _makeRegexPath.lastIndex = 0;
            _makeRegexPathSS.lastIndex = 0;
            _makeRegexPathAll.lastIndex = 0;
            var regS = path.replace(_makeRegexPath, "\\$1").replace(_makeRegexPathAll, '.*').replace(_makeRegexPathSS, '[^./\]$2');
            regS = ['^', regS, query, '$'].join('');
            return new RegExp(regS);
        };

    bingo.extend({
        using: function () {
            if (arguments.length <= 0) return;
            var jsList = [];
            var callback = null;
            var pos = 0;

            var item = null;
            for (var i = 0, len = arguments.length; i < len; i++) {
                item = arguments[i];
                if (item) {
                    if (bingo.isFunction(item))
                        callback = item;
                    else if (bingo.isNumeric(item))
                        pos = item;
                    else
                        jsList = jsList.concat(item);
                }
            }
            _loadFun(jsList, function () {
                callback && callback();
            }, pos);
        },
        makeRegexMapPath: _makeRegexMapPath,
        isRegexMapPath: _isRegexMapPath,
        usingMap: function (mapPath, paths) {
            if (bingo.isNullEmpty(mapPath) || !paths || paths.length <= 0) return;

            bingo.each(paths, function (item, index) {
                if (bingo.isNullEmpty(item)) return;
                _addMap(mapPath, item);
            });
        },
        usingPriority: {
            First: 0,
            NormalBefore: 45,
            Normal: 50,
            NormalAfter: 55,
            Last: 100
        },
        path: function (a) {
            if (this.isObject(a)) {
                this.extend(_paths, a);
            } else {
                if (arguments.length > 1) {
                    _paths[arguments[0]] = arguments[1];
                } else {
                    var urls = a.split('?');
                    a = urls[0];
                    a = _makePath(a);
                    if (urls.length > 1)
                        a += ('?' + bingo.sliceArray(urls, 1).join('?'));
                    return a;
                }
            }
        }
    });

    var _paths = {}, _makePathMatch = /%([^%]*)%/i,
    _makePath = function (path) {
        if (bingo.isNullEmpty(path) || path.indexOf("%") < 0) return path;
        var query = '';
        if (path.indexOf('?')) {
            var pList = path.split('?');
            path = pList[0];
            query = pList[1];
        }

        _makePathMatch.lastIndex = 0;
        var pathRegx = path.match(_makePathMatch);
        var pathReturn = bingo.stringEmpty;
        var pathConfig = _paths;
        if (pathRegx) {
            if (pathConfig[pathRegx[1]])
                pathReturn = _makePath(path.replace(pathRegx[0], pathConfig[pathRegx[1]]));
            else
                pathReturn = _makePath(path.replace(pathRegx[0], bingo.stringEmpty));
        }
        pathRegx = null;
        pathConfig = null;
        return !query ? pathReturn : [pathReturn, query].join('?');
    };


})(bingo);
