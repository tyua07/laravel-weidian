
(function (bingo) {

    /*
        使用方法:
        bg-style="{display:'none', width:'100px'}"
        bg-show="true"
        bg-show="res.show"
    */
    bingo.each('style,show,hide,visible'.split(','), function (attrName) {
        bingo.command('bg-' + attrName, function () {

            return ['$attr', '$node', function ($attr, $node) {
                /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
                /// <param name="$node" value="$([])"></param>

                var _set = function (val) {

                    switch (attrName) {
                        case 'style':
                            //bg-style="{display:'none', width:'100px'}"
                            $node.css(val);
                            break;
                        case 'hide':
                            val = !val;
                        case 'show':
                            if (val) $node.show(); else $node.hide();
                            break;
                        case 'visible':
                            val = val ? 'visible' : 'hidden';
                            $node.css('visibility', val);
                            break;
                        default:
                            $node.css(attrName, val);
                            break;
                    }
                };

                $attr.$subsResults(function (newValue) {
                    _set(newValue);
                }, (attrName == 'style'));

                $attr.$initResults(function (value) {
                    _set(value);
                });

            }];

        });
    });

})(bingo);
