<?php

// +----------------------------------------------------------------------
// | date: 2015-12-11
// +----------------------------------------------------------------------
// | LoginListener.php: 后端登陆事件监听
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Listeners\Admin\Login;

use App\Events\Admin\Login\LoginEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class LoginListener implements ShouldBeQueued
{

	use InteractsWithQueue;

	/**
	 * Create the event handler.
	 *
	 * @return void
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param  LoginEvent  $event
	 * @return void
	 * @author yangyifan <yangyifanphp@gmail.com>
	 */
	public function handle(LoginEvent $event)
	{
        //监听事件
        $event->handle();
	}

}
