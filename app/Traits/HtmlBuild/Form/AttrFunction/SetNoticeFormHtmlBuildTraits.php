<?php

// +----------------------------------------------------------------------
// | date: 2016-02-21
// +----------------------------------------------------------------------
// | SetNoticeFormHtmlBuildTraits.php: 设置表单提示规则
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetNoticeFormHtmlBuildTraits
{
    /**
     * 设置表单提示规则
     *
     * @param String $notice  表单提示
     * @param String $form_schema_name 表单元素
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormNotice($notice = '', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个的表单文字提示
            $this->setFormNotice(last($this->form_schema), $notice);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单文字提示
            $this->setFormNotice($this->form_schema[$form_schema_name], $notice);
        }
        return $this;
    }

    /**
     * 设置指定的表单文字提示
     *
     * @param $form_chema_info
     * @param String $rule 表单提示
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormNotice($form_chema_info, $notice)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单class
        $this->form_schema[$name]['notice'] = $notice;
        return $form_chema_info;
    }

}
