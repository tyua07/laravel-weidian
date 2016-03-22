
(function (bingo) {
    //version 1.1.0
    "use strict";


    /*
        支持js语句, 如: {{: item.name}} {{document.body.childNodes[0].nodeName}}
        支持if语句, 如: {{if item.isLogin} 已登录 {{else}} 未登录 {{/if}}
        支持for, 如: {{for item in list tmpl=#idAAA}} {{: item_index}}| {{: item.id}}|{{: item_count}}|{{: item_first}}|{{: item_last}} {{/for}}
        支持tmpl(注释)语句, 如 {{tmpl}} {{: item.text}} {{tmpl}}
        支持过滤器, 如: {{: item.name | text}}, 请参考过滤器
        支持header语句, 如: {{header}} 这里是头部 {{/header}}
        支持footer语句, 如: {{footer}} 这里是底部 {{/footer}}
        支持empty语句, 如: {{empty}} 当数据源数组为[], 长度为0 {{/empty}}
        支持loading语句, 如: {{empty}} 当数据源为null时 {{/loading}}
    */


    bingo.render = function (tmpl, view, node) {
        /// <summary>
        /// 获取一个render对象
        /// </summary>
        /// <param name="tmpl">render 模板</param>
        /// <param name="view">可选, 需注入时用</param>
        /// <param name="node">可选, 原生node, 需注入时用</param>
        return {
            render: function (list, itemName, parentData, parentWithIndex, outWithDataList) {
                /// <summary>
                /// render数据
                /// </summary>
                /// <param name="list">数据源</param>
                /// <param name="itemName">可选, item名称</param>
                /// <param name="parentData">可选, 上级数据</param>
                /// <param name="parentWithIndex">可选, 上级withindex, 如果没有应该为 -1</param>
                /// <param name="outWithDataList">可选, 数组， 收集withDataList</param>
                return tmpl;
            }
        };
    };

    //render正则
    bingo.render.regex = /\{\{\s*(\/?)(\:|if|else|for|tmpl|header|footer|empty|loading)(.*?)\}\}/g;   //如果要扩展标签, 请在(if )里扩展如(if |for ), 保留以后扩展

})(bingo);
