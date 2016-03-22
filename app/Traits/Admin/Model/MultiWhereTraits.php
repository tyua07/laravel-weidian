<?php

// +----------------------------------------------------------------------
// | date: 2016-01-27
// +----------------------------------------------------------------------
// | MultiWhereTraits.php: 解析multiwhere查询条件 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\Admin\Model;

use Illuminate\Support\Collection;

trait MultiWhereTraits
{
    /**
     * 解析query查询
     *
     * @param $type         搜索类型
     * @param $schema       搜索字段
     * @param $value        组合条件
     * @param $query        $query
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function parseQuery($type, $schema, $value, $query)
    {
        switch($type){
            case 'like';
                $query = $query->where($schema, $value[0] ,$value[1]);
                break;
            case 'in':
                $query = $query->whereIn($schema, $value[1]);
                break;
            case 'not in':
                $query = $query->whereNotIn($schema, $value[1]);
                break;
            case 'between':
                $query = $query->whereBetween($schema, [$value[1][0], $value[1][1]]);
                break;
            case 'not between':
                $query = $query->whereNotBetween($schema, [$value[1][0], $value[1][1]]);
                break;
            case 'null':
                $query = $query->whereNull($schema);
                break;
            case 'or or'://组合出来的结果是 x = y or (a = "c" and b = "d")
            case 'or'://组合出来的结果是 x = y or (a = "c" and b = "d")
                $query = $query->orWhere(function($query) use ($value) {
                    self::mergeWhereOrMap($value[1], $query);
                });
                break;
            case 'or and'://组合出来的结果是 x = y or (a = "c" or b = "d")
                $query = $query->orWhere(function($query) use ($value) {
                    self::mergeWhereOrAndMap($value[1], $query);
                });
                break;
            case 'and or'://组合出来的结果是 x = y and (a = "c" or b = "d")
                $query = $query->where(function($query) use ($value) {
                    self::mergeWhereOrAndMap($value[1], $query);
                });
                break;
            case 'raw':
                //默认为 "and"
                $value[1][2] = empty($value[1][2]) ? "and" : $value[1][2];
                //sql         //绑定参数
                $query = $query->whereRaw($value[1][0], $value[1][1], $value[1][2]);
                break;
            default:
                if (is_array($value) && !empty($value) ) {
                    $query = $query->where($schema, $value[0], $value[1]);
                } else {
                    $query = $query->where($schema, '=', $value);
                }

                break;
        }
        return $query;
    }

    /**
     * 匹配map条件是否正确
     *
     * @param $type
     * @param $value
     * @return bool
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function matchMapValue($type, $value)
    {
        if (in_array($type, ['in', 'not in'] )) {
            //如果不是数组，则跳过档次循环
            if (empty($value[1]) || ( !is_array($value[1]) && !($value[1] instanceof Collection) ) ) {
                echo 11;die;
                return false;
            }
        } elseif (in_array($type, ['between', 'not between'] )) {
            //如果不是数组，则跳过档次循环
            if (empty($value[1]) || ( !is_array($value[1]) && !($value[1] instanceof Collection) )) {
                return false;
            }
        } elseif (in_array($type, ['or']) ) {
            //如果不是数组，则跳过档次循环
            if (empty($value) || ( !is_array($value) && !($value instanceof Collection) ) ) {
                return false;
            }
        } elseif (in_array($type, ['raw']) ) {
            //如果不是数组，则跳过档次循环
            if (empty($value) || ( !is_array($value) && !($value instanceof Collection) ) ) {
                return false;
            }
        }
        return true;
    }

    /**
     * 组合 whereOr map 条件
     *
     * @param $value
     * @param $query
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeWhereOrMap($value, $query)
    {
        if (is_array($value)) {
            foreach ($value as $schema => $map) {
                $query = self::parseQuery($map[0], $schema, [$map[0], $map[1]], $query );
            }
        }
        return $query;
    }

    /**
     * 组合 whereOrAnd map 条件
     *
     * @param $value
     * @param $query
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function mergeWhereOrAndMap($value, $query)
    {
        if (is_array($value)) {
            foreach ($value as $schema => $map) {
                $tmp_map = [$schema, $map[0], $map[1]];
                $query = self::mergeWhereOrAndMapForOnes($tmp_map, $query);
            }
        }
        return $query;
    }

    /**
     * 组合单条 whereOrAnd map条件
     *
     * @param $map
     * @param $query
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeWhereOrAndMapForOnes($map, $query)
    {
        if (is_array($map)) {
            return $query->orWhere($map[0], $map[1], $map[2]);
        }
        return $query;
    }
}
