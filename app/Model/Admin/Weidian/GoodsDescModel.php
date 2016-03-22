<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsDescModel.php: 微店商品描述模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class GoodsDescModel extends BaseModel
{
    protected $table = 'weidian_goods_desc';

    /**
     * 新增商品描述
     *
     * @param $goods_id     商品id
     * @param $goods_desc    商品描述
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function addGoodsDesc($goods_id, $goods_desc)
    {
        if ( $goods_id > 0 && !empty($goods_desc) ) {
            if ( self::exists($goods_id) == false ) {
                $inser_data = self::create([
                    'item_desc'     => $goods_desc,
                    'goods_id'      => $goods_id,
                ]);
                return $inser_data->id > 0 ? true : false;
            } else {
                $Model = self::multiwhere( ['goods_id' => $goods_id] )->first();
                $Model->fill(['item_desc' => $goods_desc]);
                return $Model->save() > 0 ? true : false ;
            }

        }
        return false;
    }

    /**
     * 商品描述是否存在
     *
     * @param $goods_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function exists($goods_id)
    {
        if ( $goods_id > 0 ) {
            return self::multiwhere( ['goods_id' => $goods_id] )->count() > 0 ? true : false ;
        }
        return false;
    }

    /**
     * 获得商品简介
     *
     * @param $goods_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getGoodsDesc($goods_id)
    {
        if ( $goods_id > 0 ) {
            return self::multiwhere(['goods_id' => $goods_id])->first();
        }
        return false;
    }
}

