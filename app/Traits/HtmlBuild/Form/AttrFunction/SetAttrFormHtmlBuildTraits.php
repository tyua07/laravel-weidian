<?php

// +----------------------------------------------------------------------
// | date: 2016-02-21
// +----------------------------------------------------------------------
// | SetAttrFormHtmlBuildTraits.php: 设置表单扩展属性
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetAttrFormHtmlBuildTraits
{
    /**
     * 设置表单扩展属性
     *
     * @param Array $notice  扩展属性 例如 ： ["height" => 100, 'width' => 200]
     * @param String $form_schema_name 表单元素
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormAttr(Array $attr = [], $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个的表单扩展属性
            $this->setFormAttr(last($this->form_schema), $attr);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单扩展属性
            $this->setFormAttr($this->form_schema[$form_schema_name], $attr);
        }
        return $this;
    }

    /**
     * 设置指定的表单扩展属性
     *
     * @param $form_chema_info
     * @param String $attr 扩展属性
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormAttr($form_chema_info, Array $attr)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单class
        $this->form_schema[$name]['attr'] = $attr;
        return $form_chema_info;
    }

}
