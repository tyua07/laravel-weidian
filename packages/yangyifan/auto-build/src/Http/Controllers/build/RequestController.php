<?php

// +----------------------------------------------------------------------
// | date: 2016-01-12
// +----------------------------------------------------------------------
// | RequestController.php: 自动构建 Request
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Build;

use Illuminate\Http\Request;
use gossi\codegen\model\PhpMethod;
use Yangyifan\AutoBuild\Http\Requests\BuildControllerRequest;
use Yangyifan\AutoBuild\Model\Build\BuildRequestModel;
use Yangyifan\AutoBuild\Model\Config\ConfigRequestModel;

class RequestController extends BaseController
{
    //默认 需要 use 的类
    const USE_ARRAY = [
        'App\Http\Requests\BaseFormRequest'
    ];

    const DEFAULT_PARENT_CLASS = 'BaseFormRequest';//默认 Request 需要继承的 父级

    const RULES_FUNCTION_NAME   = 'rules';//验证规则方法名称
    const MSG_FUNCTION_NAME     = 'messages';//验证规则方法名称
    const RULE_FUNC_TITLE       = '验证错误规则';// Rule 函数名称
    const MESSAGE_FUNC_TITLE    = '验证错误提示';// Message 函数名称

    //测试验证规则 仅供参考
    private $rules = [
        'admin_name'    => ['rule' => ['required', 'url', ["after", "2015-02-01"] , "alpha_num", ["exists", "user_info", "admin_name"]], 'name' => '用户名'],
        'password'      => ['rule' => ['required'], 'name' => '密码'],
        'mobile'        => ['rule' => ['required'], 'name' => '手机号码'],
        'state'         => ['rule' => ['required'], 'name' => '状态'],
        'limit_id'      => ['rule' => ['required'], 'name' => '角色id'],
    ];

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
            ->buildMessages()//设置message类方法
            ->buildRules()//设置rule类方法
            ->setUse( $this->request['use_array'] )//设置 use文件
        ;
    }

    /**
     * 设置验证规则方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildRules()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::RULES_FUNCTION_NAME)
                ->setDescription(self::RULE_FUNC_TITLE)
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildRequestModel::buildRulesFuncBody( ConfigRequestModel::getRequestConfig($this->request['table_name']) ))
        );
        return $this;
    }

    /**
     * 设置验证规则提示文字
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function buildMessages()
    {
        $this->php_class->setMethod(
            PhpMethod::create(self::MSG_FUNCTION_NAME)
                ->setDescription(self::MESSAGE_FUNC_TITLE)
                ->setLongDescription("@author ".self::AUTHOR_NAME." <".self::AUTHOR_EMILA.">")
                ->setBody(BuildRequestModel::buildMessageFuncBody( ConfigRequestModel::getRequestConfig($this->request['table_name']) ))
        );
        return $this;
    }

}
