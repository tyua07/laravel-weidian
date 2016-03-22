<?php

// +----------------------------------------------------------------------
// | date: 2016-03-18
// +----------------------------------------------------------------------
// | GoodsSKUController.php: 微店商品SKU控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Admin\Weidian;

use App\Model\Admin\Weidian\GoodsModel;
use App\Observer\Weidian\GoodsImagesObserver;
use Illuminate\Http\Request;
use App\Model\Admin\Weidian\GoodsImageModel;
use App\Http\Requests\Admin\Weidian\DeleteGoodsImageRequest;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class GoodsImageController extends BaseController
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
        GoodsImageModel::observe(new GoodsImagesObserver());
    }

    /**
     * 上传商品图片页面
     *
     * @param Request $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUploadImage(Request $request)
    {
        //商品 id
        $goods_id = intval($request->get('goods_id'));

        return view('admin.weidian.goods_images.image', [
            'title'             => '商品图片',
            'goods_id'          => $goods_id,
            'image_arr'         => GoodsImageModel::getGoodsImage($goods_id),
        ]);
    }

    /**
     * 获得批量上传弹出框
     *
     * @return \Illuminate\View\View
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getUploadView(Request $request)
    {
        return View('admin.image.upload_view', [
            'title'             => trans('shop.image_title1'),
            'id'                => intval($request->get('id')),//id
            'input_name'        => GoodsImageModel::INPUT_NAME,//表单名称
            'upload_url'        => createUrl('Admin\Weidian\GoodsImageController@postUpload'),//上传地址
        ]);
    }

    /**
     * 处理批量上传文件
     *
     * @param Request $requests
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postUpload(Request $request)
    {
        try {
            $file                   = $request->file(GoodsImageModel::INPUT_NAME);
            $fields['access_token'] = $this->getToken();

            //图像
            $dir_path   = storage_path('upload/goods_image/');
            $file_name  = $file->getClientOriginalName();

            $file->move($dir_path, $file_name);

            if(version_compare(phpversion(),'5.5.0') >= 0 && class_exists('CURLFile')){
                $fields['media'] = new \CURLFile($dir_path . $file_name);
            }else{
                $fields['media'] = '@'. $dir_path. $file_name;//加@符号curl就会把它当成是文件上传处理
            }

            //发送数据
            $data = $this->parseResponse(curlPost(self::GET_UPLOAD_IMAGE_URL, $fields));

            if ($data !== false) {
                //删除原文件
                unlink($dir_path . $file_name);

                //更新数据库
                if (GoodsImageModel::addGoodsImage($request->get('_id'), $data)) {
                    //更新当前图片为需要同步
                    GoodsImageModel::updateIsSync($data);

                    return $this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'));
                }
            }
        } catch(\Exception $e) {

        } catch (FileException $e) {

        } catch (FileNotFoundException $e) {

        }
        return $this->response(self::ERROR_STATE_CODE, trans('response.update_error'));
    }

    /**
     * 批量添加指定商品的商品图片
     *
     * @param $goods_id  商品id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function imageAdd($goods_id)
    {
        if ($goods_id) {
            $itemid = GoodsModel::isWeidianGoods($goods_id);
            if ( $itemid > 0 ) {
                $image_name_arr = GoodsImageModel::multiwhere(['goods_id' => $goods_id, 'is_sync' => 1])->lists('media');

                $response = $this->sendUpdate(self::GET_API_URL, [
                    'param'     => json_encode(['itemid' => strval($itemid), 'imgs' => $image_name_arr ]),
                    'public'    => "vdian.item.image.add",
                ]);

                if ($response !== false ) {
                    //更新商品图片为不需要同步
                    return GoodsImageModel::updateNotIsSync($image_name_arr);
                }
            }
        }
        return false;
    }

    /**
     * 删除商品图片
     *
     * @param DeleteGoodsImageRequest $request
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function postDelete(DeleteGoodsImageRequest $request)
    {
        //商品图片的id
        $goods_image_ids = $request->get('id');

        if (is_array($goods_image_ids) && count($goods_image_ids) > 0 ) {
            foreach ($goods_image_ids as $goods_image_id) {
                $status = $this->deleteOnes($goods_image_id);

                if ($status === false) {
                    return $this->response(self::ERROR_STATE_CODE, '删除商品图片失败');
                }
            }
        } elseif ( $goods_image_ids > 0 ) {
            $status = $this->deleteOnes($goods_image_ids);

            if ($status === false) {
                return $this->response(self::ERROR_STATE_CODE, '删除商品图片失败');
            }
        }
        return $this->response(self::SUCCESS_STATE_CODE, '删除商品图片成功', [], false, createUrl("Admin\Weidian\GoodsImageController@getUploadImage"));
    }

    /**
     * 删除单个商品图片
     *
     * @param $goods_image_id 商品图片id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function deleteOnes($goods_image_id)
    {
        if ( $goods_image_id > 0 ) {

            $image_info = GoodsImageModel::isWeidianGoodsImages($goods_image_id);
            if ( $image_info !== false ) {
                $result = $this->sendUpdate(self::GET_API_URL, [
                    'param'     => json_encode(['delete_imgs' => [$image_info['media']], 'itemid' => strval($image_info['itemid'])]),
                    'public'    => "vdian.item.image.delete",
                ]);
                if ($result === false) {
                    return false;
                }
                return GoodsImageModel::destroy($goods_image_id);
            }
        }
        return false;
    }

}
