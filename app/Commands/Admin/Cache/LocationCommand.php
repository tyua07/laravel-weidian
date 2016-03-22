<?php

// +----------------------------------------------------------------------
// | date: 2015-12-09
// +----------------------------------------------------------------------
// | LocationCommand.php: 生产后台位置 缓存 命令
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Commands\Admin\Cache;

use App\Commands\Command;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use App\Model\Admin\Admin\AdminMenuModel;

class LocationCommand extends Command implements SelfHandling, ShouldBeQueued
{

	use InteractsWithQueue, SerializesModels;

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Execute the command.
	 *
	 * @return void
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle()
	{
		//生成全部菜单“当前位置缓存”
		self::createAllLocationCache();
	}

	/**
	 * 生成全部菜单“当前位置缓存”
	 *
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	private static function createAllLocationCache()
	{
		$all_menu = AdminMenuModel::getAll();

		if (!empty($all_menu)) {
			foreach ($all_menu as $menu) {
				//生产缓存
				if ($menu->parent_id != 0) AdminMenuModel::mergeLocation($menu->id);
			}
		}
	}

}
