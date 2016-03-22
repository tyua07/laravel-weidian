<?php

// +----------------------------------------------------------------------
// | date: 2016-03-19
// +----------------------------------------------------------------------
// | CategoryRequest.php: 微店商品分类表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Weidian;

use App\Http\Requests\BaseFormRequest;

class CategoryRequest extends BaseFormRequest
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
                'cate_name' => ['required', 'unique:' . tableName('weidian_category') . ',cate_name,' . $this->get('id')],
                'sort_num'  => ['required', 'integer'],
            ];
        }else{
            return [
                'cate_name' => ['required', 'unique:' . tableName('weidian_category') ],
                'sort_num'  => ['required', 'integer'],
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
            'cate_name.required'    => '分类名称不能为空',
            'cate_name.unique'      => '分类名称不能重复',
            'sort_num.required'     => '排序不能为空',
            'sort_num.regex'        => '排序格式不正确',
        ];
    }

}
