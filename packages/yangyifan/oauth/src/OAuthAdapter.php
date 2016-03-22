<?php

// +----------------------------------------------------------------------
// | date: 2016-03-11
// +----------------------------------------------------------------------
// | OAuthAdapter.php: OAuth适配器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\OAuth;

use InvalidArgumentException;

class OAuthAdapter
{
    /**
     * oauth对象
     *
     * @var OAuthInterface
     */
    protected $oauth;

    /**
     * 构造方法
     *
     * OAuthAdapter constructor.
     * @param $oauth
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(OAuthInterface $oauth)
    {
        $this->oauth = $oauth;
    }

    /**
     * 发起登录
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function login()
    {
        $this->oauth->login();
    }

    /**
     * 获得 access_token
     *
     * @param $code
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAccessToken($code)
    {
        if (!empty($code)) {
            return $this->oauth->getAccessToken($code);
        } else {
            throw new InvalidArgumentException("code 不能为空");
        }
    }

    /**
     * 获得 用户信息
     *
     * @param $access_token
     * @param $uid
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUserInfo($access_token, $uid)
    {
        if (!empty($access_token) && !empty($uid)) {
            return $this->oauth->getUserInfo($access_token, $uid);
        } else {
            throw new InvalidArgumentException("access_token 或者 uid 不能为空");
        }
    }

}