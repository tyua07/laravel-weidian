<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | coupon.func.php: 获得图片函数库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

/**
 * 生成优惠券码
 *
 * @author aaron
 */
if(!function_exists('baseGetCouponSn')){

    function baseGetCouponSn(){
        // 组装券码元素
        $arr_num = [];

        // 产生券码数组
        $arr_map = [
            "F",3,"H","I","J",2,"G",5,"N",1,"K","L","M",4,"O","S","T",7,"U","V",0,"C",8,"X","W","A","B",9,"D","E","P","Q","R",6,"Y","Z"
        ];

        // 获取当前优惠券码 最大id
        $max_coupon_id  = DB::table('coupon')->max('id');
        $coupon_id      = $max_coupon_id + 1;

        // 转换优惠券券码ID
        $str_coupon_id  = $coupon_id.'';
        $len            = strlen($str_coupon_id);
        $str_zhuanhuan  = '';

        for ($i=0; $i<$len; $i++) {
            $index          = $str_coupon_id{$i};
            $str_zhuanhuan .= $arr_map[$index];
        }

        $arr_num[] = $str_zhuanhuan;
        $arr_num[] = $arr_map[mt_rand(0, 35)];
        $arr_num[] = $arr_map[mt_rand(0, 35)];
        $arr_num[] = $arr_map[mt_rand(0, 35)];
        $arr_num[] = $arr_map[mt_rand(0, 35)];

        // 组装券码
        $coupon_sn = '';

        for ($i=4; $i>=0; $i--) {
            $index      = mt_rand(0, $i);
            $coupon_sn .= $arr_num[$index];

            unset($arr_num[$index]);
            sort($arr_num);
        }

        return $coupon_sn;
    }
}




