<?php

// +----------------------------------------------------------------------
// | date: 2015-09-15
// +----------------------------------------------------------------------
// | Jpush.php: 推送
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Library;

use JPush\Model as M;
use JPush\JPushClient;
use JPush\Exception\APIConnectionException;
use JPush\Exception\APIRequestException;

class Jpush
{
    private static $app_key;
    private static $master_secret;
    private static $client;//极光推送客户端
    private static $builder_id = 3;//通知栏样式ID
    private static $sound;//通知栏样式ID
    private static $badge = "+1";//应用角标
    private static $option;//推送选项


    /**
     * 获得当前实例对象
     *
     * @return JPushClient
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getJpushClient()
    {
        if(empty($client)){
            //实例化推送对象
            $app_key        = self::getAppKey();
            $master_secret  = self::getMasterSecret();

            self::$client = new JPushClient($app_key, $master_secret);
        }
        return self::$client;
    }

    /**
     * 设置 $app_key
     *
     * @param $app_key
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setAppKey($app_key = '')
    {
        self::$app_key = !empty($app_key) ?  $app_key : config('config.jpush.app_key');
    }

    /**
     * 获取 $app_key
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAppKey()
    {
        return !empty(self::$app_key) ? self::$app_key : config('config.jpush.app_key');
    }

    /**
     * 设置 $master_secret
     *
     * @param $master_secret
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setMasterSecret($master_secret = '')
    {
        self::$master_secret = !empty($master_secret) ?  $master_secret : config('config.jpush.master_secret');
    }

    /**
     * 获取 $master_secret
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getMasterSecret()
    {
        return !empty(self::$master_secret) ? self::$master_secret : config('config.jpush.master_secret');
    }

    /**
     * 设置 通知栏样式ID
     *
     * @param $builder_id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setBuilderId($builder_id = '')
    {
        !empty($builder_id) && self::$builder_id = $builder_id;
    }

    /**
     * 设置 通知提示声音
     *
     * @param $sound
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setSound($sound = '')
    {
        !empty($sound) && self::$sound = $sound;
    }

    /**
     * 设置 应用角标
     *
     * @param $badge
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setBadge($badge = '')
    {
        !empty($badge) && self::$badge = $badge;
    }

    /**
     * 设置推送选项
     *
     * @param array $option
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function setOption(Array $option = [])
    {
        !empty($option) && self::$option = $option;
    }

    /**
     * 获得推送选项
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getOption()
    {
        return empty(self::$option) ? ["apns_production" => config('config.jpush.apns_production')] : self::$option;
    }

    /**
     * 批量创建会员城市别名
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function createUserAlias()
    {
        //初始配置
        set_time_limit(0);
        @ini_set('memory_limit', '264M');

        $user_list =    [];

        if (!empty($user_list)) {
            foreach ($user_list as $user) {
                if (!empty($user->registration_id) && !empty($user->city_id)) {
                    $response = self::getJpushClient()->updateDeviceTagAlias($user->registration_id, $user->city_id);

                    if (self::response($response)) {
                        DB::table('message_push')->where('id', '=', $user->id)->update(['alias' => $user->city_id ]);
                    }
                }

            }
        }

    }

    /**
     * 批量获取会员当前设备的别名
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getUserAlias()
    {
        $user_list =    [];

        if (!empty($user_list)) {
            foreach ($user_list as $user) {
                var_dump(self::getJpushClient()->getDeviceTagAlias($user->registration_id));
            }
        }
    }

    /**
     * 获得注册id用户信息
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getUserInfo($registration_id)
    {

        if (empty($registration_id)) {
            return $registration_id;
        }

        $result     = self::getJpushClient()->getDeviceTagAlias($registration_id);
        $payload    = $result->body;

        $br = '<br>';
        echo '<b>getDeviceTagAlias</b>' . $br;
        echo '----Alias:' . $payload['alias'] . $br;
        echo '----Tags:' . json_encode($payload['tags']) . $br;
        echo $br;
    }

    /**
     * 推送信息
     *
     * @param $alert    推送内容
     * @param $type     推送类型
     * @param $platform 推送平台
     * @param $audience 推送设备
     * @return bool
     */
    public static function push($alert, $type, $arr_platform, $audience)
    {
        //设置 通知内容体
        $notification = [
            'android' => [
                'alert'         => $alert,
                'builder_id'    => self::$builder_id,
                'extras' => [
                    'type'      => $type,
                    'content'   => '',
                ],
            ],
            'ios'=> [
                'alert' => $alert,
                'sound' => self::$sound,
                'badge' => self::$badge,
                'extras' => [
                    'type'      => $type,
                    'content'   => '',
                ]
            ]
        ];

        //获得推送设置
        $option     =   self::getOption();

        $response   =   self::getJpushClient()->push()->
                        setPlatform($arr_platform)->
                        setAudience($audience)->
                        setOptions($option)->
                        setNotification($notification)->
                        send();

        return self::response($response);
    }

    /**
     * 响应
     *
     * @param $response
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function response($response)
    {
        if (!empty($response) && $response->isOk == 1) {
            return true;
        }
        return false;
    }


}