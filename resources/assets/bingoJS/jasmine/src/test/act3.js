
bingo.module('src').controller('test').action('act3', ['$view', function ($childView3) {
    var status = window.srcTestActStatus;

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

    //console.log('$childView3');
}]);
