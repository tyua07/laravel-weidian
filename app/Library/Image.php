<?php

// +----------------------------------------------------------------------
// | date: 2015-09-17
// +----------------------------------------------------------------------
// | Image.php: 图片
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Library;

class Image
{
    private static $all_image_type;//图片类型
    private static $image_host;//图片url

    const IMAGE_TYPE_1      = 'article';//攻略
    const IMAGE_TYPE_2      = 'shop';//商家
    const UPLOAD_ERROR      = -1;//上传酒店营业执照错误
    const UPDATE_ERROR      = -2;//更新酒店营业执照到数据库错误
    const UPDATE_ERROR_1    = -3;//没有文件上传
    const SUCCESS           = 1;//成功

    /**
     * 获得图片类型
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getAllImageType()
    {
        if (empty(self::$all_image_type)) {
            self::$all_image_type = config('config.image_type');
        }
        return self::$all_image_type;
    }

    /**
     * 获得图片host
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getImageHost()
    {
        if (empty(self::$image_host)) {
            self::$image_host = config('upload.upyun.imagesHots');
        }
        return self::$image_host;
    }

    /**
     * 获得默认图片
     *
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getDefaultImage()
    {
        return self::getImageHost() . '/' . 'files/source/98.pic_hd.jpg';
    }

    /**
     * 组合图片资源类型
     *
     * @param $image_type
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeImageSourceType($source_type)
    {
        if (!empty($source_type)) {

            //获得全部image资源类型
            $all_image_source_type = array_keys(self::getAllImageType());

            if (in_array($source_type, $all_image_source_type)) {
                return $source_type;
            }
        }
        return false;
    }

    /**
     * 组合图片类型
     *
     * @param $source_type 资源类型
     * @param $image_type   图片类型
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeImageType($source_type, $image_type)
    {
        if (!empty($image_type)) {
            //获得全部image类型
            $all_image_type = self::getAllImageType();

            if (array_key_exists($source_type, $all_image_type)) {
                if (array_key_exists($image_type, $all_image_type[$source_type])) {
                    return $all_image_type[$source_type][$image_type];
                }
            }
        }
        return false;
    }

    /**
     * 组合图片名称
     *
     * @param $image_type
     * @param $image_width
     * @param $image_height
     * @param $image_ext
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function mergeImageName($source_type, $image_type, $image, $id)
    {
        //加载image 函数库
        load_func('image');

        //获得图片详细信息
        $image_info = getimagesize($image);

        $arr = [
            $id,
            self::mergeImageType($source_type, $image_type),
            $image_info[0],
            $image_info[1],
            date('Ymd'),
            createImageNameRound(),
        ];
        return implode('_', $arr) . '.' . getImageMime($image_info['mime']);
    }

    /**
     * 获得图片存放路径
     *
     * @param $image_name
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getImagePath($source_type, $image_name, $id)
    {
        return '/website/' . self::mergeImageSourceType($source_type) . '/' . $id . '/' . $image_name;
    }

    /**
     * 获得图片正式网址路径
     *
     * @param $image_name
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getImageRealPath($source_type, $image_name, $id)
    {
        if (trim($image_name) != '') {
            return config('upload.upyun.imagesHots') . self::getImagePath($source_type, $image_name, $id);
        }
        return self::getDefaultImage();
    }

    /**
     * 上传图片
     *
     * @param $request
     * @param $upload
     * @param $input_name 文件表单name名称
     * @param $source_type
     * @param $image_type
     * @param $id
     * @return int
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function uploadImage($request, $upload, $input_name, $source_type, $image_type, $id)
    {
        set_time_limit(0);
        try {
            if ($request->hasFile($input_name)) {
                $file = $request->file($input_name);
                if ($file->isValid()) {
                    //组合图片名称
                    $image_name = self::mergeImageName($source_type, $image_type, $file, $id);
                    $status     = $upload->write(self::getImagePath($source_type, $image_name, $id), $file);
                    if (!empty($status)) {
                        //返回成功状态
                        return ['state' => self::SUCCESS, 'image_name' => $image_name];
                    }
                    return self::UPLOAD_ERROR;//上传图片错误
                }
            }

        }catch (\Exception $e){
            return self::UPDATE_ERROR_1;//没有文件被上传
        }
    }


}