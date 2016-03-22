<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | PayServiceProvider: 支付服务
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay;

use Illuminate\Support\ServiceProvider;

class PayServiceProvider extends ServiceProvider
{
    /**
     * 定义延迟加载
     *
     * @var bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected $defer = false;

    /**
     * 执行注册后的启动服务。
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function boot()
    {
        //发布配置文件
        $this->setConfig();
    }

    /**
     * 在容器中注册绑定
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function register()
    {
        $this->app->bind('pay', function($app){
            return new PayManager($app);
        });
    }

    /**
     * 设置配置信息
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setConfig()
    {
        // 发布config配置文件
        if ( file_exists(config_path('pay.php'))) {
            $this->mergeConfigFrom(
                realpath(__DIR__.'/config/pay.php'), 'pay'
            );
        } else {
            $this->publishes([
                realpath(__DIR__.'/config/pay.php') => base_path('/config/pay.php'),
            ]);
        }
    }

}