<?php

return [
    //swoole配置
    'swoole_host'               => '0.0.0.0',
    'swoole_port'               => '9501',
    'web_socket_port'           => '9502',
    'swoole_timeout'            => 60,
    'worker_num'                => 4,//worker进程数
    'daemonize'                 => false,//守护进程化
    'max_conn'                  => 10000,//最大连接
    'max_request'               => 2000,//参数表示worker进程在处理完n次请求后结束运行。manager会重新创建一个worker进程。此选项用来防止worker进程内存溢出。
    'open_cpu_affinity'         => 1,//启用CPU亲和设置
    'log_file'                  => '/var/log/swoole/swoole.log',//日志文件路径
    'web_socket_log_file'       => '/var/log/swoole/web_socket.log',//web socket log 日志路径
    'open_eof_check'            => true,//打开buffer
    'package_eof'               => "\r\n\r\n",//设置EOF
    'heartbeat_check_interval'  => 30,//每隔多少秒检测一次，单位秒，Swoole会轮询所有TCP连接，将超过心跳时间的连接关闭掉
    'heartbeat_idle_time'       => 60,//TCP连接的最大闲置时间，单位s , 如果某fd最后一次发包距离现在的时间超过heartbeat_idle_time会把这个连接关闭。
    'task_worker_num'           => 4,//配置task进程的数量
];
