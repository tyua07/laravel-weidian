<?php
// +----------------------------------------------------------------------
// | date: 2015-06-06
// +----------------------------------------------------------------------
// | base.func.php: 公共函数库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

/**
 * 引入函数库文件
 *
 * @param $func_name    函数名
 * @param string $ext   扩展名
 * @param string $pasth 文件路径
 * @author yangyifan <yangyifanphp@gmail.com>
 */
if(!function_exists('load_func')){
    function load_func($func_name, $ext = '.func.php', $pasth = ''){
        if(strpos($func_name, ',')){
            $funcs = explode(',', $func_name);
            foreach($funcs as $func_name){
                $realpath = $pasth == '' ? app_path() . '/Functions/' . $func_name . $ext : $pasth . $func_name . $ext;
                require_once($realpath);
            }
        }else{
            $realpath = $pasth == '' ? app_path() . '/Functions/' . $func_name . $ext : $pasth . $func_name . $ext;
            require_once($realpath);
        }
    }
}
