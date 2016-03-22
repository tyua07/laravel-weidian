<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsCategoryModel.php: 微店商品分类模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class GoodsCategoryModel extends BaseModel
{
    protected $table = 'weidian_category_goods';

    public $timestamps = false;//开启维护时间戳

    /**
     * 新增商品分类信息
     *
     * @param $goods_id                 商品id
     * @param $goods_category_arr array      商品分类数组
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function addGoodsCategorys($goods_id, $goods_category_arr = [])
    {
        if ( $goods_id > 0 && count($goods_category_arr) > 0 ) {
            //去除重复元素
            $goods_category_arr = array_unique($goods_category_arr);

            //删除当前商品关联的商品分类
            self::deleteGoodsCategory($goods_id);

            foreach ($goods_category_arr as $goods_category) {
                $status = self::addGoodsCategory($goods_id, $goods_category);
            }
            //不管怎么样，只要修改了分类，都修改成需要同步商品
            GoodsModel::updateToIsSync($goods_id);

            return true;
        }
        return false;
    }

    /**
     * 删除当前商品关联的商品分类
     *
     * @param $goods_id 商品id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function deleteGoodsCategory($goods_id)
    {
        if ( $goods_id > 0 ) {
            return self::multiwhere( ['goods_id' => $goods_id] )->delete();
        }
        return false;
    }

    /**
     * 新增商品分类
     *
     * @param $goods_id         商品id
     * @param $category_info    商品分类
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function addGoodsCategory($goods_id, $category_info)
    {
        if ( $goods_id > 0 &&  ( count($category_info) > 0 || is_numeric($category_info)) ) {

            if ( is_numeric($category_info) ) $category_info = CategoryModel::find($category_info);

            //如果当前分类不存在，则添加当前商品分类
            $category_id = CategoryModel::isCurrenCategory($category_info['cate_id']);

            if ( $category_id === false ) {
                $insert_category_info = CategoryModel::create([
                    'cate_id'       => $category_info['cate_id'],
                    'cate_name'     => $category_info['cate_name'],
                    'sort_num'      => $category_info['sort_num'],
                ]);
                $category_id = $insert_category_info->id;
            }

            $inser_data = self::create([
                'category_id'   => $category_id,
                'goods_id'      => $goods_id,
            ]);
            return $inser_data->id > 0 ? true : false;
        }
        return false;
    }

    /**
     * 获得当前商品的全部分类的id数组
     *
     * @param $goods_id 商品id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getGoodsAllCategory($goods_id)
    {
        if ( $goods_id > 0 ) {
            $goods_table_name               = tableName('weidian_goods');
            $category_table_name            = tableName('weidian_category');
            $goods_category_table_name      = tableName('weidian_category_goods');

            return  self::multiwhere([ 'g.id' => $goods_id])->
                    join($category_table_name . ' AS c', $goods_category_table_name . '.category_id', '=', 'c.id')->
                    join($goods_table_name . ' AS g', $goods_category_table_name . '.goods_id', '=', 'g.id')->
                    lists('c.id');
        }
    }

    /**
     * 获得当前商品的全部微店分类的id数组
     *
     * @param $goods_id 商品id
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getGoodsAllCateId($goods_id)
    {
        if ( $goods_id > 0 ) {
            $goods_table_name               = tableName('weidian_goods');
            $category_table_name            = tableName('weidian_category');
            $goods_category_table_name      = tableName('weidian_category_goods');

            return  self::multiwhere([ 'g.id' => $goods_id])->
            join($category_table_name . ' AS c', $goods_category_table_name . '.category_id', '=', 'c.id')->
            join($goods_table_name . ' AS g', $goods_category_table_name . '.goods_id', '=', 'g.id')->
            lists('c.cate_id');
        }
    }

}

