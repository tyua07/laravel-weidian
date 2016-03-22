(function (bingo) {

    var _renderItem = '_tif_' + bingo.makeAutoId();

    bingo.each(['bg-if', 'bg-render-if'], function (cmdName) {
        var _isRender = cmdName == 'bg-render-if';
        bingo.command(cmdName, function () {
            return {
                compileChild: false,
                compile: ['$attr', '$node', '$compile', '$render', function ($attr, $node, $compile, $render) {
                    /// <param name="$compile" value="function(){return bingo.compile();}"></param>
                    /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
                    /// <param name="$node" value="$([])"></param>

                    var html = bingo.compile.getNodeContentTmpl($node),
                        _render = _isRender ? $render(html) : null;

                    var _set = function (value) {
                        $node.html('');
                        if (value) {
                            $node.show();
                            $compile().fromHtml(_isRender ? _render.render({}, _renderItem) : html).appendTo($node).compile();
                        } else
                            $node.hide();
                    };

                    $attr.$subsResults(function (newValue) {
                        _set(newValue);
                    });

                    $attr.$initResults(function (value) {
                        _set(value);
                    });

                }]
            };
        });
    });

})(bingo);
