<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>支付宝支付宝境外商户交易创建接口接口</title>
</head>
<?php
/* *
 * 功能：支付宝境外商户交易创建接口接入页
 * 版本：3.3
 * 修改日期：2012-07-23
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。

 *************************注意*************************
 * 如果您在接口集成过程中遇到问题，可以按照下面的途径来解决
 * 1、商户服务中心（https://b.alipay.com/support/helperApply.htm?action=consultationApply），提交申请集成协助，我们会有专业的技术工程师主动联系您协助解决
 * 2、商户帮助中心（http://help.alipay.com/support/232511-16307/0-16307.htm?sh=Y&info_type=9）
 * 3、支付宝论坛（http://club.alipay.com/read-htm-tid-8681712.html）
 * 如果不想使用扩展功能请把扩展功能参数赋空值。
 */

require_once("alipay.config.php");
require_once("lib/alipay_submit.class.php");

/**************************请求参数**************************/

        //Return URL
        $return_url = "http://商户网关地址/create_forex_trade-PHP-UTF-8/return_url.php";
        //After the payment transaction is done
        //Notification URL
        $notify_url = "http://商户网关地址/create_forex_trade-PHP-UTF-8/notify_url.php";
        //The URL for receiving notifications after the payment process.
        //Goods name
        $subject = $_POST['WIDsubject'];
        //required，The name of the goods.
        //Goods description
        $body = $_POST['WIDbody'];
        //A detailed description of the goods.
        //Outside trade ID
        $out_trade_no = $_POST['WIDout_trade_no'];
        //required，A numbered transaction ID （Unique inside the partner system）
        //Currency
        $currency = $_POST['WIDcurrency'];
        //required，The settlement currency merchant named in contract.
        //Payment sum
        $total_fee = $_POST['WIDtotal_fee'];
        //required，A floating number ranging 0.01～1000000.00


/************************************************************/

//构造要请求的参数数组，无需改动
$parameter = array(
		"service" => "create_forex_trade",
		"partner" => trim($alipay_config['partner']),
		"return_url"	=> $return_url,
		"notify_url"	=> $notify_url,
		"subject"	=> $subject,
		"body"	=> $body,
		"out_trade_no"	=> $out_trade_no,
		"currency"	=> $currency,
		"total_fee"	=> $total_fee,
		"_input_charset"	=> trim(strtolower($alipay_config['input_charset']))
);

//建立请求
$alipaySubmit = new AlipaySubmit($alipay_config);
$html_text = $alipaySubmit->buildRequestForm($parameter,"get", "确认");
echo $html_text;

?>
</body>
</html>