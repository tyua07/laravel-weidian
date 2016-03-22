<?php

// +----------------------------------------------------------------------
// | date: 2016-02-24
// +----------------------------------------------------------------------
// | RemoveFormHtmlBuildTraits.php: 删除指定表单元素
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild\Form\AttrFunction;

trait RemoveFormHtmlBuildTraits
{
    /**
     * 删除指定表单元素
     *
     * @param bool|true $boolean        是否删除
     * @param mixed|null $name          表单名
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function removeFormSchema($boolean = true, $name = null)
    {
        if ( $boolean == true ) {
            if ( !is_null($name) ) {
                //删除指定表单元素
                unset($this->form_schema[$name]);
            } else {
                //获得最后一个元素
                $last_schema = last($this->form_schema);
                //删除当前单元表单元素
                unset($this->form_schema[$last_schema['name']]);
            }
        }
        return $this;
    }

}
