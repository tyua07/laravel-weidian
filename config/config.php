<?php

return [

    'site_name' => '后台',
    'version' => 'v 1.0',//后台版本号

    //分页
    'page_limit' => '10',//分页条数
    'order_page_limit' => '50',//订单分页条数

	//redis缓存名称
	'admin_child_menu_cache'    => 'admin_child_menu',
	'admin_top_menu_cache'      => 'admin_top_menu',
	'page_location_cache'      => 'page_location',

	'cache_tag' => [
		'menu' => 'menu'
	],

];
