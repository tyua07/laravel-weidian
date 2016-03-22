
(function (bingo) {

    /*
        var rd = $render('<div>{{: item.name}}</div>');
        var html = rd.render([{name:'张三'}, {name:'李四'}], 'item');
        var html2 = rd.render([{name:'王五'}, {name:'小六'}], 'item');
    */
    bingo.factory('$render', ['$view', 'node', function ($view, node) {
        /// <param name="$view" value="bingo.view.viewClass()"></param>
        /// <param name="node" value="document.body"></param>

        return function (tmpl) {
            return bingo.render(tmpl, $view, node);
        };

    }]);

})(bingo);
