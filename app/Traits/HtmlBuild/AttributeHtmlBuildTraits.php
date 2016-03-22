<?php

// +----------------------------------------------------------------------
// | date: 2016-01-27
// +----------------------------------------------------------------------
// | AttributeHtmlBuildTraits.php: 后端构建 页面 属性 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild;

trait AttributeHtmlBuildTraits
{
    public $schemas             = [];//字段
    public $title               = '';//网站标题
    public $description         = '';//网站描述
    public $keywords            = '';//网站关键字
    public $search_schema       = [];//列表页搜索字段
    public $list_buttons        = [];//按钮组
    public $data                = [];//数据

    public $bottuns             = [];//按钮
    public $form_schema         = [];//form表单字段
    public $confirm_button      = '';//确认按钮

    public $build_html_type     = ['list', 'add', 'edit', 'tree', 'tab'];//构建页面的类型

    /**
     * 初始化 表单 schema
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function resetFormSchema()
    {
        $this->form_schema = [];
    }

    /**
     * 初始化数据
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function resetData()
    {
        $this->data = [];
    }

    /**
     * 初始化列表数据
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function resetSchemas()
    {
        $this->schemas          = [];
        $this->search_schema    = [];
        $this->json_url         = '';
    }

    /**
     * 初始化
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function reset()
    {
        $this->resetFormSchema();
        $this->resetData();
        $this->resetSchemas();
        return $this;
    }
}
