
; (function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.Event = function (owner, eList) {

        var fn = function (callback) {
            callback && fn.on(callback);
            return arguments.length == 0 ? fn : this;
        };

        fn.__bg_isEvent__ = true;
        fn.__eventList__ = eList || [];
        bingo.extend(fn, _eventDefine);
        fn.owner(owner);

        return fn;
    };
    bingo.isEvent = function (ev) {
        return ev && ev.__bg_isEvent__ === true;
    };

    var _eventDefine = {
        _end:false,
        _endArg: undefined,
        owner: function (owner) {
            if (arguments.length == 0)
                return this.__owner__;
            else {
                this.__owner__ = owner;
                return this;
            }
        },
        _this: function () { return this.owner() || this;},
        on: function (callback) {
            if (callback) {
                this._checkEnd(callback) || this.__eventList__.push({ one: false, callback: callback });
            }
            return this;
        },
        one: function (callback) {
            if (callback) {
                this._checkEnd(callback) || this.__eventList__.push({ one: true, callback: callback });
            }

            return this;
        },
        off: function (callback) {
            if (callback) {
                var list = [];
                bingo.each(this.__eventList__, function () {
                    if (this.callback != callback)
                        list.push(this);
                });
                this.__eventList__ = list;
            } else { this.__eventList__ = []; }
            return this;
        },
        _checkEnd: function (callback) {
            if (this._end) {
                var args = this._endArg || [], $this = this._this();
                setTimeout(function () { callback.apply($this, args); }, 1);
            }
            return this._end;
        },
        //结束事件, 先解除绑定事件, 以后绑定事件马上自动确发, 用于ready之类的场景
        end: function (args) {
            this._end = true; this._endArg = args;

            this.trigger(args);
            this.off();
            return this;
        },
        trigger: function () {
            var list = this.__eventList__, ret = null,
                eventObj = null, reList = null,
                $this = this._this();
            for (var i = 0, len = list.length; i < len; i++) {
                eventObj = list[i];
                if (eventObj.one === true) {
                    reList || (reList = this.__eventList__);
                    reList = bingo.removeArrayItem(eventObj, reList);
                } 
                if ((ret = eventObj.callback.apply($this, arguments[0] || [])) === false) break;
            }
            reList && (this.__eventList__ = reList);
            return ret;
        },
        triggerHandler: function () {
            var list = this.__eventList__, eventObj = null,
                $this = this._this();
            if (list.length == 0) return;
            eventObj = list[0];
            var ret = eventObj.callback.apply($this, arguments[0] || []);
            if (eventObj.one === true)
                this.__eventList__ = bingo.removeArrayItem(eventObj, this.__eventList__);
            return ret;
        },
        clone: function (owner) {
            return bingo.Event(owner || this.owner(), this.__eventList__);
        },
        size: function () { return this.__eventList__.length; }
    };


})(bingo);
