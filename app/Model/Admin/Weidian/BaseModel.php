<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | BaseModel.php: 微店公共模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class BaseModel extends \App\Model\Admin\BaseModel
{

    public $timestamps = true;//开启维护时间戳

    protected $guarded  = ['id'];//阻挡所有属性被批量赋值

    /**
     * 是否需要同步
     *
     * @param $is_sync
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function mergeStatus($is_sync)
    {
        return $is_sync == 1 ? true : false;
    }
}

