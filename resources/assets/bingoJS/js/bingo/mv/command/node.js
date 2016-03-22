
(function (bingo) {

    bingo.command('bg-node', function () {

        return ['$attr', 'node', function ($attr, node) {
            $attr.$value(node);
        }];
    });

})(bingo);
