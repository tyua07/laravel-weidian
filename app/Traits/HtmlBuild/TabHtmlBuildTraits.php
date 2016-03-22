<?php

// +----------------------------------------------------------------------
// | date: 2016-01-27
// +----------------------------------------------------------------------
// | TabHtmlBuildTraits.php: 后端构建 Tab 页面 HTML Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild;

trait TabHtmlBuildTraits
{
    public $tab_schema          = [];//选项卡字段
    public $tab_data            = [];//选项卡数据
    public $tab_confirm_button  = [];//选项卡确认按钮数据
    public $tab_title           = '';//网站标题
    public $tab_description     = '';//网站描述
    public $tab_keywords        = '';//网站关键字

    /**
     * 构建tab网站标题
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderTabTitle($title, $description = '', $keywords = '')
    {
        $this->tab_title        = $title;
        $this->tab_description  = $description;
        $this->tab_keywords     = $keywords;
        return $this;
    }

    /**
     * 构建Tab 字段
     *
     * @param $obj
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderTabSchema($obj)
    {
        //写入数据
        array_push($this->tab_schema, serialize($obj));
        array_push($this->tab_data, $this->edit_data);
        array_push($this->tab_confirm_button, $this->confirm_button);

        //销毁数据
        $this->form_schema      = [];
        $this->edit_data        = [];
        $this->confirm_button   = [];

        return $this;
    }

    /**
     * 获取构建 Tab 页面 share 到 模板的数据
     *
     * @param string $method    请求meoth
     * @param string $post_url 请求url
     * @return array
     */
    private function getBuildTabData($method = 'post', $post_url = '')
    {
        //提交地址，针对 添加 tab 页面
        $post_url = empty($post_url) ? \URL::current() : $post_url;

        return [
            'tabs_schemas'      => $this->tab_schema,//tab 字段
            'tab_data'          => $this->tab_data,//tab 数据
            'title'             => $this->tab_title,//网站标题
            'description'       => $this->tab_description,//网站描述
            'keywords'          => $this->tab_keywords,//网站关键字
            'tab_confirm_button'=> $this->tab_confirm_button,//tab 确认按钮按钮
            'scription_arr'     => $this->scription,//脚本文件
            'post_url'          => $post_url,//提交地址
            'method'            => $method,//提交方式
            'list_buttons'      => $this->list_buttons,//按钮组
            'build_html_type'   => $this->build_html_type[4],//构建页面类型 为 tab
            'is_show_form'      => isset($this->is_show_form) ? $this->is_show_form : false,//是否显示 form 元素，如果是否,则不会有 "<form></form>",tab类型默认不显示
        ];
    }

    /**
     * 分享数据到视图
     *
     * @param string $method    请求meoth
     * @param string $post_url 请求url
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function shareTabData($method, $post_url)
    {
        view()->share($this->getBuildTabData($method, $post_url));
    }

    /**
     * 构建Tab HTML页面
     *
     * @param string $method    请求meoth
     * @param string $post_url 请求url
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderTabHtml($method = 'post', $post_url = '')
    {
        //分享数据到视图
        $this->shareTabData($method, $post_url);
        return View('admin/html_builder/tab/tab');
    }

}
