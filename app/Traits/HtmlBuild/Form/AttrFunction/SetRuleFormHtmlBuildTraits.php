<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetRuleFormHtmlBuildTraits.php: 设置表单验证规则
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetRuleFormHtmlBuildTraits
{
    /**
     * 设置表单js验证规则
     *
     * @param null $form_schema_name
     * @param String $rule 表单js验证规则
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormRule($rule = '*', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段验证规则
            $this->setFormRule(last($this->form_schema), $rule);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单验证规则
            $this->setFormRule($this->form_schema[$form_schema_name], $rule);
        }
        return $this;
    }

    /**
     * 设置当前表单字段js验证规则
     *
     * @param $form_chema_info
     * @param String $rule 表单js验证规则
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormRule($form_chema_info, $rule)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单class
        $this->form_schema[$name]['rule'] = $rule;
        return $form_chema_info;
    }

}
