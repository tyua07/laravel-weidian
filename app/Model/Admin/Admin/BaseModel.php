<?php

// +----------------------------------------------------------------------
// | date: 2015-07-04
// +----------------------------------------------------------------------
// | BaseModel.php: 后台admin公共模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Admin;

class BaseModel extends \App\Model\Admin\BaseModel
{
    protected $guarded  = ['id'];//阻挡所有属性被批量赋值

    const ACCOUNT_NOT_EXISTS        = -1;//账户不存在
    const ACCOUNT_ERROR             = -2;//状态错误
    const ACCOUNT_PASSWORD_ERRPR    = -3;//密码不存在
    const LOGIN_SUCCESS             = 1;//登陆成功
}

