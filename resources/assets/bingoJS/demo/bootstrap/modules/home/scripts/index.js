/// <reference path="../../../bingojs/site.js" />

(function (bingo, $) {
    "use strict";

    bingo.module('home', function () {

        bingo.action('index', function ($view) {
            $view.$getNode().show();

            $view.list = [{
                "Domain": "ace.com",
                "Price": "$45", "Clicks": "3,330", "Update": "Feb 12", "Status": "Expiring",
                st: 'label-warning'
            }, {
                "Domain": "base.com",
                "Price": "$35", "Clicks": "2,595", "Update": "Feb 18", "Status": "Registered",
                st: 'label-success'
            }, {
                "Domain": "max.com",
                "Price": "$60", "Clicks": "4,400", "Update": "Mar 11", "Status": "Expiring",
                st: 'label-warning'
            }, {
                "Domain": "best.com",
                "Price": "$75", "Clicks": "6,500", "Update": "Apr 03", "Status": "Flagged",
                st: 'label-inverse arrowed-in'
            }, {
                "Domain": "pro.com",
                "Price": "$55", "Clicks": "4,250", "Update": "Jan 21", "Status": "Registered",
                st: 'label-success'
            }];

        });

    });
    
})(bingoV1, window.jQuery);
