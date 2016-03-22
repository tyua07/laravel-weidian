<?php namespace App\Http\Controllers\Tools;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;;
use Agent;

class AgentController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function getIndex()
	{

        // 操作系统
        Agent::is('Windows');
        Agent::is('Firefox');
        Agent::is('iPhone');
        Agent::is('OS X');

// 厂商产品定位
        Agent::isAndroidOS();
        Agent::isNexus();
        Agent::isSafari();

// 设备类型
        Agent::isMobile();
        Agent::isTablet();
        Agent::isDesktop();

// 语言
        $languages = Agent::languages();
// ['nl-nl', 'nl', 'en-us', 'en']

// 是否是机器人
        Agent::isRobot();

// 获取设备信息 (iPhone, Nexus, AsusTablet, ...)
        Agent::device();

// 系统信息  (Ubuntu, Windows, OS X, ...)
        echo Agent::platform();

// 浏览器信息  (Chrome, IE, Safari, Firefox, ...)
        Agent::browser();

// 获取浏览器版本
        $browser = Agent::browser();
        $version = Agent::version($browser);

// 获取系统版本
        $platform = Agent::platform();
        $version = Agent::version($platform);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
