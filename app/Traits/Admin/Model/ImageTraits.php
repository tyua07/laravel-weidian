<?php

// +----------------------------------------------------------------------
// | date: 2016-02-25
// +----------------------------------------------------------------------
// | ImageTraits.php: 基础图片相关方法 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\Admin\Model;

trait ImageTraits
{
    /**
     * 更新图片到数据库
     *
     * @param $image_name
     * @param $id
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function updateImage($image_name, $id)
    {
        if (!empty($image_name) && $id > 0 ) {
            return self::multiwhere( ['id' => $id] )->update([
                static::INPUT_NAME => $image_name,
            ]) > 0 ? true : false;
        }
        return false;
    }

    /**
     * 获得图片资源类型 (默认为)
     *
     * @return mixed|null
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getImageSourceType()
    {
        if (is_null(static::$source_type)) {
            static::$source_type = 'article';
        }
        return static::$source_type;
    }

    /**
     * 获得图片类型
     *
     * @return mixed|null
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getImageType()
    {
        if (is_null(static::$image_type)) {
            static::$image_type = 'article';
        }
        return static::$image_type;
    }

}
