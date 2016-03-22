<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | instanceof.func.php: 获得实例函数库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

/**
 * 获得redis对象
 *
 * @return array
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('get_redis')){
    function get_redis(){
        $redis = new \Redis();
        $redis->connect(config('database.redis.default.host'), config('database.redis.default.port'));
        //选择数据库
        $redis->select(config('database.redis.default.database'));
        return $redis;
    }
}

/**
 * 获得swolle_cliend对象
 *
 * @return array
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('get_swoole_client')){
    function get_swoole_client(){
        $swoole_client = new \swoole_client(SWOOLE_SOCK_TCP);
        $swoole_client->connect(config('swoole.swoole_host'), config('swoole.swoole_port'), config('swoole.swoole_timeout'));
        return $swoole_client;
    }
}





