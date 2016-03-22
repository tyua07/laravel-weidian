<?php

// +----------------------------------------------------------------------
// | date: 2015-09-18
// +----------------------------------------------------------------------
// | AdminMenuController.php: 后台菜单控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Model\Admin\Admin\AdminMenuModel;
use App\Model\Admin\Admin\AdminLimitMenuModel;
use App\Http\Controllers\Admin\BaseController;
use App\Http\Controllers\Admin\HtmlBuilderController;

class AdminMenuController extends BaseController
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
     * 获得后台菜单
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return  $this->html_builder->
                builderTitle('后台菜单列表')->
                builderSchema('id', 'id')->
                builderSchema('menu_name', '菜单名称')->
                builderSchema('parent_name','父级菜单名称')->
                builderSchema('handle', '操作')->
                builderBotton('增加后台菜单', createUrl('Admin\Admin\AdminMenuController@getAdd'))->
                builderTreeData(AdminMenuModel::getAll())->
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

        $data = AdminInfoModel::search($map = [], $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }


    /**
     * 编辑菜单
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $info = AdminMenuModel::find($request->get('id'));

        return  $this->html_builder->
                builderTitle('编辑后台菜单')->
                builderFormSchema('menu_name', '菜单名称', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('parent_id', '父级菜单', $type = 'select', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '',AdminMenuModel::getAllParentName('menu_name', $info->id), $info->parent_id,'menu_name')->
                builderFormSchema('menu_url', '菜单URL', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('sort', '排序', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminMenuController@postEdit'), 'btn btn-success')->
                builderEditData($info)->
                builderEdit();
    }

    /**
     * 处理更新菜单
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(Request $request)
    {

        $data   = $request->all();
        $Model  = AdminMenuModel::findOrFail($data['id']);
        $Model->update($data);
        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Admin\AdminMenuController@getIndex'));
    }


    /**
     * 增加后台菜单
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return  $this->html_builder->
                builderTitle('添加后台用户')->
                builderFormSchema('menu_name', '菜单名称', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('parent_id', '父级菜单', $type = 'select', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '',AdminMenuModel::getAllParentName('menu_name'),'','menu_name')->
                builderFormSchema('menu_url', '菜单URL', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('sort', '排序', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminMenuController@postAdd'), 'btn btn-success')->
                builderAdd();
    }

    /**
     * 添加后台菜单
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(Request $request)
    {
        $data = $request->all();
        //写入数据
        $affected_number = AdminMenuModel::create($data);
        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success'), [], true, createUrl('Admin\Admin\AdminMenuController@getIndex')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'), [], false);
    }

    /**
     * 获得当前用户菜单权限
     *
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getLimitMenu(Request $request){
        $limit_id = $request->get('limit_id');
        return view('admin.admin.limit.index', [
            'all_user_menu' => AdminMenuModel::getFullUserMenu($limit_id),
            'limit_id'      => $limit_id,
        ]);
    }

    /**
     * 编辑用户菜单
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postUpdateLimitMenu(Request $request)
    {
        $status = AdminLimitMenuModel::updateUserLimitMenu($request->get('menu_id'), $request->get('limit_id', null));
        return $status == true ? $this->response($code = 200, $msg = trans('response.update_user_access_success')) : $this->response(self::ERROR_STATE_CODE, trans('response.update_user_access_error'));
    }

    /**
     * 获得当前角色全部顶级菜单
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdminTopMenu()
    {
        //获得当前用户菜单数据
        $all_menu = AdminMenuModel::getAdminTopMenu();
        return $all_menu != false ? $this->response(self::SUCCESS_STATE_CODE, trans('response.get_menu_success'), $all_menu ) : $this->response(self::ERROR_STATE_CODE, trans('response.get_menu_error'));
    }

    /**
     * 获得当前用户菜单
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdminMenu(Request $request)
    {
        $parent_id  = $request->get('parent_id');
        //获得当前用户菜单数据
        $all_menu   = AdminMenuModel::getAdminMenu($parent_id);

        return $all_menu != false ? $this->response(self::SUCCESS_STATE_CODE, trans('response.get_menu_success'), $all_menu, false, '', [
            'menu_id' => $parent_id,
        ] ) : $this->response(self::ERROR_STATE_CODE, trans('response.get_menu_error'));
    }

}
