<?php

// +----------------------------------------------------------------------
// | date: 2015-07-08
// +----------------------------------------------------------------------
// | validate.php: 验证语言包
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


return [
    //公共
    'email_require' => 'email不能为空',
    'email_error'   => '邮箱格式不正确',
    'email_unique'  => '邮箱不能重复',
    'admin_name_require'    => '用户名不能为空',
    'admin_name_unique'    => '用户名不能重复',
    'password_require'  => '密码不能为空',
    'password_size_error'   => '密码格式不正确',
    'rpassword_confirm_error' => '两次密码不一致',
    'role_name_require' => '角色名称不能为空',
    'status_require'    => '状态不能为空',
    'status_error'  => '状态格式不正确',
    'mobile_require'    => '手机号码不能为空',
    'mobile_error'  => '手机号码格式不正确',
    'mobile_unique' => '手机号码不能重复',
    'pid_require'   => '父级不能为空',
    'url_require'   => '链接不能为空',
    'url_error' => '超链接格式不正确',
    'url_unique' => '链接不能重复',
    'sort_require' => '排序不能为空',
    'sort_error' => '排序格式不正确',
    'cat_name_require'  => '分类不能为空',
    'cat_name_error'    => '分类格式不正确',
    'cat_unique'    => '分类不能重复',
    'cat_not_exists'    => '分类不存在',
    'name_reuqire' => '名称不能为空',
    'name_unique' => '名称不能重复',
    'captcha_error' => '验证码不正确',
    'start_require' => '开始时间不能为空',
    'start_error' => '开始时间格式不正确',
    'end_require' => '结束时间不能为空',
    'end_error' => '结束时间格式不正确',
    'end_error1' => '结束时间格式不能小于开始时间',
    'image_reuqire' => '图片不能为空',
    'image_not_exists' => '图片不存在',
    'id_require' => 'id不能为空',


    //后台会员
    'role_id_require'   => '角色不能为空',
    'role_id_error' => '角色格式不正确',
    'role_name_unique' => '角色名称不能为空',
    'role_not_exists' => '角色不存在',
    'admin_require' => '角色不能空',
    'admin_error'   => '角色格式不正确',


    //后台菜单
    'menu_name_require' => '菜单名称不能为空',

    //后台文章分类


    //文章
    'article_title_require' => '文章标题不能为空',
    'article_title_unique'  => '文章标题不能重复',
    'article_category_id_empty'   => '文章分类不能为空',
    'article_category_not_exixts'   => '文章分类不存在',
    'article_category_error'   => '文章分类格式不正确',
    'region_id_empty'   => '地区不能为空',
    'region_name_require'   => '地区名称不能为空',
    'region_name_unqiue'   => '地区名称不能重复',
    'region_not_exixts'   => '地区不存在',
    'region_error'   => '地区格式不正确',

    //网址
    'site_name_require' => '网址名称不能为空',
    'site_name_unique'  => '网址名称不能重复',


    //会员
    'user_name_require' => '用户名不能为空',
    'sex_require' => '性别不能为空',
    'sex_error'  => '性别格式不正确',
    'check_email_require'   => '验证邮箱不能为空',
    'check_email_error'   => '验证邮箱格式错误',
    'check_mobile_require'    => '验证手机号不能为空',
    'check_mobile_error'    => '验证手机号格式错误',
    'birthday_require'  => '生日不能空',
    'birthday_error'    => '生日格式不正确',
    'balance_require'    => '余额不能为空',
    'balance_numeric'    => '余额必须为数字',

    //查询工具

    //邮箱

    //会员消息
    'send_message_reuqire' => '消息不能为空',

    //论坛
    'forum_title_reuquire'=>'标题不能为空',
    'forum_contents_reuqire'=>'内容不能为空',
    'comment_contents_reuqire'  => '回复内容不能为空',
    'forum_require' => '帖子不能为空',
    'forum_error'   => '格式不正确',

    //友情链接
    'link_name_require' =>'友情链接名称不能为空',
    'link_name_unqiue' =>'友情链接名称不能重复',
    'link_url_require'  =>'友情链接URl不能为空',
    'link_url_error'    =>'友情链接URl格式不正确',
    'link_url_unique'   => '友情链接不能重复',
    'link_logo_require' =>'友情链接logo不能为空',
    'link_logo_error'   =>'友情链接logo格式不正确',




];
