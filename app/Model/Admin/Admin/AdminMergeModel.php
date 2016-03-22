<?php

// +----------------------------------------------------------------------
// | date: 2015-10-06
// +----------------------------------------------------------------------
// | HotelMergeModel.php: 酒店组合信息模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class AdminMergeModel extends \App\Model\Admin\MergeModel
{
    /**
     * 操作人员列表
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function adminLogAdminName()
    {
        $data   = [];
        $roles  = AdminInfoModel::multiwhere(['state'=>1])->lists('admin_name','id') ;

        if (!empty($roles)) {
            foreach ($roles as $k =>$v) {
                $data[] = [
                    'id'    => $k,
                    'name'  => $v,
                ];
            }
        }
        return $data;
    }
}
