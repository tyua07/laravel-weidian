<?php

// +----------------------------------------------------------------------
// | date: 2015-06-28
// +----------------------------------------------------------------------
// | swoole.php: swoole服务器端
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

class SwooleServer{

    private $swoole_server;//swoole_server 对象
    private $swoole_config;//swoole config配置

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){
        $this->swoole_config = include dirname(__DIR__) . '/config/swoole.php';
        $this->swoole_server = new swoole_server($this->swoole_config['swoole_host'], $this->swoole_config['swoole_port']);

        //设置swoole配置
        $this->set();

        //绑定事件
        $this->bind();

        //启动swoole 服务器端
        $this->swoole_server->start();
    }

    /**
     * 设置swoole配置
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function set(){
        $this->swoole_server->set([
            'worker_num'                => $this->swoole_config['worker_num'],//worker进程数
            'daemonize'                 => $this->swoole_config['daemonize'],//守护进程化
            'max_conn'                  => $this->swoole_config['max_conn'],//最大连接
            'max_request'               => $this->swoole_config['max_request'],//参数表示worker进程在处理完n次请求后结束运行。manager会重新创建一个worker进程。此选项用来防止worker进程内存溢出。
            'open_cpu_affinity'         => $this->swoole_config['open_cpu_affinity'],//启用CPU亲和设置
            'log_file'                  => $this->swoole_config['log_file'],//日志文件路径
            'open_eof_check'            => $this->swoole_config['open_eof_check'],//打开buffer
            'package_eof'               => $this->swoole_config['package_eof'],//设置EOF
            'heartbeat_check_interval'  => $this->swoole_config['heartbeat_check_interval'],//每隔多少秒检测一次，单位秒，Swoole会轮询所有TCP连接，将超过心跳时间的连接关闭掉
            'heartbeat_idle_time'       => $this->swoole_config['heartbeat_idle_time'],//TCP连接的最大闲置时间，单位s , 如果某fd最后一次发包距离现在的时间超过heartbeat_idle_time会把这个连接关闭。
            'task_worker_num'           => $this->swoole_config['task_worker_num'],
        ]);
    }

    /**
     * 绑定时间
     */
    private function bind(){
        $this->swoole_server->on('start', [$this, 'onStart']);
        $this->swoole_server->on('Shutdown', [$this, 'onShutdown']);
        $this->swoole_server->on('WorkerStart', [$this, 'onWorkerStart']);
        $this->swoole_server->on('WorkerStop', [$this, 'onWorkerStop']);
        $this->swoole_server->on('Timer', [$this, 'onTimer']);
        $this->swoole_server->on('Connect', [$this, 'onConnect']);
        $this->swoole_server->on('Receive', [$this, 'onReceive']);
        $this->swoole_server->on('close', [$this, 'onClose']);
        $this->swoole_server->on('start', [$this, 'onStart']);
        $this->swoole_server->on('Task', [$this, 'onTask']);
        $this->swoole_server->on('Finish', [$this, 'onFinish']);
        $this->swoole_server->on('PipeMessage', [$this, 'onPipeMessage']);
        $this->swoole_server->on('WorkerError', [$this, 'onWorkerError']);
        $this->swoole_server->on('ManagerStart', [$this, 'onManagerStart']);
        $this->swoole_server->on('ManagerStop', [$this, 'onManagerStop']);
    }

    /**
     * Server启动在主进程的主线程回调此函数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onStart(){
        echo "----------------------------------------------------------------\r\n";
        echo "------------------ Server start---------------------------------\r\n";
        echo "------------------ tcp {$this->swoole_config['swoole_port']} ------------------------------------\r\n";
    }

    /**
     * 事件在Server结束时发生
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onShutdown(){
        echo "Server shutdown\n";
    }

    /**
     * 此事件在worker进程/task进程启动时发生
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onWorkerStart(){
        //引入函数库
        include dirname(__DIR__) . '/app/Functions/common.func.php';
    }

    /**
     * 事件在worker进程终止时发生
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onWorkerStop(){
        echo "Worker stop \n";
    }

    /**
     * 定时器触发
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onTimer(){

    }

    /**
     * 有新的连接进入时，在worker进程中回调
     *
     * @param $serv
     * @param $fd
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onConnect(swoole_server $serv, $fd){

    }

    /**
     * 接收到数据时回调此函数，发生在worker进程中
     *
     * @param $serv
     * @param $fd
     * @param $from_id
     * @param $data
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onReceive(swoole_server $serv, $fd, $from_id, $data){

        //解析数据
        $data = json_decode($data, true);

        switch($data['step']){
            //异步任务
            case 'task':
                //开始 task
                $params = ['fd'=> $fd, 'targer'=>$data['targer'], 'params'=>$data['params'], 'callback'=>$data['callback']];

                //发送异步请求
                $serv->task($params);
                break;

            //保存用户信息
            case 'save_user':
                $user_info      = unserialize($data['params']);
                $user_info->fd  = $fd;
                $params = ['fd'=> $fd, 'targer'=>$data['targer'], 'params'=> ['user_info' => serialize($user_info)], 'callback'=>$data['callback']];
                //发送异步请求
                $serv->task($params);
                break;

            //发送消息到用户
            case 'send_message_to_user':
                $serv->send($data['params']['fd'], $data['params']['data']);
                break;

            //默认操作
            case 'default':
                break;
        }

        //关闭连接
        $serv->close($fd);
    }

    /**
     * TCP客户端连接关闭后，在worker进程中回调此函数
     *
     * @param $serv
     * @param $fd
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onClose(swoole_server $serv, $fd){
        //echo "Client: Close.\n";
    }

    /**
     * 在task_worker进程内被调用。worker进程可以使用swoole_server_task函数向task_worker进程投递新的任务
     *
     * @param $serv
     * @param $task_id
     * @param $data
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onTask(swoole_server $serv, $task_id, $from_id, $data){
        //调度任务
        $status =  json_decode(curl_get($data['targer'] .'?'. http_build_query($data['params'])), true);
        return [
            'status'    => $status,
            'data'      => $data,
        ];
    }

    /**
     * 当worker进程投递的任务在task_worker中完成时，task进程会通过swoole_server->finish()方法将任务处理的结果发送给worker进程。
     *
     * @param $serv
     * @param $task_id
     * @param $data
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onFinish(swoole_server $serv, $task_id, $data){

        switch($data['status']['code']){

            //任务调度成功，执行callback
            case 200:
                !empty($data['data']['callback']) && curl_post($data['data']['callback'] .'?'. http_build_query($data['data']['params']));
                break;

            //任务调度失败
            case 400:
                echo 'task 失败，继续任务调度ing'.uniqid() . $this->swoole_config['package_eof'];
                break;
        }
    }

    /**
     * 当工作进程收到由sendMessage发送的管道消息时会触发onPipeMessage事件
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onPipeMessage(){
        echo 'onPipeMessage';
    }

    /**
     * 当worker/task_worker进程发生异常后会在Manager进程内回调此函数。
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onWorkerError(){
        echo 'onWorkerError';
    }

    /**
     * 当管理进程启动时调用它
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onManagerStart(){
        //echo 'onManagerStart';
    }

    /**
     * 当管理进程结束时调用它
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function onManagerStop(){
        //echo 'onManagerStop';
    }

}



$swoole_server = new SwooleServer();
