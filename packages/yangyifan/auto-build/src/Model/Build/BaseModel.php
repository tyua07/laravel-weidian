<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | MergeModel.php: 基础模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model\Build;

class BaseModel extends \Yangyifan\AutoBuild\Model\BaseModel
{
    private static $schema_type = null;//组合过的mysql字段类型数组

    //mysql 字段类型
    private static $schema_type_arr = [
        'int'       => ['tinyint', 'smallint', 'mediumint', 'int', 'bigint'], //数值类型
        'float'     => ['float', 'double', 'decimal', 'dec'],//浮点类型
        'date'      => ['date', 'datetime', 'timestamp', 'time', 'year'],//时间类型
        'char'      => ['char', 'varchar', 'tinyblob', 'blob', 'mediumblob', 'longblob', 'tinytext', 'text', 'mediumtext', 'longtext', 'varbinary', 'binary'],//字符类型
    ];

    /**
     * 获得组合过的字段类型
     * ['mysql_schema_type' => 'type']
     *
     * @return array|null
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getSchemaArr()
    {
        if (is_null(self::$schema_type)){
            self::$schema_type = [];

            foreach (self::$schema_type_arr as $key => $value) {
                foreach ($value as $type) {
                    self::$schema_type = array_merge(self::$schema_type, [$type => $key]);
                }
            }
        }
        return self::$schema_type;
    }

}

