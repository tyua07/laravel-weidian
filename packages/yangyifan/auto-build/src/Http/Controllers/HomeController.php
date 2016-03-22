<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | HomeController.php: 自动构建首页控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Controllers;

use Illuminate\Http\Request;
use Yangyifan\AutoBuild\Model\HomeModel;
use Yangyifan\AutoBuild\Http\Controllers\Config\BaseController as ConfigBaseController;

class HomeController extends BaseController
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
     * 首页
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return View('auto_build::index', [
            'all_table' => HomeModel::getAllTable()
        ]);
    }

    /**
     * 生成curd页面
     *
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getCurd(Request $request)
    {
        $table_name = $request->get('table_name');
        return View('auto_build::curd', [
            'table_name'    => $table_name,
            'content'       => HomeModel::getCURDConfig($table_name),
        ]);
    }

    /**
     * 创建CURD
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postCurd(Request $request)
    {
        $data = $request->all();
        $table_name = $data['table_name'];
        unset($data['table_name']);

        //写入配置文件
        (new ConfigBaseController())->writeRequesConfig($table_name, HomeModel::FILE_TYPE, [
            'request[file_name]'        => $data['request']['file_name'],
            'request[file_title]'       => $data['request']['file_title'],
            'model[file_name]'          => $data['model']['file_name'],
            'model[file_title]'         => $data['model']['file_title'],
            'controller[file_name]'     => $data['controller']['file_name'],
            'controller[file_title]'    => $data['controller']['file_title'],
        ]);

        //创建curd
        $status = HomeModel::checkCurd($table_name, $data);
        return $status == true ? $this->response(self::SUCCESS_STATE_CODE, '创建CURD成功') : $this->response(self::ERROR_STATE_CODE, '创建CURD失败');

    }
}
