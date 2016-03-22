<?php

// +----------------------------------------------------------------------
// | date: 2016-01-17
// +----------------------------------------------------------------------
// | ControllerController.php: 自动构建 Controller
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Build;

use Illuminate\Http\Request;
use gossi\codegen\model\PhpMethod;
use gossi\codegen\model\PhpParameter;
use Yangyifan\AutoBuild\Http\Requests\BuildControllerRequest;
use Yangyifan\AutoBuild\Model\Build\BuildControllerModel;
use Yangyifan\AutoBuild\Model\Config\ConfigControllerModel;

class ControllerController extends BaseController
{
    //默认 需要 use 的类
    const USE_ARRAY = [
        'App\Http\Controllers\Admin\HtmlBuilderController',
        'Illuminate\Http\Request',
        'App\Http\Controllers\Admin\BaseController',
    ];

    const DEFAULT_PARENT_CLASS = 'BaseController';//默认 Controller 需要继承的 父级

    const GET_INDEX_FUNCTION_NAME   = 'getIndex';//列表页方法名称
    const GET_INDEX_FUNCTION_TITLE  = '列表页';//列表页方法描述
    const GET_SEARCH_FUNCTION_NAME  = 'getSearch';//搜索方法名称
    const GET_SEARCH_FUNCTION_TITLE = '搜索';//搜索方法描述
    const GET_EDIT_FUNCTION_NAME    = 'getEdit';//编辑方法名称
    const GET_EDIT_FUNCTION_TITLE   = '显示编辑页面';//编辑方法描述
    const POST_EDIT_FUNCTION_NAME   = 'postEdit';//处理编辑方法名称
    const POST_EDIT_FUNCTION_TITLE  = '处理编辑';//处理编辑方法描述
    const GET_ADD_FUNCTION_NAME     = 'getAdd';//处理添加方法名称
    const GET_ADD_FUNCTION_TITLE    = '显示添加页面';//处理添加方法描述
    const POST_ADD_FUNCTION_NAME    = 'postAdd';//处理添加方法名称
    const POST_ADD_FUNCTION_TITLE   = '处理添加';//处理添加方法描述

    private $use_request    = null;//自定义的request
    private $use_model      = null;//自定义的request

    //仅供参考
    private $schema_arr = [
        'admin_name' => [
            'name'                  => 'admin_name',//表字段名称
            'title'                 => '会员名称',//字段中文名称
            'schema_type'           => 'char',//字段类型
            'is_search'             => true,//是否允许搜索
            'is_list'               => true, //是否允许列表页显示
            'type'                  => 'text',//字段类型
            'default'               => '',//默认值
            'notice'                => '',//表单提示(默认会展示在页面上)
            'class'                 => '',//表单需要定义的class
            'rule'                  => '',//表单验证规则
            'err_message'           => '',//表单验证错误提示
            'option'                => '',//选项 (notice:需要生成后去实现)
            'option_value_schema'   => '',//选项值 (notice:需要生成后去实现)
            'option_value_name'     => '',//选项名称 (notice:需要生成后去实现)
        ],

        'brithday' => [
            'name'                  => 'brithday',//表字段名称
            'title'                 => '生日',//字段中文名称
            'schema_type'           => 'date',//字段类型
            'is_search'             => true,//是否允许搜索
            'is_list'               => true, //是否允许列表页显示
            'type'                  => 'date',//字段类型
            'default'               => '',//默认值
            'notice'                => '',//表单提示(默认会展示在页面上)
            'class'                 => '',//表单需要定义的class
            'rule'                  => '',//表单验证规则
            'err_message'           => '',//表单验证错误提示
            'option'                => '',//选项 (notice:需要生成后去实现)
            'option_value_schema'   => '',//选项值 (notice:需要生成后去实现)
            'option_value_name'     => '',//选项名称 (notice:需要生成后去实现)
        ],
    ];//表字段列表

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
        //正则匹配要导入的文件
        $this->matchUseArray();
        //setUrl
        $this->setControllerRouteUrl();

        $this->setQualifiedName()
            ->setProperty("html_builder", "", "", "protected")//设置构建html对象表名称
            ->buildConstruct()//设置 构造 方法
            ->buildIndex()//设置 列表 方法
            ->buildGetSearch()//设置 搜索 方法
            ->buildGetEdit()//设置 显示编辑页面 方法
            ->buildPostEdit()//设置 处理编辑 方法
            ->buildGetAdd()//设置 处理添加 方法
            ->buildPostAdd()//设置 处理添加 方法
            ->setUse( $this->request['use_array'] )//设置 use文件
        ;
    }

    /**
     * 正则匹配要导入的文件
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function matchUseArray()
    {
        if (!empty($this->request['use_array'])) {
            foreach ($this->request['use_array'] as $use_file) {
                //匹配Request
                if (preg_match('/([a-zA-Z0-9]+Request)$/', $use_file, $request)) {
                    $this->use_request = end($request);
                } elseif ( preg_match('/([a-zA-Z0-9]+Model)/', $use_file, $model) ) {//匹配Model
                    $this->use_model = end($model);
                }
            }
        }
    }

    /**
     * 设置Route Url
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function setControllerRouteUrl()
    {
        $this->route_url = str_replace(['App/Http/Controllers/', '/'], ['', '\\'], $this->request['file_name']);
    }

    /**
     * 构建列表页方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildConstruct()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::CONSTRUCT_FUNCTION_NAME)
                ->setDescription(self::GET_INDEX_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create("html_builder")
                    ->setType("HtmlBuilderController")
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildConstructBody())
        );
        return $this;
    }

    /**
     * 构建构造方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildIndex()
    {
        $request_name   = "request";
        $title_name     = "列表页";

        $this->php_class->setMethod(
            PhpMethod::create(self::GET_INDEX_FUNCTION_NAME)
                ->setDescription(self::CONSTRUCT_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create($request_name)
                        ->setType("Request")
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildGetIndexBody($title_name, $this->route_url, ConfigControllerModel::getControllerConfig($this->request['table_name']) ))
        );
        return $this;
    }

    /**
     * 构建处理搜索方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildGetSearch()
    {
        $request_name   = "request";

        $this->php_class->setMethod(
            PhpMethod::create(self::GET_SEARCH_FUNCTION_NAME)
                ->setDescription(self::GET_SEARCH_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create($request_name)
                        ->setType("Request")
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildGetSearchBody($this->use_model, ConfigControllerModel::getControllerConfig($this->request['table_name']) ))
        );
        return $this;
    }

    /**
     * 构建显示编辑页面方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildGetEdit()
    {
        $title          = "编辑页面";
        $request_name   = "Request";

        $this->php_class->setMethod(
            PhpMethod::create(self::GET_EDIT_FUNCTION_NAME)
                ->setDescription(self::GET_EDIT_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create("request")
                        ->setType($request_name)
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildGetEditBody($this->use_model, $title, ConfigControllerModel::getControllerConfig($this->request['table_name']) ))
        );
        return $this;
    }

    /**
     * 构建处理编辑方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildPostEdit()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::POST_EDIT_FUNCTION_NAME)
                ->setDescription(self::POST_EDIT_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create("request")
                        ->setType($this->use_request)
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildPostEditBody($this->use_model))
        );
        return $this;
    }

    /**
     * 构建显示添加页面方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildGetAdd()
    {
        $request_name   = "Request";
        $title          = "添加页面";

        $this->php_class->setMethod(
            PhpMethod::create(self::GET_ADD_FUNCTION_NAME)
                ->setDescription(self::GET_ADD_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create("request")
                        ->setType($request_name)
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildGetAddBody($title, ConfigControllerModel::getControllerConfig($this->request['table_name']) ))
        );
        return $this;
    }

    /**
     * 构建处理添加方法
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildPostAdd()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::POST_ADD_FUNCTION_NAME)
                ->setDescription(self::POST_ADD_FUNCTION_TITLE)
                ->addParameter(
                    PhpParameter::create("request")
                        ->setType($this->use_request)
                )
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildControllerModel::buildPostAddBody($this->use_model))
        );
        return $this;
    }

}
