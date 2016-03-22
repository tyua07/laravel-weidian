<?php

// +----------------------------------------------------------------------
// | date: 2016-03-19
// +----------------------------------------------------------------------
// | GoodsRequest.php: 微店商品表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Weidian;

use App\Http\Requests\BaseFormRequest;

class GoodsRequest extends BaseFormRequest
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
                'item_name' => ['required', 'unique:' . tableName('weidian_goods') . ',item_name,' . $this->get('id')],
            ];
        }else{
            return [
                'item_name' => ['required', 'unique:' . tableName('weidian_goods') ],
            ];
        }
    }

//'goods_name'        => ['required', 'unique:'. tableName('product') .',goods_name,' . $this->get('id')],
//'category_id'       => ['required', 'array', 'exists:'. tableName('product_category') .',id'],
//'region_id'         => ['required_without:shop_desc', 'numeric', 'exists:'. tableName('region') . ',id'],
//    //'price_sales'       => ['required', 'min:0', 'numeric'],
//    //'price_market'      => ['required', 'min:0', 'numeric'],
//'state'             => ['required', 'in:1,2'],
//'sort'              => [/*'required',*/ 'digits_between:0,255'],

    /**
     * 验证错误提示
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function messages()
    {
        return [
            'item_name.required'    => '商品名称不能为空',
            'item_name.unique'      => '商品名称不能重复',
            'sort_num.required'     => '排序不能为空',
            'sort_num.regex'        => '排序格式不正确',
        ];
    }

}
