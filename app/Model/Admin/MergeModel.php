<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | MergeModel.php: 组合数据模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin;

class MergeModel extends BaseModel
{
    protected   static $bed_type    = null;//床类型
    protected   static $all_state   = null;//状态

    /**
     * 获得全部状态
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllStatus()
    {
        if (empty(self::$all_state)) {
            self::$all_state = [
                1 => trans('response.on'),
                2 => trans('response.off'),
            ];
        }
        return self::$all_state;
    }

    /**
     * 组合当前状态
     *
     * @param $status
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeStatus($status)
    {
        if (empty($status)) {
            return false;
        }
        //获取全部状态
        $all_status = static::getAllStatus();

        if (array_key_exists($status, $all_status)) {
            return $all_status[$status];
        }
    }

    /**
     * 组合状态(select)
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeStatusForSelect()
    {
        //获取全部状态
        $all_status         = static::getAllStatus();
        $data               = [];

        if (!empty($all_status)) {
            foreach ($all_status as $key => $status) {
                $data[] = [
                    'id'    => $key,
                    'name'  => $status,
                ];
            }
        }
        return $data;
    }
}

