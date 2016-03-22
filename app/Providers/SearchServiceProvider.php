<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class SearchServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('search', function($app, $params = []){
            //加载库文件
            require_once base_path('/vendor/hightman/xunsearch/lib/XS.class.php') ;
            return new \XS(config_path($params['config_name']));
        });
    }
}
