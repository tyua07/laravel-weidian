<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsMergeModel.php: 微店组合数据模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class GoodsMergeModel extends \App\Model\Admin\MergeModel
{
    /**
     * 获得全部商品SKU状态
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllStatus()
    {
        if (empty(self::$all_state)) {
            self::$all_state = [
                1 => '开启',
                2 => '下架',
                3 => '删除'
            ];
        }
        return self::$all_state;
    }

}

