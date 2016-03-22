<?php namespace App\Listeners\Admin\Cache;

use App\Events\Admin\Cache\AdminTopMenuEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class AdminTopMenuListener {

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
	 * @param  AdminTopMenuEvent  $event
	 * @return void
	 */
	public function handle(AdminTopMenuEvent $event)
	{
		//
	}

}
