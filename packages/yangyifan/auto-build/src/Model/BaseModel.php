<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | MergeModel.php: 基础模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model;

class BaseModel
{
    const EXPLODE = ',';//分隔符

    //文件类型
    protected static $type_arr = [
        'request',
        'controller',
        'model',
        'curd',
    ];
}

