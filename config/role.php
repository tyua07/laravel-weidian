<?php

// +----------------------------------------------------------------------
// | date: 2015-09-28
// +----------------------------------------------------------------------
// | role.php: 角色配置文件
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


return [

    //各种角色id
    'LIMIT_ID' => [
        'SUPER_ADMIN_LIMIT_ID'               => 1,//超级管理员角色id
        'ADMIN_LIMIT_ID'                     => 4,//管理员角色id
        'Director_Of_Operations'             => 5,//运营总监
        'GENERAL_LIMIT_ID'                   => 9,//城市-总站长角色id
        'OTHER_STATION_LIMIT_ID'             => 10,//分站长角色id
        'DELIVERY_LIMIT_ID'                  => 3,//配送员角色id
        'Service_Supervisor'                 => 7,//运营-客服主管角色id
        'Service_Supervisor1'                => 8,//运营-客服角色id
        'diaodu_limit_id'                    => 11,//总站调度
        'Editor_in_Chief'                    => 19,//总编辑
        'zong-zhanzhang'                     => 20,//总部-总站长
        'city_director'                      => 17,//城市-总监
        'review'                             => 20,//商品审核
        'DB_ZONG'                            => 23,//BD经理
        'DB_QUYU_ZONG'                       => 24,//BD区域经理
        'DB'                                 => 25,//BD专员
        'SHUJUFENXI'                         => 22,//数据分析
        'Service_Supervisor2'                => 28,//运营-客服主管角色id
        'Service_Supervisor3'                => 30,//运营-客服经理角色id
        'personnel'                          => 27,//人事
        'finance'                            => 13,//财务
        'Outsourcing_Service_Supervisor'     => 32,//外包客服
    ],

    //各种特殊会员 user_id
    'USER_ID' => [
        'qy'=>'43987',
    ],
];
