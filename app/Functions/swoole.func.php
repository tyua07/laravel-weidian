<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | swoole.func.php: 获得实例函数库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

/**
 * 发送 task 任务 到swoole server
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('send_task_to_swoole_server')){
    function send_task_to_swoole_server($targer, $params, $callback){
        send_to_swoole_server('task', $targer, $params, $callback);
    }
}

/**
 * 发送 普通数据 到swoole server
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('send_default_to_swoole_server')){
    function send_default_to_swoole_server($targer, $params, $callback){
        send_to_swoole_server('default', $targer, $params, $callback);
    }
}

/**
 * 发送 用户数据 到swoole server
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('send_save_user_to_swoole_server')){
    function send_save_user_to_swoole_server($targer, $params, $callback){
        send_to_swoole_server('save_user', $targer, $params, $callback);
    }
}

/**
 * 发送 数据 到swoole server
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('send_to_swoole_server')){
    function send_to_swoole_server($step, $targer, $params, $callback){
        //加载函数库
        load_func('instanceof');

        $swoole_client = get_swoole_client();
        return $swoole_client->send(json_encode([
                'step'      => $step,
                'targer'    => $targer,
                'params'    => $params,
                'callback'  => $callback,
            ]).config('swoole.package_eof')
        );
    }
}


/**
 * 发送  消息给用户
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('send_message_to_swoole_server')){
    function send_message_to_swoole_server($targer, $params, $callback){
        send_to_swoole_server('send_message_to_user', $targer, $params, $callback);
    }
}






