
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _isVar_ = 'isVar1212';
    bingo.isVariable = function (p) {
        /// <summary>
        /// 是否增强变量(variable)
        /// </summary>
        /// <param name="p"></param>
        return p && p._isVar_ == _isVar_;
    };
    bingo.variableOf = function (p) {
        /// <summary>
        /// 返回变通JS变量
        /// </summary>
        /// <param name="p">可以JS变量或variable</param>
        return bingo.isVariable(p) ? p() : p;
    };

    /*
        观察变量: bingo.variable
        提供自由决定change状态, 以决定是否需要同步到view层
        使用$setChange方法设置为修改状态
    */
    var _variable = bingo.variable = function (p, owner, view) {
        var value = bingo.variableOf(p);
        var fn = function (p1) {
            fn.owner = this;
            if (arguments.length == 0) {
                var rtt = fn._get_ ? fn.$get() : fn.value;
                fn.owner = null;
                return rtt;
            } else {
                p1 = bingo.variableOf(p1);
                var old = bingo.clone(fn.$get());

                if (fn._set_)
                    fn._set_.call(fn, p1);
                else
                    fn.value = p1;
                p1 = fn.$get();
                var change = !bingo.equals(p1, old);

                if (change)
                    fn.$setChange();
                else
                    fn._onAssign && fn._onAssign().trigger([p1]);
                fn.owner = null;
                return fn.$owner() || this;;
            }
        };
        fn._isVar_ = _isVar_;
        fn.value = value;
        fn._isChanged = true;
        bingo.extend(fn, _variableDefine);

        _extend && bingo.extend(fn, _extend);

        fn.$owner(owner).$view(view);
        fn(value);

        return fn;
    };
    var _extend = null;
    _variable.extend = function (ex) {
        /// <summary>
        /// 扩展variable, bingo.variable.extend({ test: function () { }});
        /// </summary>
        if (!ex) return;
        _extend = bingo.extend(_extend || {}, ex);
    };

    var _variableDefine = {
        size: function () {
            return 1;
        },
        $off: function (callback) {
            /// <summary>
            /// 取消订阅
            /// </summary>
            /// <param name="callback">可选, 如果不传则取消所有订阅</param>

            return this;
        },
        $assign: function (callback, disposer, priority) {
            /// <summary>
            /// 赋值事件(当在赋值时, 不理值是否改变, 都发送事件)
            /// </summary>
            /// <param name="callback" type="function(value)"></param>
            /// <param name="disposer">可选， 当disposer.isDisposed时自动释放</param>
            /// <param name="priority">优先级, 越大越前, 默认50</param>

            bingo.isFunction(callback) && intellisenseSetCallContext(callback, this, [this.$get()]);
            return this;
        },
        $subs: function (callback, disposer, priority) {
            /// <summary>
            /// 改变值事件(当在赋值时, 只有值改变了, 才发送事件)
            /// </summary>
            /// <param name="callback" type="function(value)"></param>
            /// <param name="disposer">可选， 当disposer.isDisposed时自动释放</param>
            /// <param name="priority">优先级, 越大越前, 默认50</param>

            bingo.isFunction(callback) && intellisenseSetCallContext(callback, this, [this.$get()]);
            return this;
        },
        //设置修改状态
        $setChange: function (isChanged) {
            /// <summary>
            /// 设置修改状态
            /// </summary>
            /// <param name="isChanged">可选， 默认为true</param>

            return this;
        },
        $get: function (fn) {
            /// <summary>
            /// 设置或获取值fn
            /// </summary>
            /// <param name="fn" type="function()" value='fn.call(this)'></param>
            if (arguments.length == 0) {
                return this._get_ ? this._get_.call(this) : this.value;
            } else {
                bingo.isFunction(fn) && (this._get_ = fn);
                return this;
            }
        },
        $set: function (fn) {
            /// <summary>
            /// 设置fn
            /// </summary>
            /// <param name="fn" type="function(value)" value='fn.call(this)'></param>
            if (bingo.isFunction(fn)) {
                this._set_ = fn;
                this(this.$get());
            }
            return this;
        },
        $view: function (view) {
            /// <summary>
            /// 设置或获取view
            /// </summary>
            /// <param name="view"></param>
            if (arguments.length > 0) {
                return this._view_;
            } else {
                this._view_ = view;
                return this;
            }
        },
        $owner: function (owner) {
            /// <summary>
            /// 设置或获取owner
            /// </summary>
            /// <param name="owner"></param>
            if (arguments.length == 0) {
                return this._owner_;
            } else {
                this._owner_ = owner;
                return this;
            }
        },
        $linq: function () {
            /// <summary>
            /// 获取一个linq对象
            /// </summary>
            return bingo.linq(this.$get());
        },
        clone: function (owner) {
            /// <summary>
            /// clone, 只复制$get, $set, $owner, $view
            /// </summary>
            /// <param name="owner">新的owner</param>
            var p = bingo.variable(this.value);
            p._get_ = this._get_;
            p._set_ = this._set_;
            p.$owner(owner || this.$owner()).$view(this.$view());
            return p;
        }
    };

})(bingo);
