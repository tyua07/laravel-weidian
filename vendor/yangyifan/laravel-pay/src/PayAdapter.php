<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | PayAdapter.php: 支付适配器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay;

use Yangyifan\Pay\PayInterface;

class PayAdapter implements PayInterface
{

    /**
     * 支付方式
     *
     * @var string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected $driver;

    /**
     * 构造方法
     *
     * @param $driver 支付方式
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(PayInterface $driver)
    {
        //设置支付方式
        $this->driver = $driver;
    }

    /**
     * 发起支付
     *
     * @param $order_sn 订单编号
     * @param $price    支付金额
     * @param $params   全部参数
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function createPay($order_sn, $price, $params)
    {
        $this->driver->createPay($order_sn, $price, $params);
    }

    /**
     * 验证同步支付是否合法
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyReturn()
    {
        return $this->driver->verifyReturn();
    }

    /**
     * 验证异步支付是否合法
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyNotify()
    {
        return $this->driver->verifyNotify();
    }
}