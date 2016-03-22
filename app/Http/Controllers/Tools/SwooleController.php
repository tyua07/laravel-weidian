<?php

// +----------------------------------------------------------------------
// | date: 2015-06-28
// +----------------------------------------------------------------------
// | SwooleController.php: swoole客户端控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Tools;

use App\Http\Requests;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Storage;

class SwooleController extends Controller {

    private $swoole_client;//swoole_clent客户端

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){
        $this->swoole_client = new \swoole_client(SWOOLE_SOCK_TCP);

        $this->swoole_client->on("connect", function($cli) {
            $this->swoole_client->send("hello world\n");
        });

        //设置客户端参数
        //$this->set();

        //绑定事件
        $this->swoole_client->on('connect', [$this, 'onConnect']);
        $this->swoole_client->on('receive', [$this, 'onReceive']);
        $this->swoole_client->on('close', [$this, 'onClose']);

        //链接swoole_server
        $this->swoole_client->connect(config('swoole.swoole_host'), config('swoole.swoole_port'), config('swoole.swoole_timeout'));

        //判断是否连接
        if($this->swoole_client->isConnected() == false){
            echo ("connect failed. Error: {$this->swoole_client->errCode}".config('swoole.package_eof'));
        }

    }

    /**
     * 设置客户端参数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function set(){
        $this->swoole_client->set([
            'open_length_check' => config('swoole.open_eof_check'),
            //'package_eof'       => config('swoole.package_eof'),
        ]);
    }

    /**
     * 发送请求
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex(){
        $this->swoole_client->send(json_encode(['step'=>'task','data'=>111]).config('swoole.package_eof'));
        echo $this->swoole_client->recv() . config('swoole.package_eof');
        $this->swoole_client->close();
    }
}
