<?php namespace App\Http\Middleware\Admin;

use Closure;
use Validator;
use Request;

class TrimMiddleware {

	/**
	 * 清除request对象的空格
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$data = $request->all();
		array_walk($data, function(&$value){
			if (is_string($value)) $value = trim($value);
		});

		$request->merge($data);
		return $next($request);
	}

}
