
(function (bingo) {
    
    bingo.extend({
        linkToDom: function (jSelector, callback) {
            /// <summary>
            /// 链接到DOM, 当DOM给删除时调用callback
            /// </summary>
            /// <param name="jSelector"></param>
            /// <param name="callback" type="function()"></param>
        },
        unLinkToDom: function (jSelector, callback) {
            /// <summary>
            /// 解除与DOM链接
            /// </summary>
            /// <param name="jSelector"></param>
            /// <param name="callback">可选</param>
        },
        isUnload: false
    });

    bingo.linkToDom.LinkToDomClass = bingo.Class(function () {

        this.Define({
            //是否从dom链接中删除
            isDisposeFormDom: false,
            linkToDom: function (jqSelector) {
                /// <summary>
                /// 联接到DOM, 当DOM给删除时销毁对象, 只能联一个
                /// </summary>
                /// <param name="jqSelector"></param>
                return this;
            },
            unlinkToDom: function () {
                /// <summary>
                /// 解除联接到DOM
                /// </summary>
                return this;
            }
        });

    });

})(bingo);
