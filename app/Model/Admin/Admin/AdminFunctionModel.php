<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminFunctionModel.php: 后台函数模型
// +----------------------------------------------------------------------
// | Author: zhuweijian <zhuweijain@louxia100.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class AdminFunctionModel extends BaseModel
{

    protected $table    = 'admin_function';//定义表名

    /**
     * 获得全部后台函数分类
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAll()
    {
        return mergeTreeNode(objToArray(self::mergeData(self::all())));
    }

    /**
     * 组合数据
     *
     * @param $roles
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeData($data)
    {

        if (!empty($data)) {
            foreach($data as &$v){
                //组合操作
                $v->handle       = '<a href="'.createUrl('Admin\Admin\AdminFunctionController@getEdit',['id' => $v->id]).'" >修改</a>';
            }
        }
        return $data;
    }

    /**
     * 获得组合用户全部函数 [组合好]
     *
     * @param null $role_id
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getFullUserFunction($limit_id = null)
    {
        $limit_id           = AdminInfoModel::getAdminLimit($limit_id);
        $all_function       = self::all();
        $all_user_function  = AdminLimitFunctionModel::getUserRelationFunnction($limit_id);

        if (!empty($all_function)) {
            foreach ($all_function as &$function) {
                $function->checked = in_array($function->id, $all_user_function) ? true : false;
            }
        }
        //组合数据
        return arrayToObj(mergeTreeChildNode(objToArray($all_function), 0, 0, 'parent_id'));
    }



}
