<?php

// +----------------------------------------------------------------------
// | date: 2016-03-11
// +----------------------------------------------------------------------
// | AbstractAdapter.php:  OAuth 抽象类型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace Yangyifan\OAuth\Oauth;

use Yangyifan\OAuth\OAuthInterface;
use GuzzleHttp\Client;

abstract class AbstractAdapter implements OAuthInterface
{
    /**
     * Client
     *
     * @var Client
     */
    private static $client;

    /**
     * 组合url
     *
     * @param $url
     * @param array $params
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function combineURL($url, array $params = [])
    {
        return rtrim($url, '?') . '?' . http_build_query($params);
    }

    /**
     * 获得 Client
     *
     * @return Client
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getClient()
    {
        if (is_null(self::$client)) {
            self::$client = new Client();
        }
        return self::$client;
    }

    /**
     * curl_get
     *
     * @author aaron
     * @param string $url
     * @param string $str_params
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function curlGet($url, $str_params = '')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);                                    // 设置访问链接
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);                         // 是否返回信息
        curl_setopt($ch, CURLOPT_HEADER, 'Content-type: application/json');     // 设置返回信息数据格式 application/json
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);                                   // 响应时间 5s
        $http_head = mb_substr($url,0,5);
        if($http_head == 'https'){
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);                    // https请求 不验证证书和hosts
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        }
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    /**
     * curl_post
     *
     * @author aaron
     * @param string $url
     * @param string $str_params
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function curlPost($url, $str_params = '')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);                                    // 设置访问链接
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);                         // 是否返回信息
        curl_setopt($ch, CURLOPT_HEADER, 'Content-type: application/json');     // 设置返回信息数据格式 application/json
        curl_setopt($ch, CURLOPT_POST, TRUE);                                   // 设置post方式提交
        curl_setopt($ch, CURLOPT_POSTFIELDS, $str_params);                      // POST提交数据
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);                                   // 响应时间 5s
        $http_head = mb_substr($url,0,5);
        if($http_head == 'https'){
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);                    // https请求 不验证证书和hosts
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        }
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }
}