<?php

// +----------------------------------------------------------------------
// | date: 2015-08-03
// +----------------------------------------------------------------------
// | WebSocketController.php: 上传控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\BaseController;

use App\Http\Requests;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class WebSocketController extends BaseController {


    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){

    }

	/**
	 * web socket 首页
	 *
	 * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function getIndex(){
        return View('tools.socket.index');
	}



}
