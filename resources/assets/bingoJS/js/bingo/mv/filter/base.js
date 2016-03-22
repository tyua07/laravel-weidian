
(function (bingo) {
    //version 1.1.0
    "use strict";

    ////支持注入$view与node
    //bingo.filter('eq', function ($view, node) {
    //    return function (value, para) {
    //        return value == para;
    //    };
    //});

    //等于, datas.n | eq:1
    bingo.filter('eq', function () {
        return function (value, para) {
            return value == para;
        };
    });

    //不等于, datas.n | neq:1
    bingo.filter('neq', function () {
        return function (value, para) {
            return value != para;
        };
    });

    //取反, datas.n | not:1
    bingo.filter('not', function () {
        return function (value, para) {
            return !value;
        };
    });

    //大于, datas.n | gt:1
    bingo.filter('gt', function () {
        return function (value, para) {
            return value > para;
        };
    });

    //大于等于, datas.n | gte:1
    bingo.filter('gte', function () {
        return function (value, para) {
            return value >= para;
        };
    });

    //小于, datas.n | lt:1
    bingo.filter('lt', function () {
        return function (value, para) {
            return value < para;
        };
    });

    //小于等于, datas.n | lte:1
    bingo.filter('lte', function () {
        return function (value, para) {
            return value <= para;
        };
    });

    //长度, datas.n | len:1
    bingo.filter('len', function () {
        return function (value, para) {
            return value ? bingo.isUndefined(value.length) ? 0 : value.length : 0;
        };
    });

    //将html转成文本, data.html | text
    bingo.filter('text', function () {
        return function (value, para) {
            return bingo.htmlEncode(value);
        };
    });

    //将文本转成html, data.text | html
    bingo.filter('html', function () {
        return function (value, para) {
            return bingo.htmlDecode(value);
        };
    });

    //输出新值, data.text | val:$data+ '1111'
    bingo.filter('val', function () {
        return function (value, para) {
            return para;
        };
    });

    //长度, data.text | len | eq:0
    bingo.filter('len', function () {
        return function (value, para) {
            return value && value.length ? value.length : 0
        };
    });

    //多元操作， data.status | sw:[0, 'active', ''] //true?'active':''
    bingo.filter('sw', function () {
        return function (value, para) {

            var len = para.length;
            var hasElse = (len % 2) == 1; //如果单数, 有else值
            var elseVal = hasElse ? para[len - 1] : '';
            hasElse && (len--);

            //sw:[1, '男', 2, '女', '保密'], '保密'为else值
            var r = null, ok = false, item;
            for (var i = 0; i < len; i += 2) {
                item = para[i];
                if (value == item) {
                    r = para[i + 1], ok = true;
                    break;
                }
            }
            return ok ? r : elseVal;
        };
    });

    //获取数组指定部分数据:[开始位置，数量], 数量为可选, data.list | take:[1, 3] | take:[1]
    bingo.filter('take', function () {
        return function (value, para) {
            return bingo.linq(value).take(para[0], para[1]);;
        };
    });


    //升序排序:'属性名称'，可选, data.list | asc:'n' | asc
    bingo.filter('asc', function () {
        return function (value, para) {
            var data = bingo.linq(value);
            if (!bingo.isNullEmpty(para))
                data.sortAsc(para);
            else
                data.sortAsc();
            return data.toArray();
        };
    });

    //降序排序:'属性名称'，可选, data.list | desc:'n' | desc
    bingo.filter('desc', function () {
        return function (value, para) {
            var data = bingo.linq(value);
            if (!bingo.isNullEmpty(para))
                data.sortDesc(para);
            else
                data.sortDesc();
            return data.toArray();
        };
    });

})(bingo);
