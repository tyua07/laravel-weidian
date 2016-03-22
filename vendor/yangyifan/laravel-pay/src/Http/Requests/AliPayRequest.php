<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | AliPayRequest.php: 后端支付宝支付表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Http\Requests;

class AliPayRequest extends BaseFormRequest
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
            'body'          => [''],
            'price'         => ['required', 'numeric', 'min:0'],
            'order_sn'      => ['required'],
            'subject'       => ['required'],
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
            'price.required'    => '价格不能为空',
            'price.numeric'     => '价格格式不正确',
            'price.min'         => '价格不能小于0',
            'order_sn.required' => '订单编号不能为空',
            'subject.required'  => '订单标题不能为空',
        ];
    }

}
