<?php

// +----------------------------------------------------------------------
// | date: 2016-03-11
// +----------------------------------------------------------------------
// | QQAdapter.php: QQ OAuth登录
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace Yangyifan\OAuth\Oauth;

class WeiboAdapter extends  AbstractAdapter
{
    const VERSION               = "2.0";
    const GET_AUTH_CODE_URL     = "https://api.weibo.com/oauth2/authorize";
    const GET_ACCESS_TOKEN_URL  = "https://api.weibo.com/oauth2/access_token";
    const GET_USER_INFO_URL     = "https://api.weibo.com/2/users/show.json";

    /**
     * 配置信息
     *
     * @var
     */
    protected $config;

    /**
     * OAUTH 对象
     *
     * @var
     */
    protected $oauth;

    /**
     * 构造方法
     *
     * @param $config   配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($config)
    {
        $this->config   = $config;
    }

    /**
     * 发起登录
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function login()
    {
        $url = $this->combineURL(self::GET_AUTH_CODE_URL, [
            'client_id'     => $this->config['app_key'],
            'redirect_uri'  => $this->config['callback'],
        ]);
        header("location: {$url}");
    }

    /**
     * 获得 access_token
     *
     * @param $code
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAccessToken($code)
    {
        $url = $this->combineURL(self::GET_ACCESS_TOKEN_URL, [
            'client_id'     => $this->config['app_key'],
            'client_secret' => $this->config['app_secret'],
            'grant_type'    => $this->config['grant_type'],
            'code'          => $code,
            'redirect_uri'  => $this->config['callback'],
        ]);

        return json_decode($this->curlPost($url), true);
    }

    /**
     * 获得用户信息
     *
     * @param $access_token
     * @param $uid
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUserInfo($access_token, $uid)
    {
        $url = $this->combineURL(self::GET_USER_INFO_URL, [
            'access_token'  => $access_token,
            'uid'           => $uid,
        ]);
        return json_decode($this->curlGet($url), true);
    }

}