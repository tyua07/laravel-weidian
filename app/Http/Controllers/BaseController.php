<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | BaseController: 基础控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Model\Admin\BaseModel;

class BaseController extends Controller
{

    //HTTP 状态码
    const SUCCESS_STATE_CODE    = 200;//成功状态码
    const REDIRECT_STATE_CODE   = 302;//跳转状态码
    const ERROR_STATE_CODE      = 400;//失败状态码
    const UNAUTHORIZED_CODE     = 401;//未授权状态码
    const SERVER_ERROR          = 500;//服务器出错了

    const CONNECTION = '@';//控制器名称和方法名称连接符号

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){
        //调试sql
        $this->enableQueryLog();
        //设置错误级别
        $this->setErrorLevel();
    }

    /**
     * 设置错误级别
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setErrorLevel()
    {
        //如果不是debug模式，则关闭waring
        if (env('APP_DEBUG', false) == true) {
            error_reporting(E_ALL ^ E_NOTICE);
        } else {
            error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
        }
    }

    /**
     * 调试sql
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function enableQueryLog()
    {
        //如果是debug模式，则开启调试sql
        if (env('APP_DEBUG', false) == true) {
            //开启sql调试
            \DB::connection()->enableQueryLog();
        }
    }

    /**
     * 响应
     *
     * @param $code     状态码
     * @param $msg      提示文字
     * @param $data     数据
     * @param $target   是否跳转到新页面
     * @prams $href     跳转的网址
     * @prams $cookie   需要设置的cookie数组
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function response($code = self::SUCCESS_STATE_CODE, $msg = '',  $data = [], $target = false, $href = '',  $cookie = [])
    {
        //如果是jsonp 请求，则返回jsonp格式response
        if (!empty($_REQUEST['callback'])) {
            return $this->setCookie($cookie, new Response())->jsonp($_REQUEST['callback'], [$code, $msg , $data , $target, $href]);
        }
        return $this->setCookie($cookie, new Response())->setContent($this->responseContent($code, $msg , $data , $target, $href), self::SUCCESS_STATE_CODE);
    }

    /**
     * 批量设置cookie
     *
     * @param array $cookie_arr     cookie数组
     * @param Response $response    响应对象
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setCookie($cookie_arr = [], Response $response)
    {
        if ( count($cookie_arr) > 0 ) {
            foreach ( $cookie_arr as $cookie_name => $cookie_value) {
                $response->withCookie(Cookie()->forever($cookie_name, $cookie_value));
            }
        }
        return $response;
    }

    /**
     * 获得 响应内容
     *
     * @param int $code
     * @param string $msg
     * @param array $data
     * @param bool|true $target
     * @param string $href
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function responseContent($code = self::SUCCESS_STATE_CODE, $msg = '', $data = [], $target = false, $href = '')
    {
        return json_encode(compact('code', 'msg', 'data', 'target', 'href'));
    }

    /**
     * 响应错误页面
     *
     * @param Request $request
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getError($message)
    {
        return view('errors.error', [
            'message' => $message,
        ]);
    }

}
