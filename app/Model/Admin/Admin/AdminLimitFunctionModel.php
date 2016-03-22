<?php

// +----------------------------------------------------------------------
// | date: 2015-09-25
// +----------------------------------------------------------------------
// | AdminLimitFunctionModel.php: 后台角色与菜单关联模型
// +----------------------------------------------------------------------
// | Author: zhuweijian <zhuweijain@louxia100.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class AdminLimitFunctionModel extends BaseModel
{

    protected $table    = 'admin_limit_function';//定义表名

    /**
     * 获得全部用户函数
     *
     * @param $limit_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getUserRelationFunnction($limit_id = null)
    {
        $limit_id = $limit_id == null ? AdminInfoModel::getAdminLimit() : $limit_id;

        return self::multiwhere(['limit_id' => $limit_id])->lists('function_id');
    }

    /**
     * 更新用户当前权限
     *
     * @param array $function_array
     * @param null $limit_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateUserLimitMenu(Array $function_array = null, $limit_id = null)
    {
        //删除角色当前全部菜单分类
        self::deleteLimitFunction($limit_id);

        if (!empty($function_array)) {

            $limit_id = AdminInfoModel::getAdminLimit($limit_id);

            foreach ($function_array as $function) {
                if($function <= 0 ) continue;
                $data[] = ['limit_id' => $limit_id, 'function_id' => $function,];
            }
            self::insert($data);
        }
        return true;
    }

    /**
     * 删除角色当前全部函数
     *
     * @param null $user_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function deleteLimitFunction($limit_id = null)
    {
        return self::multiwhere(['limit_id' => AdminInfoModel::getAdminLimit($limit_id) ])->delete();
    }

    /**
     * 获得当前角色函数列表
     *
     * @param null $limit_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getUserFunction($limit_id = null)
    {
        $limit_id = $limit_id == null ? AdminInfoModel::getAdminLimit() : $limit_id;

        return  self::multiwhere(['limit_id' => $limit_id])->
                join(tableName('admin_function') . ' AS f', tableName('admin_limit_function') .'.function_id', '=', 'f.id')->
                lists('function_name');
    }



}
