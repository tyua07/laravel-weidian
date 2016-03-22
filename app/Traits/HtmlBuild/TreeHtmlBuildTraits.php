<?php

// +----------------------------------------------------------------------
// | date: 2016-01-27
// +----------------------------------------------------------------------
// | TreeHtmlBuildTraits.php: 后端构建 Tree 页面 HTML Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\HtmlBuild;

trait TreeHtmlBuildTraits
{

    public $tree_data           = [];//tree 数据

    /**
     * 构建tree数据
     *
     * @param $data
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderTreeData($data)
    {
        $this->tree_data =  mergeTreeNode(objToArray($data));
        return $this;
    }

    /**
     * 获取构建 Tree 页面 share 到 模板的数据
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getBuildTreeData()
    {
        return [
            'tree_schemas'      => $this->schemas,//tree 字段
            'tree_data'         => $this->tree_data,//tree 数据
            'title'             => $this->title,//网站标题
            'description'       => $this->description,//网站描述
            'keywords'          => $this->keywords,//网站关键字
            'list_buttons'      => $this->list_buttons,//列表页按钮组
            'build_html_type'   => $this->build_html_type[3],//构建页面类型 为 tree
        ];
    }

    /**
     * 分享数据到视图
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function shareTreeData()
    {
        view()->share($this->getBuildTreeData());
    }

    /**
     * 构建 tree 页面
     *
     * @param array $data
     * @param array $urls
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function builderTree()
    {
        //分享数据到视图
        $this->shareTreeData();
        return View('admin/html_builder/tree/tree');
    }
}
