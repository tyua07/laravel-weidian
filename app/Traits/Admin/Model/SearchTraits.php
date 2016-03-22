<?php

// +----------------------------------------------------------------------
// | date: 2016-02-25
// +----------------------------------------------------------------------
// | SearchTraits.php: 解析multiwhere查询条件 Traits
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Traits\Admin\Model;

trait SearchTraits
{
    /**
     * 搜索
     *
     * @param $map
     * @param $sort
     * @param $order
     * @param $offset
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    protected static function search($map, $sort, $order, $limit, $offset)
    {
        return [
            'data' => self::mergeData(
                self::multiwhere($map)->
                orderBy($sort, $order)->
                skip($offset)->
                take($limit)->
                get()
            ),
            'count' => self::multiwhere($map)->count(),
        ];
    }

    /**
     * 多条件查询where
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function scopeMultiwhere($query, $arr)
    {
        if (!is_array($arr)) {
            return $query;
        }

        if (empty($arr)) {
            return $query;
        }

        foreach ($arr as $key => $value) {
            //判断$arr
            if(is_array($value)){
                $value[0] = trim(strtolower($value[0]));

                //如果参数不正确，则跳过
                if (self::matchMapValue($value[0], $value) == false ) continue;

                //解析query查询
                $query = self::parseQuery($value[0], $key, $value, $query);

            }else{
                $query = $query->where($key, $value);
            }
        }
        return $query;
    }
}
