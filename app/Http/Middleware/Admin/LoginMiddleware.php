<?php namespace App\Http\Middleware\Admin;

use Closure;

use Validator;

use Request;

class LoginMiddleware {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{


		return $next($request);
	}

}
