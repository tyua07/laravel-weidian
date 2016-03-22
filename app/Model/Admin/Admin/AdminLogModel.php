<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminLogModel.php: 后台日志模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class AdminLogModel extends BaseModel
{

    protected $table    = 'admin_log';//定义表名

    private static $log_type_arr;//日志类型

    const LOG_ERROR_0 = 0;//添加日志失败
    const LOG_ERROR_1 = -1;//操作员ID不能为空
    const LOG_ERROR_2 = -2;//操作员登录名不能为空
    const LOG_ERROR_3 = -3;//操作日志不能为空
    const LOG_ERROR_4 = -4;//日志类型不能为空
    const LOG_SUCCESS = 1;//添加日志成功

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
            'data' => self::mergeData(
                self::multiwhere($map)->
                orderBy($sort, $order)->
                skip($offset)->
                take($limit)->
                get()
            ),
            'count' => self::multiwhere($map)->count(),
        ];
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
        if(!empty($data)){
            foreach($data as &$v){
                //组合日志类型
                $v->log_type_name   = self::mergeLogType($v->log_type);
            }
        }
        return $data;
    }

    /**
     * 获得全部日志类型
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getAllLogType()
    {
        if(empty(self::$log_type_arr)){
            self::$log_type_arr = [
                1   => trans('response.log_type_1'),
                2   => trans('response.log_type_2'),
                3   => trans('response.log_type_3'),
                4   => trans('response.log_type_4'),
                5   => trans('response.log_type_5'),
                6   => trans('response.log_type_6'),
                7   => trans('response.log_type_7'),
                8   => trans('response.log_type_8'),
            ];
        }
        return self::$log_type_arr;
    }

    /**
     * 组合日志类型
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function mergeLogType($log_type)
    {
        if (empty($log_type)) {
            return false;
        }

        //获取全部日志类型
        $all_log_type = self::getAllLogType();

        if (array_key_exists($log_type, $all_log_type)) {
            return $all_log_type[$log_type];
        }
    }

    /**
     * 组合日志类型 (for select)
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function adminLogLogTypeName()
    {
        //获取全部日志类型
        $all_log_type   = self::getAllLogType();
        $data           = [];

        if (!empty($all_log_type)) {
            foreach ($all_log_type as $k => $v) {
                $data[] = [
                    'id'    => $k,
                    'name'  => $v,
                ];
            }
        }
        return $data;
    }

    /**
     * 写入admin_log日志
     * @param type $admin_id    管理员id
     * @param type $admin_name  管理员名称
     * @param type $log_content 日志内容
     * @param type $log_type    日志类型
     * @return int 返回状态码     1:success 小于1：error
     * @author yangyifan <yangyifanphp@gmail.com>
     */

      public static  function writeAdminLog($log_content, $log_type)
      {
          $admin_id     = isAdminLogin();
          $admin_name   = AdminInfoModel::getAdminName($admin_id);

          if (empty($admin_id)) {
            return self::LOG_ERROR_1;//操作员ID不能为空
          } elseif(empty ($admin_name)) {
            return self::LOG_ERROR_2;//操作员登录名不能为空
          } elseif(empty ($log_content)) {
            return self::LOG_ERROR_3;//操作日志不能为空
          } elseif(empty ($log_type)) {
            return self::LOG_ERROR_4;//日志类型不能为空
          }

          //组合数据
          $data = [
              'admin_id'      => $admin_id,
              'admin_name'    => $admin_name,
              'log_content'   => $log_content,
              'log_type'      => $log_type,
          ];

          $admin_log_id = self::create($data);

          if ($admin_log_id < 0) {
            return self::LOG_ERROR_0;//添加失败
          }
          return self::LOG_SUCCESS;//添加成功
        }



}
