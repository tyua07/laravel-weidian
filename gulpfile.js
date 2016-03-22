var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;//关闭map

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */


//var MergeRequest = require('./commands/MergeRequest'); 修改了 这个文件的代码 在 第四行

elixir(function(mix) {

    //合并css

        //基础css
        mix.styles([
            "ladda/dist/ladda-themeless.min.css",
            "assets/js/button/ladda/ladda.min.css",
            "assets/css/bootstrap.min.css",
            "toastr/toastr.css",
            "assets/css/style.css",
            "assets/js/skin-select/skin-select.css",
            "assets/css/font-awesome.css",
            "assets/css/entypo-icon.css",
            "assets/css/maki-icons.css",
            "assets/css/weather-icons.min.css",
            "assets/css/dripicon.css",
            "assets/css/open-sans.css",
            "assets/css/awwwards.css",
            "assets/css/extra-pages.css",
            "assets/js/tip/tooltipster.css",
            "assets/js/pnotify/jquery.pnotify.default.css",
            "assets/js/pace/themes/pace-theme-center-simple.css",
            "assets/js/slidebars/slidebars.css",
            "assets/js/gage/jquery.easy-pie-chart.css",
        ], "public/dist/base.css");

        //登录css
        mix.styles([
            "assets/css/signin.css",
        ], "public/dist/login.css");

        //builder add & edit 页面 css
        mix.styles([
          "ladda/dist/ladda-themeless.min.css",  
        ], "public/dist/builder_update.css");

        //builder list 页面 css
        mix.styles([
            "bootstrap-table/src/bootstrap-table.css",
        ], "public/dist/builder_list.css");

        //builder tab 页面 css
        mix.styles([
            "assets/js/colorPicker/bootstrap-colorpicker.css",
            "assets/js/switch/bootstrap-switch.css",
            "assets/js/idealform/css/jquery.idealforms.css"
        ], "public/dist/builder_tab.css");

        //builder tree 页面 css
        mix.styles([
            "assets/js/tree/jquery.treeview.css",
            "assets/js/tree/treetable/stylesheets/jquery.treetable.css",
            "assets/js/tree/treetable/stylesheets/jquery.treetable.theme.default.css",
            "assets/js/tree/tabelizer/tabelizer.min.css"
        ], "public/dist/builder_tree.css");

        //order 页面 css
        mix.styles([
            "css/order.css",
            "ystep/ystep.css",
            "assets/css/extra-pages.css"
        ], "public/dist/goods_order.css");

        //email 页面 css
        mix.styles([
            "css/email.css",
            "assets/css/extra-pages.css"
        ], "public/dist/email.css");


        //弹出页面上传框 页面 css
        mix.styles([
            "assets/js/upload/demos/css/uploader.css",
            "assets/js/upload/demos/css/demo.css",
            "assets/js/dropZone/downloads/css/dropzone.css"
        ], "public/dist/upload_image_dialog.css");

    //合并js

        //基础js
        mix.scripts([
            "assets/js/jquery.min.js",
            "cookie/cookie.js",
            "assets/js/tree/lib/jquery.cookie.js",
            //"assets/js/tree/tabelizer/jquery-ui-1.10.4.custom.min.js",
            "jquery-ui/jquery-ui-1.10.4.custom.min.js",
            "jquery.iframe-transport.js",
            "ladda/dist/spin.min.js",
            "ladda/dist/ladda.min.js",
            "ladda/dist/ladda.jquery.min.js",
            "assets/js/tree/treetable/vendor/jquery-ui.js"
        ], "public/dist/base.js");

        //main js
        mix.scripts([
            "toastr/toastr.js",
            "js/customJs/base/tools.js",
            "js/customJs/base/common_function.js",
            "js/customJs/base/base.js",
            //"js/customJs/base.js",
            "layer-v1.9.3/layer/layer.js",
            "assets/js/bootstrap.min.js",
            "assets/js/app.js",
            "assets/js/load.js",
            "assets/js/main.js",
            "bingoJS/bingo.full/bingo.min.js"
        ], "public/dist/main.js");

        // 登录界面 js
        mix.scripts([
            "Validform-v5.3.2/Validform_v5.3.2.js"
        ], "public/dist/login.js");

        //builder add & edit 页面 js
        mix.scripts([
            "Validform-v5.3.2/Validform_v5.3.2.js",
            "js/customJs/html_builder/search.js",
            "js/customJs/html_builder/select.js",
            "js/customJs/html_builder/initUpdatePage.js",
            "autolayout/autolayout.js",
            "js/customJs/autolayout/main.js",
            "raty/lib/jquery.raty.js",
        ], "public/dist/builder_update.js");

        //builder list 页面 js
        mix.scripts([
            "bootstrap-table/dist/bootstrap-table.js",
            "bootstrap-table/src/locale/bootstrap-table-zh-CN.js",
            "bootstrap-table/src/extensions/cookie/bootstrap-table-cookie.js",
            "js/customJs/bootstrap-table/extensions/bootstrap-search.js",
            "js/customJs/bootstrap-table/extensions/bootstrap-body.js",
            "js/customJs/html_builder/initListPage.js",
        ], "public/dist/builder_list.js");

        //builder tab 页面 js
        mix.scripts([
            "Validform-v5.3.2/Validform_v5.3.2.js",
            "js/customJs/html_builder/search.js",
            "js/customJs/html_builder/select.js",
            "js/customJs/html_builder/initUpdatePage.js",
            "js/customJs/html_builder/initTabPage.js",,
            //"assets/js/iCheck/jquery.icheck.js",
            "autolayout/autolayout.js",
            "js/customJs/autolayout/main.js",
        ], "public/dist/builder_tab.js");

        //builder tree 页面 js
        mix.scripts([
            "assets/js/tree/jquery.treeview.js",
            "assets/js/tree/tabelizer/jquery.tabelizer.js",
            "assets/js/tree/treetable/javascripts/src/jquery.treetable.js",
            "js/customJs/html_builder/initTreePage.js"
        ], "public/dist/builder_tree.js");


        // multi upload image 页面
        mix.scripts([
            "js/customJs/multiUploadImage.js"
        ], "public/dist/multi_upload_image.js");

        // 弹出页面上传框 页面 js
        mix.scripts([
            "assets/js/upload/src/dmuploader.min.js",
            "assets/js/dropZone/lib/dropzone.js"
        ], "public/dist/upload_image_dialog.js");

        // 微店商品分类 页面 js
        mix.scripts([
            "js/customJs/weidian/category.js",
        ], "public/dist/weidian/category.js");

        // 微店商品 页面 js
        mix.scripts([
            "js/customJs/weidian/goods.js",
        ], "public/dist/weidian/goods.js");

        // 微店商品SKU 页面 js
        mix.scripts([
            "js/customJs/weidian/goodsSku.js",
        ], "public/dist/weidian/goodsSku.js");

        // multi upload image 页面
        mix.scripts([
            "js/customJs/multiUploadImage.js"
        ], "public/dist/multi_upload_image.js");

    //压缩文件
        mix.version([
            "public/dist/base.css",
            "public/dist/base.js",
            "public/dist/main.js",
            "public/dist/builder_update.css",
            "public/dist/builder_update.js",
            "public/dist/builder_list.css",
            "public/dist/builder_list.js",
            "public/dist/builder_tab.css",
            "public/dist/builder_tab.js",
            "public/dist/builder_tree.css",
            "public/dist/builder_tree.js",
            "public/dist/goods_order.css",
            "public/dist/multi_upload_image.js",
            "public/dist/email.css",
            "public/dist/upload_image_dialog.css",
            "public/dist/upload_image_dialog.js",
            "public/dist/login.css",
            "public/dist/login.js",
            "public/dist/weidian/category.js",
            "public/dist/weidian/goods.js",
            "public/dist/weidian/goodsSku.js",
            "public/dist/multi_upload_image.js",
        ]);

    //移动文件
        mix.copy('resources/assets/assets/img', 'public/build/img');
        mix.copy('resources/assets/assets/font', 'public/assets/font');
        mix.copy('resources/assets/assets/font/entypo.ttf', 'public/build/font/entypo.ttf');
        mix.copy('resources/assets/assets/font/entypo.woff', 'public/build/font/entypo.woff');
        mix.copy('resources/assets/assets/fonts', 'public/build/fonts');
        mix.copy('resources/assets/assets/js', 'public/assets/js');
        mix.copy('resources/assets/assets/ico', 'public/build/ico');
        mix.copy('resources/assets/layer-v1.9.3/layer/skin', 'public/build/dist/skin/');
        mix.copy('resources/assets/my97-date', 'public/my97-date');
        mix.copy('resources/assets/assets/js/dropZone/downloads/images', 'public/build/images');
        mix.copy('resources/assets/multiSelect', 'public/multiSelect');
        mix.copy('resources/assets/raty/lib/img', 'public/raty/imimgg');



});
