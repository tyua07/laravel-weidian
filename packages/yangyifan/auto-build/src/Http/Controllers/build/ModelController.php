<?php

// +----------------------------------------------------------------------
// | date: 2016-01-17
// +----------------------------------------------------------------------
// | ModelController.php: 自动构建 Model
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Build;

use Illuminate\Http\Request;
use gossi\codegen\model\PhpMethod;
use gossi\codegen\model\PhpParameter;
use Yangyifan\AutoBuild\Http\Requests\BuildControllerRequest;
use Yangyifan\AutoBuild\Model\Build\BuildModelModel;

class ModelController extends BaseController
{
    //默认 需要 use 的类
    const USE_ARRAY = [
        'App\Model\Admin\BaseModel'
    ];

    const DEFAULT_PARENT_CLASS = 'BaseModel';//默认 Model 需要继承的 父级

    const SEARCH_FUNCTION_NAME      = 'search';//设置 search 方法
    const MERGE_FUNCTION_NAME       = 'mergeData';//Merge方法名称
    const SEARCH_FUNC_TITLE         = '搜索';// Rule 函数名称
    const MERGE_FUNC_TITLE          = '组合数据';// Merge 函数名称

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 设置
     *
     * @param Request $data
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex($data)
    {
        //验证请求
        $build_controller_request   = new BuildControllerRequest();
        $build_controller_request->merge($data);
        $v                          = \Validator::make($build_controller_request->rules(), $build_controller_request->messages());
        if ($v->fails()) {
            return $build_controller_request->response($v->errors());
        }
        $this->request = $build_controller_request->all();

        $this->setQualifiedName()
            ->setProperty("table", $data['table_name'], "设置模型表名称", "protected")//设置模型表名称
            ->buildSearch()//设置 search 方法
            ->buildMerge()//设置 merge 方法
            ->setUse( $this->request['use_array'] )//设置 use文件
        ;
    }

    /**
     * 设置 search 方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildSearch()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::SEARCH_FUNCTION_NAME)
                ->setDescription(self::SEARCH_FUNC_TITLE)
                ->setVisibility("protected")
                ->addParameter(
                    PhpParameter::create("map")
                        ->setType("string")
                        ->setDescription("搜索规则数组")
                )
                ->addParameter(
                    PhpParameter::create("sort")
                        ->setType("string")
                        ->setDescription("排序字段")
                )
                ->addParameter(
                    PhpParameter::create("order")
                        ->setType("string")
                        ->setDescription("排序规则")
                )->addParameter(
                    PhpParameter::create("limit")
                        ->setType("string")
                        ->setDescription("显示条数")
                )
                ->addParameter(
                    PhpParameter::create("offset")
                        ->setType("string")
                        ->setDescription("偏移量")
                )

                ->setStatic(true)
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildModelModel::buildSearchBody())
        );
        return $this;
    }

    /**
     * 设置 merge 方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function buildMerge()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::MERGE_FUNCTION_NAME)
                ->setDescription(self::MERGE_FUNC_TITLE)
                ->setVisibility("private")
                ->addParameter(
                    PhpParameter::create("data")
                        ->setDescription("搜索数据")
                )
                ->setStatic(true)
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildModelModel::buildMergeBody())
        );
        return $this;
    }

}
