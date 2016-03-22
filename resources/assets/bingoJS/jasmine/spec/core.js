/// <reference path="../src/helper.js" />

describe('bingo.core - ' + helper.versionString, function () {

    var undefined;
    function fnTTTT() { };

    //beforeEach(function () {
    //    player = new Player();
    //    song = new Song();
    //});

    //it('try/catch/finally', function () {
    //    var count = 0;
    //    try {
    //        count++;
    //        ddd.aa
    //    } catch (e) {
    //        count++;
    //    } finally {
    //        count++;
    //    }
    //    expect(count).toEqual(3);

    //    count = 0;
    //    try {
    //        count++;
    //    } finally {
    //        count++;
    //    }
    //    expect(count).toEqual(2);


    //    var fn = function () {
    //        var count = 0;
    //        try {
    //            count++;
    //            return count;
    //        } finally {
    //        }
    //    };
    //    expect(fn()).toEqual(1);

    //});

    it('list prop', function () {
        var list = [1];
        list.aaa = '111';
        expect(list.aaa).toEqual('111');
        expect(list['aaa']).toEqual('111');
        expect(list[0]).toEqual(1);
        expect(list.length).toEqual(1);
    });

    it('list concat', function () {
        var list = [1];
        expect(list.concat(2)).toEqual([1, 2]);
        expect(list.concat([2,3])).toEqual([1, 2, 3]);
        expect(list.concat(null)).toEqual([1, null]);
        expect(list.concat(undefined)).toEqual([1, undefined]);

        expect(list).toEqual([1]);
    });

    it('bingo.isDebug = false', function () {
        expect(bingo.isDebug).toEqual(false);
    });

    it('bingo.prdtVersion = bingo.stringEmpty', function () {
        expect(bingo.prdtVersion).toEqual(bingo.stringEmpty);
    });

    describe('类型判断 ======>', function () {

        it('类型判断所要的方法是否正常', function () {
            expect(bingo.inArray(1, [0, 1, 2])).toEqual(1);
            expect(bingo['isUndefined']).toEqual(bingo.isUndefined);
        });

        //trueList:(true的数组), 如: [0,12](0或12为true)
        var testIsFn = function (fnName, trueList) {
            expect(bingo[fnName](null)).toEqual(testIsTrue(0, trueList));
            expect(bingo[fnName](false)).toEqual(testIsTrue(1, trueList));
            expect(bingo[fnName](1)).toEqual(testIsTrue(2, trueList));
            expect(bingo[fnName](1.11)).toEqual(testIsTrue(3, trueList));
            expect(bingo[fnName]('1')).toEqual(testIsTrue(4, trueList));
            expect(bingo[fnName]([1, 2])).toEqual(testIsTrue(5, trueList));
            expect(bingo[fnName]({ a: 1 })).toEqual(testIsTrue(6, trueList));
            expect(bingo[fnName](new Object())).toEqual(testIsTrue(7, trueList));
            expect(bingo[fnName](bingo.linq())).toEqual(testIsTrue(8, trueList));
            expect(bingo[fnName](/a/gi)).toEqual(testIsTrue(9, trueList));
            expect(bingo[fnName](new RegExp())).toEqual(testIsTrue(10, trueList));
            expect(bingo[fnName](document.documentElement)).toEqual(testIsTrue(11, trueList));
            expect(bingo[fnName](document)).toEqual(testIsTrue(12, trueList));
            expect(bingo[fnName](window)).toEqual(testIsTrue(13, trueList));
            expect(bingo[fnName](undefined)).toEqual(testIsTrue(14, trueList));
            expect(bingo[fnName](new String('1'))).toEqual(testIsTrue(15, trueList));
            expect(bingo[fnName]('')).toEqual(testIsTrue(16, trueList));
            expect(bingo[fnName](function () { })).toEqual(testIsTrue(17, trueList));
            expect(bingo[fnName](new Function('var a = 1;'))).toEqual(testIsTrue(18, trueList));
            expect(bingo[fnName](fnTTTT)).toEqual(testIsTrue(19, trueList));
            expect(bingo[fnName](new Array())).toEqual(testIsTrue(20, trueList));

            var cls = function () { };
            cls.prototype.a = 1;
            expect(bingo[fnName](new cls())).toEqual(testIsTrue(21, trueList));

        }, testIsTrue = function (index, trueList) { return bingo.inArray(index, trueList) >= 0 };
        
        

        it('bingo.isUndefined', function () {
            testIsFn('isUndefined', [14]);
        });

        it('bingo.isNull', function () {
            testIsFn('isNull', [0, 14]);
        });

        it('bingo.isBoolean', function () {
            testIsFn('isBoolean', [1]);
        });

        it('bingo.isNullEmpty', function () {
            testIsFn('isNullEmpty', [0, 14, 16]);
        });

        it('bingo.isFunction', function () {
            testIsFn('isFunction', [17, 18, 19]);
        });

        it('bingo.isNumeric', function () {
            testIsFn('isNumeric', [2, 3, 4, 15]);
        });

        it('bingo.isString', function () {
            testIsFn('isString', [4, 15, 16]);
        });

        it('bingo.isObject', function () {
            testIsFn('isObject', [6, 7, 8, 21]);
            //testIsFn('isObject', [6, 7, 8, 11, 12, 13]);
        });

        it('bingo.isPlainObject', function () {
            testIsFn('isPlainObject', [6, 7]);
        });

        it('bingo.isArray', function () {
            testIsFn('isArray', [5, 20]);
        });

        it('bingo.isWindow', function () {
            testIsFn('isWindow', [13]);
        });

        it('bingo.isElement', function () {
            testIsFn('isElement', [11,12]);
        });

    });

    describe('常用方法 ======>', function () {

        //去前后空白
        it('bingo.trim', function () {
            expect(bingo.trim(' a   ')).toEqual('a');
            expect(bingo.trim(' a b ')).toEqual('a b');
            expect(bingo.trim(' a b')).toEqual('a b');
            expect(bingo.trim('a b ')).toEqual('a b');
            expect(bingo.trim(' a b　')).toEqual('a b');//全角空白
            expect(bingo.trim(undefined)).toEqual('');
            expect(bingo.trim(null)).toEqual('');
            expect(bingo.trim(1)).toEqual('1');
        });


        it('bingo.isStringEquals', function () {
            expect(bingo.isStringEquals(' a ', ' A ')).toEqual(true);
            expect(bingo.isStringEquals(' aaa ', ' AAA ')).toEqual(true);
            expect(bingo.isStringEquals('测试', '测试')).toEqual(true);
        });

        it('bingo.replaceAll', function () {
            expect(bingo.replaceAll(' \\ ', ' \\ ', '')).toEqual('');
            expect(bingo.replaceAll(' aaa ', ' AAA ', '')).toEqual(' aaa ');
            expect(bingo.replaceAll('Aa', 'a', '')).toEqual('A');
            expect(bingo.replaceAll('Aa', 'a', '', 'i')).toEqual('a');
            expect(bingo.replaceAll('Aa', 'a', '', 'gi')).toEqual('');
            expect(bingo.replaceAll('你是AABB/?\\ddi是', '你是AABB/?\\ddi是', '', 'gi')).toEqual('');
        });

        it('bingo.toStr', function () {
            expect(bingo.toStr(null)).toEqual('');
            expect(bingo.toStr(undefined)).toEqual('');
            expect(bingo.toStr('')).toEqual('');
            expect(bingo.toStr(1)).toEqual('1');
            expect(bingo.toStr(1.11)).toEqual('1.11');
            expect(bingo.toStr(false)).toEqual('false');

            expect(bingo.toStr({})).not.toEqual('');
            expect(bingo.toStr([1])).not.toEqual('');
            expect(bingo.toStr(/i/g)).not.toEqual('');
            expect(bingo.toStr(window)).not.toEqual('');
            expect(bingo.toStr(document)).not.toEqual('');

        });

        it('bingo.inArray', function () {
            var list = [0, 0, 1, 2, 3];
            expect(bingo.inArray(4, list)).toEqual(-1);
            expect(bingo.inArray(0, list)).toEqual(0);
            expect(bingo.inArray(1, list)).toEqual(2);
            expect(bingo.inArray(0, list, 1)).toEqual(1);

            //第三个参数就开始位置, 第四参数为是否从后面开始查找
            expect(bingo.inArray(0, list, 0, true)).toEqual(1);
            expect(bingo.inArray(0, list, -1, true)).toEqual(-1);

            //溢出测试
            expect(bingo.inArray(0, list, 1000, true)).toEqual(-1);
            expect(bingo.inArray(0, list, -10000)).toEqual(0);

            var objList = [{ a: 1 }, { a: 2 }];
            expect(bingo.inArray(objList[0], objList)).toEqual(0);
            expect(bingo.inArray({ a: 1 }, objList)).not.toEqual(0);//只是引用比较

            var arrayList = [[1,2], [3,4,5]];
            expect(bingo.inArray(arrayList[0], arrayList)).toEqual(0);
            expect(bingo.inArray([1, 2], arrayList)).not.toEqual(0);//只是引用比较

        });

        it('bingo.removeArrayItem', function () {
            var list = [0, 0, 1, 2, 3];
            expect(bingo.removeArrayItem(0, list)).toEqual([1, 2, 3]);//删除所有0
            expect(bingo.removeArrayItem(1, list)).toEqual([0, 0, 2, 3]);

            var objList = [{ a: 1 }, { a: 2 }];
            expect(bingo.removeArrayItem(objList[0], objList)).toEqual([{ a: 2 }]);
            expect(bingo.removeArrayItem({ a: 1 }, objList)).not.toEqual([{ a: 2 }]);//只是引用比较
        });

        it('bingo.sliceArray', function () {
            var list = [0, 0, 1, 2, 3];
            expect(bingo.sliceArray(list, 0)).toEqual([0, 0, 1, 2, 3]);
            expect(bingo.sliceArray(list, 0, 2)).toEqual([0, 0]);
            expect(bingo.sliceArray(list, 1, 2)).toEqual([0, 1]);
            expect(bingo.sliceArray(list, -1)).toEqual([3]);//pos为负数时从后面算起

            //溢出测试
            expect(bingo.sliceArray(list, 0, 100)).toEqual([0, 0, 1, 2, 3]);
            expect(bingo.sliceArray(list, 100)).toEqual([]);
            expect(bingo.sliceArray(list, -100, 2)).toEqual([0, 0])

        });

        it('bingo.makeAutoId', function () {
            var list = [];
            for (var i = 0; i < 100; i++) {
                list.push(bingo.makeAutoId());
            }
            expect(bingo.inArray(bingo.makeAutoId(), list)).toEqual(-1);
        });

        it('bingo.each', function () {
            var list = [{ a: 1 }, { a: 2 }, { a: 3 }];
            bingo.each(list, function () {
                this.a++;
            });
            expect(list).toEqual([{ a: 2 }, { a: 3 }, { a: 4 }]);

            list = [{ a: 1 }, { a: 2 }, { a: 3 }];
            bingo.each(list, function () {
                this.a++;
            }, 1);
            expect(list).toEqual([{ a: 1 }, { a: 3 }, { a: 4}]);

            list = [{ a: 1 }, { a: 2 }, { a: 3 }];
            bingo.each(list, function () {
                this.a++;
            }, 1, true);
            expect(list).toEqual([{ a: 1 }, { a: 3 }, { a: 4 }]);

            list = [{ a: 1 }, { a: 2 }, { a: 3 }];
            bingo.each(list, function () {
                this.a++;
            }, 100);
            expect(list).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);

            list = [{ a: 1 }, { a: 2 }, { a: 3 }];
            bingo.each(list, function () {
                this.a++;
            }, -100);
            expect(list).toEqual([{ a: 2 }, { a: 3 }, { a: 4 }]);
        });

        it('bingo.eachProp', function () {

            var obj = { a: 1, b: 2 };

            var prop = [];
            bingo.eachProp(obj, function (item, n) {
                prop.push(n);
            });
            expect(prop.length).toEqual(2);
            expect(bingo.inArray('a', prop) >= 0 && bingo.inArray('b', prop) >= 0).toEqual(true);

            var cls = function () { this.a = 1; };
            cls.prototype.b = 2;
            obj = new cls();
            prop = [];
            bingo.eachProp(obj, function (item, n) {
                prop.push(n);
            });
            expect(prop.length).toEqual(1);
            expect(bingo.inArray('a', prop) >= 0 && bingo.inArray('b', prop) < 0).toEqual(true);
            
        });

        it('bingo.clearObject', function () {
            //clearObject不清除原形属性

            var obj = { a: 1, b: 2 };
            bingo.clearObject(obj)
            expect(obj).toEqual({ a: null, b: null });

            var cls = function () { this.a = 1; };
            cls.prototype.b = 2;
            var obj1 = new cls();
            bingo.clearObject(obj1)
            expect(obj1.a).toEqual(null);
            //clearObject不清除原形属性b
            expect(obj1.b).toEqual(2);
            expect(obj1).not.toEqual({ a: null, b: null });

        });

        it('bingo.clone', function () {
            //只复制planeObject, 数组和基础JS类型, RegEx不复制

            var obj = { a: 1, b: 2, c: { nn: 11, mm: 22 }, list: [1, 2] };
            var obj1 = bingo.clone(obj);
            expect(obj).toEqual(obj1);
            expect(obj != obj1).toEqual(true);
            expect(obj.c != obj1.c).toEqual(true);
            expect(obj.list != obj1.list).toEqual(true);

            //不复制以下内容, 直接返回
            expect(bingo.clone(window) === window).toEqual(true);
            expect(bingo.clone(document) === document).toEqual(true);
            expect(bingo.clone(document.documentElement) === document.documentElement).toEqual(true);

            var re = new RegExp();
            expect(bingo.clone(re) === re).toEqual(true);

            var cls = function () { };
            cls.prototype.a = cls;
            var o = new cls();
            expect(bingo.clone(o) === o).toEqual(true);

        });

        it('bingo.proxy', function () {
            var obj = { a: 1, b: 2, c: { nn: 11, mm: 22 }, list: [1, 2] };

            var count = 0;
            var fn = bingo.proxy(obj, function () {
                expect(obj === this).toEqual(true);
                count++;
            });

            fn();
            fn.call(window);
            expect(count).toEqual(2);
        });

        it('bingo.extend', function () {
            //只有一个参数, 扩展到bingo
            bingo.extend({__a:222});
            expect(bingo.__a === 222).toEqual(true);


            var obj = { a: 1, b: 2 };

            //2个参数以上, 扩展到第一个参数, 并返回第一个参数
            var obj1 = bingo.extend(obj, { __a: 1 });
            expect(bingo.__a !== 1 && obj.__a === 1).toEqual(true);
            expect(obj1).toEqual({ a: 1, b: 2, __a: 1 });

            bingo.extend(obj, { __a: 1 }, { __b: 2 });
            expect(bingo.__a !== 1 && obj.__a === 1 && obj.__b === 2).toEqual(true);

        });

        it('bingo.datavalue', function () {
            var obj = {};
            expect(bingo.datavalue(obj, 'a.aa')).toEqual(undefined);

            //obj
            obj = {};
            bingo.datavalue(obj, 'a.aa', 1);
            expect(bingo.datavalue(obj, 'a.aa')).toEqual(1);
            expect(obj).toEqual({ a: { aa: 1 } });
            bingo.datavalue(obj, 'a.o["d"]', 2);
            expect(bingo.datavalue(obj, 'a.o["d"]')).toEqual(2);
            expect(obj).toEqual({ a: { aa: 1, o: { d: 2 } } });

            //数组
            obj = {};
            bingo.datavalue(obj, 'a.bb[0]', 2);
            expect(bingo.datavalue(obj, 'a.bb[0]')).toEqual(2);
            bingo.datavalue(obj, 'a.cc[1]', 3);
            expect(bingo.datavalue(obj, 'a.cc[0]')).toEqual(undefined);
            expect(bingo.datavalue(obj, 'a.cc[1]')).toEqual(3);
            expect(obj).toEqual({ a: { bb: [2], cc: [undefined, 3] } });

        });

        it('bingo.equals', function () {
            var t = new Date();
            var obj = {
                nul: null, und: undefined, n: 1, nn: 1.01, z: 0,
                s: 'a', ss: new String('b'), se: '',
                b: true,
                reg: /i/g, regx: new RegExp('iii', 'gi'),
                d:t
            };
            var obj1 = {
                nul: null, und: undefined, n: 1, nn: 1.01, z: 0,
                s: 'a', ss: new String('b'), se: '',
                b: true,
                reg: /i/g, regx: new RegExp('iii', 'gi'),
                d: t
            };

            expect(bingo.equals(obj, obj1)).toEqual(true);

            obj.nul = 1;
            expect(bingo.equals(obj, obj1)).toEqual(false);

            obj.nul = obj1.nul;
            expect(bingo.equals(obj, obj1)).toEqual(true);
            obj.und = 1;
            expect(bingo.equals(obj, obj1)).toEqual(false);


            obj.und = obj1.und;
            expect(bingo.equals(obj, obj1)).toEqual(true);
            obj.reg = /sdfs/g;
            expect(bingo.equals(obj, obj1)).toEqual(false);
        });


    });

    describe('bingo.cache ======>', function () {

        it('bingo.cacheToObject', function () {

            var count = 0;
            var obj = {
                getVal: function () {
                    this.tt_c = bingo.cacheToObject(this)
                        .key('win', 'box').context(function () {
                            count++;
                            return 'aaaaa';
                        });
                    return this.tt_c.get();
                }
            };

            //连续调用两次getVal
            expect(obj.getVal()).toEqual('aaaaa');
            expect(obj.getVal()).toEqual('aaaaa');
            //count只会被执行一次， 原因已经缓存了。
            expect(count).toEqual(1);

            
            //key多个参数会被组装
            expect(obj.tt_c.key()).toEqual('win_box');

            //多次没调用， 缓存管理对象，还是一个
            var temp = obj.tt_c
            obj.getVal();
            expect(obj.tt_c === temp).toEqual(true);

            bingo.cacheToObject(obj).key('aaaa').set('111');
            expect(bingo.cacheToObject(obj).key('aaaa').get()).toEqual("111");

        });

        it('bingo.cacheToObject数量', function () {

            var obj = {};
            //初始, 最大缓存数为2
            bingo.cacheToObject(obj).max(2);

            var test = function () {
                //缓存7个key, 即7条缓存记录
                for (var i = 0; i < 7; i++) {
                    bingo.cacheToObject(obj).key(i).context(function () { return i; }).get();
                }

                //7条缓存记录, 原因是每5条才删除一次，所以缓存数是max + 5 = 7
                expect(bingo.cacheToObject(obj)._datas.length).toEqual(7);
                var datas = bingo.linq(bingo.cacheToObject(obj)._datas)
                    .select(function () { return this.value; }).toArray();
                expect(datas).toEqual([0, 1, 2, 3, 4, 5, 6]);

                waits(10);

                runs(function () {
                    //访问已经有记录
                    bingo.cacheToObject(obj).key(0).get();
                    expect(bingo.cacheToObject(obj)._datas.length).toEqual(7);
                    var datas = bingo.linq(bingo.cacheToObject(obj)._datas)
                        .select(function () { return this.value; }).toArray();
                    expect(datas).toEqual([0, 1, 2, 3, 4, 5, 6]);

                    //再添加一条缓存
                    bingo.cacheToObject(obj).key(7).context(function () { return 7; }).get();
                    //这时删除5条缓存， 再加一个新记录 2+1 = 3;
                    expect(bingo.cacheToObject(obj)._datas.length).toEqual(3);
                    var datas = bingo.linq(bingo.cacheToObject(obj)._datas)
                        .select(function () { return this.value; }).toArray();
                    //只剩最新三条， 前面最后访问了0记录
                    expect(datas).toEqual([6, 0, 7]);

                    //删除key 6
                    bingo.cacheToObject(obj).key(6).clear();
                    var datas = bingo.linq(bingo.cacheToObject(obj)._datas)
                        .select(function () { return this.value; }).toArray();
                    expect(datas).toEqual([0, 7]);

                    //clearAll
                    bingo.cacheToObject(obj).clearAll();
                    var datas = bingo.linq(bingo.cacheToObject(obj)._datas)
                        .select(function () { return this.value; }).toArray();
                    expect(datas).toEqual([]);
                });

            };

            test();

        });

    });

    
    describe('bingo.variable ======>', function () {

        it('bingo.variable', function () {

            var v = bingo.variable();
            expect(v()).toEqual(undefined);
            expect(bingo.isVariable(v)).toEqual(true);

            v = bingo.variable(1);
            expect(v()).toEqual(1);
            expect(bingo.variableOf(v)).toEqual(1);
            expect(bingo.variableOf(22)).toEqual(22);


        });

        it('测试$get/$set', function () {

            var v;
           
            v = bingo.variable().$get(function () {
                //this.owner与this.$owner不同
                //this.owner代表variable当前所在对象
                //this.$owner代表链写时对象
                console.log(this.owner);
                return 2
            });
            expect(v()).toEqual(2);
            expect(bingo.variableOf(v)).toEqual(2);

            //测试$get   And  this.value
            v = bingo.variable().$set(function (value) { this.value = value; });
            v(333)
            expect(v()).toEqual(333);

        });


        it('测试$subs/$assign', function () {

            var v;
            //测试+100
            v = bingo.variable().$set(function (value) {
                this.value = value + 100;
            });
            v(333)
            expect(v()).toEqual(433);
            var subCount = 0, assignCount = 0;
            v.$subs(function (value) {
                expect(value).toEqual(101);
                expect(v()).toEqual(101);
                subCount++;
            }).$assign(function (value) {
                expect(value).toEqual(101);
                expect(v()).toEqual(101);
                assignCount++;
            });
            v(1);
            v(1);
            expect(subCount).toEqual(1);
            expect(assignCount).toEqual(2);

            //强制设置值改变
            v.$setChange();
            expect(subCount).toEqual(2);
            expect(assignCount).toEqual(3);

            var count = 0;
            var fn = function () { count++; };
            var fn1 = function () { count++; };
            var vff = bingo.variable();
            vff.$assign(fn).$assign(fn1);
            vff.$setChange();
            expect(count).toEqual(2);
            vff.$off(fn);
            vff.$setChange();
            expect(count).toEqual(3);
            vff.$off();
            vff.$setChange();
            expect(count).toEqual(3);

        });

        it('测试clone', function () {

            var v;

            //测试clone
            v = bingo.variable().$set(function (value) { this.value = value + 100; });
            var v1 = v.clone();
            v1(1)
            expect(v1()).toEqual(101);

            //测试clone
            subCount = assignCount = 0;
            v = bingo.variable()
                .$get(function (value) { 2; })
                //不clone $assign/$subs
                .$assign(function () { assignCount++; })
                .$subs(function () { subCount++; });
            var v1 = v.clone();
            v1(1)
            //clone, 只复制$get, $set, $owner, $view
            //不复制$assign, $subs
            expect(subCount).toEqual(0);
            expect(assignCount).toEqual(0);

        });

        it('测试owner', function () {
            //owner为连写时的返回的对象, 方便连写
            //owner为连写时的引用对象, 如obj.v(111).v1(222)
            //如果没owner, 连写时引用对象为相应obj

            var obj = {};
            obj.v = bingo.variable(1, obj);//owner为obj
            obj.v1 = bingo.variable(2);//没有owner

            obj.v(111).v1(222).v(12);
            expect(obj.v()).toEqual(12);
            expect(obj.v1()).toEqual(222);

            var obj1 = {
                vv: obj.v,//v有owner
                vv1: obj.v1//v1无owner
            };

            //vv有owner, 所只能连写到obj
            obj1.vv(11).v1(111);

            //vv1无owner, 所以可以连写obj1
            //无owner时, 会自动所属obj为owner
            obj1.vv1(222).vv(111);
            expect(obj1.vv1()).toEqual(222);
            expect(obj1.vv()).toEqual(111);

            //但值还是obj.v1和obj.v
            expect(obj1.vv1()).toEqual(obj.v1());
            expect(obj1.vv()).toEqual(obj.v());

            obj.v.$owner(obj1);//设置owner为obj1
            obj.v(111).vv();//连写是只能obj1.vv

        });

    });//end bingo.variable


    describe('bingo.Event ======>', function () {

        it('on/off', function () {

            var ev = bingo.Event();

            var evCount = 0;//事件被触发次数
            //添加事件, 并接收参数a, b
            ev.on(function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            }).on(function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            });
            expect(ev.size()).toEqual(2);//事件绑定数量为1
            ev.trigger([1, 2]);//触发事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数为2

            ev.trigger([1, 2]);//再次触发事件, 并传送参数1, 2
            expect(evCount).toEqual(4);//被触发次数为4

            ev.off();//删除所有事件
            expect(ev.size()).toEqual(0);//事件绑定数量为0
            ev.trigger([1, 2]);//触发事件, 并传送参数1, 2
            expect(evCount).toEqual(4);//被触发次数还是为4


            evCount = 0;//事件被触发次数
            var evCount1 = 0;
            var f1 = function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            };
            var f2 = function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount1++;
            };
            //添加事件, 并接收参数a, b
            ev.on(f1).on(f1).on(f2);
            expect(ev.size()).toEqual(3);//事件绑定数量为3
            ev.trigger([1, 2]);//触发事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数为2
            expect(evCount1).toEqual(1);//被触发次数为1

            ev.off(f1);//删除所有f1事件
            expect(ev.size()).toEqual(1);//事件绑定数量为1
            ev.trigger([1, 2]);//触发事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数还是为2
            expect(evCount1).toEqual(2);//被触发次数为2

        });

        it('one', function () {
            //one绑定事件只会被触发一次

            var ev = bingo.Event();

            var evCount = 0;//事件被触发次数
            //添加事件, 并接收参数a, b
            ev.one(function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            });
            ev.one(function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            });
            expect(ev.size()).toEqual(2);//事件绑定数量为2
            ev.trigger([1, 2]);//触发事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数为1

            expect(ev.size()).toEqual(0);//事件绑定数量为0
            ev.trigger([1, 2]);//再次触发事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数还是为2

        });

        it('end', function () {
            //one绑定事件只会被触发一次

            var ev = bingo.Event();

            var evCount = 0;//事件被触发次数
            //添加事件, 并接收参数a, b
            ev.one(function (a, b) {
                expect(a == 1 && b == 2).toEqual(true);
                evCount++;
            }).on(function () {
                evCount++;
            });
            expect(ev.size()).toEqual(2);//事件绑定数量为2
            ev.end([1, 2]);//结束事件, 并传送参数1, 2
            expect(evCount).toEqual(2);//被触发次数为2
            expect(ev.size()).toEqual(0);//事件绑定数量为0


            var endOk = false;
            //事件已经结束, 再绑定会自动被触发
            //传入参数还是会保留
            ev.on(function (a, b) {
                evCount++;
                expect(a == 1 && b == 2).toEqual(true);
                endOk = true;
            });
            expect(evCount).toEqual(2);//被触发次数还是为2, 需然自动触发,但会延迟触发
            expect(ev.size()).toEqual(0);//事件绑定数量为0

            waitsFor(function () {
                return endOk;
            }, "wait endOk", 10000);

            runs(function () {
                expect(evCount).toEqual(3);//被触发次数为3
            });
        });

        it('测试owner', function () {
            //事件owner, 是代表事件的上下文

            var obj = {};
            //ev1, 没有owner
            obj.ev1 = bingo.Event();
            //ev2, 设置了owner为obj
            obj.ev2 = bingo.Event(obj);

            var count = 0;
            //以下, 测试事件中this上下文象
            obj.ev1.on(function () {
                //如果没有owner, this引用event本身
                expect(this === obj).toEqual(false);
                expect(this === obj.ev1).toEqual(true);
                count++;
            });
            obj.ev2.on(function () {
                //如果设置了owner, this引用owner
                expect(this === obj).toEqual(true);
                expect(this === obj.ev2).toEqual(false);
                count++;
            });
            obj.ev1.trigger();
            obj.ev2.trigger();
            expect(count).toEqual(2);

            var obj1 = {};
            obj1.ev = bingo.Event(obj);//注意, 这里设置了owner为obj
            count = 0;
            obj1.ev.on(function () {
                //因为owner为obj, 不是obj1
                expect(this === obj).toEqual(true);
                expect(this === obj1).toEqual(false);
                count++;
            });

            obj1.ev.trigger();
            expect(count).toEqual(1);

        });

        it('测试clone', function () {
            //事件owner, 是代表事件的上下文

            var obj = {}, obj1 = {};
            obj.ev = bingo.Event(obj);

            var count = 0;
            obj.ev.on(function () {
                expect(this === obj).toEqual(true);
                count++;
            });
            obj.ev.trigger();
            expect(count).toEqual(1);

            //obj1.ev 从obj.ev 复制过来, 但ev的和owner还是obj, 也复制过来了.
            obj1.ev = obj.ev.clone();
            obj1.ev.trigger();
            expect(count).toEqual(2);

            count = 0;
            obj.ev1 = bingo.Event(obj);//设置owner为obj
            obj.ev1.on(function () {
                //测试owner为obj1
                expect(this === obj1).toEqual(true);
                count++;
            });
            //复制时, 重新设置owner为obj1
            obj1.ev1 = obj.ev1.clone(obj1);
            obj1.ev1.trigger();
            expect(count).toEqual(1);

        });

    });//end bingo.Event

    it('bingo.path', function () {
        //定义path变量aaa
        bingo.path('aaa', '/aaa');
        //使用aaa
        expect(bingo.path('%aaa%')).toEqual("/aaa");
        expect(bingo.path('%aaa%%aaa%')).toEqual("/aaa/aaa");
        expect(bingo.path('%aaa%/t.txt')).toEqual("/aaa/t.txt");

        //定义方法2, 定义bb和cc
        bingo.path({ bb: '%aaa%/b', cc: '%bb%/c' });
        expect(bingo.path('%bb%/d.txt')).toEqual("/aaa/b/d.txt");
        expect(bingo.path('%cc%/d.txt')).toEqual("/aaa/b/c/d.txt");

        //测试query, uqery部分不处理
        expect(bingo.path('%aaa%/t.txt?aaa=%aaa%/asdf')).toEqual("/aaa/t.txt?aaa=%aaa%/asdf");

        //测试没定义
        expect(bingo.path('%nooot%')).toEqual("");

    });

    describe('bingo.using ======>', function () {

        it('bingo.using', function () {

            window.testusingCount = 0;
            var isOk = false;
            //加载a
            bingo.using('src/test/a.js', function () {
                //再次加载a与b
                bingo.using('src/test/a.js', 'src/test/b.js', function () {
                    isOk = true;
                });
            });

            waitsFor(function () { return isOk; }, 'wait using', 10000);
            runs(function () {
                //多次加载 testusingCount还是2
                expect(testusingCount).toEqual(2);
            });

        });
        
        it('bingo.usingMap', function () {

            window.testusingMapCount = 0;
            var isOk = false;

            bingo.path('src1', 'src');

            //将下面js合并为mapCD.js, 支持？和*符号
            //注竟qurey部分不支持?*查询， 即要完全相等, 如: ?aaa=*&bbb=111
            bingo.usingMap('%src1%/test/mapCD.js',
                ['src/test/c.js', 'src/test/d?.js', '%src1%/test/f*.js']);


            //还是加载c.js和d.js, 但其实是加载mapCD.js
            bingo.using('%src1%/test/c.js',
                'src/test/d.js', 'src/test/dd.js', 'src/test/de.js',
                'src/test/f.js', 'src/test/fF.js', 'src/test/fddsdf.js', function () {
                isOk = true;
            });

            waitsFor(function () { return isOk; }, 'wait using', 100000);
            runs(function () {
                expect(testusingMapCount).toEqual(1);
            });

            expect(bingo.isRegexMapPath('src/test/d?.js')).toEqual(true);
            expect(bingo.isRegexMapPath('src/test/f*.js')).toEqual(true);
            expect(bingo.isRegexMapPath('src/test/d.js')).toEqual(false);

            expect(bingo.makeRegexMapPath('src/test/d?.js').test('src/test/d.js')).toEqual(true);
            expect(bingo.makeRegexMapPath('src/*\\d?.js').test('src/test\\dd.js')).toEqual(true);
            expect(bingo.makeRegexMapPath('src/test/d?.js').test('src/test/de.js')).toEqual(true);
            expect(bingo.makeRegexMapPath('src/test/f*.js').test('src/test/f.js')).toEqual(true);
            //注竟qurey部分不支持?*查询， 即要完全相等, 如: ?aaa=*&bbb=111
            expect(bingo.makeRegexMapPath('src/test/f*.js?sdfsdf=dd').test('src/test/fddsdf.js?sdfsdf=dd')).toEqual(true);

        });

    });//end bingo.using

    describe('bingo.route ======>', function () {

        it('bingo.route', function () {

            //定义route
            bingo.route('my', {
                url: 'my/{module}/{action}/{id}',
                toUrl: 'src/test/{module}_{action}.js',
                defaultValue: {module:'sys', action:'user', id:''}
            });

            bingo.route('myTest', {
                //支持?和*
                url: 'myTest*/{module}/{action}/{id}',
                toUrl: 'src/test/{module}_{action}_test.js',
                defaultValue: { module: 'sys', action: 'user', id: '' }
            });

            var routeUrl = 'my/sys/user/1';

            //module, controller, action为框架所需参数, 其它参数会生成query, 如id=1
            expect(bingo.route(routeUrl)).toEqual('src/test/sys_user.js?id=1');

            //bingo.routeContext, 解释成具体内容
            var rCtext = bingo.routeContext(routeUrl);
            expect(rCtext).toEqual({
                name: 'my', params: { module: 'sys', action: 'user', id: '1', queryParams: {} },
                url: 'my/sys/user/1', toUrl: 'src/test/sys_user.js?id=1',
                actionContext: rCtext.actionContext
            });

            //bingo.routeLink, 生成route url
            expect(bingo.routeLink('my', { module: 'sys', action: 'user', id: '1' })).toEqual(routeUrl);

            //以下测试using一个route url
            window.testusingRoute = 0;
            var isOk = false;
            bingo.using(routeUrl, function () {
                    isOk = true;
                });
            waitsFor(function () { return isOk; }, 'wait using route url', 100000);
            runs(function () {
                expect(testusingRoute).toEqual(1);
            });

            //测试myTest
            expect(bingo.route('myTest/sys/user/1')).toEqual('src/test/sys_user_test.js?id=1');
            expect(bingo.route('myTest111/sys/user/1')).toEqual('src/test/sys_user_test.js?id=1');


            var context1 = bingo.routeContext('view/demo/user/list$aa:1?bb=22&c=333');
            expect(context1.params.aa).toEqual('1');
            expect(context1.params.bb).toEqual('22');
            expect(context1.params.c).toEqual('333');

        });

    });//end bingo.route

    describe('bingo.Class ======>', function () {

        it('bingo.Class', function () {

            //定义aCls
            var aCls = bingo.Class(function () {

                this.Prop({
                    vv: 1,
                    vt: {
                        value: 222,
                        $get: function () { console.log(this.owner); return this.value; },
                        $set: function (value) { this.value = value; }
                    },
                    vb:2
                });

                this.Define({
                    _a: 1,
                    _dddA:3,
                    datas: { a: 1, b: 1 },
                    fn: function () {
                        this._a = 1;
                    }
                });

                this.Initialization(function (p) {
                    this._a = 22 + p;
                });

            });

            //定义bCls, 继承aCls
            var bCls = bingo.Class(aCls, function () {

                this.Prop({
                    vb:333
                });

                this.Define({
                    //bbbb
                    _b: 1,
                    //dddd
                    dataB: { bbb: 1 },
                    //testt
                    fnB: function () {
                    },
                    fn: function () {
                        this._b++;
                    }
                });

                this.Initialization(function (p) {
                    //基类初始
                    this.base(p);
                    this._bb = 22 + p;
                });

            });


            //定义cCls, 继承bCls
            var cCls = bingo.Class(bCls, function () {
                this.Define({
                    _c: 1,
                    dataC: { cccc: 1 },
                    fnC: function () {
                    }
                });

            });

            var a = aCls.NewObject(1),
                b = bCls.NewObject(2),
                c = cCls.NewObject(3);

            //测试a原型链
            expect(a instanceof Object).toEqual(true);
            expect(a instanceof bingo.Class.Base).toEqual(true);
            expect(a instanceof bCls).toEqual(false);

            //测试b原型链
            expect(b instanceof Object).toEqual(true);
            expect(b instanceof bingo.Class.Base).toEqual(true);
            expect(b instanceof aCls).toEqual(true);

            //测试c原型链
            expect(c instanceof Object).toEqual(true);
            expect(c instanceof bingo.Class.Base).toEqual(true);
            expect(c instanceof aCls).toEqual(true);
            expect(c instanceof bCls).toEqual(true);

            //测试a内容正确性
            expect(a._a).toEqual(23);
            expect(a.datas).toEqual({ a: 1, b: 1 });
            expect(bingo.isFunction(a.fn)).toEqual(true);
            expect(a.vv()).toEqual(1);
            expect(a.vt()).toEqual(222);

            expect(bingo.isUndefined(a._b)).toEqual(true);
            expect(bingo.isUndefined(a.dataB)).toEqual(true);
            expect(bingo.isUndefined(a.fnB)).toEqual(true);

            //测试b内容正确性
            expect(b._a).toEqual(24);
            expect(b._bb).toEqual(24);
            expect(b._b).toEqual(1);
            expect(b.datas).toEqual({ a: 1, b: 1 });
            expect(b.dataB).toEqual({ bbb: 1 });
            expect(bingo.isFunction(b.fn)).toEqual(true);
            expect(bingo.isFunction(b.fnB)).toEqual(true);
            expect(b.vv(2).vv()).toEqual(2);
            expect(b.vt(123).vt()).toEqual(123);

            //测试c内容正确性
            expect(c._a).toEqual(25);
            expect(c._bb).toEqual(25);
            expect(c._b).toEqual(1);
            expect(c._c).toEqual(1);
            expect(c.datas).toEqual({ a: 1, b: 1 });
            expect(c.dataB).toEqual({ bbb: 1 });
            expect(c.dataC).toEqual({ cccc: 1 });
            expect(bingo.isFunction(c.fn)).toEqual(true);
            expect(bingo.isFunction(c.fnB)).toEqual(true);
            expect(bingo.isFunction(c.fnC)).toEqual(true);
            expect(c.vv()).toEqual(1);
            expect(c.vt()).toEqual(222);

            //测试分离情况
            expect(a.datas).toEqual(b.datas);
            a.datas.a = bingo.makeAutoId();
            expect(a.datas).not.toEqual(b.datas);

            //测试复盖情况
            b.fn();//复盖a.fn
            expect(b._b).toEqual(2);
            expect(b.vb()).toEqual(333);

            //测试dispose
            var count = 0;
            a.onDispose(function () { count++; });
            a.dispose();
            a.dispose();
            //多次dispose, 但count只有一次
            expect(count).toEqual(1);
            //非原型部分会被设置为null
            expect(a._a == null).toEqual(true);
            expect(a.datas == null).toEqual(true);
            //原型部分不会处理
            expect(a._dddA != null).toEqual(true);
            expect(a.fn != null).toEqual(true);


        });


    });//end bingo.Class

    describe('bingo.linq ======>', function () {

        it('concat', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 2 }];

            //合并两种参数
            var l = bingo.linq(list).concat(7).toArray();
            var l2 = bingo.linq(list).concat([7, 8]).toArray();

            expect(l).toEqual([1, 2, 4, 2, 4, 6, 5, 7]);
            expect(l2).toEqual([1, 2, 4, 2, 4, 6, 5, 7, 8]);

            //合并到前面
            var l = bingo.linq(list).concat(7, true).toArray();
            var l2 = bingo.linq(list).concat([7, 8], true).toArray();

            expect(l).toEqual([7, 1, 2, 4, 2, 4, 6, 5]);
            expect(l2).toEqual([7,8, 1, 2, 4, 2, 4, 6, 5]);
        });

        it('where', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 2 }];

            //查询
            var l = bingo.linq(list).where(function (item) {
                return item < 3;
            }).toArray();
            var l2 = bingo.linq(listObj).where(function () {
                return this.n < 3;
            }).toArray();

            expect(l).toEqual([1, 2, 2]);
            expect(l2).toEqual([{ n: 1 }, { n: 2 }, { n: 2 }]);

            //查询, 从index=2位置开始
            l = bingo.linq(list).where(function (item) {
                return item < 3;
            }, 2).toArray();
            expect(l).toEqual([2]);

            //查询, 只要前两个元素
            l = bingo.linq(list).where(function (item) {
                return item < 3;
            }, 0, 2).toArray();
            expect(l).toEqual([1,2]);

            //查询, 只要前两个元素, 但从后面开始反向查询
            l = bingo.linq(list).where(function (item) {
                return item < 3;
            }, 0, 2, true).toArray();
            expect(l).toEqual([2, 2]);

        });

        it('select', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 2 }];

            //select
            var l = bingo.linq(listObj).select(function () {
                return this.n;
            }).toArray();
            expect(l).toEqual([1, 2, 3, 4, 2]);

            //select, 合并
            //没合并
            l = bingo.linq([[1, 2], [3, 4]]).select(function () {
                return this;
            }).toArray();
            expect(l).toEqual([[1, 2], [3, 4]]);
            //合并
            l = bingo.linq([[1, 2], [3, 4]]).select(function () {
                return this;
            }, true).toArray();
            expect(l).toEqual([1, 2, 3, 4]);

        });

        it('sort', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 2 }];

            //sort
            var l = bingo.linq(listObj).sort(function (item1, item2) {
                return item1.n - item2.n;
            }).toArray();
            expect(l).toEqual([{ n: 1 }, { n: 2 }, { n: 2 }, { n: 3 }, { n: 4 }]);

            //升序, 根据n
            l = bingo.linq(listObj).sortAsc('n').toArray();
            expect(l).toEqual([{ n: 1 }, { n: 2 }, { n: 2 }, { n: 3 }, { n: 4 }]);

            //升序
            l = bingo.linq(list).sortAsc().toArray();
            expect(l).toEqual([1, 2, 2, 4, 4, 5, 6]);

            //降序, 根据n
            l = bingo.linq(listObj).sortDesc('n').toArray();
            expect(l).toEqual([{ n: 4 }, { n: 3 }, { n: 2 }, { n: 2 }, { n: 1 }]);

            //降序
            l = bingo.linq(list).sortDesc().toArray();
            expect(l).toEqual([6, 5, 4, 4, 2, 2,1]);
        });

        it('unique', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 2 }];

            //去除重复元素, 根据n
            var l = bingo.linq(listObj).unique(function () {
                return this.n;
            }).toArray();
            expect(l).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }]);

            //去除重复元素, 根据n
            l = bingo.linq(listObj).unique('n').toArray();
            expect(l).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }]);

            //去除重复元素
            l = bingo.linq(list).unique().toArray();
            expect(l).toEqual([1, 2, 4, 6, 5]);

        });

        it('first/last/take', function () {
            var listObj = [{ n: 1 }, { n: 2, d: 1 }, { n: 3 }, { n: 4 }, { n: 2, d: 2 }];

            //查询n==2第一个
            var l = bingo.linq(listObj).where(function () {
                return this.n == 2;
            }).first();
            expect(l).toEqual({ n: 2, d: 1 });

            //查询n==2最后一个
            l = bingo.linq(listObj).where(function () {
                return this.n == 2;
            }).last();
            expect(l).toEqual({ n: 2, d: 2 });

            //查询n==2, 从0开始取1个结果
            l = bingo.linq(listObj).where(function () {
                return this.n == 2;
            }).take(0, 1);
            expect(l).toEqual([{ n: 2, d: 1 }]);
        });
        
        it('group', function () {
            var listObj = [{ n: 1 }, { n: 2, d: 1 }, { n: 3 }, { n: 4 }, { n: 2, d: 2 }];

            //分组, 根据n
            var l = bingo.linq(listObj).group(function () {
                return this.n;
            }).toArray();
            expect(l).toEqual([{ "group": 1, "items": [{ "n": 1 }] },
                { "group": 2, "items": [{ "n": 2, "d": 1 }, { "n": 2, "d": 2 }] },
                { "group": 3, "items": [{ "n": 3 }] }, { "group": 4, "items": [{ "n": 4 }] }]);

            //分组, 根据n
            l = bingo.linq(listObj).group('n').toArray();
            expect(l).toEqual([{ "group": 1, "items": [{ "n": 1 }] },
                { "group": 2, "items": [{ "n": 2, "d": 1 }, { "n": 2, "d": 2 }] },
                { "group": 3, "items": [{ "n": 3 }] }, { "group": 4, "items": [{ "n": 4 }] }]);

            //分组, 根据n, 并制定相关名称
            l = bingo.linq(listObj).group('n', 'gData', 'gItems').toArray();
            expect(l).toEqual([{ "gData": 1, "gItems": [{ "n": 1 }] },
                { "gData": 2, "gItems": [{ "n": 2, "d": 1 }, { "n": 2, "d": 2 }] },
                { "gData": 3, "gItems": [{ "n": 3 }] }, { "gData": 4, "gItems": [{ "n": 4 }] }]);

        });

        it('toPage', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];

            //分页
            var l = bingo.linq(list).toPage(1, 2);
            expect(l).toEqual({ "currentPage": 1, "totalPage": 4, "pageSize": 2, "totals": 7, "list": [1, 2] });

        });


        it('contain/sum/avg/index', function () {
            var list = [1, 2, 4, 2, 4, 6, 5];
            var listObj = [{ n: 1 }, { n: 2, d: 1 }, { n: 3 }, { n: 4 }, { n: 2, d: 2 }];

            //是否存在contain
            var l = bingo.linq(list).where(function (item) { return item == 1; }).contain();
            expect(l).toEqual(true);

            //sum
            l = bingo.linq(list).sum();
            expect(l).toEqual(24);
            l = bingo.linq(listObj).sum('n');
            expect(l).toEqual(12);
            l = bingo.linq(listObj).sum(function () { return this.n; });
            expect(l).toEqual(12);

            //avg
            l = bingo.linq([1,2,3]).avg();
            expect(l).toEqual(2);
            l = bingo.linq(listObj).avg('n');
            expect(l).toEqual(2.4);
            l = bingo.linq(listObj).avg(function () { return this.n; });
            expect(l).toEqual(2.4);

            l = bingo.linq([1, 2, 3]).where(function (item) { return item == 2; }).index();
            expect(l).toEqual(1);
        });

    });//end bingo.linq

});

//describe('bingo.Event ======>', function () {

    //    it('测试owner', function () {

    //        //但值还是obj.v1和obj.v
    //        expect(obj1.vv1()).toEqual(obj.v1());
    //        expect(obj1.vv()).toEqual(obj.v());

    //    });

//});//end bingo.Event
