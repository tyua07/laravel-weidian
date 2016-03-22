<?php

// +----------------------------------------------------------------------
// | date: 2015-07-04
// +----------------------------------------------------------------------
// | BaseModel.php: 公共模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Model\Admin;

use Illuminate\Database\Eloquent\Model;
use DB;
use \Session;
use App\Traits\Admin\Model\MultiWhereTraits;
use App\Traits\Admin\Model\SearchTraits;
use App\Traits\Admin\Model\ImageTraits;
use App\Traits\Admin\Model\ToolsTraits;

class BaseModel extends Model
{
    use MultiWhereTraits,   //解析multiwhere查询条件 Traits
        SearchTraits,       //解析multiwhere查询条件 Traits
        ImageTraits,        //基础图片相关方法 Traits
        ToolsTraits         //基础模型工具方法 Traits
        ;

    public $timestamps = false;//开启维护时间戳

    //类常量
    const SEPARATED         = ','; //分隔符

    //列表页 css 样式
    const COL_DEFAULT       = "";//默认样式
    const COL_PRIMARY       = "bg-primary";//primary样式
    const COL_SUCCESS       = "bg-success";//成功样式
    const COL_INFO          = "bg-info";//info样式
    const COL_WARNING       = "bg-warning";//警告样式
    const COL_DANGER        = "bg-danger";//危险样式


    /**
     * 判断是否该字段值，是否和编辑前相等
     *
     * @param $schema
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function isEqual($schema)
    {
        if (!is_array($schema)) $schema = func_get_args();

        if ( is_array($schema) && count($schema) > 0 ) {
            foreach ($schema as $v) {
                if ( ( $this->attributes[$v] == $this->getOriginal($v) ) == false) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}

