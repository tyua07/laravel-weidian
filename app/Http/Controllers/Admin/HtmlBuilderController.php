<?php

// +----------------------------------------------------------------------
// | date: 2015-06-07
// +----------------------------------------------------------------------
// | HtmlBuilderController.php: 后端构建HTML控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin;

use App\Http\Requests;
use UEditor;
use App\Traits\HtmlBuild\BaseHtmlBuildTraits;
use App\Traits\HtmlBuild\AttributeHtmlBuildTraits;
use App\Traits\HtmlBuild\TreeHtmlBuildTraits;
use App\Traits\HtmlBuild\TabHtmlBuildTraits;
use App\Traits\HtmlBuild\AddHtmlBuildTraits;
use App\Traits\HtmlBuild\EditHtmlBuildTraits;
use App\Traits\HtmlBuild\ListHtmlBuildTraits;

class HtmlBuilderController extends BaseController
{
    use AttributeHtmlBuildTraits;   //属性 traits
    use BaseHtmlBuildTraits;        //基础 traits
    use ListHtmlBuildTraits;        //构建列表页 traits
    use EditHtmlBuildTraits;        //构建编辑页面 traits
    use AddHtmlBuildTraits;         //构建添加 traits
    use TabHtmlBuildTraits;         //构建tab traits
    use TreeHtmlBuildTraits;        //构建tree traits

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
    }
}
