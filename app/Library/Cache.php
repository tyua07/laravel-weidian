<?php

// +----------------------------------------------------------------------
// | date: 2015-12-09
// +----------------------------------------------------------------------
// | Cache.php: 缓存相关
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Library;

use \Carbon\Carbon;

class Cache
{

    private static $cache_expires = null;//缓存过期事件

    /**
     * 获得缓存过期时间
     *
     * @return null|static
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getCacheExpires()
    {
        if (is_null(self::$cache_expires)) {
            self::$cache_expires = Carbon::now()->addMinutes(10);
        }
        return self::$cache_expires;
    }

    /**
     * 清楚全部缓存
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function clearAll()
    {
        \Cache::flush();
    }

}