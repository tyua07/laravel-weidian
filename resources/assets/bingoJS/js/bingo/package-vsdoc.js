/*
    //加载/js/c.js和/js/d.js
    bingo.using("/js/c.js", "d.js");//d.js会相对于c.js路径

    //加载完成处理
    bingo.using("/js/c.js", "d.js", function(){console.log('加载完成')});
    
    //加载完成处理优先级
    bingo.using("/js/c.js", "d.js", function(){console.log('加载完成')}, bingo.usingPriority.Normal);

    //使用map, 合并js时用, 以下是将, equals.js和JSON.js, 影射到equals1.js
    bingo.usingMap("%bingoextend%/equals1.js", ["%bingoextend%/equals.js", "%jsother%/JSON.js"]);
*/

(function (bingo) {
    //version 1.0.1

    bingo.extend({
        using: function (jsFiles, callback, priority) {
        	/// <summary>
            /// 引用JS <br />
            /// bingo.using("/js/c.js", "d.js"， function(){}, bingo.envPriority.Normal) <br />
            /// bingo.using(["/js/c.js", "d.js"]， function(){}, bingo.envPriority.Normal)
        	/// </summary>
        	/// <param name="jsFiles">文件， 可以多个。。。</param>
        	/// <param name="callback">加载完成后</param>
            /// <param name="priority">优先级</param>

            bingo.isFunction(callback) && callback();

            //if (arguments.length <= 0) return;
            //var item = null;
            //for (var i = 0, len = arguments.length; i < len; i++) {
            //    item = arguments[i];
            //    if (item) {
            //        if (bingo.isFunction(item)) {
            //            item(); return;
            //        }
            //    }
            //}
        },
        makeRegexMapPath: function (path) {
            /// <summary>
            /// 生成路径中包函?和*代换正规对象
            /// 注竟不要传入url qurey部分, 如: ?aaa=*&bbb=111
            /// </summary>
            /// <param name="path"></param>

            return new RegExp();
        },
        isRegexMapPath: function (path) {
            /// <summary>
            /// 是否可以生成路径代替符, 如果包函?和*字符
            /// 注竟不要传入url qurey部分, 如: ?aaa=*&bbb=111
            /// </summary>
            /// <param name="path"></param>
            return true;
        },
        usingMap: function (mapPath, path) {
            /// <signature>
            /// <summary>
        	/// 路径映射
        	/// </summary>
            /// <param name="mapPath">映射路径</param>
            /// <param name="paths">一组原路径..., ["a.js", "b.js"...]</param>
            /// </signature>
            /// <signature>
        },
        //using优先级
        usingPriority: {
            First: 0,
            NormalBefore: 45,
            Normal: 50,
            NormalAfter: 55,
            Last: 100
        },
        path: function (a) {
            /// <signature>
            /// <summary>
            /// 取得路径
            /// </summary>
            /// <param name="path" type="String">"%root%/aa.js"</param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 设置路径变量
            /// </summary>
            /// <param name="pathObject" type="Object">设置路径变量, {root:"/html/test", jspath:"%root%/js"}</param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 设置路径变量
            /// </summary>
            /// <param name="varname" type="String">root</param>
            /// <param name="path" type="String">/html/test, 或 %c%/aaa</param>
            /// </signature>
            return this.stringEmpty;
        }
    });



})(bingo);
