<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | ModelController.php: 创建 Model 配置文件控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Config;

use Illuminate\Http\Request;
use gossi\codegen\model\PhpMethod;
use gossi\codegen\model\PhpParameter;
use Yangyifan\AutoBuild\Http\Requests\BuildControllerRequest;
use Yangyifan\AutoBuild\Model\Build\BuildModelModel;

class ModelController extends BaseController
{
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
