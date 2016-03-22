<?php

// +----------------------------------------------------------------------
// | date: 2015-12-11
// +----------------------------------------------------------------------
// | LoginEvent.php: 后端登陆事件
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Events\Admin\Login;

use App\Events\Event;
use App\Model\Admin\Admin\AdminInfoModel;
use Illuminate\Queue\SerializesModels;

class LoginEvent extends Event
{

	use SerializesModels;

	private $user_info;

	/**
	 * Create a new event instance.
	 *
	 * @return void
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function __construct($user_info)
	{
		$this->user_info = $user_info;
	}

	/**
	 * 登陆成功触发事件
	 *
     * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle()
	{
		//更新用户信息
		AdminInfoModel::updateAdminInfo($this->user_info);

        return true;
	}

}
