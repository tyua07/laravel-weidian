
(function () {
    //version 1.0.1
    "use strict";

    var a = bingo.define('Test.A', function () {
        this.onAAA = bingo.Event();

        var _id = bingo.makeAutoId();

        this.onAAA(function () {
            console.log('onAAA', _id, arguments, this);
        });


        this.onDispose(function () {
            console.log('onDispose', _id, arguments, this);
        });
        //this.onAAA.on
    });

    a().onAAA.trigger(1);
    Test.A().onAAA().trigger(2).owner().dispose();


    var b = bingo.define(function () {

        this.onB = bingo.Event();
        this.onB(function () {
            console.log('onB', this);
        });

        this.on('aa', function () { console.log('aaaaaaa', this); });
        this.onDispose(function () {
            this.trigger('aa');
            console.log('onDispose B', arguments, this);
        });

    });

    b().onB().trigger().owner().dispose();;

    bingo.env(function () {
        var env = this;
        this.onDispose(function () {
            console.log('onDispose Env', arguments, this);
        });

        setTimeout(function () { env.dispose(); });
    });
})();

//function a(a, b, c) {
//    c = b;
//    b = a;
//    a = 5;
//    console.log(a, b, c, arguments);
//}

//a({ a: 1 }, { b: 2 }, { c: 3 });
//a(1, 2, 3);

var aClass = bingo.Class(function () {

    this.Property({
        //aaa
        a:1
    });
    this.Define({
        ff: function () { console.log(this.a); }
    });

    this.Initialization(function (d) {
        this.a = d;
    });
});

var bClass = bingo.Class(aClass, function () {

    this.Property({
        b:2
    });

    this.Define({
        ddd: function () {
            console.log(this.b);
        }
    });

    this.Initialization(function (d) {
        this.base.apply(this, arguments);
        this.a = (d + 2);
    });

});

bingo.Class('cClass', bClass, function () {
    this.Property({
        c:3
    });

    this.Define({
        cccc: function () {
            console.log(this.c);
        }
    });

    this.Initialization(function (d) {
        this.base.apply(this, arguments);
    });

});

var a = aClass.NewObject(11111);
a.ff();
console.log('a',a);

var b = bClass.NewObject(22222);
b.ff();
b.ddd();
console.log('b', b);

var c = cClass.NewObject(33333);
c.ff();
c.ddd();
c.cccc();
console.log('c', c);
c.onDispose(function () { console.log('c dispose'); });
//c.dispose();

