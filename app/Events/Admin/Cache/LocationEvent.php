<?php

// +----------------------------------------------------------------------
// | date: 2015-12-11
// +----------------------------------------------------------------------
// | LocationEvent.php: 后端处理顶级当前位置缓存事件
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Events\Admin\Cache;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use App\Commands\Admin\Cache\LocationCommand;

class LocationEvent extends Event
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
	 * 处理事件
	 *
	 * @return bool
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle()
	{
		\Bus::dispatch(
			new LocationCommand()
		);
		return true;
	}

}
