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
//自动构建
Route::group(['prefix' => "auto-build", 'namespace' => 'Yangyifan\AutoBuild\Http\Controllers'], function(){
    //首页
    Route::controller('/home', 'HomeController');
    //生成代码
    Route::group(['namespace' => 'Build'], function(){
        //生成 Controller
        Route::controller('/controller', 'ControllerController');
        //生成 Request
        Route::controller('/request', 'RequestController');
        //生成 Model
        Route::controller('/model', 'ModelController');
    });
    //生成配置文件
    //生成代码
    Route::group(['prefix' => 'config', 'namespace' => 'Config'], function(){
        //生成 Controller
        Route::controller('/controller', 'ControllerController');
        //生成 Request
        Route::controller('/request', 'RequestController');
        //生成 Model
        Route::controller('/model', 'ModelController');
    });
});



