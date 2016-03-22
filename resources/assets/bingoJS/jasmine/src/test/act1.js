
bingo.module('src').controller('test').action('act1', ['$view', function ($childView1) {
    var status = window.srcTestActStatus;

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


}]);
