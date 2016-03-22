<?php

return [

    //支付宝合作信息
    'alipay' => [
        'drive'         => 'alipay',//支付方式
        'partner'       => '',//合作身份者id，以2088开头的16位纯数字
        'key'           => '',
        'sign_type'     => 'md5',//签名方式
        'input_charset' => 'utf-8',//字符编码格式 目前支持 gbk 或 utf-8
        'transport'     => 'http',//访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
        'cacert'        => '',//ca证书路径地址，用于curl中ssl校验
        'service'       => 'create_forex_trade',//服务
        'currency'      => 'USD',//货币
        'notify_url'    => '',//服务器异步通知页面路径
        'return_url'    => '',//页面跳转同步通知页面路径
    ],

    // eximbay 支付信息
    'eximbay' => [
        'drive'         => 'eximbay',//支付方式
        'secretKey'     => '',
        'mid'           => '',
        'cur'           => '',//货币
        'product_name'  => '',//项目名称
        'lang'          => 'CN',//语言
        'charset'       => 'UTF-8',//字符集
        'ver'           => '',//版本
        'shop'          => '',
        'type'          => '',//类型为销售
        'returnurl'     => "",//服务器异步通知页面路径
        'statusurl'     => '',//页面跳转同步通知页面路径
    ],

    'default'   => 'alipay',//默认支付方式
];