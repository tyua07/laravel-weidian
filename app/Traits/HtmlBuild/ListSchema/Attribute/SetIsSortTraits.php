<?php

// +----------------------------------------------------------------------
// | date: 2016-02-14
// +----------------------------------------------------------------------
// | SetIsSortTraits.php: 设置列表页字段是否允许排序
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\ListSchema\Attribute;

trait SetIsSortTraits
{

    private $global_disable_sort_schema = ['handle', 'state_name'];//全局不允许排序的字段

    /**
     * 设置字段是否允许排序
     *
     * @param $schame
     * @param $is_sort
     * @return bool|string
     */
    private function setSchemIsSort($schame, $is_sort)
    {
        //设置全局字段是否允许排序
        $status = $this->setGlobalSchemaIsSort($schame);
        if ( $status === false ) return "false";

        return $is_sort === true  ? "true" : "false";
    }

    /**
     * 设置全局字段是否允许排序
     *
     * @param $schame
     * @return bool
     */
    private function setGlobalSchemaIsSort($schame)
    {
        if (in_array($schame, $this->global_disable_sort_schema)) {
            return false;
        }
        return true;
    }

}
