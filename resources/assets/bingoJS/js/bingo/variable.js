
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _isVar_ = 'isVar1212';
    bingo.isVariable = function (p) { return p && p._isVar_ == _isVar_; };
    bingo.variableOf = function (p) { return bingo.isVariable(p) ? p() : p; };

    /*
        观察变量: bingo.variable
        提供自由决定change状态, 以决定是否需要同步到view层
        使用$setChange方法设置为修改状态
    */
    var _variable  = bingo.variable = function (p, owner, view) {
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
                    fn._triggerFn([p1], false);
                fn.owner = null;
                return fn.$owner() || this;
            }
        };
        fn._isVar_ = _isVar_;
        //fn.value = value;
        fn._isChanged = true;
        bingo.extend(fn, _variableDefine);

        _extend && bingo.extend(fn, _extend);

        fn.$owner(owner).$view(view);
        fn(value);

        return fn;
    };

    var _extend = null;
    _variable.extend = function (ex) {
        if (!ex) return;
        _extend = bingo.extend(_extend || {}, ex);
    };

    var _variableDefine = {
        size: function () {
            var value = this.$get();
            return value && value.length || 0;
        },
        _triggerChange: function () {
            var value = this.$get();
            this._triggerFn([value], true);
            //this.$view() && this.$view().$updateAsync();
        },
        _addFn: function (fn, change, disposer, priority) {
            (this._fnList || (this._fnList = [])).push({ fn: fn, change: change, disposer: disposer, _priority: priority || 50 });
            this._fnList = bingo.linq(this._fnList).sortDesc('_priority').toArray();
            return this;
        },
        _triggerFn: function (args, change) {
            if (this._fnList) {
                var $this = this, hasRm = false;
                bingo.each(this._fnList, function () {
                    if (this.disposer && this.disposer.isDisposed) {
                        hasRm = true;
                        bingo.clearObject(this);
                        return;
                    }
                    if (change || !this.change)
                        this.fn.apply($this, args);
                });
                if (hasRm) {
                    this._fnList = bingo.linq(this._fnList).where(function () {
                        return this.fn;
                    }).toArray();
                }
            }
        },
        $off: function (callback) {
            if (arguments.length > 0)
                this._fnList = bingo.linq(this._fnList)
                    .where(function () {
                        if (this.fn == callback) {
                            bingo.clearObject(this);
                            return false;
                        } else
                            return true;
                    }).toArray();
            else {
                bingo.each(this._fnList, function () {
                    bingo.clearObject(this);
                });
                this._fnList = [];
            }
        },
        //赋值事件(当在赋值时, 不理值是否改变, 都发送事件)
        $assign: function (callback, disposer, priority) {
            return this._addFn(callback, false, disposer || this.$view(), priority);
        },
        //改变值事件(当在赋值时, 只有值改变了, 才发送事件)
        $subs: function (callback, disposer, priority) {
            return this._addFn(callback, true, disposer || this.$view(), priority);
        },
        //设置修改状态
        $setChange: function (isChanged) {
            this._isChanged = (isChanged !== false);
            if (this._isChanged) {
                this._triggerChange();
            }
            return this;
        },
        //用于observer检查
        _obsCheck: function () {
            var isChanged = this._isChanged;
            this._isChanged = false;
            return isChanged;
        },
        $get: function (fn) {
            if (arguments.length == 0) {
                return this._get_ ? this._get_.call(this) : this.value;
            } else {
                bingo.isFunction(fn) && (this._get_ = fn);
                return this;
            }
        },
        $set: function (fn) {
            if (bingo.isFunction(fn)) {
                this._set_ = fn;
                this(this.$get());
            }
            return this;
        },
        $view: function (view) {
            if (arguments.length == 0) {
                return this._view_;
            } else {
                this._view_ = view;
                return this;
            }
        },
        $owner: function (owner) {
            if (arguments.length == 0) {
                return this._owner_;
            } else {
                this._owner_ = owner;
                return this;
            }
        },
        $linq: function () {
            return bingo.linq(this.$get());
        },
        clone: function (owner) {
            var p = bingo.variable(this.value);
            p._get_ = this._get_;
            p._set_ = this._set_;
            p.$owner(owner || this.$owner()).$view(this.$view());
            return p;
        }
    };
    
})(bingo);
