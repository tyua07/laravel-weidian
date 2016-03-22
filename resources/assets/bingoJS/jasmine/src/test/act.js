
bingo.module('src').controller('test').action('act', function ($view) {
    var status = window.srcTestActStatus;

    $view.title = 'aaa';
    $view.onInitData(function () {
        status.push('onInitData');
    });
    $view.onReady(function () {
        status.push('onReady');
    });
    $view.onReadyAll(function () {
        status.push('onReadyAll');
    });
    $view.onDispose(function () {
        status.push('onDispose');
    });
});
