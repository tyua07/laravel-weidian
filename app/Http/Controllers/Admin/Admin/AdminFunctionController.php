<?php

// +----------------------------------------------------------------------
// | date: 2015-09-21
// +----------------------------------------------------------------------
// | AdminFunctionController.php: 后台函数控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Model\Admin\Admin\AdminFunctionModel;
use App\Model\Admin\Admin\AdminLimitFunctionModel;
use App\Http\Controllers\Admin\BaseController;
use App\Http\Controllers\Admin\HtmlBuilderController;

class AdminFunctionController extends BaseController
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
     * 获得后台函数
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return  $this->html_builder->
                builderTitle('后台函数列表')->
                builderSchema('id', 'id')->
                builderSchema('function_name', '函数名称')->
                builderSchema('handle', '操作')->
                builderBotton('添加权限函数', createUrl('Admin\Admin\AdminFunctionController@getAdd'))->
                builderTreeData(AdminFunctionModel::getAll())->
                builderTree();
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

        $data = AdminFunctionModel::search($map = [], $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }


    /**
     * 编辑函数
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $info = AdminFunctionModel::find($request->get('id'));
        return  $this->html_builder->
                builderTitle('权限函数')->
                builderFormSchema('function_name', '函数名称', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('parent_id', '父级函数', $type = 'select', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '',AdminFunctionModel::getAllFunctionName('function_name', $info->id), $info->parent_id,'function_name')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminFunctionController@postEdit'), 'btn btn-success')->
                builderEditData($info)->
                builderEdit();
    }

    /**
     * 处理更新函数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(Request $request)
    {
        $data   = $request->all();
        $Model  = AdminFunctionModel::findOrFail($data['id']);

        $Model->update($data);
        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Admin\AdminFunctionController@getIndex'));
    }


    /**
     * 增加后台函数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return  $this->html_builder->
                builderTitle('添加后台用户')->
                builderFormSchema('function_name', '函数名称', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('parent_id', '父级函数', $type = 'select', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '',AdminFunctionModel::getAllFunctionName('function_name'),'','function_name')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminFunctionController@postAdd'), 'btn btn-success')->
                builderAdd();
    }

    /**
     * 增加后台函数
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(Request $request)
    {
        $data = $request->all();
        //写入数据
        $affected_number = AdminFunctionModel::create($data);

        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success'), [], true, createUrl('Admin\Admin\AdminFunctionController@getIndex')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'), [], false);
    }

    /**
     * 获得当前用户函数权限
     *
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getLimitFunc(Request $request){
        $limit_id = $request->get('limit_id');
        return view('admin.admin.function.index', [
            'all_user_function' => AdminFunctionModel::getFullUserFunction($limit_id),
            'limit_id'          => $limit_id,
        ]);
    }

    /**
     * 编辑用户函数
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postUpdateLimitFunction(Request $request){
        $status = AdminLimitFunctionModel::updateUserLimitMenu($request->get('function_id'), $request->get('limit_id', null));
        return $status == true ? $this->response($code = self::SUCCESS_STATE_CODE, $msg = trans('response.update_user_access_success')) : $this->response(self::ERROR_STATE_CODE, trans('response.update_user_access_error'));

    }

}
