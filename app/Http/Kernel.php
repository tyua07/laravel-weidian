<?php namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel {

	/**
	 * The application's global HTTP middleware stack.
	 *
	 * @var array
	 */
	protected $middleware = [
			\Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
			\App\Http\Middleware\EncryptCookies::class,
			\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
			\Illuminate\Session\Middleware\StartSession::class,
			\Illuminate\View\Middleware\ShareErrorsFromSession::class,
			//\App\Http\Middleware\VerifyCsrfToken::class,,
			\App\Http\Middleware\Admin\TrimMiddleware::class,//http trim中间件
			\LucaDegasperi\OAuth2Server\Middleware\OAuthExceptionHandlerMiddleware::class,//OAuth
	];

	/**
	 * The application's route middleware.
	 *
	 * @var array
	 */
	protected $routeMiddleware = [
		'auth' 							=> \App\Http\Middleware\Authenticate::class,
		'auth.basic' 					=> \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
		'guest' 						=> \App\Http\Middleware\RedirectIfAuthenticated::class,
		'admin.base'					=> \App\Http\Middleware\Admin\BaseMiddleware::class,
		'oauth' 						=> \LucaDegasperi\OAuth2Server\Middleware\OAuthMiddleware::class,//OAuth
		'oauth-user'					=> \LucaDegasperi\OAuth2Server\Middleware\OAuthUserOwnerMiddleware::class,//OAuth
		'oauth-client' 					=> \LucaDegasperi\OAuth2Server\Middleware\OAuthClientOwnerMiddleware::class,//OAuth
		'check-authorization-params' 	=> \LucaDegasperi\OAuth2Server\Middleware\CheckAuthCodeRequestMiddleware::class,//OAuth
	];

}
