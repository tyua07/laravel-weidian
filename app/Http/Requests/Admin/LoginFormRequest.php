<?php

// +----------------------------------------------------------------------
// | date: 2015-06-22
// +----------------------------------------------------------------------
// | LoginFormRequest.php: 后端登录表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class LoginFormRequest extends BaseFormRequest
{

	/**
	 * 验证错误规则
	 *
	 * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function rules(){
		return [
            'admin_name'    => ['required'],
            'password'      => ['required', 'regex:[\S{6,}]'],
		];
	}

    /**
     * 验证错误提示
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function messages(){
        return [
            'admin_name.required'   => trans('validate.admin_name_require'),
            'password.required'     => trans('validate.password_require'),
            'password.regex'        => trans('validate.password_size_error')
        ];
    }



}
