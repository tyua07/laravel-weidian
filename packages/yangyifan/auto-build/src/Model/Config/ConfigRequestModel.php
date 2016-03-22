<?php

// +----------------------------------------------------------------------
// | date: 2016-01-23
// +----------------------------------------------------------------------
// | ConfigRequestModel.php: 创建 Request 配置文件模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model\Config;

class ConfigRequestModel extends BaseModel
{
    const FILE_TYPE = 'request';//对应 $type_arr 的类型

    /**
     * 创建 Request 配置信息
     *
     * @param $data
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function createRequestConfig($data)
    {
        $rule_config = [];

        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $rule_config[$key] = [
                    'name' => $value['title'],
                ];
                if (!empty($value['rule']['rule'])) {
                    foreach ($value['rule']['rule'] as $rule) {
                        if (isset($value['rule']['params'][$rule]) && is_array($value['rule']['params'][$rule])) {
                            $rule_config[$key]['rule'][] = array_merge([$rule], $value['rule']['params'][$rule]);
                        } else {
                            $rule_config[$key]['rule'][] = $rule;
                        }

                    }
                }
            }
        }
        return $rule_config;
    }

    /**
     * 获得配置json信息
     *
     * @param $table_name
     * @param $type
     * @return bool|mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getRequestConfig($table_name)
    {
        return self::getConfig($table_name, self::FILE_TYPE);
    }

    /**
     * 获得配置json信息(组合后)
     *
     * @param $table_name
     * @param $type
     * @return bool|mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function getMergeReuqestConfig($table_name)
    {
        return self::mergeSelectRule(self::getConfig($table_name, self::FILE_TYPE));
    }

    /**
     * 组合已经选中的验证规则
     *
     * @param $select_rule_arr
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeSelectRule($select_rule_arr)
    {
        $data = [];
        if (!empty($select_rule_arr)) {
            foreach ($select_rule_arr as $schema => $rule_arr) {
                if (!empty($rule_arr['rule'])) {
                    $tmp = [];
                    foreach ($rule_arr['rule'] as $v) {
                        //设置当前元素的key
                        $key = !is_array($v) ? $v : $v[0];
                        //设置当前元素的value
                        if (is_array($v) && count($v) == 3) {
                            $value = [
                                $v[1],
                                $v[2],
                            ];
                        } elseif (is_array($v) && count($v) == 2) {
                            $value = [
                                $v[1],
                            ];
                        }
                        //赋值到$data
                        $tmp[$key] = $value;
                    }
                    $data[$schema] = [
                        'name'  => $rule_arr['name'],
                        'rule'  => $tmp,
                    ];
                }
            }
        }
        return $data;
    }
}


