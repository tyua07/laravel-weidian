<?php

// +----------------------------------------------------------------------
// | date: 2016-02-10
// +----------------------------------------------------------------------
// | SetDateFormatFormHtmlBuildTraits.php: 设置时间类型的表单所展示的时间格式
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait SetDateFormatFormHtmlBuildTraits
{
    /**
     * 设置表单默认值
     *
     * @param String $date_format 显示的时间格式
     * @param null $form_schema_name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildFormDateFormat($date_format = 'yyyy-MM-dd HH:mm:ss', $form_schema_name = null)
    {
        if ( is_null($form_schema_name)) {
            //设置最后一个表单字段时间格式
            $this->setFormDateFormat(last($this->form_schema), $date_format);
        } else {
            //如果当前表单不存在,则初始化表单
            if ( !array_key_exists($form_schema_name, $this->form_schema) ) {
                //初始化
                $this->initializeFormSchema($form_schema_name);
            }
            //设置指定的表单时间格式
            $this->setFormDateFormat($this->form_schema[$form_schema_name], $date_format);
        }
        return $this;
    }

    /**
     * 设置当前表单字段时间格式
     *
     * @param $form_chema_info
     * @param String $default_value 表单时间格式
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setFormDateFormat($form_chema_info, $date_format)
    {
        //获得当前表单字段的name名称
        $name = $form_chema_info['name'];
        //设置当前表单时间格式
        $this->form_schema[$name]['default'] = $date_format;
        return $form_chema_info;
    }

}
