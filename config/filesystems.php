<?php

return [

	/*
	|--------------------------------------------------------------------------
	| Default Filesystem Disk
	|--------------------------------------------------------------------------
	|
	| Here you may specify the default filesystem disk that should be used
	| by the framework. A "local" driver, as well as a variety of cloud
	| based drivers are available for your choosing. Just store away!
	|
	| Supported: "local", "s3", "rackspace"
	|
	*/

	'default' => 'local',

	/*
	|--------------------------------------------------------------------------
	| Default Cloud Filesystem Disk
	|--------------------------------------------------------------------------
	|
	| Many applications store files both locally and in the cloud. For this
	| reason, you may specify a default "cloud" driver here. This driver
	| will be bound as the Cloud disk implementation in the container.
	|
	*/

	'cloud' => 's3',

	/*
	|--------------------------------------------------------------------------
	| Filesystem Disks
	|--------------------------------------------------------------------------
	|
	| Here you may configure as many filesystem "disks" as you wish, and you
	| may even configure multiple disks of the same driver. Defaults have
	| been setup for each driver as an example of the required options.
	|
	*/

	'disks' => [

		'local' => [
			'driver' => 'local',
			'root'   => storage_path().'/app',
		],

		's3' => [
			'driver' => 's3',
			'key'    => 'your-key',
			'secret' => 'your-secret',
			'region' => 'your-region',
			'bucket' => 'your-bucket',
		],

		'rackspace' => [
			'driver'    => 'rackspace',
			'username'  => 'your-username',
			'key'       => 'your-key',
			'container' => 'your-container',
			'endpoint'  => 'https://identity.api.rackspacecloud.com/v2.0/',
			'region'    => 'IAD',
			'url_type'  => 'publicURL'
		],

        'qiniu' => [
            'driver'        => 'qiniu',
            'domain'        => '7xk0dl.com1.z0.glb.clouddn.com',//你的七牛域名
            'access_key'    => 'n1gwaFUyiRvkGUWq6H8bZUBTtPdQNuLn8O6KlfMF',//AccessKey
            'secret_key'    => 'eO6hP_gSyjwmv_2VIaXiX_noj2atoC3XiHl-PH5w',//SecretKey
            'bucket'        => 'test',//Bucket名字
            'transport'     => 'http',//如果支持https，请填写https，如果不支持请填写http
        ],

        'upyun' => [
            'driver'        => 'upyun',
            'domain'        => 'yangyifanblog.b0.upaiyun.com',//你的upyun域名
            'username'      => 'test',//UserName
            'password'      => 'testtest',//Password
            'bucket'        => 'yangyifanblog',//Bucket名字
            'timeout'       => 130,//超时时间
            'endpoint'      => null,//线路
            'transport'     => 'http',//如果支持https，请填写https，如果不支持请填写http
        ],

		'oss'	=> [
			'driver'			=> 'oss',
			'accessKeyId'		=> 'k4EzTHjTnR9rWdf2',
			'accessKeySecret' 	=> 'GW4Bej4H2Epferusqfcf99puMejvgm',
			'endpoint'			=> 'oss-cn-hangzhou.aliyuncs.com',
			'isCName'			=> false,
			'securityToken'		=> null,
            'bucket'            => 'womenshuo',
            'timeout'           => '5184000',
            'connectTimeout'    => '10',
			'transport'     	=> 'http',//如果支持https，请填写https，如果不支持请填写http
            'max_keys'          => 1000,//max-keys用于限定此次返回object的最大数，如果不设定，默认为100，max-keys取值不能大于1000
		],
	],

];
