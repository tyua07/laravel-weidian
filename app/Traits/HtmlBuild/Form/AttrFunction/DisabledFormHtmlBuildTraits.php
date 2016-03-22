<?php

// +----------------------------------------------------------------------
// | date: 2016-02-02
// +----------------------------------------------------------------------
// | DisabledFormHtmlBuildTraits.php: 设置表单为禁用
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait DisabledFormHtmlBuildTraits
{
    /**
     * 设置表单为禁用
     *
     * @param null $form_schema_name
     * @param true $type 是否是只读
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormDisabled($form_schema_name = null, $type = true)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段为只读
            $this->setFormDisabled(last($this->form_schema), $type);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单为只读
            $this->setFormDisabled($this->form_schema[$form_schema_name], $type);
        }
        return $this;
    }

    /**
     * 设置当前表单字段为禁用属性
     *
     * @param $form_chema_info
     * @param true $type 是否是禁用
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormDisabled($form_chema_info, $type)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表支付字段true
        $this->form_schema[$name]['disabled'] = $type;
        return $form_chema_info;
    }

}
