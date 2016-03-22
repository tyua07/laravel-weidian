<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsSKUObserver.php: 微店商品SKU观察者
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Observer\Weidian;

use App\Model\Admin\Weidian\GoodsCategoryModel;
use App\Model\Admin\Weidian\GoodsDescModel;
use App\Model\Admin\Weidian\GoodsModel;

class GoodsObserver
{
    /**
     * 更新商品时操作，更新商品为需要更新和更新商品简介
     *
     * @param $model
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function saved($model)
    {
        //新增商品分类关联
        GoodsCategoryModel::addGoodsCategorys($model->id, $_POST['category_id']);

        return GoodsDescModel::addGoodsDesc($model->id, $_POST['desc_item_desc']);
    }

}