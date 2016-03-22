<?php

// +----------------------------------------------------------------------
// | date: 2016-01-17
// +----------------------------------------------------------------------
// | BuildModelModel.php: 组合构建 model 模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model\Build;

class BuildModelModel extends BaseModel
{
    /**
     * 设置 merge 方法主体
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildMergeBody()
    {
        $body = "";
        $body .= "\tif (!empty(\$data)) { \r\n";
        $body .= "\t\tforeach (\$data as &\$v) { \r\n";
        $body .= "\t\t\t\$v->handle = '<a href=\"\"  >修改</a>';\r\n";
        $body .= "\t\t} \r\n";
        $body .= "\t} \r\n";
        $body .= "return \$data;";

        return $body;
    }

    /**
     * 设置搜索方法主体
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildSearchBody()
    {
        $body = "";
        $body .= "return [ \r\n";
        $body .= "\t'data' =>   self::mergeData( \r\n";
        $body .= "\t\tself::multiwhere(\$map)-> \r\n";
        $body .= "\t\torderBy(\$sort, \$order)-> \r\n";
        $body .= "\t\tskip(\$offset)-> \r\n";
        $body .= "\t\ttake(\$limit)-> \r\n";
        $body .= "\t\tget() \r\n";
        $body .= "\t), \r\n";
        $body .= "'count' =>  self::multiwhere(\$map)->count(), \r\n";
        $body .= "];";
        return $body;
    }
}

