<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | AliPayRequest.php: 后端支付宝支付表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Http\Requests;

class BuildControllerRequest extends BaseFormRequest
{

    /**
     * 验证错误规则
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function rules()
    {
        return [
            'file_name'     => ['required'],
            'namespace'     => [''],
            'use_array'     => ['Array'],
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
            'file_name.required'    => '文件名称不能为空',
            'namespace.numeric'     => '命名空间不能为空',
            'use_array.Array'       => '命名空间格式不正确',
        ];
    }

}
