<?php

// +----------------------------------------------------------------------
// | date: 2016-03-19
// +----------------------------------------------------------------------
// | DeleteCategoryRequest.php: 后端删除微店商品分类表单验证
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests\Admin\Weidian;

use App\Http\Requests\BaseFormRequest;

class DeleteCategoryRequest extends BaseFormRequest
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
            'id.required'    => '分类不能为空',
        ];
    }
}
