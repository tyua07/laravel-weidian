<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | CategoryModel.php: 微店商品分类模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin\Weidian;

class CategoryModel extends BaseModel
{
    protected $table = 'weidian_category';

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
                $v->class_name   = self::mergeClassName($v->status);

                //组合状态
                $v->is_sync      = $v->status == 2
                                    ? "<a class='btn btn-danger glyphicon glyphicon-refresh' href='javascript:void(0)' disabled='disabled'> 已经删除</a>"
                                    :
                                    (
                                        self::mergeStatus($v->is_sync) == 'true'
                                        ? "<a class='btn btn-warning glyphicon glyphicon-refresh' href='javascript:void(0)' > 需要同步</a>"
                                        : "<a class='btn btn-success glyphicon glyphicon-ok-circle' href='javascript:void(0)'> 不需要同步</a>"
                                    );

                //组合操作
                if ($v->status == 2){
                    $v->handle       = '<a class="btn btn-primary" disabled="disabled" href="javascript:void(0)" >修改</a>';
                    $v->handle      .= '&nbsp;';
                    $v->handle      .= '<a class="btn btn-danger" disabled="disabled" href="javascript:void(0)" >删除</a>';
                } else {
                    $v->handle       = '<a class="btn btn-primary" href="'.createUrl('Admin\Weidian\CategoryController@getEdit',['id' => $v->id]).'" >修改</a>';
                    $v->handle      .= '&nbsp;';
                    $v->handle      .= '<a class="btn btn-danger" href="javascript:void(0)" onclick="category.deleteCategory(\''.createUrl('Admin\Weidian\CategoryController@postDelete').'\', '.$v->id.')" >删除</a>';
                }


            }
        }
        return $data;
    }

    /**
     * 合并微店已经存在的分类
     *
     * @param array $category_arr
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeWeidianCategory($category_arr = [])
    {
        if (is_array($category_arr) && count($category_arr) > 0 ) {
            foreach ($category_arr as $category) {
                if (self::categoryExists(0, $category['cate_name']) == false ) {
                    $insert_data = self::create([
                        'cate_name' => $category['cate_name'],
                        'cate_id'   => $category['cate_id'],
                        'is_sync'   => 2,
                    ]);
                } else{
                    self::multiwhere( ['cate_name' => $category['cate_name']] )->update([
                        'cate_id' => $category['cate_id'],
                    ]);
                }
            }
        }
    }

    /**
     * 判断分类是否存在
     *
     * @param int $categroy_id
     * @param string $category_name
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function categoryExists($categroy_id = 0, $category_name = '')
    {
        $map = [];

        if ($categroy_id > 0 ) {
            $map['id'] = $categroy_id;
        }
        if (!empty($category_name)) {
            $map['cate_name']   = $category_name;
        }

        if (is_array($map) && count($map) > 0 ) {
            return self::multiwhere($map)->count() > 0 ? true : false;
        }
        return false;
    }

    /**
     * 是否存在商品分类
     *
     * @param $id 商品分类id
     * @return mixed 如果不存在，则返回false，如果存在，则返回数据库里面的分类id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function isWeidianCategory($id)
    {
        if ( $id > 0  ) {
            $cate_id = self::multiwhere( ['id' => $id] )->pluck('cate_id');
            return $cate_id > 0 ? $cate_id :false;
        }
        return false;
    }

    /**
     * 是否存在商品分类
     *
     * @param $id 微店商品分类id
     * @return mixed 如果不存在，则返回false，如果存在，则返回数据库里面的分类id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function isCurrenCategory($cate_id)
    {
        if ( $cate_id > 0  ) {
            $id = self::multiwhere( ['cate_id' => $cate_id] )->pluck('id');
            return $id > 0 ? $id :false;
        }
        return false;
    }

    /**
     * 获得拉取微店分类js event
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getPullEvent()
    {
        return [
            [
            'name'          => 'onClick',//事件
            'function_name' => 'category.pullWeidianCategory',//方法名称
            'params'        => '"'.createUrl('Admin\Weidian\CategoryController@postPull').'"',//参数
            ]
        ];
    }

    /**
     * 获得同步微店分类js event
     *
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getSyncEvent()
    {
        return [
            [
                'name'          => 'onClick',//事件
                'function_name' => 'category.syncWeidianCategory',//方法名称
                'params'        => '"'.createUrl('Admin\Weidian\CategoryController@postSync').'"',//参数
            ]
        ];
    }

    /**
     * 获得全部应该上传到微店的商品分类
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllShoudAddCategory()
    {
        return self::multiwhere(['cate_id' => 0])->get();
    }

    /**
     * 获得全部应该更新到微店的商品分类
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllShoudUpdateCategory()
    {
        return self::multiwhere(['is_sync' => 1])->get();
    }

    /**
     * 更新分类为同步成功
     *
     * @param $id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateCategoryToSyncSuccess($id)
    {
        if ( $id > 0 ) {
            return self::multiwhere(['id' => $id])->update([
                'is_sync' => 2,
            ]) > 0 ? true : false;
        }
        return false;
    }

    /**
     * 软删除商品分类
     *
     * @param $id           分类id
     * @param $cate_id      微店商品分类id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function deleteGoodsCategory($id = 0, $cate_id = 0)
    {
        if ( $id > 0 || $cate_id > 0 ) {

            $map = [];

            if ( $id > 0 ) {
                $map['id'] = $id;
            }
            if ( $cate_id > 0 ) {
                $map['cate_id'] = $cate_id;
            }

            if (count($map) > 0 ) {
                return self::multiwhere($map)->update([
                    'status' => 2,
                ]) > 0 ? true : false;
            }
        }
        return false;
    }
}

