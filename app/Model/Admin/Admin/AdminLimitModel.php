<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminLimitModel.php: 后台角色模型
// +----------------------------------------------------------------------
// | @author yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class AdminLimitModel extends BaseModel
{

    protected $table    = 'admin_limit';//定义表名

    private static $all_limit = null;//全部角色

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

        return [
            'data' =>   self::mergeData(
                self::multiwhere($map)->
                orderBy($sort, $order)->
                skip($offset)->
                take($limit)->
                get()
            ),
            'count' =>  self::multiwhere($map)->count(),
        ];
    }


    /**
     * 组合数据
     *
     * @param $data
     * @return mixed
     * @@author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeData($data)
    {
        if (!empty($data)) {
            foreach ($data as &$v) {
                //组合操作
                $v->handle      = '<a href="'.createUrl('Admin\Admin\AdminFunctionController@getLimitFunc',['limit_id' => $v->id]).'"  >配置权限</a>';
                $v->handle      .= '<span>|</span>';
                $v->handle      .= '<a href="'.createUrl('Admin\Admin\AdminMenuController@getLimitMenu',['limit_id' => $v->id]).'"  >配置菜单</a>';
                $v->handle      .= '<span>|</span>';
                $v->handle      .= '<a href="'.createUrl('Admin\Admin\AdminInfoController@getIndex',['id' => $v->id]).'" >查看成员</a>';
                $v->handle      .= '<span>|</span>';
                $v->handle      .= '<a href="'.createUrl('Admin\Admin\AdminLimitController@getEdit',['id' => $v->id]).'"  >修改</a>';
            }
        }
        return $data;
    }

    /**
     * 获得全部角色
     *
     * @return \Illuminate\Database\Eloquent\Collection|null|static[]
     * @@author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllLimit()
    {
        if (is_null(self::$all_limit)) {
            self::$all_limit = self::all();
        }
        return self::$all_limit;
    }

}

