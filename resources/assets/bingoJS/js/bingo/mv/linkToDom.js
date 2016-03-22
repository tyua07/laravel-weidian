
(function (bingo, $) {
    //version 1.0.1
    "use strict";
    var _lnkDomEvName = 'bingoLinkToDom';
    bingo.extend({
        linkToDom: function (jSelector, callback) {
            if (jSelector && bingo.isFunction(callback)) {
                var jo = $(jSelector);
                if (jo.size() > 0)
                    jo.one(_lnkDomEvName, callback);
                else
                    callback.call(jo);
            }
            return callback;
        },
        unLinkToDom: function (jSelector, callback) {
            if (jSelector) {
                var jo = $(jSelector);
                if (callback)
                    jo.off(_lnkDomEvName, callback);
                else
                    jo.off(_lnkDomEvName);

            }
        },
        isUnload: false
    });
    bingo.linkToDom.LinkToDomClass = bingo.Class(function () {

        this.Define({
            isDisposeFormDom:false,
            linkToDom: function (jqSelector) {
                this.__linkToDomInit();
                if (jqSelector) {
                    this.unlinkToDom();
                    var jo = this.__bg_lnk_dom = $(jqSelector);
                    this.__bg_lnk_fn = bingo.linkToDom(jo, bingo.proxy(this, function () {
                        //从dom链接中dispose
                        this.isDisposeFormDom = true;
                        this.dispose();
                        this.isDisposeFormDom = true;
                        //已经删除没必要了
                        //this.unlinkToDom();
                    }));
                }
                return this;
            },
            unlinkToDom: function () {
                if (this.__bg_lnk_dom && this.isDisposeFormDom !== true) {
                    bingo.unLinkToDom(this.__bg_lnk_dom, this.__bg_lnk_fn);
                    this.__bg_lnk_dom = null;
                }
                return this;
            },
            __linkToDomInit: function () {
                if (this.__isLinkToDomInit) return;
                this.__isLinkToDomInit = true;
                this.onDispose(function () {
                    this.unlinkToDom();
                });
            }
        });

    });

    var _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        //console.log(elems);
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler(_lnkDomEvName);
            } catch (e) { }
        }
        _cleanData.apply($, arguments);
    };

    $(window).unload(function () {
        bingo.isUnload = true;
        $(document.body).remove();
        $(document.documentElement).remove();
    });

})(bingo, window.jQuery);
