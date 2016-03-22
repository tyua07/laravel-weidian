<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | PayInterface.php: 支付接口
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay;

interface PayInterface
{
    /**
     * 创建支付
     *
     * @param $order_sn 订单编号
     * @param $price    订单价格
     * @param $params   其他参数
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function createPay($order_sn, $price, $params);

    /**
     * 验证同步支付是否合法
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyReturn();

    /**
     * 验证异步支付是否合法
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function verifyNotify();
}