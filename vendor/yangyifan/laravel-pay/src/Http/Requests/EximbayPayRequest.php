<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | EximbayPayRequest.php: 后端 eximbay 支付表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Http\Requests;

class EximbayPayRequest extends BaseFormRequest
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
            'order_sn'      => ['required'],
            'price'         => ['required', 'numeric', 'min:0'],
            'product'       => ['required'],
            'user_lastname' => ['required'],
            'user_firstname'=> ['required'],
            'user_phone'    => ['required'],
            'user_email'    => ['required', 'email'],
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
            'price.required'                => '价格不能为空',
            'price.numeric'                 => '价格格式不正确',
            'price.min'                     => '价格不能小于0',
            'order_sn.required'             => '订单编号不能为空',
            'product.required'              => '商品名称不能为空',
            'user_lastname.required'        => '用户姓不能为空',
            'user_firstname.required'       => '用户名不能为空',
            'user_phone.required'           => '用户手机不能为空',
            'user_email.user_phone'         => '用户邮箱不能为空',
            'user_email.email'              => '用户邮箱格式错误',
        ];
    }

}
