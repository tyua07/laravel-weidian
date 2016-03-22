<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | Pay.php: 支付
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay;

use Yangyifan\Pay\Library\AliPay;
use Yangyifan\Pay\Library\EximbayPay;
use InvalidArgumentException;
use Closure;

class PayManager
{
    /**
     * 支付方式
     *
     * @var array
     */
    protected $drive = [];

    /**
     * app 实例
     *
     * @var object
     */
    protected $app;

    /**
     * 自定义扩展支付对象
     *
     * @var array
     */
    protected $customCreator = [];

    /**
     * 构造方法
     *
     * @param $app app实例
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($app)
    {
        $this->app = $app;
    }

    /**
     * 支付方式
     *
     * @param null $name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function drive($name = null)
    {
        return $this->pay($name);
    }

    /**
     * 获得支付对象
     *
     * @param null $name
     * @return object
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function pay($name = null)
    {
        //支付方式
        $name = $name ?: $this->getDefaultName();

        return $this->drive[$name] = $this->get($name);
    }

    /**
     * 获得当前支付对象
     *
     * @return object
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function get($name = null)
    {
        return isset($this->drive[$name]) ? $this->drive[$name] : $this->resolve($name);
    }

    /**
     * 设置支付对象
     *
     * @param $name
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function resolve($name)
    {
        //获得配置信息
        $config = $this->getConfig($name);

        if ( isset($this->customCreator[$name]) ) {
            return $this->callCustomCreator($config);
        }

        $driver = "create" . ucfirst(strtolower($name)) . "Driver";

        if ( method_exists($this, $driver)) {
            return $this->$driver($config);
        } else {
            throw new InvalidArgumentException(" [{$driver}] 支付方式不存在.");
        }
    }

    /**
     * 使用自定义扩展支付
     *
     * @param $config
     * @return PayAdapter
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function callCustomCreator($config)
    {
        $drive = $this->customCreator[$config['drive']]($this->app, $config);

        if ( $drive instanceof PayInterface ) {
            return $this->adapt($drive);
        }
        return $drive;
    }

    /**
     * 实现支付适配器
     *
     * @param PayInterface $pay
     * @return PayAdapter
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function adapt(PayInterface $pay)
    {
        return new PayAdapter($pay);
    }

    /**
     * 创建支付宝支付
     *
     * @param array $config 支付配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function createAlipayDriver($config)
    {
        //格式化支付信息
        $alipay_config = $this->formatAlipayConfig($config);

        return $this->adapt(
            new AliPay($alipay_config)
        );
    }

    /**
     * 格式化支付支付信息
     *
     * @param $config
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function formatAlipayConfig($config)
    {
        if (!empty($config) && empty($config['cacert'])) {
            $config['cacert'] = dirname(__DIR__) . '/alipay/cacert.pem';
        }
        return $config;
    }

    /**
     * 创建Eximbay支付
     *
     * @param array $config 支付配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function createEximbayDriver($config)
    {
        return $this->adapt(
            new EximbayPay($config)
        );
    }

    /**
     * 获得支付配置信息
     *
     * @param $name
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getConfig($name)
    {
        $name = strtolower($name);

        return $this->app['config']["pay.{$name}"];
    }

    /**
     * 获得默认支付方式
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getDefaultName()
    {
        return $this->app['config']['pay.default'];
    }

    /**
     * 自定义支付方式
     *
     * @param $drive
     * @param Closure $callback
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function extend($drive, Closure $callback)
    {
        $this->customCreator[$drive] = $callback;
        return $this;
    }

    /**
     * __call 魔术方法
     *
     * @param $name
     * @param $arguments
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __call($name, $arguments)
    {
        return call_user_func_array([$this->pay(), $name], $arguments);
    }
}