<?php

// +----------------------------------------------------------------------
// | date: 2015-06-22
// +----------------------------------------------------------------------
// | BaseFormRequest.php: 后端表单验证基础
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Requests;

use App\Http\Controllers\BaseController;

class BaseFormRequest extends Request
{

    /**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
    {
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [];
	}

    /**
     * 重写validate 响应
     *
     * @param array $errors
     * @param object BaseController
     * @return \Symfony\Component\HttpFoundation\Response|void
     */
    public function response(array $errors)
    {
        $errors = array_values($errors);

        return (new BaseController())->response($code = BaseController::ERROR_STATE_CODE, $errors[0][0], $data = [], $target = false, $href = '');
    }

}
