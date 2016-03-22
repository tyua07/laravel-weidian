<?php namespace App\Listeners\Admin\Cache;

use App\Events\Admin\Cache\AdminChildMenuEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class AdminChildMenuListener {

	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param  AdminChildMenuEvent  $event
	 * @return void
	 */
	public function handle(AdminChildMenuEvent $event)
	{
		//
	}

}
