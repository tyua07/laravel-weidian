<?php

// +----------------------------------------------------------------------
// | date: 2015-12-11
// +----------------------------------------------------------------------
// | AdminChildMenuEvent.php: 后端处理子级菜单缓存事件
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Events\Admin\Cache;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use App\Commands\Admin\Cache\AdminChildMenuCommand;

class AdminChildMenuEvent extends Event
{

	use SerializesModels;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function __construct()
	{

	}

	/**
	 * 调用事件
	 *
	 * @return bool
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle()
	{
		\Bus::dispatch(
			new AdminChildMenuCommand()
		);
		return true;
	}

}
