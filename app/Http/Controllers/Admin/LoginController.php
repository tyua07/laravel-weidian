<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | LoginController.php: 后端登录控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin;

use App\Http\Requests;
use App\Model\Admin\Admin\AdminInfoModel;
use App\Http\Requests\Admin\LoginFormRequest;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Model\Admin\Admin\AdminMenuModel;

class LoginController extends BaseController
{

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(Request $request)
    {
        parent::__construct();
        //判断是否已经登录
        if(isAdminLogin() > 0 ) redirect()->action('Admin\HomeController@getIndex')->send();
    }

	/**
	 * 登录操作
     *
	 * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function getIndex()
    {
        //触发登陆后台之后必要的缓存
        self::triggerCreateCache();
        return view('admin.login.login');
	}

    /**
     * 触发登陆后台之后必要的缓存 （异步事件，不需要担心响应）
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function triggerCreateCache()
    {
        //触发全部菜单缓存
        AdminMenuModel::triggerAllMenuCache();
    }

	/**
	 * 处理登录操作
	 *
	 * @return Response
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function postLogin(LoginFormRequest $request)
    {

        $data           = $request->all();
        $data['ip']     = $request->ip();
        $login_status   = AdminInfoModel::login($data);

        switch ($login_status) {
            case AdminInfoModel::LOGIN_SUCCESS:
                return $this->response(self::SUCCESS_STATE_CODE, trans('response.success'), [], true, createUrl('Admin\Admin\AdminInfoController@getIndex'),[
                    'menu_id'   => AdminMenuModel::DEFAULT_USER_TOP_MENY_ID,//设置登录后的顶级菜单id为19
                ]);
            case AdminInfoModel::ACCOUNT_NOT_EXISTS:
            case AdminInfoModel::ACCOUNT_PASSWORD_ERRPR:
                return $this->response(self::ERROR_STATE_CODE, trans('response.admin_not_exists'));
            case AdminInfoModel::ACCOUNT_ERROR:
                return $this->response(self::ERROR_STATE_CODE, trans('response.admin_disable'));

        }

        //登陆失败
        return $this->response(self::ERROR_STATE_CODE, trans('response.unauthorized'));
	}

}
