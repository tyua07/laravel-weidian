
;(function () {
    "use strict";

    var stringEmpty = "",
        toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        noop = function () { },
        undefined;

    var _htmlDivTarget = null,
    _getHtmlDivTarget = function () {
        if (_htmlDivTarget == null)
            _htmlDivTarget = $('<div style="display:none"></div>');//.appendTo(document.body);
        return _htmlDivTarget;
    };

    var _makeAutoIdTemp = 0, _makeAutoIdTempPointer = 0;

    var bingo = window.bingo = {
        //主版本号.子版本号.修正版本号
        version: { major: 1, minor: 2, rev: 0, toString: function () { return [this.major, this.minor, this.rev].join('.'); } },
        isDebug: false,
        prdtVersion: '',
        supportWorkspace: false,
        stringEmpty: stringEmpty,
        noop: noop,
        newLine: "\r\n",
        hasOwnProp: function (obj, prop) {
            return core_hasOwn.call(obj, prop);
        },
        trace: function (e) {
            console.error && console.error(e.stack || e.message || e+'');
        },
        isType: function (typename, value) {
            //typename:String, Array, Boolean, Object, RegExp, Date, Function,Number //兼容
            //typename:Null, Undefined,Arguments    //IE不兼容
            return toString.apply(value) === '[object ' + typename + ']';
        },
        isUndefined: function (obj) {
            ///<summary>是否定义</summary>

            return (typeof (obj) === "undefined" || obj === undefined);
        },
        isNull: function (obj) {
            ///<summary>是否Null</summary>

            return (obj === null || this.isUndefined(obj));
        },
        isBoolean: function (obj) {
            return this.isType("Boolean", obj);
        },
        isNullEmpty: function (s) {
            return (this.isNull(s) || s === stringEmpty);
        },
        isFunction: function (fun) {
            return this.isType("Function", fun);
        },
        isNumeric: function (n) {
            //return this.isType("Number", n) && !isNaN(n) && isFinite(n);;
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        isString: function (obj) {
            return this.isType("String", obj);
        },
        isObject: function (obj) {
            return !this.isNull(obj) && this.isType("Object", obj)
                && !this.isElement(obj) && !this.isWindow(obj);//IE8以下isElement, isWindow认为Object
        },
        isPlainObject: function (obj) {
            if (!this.isObject(obj)) {
                return false;
            }
            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for (key in obj) { }

            return key === undefined || core_hasOwn.call(obj, key);
        },
        isArray: function (value) {
            return Array.isArray ? Array.isArray(value) : this.isType("Array", value);
        },
        isWindow: function (obj) { return !this.isNull(obj) && obj == obj.window; },
        isElement: function (obj) { var t = obj && (obj.ownerDocument || obj).documentElement; return t ? true : false; },
        trim: function (str) {
            return this.isString(str) ? str.replace(/(^\s*)|(\s*$)|(^\u3000*)|(\u3000*$)|(^\ue4c6*)|(\ue4c6*$)/g, '') : this.isNull(str) ? '' : str.toString();
        },
        isStringEquals: function (str1, str2) {
            ///<summary>字串是否相等, 不分大小写</summary>

            if (str1 == str2) return true;
            if (!this.isString(str1) || !this.isString(str2)) return false;
            return (str1.toUpperCase() == str2.toUpperCase());
        },
        replaceAll: function (s, str, repl, flags) {
            if (this.isNullEmpty(s) || this.isNullEmpty(str)) return s;
            str = str.replace(/([^A-Za-z0-9])/g, "\\$1");
            s = s.replace(new RegExp(str, flags || "g"), repl);
            return s;
        },
        toStr: function (p) { return this.isNull(p) ? '' : p.toString(); },
        inArray: function (element, list, index, rever) {
            var callback = this.isFunction(element) ? element : null;
            if (arguments.length == 2 && !callback)
                return list && list.indexOf && list.indexOf(element);
            var indexRef = -1;
            //debugger;
            this.each(list, function (item, i) {
                if (callback) {
                    if (callback.call(item, item, i)) {
                        indexRef = i; return false;
                    }
                } else if (item === element) {
                    indexRef = i; return false;
                }
            }, index, rever);
            return indexRef;
        },
        removeArrayItem: function (element, list) {
            var list1 = [];
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] != element)
                    list1.push(list[i]);
            }
            return list1;
        },
        sliceArray: function (args, pos, count) {
            isNaN(pos) && (pos = 0);
            isNaN(count) && (count = args.length);
            if (pos < 0) pos = count + pos;
            if (pos < 0) pos = 0;
            return Array.prototype.slice.call(args, pos, pos + count);
        },
        makeAutoId: function () {
            var time = new Date().valueOf();
            _makeAutoIdTempPointer = (time === _makeAutoIdTemp) ? _makeAutoIdTempPointer + 1 : 0;
            _makeAutoIdTemp = time;
            return [time, _makeAutoIdTempPointer].join('_');
        },
        each: function (list, callback, index, rever) {
            //callback(data, index){this === data;}
            if (this.isNull(list) || !bingo.isNumeric(list.length)) return;
            var temp = null;
            var sT = bingo.isNumeric(index) ? index : 0;
            if (sT < 0) sT = list.length + sT;
            if (sT < 0) sT = 0;

            var end = rever ? (sT - 1) : list.length;
            var start = rever ? list.length - 1 : sT;
            if ((rever && start <= end) || (!rever && start >= end)) return;

            var step = rever ? -1 : 1;
            for (var i = start; i != end; i += step) {
                temp = list[i];
                if (callback.call(temp, temp, i) === false) break;
            }
        },
        eachProp: function (obj, callback) {
            if (!obj) return;
            var item;
            for (var n in obj) {
                if (bingo.hasOwnProp(obj, n)) {
                    item = obj[n];
                    if (callback.call(item, item, n) === false) break;
                }
            }
        },
        htmlEncode: function (str) {
            if (this.isNullEmpty(str)) return "";
            var jo = _getHtmlDivTarget();
            jo.text(str);
            str = jo.html();
            return str;
        },
        htmlDecode: function (str) {
            if (this.isNullEmpty(str)) return "";
            var jo = _getHtmlDivTarget();
            jo.html(str);
            var hs = jo.text();
            return hs;
        },
        urlEncode: function (str) {
            if (this.isNullEmpty(str)) return "";
            return encodeURI(str);
        },
        urlDecode: function (str) {
            if (this.isNullEmpty(str)) return "";
            return decodeURI(str);
        },
        clearObject: function (obj) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                obj = arguments[i];
                bingo.eachProp(obj, function (item, n) {
                    if (item && item.$clearAuto === true)
                        if (item.dispose)
                            item.dispose();
                        else
                            bingo.clearObject(item);
                    obj[n] = null;
                });
            }
        },
        extend: function (obj) {
            var len = arguments.length;
            if (len <= 0) return obj;
            if (len == 1) {
                for (var n0 in obj) {
                    bingo.hasOwnProp(obj, n0) && (this[n0] = obj[n0]);
                }
                return this;
            }
            var ot = null;
            for (var i = 1; i < len; i++) {
                ot = arguments[i];
                if (!this.isNull(ot)) {
                    bingo.eachProp(ot, function (item, n) {
                        obj[n] = item;
                    });
                }
            }
            return obj;
        },
        clone: function (obj, deep, ipo) {
            deep = (deep !== false);
            return _clone.clone(obj, deep, ipo);
        },
        proxy: function (owner, fn) {
            return function () { return fn && fn.apply(owner, arguments); };
        }
    };

    //解决多版共存问题
    var majVer = ['bingoV' + bingo.version.major].join(''),
        minorVer = [majVer, bingo.version.minor].join('_');
    window[majVer] = window[minorVer] = bingo;

    var _clone = {
        isCloneObject: function (obj) {
            return bingo.isPlainObject(obj);
        },
        clone: function (obj, deep, ipo) {
            if (!obj)
                return obj;
            else if (bingo.isArray(obj))
                return this.cloneArray(obj, deep);
            else if (ipo || this.isCloneObject(obj))
                return this.cloneObject(obj, deep, ipo);
            else
                return obj;
        },
        cloneObject: function (obj, deep, ipo) {
            var to = {};
            bingo.eachProp(obj, function (t, n) {
                if (deep) {
                    t = _clone.clone(t, deep, ipo);
                }
                to[n] = t;
            });
            return to;
        },
        cloneArray: function (list, deep) {
            var lt = [];
            var t = null;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                t = list[i];
                if (deep !== false) {
                    t = this.clone(t, deep);
                }
                lt.push(t);
            }
            return lt;
        }
    };


})();
