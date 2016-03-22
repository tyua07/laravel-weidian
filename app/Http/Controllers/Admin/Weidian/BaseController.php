<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | BaseController.php: 微店基础控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Weidian;

use Cache;
use Carbon\Carbon;
use InvalidArgumentException;

class BaseController extends \App\Http\Controllers\Admin\BaseController
{

    /**
     * url相关
     */
    const GET_TOKEN_URL         = 'https://api.vdian.com/token?';//获得token url
    const GET_API_URL           = 'http://api.vdian.com/api?';//获得商品分类url
    const GET_UPLOAD_IMAGE_URL  = 'http://api.vdian.com/media/upload?';//获得上传商品图片url

    /**
     * 请求参数相关
     */
    const VERSION           = '1.0';//版本号

    /**
     * 响应code相关
     */
    const WEIDIAN_SUCCESS_CODE  = 0;//成功响应

    /**
     * 配置信息
     *
     * @var array
     */
    protected $config;

    /**
     * token
     *
     * @var string
     */
    protected $token;

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        //获得配置信息
        $this->config   = $this->getConfig();
        //获得token
        $this->token    = $this->getToken();
    }

    /**
     * 获得token信息
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getToken()
    {
        if (Cache::has($this->config['token_cache_name'])) {
            return Cache::get($this->config['token_cache_name']);
        }

        $url = self::GET_TOKEN_URL . http_build_query([
           'grant_type' => $this->config['grant_type'],
            'appkey'    => $this->config['appkey'],
            'secret'    => $this->config['secret'],
        ]);

        $result = json_decode(curlGet($url), true);

        if ($result['status']['status_code'] == 0) {
            Cache::put($this->config['token_cache_name'], $result['result']['access_token'], Carbon::now()->addSeconds($result['result']['expire_in']));
            return $result['result']['access_token'];
        }
        throw new InvalidArgumentException("获得token失败");
    }

    /**
     * 获得配置信息
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getConfig()
    {
        return config('oauth.weidian');
    }

    /**
     * 发送请求
     *
     * @param $url          请求url
     * @param array $params 请求参数
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function send($url, $params = [])
    {
        if (!empty($url) && is_array($params) && count($params)) {
            $params += [
                'version'       => self::VERSION,
                'format'        => 'json',
                'access_token'  => $this->getToken(),
            ];
            return $this->parseResponse(curlPost($url, http_build_query($params)));
        }
        throw new InvalidArgumentException('参数错误');
    }

    /**
     * 发送商品更新请求
     *
     * @param $url          请求url
     * @param array $params 请求参数
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function sendUpdate($url, $params = [])
    {
        if (!empty($url) && is_array($params) && count($params)) {
            return $this->parseResponse(curlPost($url, http_build_query([
                'param'     => $params['param'],
                'public'    => json_encode([
                    'method'        => $params['public'],
                    'access_token'  => $this->getToken(),
                    'version'       => self::VERSION,
                    'format'        => 'json',
                ]),
            ])));
        }
        throw new InvalidArgumentException('参数错误');
    }

    /**
     * 解析发送响应
     *
     * @param $response 微店响应json数据
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function parseResponse($response)
    {
        $response = json_decode($response, true);

        if ($response['status_code'] == 0 ) {
            return $response['result'];
        }
        return false;
    }
}
