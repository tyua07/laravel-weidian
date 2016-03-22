<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetRuleFormHtmlBuildTraits.php: 设置表单验证规则
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetErrorMessageFormHtmlBuildTraits
{
    /**
     * 设置表单js验证规则错误时提示文字
     *
     * @param null $form_schema_name
     * @param String $error_message 表单js规则验证错误时显示的错误提示文字
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormErrorMessage($error_message = '', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段js规则验证错误时显示的错误提示文字
            $this->setFormErrorMessage(last($this->form_schema), $error_message);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单js规则验证错误时显示的错误提示文字
            $this->setFormErrorMessage($this->form_schema[$form_schema_name], $error_message);
        }
        return $this;
    }

    /**
     * 设置当前表单字段js规则验证错误时显示的错误提示文字
     *
     * @param $form_chema_info
     * @param String $error_message 表单js规则验证错误时显示的错误提示文字
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormErrorMessage($form_chema_info, $error_message)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单js规则验证错误时显示的错误提示文字
        $this->form_schema[$name]['err_message'] = $error_message;
        return $form_chema_info;
    }

}
