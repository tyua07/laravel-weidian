<?php

// +----------------------------------------------------------------------
// | date: 2015-06-07
// +----------------------------------------------------------------------
// | BaseController.php: 后端基础控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin;

use App\Library\Cache;
use App\Model\Admin\Admin\AdminInfoModel;
use App\Model\Admin\Admin\AdminMenuModel;
use Illuminate\Http\Request;
use Route;
use View;

class BaseController extends \App\Http\Controllers\BaseController
{
    private $request;

    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        $this->request = new Request();
        //显示管理者信息
        $this->showAdminInfo();
        //获得当前位置信息
        $this->getLocation();
        //获得菜单id
        $this->getMenuId();
    }

    /**
     * 显示管理者信息
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function showAdminInfo()
    {
        view()->share('admin_info', AdminInfoModel::getAdminInfoForSession());
    }

    /**
     * 获得当前位置信息
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getLocation()
    {
        //view()->share('location_arr', AdminMenuModel::mergeLocation( AdminMenuModel::getMenuId(implode(self::CONNECTION, $this->getCurrentAction())) ));
    }

    /**
     * 获得菜单id
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function getMenuId()
    {
        view()->share('menu_id', \Cookie::get('menu_id'));
    }

    /**
     * 清除当前缓存
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getClearCache()
    {
        Cache::clearAll();
    }

}
