<?php

// +----------------------------------------------------------------------
// | date: 2016-02-25
// +----------------------------------------------------------------------
// | ToolsTraits.php: 基础模型工具方法 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\Admin\Model;

use DB;

trait ToolsTraits
{
    /**
     * 获得全部文章分类--无限极分类编辑菜单时选项）
     *
     * @descript  递归组合无限极分类，为了编辑页面和增加页面select 展示
     * @param $name 表单name名称
     * @param $id 当前id
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllForSchemaOption($name, $id = 0, $first = true)
    {
        $data = $id > 0 ? mergeTreeNode(objToArray(self::where('id', '<>' , $id)->get())) : mergeTreeNode(objToArray(self::all()));
        $first == true && array_unshift($data, ['id' => '0', $name => trans('response.place_chose')]);
        return $data;
    }

    /**
     * 获得全部文章分类--无限极分类编辑菜单时选项）
     *
     * @descript  递归组合无限极分类，为了编辑页面和增加页面select 展示
     * @param $name 表单name名称
     * @param $id 当前id
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllParentName($name, $id = 0, $first = true)
    {
        $data = $id > 0 ? mergeTreeNode(objToArray(self::where('id', '<>' , $id)->get())) : mergeTreeNode(objToArray(self::all()));

        $first == true && array_unshift($data, ['id' => '0', $name => trans('response.place_chose')]);
        return $data;
    }
    /**
     * 获得全部文章分类--无限极分类编辑菜单时选项）
     *
     * @descript  递归组合无限极分类，为了编辑页面和增加页面select 展示
     * @param $name 表单name名称
     * @param $id 当前id
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllFunctionName($name, $id = 0, $first = true)
    {
        $data = $id > 0 ? mergeTreeNode(objToArray(self::where('id', '<>' , $id)->get())) : mergeTreeNode(objToArray(self::all()));

        $first == true && array_unshift($data, ['id' => '0', $name => trans('response.place_chose')]);
        return $data;
    }

    /**
     * 打印最后一条执行sql
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getLastSql($type = false)
    {
        $sql = DB::getQueryLog();
        if ($type == true ) {
            var_dump($sql);die;
        }

        $query = end($sql);
        var_dump($query);die;
    }

    /**
     * 获得当前语言
     *
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getLocale()
    {
        $locale = \Cookie::get('locale');
        return !empty($locale) ? $locale : 'zh';
    }

    /**
     * 组合数据的为select数据集
     *
     * @param $data
     * @param string $name
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeDataForSelect($data, $name = 'name')
    {
        $array = [];

        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $array[] = [
                    'id'        => $key,
                    $name       => $value,
                ];
            }
        }
        return $array;
    }

    /**
     * 组合 col class 名称
     *
     * @param $state
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function mergeClassName($state)
    {
        if ($state == 2) {
            return self::COL_DANGER;
        }
        return self::COL_DEFAULT;
    }
}
