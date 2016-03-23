<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsSKUModel.php: 微店商品SKU模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class GoodsSKUModel extends BaseModel
{
    protected $table = 'weidian_goods_sku';

    /**
     * 搜索
     *
     * @param $map
     * @param $sort
     * @param $order
     * @param $offset
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function search($map, $sort, $order, $limit, $offset)
    {
        return [
            'data' => self::mergeData(
                self::multiwhere($map)->
                orderBy($sort, $order)->
                skip($offset)->
                take($limit)->
                get()
            ),
            'count' => self::multiwhere($map)->count(),
        ];
    }

    /**
     * 组合数据
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeData($data)
    {
        if (!empty($data)) {
            foreach($data as &$v){
                //组合列表col样式，如果是红色，表示已经被软删除
                $v->class_name      = self::mergeClassName($v->status);

                //组合商品状态
                $v->status          = GoodsMergeModel::mergeStatus($v->status);

                //组合操作
                if ($v->status == 2){
                    $v->handle       = '<a class="btn btn-primary" disabled="disabled" href="javascript:void(0)" >修改</a>';
                    $v->handle      .= '&nbsp;';
                    $v->handle      .= '<a class="btn btn-danger" disabled="disabled" href="javascript:void(0)" >删除</a>';
                } else {
                    $v->handle       = '<a class="btn btn-primary" href="'.createUrl('Admin\Weidian\GoodsSKUController@getEdit',['id' => $v->id]).'" >修改</a>';
                    $v->handle      .= '&nbsp;';
                    $v->handle      .= '<a class="btn btn-danger" href="javascript:void(0)" onclick="sku.deleteSKU(\''.createUrl('Admin\Weidian\GoodsSKUController@postDelete').'\', '.$v->id.')" >删除</a>';
                }


            }
        }
        return $data;
    }

    /**
     * 组合 col class 名称
     *
     * @param $state
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function mergeClassName($state)
    {
        if ($state == 2) {
            return self::COL_WARNING;
        } elseif ($state == 3) {
            return self::COL_DANGER;
        }
        return self::COL_DEFAULT;
    }

    /**
     * 批量新增商品SKU信息
     *
     * @param $goods_id                 商品id
     * @param $goods_sku_arr array      SKU数组信息
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function addGoodsSKUs($goods_id, array $goods_sku_arr = [])
    {
        if ( $goods_id > 0 && count($goods_sku_arr) > 0 ) {
            foreach ($goods_sku_arr as $goods_sku) {
                $status = self::addGoodsSKU($goods_id, $goods_sku);

                //更新SKU为不需要同步
                self::updateNotIsSync($goods_sku['id']);

                if ( $status == false ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 新增商品SKU
     *
     * @param $goods_id     商品id
     * @param $goods_sku    商品图片
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function addGoodsSKU($goods_id, $goods_sku)
    {
        if ( $goods_id > 0 && count($goods_sku) > 0 ) {
            $inser_data = self::create([
                'sku_id'            => $goods_sku['id'],
                'title'             => $goods_sku['title'],
                'price'             => $goods_sku['price'],
                'stock'             => $goods_sku['stock'],
                'sku_merchant_code' => $goods_sku['sku_merchant_code'],
                'goods_id'          => $goods_id,
            ]);
            return $inser_data->id > 0 ? true : false;
        }
        return false;
    }

    /**
     * 是否存在商品SKU
     *
     * @param $id 商品SKU id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function isWeidianGoodsSKU($id)
    {
        if ( $id > 0  ) {

            $goods_table_name       = tableName('weidian_goods');
            $goods_sku_table_name   = tableName('weidian_goods_sku');

            $sku_info = self::multiwhere( [$goods_sku_table_name . '.id' => $id] )->
                        join($goods_table_name . ' AS g', $goods_sku_table_name . '.goods_id', '=', 'g.id')->
                        select($goods_sku_table_name . '.sku_id', 'g.itemid')->
                        first();
            return $sku_info->sku_id > 0 && $sku_info->sku_id > 0  ? $sku_info : false;
        }
        return false;
    }

    /**
     * 批量更新SKU为需要同步
     *
     * @param $sku_id_arr
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateIsSync($sku_id_arr)
    {
        if (!is_array($sku_id_arr)) $sku_id_arr = func_get_args();

        return self::multiwhere(['sku_id' => ['IN', $sku_id_arr]])->update([
            'is_sync' => 1,
        ]) > 0 ? true : false;
    }

    /**
     * 批量更新SKU为不需要同步
     *
     * @param $sku_id_arr
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateNotIsSync($sku_id_arr)
    {
        if (!is_array($sku_id_arr)) $sku_id_arr = func_get_args();

        return self::multiwhere(['sku_id' => ['IN', $sku_id_arr]])->update([
            'is_sync' => 2,
        ]) > 0 ? true : false;
    }

    /**
     * 软删除商品SKU
     *
     * @param $id           商品id
     * @param $sku_id       微店商品SKUid
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function deleteGoodsSKU($id = 0, $sku_id = 0)
    {
        if ( $id > 0 || $sku_id > 0 ) {
            $map = [];
            if ( $id > 0 ) {
                $map['id'] = $id;
            }
            if ( $sku_id > 0 ) {
                $map['sku_id'] = $sku_id;
            }
            if (count($map) > 0 ) {
                return self::multiwhere($map)->update([
                    'status' => 3,
                ]) > 0 ? true : false;
            }
        }
        return false;
    }

    /**
     * 获得全部需要更新的商品SKU
     *
     * @param $goods_id     商品id
     * @return \StdClass
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllIsSyncGoodsSku($goods_id)
    {
        if ( $goods_id > 0 ) {
            return  self::multiwhere(['goods_id' => $goods_id, 'status' => ['IN', [1, 2], 'is_sync' => 1, 'sku_id' => ['>', 0] ]])->
                    select(['sku_id AS id', 'title', 'price', 'stock', 'sku_merchant_code'])->
                    get();
        }
        return new \StdClass();
    }
}

