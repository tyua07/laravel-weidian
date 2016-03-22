
(function (bingo) {

    bingo.command('bg-text', function () {

        return ['$attr', '$node', function ($attr, $node) {
            /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
            /// <param name="$node" value="$([])"></param>

            var _set = function (val) {
                $node.text(bingo.toStr(val));
            };

            //订阅执行结果， 如果执行结果改变时，同步数据
            $attr.$subsResults(function (newValue) {
                _set(newValue);
            });

            //根据执行结果初始结果
            $attr.$initResults(function (value) {
                _set(value);
            });

        }];
    });

})(bingo);
