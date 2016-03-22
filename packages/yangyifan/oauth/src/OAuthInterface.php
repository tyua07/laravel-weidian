<?php

// +----------------------------------------------------------------------
// | date: 2016-03-11
// +----------------------------------------------------------------------
// | OAuthInterface.php: OAuth接口
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\OAuth;

interface OAuthInterface
{
    /**
     * 发起登录
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function login();

    /**
     * 获得 access_token
     *
     * @param $code
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAccessToken($code);

    /**
     * 获得用户信息
     *
     * @param $access_token
     * @param $uid
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUserInfo($access_token, $uid);

}