<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | MergeModel.php: 基础模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model\Config;

use Yangyifan\AutoBuild\Http\Controllers\Config\BaseController;

class BaseModel extends \Yangyifan\AutoBuild\Model\BaseModel
{

    /**
     * 获得配置文件目录
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getConfigDir($file_name, $type)
    {
        if (empty($file_name) || empty($type) || !in_array($type, self::$type_arr)) {
            throw new \Exception("参数错误");
        }

        $dir = storage_path() . BaseController::CONFIG_PATH . '/' . $type;
        if (file_exists($dir) === false) {
            mkdir($dir, 0777, true);
        }
        return $dir. '/' . $file_name . BaseController::CONFIG_EXT;
    }

    /**
     * 获取文件内容
     *
     * @param $file_name
     * @param $type
     * @return string
     * @throws \Exception
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getFileContent($file_name, $type)
    {
        $path = self::getConfigDir($file_name, $type);

        if (file_exists($path) === false) {
            return '';
        }
        return file_get_contents($path);
    }

    /**
     * 获得配置json信息
     *
     * @param $table_name
     * @param $type
     * @return bool|mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getConfig($table_name, $file_type)
    {
        $json = self::getFileContent($table_name, $file_type);
        if (!empty($json)) {
            return json_decode($json, true);
        }
        return false;
    }

}

