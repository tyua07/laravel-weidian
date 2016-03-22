/*
* 1. 尽量将属性放在Initialization定义和初始
* 2. 尽量将方法放在Define中定义
* 3. 如果要链写方式属性，放在Variable中定义
*/

(function (bingo) {
    //version 1.0.1
    "use strict";

    var _extendDefine = function (define, obj) {
        //对象定义
        var prototype = define.prototype;

        //要分离(clone)的属性
        var property = prototype.__bg_property__ || (prototype.__bg_property__ = {});

        var item = null;
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                item = obj[n];
                if (!(bingo.isPlainObject(item) || bingo.isArray(item)))
                    prototype[n] = obj[n];
                else
                    property[n] = obj[n];//要分离处理
            }
        }
        //for (var n in prototype) {
        //    if (prototype.hasOwnProperty(n) && bingo.isFunction(prototype[n])) {
        //        intellisenseSetCallContext(prototype[n], prototype);
        //    }
        //}

    }, _proName = '__pro_names__', _extendProp = function (define, obj) {
        //对象定义
        var prototype = define.prototype;

        var proNO = prototype[_proName] ? prototype[_proName].split(',') : [];
        var item = null;
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                item = obj[n];
                prototype[n] = _propFn(n, item, prototype);
                proNO.push(n);
            }
        }
        prototype[_proName] = proNO.join(',');

    }, _propFn = function (name, defaultvalue, prototype) {
        var isO = bingo.isObject(defaultvalue),
            $set = isO && defaultvalue.$set,
            $get = isO && defaultvalue.$get,
            fn = null;

        if ($set || $get) {
            fn = function (value) {
                var p = _getProp(this);
                var attr = p.hasOwnProperty(name) ? p[name] : (p[name] = { value: bingo.clone(defaultvalue.value) });
                attr.owner = this;
                if (arguments.length == 0) {
                    var rtt = $get ? $get.call(attr) : attr.value;
                    attr.owner = null;
                    return rtt;
                } else {
                    if ($set)
                        $set.call(attr, value);
                    else
                        attr.value = value;
                    attr.owner = null;
                    return this;
                }
            }
            var thisObj = { value: bingo.clone(defaultvalue.value), owner: prototype };
            $set && intellisenseSetCallContext($set, thisObj, [{}]);
            $get && intellisenseSetCallContext($get, thisObj);
        } else {
            fn = function (value) {
                var p = _getProp(this);
                if (arguments.length == 0) {
                    return p.hasOwnProperty(name) ? p[name] : defaultvalue;
                } else {
                    p[name] = value;
                    return this;
                }
            }
        }
        return fn;
    }, _getProp = function (obj) { return obj._bg_prop_ || (obj._bg_prop_ = {}) };

    //bingo.Class=============================================
    var _NewObject_define_String = "NewObject_define";//让对象现实时， 不初始化(Initialization)

    var _defineClass = function (define, baseDefine) {
        this._define = define;
        if (baseDefine)
            this._Base(baseDefine);
    };
    bingo.extend(_defineClass.prototype, {
        _Base: function (baseDefine) {
            var define = this._define;
            define.prototype = new baseDefine(_NewObject_define_String);
            define.prototype.constructor = define;

            //分离base_property
            var base_property = define.prototype.__bg_property__;
            if (base_property) {
                define.prototype.__bg_property__ = bingo.clone(base_property);
            }

            define.prototype.base = function () {

                var basePrototype = baseDefine.prototype;
                this.base = basePrototype.base;//将base设置为父层base
                //如果没有初始方法， 初始base
                if (basePrototype.___Initialization__ == bingo.noop) {
                    this.base.apply(this, arguments);
                } else {
                    basePrototype.___Initialization__.apply(this, arguments);
                }
            };
        },
        Define: function (o) {
            /// <summary>
            /// 定义 Define({ a:1, fn:function(){} })
            /// </summary>
            /// <param name="o"></param>
            _extendDefine(this._define, o);
            return this;
        },
        Initialization: function (callback) {
            /// <summary>
            /// 初始方法, Initialization(function(p){ this.base(p); this.ddd = 2; })
            /// </summary>
            /// <param name="callback"></param>

            this._define.prototype.___Initialization__ = callback;
            //var obj = this._define.NewObject();
            ////for (var n in obj) {
            ////    if (obj.hasOwnProperty(n) && bingo.isFunction(obj[n])) {
            ////        intellisenseSetCallContext(obj[n], obj);
            ////    }
            ////}
            //callback.call(obj);
            return this;
        },
        Static: function (o) {
            /// <summary>
            /// 定义静态， Static({ ss:1, ssFn:function(){} })
            /// </summary>
            /// <param name="o"></param>
            bingo.extend(this._define, o);
            return this;
        },
        Prop: function (o) {
            /// <summary>
            /// 读写属性, Prop({<br />
            ///  vv: 1,<br />
            ///  vt: {<br />
            ///         value: 222,<br />
            ///         $get: function () { return this.value; },<br />
            ///         $set: function (value) { this.value = value; }<br />
            ///     }<br />
            /// })
            /// </summary>
            /// <param name="o"></param>
            _extendProp(this._define, o);
            return this;
        }
    });

    bingo.isClassObject = function (obj) {
        /// <summary>
        /// 是否Class对象
        /// </summary>
        /// <param name="obj"></param>
        return obj && obj.__bg_isObject__ === true;
    };
    bingo.isClass = function (cls) {
        /// <summary>
        /// 是否Class
        /// </summary>
        /// <param name="cls">class</param>
        return cls && cls.__bg_isClass__ === true;
    };
    bingo.Class = function () {
        /// <signature>
        /// <summary>
        /// 定义类, var bClass = bingo.Class(function(){})
        /// </summary>
        /// <param name="func">定义类的方法</param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类, var bClass = bingo.Class('base.aClass', function(){})
        /// </summary>
        /// <param name="defineName">名称, base.aClass</param>
        /// <param name="func">定义类的方法</param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类, var bClass = bingo.Class('base.aClass', baseClass, function(){})
        /// </summary>
        /// <param name="defineName">名称, base.aClass</param>
        /// <param name="baseDefine">基类</param>
        /// <param name="func">定义类的方法</param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类, var bClass = bingo.Class(baseClass, function(){})
        /// </summary>
        /// <param name="baseDefine">基类</param>
        /// <param name="func">定义类的方法</param>
        /// </signature>

        var defineName, baseDefine, func;
        var argItem = null;
        for (var i = 0, len = arguments.length; i < len; i++) {
            argItem = arguments[i];
            if (argItem) {
                if (bingo.isClass(argItem))
                    baseDefine = argItem;
                else if (bingo.isFunction(argItem))
                    func = argItem;
                else if (bingo.isString(argItem))
                    defineName = argItem;
            }
        }
        baseDefine || (baseDefine = bingo.Class.Base);

        var define = function () { if (arguments[0] != _NewObject_define_String) return define.NewObject.apply(window, arguments); };
        define.__bg_isClass__ = true;
        define.prototype.___Initialization__ = bingo.noop;
        define.prototype.base = bingo.noop;

        define.extend = function (obj) {
            /// <summary>
            /// 扩展类, extend({ a:1, fn1:function(){} })
            /// </summary>
            /// <param name="obj"></param>
            _extendDefine(define, obj);
            var def = new define();
            bingo.eachProp(obj, function (item) {
                bingo.isFunction(item) && intellisenseSetCallContext(item, def);
            });
        };
        define.extendProp = function (obj) {
            /// <summary>
            /// 扩展Prop
            /// </summary>
            /// <param name="obj"></param>
            _extendProp(define, obj);
        };
        define.NewObject = function () {
            /// <summary>
            /// 实例化对象
            /// </summary>
            var obj = new define(_NewObject_define_String);

            //分离object
            if (obj.__bg_property__) {
                var propertys = bingo.clone(obj.__bg_property__);
                bingo.extend(obj, propertys);
            }

            //如果没有初始方法， 初始base
            if (obj.___Initialization__ == bingo.noop) {
                obj.base && obj.base.apply(obj, arguments);
            } else {
                obj.___Initialization__.apply(obj, arguments);
            }
            obj.___Initialization__ = bingo.noop;
            obj.base = bingo.noop;

            define._onInit_ && define._onInit_.trigger([obj]);

            define._onDispose_ && obj.onDispose(function () { define._onDispose_.trigger([obj]) });

            return obj;
        };
        define.onInit = _onInit;
        define.onDispose = _onDispose;

        var defineObj = new _defineClass(define, baseDefine);

        func && func.call(defineObj);
        defineObj = null;
        intellisense.redirectDefinition(define.prototype.base, baseDefine.prototype.___Initialization__);

        if (!bingo.isNullEmpty(defineName))
            _makeDefine(defineName, define);
        define.NewObject();

        intellisense.redirectDefinition(define.NewObject, define.prototype.___Initialization__);
        intellisense.redirectDefinition(define, define.prototype.___Initialization__);

        return define;
    };


    var _onInit = function (callback) {
        /// <summary>
        /// 初始
        /// </summary>
        /// <param name="callback" type="function(obj)"></param>
        if (callback) {
            this._onInit_ || (this._onInit_ = bingo.Event());
            this._onInit_.on(callback);
            intellisenseSetCallContext(callback, this, [this.NewObject()]);
        }
        return this;
    }, _onDispose = function (callback) {
        /// <summary>
        /// 销毁
        /// </summary>
        /// <param name="callback" type="function(obj)"></param>
        if (callback) {
            this._onDispose_ || (this._onDispose_ = bingo.Event());
            this._onDispose_.on(callback);
            intellisenseSetCallContext(callback, this, [this.NewObject()]);
        }
        return this;
    };

    //生成名字空间=============

    var _makeDefine = function (defineName, define) {
        var list = defineName.split('.');
        var ot = window;
        var n = "";
        var len = list.length - 1;
        for (var i = 0; i < len; i++) {
            n = list[i];
            if (!bingo.isNullEmpty(n)) {
                if (bingo.isNull(ot[n]))
                    ot[n] = {};
                ot = ot[n];
            }
        }

        //将原来的了级定义复制到新
        if (ot[list[len]])
            _copyDefine(ot[list[len]], define);

        return ot[list[len]] = define;
    },
    _copyDefine = function (source, target) {
        for (var n in source)
            if (source.hasOwnProperty(n) && !target.hasOwnProperty(n))
                target[n] = source[n];
    };
    bingo.Class.makeDefine = function (defineName, define) { _makeDefine(defineName, define); };

    //定义基础类
    bingo.Class.Base = bingo.Class(function () {

        this.Define({
            __bg_isObject__: true,
            //已经释放
            isDisposed: false,
            //释放状态, 0:未释放, 1:释放中, 2:已释放
            disposeStatus: false,
            dispose: function () {
                /// <summary>
                /// 释放对象
                /// </summary>
                if (!this.isDisposed) {
                    bingo.clearObject(this);
                    this.isDisposed = true;
                    this.dispose = bingo.noop;
                }
            },
            onDispose: function (callback) {
                /// <summary>
                /// 释放对象事件
                /// </summary>
                /// <param name="callback" value='callback.call(this)'></param>
                return this.on('$dispose', callback);
            },
            disposeByOther: function (obj) {
                /// <summary>
                /// 当obj释放时释放这个对象
                /// </summary>
                /// <param name="obj"></param>
                return this;
            },
            $prop: function (o) {
                /// <summary>
                /// 设置或获取Prop所有属性
                /// </summary>
                /// <param name="o"></param>
                var propNames = this[_proName];
                if (bingo.isNullEmpty(propNames))
                    return arguments.length == 0 ? null : this;
                propNames = propNames.split(',');
                var $this = this;
                if (arguments.length == 0) {
                    o = {};
                    bingo.each(propNames, function (item) {
                        o[item] = $this[item]();
                    });
                    return o;
                } else {
                    bingo.eachProp(o, function (item, name) {
                        if (bingo.inArray(name, propNames) >= 0)
                            $this[name](o[name]);
                    });
                    return this;
                }
            }
        });

        this.Define({
            getEvent: function (name) {
                /// <summary>
                /// 取得事件
                /// </summary>
                /// <param name="name">事件名称</param>
                return bingo.Event(this);
            },
            hasEvent: function (name) {
                /// <summary>
                /// 是否有事件
                /// </summary>
                /// <param name="name"></param>
                /// <returns value='Boolean'></returns>
                return true;
            },
            on: function (name, callback) {
                /// <summary>
                /// 绑定事件
                /// </summary>
                /// <param name="name">事件名称</param>
                /// <param name="callback"></param>
                callback && intellisenseSetCallContext(callback, this);
                return this;
            },
            one: function (name, callback) {
                /// <summary>
                /// 绑定事件
                /// </summary>
                /// <param name="name">事件名称</param>
                /// <param name="callback"></param>
                callback && intellisenseSetCallContext(callback, this);
                return this;
            },
            off: function (name, callback) {
                /// <summary>
                /// 解除事件
                /// </summary>
                /// <param name="name">事件名称</param>
                /// <param name="callback">可选</param>
                callback && intellisenseSetCallContext(callback, this);
                return this;
            },
            end: function (name, args) {
                /// <summary>
                /// end('ready', [arg1, arg2, ....]), 结束事件, 先解除绑定事件, 以后绑定事件马上自动确发, 用于ready之类的场景
                /// </summary>
                /// <param name="name">事件名称</param>
                /// <param name="args">可选, 传送参数, [arg1, arg2,...]</param>
                return this;
            },
            trigger: function (name, args) {
                /// <summary>
                /// 触发事件, trigger('click', [a, b, c])
                /// 返回最后事件结果，返回false中止事件
                /// </summary>
                /// <param name="name"></param>
                /// <param name="args">多个参数,[a, b, ....]</param>
                return {};
            },
            triggerHandler: function (name, args) {
                /// <summary>
                /// 触发第一事件, 并返回值, triggerHandler('click', [a, b, c]);
                /// </summary>
                /// <param name="name"></param>
                /// <param name="args">多个参数,[a, b, ....]</param>
                return {};
            }
        });
    });


    bingo.Class.Define = function (define) {
        /// <summary>
        /// 定义类(另一方法)
        /// bingo.Class.Define({<br />
        ///        $base: aCls,<br />
        ///        $init: function () {<br />
        ///        },<br />
        ///        $var: {<br />
        ///             p:1<br />
        ///        },<br />
        ///        $dispose: function () {<br />
        ///        },<br />
        ///        $static: {<br />
        ///                a: 1,<br />
        ///                fn: function () { }<br />
        ///        },<br />
        ///        fn: function () { }<br />
        ///    })
        /// </summary>
        /// <param name="define"></param>
        if (bingo.isObject(define)) {
            var baseDefine = define.$base;
            var init = define.$init;
            var dispose = define.$dispose;
            var $static = define.$static;
            var $prop = define.$prop;

            baseDefine && (delete define.$base);
            init && (delete define.$init);
            dispose && (delete define.$dispose);
            $static && (delete define.$static);
            $prop && (delete define.$prop);

            return bingo.Class(baseDefine || bingo.Class.Base, function () {

                $prop && this.Prop($prop);

                this.Define(define);

                if (init || dispose) {
                    this.Initialization(function () {

                        if (dispose)
                            this.onDispose(dispose);

                        if (init)
                            init.apply(this, arguments);

                    });
                }

                $static && this.Static($static);

            });

        }
    };


})(bingo);
