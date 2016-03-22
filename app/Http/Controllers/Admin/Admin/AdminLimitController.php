<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminLimitController.php: 后台角色控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Requests;
use App\Model\Admin\Admin\AdminLimitModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\BaseController;
use App\Http\Controllers\Admin\HtmlBuilderController;
use App\Http\Requests\Admin\Admin\AdminLimitRequest;

class AdminLimitController extends BaseController
{

    protected $html_builder;

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(HtmlBuilderController $html_builder)
    {
        parent::__construct();
        $this->html_builder = $html_builder;
    }

    /**
     * 获得后台角色列表
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return $this->html_builder->
                builderTitle('角色列表')->
                builderSchema('id', 'id')->
                builderSchema('limit_name', '角色名称')->
                builderSchema('handle', '操作')->
                builderBotton('添加角色', createUrl('Admin\Admin\AdminLimitController@getAdd'))->
                builderJsonDataUrl(createUrl('Admin\Admin\AdminLimitController@getSearch'))->
                builderList();
    }

    /**
     * 获取后台角色列表
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getSearch(Request $request)
    {
        //接受参数
        $search = $request->get('search', '');
        $sort   = $request->get('sort', 'id');
        $order  = $request->get('order', 'desc');
        $limit  = $request->get('limit',0);
        $offset = $request->get('offset', config('config.page_limit'));

        $data   = AdminLimitModel::search($map = [] ,$sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }


    /**
     * 编辑后台角色
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        return $this->html_builder->
                builderTitle('编辑角色')->
                builderFormSchema('limit_name',   '权限名称',      $type = 'text', $default = '',  $notice = '', $class = '', $rule = '*', $err_message = '', $option = '', $option_value_schema = '')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminLimitController@postEdit'), 'btn btn-success')->
                builderEditData(AdminLimitModel::find($request->get('id')))->
                builderEdit();
    }

    /**
     * 更新后台角色
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(AdminLimitRequest $request)
    {
        $Model  = AdminLimitModel::findOrFail($request->get('id'));

        $Model->update($request->all());
        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Admin\AdminLimitController@getIndex'));
    }

    /**
     * 添加后台角色界面
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return $this->html_builder->
                builderTitle('添加角色')->
                builderFormSchema('limit_name',   '权限名称',      $type = 'text', $default = '',  $notice = '', $class = '', $rule = '*', $err_message = '', $option = '', $option_value_schema = '')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminLimitController@postAdd'), 'btn btn-success')->
                builderAdd();
    }

    /**
     * 添加后台角色到数据库
     *
     * @param Request $request
     * @author zhuweijian <zhuweijain@louxia100.com>
     */
    public function postAdd(AdminLimitRequest $request)
    {
        //写入数据
        $affected_number = AdminLimitModel::create($request->all());
        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success'), [], true, createUrl('Admin\Admin\AdminLimitController@getIndex')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'), [], false);
    }


}
