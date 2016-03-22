### 使用

* 在 ``` composer.json ``` 加入 ``` "yangyifan/laravel-pay" : "dev-master" ```
* 执行 ``` php composer update -vvv yangyifan/laravel-pay ``` 注意 ```php``` 必须定位到您本机安装的php目录下面的bin目录下面的php路径
* 更新完毕执行 ``` php artisan vendor:publish ``` 
* 在 ``` config/app.php ``` 加入 ``` 'Yangyifan\Pay\PayServiceProvider' ```
* 在 ``` config/app.php ``` 加入 ``` 'Pay'       => Yangyifan\Pay\Facades\Pay::class ```
* 在 ``` config/pay.php ``` 文件自定义自己的参数


### 支持

* 支付宝国际
* Eximbay

### Laravel 要求
* ``` >= 5.0 ``` 

### 使用支付

* 发起 支付宝 支付

```
use Pay;
use Yangyifan\Pay\Http\Requests\AliPayRequest;

/**
 * 发起支付宝支付
 *
 * @param Request $request
 */
public function alipay(AliPayRequest $request)
{
    $data = $request->all();
    //发起支付
    Pay::createPay($data['order_sn'], $data['price'], $data);
}
    
```

* 发起 Eximbay 支付

```
use Pay;
use Yangyifan\Pay\Http\Requests\EximbayPayRequest;

/**
 * 发起eximbay支付
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
public function EximbayPay(EximbayPayRequest $request)
{
    $data = $request->all();
    //发起支付
    Pay::drive('EximbayPay')->createPay($data['order_sn'], $data['price'], $data);
}

```

### 使用验证

* 支付宝 验证

```
#验证异步支付是否合法
Pay::verifyReturn();


#验证异步支付是否合法
Pay::verifyNotify()

```

* Exmibay 验证

```
#验证异步支付是否合法
Pay::drive('EximbayPay')->verifyReturn()

#验证异步支付是否合法
Pay::drive('EximbayPay')->verifyNotify()

```

### 配置信息

```

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

```


### 注意

* 发起请求的时候，需要查看 AliPayRequest or EximbayPayRequest 依赖哪些参数。


#### Lincense 

MIT
