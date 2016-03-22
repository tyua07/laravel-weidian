
(function (bingo) {
    //version 1.1.0
    "use strict";

    bingo.cacheToObject = function (obj) {
        return obj && obj.__bg_cache__ ?
            obj.__bg_cache__
            : (obj.__bg_cache__ = _cacheClass.NewObject());
    };

    var _get = function (cache, key) {
        var item = bingo.linq(cache._datas).where(function () { return this.key == key; }).first();
        item && (item.t = new Date().valueOf());
        return item;
    }, _add = function (cache, key, value, max) {
        (max > 0) && _checkMax(cache, max);
        var item = {
            t: new Date().valueOf(),
            key: key, value: value
        };
        cache._datas.push(item);
        return item;
    }, _checkMax = function (cache, max) {
        var len = cache._datas.length, perDel = 5;
        if (len >= max + perDel) {
            cache._datas = bingo.linq(cache._datas)
                .sortAsc('t').take(perDel);
        }
    }, _remove = function (cache, key) {
        cache._datas = bingo.linq(cache._datas).where(function () { return this.key !== key; }).toArray();
    }, _has = function (cache, key) {
        return bingo.linq(cache._datas).where(function () { return this.key == key; }).contain();
    };

    var _cacheClass = bingo.Class(function () {

        this.Prop({
            max: 0,
            context:null
        });
        
        this.Define({
            key: function (key) {
                if (arguments.length == 0)
                    return this._key;
                else {
                    this._key = bingo.sliceArray(arguments, 0).join('_');
                    return this;
                }
            },
            _getItem: function () {
                var key = this.key();
                if (key) {
                    var datas = this._datas;
                    var item = _get(this, key);
                    if (item)
                        return item;
                    else {
                        var contextFn = this.context();
                        if (bingo.isFunction(contextFn)) {
                            return _add(this, key, contextFn(), this.max());
                        }
                    }
                }
            },
            'get': function () {
                /// <summary>
                /// bingo.cache(obj).key('bbbb').context(function(){return '2';}).max(2).get();
                /// </summary>
                var item = this._getItem();
                return item && item.value;
            },
            'set': function (value) {
                /// <summary>
                /// bingo.cache(obj).key('bbbb').set('11111');
                /// </summary>
                /// <param name="value">值</param>
                var item = this._getItem();
                if (item)
                    item.value = value;
                else {
                    var key = this.key();
                    key && _add(this, key, value, this.max());
                }
                return this;
            },
            has: function () {
                var key = this.key();
                return key ? _has(this, key) : false;
            },
            clear: function () {
                var key = this.key();
                this.has() && _remove(this, key);
                return this;
            },
            clearAll: function () {
                this._datas = []; return this;
            }
        });

        this.Initialization(function () {
            this._datas = [];
        });

    });

})(bingo);
