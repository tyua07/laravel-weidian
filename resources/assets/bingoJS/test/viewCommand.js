/// <reference path="lib.js" />

//测试bingo.variable的作用
(function (bingo, $) {
    //version 1.1.0
    "use strict";

    bingo.command('helloInclude', function () {
        return {
            //模板
            tmpl: '<div>[<span bg-include></span>]</div>',
            //外部模板
            tmplUrl: '',
            //是否替换节点, 默认为false
            replace: false,
            //是否indclude, 默认为false, 模板内容要包函bg-include
            include: true,
            //是否新view, 默认为false
            view: false,
            //是否编译子节点, 默认为true
            compileChild: true,
            //link
            link: function ($view, $node) {
                //console.log($node);
            }
        };
    });

    bingo.command('bg-select', function () {
        return {
            compilePre: function ($node) {
                var attrValue = $node.attr('bg-select');
                $node.attr('bg-render', ['item in ', attrValue, '.list'].join(''));
                $node.attr('bg-model', [attrValue, '.id'].join(''));
            }
        };
    });

    bingo.command('bg-select-as', function () {
        return {
            as: function ($node) {
                var attrValue = $node.attr('bg-select-as');

                return [{
                    name: 'bg-render', value: ['item in ', attrValue, '.list'].join('')
                }, {
                    name: 'bg-model', value: [attrValue, '.id'].join('')
                }];
            }
        };
    });

    bingo.command('helloReplace', function () {
        return {
            //模板
            tmpl: '<div>[<span>aaaaa</span>]</div>',
            //外部模板
            tmplUrl: '',
            //是否替换节点, 默认为false
            replace: true,
            //是否indclude, 默认为false, 模板内容要包函bg-include
            include: false,
            //是否新view, 默认为false
            view: false,
            //是否编译子节点, 默认为true
            compileChild: true,
            //link
            link: function ($view, $node) {
                //console.log($node);
            }
        };
    });

    bingo.command('helloUrl', function () {
        return {
            //模板
            tmpl: '',
            //外部模板
            tmplUrl: 'test/tmpl/include2.html',
            //是否替换节点, 默认为false
            replace: true,
            //是否indclude, 默认为false, 模板内容要包函bg-include
            include: false,
            //是否新view, 默认为false
            view: false,
            //是否编译子节点, 默认为true
            compileChild: true,
            //link
            link: function ($view, $node) {
                //console.log($node);
            }
        };
    });


    //定义action1
    window.actionCommand = bingo.action(function ($view, $var, $model) {
        window.$view = $view;
        

        $view.input = 'aaaaa'
        $view.$subs('input', function (value) {
            $view.textTag = '11111<br />' + value;
            $view.text = 'text<br />' + value;
            $view.html = 'html<br />thml11' + value;
        });

        $view.textTag = '11111<br />';
        $view.text = 'text<br />';
        $view.html = 'html<br />thml11';


        $view.checkVal = true;
        $view.src = 'fav.gif';
        $view.clsName = 'testRed';
        $view.styWidth = 100;

        //==事件===================
        $view.clickCount1 = 0;
        $view.clickCount2 = 0;
        $view.clickCount3 = 0;
        $view.clickMe1 = function () {
            $view.clickCount1++;
        }
        $view.clickMe2 = function () {
            $view.clickCount2++;
        }
        $view.clickMe3 = function () {
            $view.clickCount3++;
        }

        //===form================
        $view.datas = $model({
            input: '1',
            select: '2',
            text: 'aaaa',
            checkVal: '1',
            checked: true,
            radio:'0'
        });
        $view.dataRes = '';
        $view.reportData = function () {
            var datas = $view.datas.toObject();
            $view.dataRes = JSON.stringify(datas);
        };
        $view.$subs('datas', function (value) {
            $view.dataRes = JSON.stringify(value);
        });

        //render===================
        var rd = bingo.render('{{: item.a}},{{: item.b}}[{{for nItem in item.items}}{{: nItem}}{{/for}}]||');
        var wList = [], rdDatas = [{ a: 1, b: 'bbbb1' }, { a: 2, b: 'bbbb2', items: [4, 5, 6] }, { a: 3, b: 'bbbb3', items: [7, 8, 9] }];
        //for (var i = 0; i < 200; i++) {
        //    rdDatas.push({ a: bingo.makeAutoId(), b: 'bbbb' + i });
        //}
        //console.time('render');
        //var str = rd.render(rdDatas,
        //    'item', null, -1, wList);
        //console.timeEnd('render');
        //console.log(str);
        //console.log(wList);
        $view.forList = $var(null);// rdDatas;
        setTimeout(function () {
            $view.forList([]);
            setTimeout(function () { $view.forList(rdDatas); }, 5000)
        }, 5000);
        $view.forItemClick = function (item, item1) { console.log(item, item1); };

        $view.selectTest = {
            id: $var('1'),
            list: $var([{ id: '1', text: '1111' }, { id: '2', text: '2222' }])
        };

        $view.selectTest.id.$subs(function (value) {

            console.log('selectTest.id', value);
        });

        $view.onReady(function () {
            $view.forList([]);
            $view.forList(null);
        });
    });

})(bingo, window.jQuery);
