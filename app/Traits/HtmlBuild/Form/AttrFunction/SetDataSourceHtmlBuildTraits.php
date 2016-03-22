<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetDataSourceHtmlBuildTraits.php: 设置表单数据源(单选框和下拉列表框)
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetDataSourceHtmlBuildTraits
{
    /**
     * 设置表单数据源
     *
     * @param Array $data_source 数据源
     * @param mixed $select 选中元素
     * @param String $option_name 当前表单是select类型,则当前值对应的是$data_source的需要显示的数组key值,例如:$option = [['id' => 1, 'name' =>"aa"],],如果我们需要显示 "aa"这一列作为显示的列,这里则填写 "name"
     * @param null $form_schema_name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildDataSource($data_source = [], $select = null, $option_name = null, $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段数据源
            $this->setDataSource(last($this->form_schema), $data_source, $select, $option_name);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单为数据源
            $this->setDataSource($this->form_schema[$form_schema_name], $data_source, $select, $option_name);
        }

        return $this;
    }

    /**
     * 设置表单数据源
     *
     * @param $form_chema_info
     * @param Array $data_source 数据源
     * @param mixed $select 选中元素
     * @param String $option_name 当前表单是select类型,则当前值对应的是$data_source的需要显示的数组key值,例如:$option = [['id' => 1, 'name' =>"aa"],],如果我们需要显示 "aa"这一列作为显示的列,这里则填写 "name"
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setDataSource($form_chema_info, $data_source, $select, $option_name)
    {
        //获得当前表单字段的name名称
        $name           = $form_chema_info['name'];
        //当前表单类型
        $schema_type    = $form_chema_info['type'];

        //只有当前表单才可以设置
        if ( in_array($schema_type, ['radio', 'checkbox', 'select'] )) {
            //设置数据源
            $this->form_schema[$name]['option']                 = $data_source;
            $this->form_schema[$name]['option_value_schema']    = $select;
            $this->form_schema[$name]['option_value_name']      = $option_name;
            return $form_chema_info;
        }
    }

}
