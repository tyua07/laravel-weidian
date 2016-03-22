<?php

// +----------------------------------------------------------------------
// | date: 2015-06-28
// +----------------------------------------------------------------------
// | AdminInfoController.php: 后端用户控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Admin\AdminInfoRequest;
use App\Model\Admin\Admin\AdminInfoModel;
use App\Http\Controllers\Admin\BaseController;
use App\Http\Controllers\Admin\HtmlBuilderController;

class AdminInfoController extends BaseController
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
     * 获得后台用户
     *
     * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex(Request $request)
    {
        return  $this->html_builder->
                builderTitle('后台用户列表')->
                builderSchema('id', 'id')->
                builderSchema('admin_name', '管理员名称')->
                builderSchema('limit_name','角色名称')->
                builderSchema('mobile', '手机号码')->
                builderSchema('state_name', '状态')->
                builderSchema('last_login', '最后一次登陆时间')->
                builderSchema('create_date', '创建时间')->
                builderSchema('handle', '操作')->
                builderSearchSchema('admin_name', '管理员名称')->
                builderBotton('增加后台用户', createUrl('Admin\Admin\AdminInfoController@getAdd'))->
                builderJsonDataUrl(createUrl('Admin\Admin\AdminInfoController@getSearch',[ 'limit_id' => $request->id ]))->
                buildLimitNumber([20, 30, 40, 50])->
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
        $search     = $request->get('search', '');
        $sort       = $request->get('sort', 'id');
        $order      = $request->get('order', 'asc');
        $limit      = $request->get('limit',0);
        $offset     = $request->get('offset', config('config.page_limit'));
        $limit_id   = $request->limit_id;

        //admin_info 表名
        $admin_info_table_name = tableName('admin_info');

        //解析params
        parse_str($search);

        //组合查询条件
        $map = [];

        if (!empty($limit_id)) {
            $map[$admin_info_table_name . '.limit_id'] = $limit_id;
        }
        if (!empty($admin_name)) {
            $map[$admin_info_table_name . '.admin_name'] = ['like','%'.$admin_name.'%'];
        }

        $data = AdminInfoModel::search($map, $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }


    /**
     * 编辑角色
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $infos = AdminInfoModel::find($request->get('id'));

        return  $this->html_builder->
                builderTitle('编辑后台用户')->
                builderFormSchema('admin_name', '管理员名称', $type = 'text')->
                builderFormSchema('password', '登录密码', $type = 'password', '', '', '', '')->
                builderFormSchema('password_confirmation', '确认密码', $type = 'password', '', '', '', '')->
                builderFormSchema('limit_id', '角色', $type = 'select', $default = '', $notice = '', $class = '', $rule = '*', $err_message = '', AdminInfoModel::adminInfoLimitName(), '', 'name')->
                builderFormSchema('mobile', '手机', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('state', '状态', 'radio', '', '', '', '', '', [1=>'开启', '2'=>'关闭'] ,$infos->state)->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminInfoController@postEdit'), 'btn btn-success')->
                builderEditData($infos)->
                builderEdit();
    }

    /**
     * 处理更新角色
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(AdminInfoRequest $request)
    {

        $data   = $request->except('password_confirmation');

        $Model  = AdminInfoModel::findOrFail($data['id']);

        if (empty($data['password'])) {
            $data['password'] =$Model->password;
        }else{
            $data['password'] = bcrypt($data['password']);
        }

        $Model->update($data);
        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Admin\AdminInfoController@getIndex'));
    }


    /**
     * 增加后台用户
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return  $this->html_builder->
                builderTitle('添加后台用户')->
                builderFormSchema('admin_name', '管理员名称', $type = 'text')->
                builderFormSchema('password', '登录密码', $type = 'password')->
                builderFormSchema('password_confirmation', '确认密码', $type = 'password')->
                builderFormSchema('limit_id', '角色', $type = 'select', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', AdminInfoModel::adminInfoLimitName(),'0','name')->
                builderFormSchema('mobile', '手机', $type = 'text', $default = '',  $notice = '', $class = '', $rule = '', $err_message = '', $option = '', $option_value_schema = '')->
                builderFormSchema('state', '状态', 'radio', '', '', '', '', '', [1=>'开启', '2'=>'关闭'] ,'1')->
                builderConfirmBotton('确认', createUrl('Admin\Admin\AdminInfoController@postAdd'), 'btn btn-success')->
                builderAdd();
    }

    /**
     * 添加后台用户
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(AdminInfoRequest $request)
    {
        $data = $request->except('password_confirmation');

        $data['password'] = bcrypt($data['password']);
        //写入数据
        $affected_number = AdminInfoModel::create($data);

        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success'), [], true, createUrl('Admin\Admin\AdminInfoController@getIndex')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'), [], false);
    }

    /**
     * 搜索后台用户
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getSearchOnes(Request $request)
    {
        $admin_name = trim($request->get('admin_name'));
        //todo request

        $admin_list = AdminInfoModel::multiwhere(['admin_name' => ['like', '%' . $admin_name . '%'] ])->select('admin_name', 'id')->get();
        return !empty($admin_list) ? $this->response(self::SUCCESS_STATE_CODE, '', $admin_list) : $this->response(self::ERROR_STATE_CODE, trans('response.search_empty'));
    }


}
