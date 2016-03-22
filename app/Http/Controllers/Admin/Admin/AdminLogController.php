<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminInfoController.php: 后台日志控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Requests;
use App\Model\Admin\MergeModel;
use Illuminate\Http\Request;
use App\Model\Admin\Admin\AdminLogModel;
use App\Model\Admin\Admin\AdminMergeModel;
use App\Http\Controllers\Admin\BaseController;
use App\Http\Controllers\Admin\HtmlBuilderController;

class AdminLogController extends BaseController
{

    protected $html_builder;

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public  function __construct(HtmlBuilderController $html_builder)
    {
        parent::__construct();
        $this->html_builder = $html_builder;
    }

    /**
     * 获得后台日志
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return  $this->html_builder->
                builderTitle('后台日志列表')->
                builderSchema('id', 'id')->
                builderSchema('admin_name', '操作员登录名')->
                builderSchema('log_content','操作日志')->
                builderSchema('log_type_name', '类型')->
                builderSchema('create_date', '订单操作记录时间')->
                builderSearchSchema('admin_id', '操作人员', $type = 'select', $default = '', $class = '', AdminMergeModel::adminLogAdminName(), '0', 'name')->
                builderSearchSchema($name = 'log_content', $title = '操作内容 ', $type = 'text', $class = '', $option = '', $option_value_schema = '')->
                builderSearchSchema('log_type', '日志类型', $type = 'select', $default = '', $class = '', AdminLogModel::adminLogLogTypeName(), '0', 'name')->
                builderSearchSchema('create_time_start', '日志创建开始时间', $type = 'date', $default = "dateFmt:'yyyy-MM-dd'",  $notice = '', $class = '', $rule = '*', $err_message = '', $option = '', $option_value_schema = '')->
                builderSearchSchema('create_time_end', '日志创建结束时间', $type = 'date', $default= "dateFmt:'yyyy-MM-dd'",  $notice = '', $class = '', $rule = '*', $err_message = '', $option = '', $option_value_schema = '')->
                builderJsonDataUrl(createUrl('Admin\Admin\AdminLogController@getSearch'))->
                builderList();
    }

    /**
     * 搜索
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getSearch(Request $request)
    {

        //接受参数
        $search = $request->get('search', '');
        $sort   = $request->get('sort', 'id');
        $order  = $request->get('order', 'asc');
        $limit  = $request->get('limit',0);
        $offset = $request->get('offset', config('config.page_limit'));

        //解析params
        parse_str($search);

        //组合查询条件
        $map = [];

        if (!empty($admin_id)) {
            $map['admin_id'] = $admin_id;
        }
        if (!empty($log_content)) {
            $map['log_content'] = array('LIKE','%' . $log_content . '%');
        }
        if (!empty($log_type)) {
            $map['log_type'] = $log_type;
        }
        if (!empty($create_time_start) && !empty($create_time_end)) {
            $map['create_date'] = array('BETWEEN',array($create_time_start . ' 00:00:00',$create_time_end . ' 23:59:59'));
        }

        $data = AdminLogModel::search($map, $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }

}
