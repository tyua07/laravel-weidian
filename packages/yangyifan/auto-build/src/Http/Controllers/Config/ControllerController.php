<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | ControllerController.php: 创建 Controller 配置文件控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers\Config;

use Illuminate\Http\Request;
use Yangyifan\AutoBuild\Model\Build\BuildControllerModel;
use Yangyifan\AutoBuild\Model\Config\ConfigControllerModel;
use Yangyifan\AutoBuild\Model\HomeModel;

class ControllerController extends BaseController
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
        //dd(ConfigControllerModel::getControllerConfig($table_name));
        return view('auto_build::create_controller_config', [
            'table_name'    => $table_name,//表名称
            'schema_list'   => HomeModel::getSchemaList($table_name),//获得字段列表
            'form_type'     => BuildControllerModel::$form_type,//表单类型
            'content'       => ConfigControllerModel::getControllerConfig($table_name),//获得配置信息内容
        ]);
    }

    /**
     * 处理生成config
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postCreateConfig(Request $request)
    {
        $data = $request->all();
        $table_name = $data['table_name'];
        unset($data['table_name']);

        //写入文件
        $status = $this->writeRequesConfig($table_name, ConfigControllerModel::FILE_TYPE, ConfigControllerModel::mergeControllerConfig($data) );
        return $status == true ? $this->response(self::SUCCESS_STATE_CODE, '创建Controller配置信息成功') : $this->response(self::ERROR_STATE_CODE, '创建Controller配置信息失败');
    }
}
