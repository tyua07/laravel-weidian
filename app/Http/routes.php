<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Blade::setContentTags('<%', '%>');         // for variables and all things Blade
Blade::setEscapedContentTags('<%%', '%%>');     // for escaped data

//重定向
Route::get('/', function() {
    return redirect()->action('Admin\Admin\AdminInfoController@getIndex');
});
//base
Route::controller('base', 'BaseController');
//登录
Route::controller('login', 'Admin\LoginController');
//后台
Route::group(['prefix'=>'admin', 'middleware' => 'admin.base',  'namespace' => 'Admin'], function(){
    //重定向
    Route::get('/', function() {
        return redirect()->action('Admin\Admin\AdminInfoController@getIndex');
    });
    //首页
    Route::controller('home', 'HomeController');
    //基础控制器
    Route::controller('base', 'BaseController');
    //权限管理
    Route::group(['prefix'=>'admin', 'namespace' => 'Admin'], function(){
        //后台用户
        Route::controller('info', 'AdminInfoController');
        //后台菜单
        Route::controller('menu', 'AdminMenuController');
        //后台角色
        Route::controller('limit', 'AdminLimitController');
        //后台函数
        Route::controller('function', 'AdminFunctionController');
        //后台日志
        Route::controller('log', 'AdminLogController');
    });
    //会员(当前会员全部是自动构建创建的代码)
    Route::controller('user', 'UserInfo\UserInfo1Controller');
    //微店
    Route::group(['prefix' => 'weidian', 'namespace' => 'Weidian'], function(){
        //商品管理
        Route::controller('goods', 'GoodsController');
        //商品sku
        Route::controller('goods-sku', 'GoodsSKUController');
        //商品图片
        Route::controller('goods-images', 'GoodsImageController');
        //商品分类
        Route::controller('category', 'CategoryController');
    });
});
//工具
Route::group(['prefix'=>'tools', 'namespace' => 'Tools'],function(){
    //上传
    Route::controller('upload', 'UploadController');
    //支付
    Route::controller('pay', 'PayController');
    //登录
    Route::controller('oauth', 'OAuthController');
    //搜索
    Route::controller('search', 'SearchController');
});

/**
 * Api
 */
$api = app('Dingo\Api\Routing\Router');

//Show user info via restful service.
$api->version('v1', ['namespace' => 'App\Api'], function ($api) {
    $api->get('users', 'UserController@index');
    $api->get('users/{id}', 'UserController@show');
});

//Just a test with auth check.
$api->version('v1', ['middleware' => 'api.auth'] , function ($api) {
    $api->get('time', function () {
        return ['now' => microtime(), 'date' => date('Y-M-D',time())];
    });
});

