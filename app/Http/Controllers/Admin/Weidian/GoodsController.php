<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsController.php: 微店商品控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Weidian;

use App\Http\Controllers\Admin\HtmlBuilderController;
use App\Model\Admin\Weidian\GoodsCategoryModel;
use App\Model\Admin\Weidian\GoodsDescModel;
use App\Model\Admin\Weidian\GoodsImageModel;
use App\Model\Admin\Weidian\GoodsSKUModel;
use App\Observer\Weidian\GoodsObserver;
use App\Observer\Weidian\GoodsDescObserver;
use Illuminate\Http\Request;
use App\Model\Admin\Weidian\GoodsModel;
use App\Model\Admin\Weidian\CategoryModel;
use App\Http\Requests\Admin\Weidian\GoodsRequest;
use App\Http\Requests\Admin\Weidian\DeleteGoodsRequest;
use App\Model\Admin\Weidian\GoodsMergeModel;

class GoodsController extends BaseController
{
    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        //新增商品模型观察者
        GoodsModel::observe(new GoodsObserver());
        GoodsDescModel::observe(new GoodsDescObserver());
    }

    /**
     * 商品列表页
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        return  (new HtmlBuilderController())->
                builderTitle('商品列表')->
                builderSchema('id', 'id')->
                builderSchema('item_name', '商品名称')->
                builderSchema('price', '商品销售价')->
                builderSchema('stock', '商品库存')->
                builderSchema('status', '商品状态')->
                builderSchema('sold', '销售数量')->
                builderSchema('istop', '是否是店长推荐')->
                builderSchema('thumb_imgs', '缩略图')->
                builderSchema('is_sync', '是否需要同步', false)->
                builderSchema('handle', '操作')->
                builderSearchSchema('item_name', '商品名称')->
                builderSearchSchema($name = 'goods_status', $title = '是否开启', $type = 'select', '', $class = '', $option = GoodsMergeModel::mergeStatusForSelect(), 1, 'name')->
                builderBotton('增加 微店商品', createUrl('Admin\Weidian\GoodsController@getAdd'), 'glyphicon glyphicon-plus')->
                builderBotton('pull 微店商品', '', 'glyphicon glyphicon-download', GoodsModel::getPullEvent())->
                builderBotton('同步 微店商品', '', 'glyphicon glyphicon-refresh', GoodsModel::getSyncEvent())->
                builderJsonDataUrl(createUrl('Admin\Weidian\GoodsController@getSearch'))->
                buildLimitNumber([20, 30, 40, 50])->
                loadScription('dist/weidian/goods.js')->
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

        if (!empty($item_name)) {
            $map['item_name'] = ['LIKE', '%' . $item_name . '%'];
        }
        if ( $goods_status > 0 ) {
            $map['goods_status'] = $goods_status;
        }

        $data = GoodsModel::search($map, $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }

    /**
     * 编辑商品
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $infos = GoodsModel::getGoodsInfo($request->get('id'));

        return  (new HtmlBuilderController())->
                builderTitle('编辑商品')->
                builderFormSchema('item_name', '商品名称')->
                builderFormSchema('category_id[]', '商品分类', 'select' )->
                buildFormRule('*')->
                buildFormAttr(['is_copy' => true])->
                buildDataSource( CategoryModel::getAllForSchemaOption('cate_name', 0, false), $infos->category, 'cate_name')->
                builderFormSchema('price', '商品价格')->
                builderFormSchema('stock', '商品库存')->
                builderFormSchema('merchant_code', '商品编码')->
                buildFormRule('')->
                builderFormSchema('desc.item_desc', '商品描述', 'ckeditor', GoodsModel::getCkEditorParams())->
                buildFormRule('')->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\GoodsController@postEdit'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\GoodsController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderEditData($infos)->
                builderEdit();
    }

    /**
     * 处理更新商品
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(GoodsRequest $request)
    {
        $data   = $request->except('category_id', 'desc_item_desc');
        $Model  = GoodsModel::findOrFail($data['id']);

        $Model->fill($data);

        //如果商品信息有修改，则修改当前商品为“需要同步”
        if ($Model->isEqual( ['item_name', 'price', 'stock', 'merchant_code'] ) === false) {
            GoodsModel::updateToIsSync($Model->id);
        }

        $Model->save();

        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), []);
    }

    /**
     * 增加商品
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd()
    {
        return  (new HtmlBuilderController())->
                builderTitle('添加微店商品')->
                builderFormSchema('item_name', '商品名称')->
                builderFormSchema('price', '商品价格')->
                builderFormSchema('stock', '商品库存', 'text', 100)->
                builderFormSchema('merchant_code', '商品编码')->
                buildFormRule('')->
                builderFormSchema('desc.item_desc', '商品描述', 'ckeditor', GoodsModel::getCkEditorParams())->
                buildFormRule('')->
                builderFormSchema('category_id[]', '商品分类', 'select' )->
                buildFormRule('*')->
                buildFormAttr(['is_copy' => true])->
                buildDataSource( CategoryModel::getAllForSchemaOption('cate_name', 0, false), 1, 'cate_name')->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\GoodsController@postAdd'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\GoodsController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderAdd();
    }

    /**
     * 添加商品
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(GoodsRequest $request)
    {
        //写入数据
        $affected_number = GoodsModel::create($request->except('category_id', 'desc_item_desc'));

        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'));
    }

    /**
     * 拉取微店商品数据
     *
     * @return
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postPull()
    {
        $result = $this->send(self::GET_API_URL, [
            'param'     => '{"page_num":1,"page_size":100,"orderby":1}',
            'public'    => '{"method":"vdian.item.list.get"}',
        ]);


        if ($result !== false) {
            GoodsModel::mergeWeidianGoods($result['items']);
            return $this->response(self::SUCCESS_STATE_CODE, '拉取微店信息成功', [], true , createUrl('Admin\Weidian\GoodsController@getIndex'));
        }
        return $this->response(self::ERROR_STATE_CODE, '拉取微店信息失败');
    }

    public function getA()
    {
        $this->updateGoods();
    }
    /**
     * 同步商品数据
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postSync()
    {
        //获得全部添加更新到微店的商品
        $this->addGoods();
        //获得全部需要更新到微店的商品
        $this->updateGoods();
        //更新全部商品SKU到微店
        //拉取商品信息
        $this->postPull();

        return $this->response(self::SUCCESS_STATE_CODE, '同步微店商品信息成功', [], true , createUrl('Admin\Weidian\GoodsController@getIndex'));
    }

    /**
     * 新增商品
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function addGoods()
    {
        //获得全部需要更新到微店的商品
        $all_goods = GoodsModel::getAllShoudAdd();

        if ( count($all_goods) > 0 ) {

            foreach ($all_goods as $goods) {
                $result = $this->sendUpdate(self::GET_API_URL, [
                    'param'     => json_encode([
                        'item_name'         => $goods->item_name,
                        'price'             => $goods->price,
                        'stock'             => $goods->stock,
                        'merchant_code'     => $goods->merchant_code,
                        'cate_ids'          => GoodsCategoryModel::getGoodsAllCateId($goods->id),
                    ]),
                    'public'    => "vdian.item.add",
                ]);

                //更新商品后置方法
                $this->updateGoodsAfter($goods->id);
            }
        }
        return false;
    }

    /**
     * 更新全部商品
     *
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function updateGoods()
    {
        //获得全部需要更新到微店的商品
        $all_goods = GoodsModel::getAllShoudUpdateGoods();

        if ( count($all_goods) > 0 ) {
            foreach ($all_goods as $goods) {
                $result = $this->sendUpdate(self::GET_API_URL, [
                    'param'     => json_encode([
                        'item_name'         => $goods->item_name,
                        'price'             => $goods->price,
                        'stock'             => $goods->stock,
                        'merchant_code'     => $goods->merchant_code,
                        'itemid'            => $goods->itemid,
                        'cate_ids'          => GoodsCategoryModel::getGoodsAllCateinfo($goods->id),
                        'skus'              => GoodsSKUModel::getAllIsSyncGoodsSku($goods->id),
                    ]),
                    'public'    => 'vdian.item.update',
                ]);
                $result = true;
                if ($result !== false ) {
                    GoodsModel::updateGoodsToSyncSuccess($goods->itemid);

                    //更新商品后置方法
                    $this->updateGoodsAfter($goods->id);
                }
            }
        }
        return false;
    }

    /**
     * 更新商品后置方法
     *
     * @param $goods_id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function updateGoodsAfter($goods_id)
    {
        if ( $goods_id > 0 ) {
            //更新商品SKU
            (new GoodsSKUController())->updateGoodsSku($goods_id);

            //更新商品图片
            (new GoodsImageController())->imageAdd($goods_id);
        }

    }

    /**
     * 删除商品
     *
     * @param DeleteGoodsRequest $request
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postDelete(DeleteGoodsRequest $request)
    {
        //商品的id
        $goods_ids = $request->get('id');

        if (is_array($goods_ids) && count($goods_ids) > 0 ) {
            foreach ($goods_ids as $goods_id) {
                $status = $this->deleteOnes($goods_id);

                if ($status === false) {
                    return $this->response(self::ERROR_STATE_CODE, '删除商品失败');
                }
            }
        } elseif ( $goods_ids > 0 ) {
            $status = $this->deleteOnes($goods_ids);

            if ($status === false) {
                return $this->response(self::ERROR_STATE_CODE, '删除商品失败');
            }
        }
        return $this->response(self::SUCCESS_STATE_CODE, '删除商品成功');
    }

    /**
     * 删除单个商品
     *
     * @param $goods_id 商品id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function deleteOnes($goods_id)
    {
        $itemid = GoodsModel::isWeidianGoods($goods_id);

        if ( $itemid != false ) {

            //商品id，不能乱删除
            if (in_array($itemid, [1768451311, 1768445671, 1768443168, 1768440521, 1768437761] )) {
                return true;
            }
            $result = $this->sendUpdate(self::GET_API_URL, [
                'param'     => json_encode(['itemid' => $itemid]),
                'public'    => "vdian.item.delete",
            ]);

            if ($result === false) {
                return false;
            }
            return GoodsModel::deleteGoods($goods_id);
        }
        return GoodsModel::deleteGoods($goods_id);
    }

}
