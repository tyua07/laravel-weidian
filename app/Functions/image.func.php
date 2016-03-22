<?php

// +----------------------------------------------------------------------
// | date: 2015-08-02
// +----------------------------------------------------------------------
// | image.func.php: 获得图片函数库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

/**
 * 发送 task 任务 到swoole server
 *
 * @param $targer   目标连接
 * @param $params   提交目标连接参数
 * @param $callback 回调地址
 * @return mixed(int|bool)
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('get_user_info_face')){
    function get_user_info_face($image_name){
        return config('config.user_info_face_prefix') . $image_name;
    }
}

/**
 * 创建图片名称
 *    规则：随机10位随机数 由大写字母和数字组成
 * @return string
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if (!function_exists('createImageNameRound')) {
    function createImageNameRound()
    {
        $data = range('A', 'Z');
        for ($i = 0; $i < 10; $i++) {
            array_push($data, $i);
        }
        //打乱数组
        shuffle($data);

        return implode('', array_splice($data, 0, 10));
    }
}

/**
 * 获得当前图片的 mime 类型
 *
 * @param $image_mime
 * @return mixed|string
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if (!function_exists('getImageMime')) {
    function getImageMime($image_mime)
    {
        $mime_arr = [
            'gif' => 'image/gif',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
        ];

        if (in_array($image_mime, $mime_arr)) {
            return array_search($image_mime, $mime_arr);
        }
        return 'jpg';
    }
}





