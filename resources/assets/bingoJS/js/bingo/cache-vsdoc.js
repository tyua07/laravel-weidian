
(function (bingo) {
    bingo.cacheToObject = function (obj) {
        /// <summary>
        /// 缓存到obj, bingo.cache(obj).key('bbbb').context(function(){return '2';}).max(2).get();
        /// </summary>
        /// <param name="obj">缓存到的obj</param>
        return obj && obj.__bg_cache__ ?
            obj.__bg_cache__
            : (obj.__bg_cache__ = _cacheClass.NewObject());
    };

    var _cacheClass = bingo.Class(function () {

        this.Prop({
            //最大缓存数, 默认不限数量（0及以下）
            max: 0,
            context: null
        });

        this.Define({
            key: function (key) {
                /// <summary>
                /// key, 可以多个参数, key(regionId, 'two')
                /// </summary>
                /// <param name="key"></param>
                if (arguments.length == 0)
                    return ' ';
                else {
                    this._key = bingo.sliceArray(arguments, 0).join('_');
                    return this;
                }
            },
            'get': function () {
                /// <summary>
                /// 取得值, bingo.cache(obj).key('bbbb').get()
                /// </summary>
                var context = this.context();
                return context ? context() : this._datas[this._key];
            },
            'set': function (value) {
                /// <summary>
                /// 设置缓存, bingo.cache(obj).key('bbbb').set('11111');
                /// </summary>
                /// <param name="value">值</param>
                this._datas[this._key] = value;
                return this;
            },
            has: function () {
                /// <summary>
                /// 是否有存在缓存, bingo.cache(obj).key('bbbb').has()
                /// </summary>
                return true;
            },
            clear: function () {
                /// <summary>
                /// 清除一个缓存, bingo.cache(obj).key('bbbb').clear()
                /// </summary>
                return this;
            },
            clearAll: function () {
                /// <summary>
                /// 清除所有缓存, bingo.cache(obj).clearAll()
                /// </summary>
                return this;
            }
        });

        this.Initialization(function () {
            this._datas = {};
        });

    });


})(bingo);
