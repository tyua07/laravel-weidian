<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | EximbayNotify.php: EximbayPay 支付
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Library;

use Yangyifan\Pay\Library\EximbayPay;

class EximbayNotify
{
    /**
     * HTTP形式消息验证地址
     */
    private $http_verify_url = 'https://www.eximbay.com/web/payment2.0/query_real.do';
    private $eximbay;

    const TYPE              =  'QUERY';//定义类型为查询
    const RES_CODE_SUCCESS  = '0000';//成功状态吗

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    function __construct()
    {
        $this->eximbay  = new EximbayPay();
    }

    /**
     * 针对notify_url验证消息是否是eximbay发出的合法消息
     *
     * @return 验证结果
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    function verifyNotify()
    {
        if ( empty($_POST) ){//判断POST来的数组是否为空
            return false;
        } else {
            return $this->getResponse($this->getSignVeryfy());
        }
    }

    /**
     * 针对return_url验证消息是否是eximbay发出的合法消息
     *
     * @return 验证结果
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    function verifyReturn()
    {
        if( empty($_GET) ) {//判断POST来的数组是否为空
            return false;
        }
        else {
            return $this->getResponse($this->getSignVeryfy());
        }
    }

    /**
     * 获取返回时的签名验证结果
     *
     * @return 签名验证结果
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getSignVeryfy()
    {
        return [
            'ver' 		=> $this->eximbay->config['ver'],
            'mid'		=> $this->eximbay->config['mid'],
            'txntype'	=> self::TYPE,
            'keyfield' 	=> $_POST['ref'],
            'ref' 		=> $_POST['ref'],
            'cur' 		=> $this->eximbay->config['cur'],
            'amt' 		=> (int)$_POST['amt'],
            'transid' 	=> $_POST['transid'],
            'lang' 		=> $this->eximbay->config['lang'],
            'charset' 	=> $this->eximbay->config['charset'],
            'fgkey'		=> $this->eximbay->sign($_POST['ref'], $_POST['amt']),
        ];
    }

    /**
     * 获取远程服务器ATN结果,验证返回URL
     *
     * @param $params 参数
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getResponse($params)
    {
        $responseTxt = $this->getHttpResponsePOST($this->http_verify_url, $params);

        $responseTxt = trim($responseTxt, "\r\n");
        //解析阐述
        parse_str($responseTxt);

        if ($rescode = self::RES_CODE_SUCCESS && $status == EximbayPay::TYPE && $mid == $this->eximbay->config['mid'] ) {
            return true;
        }
        return false;
    }

    /**
     * 远程获取数据，get 模式
     *
     * @param $url 指定URL完整路径地址
     * @param $para 请求的数据
     * return 远程输出的数据
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getHttpResponsePOST($url, $params)
    {
        $curl = curl_init($url . '?' . http_build_query($params));
        curl_setopt($curl, CURLOPT_HEADER, 0 ); // 过滤HTTP头
        curl_setopt($curl,CURLOPT_RETURNTRANSFER, 1);// 显示输出结果
        $responseText = curl_exec($curl);
        curl_close($curl);

        return $responseText;
    }
}