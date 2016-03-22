<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | AdminInfoModel.php: 后端用户模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

use Session;
use DB;
use App\Model\Admin\MergeModel;
use App\Events\Admin\Login\LoginEvent;

class AdminInfoModel extends BaseModel
{
    protected $table    = 'admin_info';//定义表名

    /**
     * 判断是否登录状态
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function hasLoginStatus()
    {
        if(isAdminLogin() > 0 ) return true;
        return false;
    }

    /**
     * 用户登录
     *
     * @param $params array 用户登录名和密码参数
     * @return int
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function login($params)
    {
        $admin_info_table_name  = tableName('admin_info');//admin_info表名
        $admin_limit_table_name = tableName('admin_limit');//admin_limit表名

        //查找用户
        $user_info =    self::multiwhere([$admin_info_table_name . '.admin_name' => $params['admin_name']])->
                        select([$admin_info_table_name . '.*', 'al.limit_name'])->
                        leftJoin($admin_limit_table_name . ' AS al', $admin_info_table_name . '.limit_id', '=', 'al.id')->
                        first();

        //判断改用户是否存在
        if(empty($user_info)){
            return self::ACCOUNT_NOT_EXISTS;
        }
        //判断改用户是否被禁用
        if($user_info->state != 1){
            return self::ACCOUNT_ERROR;
        }
        //判断密码是否正确
        if (self::checkPassword($params['password'], $user_info) == false) {
            return self::ACCOUNT_PASSWORD_ERRPR;
        }
        //保存用户session信息
        $user_info->ip = $params['ip'];
        //触发事件
        self::triggerEvent($user_info);
        //保存用户session信息
        self::saveUserSession($user_info);
        return self::LOGIN_SUCCESS;
    }

    /**
     * 触发事件
     *
     * @param $user_info
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function triggerEvent($user_info)
    {
        //触发登陆事件
        event( new LoginEvent($user_info));
    }

    /**
     * 判断密码是否正确
     *
     * @param $password
     * @param $user_info
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function checkPassword($password, $user_info)
    {
        if (empty($password) || empty($user_info)) {
            return false;
        }

        if (strlen($user_info->password) == 32) {
            //如果md5验证成功，则把当前密码修改成password_hash方式
            if (md5($password) === $user_info->password) {
                return self::multiwhere(['id' => $user_info->id])->update(['password'  => bcrypt($password),]);
            }
            return false;
        }

        return password_verify($password, $user_info->password);
    }

    /**
     * 登陆成功更新用户信息
     *
     * @param $admin_info
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateAdminInfo($admin_info)
    {
        self::multiwhere(['id' => $admin_info->id])->update([
            'last_login' => date('Y-m-d H:i:s'),
        ]);
    }

   /**
     * 写入用户信息到SESSION
     *
     * @param $user_info
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function saveUserSession($user_info)
    {
        $user_info = objToArray($user_info);
        $user_info['admin_user_data'] = [
            'id'            => $user_info['id'],
            'admin_name'    => $user_info['admin_name'],
            'last_login'    => $user_info['last_login'],
            'ip'            => $user_info['ip'],
        ];
        $user_info['sign'] = hashUserSign($user_info['admin_user_data']);

        //删除用户敏感信息
        unset($user_info['password']);

        Session::put(tableName('admin_info'), $user_info);
        Session::save();
    }

    /**
     * 用户退出
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function logout()
    {
        Session::forget(tableName('admin_info'));
        Session::save();
    }

    /**
     * 搜索
     *
     * @param $map
     * @param $sort
     * @param $order
     * @param $offset
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function search($map, $sort, $order, $limit, $offset)
    {
        $admin_info_table_name  = tableName('admin_info');//admin_info表名
        $admin_limit_table_name = tableName('admin_limit');//admin_limit表名

        return [
            'data' => self::mergeData(
                self::multiwhere($map)->
                select($admin_info_table_name . '.id', $admin_info_table_name . '.admin_name', $admin_info_table_name .'.state',$admin_info_table_name .'.last_login',$admin_info_table_name . '.create_date',$admin_info_table_name .'.mobile','l.limit_name',$admin_info_table_name .'.limit_id')->
                join($admin_limit_table_name . ' as l', $admin_info_table_name . '.limit_id', '=', 'l.id')->
                orderBy($sort, $order)->
                skip($offset)->
                take($limit)->
                get()
            ),
            'count' => self::multiwhere($map)->
                       join($admin_limit_table_name . ' as l', $admin_info_table_name . '.limit_id', '=', 'l.id')->
                       count(),
        ];
    }

    /**
     * 组合数据
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeData($data)
    {
        if (!empty($data)) {
            foreach($data as &$v){
                //组合 col class名称
                $v->class_name   = self::mergeClassName($v->state);
                //组合状态
                $v->state_name   = MergeModel::mergeStatus($v->state);

                //组合操作
                $v->handle       = '<a href="'.createUrl('Admin\Admin\AdminInfoController@getEdit',['id' => $v->id]).'" >修改</a>';

            }
        }
        return $data;
    }

    /**
     * 用户权限列表
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */

    public static function adminInfoLimitName()
    {
        $map    = [];
        $roles  = AdminLimitModel::multiwhere($map)->lists('limit_name','id') ;

        if (!empty($roles)) {
            $data = [];
            foreach ($roles as $k =>$v) {
                $data[] = [
                    'id'    => $k,
                    'name'  => $v,
                ];
            }
        }

        return $data;
    }

    /**
     * 获得后台用户信息
     *
     * @param $admin_id
     * @return bool|\Illuminate\Support\Collection|null|static
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAdminInfo($admin_id = null)
    {
        $admin_id <= 0 && $admin_id = isAdminLogin();

        return self::find($admin_id);
    }

    /**
     * 获得当前用户角色id
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAdminLimit($limit_id = null)
    {
        $admin_info_table_name  = tableName('admin_info');//admin_info表名

        return hashUserSign(Session::get($admin_info_table_name .'.admin_user_data')) == Session::get($admin_info_table_name .'.sign') ? Session::get($admin_info_table_name .'.limit_id') : '';
    }

    /**
     * 获得当前用户名称
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAdminName($admin_id = null)
    {
        if (!is_null($admin_id)) return self::getAdminNameForId($admin_id);

        $admin_info_table_name  = tableName('admin_info');//admin_info表名

        return hashUserSign(Session::get($admin_info_table_name .'.admin_user_data')) == Session::get($admin_info_table_name . '.sign') ? Session::get($admin_info_table_name .'.admin_name') : '';
    }

    /**
     * 获得用户信息 for session
     *
     * @param null $admin_id
     * @return array
     */
    public static function getAdminInfoForSession()
    {
        $admin_info_table_name  = tableName('admin_info');//admin_info表名

        return hashUserSign(Session::get($admin_info_table_name .'.admin_user_data')) == Session::get($admin_info_table_name .'.sign') ? arrayToObj(Session::get($admin_info_table_name)) : [];
    }

    /**
     * 获得管理员名称
     *
     * @param $admin_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getAdminNameForId($admin_id)
    {

        if ($admin_id > 0 ) {
            return self::multiwhere( ['id' => $admin_id] )->pluck('admin_name');
        }
        return '';
    }
}
