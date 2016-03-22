<?php
namespace App\Http\Requests\Admin\UserInfo;

use App\Http\Requests\BaseFormRequest;

/**
 * +----------------------------------------------------------------------
 * | date: 2016-01-24 14:33:06
 * +----------------------------------------------------------------------
 * | UserInfo1Request.php: 会员Request
 * +----------------------------------------------------------------------
 * | Author: yangyifan <yangyifanphp@gmail.com>
 * +----------------------------------------------------------------------
 */
class UserInfo1Request extends BaseFormRequest {

	/**
	 * 验证错误提示
	 * 
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function messages() {
		return [
			'id.array' => '必须是数组',
			'id.accepted' => '请确认接受服务条款',
			'user_info_id.after' => '当前时间不能小于2020-10-20', 
			'invitee.alpha_dash' => '字母、数字、破折号（-）以及底线（_）', 
			'created_at.between' => '必须在10-20之间', 
			'status.date_format' => '时间格式不正确', 
		];
	}

	/**
	 * 验证错误规则
	 * 
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function rules() {
		if($this->get('id') > 0){ 
			 return [ 
				 'id'=> [ 'array', 'accepted', ], 
				 'user_info_id'=> [ 'after:2020-10-20', ], 
				 'invitee'=> [ 'alpha_dash', ], 
				 'created_at'=> [ 'between:10,20', ], 
				 'status'=> [ 'date_format', ], 
			]; 
		}else{ 
			return [ 
				 'id'=> [ 'array', 'accepted', ], 
				 'user_info_id'=> [ 'after:2020-10-20', ], 
				 'invitee'=> [ 'alpha_dash', ], 
				 'created_at'=> [ 'between:10,20', ], 
				 'status'=> [ 'date_format', ], 
			]; 
		}
	}
}
