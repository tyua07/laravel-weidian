
(function (bingo) {
    //version 1.1.0
    "use strict";

    //var _filter = {};
    //bingo.filter = function (name, fn) {
    //    if (this.isNullEmpty(name)) return null;
    //    if (arguments.length == 1)
    //        return _filter[name];
    //    else
    //        _filter[name] = fn;
    //};

    bingo.filter.createFilter = function (content, view, node, withData) {
        /// <summary>
        /// 创建Filter
        /// </summary>
        /// <param name="content">filter内容, 如: "reiongId | eq:'dev' | len"</param>
        /// <param name="view">可选, 需注入时用</param>
        /// <param name="node">可选, 原生node, 需注入时用</param>
        /// <param name="withData">可选, withData</param>
        return _filter.createFilter(content, view, node, withData);
    };

    bingo.filter.regex = /[|]+[ ]?([^|]+)/g;

    var _filter = {
        hasFilter: function (s) {
            bingo.filter.regex.lastIndex = 0;
            return bingo.filter.regex.test(s);
        },
        //将filte内容删除
        removerFilterString: function (s) {
            if (bingo.isNullEmpty(s) || !this.hasFilter(s)) return s;
            bingo.filter.regex.lastIndex = 0;
            var str = s.replace(bingo.filter.regex, function (find, content) { if (find.indexOf('||') == 0) return find; else return ''; });
            return bingo.trim(str);
        },
        getFilterStringList: function (s) {
            if (bingo.isNullEmpty(s) || !this.hasFilter(s)) return [];
            var filterList = [];
            bingo.filter.regex.lastIndex = 0;
            s.replace(bingo.filter.regex, function (find, content) {
                if (find.indexOf('||') != 0) filterList.push(content);
            });
            return filterList;
        },
        //取得filter参数, 'date:"yyyyMMdd"' 或 filter:{p1:1, p2:'aaa'}
        getScriptContextFun: function (obj, attrValue, view, node, withData) {
            var ca = obj._ca || (obj._ca = {});
            var cn = 'cont';
            if (ca[cn]) return ca[cn];

            var attT = ['{', attrValue, '}'].join('');
            var retScript = ['return ', attT, ';'].join('');

            try {
                return ca[cn] = (new Function('$view', '$node', '$withData', 'bingo', [
                    'with ($view) {',
                        //如果有withData, 影响性能
                        withData ? 'with ($withData) {' : '',
                            //this为$data
                            'return function ($data) {',
                                'try {',
                                    retScript,
                                '} catch (e) {',
                                    'if (bingo.isDebug) bingo.trace(e);',
                                '}',
                            '};',
                        withData ? '}' : '',
                    '}'].join('')))(view, node, withData, bingo);//bingo(多版本共存)
            } catch (e) {
                bingo.trace(e);
                return ca[cn] = function () { return attrValue; };
            }

        },
        //是否有参数
        hasFilterParam: function (s) { return (s.indexOf(':') >= 0); },
        //如果有参数, 取得参数名称
        getFilterParamName: function (s) {
            var sL = s.split(':');
            return bingo.trim(sL[0]);
        },
        //根据view取得filter器
        getFilterByView: function (view, name) {
            var filter = view ? view.$getModule(name).filter(name) : bingo.filter(name);
            return filter;
        },
        paramFn: function (obj, item, view, node, withData) {
            return _filter.getScriptContextFun(obj, item, view, node, withData);
            //return function (withData) {
            //    return _filter.getScriptContextFun(this, item, withData.length);
            //};
        },
        //生成filter对象
        getFilterObjList: function (view, node, s, withData) {
            var sList = this.getFilterStringList(s);
            if (sList.length == 0) return [];
            var list = [];
            bingo.each(sList, function (item) {
                item = bingo.trim(item);
                if (bingo.isNullEmpty(item)) return;
                var obj = {
                    name: null, paramFn: null, fitlerFn: null
                };
                var ftO = null;
                if (_filter.hasFilterParam(item)) {
                    obj.name = _filter.getFilterParamName(item);
                    ftO = _filter.getFilterByView(view, obj.name);
                    if (!ftO) return;
                    ftO = view ? bingo.factory(ftO).view(view).node(node).inject() : ftO();
                    //view && (ftO = bingo.factory(ftO).view(view).node(node).inject());
                    obj.paramFn = _filter.paramFn(obj, item, view, node, withData);
                } else {
                    obj.name = item;
                    ftO = _filter.getFilterByView(view, obj.name);
                    if (!ftO) return;
                    //view && (ftO = bingo.factory(ftO).view(view).node(node).inject());
                    ftO = view ? bingo.factory(ftO).view(view).node(node).inject() : ftO();
                }
                obj.fitlerFn = ftO;
                obj.fitlerVal = function (val) {
                    if (!this.fitlerFn) return val;
                    var para = null;
                    if (this.paramFn) {
                        para = this.paramFn(val);
                        para && (para = para[this.name]);
                    }
                    return this.fitlerFn(val, para);
                };
                list.push(obj);
            });
            return list;
        },
        createFilter: function (content, view, node, withData) {
            var filter = { contentOrg: content };
            var hasFilter = _filter.hasFilter(content);
            filter._filters = hasFilter ? _filter.getFilterObjList(view, node, content, withData) : [];
            filter.content = _filter.removerFilterString(content);
            filter.contentFT = content.replace(filter.content, '');
            //console.log('contentFT', filter.contentFT, filter);
            if (filter._filters.length > 0) {
                filter.filter = function (value) {
                    /// <summary>
                    /// 
                    /// </summary>
                    /// <param name="value"></param>
                    var res = bingo.variableOf(value);
                    bingo.each(this._filters, function () {
                        res = this.fitlerVal(res);
                    });
                    return res;
                };
            } else {
                filter.filter = function (value) { return value; };
            }
            return filter;
        }
    };

})(bingo);
