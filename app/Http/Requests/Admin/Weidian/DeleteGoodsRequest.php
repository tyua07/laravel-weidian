<?php

// +----------------------------------------------------------------------
// | date: 2016-03-19
// +----------------------------------------------------------------------
// | DeleteCategoryRequest.php: 后端删除微店商品表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Weidian;

use App\Http\Requests\BaseFormRequest;

class DeleteGoodsRequest extends BaseFormRequest
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
            'id' => ['required'],
        ];
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
            'id.required'    => '商品不能为空',
        ];
    }
}