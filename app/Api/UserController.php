<?php

// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | BaseController: 基础控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace  App\Api;

use App\Http\Requests;
use App\Model\Admin\Admin\AdminMenuModel;

class UserController extends BaseController
{
    public function index()
    {
        return AdminMenuModel::all();
    }

    public function show($id)
    {
        return AdminMenuModel::findOrFail($id);
    }
}
