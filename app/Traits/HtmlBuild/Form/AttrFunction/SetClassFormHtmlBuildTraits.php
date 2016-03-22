<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetClassFormHtmlBuildTraits.php: 设置表单class
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetClassFormHtmlBuildTraits
{
    /**
     * 设置表单默认值
     *
     * @param null $form_schema_name
     * @param String $class 表单class
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormClass($class = '', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段class
            $this->setFormClass(last($this->form_schema), $class);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单class
            $this->setFormClass($this->form_schema[$form_schema_name], $class);
        }
        return $this;
    }

    /**
     * 设置当前表单字段class
     *
     * @param $form_chema_info
     * @param String $class 表单class
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormClass($form_chema_info, $class)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单class
        $this->form_schema[$name]['class'] = $class;
        return $form_chema_info;
    }

}
