/// <reference path="../src/helper.js" />

describe('mvc - ' + helper.versionString, function () {

    var undefined;
    function fnTTTT() { };

    //beforeEach(function () {
    //    player = new Player();
    //    song = new Song();
    //});

    $(function () {
        bingo.rootView().onReady(function () {
            console.log('bingo.rootView().onReady');
        }).onReadyAll(function () {
            console.log('bingo.rootView().onReadyAll');
        });
    });


    it('list with', function () {

        var withFn = function (data) {
            with (data) {
                return function () {
                    if (arguments.length == 0)
                        return a;
                    else
                        a = arguments[0];
                };
            }
        };

        var data = {a:1};
        var fn = withFn(data);

        expect(data.a).toEqual(1);
        expect(fn()).toEqual(1);
        fn(2);
        expect(data.a).toEqual(2);
        expect(fn()).toEqual(2);

        data.a = 3;
        expect(data.a).toEqual(3);
        expect(fn()).toEqual(3);

        

    });


    it('bingo.linkToDom', function () {

        var jlinkdom = $('#ft-test-linkdom');

        //测试没有添加到document
        var jo = $('<div>sdf<span>text</span><span>text2</span></div>');//.appendTo(jlinkdom);
        var count = 0;
        bingo.linkToDom(jo, function () { count++; });
        bingo.linkToDom(jo, function () { count++; });
        bingo.linkToDom(jo.children(), function () { count++; });
        jo.remove();
        expect(count).toEqual(4);

        //测试添加到document
        jo = $('<div>sdf<span>text</span><span>text2</span></div>').appendTo(jlinkdom);
        count = 0;
        bingo.linkToDom(jo, function () { count++; });
        bingo.linkToDom(jo, function () { count++; });
        bingo.linkToDom(jo.children(), function () { count++; });
        jo.remove();
        jo.remove();
        expect(count).toEqual(4);

        //unLinkToDom
        jo = $('<div>sdf</div>');
        count = 0;
        var fn = function () { count++; };
        bingo.linkToDom(jo, fn);
        bingo.linkToDom(jo, function () { count++; });
        bingo.unLinkToDom(jo, fn);//unlink --> fn
        jo.remove();
        expect(count).toEqual(1);

        //unLinkToDom
        jo = $('<div>sdf</div>');
        count = 0;
        var fn = function () { count++; };
        bingo.linkToDom(jo, fn);
        bingo.linkToDom(jo, function () { count++; });
        bingo.unLinkToDom(jo);//unlink所有
        jo.remove();
        expect(count).toEqual(0);


        //测试bingo.linkToDom.LinkToDomClass的linkToDom
        jo = $('<div>sdf</div>');
        count = 0;
        var aCls = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {
            this.Initialization(function () {
                this.base();
                this.linkToDom(jo);
            });
        });
        var a = aCls.NewObject();
        a.onDispose(function () {
            count++;
        });
        jo.remove();
        expect(count).toEqual(1);

    });//end bingo.linkToDom

    it('bingo.module', function () {

        var count = 0;
        //定义module1
        bingo.module('module1', function () {
            //定义module1/controller1
            bingo.controller('controller1', function () {

                //定义module1/controller1/action1
                bingo.action('action1', function () {
                    count++;
                });

            });
        });

        //定义方法2：module1/controller1/action2
        bingo.module('module1')
            .controller('controller1')
            .action('action2', function () { count += 2; });

        //取得action1
        var action = bingo.module('module1')
            .controller('controller1')
            .action('action1');
        //执行
        action();
        //计数为1
        expect(count).toEqual(1);

        bingo.module('module1')
            .controller('controller1')
            .action('action2')();

        expect(count).toEqual(3);

        //直接定义acion
        bingo.action(function () { count++; })();

        expect(count).toEqual(4);


        //如果module或controller没有定义都会自动生成一个
        var c = bingo.module('module2')
            .controller('controller2');
        expect(bingo.isNull(c)).toEqual(false);

        //测试service
        count = 0;
        //定义module1
        bingo.module('module1', function () {
            //定义module1/srv1
            bingo.service('srv1', function () { count++; });
        });
        //定义方法2：module1/srv2
        bingo.module('module1').service('srv2', function () { count += 2; });

        bingo.module('module1').service('srv1')();
        expect(count).toEqual(1);

        bingo.module('module1').service('srv2')();
        expect(count).toEqual(3);


        count = 0;
        //src2为module1的， 所有bingo.service('srv2')为空
        expect(bingo.isNull(bingo.service('srv2'))).toEqual(true);
        //定义全局srv3
        bingo.service('srv3', function () { count++; })
        //module1的service如果找不到， 会自动找全局
        bingo.module('module1').service('srv3')();
        bingo.service('srv3')();
        expect(count).toEqual(2);

        count = 0;
        //定义module1的cmd
        bingo.module('module1').command('cmd', function () { return function () { count++; }; });
        //module1的cmd, 全局不能用
        expect(bingo.isNull(bingo.command('cmd'))).toEqual(true);
        bingo.module('module1').command('cmd').link();
        expect(count).toEqual(1);
        //定义全局cmd1
        bingo.command('cmd1', function () { return function () { count++; }; });
        //如果module1找不到cmd1, 向全局找
        bingo.module('module1').command('cmd1').link();
        bingo.command('cmd1').link();
        expect(count).toEqual(3);


        bingo.command('cmd2', function () {
            return {
                complie: function () { count++; },
                link: function () { count++; }
            };
        });
        bingo.command('cmd2').complie();
        bingo.command('cmd2').link();
        expect(count).toEqual(5);


        count = 0;
        //定义module1的ft
        bingo.module('module1').filter('ft', function () { count++; });
        //module1的ft, 全局不能用
        expect(bingo.isNull(bingo.filter('ft'))).toEqual(true);
        bingo.module('module1').filter('ft')();
        expect(count).toEqual(1);
        //定义全局ft1
        bingo.filter('ft1', function () { count++; });
        //如果module1找不到ft1, 向全局找
        bingo.module('module1').filter('ft1')();
        bingo.filter('ft1')();
        expect(count).toEqual(3);

        count = 0;
        //定义module1的fat
        bingo.module('module1').factory('fat', function ($view) { count++; });
        //module1的fat, 全局不能用
        expect(bingo.isNull(bingo.factory('fat', true))).toEqual(true);
        bingo.module('module1').factory('fat').inject();
        expect(count).toEqual(1);
        //定义全局fat1
        bingo.factory('fat1', function () { count++; });
        //如果module1找不到fat1, 向全局找
        bingo.module('module1').factory('fat1').inject();
        bingo.factory('fat1').inject();
        expect(count).toEqual(3);

    });//end bingo.module


    it('bingo.render', function () {
        var datas = [{ n: 1, text: 'aaaa<br />' }];
        var tmpl = '{{: item.n}},{{: item.text}},{{: item.text | text}}';

        //创建 render对象
        var rd = bingo.render(tmpl);
        //render数据datas
        var str = rd.render(datas);
        //console.log(str);
        expect(str).toEqual('1,aaaa<br />,aaaa&lt;br /&gt;');

        //测试withDataList================================
        var withDataList = [];
        //render数据datas, 并输出withDataList
        str = rd.render(datas, 'item', null, -1, withDataList);
        //console.log(str, JSON.stringify(withDataList));
        expect(str).toEqual('<!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_0-->1,aaaa<br />,aaaa&lt;br /&gt;<!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1-->');
        expect(withDataList, [{ "item_index": 0, "item_count": 1, "item_first": true, "item_last": true, "item_odd": true, "item_even": false, "item": { "n": 1, "text": "aaaa<br />" } }]);


        //测试if================================
        datas = [{ n: 1, text: '111' }, { n: 2, text: '2222' }, { n: 3, text: '333' }];
        tmpl = '{{if item.n == 2}}oo2{{/if}}{{if item.n == 1}}ok1 {{: item.text}}{{else item.n == 2}}ok2 {{: item.text}}{{else}}ok3 {{: item.text}}{{/if}}';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas);
        //console.log(str);
        expect(str).toEqual('ok1 111oo2ok2 2222ok3 333');

        str = rd.render({n:2, text:'object 111'});
        //console.log(str);
        expect(str).toEqual('oo2ok2 object 111');


        //测试if -- for================================
        datas = [{ n: 1, text: '111' }, { n: 2, text: '2222' }, {
            n: 3, text: '333',
            children: [{ n: 4, text: '444' }, { n: 5, text: '555' }]
        }];
        tmpl = '{{if item.n == 2}}oo2{{/if}}{{if item.n == 1}}ok1 {{: item.text}}{{else item.n == 2}}ok2 {{: item.text}}{{else}}ok3 {{: item.text}} children:{{for cItem in item.children}}{{: cItem.text}},{{/for}}{{/if}}';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas);
        //console.log(str);
        expect(str).toEqual('ok1 111oo2ok2 2222ok3 333 children:444,555,');

        //测试for================================
        datas = [{
            n: 1, text: '111',
            children: [{ n: 12, text: '1222' }, { n: 13, text: '1333', children: [{ n: 121, text: '1222111' }, { n: 131, text: '1333111' }] }]
        }, { n: 2, text: '2222' }, {
            n: 3, text: '333',
            children: [{ n: 4, text: '444' }, { n: 5, text: '555' }]
        }];
        tmpl = '{{: item.text}} children:{{for cItem in item.children}}{{: cItem.text}} children:{{for ccItem in cItem.children}}{{: ccItem.text}},{{/for}}$${{/for}}||';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas);
        //console.log(str);
        expect(str).toEqual('111 children:1222 children:$$1333 children:1222111,1333111,$$||2222 children:||333 children:444 children:$$555 children:$$||');

        //测试header, footer, empty, loading================================
        datas = [{
            n: 1, text: '111',
            children: [{ n: 12, text: '1222' }, { n: 13, text: '1333' }]
        }, { n: 2, text: '2222' }];
        tmpl = '{{header}}headerOK{{/header}}{{footer}}footerOK{{/footer}}, {{: item.text}}{{empty}}emptyOK{{/empty}}{{loading}}loadingOK{{/loading}}';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas);
        expect(str).toEqual('headerOK, 111, 2222footerOK');
        str = rd.render([]);
        expect(str).toEqual('headerOKemptyOKfooterOK');
        str = rd.render(null);
        expect(str).toEqual('headerOKloadingOKfooterOK');

        tmpl = '{{for cItem in item.children}}{{header}}headerOK{{/header}}{{footer}}footerOK{{/footer}}, {{: cItem.text}}{{empty}}emptyOK{{/empty}}{{/for}}';
        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas);
        expect(str).toEqual('headerOK, 1222, 1333footerOKheaderOKemptyOKfooterOK');



        //测试widthDataList   if -- for================================
        withDataList = [];
        datas = [{ n: 1, text: '111' }, { n: 2, text: '2222' }, {
            n: 3, text: '333',
            children: [{ n: 4, text: '444' }, { n: 5, text: '555' }]
        }];
        tmpl = '{{if item.n == 2}}oo2{{/if}}{{if item.n == 1}}ok1 {{: item.text}}{{else item.n == 2}}ok2 {{: item.text}}{{else}}ok3 {{: item.text}} children:{{for cItem in item.children}}{{: cItem.text}},{{/for}}{{/if}}';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas, 'item', null, -1, withDataList);
        //console.log(str);
        //console.log(JSON.stringify(withDataList));
        expect(str).toEqual('<!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_0-->ok1 111<!--bingo_cmpwith_-1--><!--bingo_cmpwith_1-->oo2ok2 2222<!--bingo_cmpwith_-1--><!--bingo_cmpwith_2-->ok3 333 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_2--><!--bingo_cmpwith_3-->444,<!--bingo_cmpwith_2--><!--bingo_cmpwith_4-->555,<!--bingo_cmpwith_2--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_2--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1-->');
        expect(withDataList).toEqual([{ "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111" } }, { "$parent": null, "$index": 1, "item_index": 1, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": false, "item_last": false, "$odd": false, "item_odd": false, "$even": true, "item_even": true, "item": { "n": 2, "text": "2222" } }, { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, { "$parent": { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, "$index": 0, "item_index": 2, "$count": 2, "item_count": 3, "$first": true, "item_first": false, "$last": false, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] }, "cItem_index": 0, "cItem_count": 2, "cItem_first": true, "cItem_last": false, "cItem_odd": true, "cItem_even": false, "cItem": { "n": 4, "text": "444" } }, { "$parent": { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, "$index": 1, "item_index": 2, "$count": 2, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 5, "text": "555" } }]);


        //测试widthDataList for================================
        withDataList = [];
        datas = [{
            n: 1, text: '111',
            children: [{ n: 12, text: '1222' }, { n: 13, text: '1333', children: [{ n: 121, text: '1222111' }, { n: 131, text: '1333111' }] }]
        }, { n: 2, text: '2222' }, {
            n: 3, text: '333',
            children: [{ n: 4, text: '444' }, { n: 5, text: '555' }]
        }];
        tmpl = '{{: item.text}} children:{{for cItem in item.children}}{{: cItem.text}} children:{{for ccItem in cItem.children}}{{: ccItem.text}},{{/for}}$${{/for}}||';

        //创建 render对象
        rd = bingo.render(tmpl);
        //render数据datas
        str = rd.render(datas, 'item', null, -1, withDataList);
        console.log(str);
        //console.log(JSON.stringify(withDataList));
        expect(str).toEqual('<!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_0-->111 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_0--><!--bingo_cmpwith_1-->1222 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_1-->$$<!--bingo_cmpwith_0--><!--bingo_cmpwith_2-->1333 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_2--><!--bingo_cmpwith_3-->1222111,<!--bingo_cmpwith_1--><!--bingo_cmpwith_4-->1333111,<!--bingo_cmpwith_1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_2-->$$<!--bingo_cmpwith_0--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_0-->||<!--bingo_cmpwith_-1--><!--bingo_cmpwith_5-->2222 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_5--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_5-->||<!--bingo_cmpwith_-1--><!--bingo_cmpwith_6-->333 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_6--><!--bingo_cmpwith_7-->444 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_7--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_7-->$$<!--bingo_cmpwith_2--><!--bingo_cmpwith_8-->555 children:<!--bingo_cmpwith_-1--><!--bingo_cmpwith_8--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_8-->$$<!--bingo_cmpwith_2--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_6-->||<!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1--><!--bingo_cmpwith_-1-->');
        expect(withDataList).toEqual([{ "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] } }, { "$parent": { "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] } }, "$index": 0, "item_index": 0, "$count": 2, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 0, "cItem_count": 2, "cItem_first": true, "cItem_last": false, "cItem_odd": true, "cItem_even": false, "cItem": { "n": 12, "text": "1222" } }, { "$parent": { "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] } }, "$index": 1, "item_index": 0, "$count": 2, "item_count": 3, "$first": false, "item_first": true, "$last": true, "item_last": false, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] } }, { "$parent": { "$parent": { "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] } }, "$index": 1, "item_index": 0, "$count": 2, "item_count": 3, "$first": false, "item_first": true, "$last": true, "item_last": false, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] } }, "$index": 0, "item_index": 0, "$count": 2, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }, "ccItem_index": 0, "ccItem_count": 2, "ccItem_first": true, "ccItem_last": false, "ccItem_odd": true, "ccItem_even": false, "ccItem": { "n": 121, "text": "1222111" } }, { "$parent": { "$parent": { "$parent": null, "$index": 0, "item_index": 0, "$count": 3, "item_count": 3, "$first": true, "item_first": true, "$last": false, "item_last": false, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] } }, "$index": 1, "item_index": 0, "$count": 2, "item_count": 3, "$first": false, "item_first": true, "$last": true, "item_last": false, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] } }, "$index": 1, "item_index": 0, "$count": 2, "item_count": 3, "$first": false, "item_first": true, "$last": true, "item_last": false, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 1, "text": "111", "children": [{ "n": 12, "text": "1222" }, { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 13, "text": "1333", "children": [{ "n": 121, "text": "1222111" }, { "n": 131, "text": "1333111" }] }, "ccItem_index": 1, "ccItem_count": 2, "ccItem_first": false, "ccItem_last": true, "ccItem_odd": false, "ccItem_even": true, "ccItem": { "n": 131, "text": "1333111" } }, { "$parent": null, "$index": 1, "item_index": 1, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": false, "item_last": false, "$odd": false, "item_odd": false, "$even": true, "item_even": true, "item": { "n": 2, "text": "2222" } }, { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, { "$parent": { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, "$index": 0, "item_index": 2, "$count": 2, "item_count": 3, "$first": true, "item_first": false, "$last": false, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] }, "cItem_index": 0, "cItem_count": 2, "cItem_first": true, "cItem_last": false, "cItem_odd": true, "cItem_even": false, "cItem": { "n": 4, "text": "444" } }, { "$parent": { "$parent": null, "$index": 2, "item_index": 2, "$count": 3, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": true, "item_odd": true, "$even": false, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] } }, "$index": 1, "item_index": 2, "$count": 2, "item_count": 3, "$first": false, "item_first": false, "$last": true, "item_last": true, "$odd": false, "item_odd": true, "$even": true, "item_even": false, "item": { "n": 3, "text": "333", "children": [{ "n": 4, "text": "444" }, { "n": 5, "text": "555" }] }, "cItem_index": 1, "cItem_count": 2, "cItem_first": false, "cItem_last": true, "cItem_odd": false, "cItem_even": true, "cItem": { "n": 5, "text": "555" } }]);


    });// end bingo.render

    it('bingo.ajax', function () {

        var url = 'src/test/ajax_load.html';

        var successRs, errorRs, alwayRs, isok = false;
        //测试成功====================
        bingo.ajax(url).success(function (rs) {
            successRs = rs;
        }).error(function (rs) {
            errorRs = rs;
        }).alway(function (rs) {
            alwayRs = rs;
            isok = true;
        }).dataType('text').get();

        waitsFor(function () { return isok; });

        runs(function () {
            expect(successRs).toEqual('<div>ajax_load_ok</div>');
            expect(alwayRs).toEqual(successRs);
            expect(bingo.isNullEmpty(errorRs)).toEqual(true);


            //测试失败====================
            url = 'src/test/ajax_load_no.html';//没有此文件， 所有会error
            successRs = '', errorRs = '', isok = false;
            bingo.ajax(url).success(function (rs) {
                successRs = rs;
            }).error(function (rs) {
                errorRs = rs;
            }).alway(function (rs) {
                alwayRs = rs;
                isok = true;
            }).dataType('text').get();

            waitsFor(function () { return isok; });

            runs(function () {
                expect(bingo.isNullEmpty(successRs)).toEqual(true);

                expect(bingo.isNullEmpty(errorRs)).toEqual(false);
                expect(alwayRs).toEqual(errorRs);
            });

        });

    });//end bingo.ajax


    it('bingo.ajax cache', function () {

        var url = 'src/test/ajax_load.html';
        var cacheObj = {};

        var successRs, isok = false, cacheQurey = true;
        var testCache = function (callback) {
            bingo.ajax(url).success(function (rs) {
                successRs = rs;
                isok = true;
            }).cacheTo(cacheObj).cacheQurey(cacheQurey).dataType('text').get();

            waitsFor(function () { return isok; });

            runs(function () {
                callback && callback();
            });
        };
        testCache(function () {
            var co = bingo.cacheToObject(cacheObj).key(url);
            var str = co.get();
            expect(bingo.isNullEmpty(str)).toEqual(false);
            expect(str).toEqual(successRs);
            expect(co._datas.length).toEqual(1);

            successRs = '', isok = false;

            testCache(function () {
                var co = bingo.cacheToObject(cacheObj).key(url);
                var str1 = co.get();
                expect(bingo.isNullEmpty(str1)).toEqual(false);
                expect(str1).toEqual(successRs);
                expect(str1).toEqual(str);
                expect(co._datas.length).toEqual(1);

                successRs = '', isok = false, url = url + '?id=1111';
                testCache(function () {
                    var co = bingo.cacheToObject(cacheObj).key(url);
                    var str2 = co.get();
                    expect(bingo.isNullEmpty(str2)).toEqual(false);
                    expect(str2).toEqual(successRs);
                    expect(str2).toEqual(str1);
                    expect(co._datas.length).toEqual(2);//2个缓存

                    var url_old = url;
                    successRs = '', isok = false, cacheQurey = false, url = url + '?id=222222';
                    testCache(function () {
                        var co = bingo.cacheToObject(cacheObj).key(url);
                        var str2 = co.get();
                        expect(bingo.isNullEmpty(str2)).toEqual(true);
                        str2 = co.key(url_old).get();
                        expect(bingo.isNullEmpty(str2)).toEqual(false);
                        expect(str2).toEqual(successRs);
                        expect(str2).toEqual(str1);
                        expect(co._datas.length).toEqual(2);//2个缓存

                        console.log(cacheObj);
                    });
                });

            });
        });

    });//end bingo.ajax

    describe('bingo.compile ======>', function () {

        //设置action资源路由
        bingo.route('action1', {
            url: 'action1/src/test/{action}',
            toUrl: '{module}/{controller}/{action}.js',
            defaultValue: { module: 'src', controller: 'test', action: 'list' }
        });

        it('bingo.compile', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action>{{: title}}</div>';

            var complieOk = false;
            var status = [], htmlIn = '';
            bingo.compile().fromHtml(html).action(function ($view) {
                $view.title = 'aaa';
                $view.onInitData(function () {
                    status.push('onInitData');
                });
                $view.onReady(function () {
                    status.push('onReady');
                });
                $view.onReadyAll(function () {
                    status.push('onReadyAll');
                    setTimeout(function () { htmlIn = jo.children().html(); jo.html(''); }, 10);
                });
                $view.onDispose(function () {
                    status.push('onDispose');
                    complieOk = true;
                });
            }).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                expect(htmlIn).toEqual('aaa');
                expect(status).toEqual(["onInitData", "onReady", "onReadyAll", "onDispose"]);
            });

        });//end bingo.compile

        it('bingo.compile children Ready', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action>{{: title}}<div bg-action="childAction1">{{: title}}<div bg-action="childAction3">{{title}}</div></div><div bg-action="childAction2">{{: title}}</div></div>';

            var complieOk = false;
            var status = [], text = '';
            bingo.compile().fromHtml(html).action(function ($view) {
                $view.title = 'aaa';
                $view.onInitData(function () {
                    status.push('onInitData');
                });
                $view.onReady(function () {
                    status.push('onReady');
                });
                $view.onReadyAll(function () {
                    status.push('onReadyAll');
                    //helper.reportView($view);
                    setTimeout(function () { text = jo.children().text(); jo.html(''); }, 10);
                });
                $view.onDispose(function () {
                    status.push('onDispose');
                    setTimeout(function () { complieOk = true; }, 10);
                });

                $view.childAction1 = bingo.action(['$view', function ($childView1) {
                    $childView1.title = '$childView1';
                    $childView1.onInitData(function () {
                        status.push('onInitData $childView1');
                    });
                    $childView1.onReady(function () {
                        status.push('onReady $childView1');
                    });
                    $childView1.onReadyAll(function () {
                        status.push('onReadyAll $childView1');
                    });
                    $childView1.onDispose(function () {
                        status.push('onDispose $childView1');
                    });

                    $childView1.childAction3 = bingo.action(['$view', function ($childView3) {
                        $childView3.title = '$childView3';
                        $childView3.onInitData(function () {
                            status.push('onInitData $childView3');
                        });
                        $childView3.onReady(function () {
                            status.push('onReady $childView3');
                        });
                        $childView3.onReadyAll(function () {
                            status.push('onReadyAll $childView3');
                        });
                        $childView3.onDispose(function () {
                            status.push('onDispose $childView3');
                        });
                    }]);

                }]);

                $view.childAction2 = bingo.action(['$view', function ($childView2) {
                    $childView2.title = '$childView2';
                    $childView2.onInitData(function () {
                        status.push('onInitData $childView2');
                    });
                    $childView2.onReady(function () {
                        status.push('onReady $childView2');
                    });
                    $childView2.onReadyAll(function () {
                        status.push('onReadyAll $childView2');
                    });
                    $childView2.onDispose(function () {
                        status.push('onDispose $childView2');
                    });
                }]);

            }).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                //console.log(status);
                expect(status.length).toEqual(16);
                var indexReadyAll = bingo.inArray('onReadyAll', status);
                var indexReadyAll1 = bingo.inArray('onReadyAll $childView1', status);
                var indexReadyAll2 = bingo.inArray('onReadyAll $childView2', status);
                var indexReadyAll3 = bingo.inArray('onReadyAll $childView3', status);

                expect(indexReadyAll >= 0 && indexReadyAll1 >= 0 && indexReadyAll2 >= 0 && indexReadyAll3 >= 0).toEqual(true);

                expect(indexReadyAll3 < indexReadyAll1).toEqual(true);
                expect(indexReadyAll2 < indexReadyAll && indexReadyAll1 < indexReadyAll).toEqual(true);

                expect(text).toEqual('aaa$childView1$childView3$childView2');

            });

        });//end bingo.compile children Ready

        it('bingo.compile children Ready async', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action="action1/src/test/act">{{: title}}<div bg-action="action1/src/test/act1">{{: title}}<div bg-action="action1/src/test/act3">{{title}}</div></div><div bg-action="action1/src/test/act2">{{: title}}</div></div>';

            var complieOk = false;
            var status = window.srcTestActStatus = [], text = '';
            //console.log('aaaaaa================');
            bingo.compile().fromHtml(html).action(function ($view) {
                //console.log($view.$getModule());
                //$cache('status', status);

                $view.onReadyAll(function () {
                    setTimeout(function () { text = jo.children().text(); jo.html(''); }, 1);
                });
                $view.onDispose(function () {
                    setTimeout(function () { complieOk = true; }, 1);
                });

            }).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                //console.log(status);
                expect(text).toEqual('aaa$childView1$childView3$childView2');
                expect(status.length).toEqual(16);
                var indexReadyAll = bingo.inArray('onReadyAll', status);
                var indexReadyAll1 = bingo.inArray('onReadyAll $childView1', status);
                var indexReadyAll2 = bingo.inArray('onReadyAll $childView2', status);
                var indexReadyAll3 = bingo.inArray('onReadyAll $childView3', status);

                expect(indexReadyAll >= 0 && indexReadyAll1 >= 0 && indexReadyAll2 >= 0 && indexReadyAll3 >= 0).toEqual(true);

                expect(indexReadyAll3 < indexReadyAll1).toEqual(true);
                expect(indexReadyAll2 < indexReadyAll && indexReadyAll1 < indexReadyAll).toEqual(true);

                expect(text).toEqual('aaa$childView1$childView3$childView2');

            });

        });//end bingo.compile children Ready async

        it('bingo.compile action noop', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action>{{: title}}</div>';

            var complieOk = false;
            bingo.compile().fromHtml(html).action(function ($view) {
                $view.title = 'aaaa';
                $view.onReadyAll(function () {
                    complieOk = true;
                });

            }).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                expect(jo.text()).toEqual('aaaa');
            });

        });//end bingo.compile action


        it('bingo.compile action module', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action="action1/src/test/action1">{{: title}}</div>';

            var complieOk = false;
            bingo.module('src').controller('test').action('action1', function ($view) {
                $view.title = 'test/action1';
                $view.onReadyAll(function () {
                    complieOk = true;
                });
            });
            bingo.compile().fromHtml(html).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                expect(jo.text()).toEqual('test/action1');
                jo.html('');
            });

        });//bingo.compile action module

        it('bingo.compile action async', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action="action1/src/test/action2">{{: title}}</div>';

            var complieOk = false;
            bingo.compile().fromHtml(html).appendTo(jo).action(function ($view) {
                $view.onReadyAll(function () {
                    complieOk = true;
                });
            }).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                expect(jo.text()).toEqual('test/action2');
                jo.html('');
            });

        });//bingo.compile action module



        it('bingo.compile 分析', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action>{{: title}}<div bg-action="childAction1">{{: title}}<div bg-action="childAction3">{{title}}</div></div><div bg-action="childAction2">{{: title}}</div></div>';

            var complieOk = false;
            var reportDatas = [], reportView = null;
            bingo.compile().fromHtml(html).action(function ($view) {

                reportView = $view;

                $view.title = 'aaa';
                $view.onReadyAll(function () {
                    setTimeout(function () { text = jo.children().text(); complieOk = true; }, 10);
                });
                $view.onDispose(function () {
                    reportDatas = helper.reportView($view);
                    //setTimeout(function () { complieOk = true; }, 10);
                });

                $view.childAction1 = bingo.action(['$view', function ($childView1) {
                    $childView1.title = '$childView1';

                    $childView1.childAction3 = bingo.action(['$view', function ($childView3) {
                        $childView3.title = '$childView3';
                    }]);

                }]);

                $view.childAction2 = bingo.action(['$view', function ($childView2) {
                    $childView2.title = '$childView2';
                    
                }]);

            }).appendTo(jo).compile();

            waitsFor(function () { return complieOk; });

            runs(function () {
                expect(text).toEqual('aaa$childView1$childView3$childView2');

                //report view 内容情况=====================
                //console.log(reportView);
                reportDatas = helper.reportView(reportView);
                //console.log(reportDatas);
                var view = reportDatas[0];

                var attrDisposeCount = 0, textDisposeCount = 0;
                
                expect(!bingo.isNull(view)).toEqual(true);
                expect(view.children.length).toEqual(2);
                var viewnode = view.viewnodes;
                expect(viewnode.attrList.length).toEqual(1);
                expect(viewnode.attrList[0].attrName).toEqual('bg-action');
                expect(viewnode.textList.length).toEqual(0);
                expect(viewnode.textNodes.length).toEqual(0);
                expect(viewnode.children.length).toEqual(0);
                expect(viewnode.isAction).toEqual(true);
                expect(viewnode.isCompiled).toEqual(true);
                expect(viewnode.isLinked).toEqual(true);
                expect(bingo.isNull(viewnode.withData)).toEqual(true);

                viewnode.attrList[0].onDispose(function () { attrDisposeCount++; });

                //viewnode.children

                var childView1 = view.children[0];
                var childView2 = view.children[1];
                var childView3 = childView1.children[0];
                expect(childView1.children.length).toEqual(1);
                expect(childView2.children.length).toEqual(0);
                expect(childView3.children.length).toEqual(0);

                viewnode = childView1.viewnodes;
                expect(viewnode.attrList.length).toEqual(1);
                expect(viewnode.attrList[0].attrName).toEqual('bg-action');
                expect(viewnode.textList.length).toEqual(0);
                expect(viewnode.textNodes.length).toEqual(0);
                expect(viewnode.children.length).toEqual(0);
                expect(viewnode.isAction).toEqual(true);
                expect(viewnode.isCompiled).toEqual(true);
                expect(viewnode.isLinked).toEqual(true);
                expect(bingo.isNull(viewnode.withData)).toEqual(true);

                viewnode.attrList[0].onDispose(function () { attrDisposeCount++; });

                viewnode = childView3.viewnodes;
                expect(viewnode.attrList.length).toEqual(1);
                expect(viewnode.attrList[0].attrName).toEqual('bg-action');
                expect(viewnode.textList.length).toEqual(1);
                expect(viewnode.textNodes.length).toEqual(1);
                expect(viewnode.children.length).toEqual(0);
                expect(viewnode.isAction).toEqual(true);
                expect(viewnode.isCompiled).toEqual(true);
                expect(viewnode.isLinked).toEqual(true);
                expect(bingo.isNull(viewnode.withData)).toEqual(true);

                viewnode.attrList[0].onDispose(function () { attrDisposeCount++; });
                viewnode.textList[0].onDispose(function () { textDisposeCount++; });

                //删除后=====================
                jo.html('');//删除内容
                expect(reportView.isDisposed).toEqual(true);
                expect(attrDisposeCount).toEqual(3);
                expect(textDisposeCount).toEqual(1);

            });

        });//end bingo.compile 分析

    });//end bingo.compile

    describe('bingo.bind ======>', function () {

        it('$bindContext', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action><span aaa="title"></span></div>';
            bingo.compile().fromHtml(html).action(function ($view, $node, $bindContext) {

                $view.title = 'aaaaa';

                var bind = $bindContext('title+"3333"');
                var val = bind.$results();
                expect(val).toEqual($view.title + '3333');

                bind = $bindContext('title');
                val = bind.$results();
                expect(val).toEqual($view.title);
                val = bind.$value();
                expect(val).toEqual($view.title);
                bind.$value('11111')
                expect($view.title).toEqual('11111');
                
            }).appendTo(jo).compile();

            jo.remove();

        });

        it('$nodeContext', function () {
            var jo = $('<div></div>');

            var html = '<div bg-action><span testbind="title"></span></div>';
            bingo.compile().fromHtml(html).action(function ($view, $node, $bindContext, $nodeContext) {

                $view.title = 'aaaaa';

                var node = $view.$getNode('span')[0];
                var nodeBind = $nodeContext(node);

                var attr = nodeBind.$getAttr('testbind');
                val = attr.$value();
                expect(val).toEqual('aaaaa');
                val = attr.$results();
                expect(val).toEqual('aaaaa');
                expect($view.title).toEqual(val);

            }).appendTo(jo).compile();

            jo.remove();

        });

    });

});

//describe('bingo.Event ======>', function () {

//    it('测试owner', function () {

//        //但值还是obj.v1和obj.v
//        expect(obj1.vv1()).toEqual(obj.v1());
//        expect(obj1.vv()).toEqual(obj.v());

//    });

//});//end bingo.Event

//if (console && console.time) {
//    setTimeout(function () {
//        //测试with性能
//        var withFn1 = function (data) {
//            with (data) {
//                return function () {
//                    a += 1;
//                    b += 1;
//                };
//            }
//        };
//        var data1 = { a: 1, b: 2 };
//        var fn1 = withFn1(data1);
//        var fn3 = function (data) {
//            with (data) { a += 1; b += 1; }
//        };
//        var fn4 = function (data) { data.a += 1; data.b += 1; };
//        var fn5 = (function (data) { return function () { data.a += 1; data.b += 1; }; })(data1);
//        var timeC = 100000;

//        data1 = { a: 1, b: 2 };
//        console.log('prop:');
//        console.time('11111');
//        for (var i = 0; i < timeC; i++) {
//            data1.a += 1;
//            data1.b += 1;
//        }
//        console.timeEnd('11111');

//        data1 = { a: 1, b: 2 };
//        console.log('prop try:');
//        console.time('11111try');
//        for (var i = 0; i < timeC; i++) {
//            try {
//                data1.a += 1;
//                data1.b += 1;
//            } catch (e) { }
//        }
//        console.timeEnd('11111try');

//        data1 = { a: 1, b: 2 };
//        console.log('fn:');
//        console.time('fffff');
//        for (var i = 0; i < timeC; i++) {
//            fn4(data1);
//        }
//        console.timeEnd('fffff');

//        data1 = { a: 1, b: 2 };
//        console.log('with fn:');
//        console.time('22222');
//        for (var i = 0; i < timeC; i++) {
//            fn1();
//        }
//        console.timeEnd('22222');


//        data1 = { a: 1, b: 2 };
//        console.log('with:');
//        console.time('333333');
//        for (var i = 0; i < timeC; i++) {
//            with (data1) { a += 1; b += 1; }
//        }
//        console.timeEnd('333333');

//        data1 = { a: 1, b: 2 };
//        console.log('with two:');
//        console.time('333333d');
//        for (var i = 0; i < timeC; i++) {
//            with (data1) { with ({ c: 1 }) { a += 1; b += 1; } }
//        }
//        console.timeEnd('333333d');



//        data1 = { a: 1, b: 2 };
//        console.log('fn with:');
//        console.time('44444');
//        for (var i = 0; i < timeC; i++) {
//            fn3(data1);
//        }
//        console.timeEnd('44444');

//        data1 = { a: 1, b: 2 };
//        console.log('fn fn:');
//        console.time('55555');
//        for (var i = 0; i < timeC; i++) {
//            fn5(data1);
//        }
//        console.timeEnd('55555');

//        //测试结果：每种以100000次循环测试
//        //在IE12, Chorme35, firefox37, Safari5.1.7
//        //不用with速度是最快的.
//        //使用with速度相差80倍左右, 但IE里几乎没有差别, 在with里面添加一个表达式时间也会相应添加
//        //如果真要使用with, 可以fn1方式, 但时间只优化小小, 没多少差
//        //添加多一层with时间要用的更多
//        //try..catch, 如果 没有catch语句, 速度没有什么变化, 但,如果包括catch语句, 在IE速度相差300倍左右, 其他浏览器没多大影响

//    }, 100);
//}
