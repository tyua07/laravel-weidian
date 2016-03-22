
(function (bingo) {
    /*
    使用方法:
    bg-include="helper.url"   //与变量绑定
    bg-include="#nodeid"   //以#开始, $('#nodeid').html()为内容
    bg-include="view/system/user/list"   //从url加载内容
*/
    var _renderItem = '_tinc_' + bingo.makeAutoId();
    bingo.each(['bg-include', 'bg-render-include'], function (cmdName) {
        var _isRender = cmdName == 'bg-render-include';
        bingo.command(cmdName, function () {
            return ['$view', '$attr', '$viewnode', '$tmpl', '$render', function ($view, $attr, $viewnode, $tmpl, $render) {
                /// <param name="$view" value="bingo.view.viewClass()"></param>
                /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
                /// <param name="$viewnode" value="bingo.view.viewnodeClass()"></param>
                /// <param name="$tmpl" value="function(url){ return bingo.tmpl('', $view);}"></param>

                var _prop = $attr.$attrValue();
                //如果值为空不处理
                if (bingo.isNullEmpty(_prop)) return;

                //是否绑定变量
                var _html = function (src) {
                    //src如果有#开头, 认为ID, 如:'$div1; 否则认为url, 如:tmpl/add.html
                    var isPath = (src.indexOf('#') != 0);
                    var html = '';
                    if (isPath)
                        $tmpl(src).success(function (rs) {
                            html = rs;
                            $viewnode.$html(_isRender ? $render(html).render({}, _renderItem) : html);
                        }).get();
                    else {
                        html = $(src).html();
                        $viewnode.$html(_isRender ? $render(html).render({}, _renderItem) : html);
                    }

                    //用$html方法, 设置html, 并自动编译
                };


                $attr.$initResults(function (value) {
                    var isLinkVal = !bingo.isUndefined(value);
                    if (isLinkVal) {
                        //如果绑定变量, 观察变量变化
                        $attr.$subsResults(function (newValue) {
                            _html(newValue);
                        });
                        _html(value);
                    } else
                        _html(_prop);//如果没有绑定变量,直接取文本
                });

            }];
        });
    });

})(bingo);
