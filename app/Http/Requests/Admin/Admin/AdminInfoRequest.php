<?php

// +----------------------------------------------------------------------
// | date: 2015-07-08
// +----------------------------------------------------------------------
// | AdminInfoRequest.php: 后端用户表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Admin;

use App\Http\Requests\BaseFormRequest;

class AdminInfoRequest extends BaseFormRequest
{

    /**
     * 验证错误规则
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function rules(){
        if($this->get('id') > 0){
            return [
                'admin_name'=> ['required', 'unique:' . tableName('admin_info') . ',admin_name,' . $this->get('id')],
                'password'  => ['regex:[\S{6,}]', 'confirmed'],
                'mobile'    => ['required', 'digits:11'],
                'state'     => ['required', 'in:1,2'],
                'limit_id'  => ['required', 'numeric', 'exists:' . tableName('admin_limit'). ',id'],
            ];
        }else{
            return [
                'admin_name'=> ['required', 'unique:' . tableName('admin_info') ],
                'password'  => ['required', 'regex:[\S{6,}]', 'confirmed'],
                'mobile'    => ['required', 'digits:11'],
                'state'     => ['required', 'in:1,2'],
                'limit_id'  => ['required', 'numeric', 'exists:' . tableName('admin_limit'). ',id'],
            ];
        }
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
            'admin_name.unique'     => trans('validate.admin_name_unique'),
            'password.required'     => trans('validate.password_require'),
            'password.regex'        => trans('validate.password_size_error'),
            'password.confirmed'    => trans('validate.rpassword_confirm_error'),
            'mobile.required'       => trans('validate.mobile_require'),
            'mobile.digits'         => trans('validate.mobile_error'),
            'state.required'        => trans('validate.status_require'),
            'state.in'              => trans('validate.status_error'),
            'limit_id.required'     => trans('validate.role_id_require'),
            'limit_id.numeric'      => trans('validate.role_id_error'),
            'limit_id.exists'       => trans('validate.role_not_exists'),
        ];
    }

}
