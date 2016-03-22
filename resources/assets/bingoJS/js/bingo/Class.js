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

        bingo.eachProp(obj, function (item, n) {
            if (!(bingo.isPlainObject(item) || bingo.isArray(item)))
                prototype[n] = item;
            else
                property[n] = item;//要分离处理
        });
       
    }, _proName = '__pro_names__', _extendProp = function (define, obj) {
        //对象定义
        var prototype = define.prototype;

        var proNO = prototype[_proName] ? prototype[_proName].split(',') : [];
        bingo.eachProp(obj, function (item, n) {
            item = obj[n];
            prototype[n] = _propFn(n, item);
            proNO.push(n);
        });
        prototype[_proName] = proNO.join(',');

    }, _propFn = function (name, defaultvalue) {
        var isO = bingo.isObject(defaultvalue),
            $set = isO && defaultvalue.$set,
            $get = isO && defaultvalue.$get,
            fn = null;

        if ($set || $get) {
            fn = function (value) {
                var p = _getProp(this);
                var attr = bingo.hasOwnProp(p, name) ? p[name] : (p[name] = { value: bingo.clone(defaultvalue.value) });
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
            };
        } else {
            fn = function (value) {
                var p = _getProp(this);
                if (arguments.length == 0) {
                    return bingo.hasOwnProp(p, name) ? p[name] : defaultvalue;
                } else {
                    p[name] = value;
                    return this;
                }
            };
        }
        return fn;
    }, _getProp = function (obj) { return obj._bg_prop_ || (obj._bg_prop_ = {}); };

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
            _extendDefine(this._define, o);
            return this;
        },
        Initialization: function (callback) {
            this._define.prototype.___Initialization__ = callback;
            return this;
        },
        Static: function (o) {
            bingo.extend(this._define, o);
            return this;
        },
        Prop: function (o) {
            _extendProp(this._define, o);
            return this;
        }
    });

    bingo.isClassObject = function (obj) {
        return obj && obj.__bg_isObject__ === true;
    };
    bingo.isClass = function (cls) {
        return cls && cls.__bg_isClass__ === true;
    };
    bingo.Class = function () {
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
            _extendDefine(define, obj);
        };
        define.extendProp = function (obj) {
            _extendProp(define, obj);
        };
        define.NewObject = function () {
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

        if (!bingo.isNullEmpty(defineName))
            _makeDefine(defineName, define);

        return define;
    };

    var _onInit = function (callback) {
        if (callback) {
            this._onInit_ || (this._onInit_ = bingo.Event());
            this._onInit_.on(callback);
        }
        return this;
    }, _onDispose = function (callback) {
        if (callback) {
            this._onDispose_ || (this._onDispose_ = bingo.Event());
            this._onDispose_.on(callback);
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
        bingo.eachProp(source, function (item, n) {
            if (!bingo.hasOwnProp(target, n))
                target[n] = item;
        });
    };
    bingo.Class.makeDefine = function (defineName, define) { _makeDefine(defineName, define); };

    //定义基础类
    bingo.Class.Base = bingo.Class(function () {

        //this.Initialization(function () {
        //    //用于clone
        //    this.__init_args__ = bingo.sliceArray(arguments, 0);
        //});

        this.Define({
            __bg_isObject__: true,
            isDisposed: false,
            //释放状态, 0:未释放, 1:释放中, 2:已释放
            disposeStatus: 0,
            dispose: function () {
                if (this.disposeStatus === 0) {
                    try {
                        this.disposeStatus = 1;
                        this.trigger('$dispose');
                    } finally {
                        bingo.clearObject(this);
                        this.disposeStatus = 2;
                        this.isDisposed = true;
                        this.dispose = bingo.noop;
                    }
                }
            },
            onDispose: function (callback) {
                return this.on('$dispose', callback);
            },
            disposeByOther: function (obj) {
                if (obj && obj.dispose && !obj.isDisposed) {
                    var fn = bingo.proxy(this, function () {
                        this.dispose();
                    });

                    obj.onDispose(fn);
                    this.onDispose(function () {
                        obj.isDisposed || obj.onDispose().off(fn);
                    });
                }
                return this;
            },
            $prop: function (o) {
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
                if (name) {
                    this.__events__ || (this.__events__ = {});
                    var events = this.__events__;
                    return events[name] || (events[name] = bingo.Event(this));
                }
                return null;
            },
            hasEvent: function (name) {
                return this.__events__ && this.__events__[name] && this.__events__[name].size() > 0;
            },
            on: function (name, callback) {
                if (name && callback) {
                    this.getEvent(name).on(callback);
                }
                return this;
            },
            one: function (name, callback) {
                if (name && callback) {
                    this.getEvent(name).one(callback);
                }
                return this;
            },
            off: function (name, callback) {
                if (this.hasEvent(name)) {
                    this.getEvent(name).off(callback);
                }
                return this;
            },
            end: function (name, args) {
                if (name) {
                    this.getEvent(name).end(args);
                }
                return this;
            },
            trigger: function (name) {
                if (this.hasEvent(name)) {
                    var argLists = arguments.length > 1 ? arguments[1] : [];
                    return this.getEvent(name).trigger(argLists);
                }
            },
            triggerHandler: function (name) {
                if (this.hasEvent(name)) {
                    var argLists = arguments.length > 1 ? arguments[1] : [];
                    return this.getEvent(name).triggerHandler(argLists);
                }
            }
        });
    });


    bingo.Class.Define = function (define) {
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
