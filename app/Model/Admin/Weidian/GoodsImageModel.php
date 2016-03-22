<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsImageModel.php: 微店商品图片模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class GoodsImageModel extends BaseModel
{
    protected $table = 'weidian_goods_images';

    const INPUT_NAME = 'media';//上传商品图片表单名称

    /**
     * 批量新增商品图片
     *
     * @param $goods_id
     * @param array $images
     * @return bool
     */
    public static function addGoodsImages($goods_id, array $images = [])
    {
        if ( $goods_id > 0 && count($images) > 0 ) {
            foreach ($images as $image) {
                $status = self::addGoodsImage($goods_id, $image);

                if ( $status == false ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 新增商品图片
     *
     * @param $goods_id 商品id
     * @param $image    商品图片
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function addGoodsImage($goods_id, $image)
    {
        if ( $goods_id > 0 && !empty($image) > 0 ) {
            $inser_data = self::create([
                'media'     => $image,
                'goods_id'  => $goods_id,
                'is_sync'   => 2,
            ]);
            return $inser_data->id > 0 ? true : false;
        }
        return false;
    }

    /**
     * 批量更新图片为需要同步
     *
     * @param $goods_images
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateIsSync($goods_images)
    {
        if (!is_array($goods_images)) $goods_images = func_get_args();

        return self::multiwhere(['media' => ['IN', $goods_images]])->update([
            'is_sync' => 1,
        ]) > 0 ? true : false;
    }

    /**
     * 批量更新图片为不需要同步
     *
     * @param $goods_images
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateNotIsSync($goods_images)
    {
        if (!is_array($goods_images)) $goods_images = func_get_args();

        return self::multiwhere(['media' => ['IN', $goods_images]])->update([
            'is_sync' => 2,
        ]) > 0 ? true : false;
    }

    /**
     * 获得当前商品全部图片
     *
     * @param $goods_id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getGoodsImage($goods_id)
    {
        if ($goods_id > 0 ) {
            //获得当前商品全部图片
            return self::multiwhere( [ 'goods_id' => $goods_id])->get();
        }
        return false;
    }

    /**
     * 是否存在商品
     *
     * @param $id 商品图片id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function isWeidianGoodsImages($id)
    {
        if ( $id > 0  ) {
            $goods_table_name           = tableName('weidian_goods');
            $goods_images_table_name    = tableName('weidian_goods_images');

            $image_info =   GoodsImageModel::multiwhere([$goods_images_table_name . '.id' => $id])->
                            join($goods_table_name . ' AS g', $goods_images_table_name . '.goods_id', '=', 'g.id')->
                            select('g.itemid', $goods_images_table_name . '.media')->
                            first();
            return $image_info->itemid > 0 && !empty($image_info->media)  ? $image_info :false;
        }
        return false;
    }
}

