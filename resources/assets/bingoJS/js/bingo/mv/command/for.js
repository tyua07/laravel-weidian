
(function (bingo) {
    //version 1.0.1
    "use strict";

    //var _renderReg = /[ ]*([^ ]+)[ ]+in[ ]+([^ ]+)(?:[ ]+tmpl=([^ ]+))*/g;
    var _renderReg = /[ ]*([^ ]+)[ ]+in[ ]+(?:(.+)[ ]+tmpl[ ]*=[ ]*(.+)|(.+))/;

    /*
        使用方法:
        bg-render="item in user.list"

        例:
        <select bg-render="item in list">
            ${if item.id == 1}
            <option value="${item.id}">text_${item.text}</option>
            ${else}
            <option value="${item.id}">text_${item.text}eee</option>
            ${/if}
        </select>
    */

    //bg-render
    //bg-render="datas"  ==等效==> bg-render="item in datas"
    //bg-render="item in datas"
    //bg-render="item in datas tmpl=#tmplid"    //tmpl以#开头认为ID
    //bg-render="item in datas tmpl=view/user/listtmpl"  //tmpl不以#开头认为url, 将会异步加载
    //bg-render="item in datas | asc"
    //bg-render="item in datas | asc tmpl=#tmplid"
    bingo.each(['bg-for', 'bg-render'], function (cmdName) {

        bingo.command(cmdName, function () {
            return {
                priority: 100,
                compileChild: false,
                link: ['$view', '$compile', '$node', '$attr', '$render', '$tmpl', function ($view, $compile, $node, $attr, $render, $tmpl) {
                    /// <param name="$view" value="bingo.view.viewClass()"></param>
                    /// <param name="$compile" value="function(){return bingo.compile();}"></param>
                    /// <param name="$node" value="$([])"></param>
                    /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
                    /// <param name="$render" value="function(html){return  bingo.render('');}"></param>

                    var attrData = _makeBindContext($node, $attr);
                    $node.html('');
                    //console.log(attrData);

                    if (!attrData) return;
                    var _itemName = attrData.itemName,
                        _tmpl = attrData.tmpl;

                    var _renderSimple = function (datas) {

                        var jElement = $node;
                        var html = '';
                        jElement.html('');
                        //if (!bingo.isArray(datas)) datas = bingo.isNull(datas) ? [] : [datas];
                        var withDataList = [];//收集数据
                        html = renderObj.render(datas, _itemName, null, -1, withDataList);
                        //console.log(withDataList);
                        //使用withDataList进行数组批量编译
                        bingo.isNullEmpty(html) || $compile().fromHtml(html).withDataList(withDataList).appendTo(jElement).compile();
                    };


                    var initTmpl = function (tmpl) {
                        renderObj = $render(tmpl);
                        $attr.$subsResults(function (newValue) {
                            _renderSimple(newValue);
                        }, true);
                        $attr.$initResults(function (value) {
                            _renderSimple(value);
                        });
                    };


                    var html = '', renderObj = null;

                    if (bingo.isNullEmpty(_tmpl)) {
                        html = attrData.html;
                    } else {
                        var isPath = (_tmpl.indexOf('#') != 0);
                        if (isPath) {
                            //从url加载
                            $tmpl(_tmpl).success(function (html) {
                                if (!bingo.isNullEmpty(html)) {
                                    initTmpl(html);
                                }
                            }).get();
                        } else {
                            //从ID加载
                            html = $(_tmpl).html();
                        }
                    }

                    if (!bingo.isNullEmpty(html)) {
                        initTmpl(html);
                    }

                }]
            };

        });

    });

    var _makeBindContext = function ($node, $attr) {
        var code = $attr.content;
        if (bingo.isNullEmpty(code))
            code = 'item in {}';
        if (!_renderReg.test(code)) {
            code = ['item in ', code].join('');
        }
        var _itemName = '', _dataName = '', _tmpl = '';
        //分析item名称, 和数据名称
        code.replace(_renderReg, function () {
            _itemName = arguments[1];
            _dataName = arguments[2];
            _tmpl = bingo.trim(arguments[3]);

            if (bingo.isNullEmpty(_dataName))
                _dataName = arguments[4];

            //console.log('render tmpl:', arguments);
        });

        $attr.$attrValue(_dataName);

        return {
            itemName: _itemName,
            dataName: _dataName,
            tmpl: _tmpl,
            html: _tmpl ? '' : bingo.compile.getNodeContentTmpl($node)
        }
    };
})(bingo);

