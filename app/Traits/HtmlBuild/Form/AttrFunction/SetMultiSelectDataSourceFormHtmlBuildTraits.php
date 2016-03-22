<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetMultiSelectDataSourceFormHtmlBuildTraits.php: 设置双线选择器数据源
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetMultiSelectDataSourceFormHtmlBuildTraits
{
    /**
     * 设置双向选择器数据源
     *
     * @param null $form_schema_name
     * @param Mixed $option 未选择数据
     * @param Mixed $option_value_schema 已选择数据
     * @param Mixed $option_value_schema 数据对应的键值
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormMultiSelectDataSource($option = [], $option_value_schema, $option_value_name, $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置双向选择器数据源
            $this->setFormMultiSelectDataSource(last($this->form_schema), $option, $option_value_schema, $option_value_name);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置双向选择器数据源
            $this->setFormMultiSelectDataSource($this->form_schema[$form_schema_name], $option, $option_value_schema, $option_value_name);
        }
        return $this;
    }

    /**
     * 设置双向选择器数据源
     *
     * @param $form_chema_info
     * @param Mixed $option 未选择数据
     * @param Mixed $option_value_schema 已选择数据
     * @param Mixed $option_value_name 数据对应的键值
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormMultiSelectDataSource($form_chema_info, $option, $option_value_schema, $option_value_name)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置双向选择器数据源
        $this->form_schema[$name]['option']                 = $option;
        $this->form_schema[$name]['option_value_schema']    = $option_value_schema;
        $this->form_schema[$name]['option_value_name']      = $option_value_name;
        return $form_chema_info;
    }

}
