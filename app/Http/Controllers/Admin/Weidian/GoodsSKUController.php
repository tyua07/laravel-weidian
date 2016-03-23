<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsSKUController.php: 微店商品SKU控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Weidian;

use App\Http\Controllers\Admin\HtmlBuilderController;
use App\Model\Admin\Weidian\GoodsModel;
use App\Observer\Weidian\GoodsSKUObserver;
use Illuminate\Http\Request;
use App\Model\Admin\Weidian\GoodsSKUModel;
use App\Http\Requests\Admin\Weidian\GoodsSKURequest;
use App\Http\Requests\Admin\Weidian\DeleteGoodsSKURequest;
use App\Model\Admin\Weidian\GoodsMergeModel;

class GoodsSKUController extends BaseController
{
    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
        //新增模型观察者
        GoodsSKUModel::observe(new GoodsSKUObserver());
    }

    /**
     * 商品SKU列表页
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex(Request $request)
    {
        return  (new HtmlBuilderController())->
                builderTitle('商品SKU列表')->
                builderSchema('id', 'id')->
                builderSchema('title', '商品SKU名称')->
                builderSchema('price', '商品SKU销售价')->
                builderSchema('stock', '商品SKU库存')->
                builderSchema('status', '商品SKU状态')->
                builderSchema('handle', '操作')->
                builderSearchSchema('title', '商品SKU名称')->
                builderSearchSchema($name = 'status', $title = '商品SKU状态开启', $type = 'select', '', $class = '', $option = GoodsMergeModel::mergeStatusForSelect(), 0, 'name')->
                builderBotton('返回', createUrl('Admin\Weidian\GoodsController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderBotton('增加 微店商品SKU', createUrl('Admin\Weidian\GoodsSKUController@getAdd', ['goods_id' => $request->get('goods_id')]), 'glyphicon glyphicon-plus')->
                builderJsonDataUrl(createUrl('Admin\Weidian\GoodsSKUController@getSearch', ['goods_id' => $request->get('goods_id')]))->
                buildLimitNumber([20, 30, 40, 50])->
                loadScription('dist/weidian/goodsSku.js')->
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
        $goods_id   = $request->get('goods_id');

        //解析params
        parse_str($search);

        //组合查询条件
        $map = [];

        if ($goods_id > 0) {
            $map['goods_id'] = $goods_id;
        }
        if (!empty($title)) {
            $map['title'] = ['LIKE', '%' . $title . '%'];
        }
        if ( $status > 0 ) {
            $map['status'] = $status;
        }

        $data = GoodsSKUModel::search($map, $sort, $order, $limit, $offset);

        echo json_encode([
            'total' => $data['count'],
            'rows'  => $data['data'],
        ]);
    }

    /**
     * 编辑商品SKU
     *
     * @param  int  $id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getEdit(Request $request)
    {
        $infos = GoodsSKUModel::find($request->get('id'));

        return  (new HtmlBuilderController())->
                builderTitle('编辑商品SKU')->
                builderFormSchema('title', '商品SKU名称')->
                builderFormSchema('price', '商品SKU价格', $type = 'text', $default = '0.0')->
                builderFormSchema('stock', '商品SKU库存', $type = 'text', $default = '100')->
                builderFormSchema('sku_merchant_code', '商品SKU编码', $type = 'text')->
                buildFormRule('')->
                builderFormSchema('status', '状态', 'radio', '', '', '', '', '', GoodsMergeModel::getAllStatus(), $infos->status)->
                builderFormSchema('goods_id', '商品id', $type = 'hidden')->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\GoodsSKUController@postEdit'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\GoodsSKUController@getIndex'), 'glyphicon glyphicon-arrow-left')->
                builderEditData($infos)->
                builderEdit();
    }

    /**
     * 处理更新商品SKU
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postEdit(GoodsSKURequest $request)
    {
        $data       = $request->all();
        $Model      = GoodsSKUModel::findOrFail($data['id']);
        $Model->update($data);

        //更新成功
        return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'), [], true, createUrl('Admin\Weidian\GoodsSKUController@getIndex', ['goods_id' => $data['goods_id']]));
    }

    /**
     * 增加商品SKU
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getAdd(Request $request)
    {
        return  (new HtmlBuilderController())->
                builderTitle('添加商品SKU')->
                builderFormSchema('title', '商品SKU名称')->
                builderFormSchema('price', '商品SKU价格', $type = 'text', $default = '0.0')->
                builderFormSchema('stock', '商品SKU库存', $type = 'text', $default = '100')->
                builderFormSchema('sku_merchant_code', '商品SKU编码', $type = 'text', $default = '')->
                buildFormRule('')->
                builderFormSchema('status', '状态', 'radio', '', '', '', '', '', GoodsMergeModel::getAllStatus(), '1')->
                builderFormSchema('goods_id', '商品id', $type = 'hidden', $request->get('goods_id'))->
                builderConfirmBotton('确认', createUrl('Admin\Weidian\GoodsSKUController@postAdd'), 'btn btn-success')->
                builderBotton('返回', createUrl('Admin\Weidian\GoodsSKUController@getIndex', ['goods_id' => $request->get('goods_id')]), 'glyphicon glyphicon-arrow-left')->
                builderAdd();
    }

    /**
     * 添加商品SKU
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postAdd(GoodsSKURequest $request)
    {
        //写入数据
        $affected_number = GoodsSKUModel::create($request->all());

        return  $affected_number->id > 0  ? $this->response(self::SUCCESS_STATE_CODE, trans('response.add_success')) : $this->response(self::ERROR_STATE_CODE, trans('response.add_error'));
    }

    /**
     * 更新指定商品SKU信息
     *
     * @param $goods_id
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function updateGoodsSku($goods_id)
    {
        if ( $goods_id > 0) {

            $goods_sku_arr  = GoodsSKUModel::getAllIsSyncGoodsSku($goods_id);
            $item_id        = GoodsModel::isWeidianGoods($goods_id);

            if ( $item_id > 0 && count($goods_sku_arr) > 0 ) {
                $update_sku_arr = [];
                $add_sku_arr    = [];

                foreach ($goods_sku_arr as $goods_sku_info) {
                    if ( $goods_sku_info->id > 0 ) {
                        //修改
                        $update_sku_arr[] = $goods_sku_info;
                    } else {
                        unset($goods_sku_info->id);
                        //新增
                        $add_sku_arr[] = $goods_sku_info;
                    }
                }
                //更新商品SKU
                $this->skuUpdate($update_sku_arr, $item_id);
                //新增商品SKU
                $this->skuAdd($add_sku_arr, $item_id);
            }
        }
    }

    /**
     * 批量添加指定商品的商品SKU
     *
     * @param array $goods_sku_arr 商品SKU数组
     * @param $itemid               微店数据库存在的商品id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function skuAdd($goods_sku_arr = [], $itemid)
    {
        if ($itemid > 0 && count($goods_sku_arr) > 0 ) {
            $response = $this->sendUpdate(self::GET_API_URL, [
                'param'     => json_encode(['skus' => $goods_sku_arr, 'itemid' => strval($itemid)]),
                'public'    => "vdian.item.sku.add",
            ]);
            if ($response !== false ) {

                //更新商品SKU为不需要同步
                {
                    if ( count($response) > 0 ) {
                        $goods_id = GoodsModel::multiwhere( ['itemid' => $itemid] )->pluck('id');

                        if ( $goods_id > 0 ) {
                            foreach ($response as $sku_info) {
                                GoodsSKUModel::updateNotIsSync( ['goods_id' => $goods_id] )->update([
                                    'sku_id'    => $sku_info['id'],
                                    'is_sync'   => 2,//更新为不需要同步状态
                                ]);
                            }
                        }
                        throw new \InvalidArgumentException("商品不存在");
                    }
                }
                //更新商品SKU为不需要同步
            }
        }
        return false;
    }

    /**
     * 批量修改指定商品的商品SKU
     *
     * @param array $goods_sku_arr 商品SKU数组
     * @param $itemid               微店数据库存在的商品id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function skuUpdate($goods_sku_arr = [], $itemid)
    {
        if ($itemid > 0 && count($goods_sku_arr) > 0 ) {
            $response = $this->sendUpdate(self::GET_API_URL, [
                'param'     => json_encode(['itemid' => strval($itemid), 'skus' => $goods_sku_arr ]),
                'public'    => "vdian.item.sku.update",
            ]);

            if ($response !== false ) {
                //更新商品SKU为不需要同步
                {
                    array_walk($goods_sku_arr, function(&$value){
                        $value = $value['id'];
                    });

                    return GoodsSKUModel::updateNotIsSync($goods_sku_arr);
                }
                //更新商品SKU为不需要同步
            }
        }
        return false;
    }

    /**
     * 删除商品SKU
     *
     * @param DeleteGoodsSKURequest $request
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postDelete(DeleteGoodsSKURequest $request)
    {
        //商品的id
        $goods_ids = $request->get('id');

        if (is_array($goods_ids) && count($goods_ids) > 0 ) {
            foreach ($goods_ids as $goods_id) {
                $status = $this->deleteOnes($goods_id);
                if ($status === false) {
                    return $this->response(self::ERROR_STATE_CODE, '删除商品SKU失败');
                }
            }
        } elseif ( $goods_ids > 0 ) {
            $status = $this->deleteOnes($goods_ids);

            if ($status === false) {
                return $this->response(self::ERROR_STATE_CODE, '删除商品SKU失败');
            }
        }
        return $this->response(self::SUCCESS_STATE_CODE, '删除商品SKU成功');
    }

    /**
     * 删除单个商品SKU
     *
     * @param $sku_id 商品SKUid
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function deleteOnes($id)
    {
        $sku_info = GoodsSKUModel::isWeidianGoodsSKU($id);

        if ( $sku_info != false ) {

            $result = $this->sendUpdate(self::GET_API_URL, [
                'param'     => json_encode(['skus' => [ strval($sku_info['sku_id'])], 'itemid' => strval($sku_info['itemid']) ]),
                'public'    => 'vdian.item.sku.delete',
            ]);

            if ($result === false) {
                return false;
            }
            return GoodsSKUModel::deleteGoodsSKU($id);
        }
        return GoodsSKUModel::deleteGoodsSKU($id);
    }
}
