<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | RequestController.php: 创建 Request 控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Config;

use Illuminate\Http\Request;
use Yangyifan\AutoBuild\Model\Build\BuildRequestModel;
use Yangyifan\AutoBuild\Model\Config\ConfigRequestModel;
use Yangyifan\AutoBuild\Model\HomeModel;

class RequestController extends BaseController
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

    /**
     * 创建配置页面
     *
     * @param Request $request
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex(Request $request)
    {
        $table_name = $request->get('table_name');
        return view('auto_build::create_request_config', [
            'table_name'    => $table_name,//表名称
            'schema_list'   => HomeModel::getSchemaList($table_name),//获得字段列表
            'all_rule'      => BuildRequestModel::getAllRule(),//全部表单验证规则
            'content'       => ConfigRequestModel::getMergeReuqestConfig($table_name),//获得配置内容
        ]);
    }

    /**
     * 处理创建配置页面
     *
     * @param Request $request
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postCreateConfig(Request $request)
    {
        $data = $request->all();
        $file_name = $data['table_name'];
        unset($data['table_name']);

        //写入文件
        $status = $this->writeRequesConfig($file_name, ConfigRequestModel::FILE_TYPE, ConfigRequestModel::createRequestConfig($data));
        return $status == true ? $this->response(self::SUCCESS_STATE_CODE, '创建Request配置信息成功') : $this->response(self::ERROR_STATE_CODE, '创建Request配置信息失败');
    }
}
