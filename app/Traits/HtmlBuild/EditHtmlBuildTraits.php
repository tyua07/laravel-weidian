<?php

// +----------------------------------------------------------------------
// | date: 2016-01-27
// +----------------------------------------------------------------------
// | AddHtmlBuildTraits.php: 后端构建 添加 页面 HTML Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild;

use Illuminate\Database\Eloquent\Model;

trait EditHtmlBuildTraits
{

    public $edit_data           = [];//编辑页面数据

    /**
     * 构建编辑页面数据
     *
     * @param array $data
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderEditData($data = [])
    {
        if ( $data instanceof Model) {
            $this->edit_data = $data;
        } elseif ( !is_array($data)) {
            $this->edit_data = objToArray($data);
        }

        return $this;
    }

    /**
     * 获取构建 编辑 页面 share 到 模板的数据
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getBuildEditData()
    {
        return [
            'schemas'           => $this->form_schema,//字段
            'data'              => $this->edit_data,//编辑页面 展示的数据
            'title'             => $this->title,//网站标题
            'description'       => $this->description,//网站描述
            'keywords'          => $this->keywords,//网站关键字
            'confirm_button'    => $this->confirm_button,//确认按钮按钮
            'scription_arr'     => $this->scription,//脚本文件
            'method'            => $this->method,//当前表单提交method
            'list_buttons'      => $this->list_buttons,//按钮组
            'build_html_type'   => $this->build_html_type[2],//构建页面类型 为 edit
            'is_show_form'      => $this->is_show_form,//是否显示 form 元素，如果是否,则不会有 "<form></form>"
        ];
    }

    /**
     * 分享数据到视图
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function shareEditData()
    {
        view()->share($this->getBuildEditData());
    }

    /**
     * 构建HTML编辑页
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderEditForm()
    {
        //分享数据到视图
        $this->shareEditData();
        return View('admin/html_builder/edit/edit_form')->render();
    }

    /**
     * 构建HTML编辑页
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderEdit()
    {
        //分享数据到视图
        $this->shareEditData();
        return View('admin/html_builder/edit/edit');
    }

}
