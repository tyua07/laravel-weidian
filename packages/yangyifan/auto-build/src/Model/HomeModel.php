<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | HomeModel.php: 首页模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model;

use \DB;
use Yangyifan\AutoBuild\Http\Controllers\Build\RequestController;
use Yangyifan\AutoBuild\Http\Controllers\Build\ModelController;
use Yangyifan\AutoBuild\Http\Controllers\Build\ControllerController;
use Yangyifan\AutoBuild\Model\Config\BaseModel as ConfigBaseModel;

class HomeModel extends BaseModel
{
    const FILE_TYPE = 'curd';//对应 $type_arr 的类型

    /**
     * 获得全部表
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllTable()
    {
         return self::mergeTable(DB::select("show tables"));
    }

    /**
     * 组合表数据
     *
     * @param $all_table
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeTable($all_table)
    {
        $data = [];

        if (!empty($all_table)) {
            foreach ($all_table as $v) {
                $data[] = ['table_name' => $v->Tables_in_laravel];
            }
        }
        return $data;
    }

    /**
     * 获得字段列表
     *
     * @param $table_name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getSchemaList($table_name)
    {
        return self::mergeSchema(
            DB::select("select * from information_schema.COLUMNS where table_name = '{$table_name}' and table_schema = '".env('DB_DATABASE')."'")
        );
    }

    /**
     * 组合字段列表
     *
     * @param $all_schema
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeSchema($all_schema)
    {
        $data = [];

        if (!empty($all_schema)) {
            foreach ($all_schema as $v) {
                $data[] = [
                    'col_name'  => $v->COLUMN_NAME,
                    'position'  => $v->ORDINAL_POSITION,
                    'default'   => $v->COLUMN_DEFAULT,
                    'is_null'   => $v->IS_NULLABLE,
                    'type'      => $v->DATA_TYPE,
                    'real_type' => $v->COLUMN_TYPE,
                    'key'       => $v->COLUMN_KEY,
                    'extra'     => $v->EXTRA,
                    'comment'   => $v->COLUMN_COMMENT,
                ];
            }
        }
        return $data;
    }

    /**
     * 创建curd
     *
     * @param $table_name
     * @param $data
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function checkCurd($table_name, $data)
    {
        //创建Request
        self::createRequest(array_merge($data['request'], ['table_name' => $table_name]));
        //创建Model
        self::createModel(array_merge($data['model'], ['table_name' => $table_name]));
        //创建控制器
        self::createController(
            array_merge($data['controller'],
                ['table_name' => $table_name], ['use_array' => [str_replace('/', '\\', $data['request']['file_name']), str_replace('/', '\\', $data['model']['file_name'])] ]));

        return true;

    }

    /**
     * 创建Request
     *
     * @param $data
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function createRequest($data)
    {
        return (new RequestController())->getIndex($data);
    }

    /**
     * 创建Model
     *
     * @param $data
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function createModel($data)
    {
        return (new ModelController())->getIndex($data);
    }

    /**
     * 创建Controller
     *
     * @param $data
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function createController($data)
    {
        return (new ControllerController())->getIndex($data);
    }

    /**
     * 获得配置json信息
     *
     * @param $table_name
     * @param $type
     * @return bool|mixed
     */
    public static function getCURDConfig($table_name)
    {
        return ConfigBaseModel::getConfig($table_name, self::FILE_TYPE);
    }
}

