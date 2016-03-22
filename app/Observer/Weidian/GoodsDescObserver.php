<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsDescObserver.php: 微店商品介绍观察者
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Observer\Weidian;

use App\Model\Admin\Weidian\GoodsDescModel;
use App\Model\Admin\Weidian\GoodsModel;

class GoodsDescObserver
{
    /**
     * 更新商品简介时操作，更新商品为需要更新和更新商品简介
     *
     * @param $model
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function saved($model)
    {
        return GoodsModel::updateToIsSync($model->goods_id);
    }

}