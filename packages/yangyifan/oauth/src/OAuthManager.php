<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | Pay.php: oauth
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\OAuth;

use Yangyifan\OAuth\OAuth\QQAdapter;
use InvalidArgumentException;
use Closure;
use Yangyifan\OAuth\Oauth\WeiboAdapter;

class OAuthManager
{
    /**
     * oauth方式
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
     * 自定义扩展oauth对象
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
     * oauth方式
     *
     * @param null $name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function drive($name = null)
    {
        return $this->oauth($name);
    }

    /**
     * 获得oauth对象
     *
     * @param null $name
     * @return object
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function oauth($name = null)
    {
        //oauth方式
        $name = $name ?: $this->getDefaultName();

        return $this->drive[$name] = $this->get($name);
    }

    /**
     * 获得当前oauth对象
     *
     * @return object
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function get($name = null)
    {
        return isset($this->drive[$name]) ? $this->drive[$name] : $this->resolve($name);
    }

    /**
     * 设置oauth对象
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
            throw new InvalidArgumentException(" [{$driver}] oauth方式不存在.");
        }
    }

    /**
     * 使用自定义扩展oauth
     *
     * @param $config
     * @return OAuthAdapter
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function callCustomCreator($config)
    {
        $drive = $this->customCreator[$config['drive']]($this->app, $config);

        if ( $drive instanceof OAuthInterface ) {
            return $this->adapt($drive);
        }
        return $drive;
    }

    /**
     * 实现oauth适配器
     *
     * @param OAuthInterface $pay
     * @return OAuthAdapter
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function adapt(OAuthInterface $pay)
    {
        return new OAuthAdapter($pay);
    }

    /**
     * 创建QQ OAuth
     *
     * @param array $config oauth配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function createQqDriver($config)
    {
        return $this->adapt(
            new QQAdapter($config)
        );
    }

    /**
     * 创建Weibo OAuth
     *
     * @param array $config oauth配置信息
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function createWeiboDriver($config)
    {
        return $this->adapt(
            new WeiboAdapter($config)
        );
    }

    /**
     * 获得oauth配置信息
     *
     * @param $name
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getConfig($name)
    {
        $name = strtolower($name);

        return $this->app['config']["oauth.{$name}"];
    }

    /**
     * 获得默认oauth方式
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected function getDefaultName()
    {
        return $this->app['config']['oauth.default'];
    }

    /**
     * 自定义oauth方式
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
        return call_user_func_array([$this->oauth(), $name], $arguments);
    }
}