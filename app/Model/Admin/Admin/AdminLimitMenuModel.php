<?php

// +----------------------------------------------------------------------
// | date: 2015-09-25
// +----------------------------------------------------------------------
// | AdminLimitMenuModel.php: 后台角色与菜单关联模型
// +----------------------------------------------------------------------
// | Author: zhuweijian <zhuweijain@louxia100.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

use App\Library\Cache;

class AdminLimitMenuModel extends BaseModel
{

    protected $table    = 'admin_limit_menu';//定义表名

    /**
     * 获得全部用户分类
     *
     * @param $limit_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getUserRelationMenu($limit_id)
    {
        return objToArray(self::where('limit_id', '=', $limit_id)->lists('menu_id'));
    }

    /**
     * 更新用户当前权限
     *
     * @param array $access_array
     * @param null $limit_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateUserLimitMenu(Array $access_array = null, $limit_id = null)
    {
        //删除角色当前全部菜单分类
        self::deleteLimitMenu($limit_id);

        if (!empty($access_array)) {

            $limit_id = AdminInfoModel::getAdminLimit($limit_id);

            foreach ($access_array as $access) {
                if($access <= 0 ) continue;
                $data[] = ['limit_id' => $limit_id, 'menu_id' => $access,];
            }
            self::insert($data);
        }
        //删除缓存
        Cache::clearAll();
        return true;
    }

    /**
     * 删除角色当前全部菜单分类
     *
     * @param null $user_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function deleteLimitMenu($limit_id = null)
    {
        return self::where('limit_id', '=', AdminInfoModel::getAdminLimit($limit_id))->delete();
    }

    /**
     * 获得当前角色 全部后台菜单id
     *
     * @param null $limit_id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAdminAllMenuId($limit_id = null)
    {
        $limit_id = $limit_id == null ? AdminInfoModel::getAdminLimit() : $limit_id;

        return self::multiwhere(['limit_id' => $limit_id])->lists('menu_id');
    }

}
