
(function (bingo) {

    bingo.factory('$linq', function () {
        return function (p) { return bingo.linq(p); };
    });

})(bingo);
