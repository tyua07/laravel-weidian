<?php

// +----------------------------------------------------------------------
// | date: 2016-03-20
// +----------------------------------------------------------------------
// | GoodsImagesObserver.php: 微店商品图片观察者
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Observer\Weidian;

use App\Model\Admin\Weidian\GoodsModel;

class GoodsImagesObserver
{

    /**
     * 更新商品图片时操作，更新商品为需要更新
     *
     * @param $model
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function saved($model)
    {
        return GoodsModel::updateToIsSync($model->goods_id);
    }

    /**
     * 删除商品图片时操作，更新商品为需要更新
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