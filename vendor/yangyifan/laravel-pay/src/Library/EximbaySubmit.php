<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | EximbaySubmit.php: EximbayPay 支付
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Library;

class EximbaySubmit
{
    private $config;

    private $geteway_new = "https://www.eximbay.com/web/payment2.0/payment_real.do";

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * 构造请求表单
     *
     * @param $param 请求参数
     * @param $method 表单提交方式
     * @param $button_name 按钮名称
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildRequestForm($param, $method, $button_name)
    {
        $sHtml = "<form id='alipaysubmit' name='EximbayPaySubmit' action='".$this->geteway_new."' method='".$method."'>";
        while (list ($key, $val) = each ($param)) {
            $sHtml.= "<input type='hidden' name='".$key."' value='".$val."'/>";
        }

        //submit按钮控件请不要含有name属性
        $sHtml = $sHtml."<input type='submit' value='".$button_name."'></form>";

        $sHtml = $sHtml."<script>document.forms['EximbayPaySubmit'].submit();</script>";

        return $sHtml;
    }
}