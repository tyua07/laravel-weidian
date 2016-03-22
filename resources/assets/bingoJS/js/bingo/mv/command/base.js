
(function (bingo) {

    bingo.command('text/bg-script', function () {

        return {
            //优先级, 越大越前, 默认50
            priority: 300,
            //是否编译子节点, 默认为true
            compileChild: false,
            //编译, (compilePre编译前-->action初始数据-->compile编译-->link连接command)
            compile: ['$attr', '$node', '$bindContext', function ($attr, $node, $bindContext) {

                $attr.$init(function () { return $node.html(); }, function (value) {
                    if (!bingo.isNullEmpty(value)) {
                        var bindContext = $bindContext(value);
                        bindContext.$eval();
                        bindContext.dispose();
                    }
                });

            }]
        };
    });

    bingo.command('bg-not-compile', function () {

        return {
            //是否编译子节点, 默认为true
            compileChild: false
        };
    });

})(bingo);
