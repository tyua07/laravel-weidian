### 使用

* 在 ``` composer.json ``` 加入 ``` "yangyifan/laravel-oauth" : "dev-master" ```
* 执行 ``` php composer update -vvv yangyifan/laravel-oauth ``` 注意 ```php``` 必须定位到您本机安装的php目录下面的bin目录下面的php路径
* 在 ``` config/app.php ``` 加入 ``` 'Yangyifan\OAuth\OAuthServiceProvider' ```
* 在 ``` config\app.php ``` 加入 ``` 'OAuth'       => Yangyifan\OAuth\Facades\OAuth::class ```
* 在 ``` config\oauth.php ``` 文件自定义自己的参数


### 支持

* 微博
* qq
* .. 其他的还在继续申请中,如果有需要我支持的,我免费完成您的需求,欢迎联系我,email:yangyifanphp@gmail.com

### Laravel 要求
* ``` >= 5.0 ``` 

### 示例

* 初始化

```

    /**
     * oauth 对象
     *
     * @var AbstractAdapter
     */
    private $oauth;
    
    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        $this->oauth = OAuth::drive('weibo');
    }

    
```

* 发起 登录

```
    /**
     * 发起登录
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        $this->oauth->login();
    }


```

* 回调地址

```
        /**
         * 回调地址
         *
         * @param Request $request
         */
        public function getCallback(Request $request)
        {
            //获得 access_token 信息
            $access_token_info = $this->oauth->getAccessToken($request->get('code'));
    
            //获得用户信息
            $user_info = $this->oauth->getUserInfo($access_token_info['access_token'], $access_token_info['uid']);
            dd($user_info);
        }


```


### 实例的response

```

array:50 [▼
  "id" => xxx
  "idstr" => "xxx"
  "class" => 1
  "screen_name" => "杨__xiansen"
  "name" => "杨__xiansen"
  "province" => "43"
  "city" => "12"
  "location" => "湖南 怀化"
  "description" => "人生就像打印机，有人是黑白的，有人是彩色的。跑道长度永远是公平的，而领奖台的高度永远是不公平的。"
  "url" => ""
  "profile_image_url" => "http://tp3.sinaimg.cn/2973763650/50/5745914563/1"
  "cover_image_phone" => "http://ww2.sinaimg.cn/crop.0.0.640.640.640/a1d3feabjw1ecasunmkncj20hs0hsq4j.jpg"
  "profile_url" => "womenshuo"
  "domain" => "womenshuo"
  "weihao" => ""
  "gender" => "m"
  "followers_count" => 404
  "friends_count" => 379
  "pagefriends_count" => 1
  "statuses_count" => 1501
  "favourites_count" => 278
  "created_at" => "Tue Aug 28 13:10:38 +0800 2012"
  "following" => false
  "allow_all_act_msg" => false
  "geo_enabled" => true
  "verified" => false
  "verified_type" => -1
  "remark" => ""
  "status" => array:30 [▶]
  "ptype" => 0
  "allow_all_comment" => true
  "avatar_large" => "http://tp3.sinaimg.cn/2973763650/180/5745914563/1"
  "avatar_hd" => "http://tva4.sinaimg.cn/crop.0.0.960.960.1024/b1400842jw8ezaulfow8lj20qo0zk77a.jpg"
  "verified_reason" => ""
  "verified_trade" => ""
  "verified_reason_url" => ""
  "verified_source" => ""
  "verified_source_url" => ""
  "follow_me" => false
  "online_status" => 0
  "bi_followers_count" => 25
  "lang" => "zh-cn"
  "star" => 0
  "mbtype" => 0
  "mbrank" => 0
  "block_word" => 0
  "block_app" => 0
  "credit_score" => 80
  "user_ability" => 0
  "urank" => 14
]

```

### 配置信息

```

    return [
    
        //qq的信息
        'qq' => [
            'drive'         => 'qq',//登录方式
            'app_id'        => '',//app_key
            'app_key'       => '',//app_key
            'callback'      => '',//回调地址
            'scope'         => 'get_user_info,do_like',//请求用户授权时向用户显示的可进行授权的列表。
            'response_type' => 'code',//授权类型，此值固定为“code”。
            'grant_type'    => 'authorization_code',
        ],
    
        'weibo' => [
            'drive'         => 'weibo',//登录方式
            'app_key'       => '',
            'app_secret'    => '',
            'callback'      => '',
            'grant_type'    => 'authorization_code',
    
        ],
    
        'default'   => 'qq',//默认OAuth方式
    ];

```



#### Lincense 

MIT
