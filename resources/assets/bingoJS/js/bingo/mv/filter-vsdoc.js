
(function (bingo) {
    //version 1.1.0
    "use strict";

    bingo.filter.createFilter = function (content, view, node, withData) {
        /// <summary>
        /// 创建Filter
        /// </summary>
        /// <param name="content">filter内容, 如: "reiongId | eq:'dev' | len"</param>
        /// <param name="view">可选, 需注入时用</param>
        /// <param name="node">可选, 原生node, 需注入时用</param>
        /// <param name="withData">可选, withData</param>
        return {
            contentOrg: content,
            content: content,
            contentFT: content,
            filter: function (value) { return value; }
        };
    };

    //过滤器正则
    bingo.filter.regex = /[|]+[ ]?([^|]+)/g;

})(bingo);
