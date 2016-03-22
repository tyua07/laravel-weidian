<?php

// +----------------------------------------------------------------------
// | date: 2015-06-22
// +----------------------------------------------------------------------
// | BaseFormRequest.php: 后端表单验证基础
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\Pay\Http\Requests;

use App\Http\Requests\Request;
use Illuminate\Http\Response;

class BaseFormRequest extends Request
{

    const ERROR_STATE_CODE      = 1;
    const SUCCESS_STATE_CODE    = 0;

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

        return (new Response($this->responseContent(self::ERROR_STATE_CODE, $errors[0][0], $data = [], $target = false, $href = ''), 200));
    }

    /**
     * 获得 响应内容
     *
     * @param int $code
     * @param string $msg
     * @param array $data
     * @param bool|true $target
     * @param string $href
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function responseContent($code = self::SUCCESS_STATE_CODE, $msg = '', $data = [], $target = true, $href = '')
    {
        return json_encode(compact('code', 'msg', 'data', 'target', 'href'));
    }

}
