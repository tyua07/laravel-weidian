<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsSKURequest.php: 微店商品SKU表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Weidian;

use App\Http\Requests\BaseFormRequest;

class GoodsSKURequest extends BaseFormRequest
{

    /**
     * 验证错误规则
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function rules()
    {
        if($this->get('id') > 0){
            return [
                'title'     => ['required', 'unique:' . tableName('weidian_goods_sku') . ',title,' . $this->get('id')],
                'price'     => ['required', 'min:0', 'numeric'],
                'stock'     => ['required', 'numeric'],
                'goods_id'  => ['required', 'exists:'. tableName('weidian_goods') .',id'],
            ];
        }else{
            return [
                'title'     => ['required', 'unique:' . tableName('weidian_goods_sku') . ',title,' . $this->get('id')],
                'price'     => ['required', 'min:0', 'numeric'],
                'stock'     => ['required', 'numeric'],
                'goods_id'  => ['required', 'exists:'. tableName('weidian_goods') .',id'],
            ];
        }
    }


//'state'         => ['required', 'in:1,2'],
//'sort'          => ['required', 'digits_between:0,255'],

    /**
     * 验证错误提示
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function messages()
    {
        return [
            'title.required'        => 'SKU名称不能为空',
            'title.unique'          => 'SKU名称不能重复',
            'price.required'        => '价格不能为空',
            'price.min'             => '价格不能小于0元',
            'price.numeric'         => '价格格式错误',
            'stock.required'        => '库存不能为空',
            'stock.numeric'         => '库存格式不正确',
            'goods_id.required'     => '商品不能为空',
            'goods_id.exists'       => '商品不存在',
        ];
    }

}
