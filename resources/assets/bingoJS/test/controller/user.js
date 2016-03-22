/// <reference path="../service/userService.js" />

bingo.using('service/userService');

(function () {
    'use strict';
    bingo.module('test').factory('$aaa', function () { return { a: 1 }; });

    //bingo.factoryExtend('$view', function ($view) { $view.aaaa = 1; });

    bingo.module('test').controller('user', function () {

        bingo.factory('$bbb', function () { return { b: 1 }; });

        bingo.command('bg-text2', function () {

            return ['$attr', '$node', function ($attr, $node) {
                /// <param name="$attr" value="bingo.view.viewnodeAttrClass()"></param>
                /// <param name="$node" value="$([])"></param>

                var _set = function (val) {
                    $node.text(bingo.toStr(val)+'!text2');
                };

                $attr.$subsResults(function (newValue) {
                    _set(newValue);
                });

                $attr.$initResults(function (value) {
                    _set(value);
                });

            }];
        });

        bingo.action('form1', function ($view, $aaa, $bbb, userService) {

            console.log('$aaa', $aaa);

            console.dir(this);

            console.log('form1', $aaa, $bbb, $view, userService);
            $view.title = 'form1';
            $view.$timeout(function () {
                $view.title = 'form1 next';
            }, 1000);
            $view.onDispose(function () {
                console.log('dispose form1');
            });
        });

        bingo.action('form2', function ($view) {
            console.log('form2', $view);
            $view.title = 'form2';
            $view.onDispose(function () {
                console.log('dispose form2');
            });
        });

    });

})();
