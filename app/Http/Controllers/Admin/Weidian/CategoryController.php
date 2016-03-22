<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | CategoryController.php: 微店商品分类控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Weidian;

use App\Http\Controllers\Admin\HtmlBuilderController;
use Illuminate\Http\Request;
use App\Model\Admin\Weidian\CategoryModel;
use App\Http\Requests\Admin\Weidian\CategoryRequest;
use App\Http\Requests\Admin\Weidian\DeleteCategoryRequest;
use App\Model\Admin\MergeModel;

class CategoryController extends BaseController
{
    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 分类列表页
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return  (new HtmlBuilderController())->
                builderTitle('分类列表')->
                builderSchema('id', 'id')->
                builderSchema('cate_name', '分类名称')->
                builderSchema('sort_num','排序')->
                builderSchema('is_sync', '是否需要同步', false)->
                builderSchema('created_at', '创建时间')->
                builderSchema('updated_at', '更新时间')->
                builderSchema('handle', '操作')->
                builderSearchSchema('cate_name', '分类名称')->
                builderSearchSchema($name = 'status', $title = '是否开启', $type = 'select', '', $class = '', $option = MergeModel::mergeStatusForSelect(), 1, 'name')->
                builderBotton('增加 微店商品分类', createUrl('Admin\Weidian\CategoryController@getAdd'), 'glyphicon glyphicon-plus')->
                builderBotton('pull 微店商品分类', '', 'glyphicon glyphicon-download', CategoryModel::getPullEvent())->
                builderBotton('同步 微店商品分类', '', 'glyphicon glyphicon-refresh', CategoryModel::getSyncEvent())->
                builderJsonDataUrl(createUrl('Admin\Weidian\CategoryController@getSearch'))->
                buildLimitNumber([20, 30, 40, 50])->
                loadScription('dist/weidian/category.js')->
                builderList();
    }

    /**
     * 搜索
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getSearch(Request $request)
    {
        //接受参数
        $search     = $request->get('search', '');
        $sort       = $request->get('sort', 'id');
        $order      = $request->get('order', 'asc');
        $limit      = $request->get('limit',0);
        $offset     = $request->get('offset', config('config.page_limit'));

        //解析params
        parse_str($search);

        //组合查询条件
        $map = [];

        if (!empty($cate_name)) {
            $map['cate_name'] = ['LIKE', '%' . $cate_name . '%'];
        }
        if ( $status > 0 ) {
            $map['status'] = $status;
        }

        $data = CategoryModel::search($map, $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }

    /**
     * 编辑分类
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $infos = CategoryModel::find($request->get('id'));

        return  (new HtmlBuilderController())->
                builderTitle('编辑商品分类')->
                builderFormSchema('cate_name', '分类名称')->
                builderFormSchema('sort_num', '排序', $type = 'text', $default = '255',  $notice = '排序规则按照越小的越在前面')->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\CategoryController@postEdit'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\CategoryController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderEditData($infos)->
                builderEdit();
    }

    /**
     * 处理更新分类
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(CategoryRequest $request)
    {
        $data   = $request->all();
        $Model  = CategoryModel::findOrFail($data['id']);

        $Model->fill($data);

        //如果修改了数据，则把当前分类修改成需要同步的数据
        if ($Model->isEqual(['cate_name', 'sort_num']) == false) {
            $Model->is_sync = 1;
        }
        $Model->save();
        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Weidian\CategoryController@getIndex'));
    }

    /**
     * 增加分类
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return  (new HtmlBuilderController())->
                builderTitle('添加商品分类')->
                builderFormSchema('cate_name', '分类名称')->
                builderFormSchema('sort_num', '排序', $type = 'text', $default = '255',  $notice = '排序规则按照越小的越在前面')->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\CategoryController@postAdd'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\CategoryController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderAdd();
    }

    /**
     * 添加分类
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(CategoryRequest $request)
    {
        //写入数据
        $affected_number = CategoryModel::create($request->all());

        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'));
    }

    /**
     * 拉取微店分类数据
     *
     * @return
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postPull()
    {
        $result = $this->send(self::GET_API_URL, [
            'param'     => '{}',
            'public'    => '{"method":"vdian.shop.cate.get"}',
        ]);
        if ($result !== false) {
            CategoryModel::mergeWeidianCategory($result);
            return $this->response(self::SUCCESS_STATE_CODE, '拉取微店信息成功', [], true , createUrl('Admin\Weidian\CategoryController@getIndex'));
        }
        return $this->response(self::ERROR_STATE_CODE, '拉取微店信息失败');
    }

    /**
     * 同步商品分类数据
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postSync()
    {
        //获得全部添加更新到微店的商品分类
        $this->addGoodsCategory();
        //获得全部需要更新到微店的商品分类
        $this->updateGoodsCategory();
        //拉取分类信息
        $this->postPull();

        return $this->response(self::SUCCESS_STATE_CODE, '同步微店商品分类信息成功', [], true , createUrl('Admin\Weidian\CategoryController@getIndex'));
    }

    /**
     * 新增商品分类
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function addGoodsCategory()
    {
        //获得全部需要更新到微店的商品分类
        $all_category = CategoryModel::getAllShoudAddCategory();

        if ( count($all_category) > 0 ) {
            $cates = [];

            foreach ($all_category as $category) {
                $cates[] = [
                    'cate_name' => $category->cate_name,
                    'sort_num'  => $category->sort_num,
                ];
            }
            if ( count($cates) > 0 ) {
                $result = $this->send(self::GET_API_URL, [
                    'param'     => json_encode(['cates' => $cates]),
                    'public'    => '{"method":"vdian.shop.cate.add"}',
                ]);

                if ($result !== false ) {
                    foreach ($all_category as $cate_info) {
                        CategoryModel::updateCategoryToSyncSuccess($cate_info->id);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 更新全部商品分类
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function updateGoodsCategory()
    {
        //获得全部需要更新到微店的商品分类
        $all_category = CategoryModel::getAllShoudUpdateCategory();

        if ( count($all_category) > 0 ) {
            $cates = [];

            foreach ($all_category as $category) {
                $cates[] = [
                    'cate_name' => $category->cate_name,
                    'sort_num'  => $category->sort_num,
                    'cate_id'   => $category->cate_id,
                ];
            }
            if ( count($cates) > 0 ) {
                $result = $this->send(self::GET_API_URL, [
                    'param'     => json_encode(['cates' => $cates]),
                    'public'    => '{"method":"vdian.shop.cate.update"}',
                ]);

                if ($result !== false ) {
                    foreach ($all_category as $cate_info) {
                        CategoryModel::updateCategoryToSyncSuccess($cate_info->id);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 删除商品分类
     *
     * @param DeleteCategoryRequest $request
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postDelete(DeleteCategoryRequest $request)
    {
        //商品分类的id
        $category_ids = $request->get('id');

        if (is_array($category_ids) && count($category_ids) > 0 ) {
            foreach ($category_ids as $category_id) {
                $status = $this->deleteOnes($category_id);

                if ($status === false) {
                    return $this->response(self::ERROR_STATE_CODE, '删除商品分类失败');
                }
            }
        } elseif ( $category_ids > 0 ) {
            $status = $this->deleteOnes($category_ids);

            if ($status === false) {
                return $this->response(self::ERROR_STATE_CODE, '删除商品分类失败');
            }
        }
        return $this->response(self::SUCCESS_STATE_CODE, '删除商品分类成功');
    }

    /**
     * 删除单个商品分类
     *
     * @param $category_id 商品分类id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function deleteOnes($category_id)
    {
        $cate_id = CategoryModel::isWeidianCategory($category_id);

        if ( $cate_id != false ) {

            //商品分类，不能删除
            if ($cate_id == 73238008) {
                return true;
            }
            $result = $this->send(self::GET_API_URL, [
                'param'     => json_encode(['cate_id' => $cate_id]),
                'public'    => '{"method":"vdian.shop.cate.delete"}',
            ]);

            if ($result === false) {
                return false;
            }
            return CategoryModel::deleteGoodsCategory($category_id);
        }
        return CategoryModel::deleteGoodsCategory($category_id);
    }

}
