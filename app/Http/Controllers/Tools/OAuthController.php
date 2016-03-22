<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | PayController.php: 支付控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Tools;

use App\Http\Requests;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use OAuth;
use Yangyifan\OAuth\Oauth\AbstractAdapter;
use Yangyifan\OAuth\OAuthException;

class OAuthController extends BaseController
{
    /**
     * oauth 对象
     *
     * @var AbstractAdapter
     */
    private $oauth;

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        $this->oauth = OAuth::drive('qq');
    }

    /**
     * 发起登录
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        $this->oauth->login();
    }

    /**
     * 回调地址
     *
     * @param Request $request
     */
    public function getCallback(Request $request)
    {
        try {
            //获得 access_token 信息
            $access_token_info = $this->oauth->getAccessToken($request->get('code'));

            //获得用户信息
            $user_info = $this->oauth->getUserInfo($access_token_info['access_token'], $access_token_info['uid']);
            dd($user_info);
        }catch (OAuthException $e){
            echo $e->getMessage();die;
        }

    }
}
