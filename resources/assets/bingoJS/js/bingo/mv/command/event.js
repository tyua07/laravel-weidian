
(function (bingo) {
    /*
        使用方法:
        bg-event="{click:function(e){}, dblclick:helper.dblclick}"
        bg-click="helper.click"     //绑定到方法
        bg-click="helper.click()"   //直接执行方法
    */
    bingo.each('event,click,blur,change,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,contextmenu'.split(','), function (eventName) {
        bingo.command('bg-' + eventName, function () {

            return ['$view', '$node', '$attr', function ($view, $node, $attr) {
                /// <param name="$view" value="bingo.view.viewClass()"></param>
                /// <param name="$node" value="$([])"></param>
                /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>

                var bind = function (evName, callback) {
                    $node.on(evName, function () {
                        //console.log(eventName);
                        var r = callback.apply(this, arguments);
                        $view.$update();
                        return r;
                    });
                };

                if (eventName != 'event') {
                    var fn = $attr.$value();
                    if (!bingo.isFunction(fn))
                        fn = function (e) { return $attr.$eval(e); };
                    bind(eventName, fn);
                } else {
                    var evObj = $attr.$results();
                    if (bingo.isObject(evObj)) {
                        var fn = null;
                        for (var n in evObj) {
                            if (bingo.hasOwnProp(evObj, n)) {
                                fn = evObj[n];
                                if (bingo.isFunction(fn))
                                    bind(n, fn);
                            }
                        }
                    }
                }

            }];

        });
    });

})(bingo);
