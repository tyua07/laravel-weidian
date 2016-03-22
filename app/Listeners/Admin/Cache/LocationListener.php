<?php namespace App\Listeners\Admin\Cache;

use App\Events\Admin\Cache\LocationEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class LocationListener {

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
	 * @param  LocationEvent  $event
	 * @return void
	 */
	public function handle(LocationEvent $event)
	{
		//
	}

}
