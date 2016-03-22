<?php

// +----------------------------------------------------------------------
// | date: 2016-03-11
// +----------------------------------------------------------------------
// | QQAdapter.php: QQ OAuth登录
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace Yangyifan\OAuth\Oauth;

use Yangyifan\OAuth\OAuthException;

class QQAdapter extends AbstractAdapter
{
    const VERSION               = "2.0";
    const GET_AUTH_CODE_URL     = "https://graph.qq.com/oauth2.0/authorize";
    const GET_ACCESS_TOKEN_URL  = "https://graph.qq.com/oauth2.0/token";
    const GET_OPENID_URL        = "https://graph.qq.com/oauth2.0/me";
    const GET_USER_INFO_URL     = "https://graph.qq.com/user/get_info";

    /**
     * 配置信息
     *
     * @var
     */
    protected $config;

    /**
     *OAUTH 对象
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
        $login_url =  $this->combineURL(self::GET_AUTH_CODE_URL, [
            "response_type"     => $this->config['response_type'],
            "client_id"         => $this->config['app_id'],
            'client_secret'     => $this->config['app_key'],
            "redirect_uri"      => $this->config['callback'],
            "state"             => md5(uniqid(rand(), true)),//生成唯一随机串防CSRF攻击
            "scope"             => $this->config['scope']
        ]);

        header("Location:$login_url");
    }

    /**
     * 获得 access_token
     *
     * @param $code
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAccessToken($code)
    {
        $url = $this->combineURL(self::GET_ACCESS_TOKEN_URL, [
            'client_id'     => $this->config['app_id'],
            'client_secret' => $this->config['app_key'],
            'grant_type'    => $this->config['grant_type'],
            'code'          => $code,
            'redirect_uri'  => $this->config['callback'],
        ]);
        $response = $this->curlGet($url);


        if(strpos($response, "callback") !== false){

            $lpos           = strpos($response, "(");
            $rpos           = strrpos($response, ")");
            $response       = substr($response, $lpos + 1, $rpos - $lpos -1);
            $msg            = json_decode($response, true);

            if(isset($msg['error'])){
                throw new OAuthException($msg['error_description'], $msg['error']);
            }
        } else {
            //解析参数
            parse_str($response);

            return [
                'access_token'  => $access_token,
                'uid'           => $this->getOpenId($access_token),
            ];
        }

    }

    /**
     * 获得 open_id
     *
     * @param $access_token
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getOpenId($access_token)
    {
        $url = $this->combineURL(self::GET_OPENID_URL, [
            'access_token'  => $access_token,
        ]);
        $response = $this->curlGet($url);

        if(strpos($response, "callback") !== false){

            $lpos           = strpos($response, "(");
            $rpos           = strrpos($response, ")");
            $response       = substr($response, $lpos + 1, $rpos - $lpos -1);
            $msg            = json_decode($response, true);

            if(isset($msg['error'])){
                throw new OAuthException($msg['error_description']);
            } else {
                return $msg['openid'];
            }
        }
    }

    /**
     * 获得用户信息
     *
     * @param $access_token
     * @param $uid
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUserInfo($access_token, $uid)
    {
        $url = $this->combineURL(self::GET_USER_INFO_URL, [
            'oauth_consumer_key'    => $this->config['app_id'],
            'access_token'          => $access_token,
            'openid'                => $uid,
            'format'                => $this->config['format'],
        ]);
        $data = json_decode($this->curlGet($url), true);
        if (!empty($data['msg'])) {
            throw new OAuthException($data['msg'], $data['ret']);
        } else {
            return $data;
        }
    }
}