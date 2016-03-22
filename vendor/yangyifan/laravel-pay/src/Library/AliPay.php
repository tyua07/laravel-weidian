<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | AliPay.php: 支付宝支付
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Library;

use Yangyifan\Pay\PayInterface;

class AliPay implements PayInterface
{
    /**
     * 配置信息
     *
     * @var array
     */
    private $config;

    /**
     * 构造方法
     *
     * param array $config 支付配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * 创建并发起支付宝支付
     *
     * @param $order_sn 订单编号
     * @param $total_price 订单支付总金额
     * @param $params 全部参数
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function createPay($order_sn, $price, $params)
    {
        //发起支付
        $this->initiatePayment(
            $this->mergePayParams($order_sn, $price, $params['subject'], isset($params['body']) ? $params['body'] : "")
        );
    }

    /**
     * 组合支付参数
     *
     * @param $body
     * @param $total_price
     * @param $order_sn
     * @param $subject
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function mergePayParams($order_sn, $price, $subject, $body)
    {
        //组合参数
        $param = [
            '_input_charset'    => $this->config['input_charset'],
            'currency'          => $this->config['currency'],
            'partner'           => $this->config['partner'],
            'service'           => $this->config['service'],
            'sign_type'         => $this->config['sign_type'],
            'body'              => empty($body) ? "" : $body,
            'out_trade_no'      => $order_sn,
            'rmb_fee'           => $price,
            'subject'           => $subject,

        ];

        if(!empty($this->config['notify_url'])){
            $param['notify_url'] = $this->config['notify_url'];
        }
        if(!empty($this->config['return_url'])) {
            $param['return_url'] = $this->config['return_url'];
        }
        return $param;
    }

    /**
     * 发起支付
     *
     * @param $param
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function initiatePayment($param)
    {
        echo ( new AlipaySubmit($this->config) )->buildRequestForm($param, "get", "确认");
    }

    /**
     * 验证支付宝同步支付是否合法
     *
     * @return 验证结果
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyReturn()
    {
        return ( new AlipayNotify($this->config) )->verifyReturn();
    }

    /**
     * 验证支付宝异步支付是否合法
     *
     * @return 验证结果
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyNotify()
    {
        return ( new AlipayNotify($this->config) )->verifyNotify();
    }

}