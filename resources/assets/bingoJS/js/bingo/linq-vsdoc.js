//todo:_linqClass的edit等

(function (bingo) {
    //version 1.0.1
    "use strict";

    var _linqClass = bingo.linqClass = bingo.Class(function () {

        this.Define({
            concat: function (p, isBegin) {
                /// <summary>
                /// 合并数组<br />
                /// concat(obj)<br />
                /// concat([obj1, obj2])
                /// </summary>
                /// <param name="p">可以单个元素或数组</param>
                /// <param name="isBegin">可选，是否合并到前面， 默认false</param>
                return this;
            },
            _backup: null,
            backup: function () {
                /// <summary>
                /// 备份当前数据，供restore使用
                /// </summary>
                return this;
            },
            restore: function (isNotExsit) {
                /// <summary>
                /// 恢复backup备份数据
                /// </summary>
                /// <param name="isNotExsit">可选， 如果当前结果没有可用数据， 才恢复， 默认false直接恢复</param>
                return this;
            },
            each: function (fn, index, rever) {
                /// <summary>
                /// each(function(item, index){ item.count++; });
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="index">开始位置, 如果负数从后面算起</param>
                /// <param name="rever">反向</param>
                if (this._datas.length > 0) {
                    intellisense.setCallContext(fn, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                }
                return this;
            },
            where: function (fn, index, count, rever) {
                /// <summary>
                /// 过滤<br />
                /// where('id', '1');
                /// where(function(item, index){ return item.max > 0 ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="index" type="Number">开始位置, 如果负数从后面算起</param>
                /// <param name="count" type="Number">数量</param>
                /// <param name="rever" type="Boolean">反向</param>
                if (this._datas.length > 0) {
                    intellisense.setCallContext(fn, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                }
                return this;
            },
            select: function (fn, isMerge) {
                /// <summary>
                /// 映射(改造)<br />
                /// select('id');<br />
                /// select(function(item, index){ return {a:item.__a, b:item.c+item.d} ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="isMerge">可选, 是否合并数组, 默认false</param>
                if (this._datas.length > 0) {
                    if (isMerge === true)
                        this._datas = this._datas.concat([fn.call(this._datas[0], this._datas[0], 0)]);
                    else
                        this._datas = [fn.call(this._datas[0], this._datas[0], 0)];
                }
                return this;
            },
            sort: function (fn) {
                /// <summary>
                /// 排序, sort(function(item1, item2){return item1-item2;})<br />
                /// item1 - item2:从小到大排序<br />
                /// item2 - item1:从大到小排序<br />
                /// item1 大于 item2:从小到大排序<br />
                /// item1 小于 item2:从大到小排序
                /// </summary>
                /// <param name="fn" type="function(item1, item2)"></param>
                if (this._datas.length > 0) {
                    intellisense.setCallContext(fn, { thisArg: this._datas[0], args: [this._datas[0], this._datas[0]] });
                }
                return this;
            },
            sortAsc: function (p) {
                /// <summary>
                /// 从小到大排序<br />
                /// sortAsc('max')<br />
                /// sortAsc()<br />
                /// sortAsc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                if (isFn)
                    if (this._datas.length > 0) {
                        intellisense.setCallContext(p, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                    }
                return this;
            },
            sortDesc: function (p) {
                /// <summary>
                /// 从大到小排序<br />
                /// sortDesc()<br />
                /// sortDesc('max')<br />
                /// sortDesc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                if (isFn)
                    if (this._datas.length > 0) {
                        intellisense.setCallContext(p, { thisArg: this._datas[0], args: [this._datas[0]] });
                    }
                return this;
            },
            unique: function (fn) {
                /// <summary>
                /// 去除重复<br />
                /// 用法1. unique()<br />
                /// 用法2. unique('prop')<br />
                /// 用法3. unique(function(item, index){ return item.prop; });
                /// </summary>
                /// <param name="fn" type="function(item, index)">可选</param>
                if (bingo.isFunction(fn))
                    if (this._datas.length > 0) {
                        intellisense.setCallContext(fn, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                    }
                return this;
            },
            count: function () { return 1; },
            first: function (defaultValue) {
                /// <summary>
                /// 查找第一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                return this._datas[0];
            },
            last: function (defaultValue) {
                /// <summary>
                /// 查找最后一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                return this._datas[0];
            },
            contain: function () {
                /// <summary>
                /// 是否存在数据
                /// </summary>
                return true;
            },
            index: function () {
                /// <summary>
                /// 索引
                /// </summary>
                return 1;
            },
            sum: function (callback) {
                /// <summary>
                /// 求和
                /// 用法1. sum()<br />
                /// 用法1. sum('n')<br />
                /// 用法2. sum(function(item, index){return item.n})
                /// </summary>
                /// <param name="callback" type="function(item, index)">可选</param>
                if (bingo.isFunction(callback))
                    if (this._datas.length > 0) {
                        intellisense.setCallContext(callback, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                    }
                return 1;
            },
            avg: function (callback) {
                /// <summary>
                /// 平均值
                /// 用法1. avg()<br />
                /// 用法1. avg('n')<br />
                /// 用法2. avg(function(item, index){return item.n})
                /// </summary>
                /// <param name="callback" type="function(item, index)">可选</param>
                if (bingo.isFunction(callback))
                    if (this._datas.length > 0) {
                        intellisense.setCallContext(callback, { thisArg: this._datas[0], args: [this._datas[0], 0] });
                    }
                return 1;
            },
            take: function (pos, count) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="pos">开始位置</param>
                /// <param name="count">可选， 取得数量， 默认全部</param>
                return this._datas;
            },
            toArray: function () { return this._datas; },
            toPage: function (page, pageSize) {
                /// <summary>
                /// 分页, toPage(1, 10)
                /// </summary>
                /// <param name="page">当前页, 从一开始</param>
                /// <param name="pageSize">每页记录数</param>
                return {
                    currentPage: 1, totalPage: 1, pageSize: 10,
                    totals: 1, list: this._datas
                };
            },
            group: function (callback, groupName, itemName) {
                /// <summary>
                /// 用法1. group('type', 'group', 'items')<br />
                /// 用法2. group(function(item, index){ return item.type; }, 'group', 'items');
                /// </summary>
                /// <param name="callback" type="function(item index)">function(item index){ return item.type;}</param>
                /// <param name="groupName">可选, 分组值, 默认group</param>
                /// <param name="itemName">可选, 分组内容值, 默认items</param>

                groupName || (groupName = 'group');
                itemName || (itemName = 'items');
                var obj = {};
                obj[groupName] = 'group';
                obj[itemName] = this._datas;

                this._datas = [obj];

                return this;
            }
        });

        this.Initialization(function (p) {
            this._datas = p || [];
        });
    });

    bingo.linq = function (list) { return _linqClass.NewObject(list); };

})(bingo);
