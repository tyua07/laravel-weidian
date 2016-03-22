<?php

// +----------------------------------------------------------------------
// | date: 2016-02-14
// +----------------------------------------------------------------------
// | SetIsLimitTraits.php: 设置列表页字段分页数量
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\ListSchema\Attribute;

trait SetIsLimitTraits
{

    private $limit_number_arr   = [10, 25, 50, 100, 'ALL'];//默认可以选择的分页条数选项
    private $page_size          = 10;//默认显示的条数数

    /**
     * 设置显示的分页条数
     *
     * @param $limit_number_arr
     * @return string
     */
    public function buildLimitNumber($limit_number_arr = [])
    {
        if ( !empty($limit_number_arr) && is_array($limit_number_arr)) {
            $this->limit_number_arr = $limit_number_arr;
            $this->page_size        = $limit_number_arr[0];
        }
        return $this;
    }

}
