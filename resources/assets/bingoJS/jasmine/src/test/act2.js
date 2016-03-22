
bingo.module('src').controller('test').action('act2', ['$view', function ($childView2) {
    var status = window.srcTestActStatus;

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
