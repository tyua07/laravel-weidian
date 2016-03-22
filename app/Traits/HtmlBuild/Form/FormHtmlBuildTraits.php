<?php

// +----------------------------------------------------------------------
// | date: 2016-02-02
// +----------------------------------------------------------------------
// | BaseHtmlBuildTraits.php: 后端构建 HTML 基础 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form;

use App\Traits\HtmlBuild\Form\AttrFunction\ReadOnlyFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\DisabledFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetDataSourceHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetDefaultValueFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetDateFormatFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetClassFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetRuleFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetErrorMessageFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetMultiSelectDataSourceFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetNoticeFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\SetAttrFormHtmlBuildTraits;
use App\Traits\HtmlBuild\Form\AttrFunction\RemoveFormHtmlBuildTraits;

trait FormHtmlBuildTraits
{
    /**
     * 初始化表单属性
     *
     * @param $name
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function initializeFormSchema($name)
    {
        $this->form_schema[$name] = [
            'name'                  => $name,//表单name
            'title'                 => $name,//表单名称
            'type'                  => 'text',//表单类型
            'default'               => '',//表单默认值
            'notice'                => '',//表单提示
            'class'                 => '',//表单class
            'rule'                  => '',//表单验证规则
            'err_message'           => '',//表单验证提示文字
            'option'                => '',//选项
            'option_value_schema'   => '',//选项默认值
            'option_value_name'     => '',//下拉列表框选项名称
            'attr'                  => [],//属性 数组格式
            'read_only'             => false,//是否只读
            'disabled'              => false,//是否禁用
        ];
    }

    /**
     * 构建表单字段
     *
     * @param $name                 表单name
     * @param $title                表单名称
     * @param $type                 表单类型
     * @param $default              表单默认值
     * @param $notice               表单提示
     * @param $class                表单class
     * @param $rule                 表单验证规则
     * @param $err_message          表单验证提示文字
     * @param $option               选项
     * @param $option_value_schema  选项默认值
     * @return $option_value_name   下拉列表框选项名称
     * @param $attr                 属性 数组格式
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderFormSchema($name, $title, $type = 'text', $default = '',  $notice = '', $class = '', $rule = '*', $err_message = '', $option = '', $option_value_schema = '', $option_value_name = '', $attr = [])
    {
        //当前表单的老数据
        $old_schema_info = [];

        //如果当前表单存在，则赋值给 $old_schema_info
        if (array_key_exists($name, $this->form_schema)) {
            $old_schema_info = $this->form_schema[$name];
        }

        //合并数组
        $old_schema_info += [
            'name'                  => $name,
            'title'                 => $title,
            'type'                  => $type,
            'default'               => $default,
            'notice'                => $notice,
            'class'                 => $class,
            'rule'                  => $rule,
            'err_message'           => $err_message,
            'option'                => $option,
            'option_value_schema'   => $option_value_schema,
            'option_value_name'     => $option_value_name,
            'attr'                  => $attr,
        ];

        //赋值到 $this->form_schema
        $this->form_schema[$name] = $old_schema_info;
        return $this;
    }


    use ReadOnlyFormHtmlBuildTraits,                    //设置表单为只读
        DisabledFormHtmlBuildTraits,                    //设置表单禁用
        SetDataSourceHtmlBuildTraits,                   //设置表单数据源
        SetDefaultValueFormHtmlBuildTraits,             //设置表单默认值
        SetDateFormatFormHtmlBuildTraits,               //设置时间表单的时间格式
        SetClassFormHtmlBuildTraits,                    //设置表单class
        SetRuleFormHtmlBuildTraits,                     //验证表单规则
        SetErrorMessageFormHtmlBuildTraits,             //表单js验证规则错误时提示文字
        SetMultiSelectDataSourceFormHtmlBuildTraits,    //设置双向选择器数据源
        SetNoticeFormHtmlBuildTraits,                   //设置表单提示
        SetAttrFormHtmlBuildTraits,                     //设置扩展属性
        RemoveFormHtmlBuildTraits                       //删除指定表单元素
        ;

}
