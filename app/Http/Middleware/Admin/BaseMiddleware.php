<?php

// +----------------------------------------------------------------------
// | date: 2015-12-14
// +----------------------------------------------------------------------
// | BaseMiddleware.php: 后端基础中间件
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Middleware\Admin;

use Closure;
use Cookie;
use App\Http\Controllers\BaseController;
use App\Model\Admin\Admin\AdminLimitFunctionModel;

class BaseMiddleware
{

	private $conrtoller;//基础控制器
    private $route_arr = null;//当前路由数组

	/**
	 * 构造方法
	 *
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function __construct()
	{
		$this->conrtoller = new BaseController();
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle($request, Closure $next)
	{
		//判断 是否登陆
		if (isAdminLogin() > 0) {

			//验证权限
			if ( $this->checkAccess() == true) {
				return $next($request);
			}

			if (isAjax() == true || $request->method() == 'POST') {
				return $this->conrtoller->response(BaseController::UNAUTHORIZED_CODE, trans('response.unauthorized'));
			}
			return redirect()->action('BaseController@getError', ['message' => trans('response.unauthorized')]);

		}
		//如果在后台登陆超时了，是ajax请求，则提示需要登陆！
		elseif (isAjax() == true || $request->method() == 'POST') {
			return $this->conrtoller->response(BaseController::ERROR_STATE_CODE, '', [], true, createUrl("\App\Http\Controllers\Admin\LoginController@getIndex"));
		}

		return redirect()->action('\App\Http\Controllers\Admin\LoginController@getIndex');

	}

	/**
	 * 验证权限
	 *
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	private function checkAccess()
	{
		//获得当前路由
		$action = $this->getCurrentAction();

		$all_user_function  = AdminLimitFunctionModel::getUserFunction();
		$all_function       = \DB::table(tableName('admin_function'))->lists('function_name');

		//如果当前权限，没有设定到权限控制表里面，则返回true
		if (in_array($action['controller'], $all_function)) {
			//
			if (!in_array(implode(BaseController::CONNECTION, $action), $all_function) && in_array($action['controller'], $all_user_function)) {
				return true;
			}

			//
			if (in_array(implode(BaseController::CONNECTION, $action), $all_function) && in_array(implode(BaseController::CONNECTION, $action), $all_user_function)) {
				return true;
			}
			return false;
		}
		return true;
	}

    /**
     * 获取当前控制器与方法
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getCurrentAction()
    {
        if (is_null($this->route_arr)) {
            $action 				= \Route::current()->getActionName();
            list($class, $method) 	= explode(BaseController::CONNECTION, $action);
            $this->route_arr        =  ['controller' => str_replace("App\\Http\\Controllers\\", "", $class), 'method' => $method];
        }
        return $this->route_arr;
    }


}
