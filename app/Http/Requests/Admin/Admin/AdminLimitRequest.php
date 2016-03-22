<?php

// +----------------------------------------------------------------------
// | date: 2015-12-05
// +----------------------------------------------------------------------
// | AdminLimitRequest.php: 后端角色表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Admin;

use App\Http\Requests\BaseFormRequest;

class AdminLimitRequest extends BaseFormRequest
{

    /**
     * 验证错误规则
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function rules()
    {
        if($this->get('id') > 0) {
            return [
                'limit_name'=> ['required', 'unique:' . tableName('admin_limit') . ',limit_name,' . $this->get('id')],
            ];
        }else{
            return [
                'limit_name'=> ['required', 'unique:' . tableName('admin_limit') ],
            ];
        }
    }

    /**
     * 验证错误提示
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function messages()
    {
        return [
            'limit_name.required'   => trans('validate.role_name_unique'),
            'limit_name.unique'     => trans('validate.role_name_unique'),
        ];
    }

}
