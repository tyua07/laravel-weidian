
(function (bingo) {
    //version 1.1.0
    "use strict";

    /*
        //定义factory
        bingo.factory('name', function ($view) {
            return $view;
        });

        //定义factory方法二
        bingo.factory('name', ['$view', function (v) {
            return v;
        }]);


        //factory的注入
        bingo.factory('name').view(view).inject();

        //factory的注入方法二
        bingo.factory(function($view){ return $view;}).view(view).inject();

         //factory的注入方法三
        bingo.factory(['$view', function(v){ return v;}]).view(view).inject();
  
    */

    var _factoryClass = bingo.Class(function () {

        this.Prop({
            name: '',
            view: null,
            viewnode: null,
            viewnodeAttr:null,
            widthData: null,
            node: null,
            module: null,
            //定义内容
            fn: null,
            //其它参数
            params:null
        });

        this.Define({
            //重置参数
            reset: function () {
               this.view(null).viewnode(null).viewnodeAttr(null)
                    .widthData(null).node(null).params(null);
               return this;
            },
            _newInjectObj: function () {

                //新建一个InjectObj
                var node = document.body,
                    view = bingo.view(),
                    viewnode = view.$viewnode(),
                    attr = bingo.view.viewnodeAttrClass.NewObject(view, viewnode, 'text', '', '$view', null);

                return {
                    node: node,
                    $view: view,
                    $viewnode: viewnode,
                    $attr: attr,
                    $withData: {},
                    $command: null,
                    $injectParam:this.params()
                };
            },
            //注入
            inject: function (owner, retAll) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="owner">默认attr||viewnode||view</param>
                /// <param name="retAll">是否返回注入全部结果，返回Object, 默认false</param>

                //var fn = this.fn();
                var injectObj = this._newInjectObj();
                //intellisenseSetCallContext(fn, this, [injectObj.$view])
                //return;
                var ret = this._inject(owner || injectObj.$view,
                    this.name(), injectObj, {}, true);
                return retAll === true ? injectObj : ret;
            },
            //注入
            _inject: function (owner, name, injectObj, exObject, isFirst) {
                var fn = this.fn();
                var $injects = fn.$injects;
                var $extendFn = null;
                var injectParams = [], $this = this;
                //isFirst && intellisenseLogMessage('injectParams begin', JSON.stringify($injects), fn.toString());
                if ($injects && $injects.length > 0) {
                    var pTemp = null;
                    bingo.each($injects, function (item) {
                        if (item in injectObj) {
                            pTemp = injectObj[item];
                        } else {
                            //注意, 有循环引用问题
                            pTemp = injectObj[item] = $this.setFactory(item)._inject(owner, item, injectObj, exObject, false);
                        }
                        injectParams.push(pTemp);

                        $this._doExtend(owner, item, injectObj, exObject);
                    });
                }

                var ret = fn.apply(fn.$owner || owner, injectParams) || {};

                if (bingo.isString(name) && name) {
                    injectObj[name] = ret;
                    if (isFirst)
                        this._doExtend(owner, name, injectObj, exObject);
                }

                if (isFirst) {
                    //intellisenseLogMessage('injectParams', JSON.stringify($injects), fn.toString());
                    intellisenseSetCallContext(fn, fn.$owner || owner, injectParams);
                    //intellisenseLogMessage('injectParams', JSON.stringify($injects), JSON.stringify(injectParams));
                }
                //else if (bingo.isString(name) && name)
                //    injectObj[name] = ret;

                return ret;
            },
            _doExtend: function (owner, name, injectObj, exObject) {
                if (exObject[name] !== true) {
                    exObject[name] = true;
                    var $extendFn = this._getExtendFn(name);
                    if ($extendFn) {
                        this.setFactory($extendFn)._inject(owner, '', injectObj, exObject, false);
                    }
                }
            },
            _getParams: function (name) {
                var hasMN = name.indexOf('$') > 0, moduleName = '', nameT = name;
                if (hasMN) {
                    moduleName = name.split('$');
                    nameT = moduleName[1];
                    moduleName = moduleName[0];
                }
                var appI = bingo.getAppByView(this.view());
                var moduleI = hasMN ? appI.module(moduleName) : bingo.getModuleByView(this.view());
                return { app: appI, module: moduleI, name: nameT };
            },
            _getExtendFn: function (name) {
                var p = this._getParams(name);
                var exFn = p.module.factoryExtend(p.name);
                return exFn ? _makeInjectAttrs(exFn) : null;
            },
            _getFactoryFn: function (name) {
                var p = this._getParams(name);
                var moduleI = p.module, nameT = p.name;
                var fn = moduleI.factory(nameT, true) || moduleI.service(nameT);
                return fn ? _makeInjectAttrs(fn) : null;
            },
            setFactory: function (name) {
                var fn = null, exFn;
                if (bingo.isFunction(name) || bingo.isArray(name)) {
                    //支持用法：factory(function(){})
                    fn = _makeInjectAttrs(name);
                    name = '';
                }
                else {
                    fn = this._getFactoryFn(name);
                }
                this.name(name).fn(fn);
                //this.inject();
                //intellisenseSetCallContext(fn, this, [{}]);

                return this;
            }
        });

    });

    var _getInjectFn = function (appI, moduleI, nameT) {
        var moduleDefault = bingo.defaultModule(appI);
        var factorys = moduleI.factory();
        var factorys2 = moduleDefault == moduleI ? null : moduleDefault.factory();

        var fn = factorys[nameT] || (factorys2 && factorys2[nameT]) || moduleI.service(nameT) || (moduleDefault == moduleI ? null : moduleDefault.service(nameT));
        if (fn)
            return fn;
        else
            return _getInjectFn(bingo.defaultApp(), bingo.defaultApp().defaultModule(), nameT);
    }, _getInjectExtendFn = function (appI, moduleI, nameT) {
        var moduleDefault = bingo.defaultModule(appI);
        var fn = moduleI.factoryExtend(nameT) || (moduleDefault == moduleI ? null : moduleDefault.factoryExtend(nameT));

        if (fn)
            return fn;
        else if (appI != bingo.defaultApp())
            return _getInjectExtendFn(bingo.defaultApp(), bingo.defaultApp().defaultModule(), nameT);
        else
            return null;
    };

    bingo.factory.factoryClass = _factoryClass;

    var _injectNoop = function () { };
    _injectNoop.$injects = [];

    var _makeInjectAttrRegx = /^\s*function[^(]*?\(([^)]+?)\)/i,
    _makeInjectAttrs = function (p) {
        if (p && (p.$injects || p.$fn)) return p.$fn || p;

        var fn = _injectNoop;
        if (bingo.isArray(p)) {
            var list = bingo.clone(p, false);
            fn = list.pop();
            fn.$injects = list;
            fn.$owner = p.$owner;
            //intellisenseLogMessage('$injects', JSON.stringify(list), fn.toString());
        } else if (bingo.isFunction(p)) {
            fn = p;
            var s = fn.toString();
            var list = [], fL =null;
            s.replace(_makeInjectAttrRegx, function (findText, find0) {
                if (find0) {
                    fL = find0.split(',');
                    for (var i = 0, len = fL.length; i < len; i++) {
                        list.push(bingo.trim(fL[i]));
                    }
                    //intellisenseLogMessage('find0', find0, list);
                }
            });
            fn.$injects = list;
            //intellisenseLogMessage(JSON.stringify(list), s);
        }
        //intellisenseLogMessage('$injects', JSON.stringify(fn.$injects), fn.toString());
        return fn;
    };

})(bingo);
