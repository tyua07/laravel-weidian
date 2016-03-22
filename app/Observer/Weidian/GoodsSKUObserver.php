<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsSKUObserver.php: 微店商品SKU观察者
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Observer\Weidian;

use App\Model\Admin\Weidian\GoodsModel;
use App\Model\Admin\Weidian\GoodsSKUModel;

class GoodsSKUObserver
{

    /**
     * 更新商品SKU时操作，更新商品为需要更新
     *
     * @param $model
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function saved($model)
    {
        //更新当前SKU为需要同步
        GoodsSKUModel::updateIsSync($model->sku_id);

        return GoodsModel::updateToIsSync($model->goods_id);
    }

    /**
     * 删除商品SKU时操作，更新商品为需要更新
     *
     * @param $model
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function deleted($model)
    {
        return GoodsModel::updateToIsSync($model->goods_id);
    }

}