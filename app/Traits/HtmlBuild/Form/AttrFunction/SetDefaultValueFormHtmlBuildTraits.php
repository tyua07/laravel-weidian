<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetDefaultValueFormHtmlBuildTraits.php: 设置表单默认值
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetDefaultValueFormHtmlBuildTraits
{
    /**
     * 设置表单默认值
     *
     * @param null $form_schema_name
     * @param String $default 表单默认值
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormDefaultValue($default = '', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段默认值
            $this->setFormDefaultValue(last($this->form_schema), $default);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单默认值
            $this->setFormDefaultValue($this->form_schema[$form_schema_name], $default);
        }
        return $this;
    }

    /**
     * 设置当前表单字段默认值
     *
     * @param $form_chema_info
     * @param String $default_value 表单默认值
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormDefaultValue($form_chema_info, $default_value)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单默认值
        $this->form_schema[$name]['default'] = $default_value;
        return $form_chema_info;
    }

}
