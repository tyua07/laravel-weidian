<?php

// +----------------------------------------------------------------------
// | date: 2015-08-03
// +----------------------------------------------------------------------
// | websocket.php: swoole web_socket服务器端
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

class SwooleWebSocket{

    private $web_socket;//web socket对象
    private $swoole_config;//swoole配置文件
    private $config;//配置文件

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){
        $this->swoole_config = include dirname(__DIR__) . '/config/swoole.php';
        $this->web_socket = new swoole_websocket_server($this->swoole_config['swoole_host'], $this->swoole_config['web_socket_port']);

        //设置socket配置
        $this->set();

        //绑定函数
        $this->bind();

        //启动
        $this->web_socket->start();
    }

    /**
     * 设置 socket
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function set(){
        $this->web_socket->set([
            'daemonize'             => $this->swoole_config['daemonize'],
            'log_file'              => $this->swoole_config['web_socket_log_file'],
        ]);
    }

    /**
     * 绑定函数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function bind(){
        $this->web_socket->on('open', [$this, 'onOpen']);
        $this->web_socket->on('message', [$this, 'onMessage']);
        $this->web_socket->on('close', [$this, 'onClose']);
    }

    /**
     * 此事件在worker进程/task进程启动时发生
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onWorkerStart(){
        //引入函数库
        require_once dirname(__DIR__) . '/app/libraries/common.func.php';
        require_once dirname(__DIR__) . '/app/libraries/instanceof.func.php';

        //引入配置文件
        $this->config = include dirname(__DIR__) . '/config/config.php';
    }


    /**
     * WebSocket客户端与服务器建立连接并完成握手
     *
     * @param swoole_websocket_server $server
     * @param $req
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onOpen(swoole_websocket_server $server, $req){

        $data = [
            'cmd'   => 'login',
            'fd'    => $req->fd,
            'data'  => $server,
        ];

        //开始更新当前连接到redis
//        get_redis()->hset($this->config['websocket_list'], $req->fd, json_encode([
//            'master_pid'    => $server['master_pid'],
//            'manager_pid'   => $server['manager_pid'],
//            'worker_id'     => $server['worker_id'],
//            'worker_pid'    => $server['worker_pid'],
//            'fd'            => $req->fd,
//        ]));

        $server->push($req->fd, json_encode($data));
    }

    /**
     * 接受消息时
     *
     * @param swoole_websocket_server $server
     * @param $frame
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onMessage(swoole_websocket_server $server, $frame){
        //组合数据
        $data = json_decode($frame->data, true);
        $data['time'] = date('Y-m-d H:i:s');

        $server->push($data['id'], json_encode($data));
    }

    /**
     * 关闭连接时
     *
     * @param swoole_websocket_server $server
     * @param $fd
     */
    public function onClose(swoole_websocket_server $server, $fd){

        //销毁当前连接对象
        get_redis()->hDel($this->config['websocket_list'], $fd);

        echo "connection close: ".$fd . $this->swoole_config['package_eof'];;
    }
}

$web_socket = new SwooleWebSocket();