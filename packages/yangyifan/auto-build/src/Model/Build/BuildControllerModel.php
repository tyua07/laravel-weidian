<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | BuildControllerModel.php: 组合数据模型
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\AutoBuild\Model\Build;

class BuildControllerModel extends BaseModel
{
    const LIST_PAGE_ALLOW_SCHEMA_TYPE = ['text', 'hidden', 'date', 'select' ];//首页允许显示的字段类型

    //表单类型,请参看这里 http://wiki.laravel-administrotar.com/service/build_html/build_form.html
    public static $form_type = [
        'label'         => 'label',
        'text'          => '文本框',
        'hidden'        => '隐藏域',
        'textarea'      => '多行文本框',
        'password'      => '密码框',
        'date'          => '时间选择器',
        'image'         => '图片选择器',
        'ueditor'       => '百度富文本编辑器',
        'radio'         => '单选框',
        'checkbox'      => '多选框',
        'select'        => '下拉列表框',
        'multiSelect'   => '双向选择器',
        'search'        => '搜索框',
    ];

    /**
     * 构建构造方法
     *
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildConstructBody()
    {
        $body = "";
        $body .= "\tparent::__construct();\r\n";
        $body .= "\$this->html_builder = \$html_builder;\r\n";
        return $body;
    }

    /**
     * 构建显示列表页面操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildGetIndexBody($title, $route_url, $schema_arr = [], $btn_title_arr = [] )
    {
        $body = "";
        $body .= "return\t\$this->html_builder->\r\n";
        $body .= "\t\tbuilderTitle('{$title}')->\r\n";
        $body .= self::mergeIndexBody($schema_arr);//组合列表页要显示的字段
        $body .= self::mergeIndexSearchBody($schema_arr);//组合列表页允许搜索的字段
        $body .= "\t\tbuilderBotton('确认', '')->\r\n";
        $body .= "\t\tbuilderJsonDataUrl(createUrl('{$route_url}@getSearch'))->\r\n";
        $body .= "\t\tbuilderList();";

        return $body;
    }

    /**
     * 组合列表页要显示的字段
     *
     * @param $schema_arr
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeIndexBody($schema_arr)
    {
        $body = '';
        if (!empty($schema_arr)) {
            foreach ($schema_arr as $schema) {
                if ($schema['is_list'] == true) {
                    $body .= "\t\tbuilderSchema('{$schema['name']}', '{$schema['title']}', \$type = '{$schema['type']}')->\r\n";
                }
            }
        }
        $body .= "\t\tbuilderSchema('handle', '操作')->\r\n";
        return $body;
    }

    /**
     * 组合列表页允许搜索的字段(因为考虑到了格式,所以分开写了)
     *
     * @return string
     */
    private static function mergeIndexSearchBody($schema_arr)
    {
        $body = '';
        if (!empty($schema_arr)) {
            foreach ($schema_arr as $schema) {
                if ($schema['is_search'] == true && in_array($schema['type'], self::LIST_PAGE_ALLOW_SCHEMA_TYPE )) {
                    $body .= "\t\tbuilderSearchSchema('{$schema['name']}', '{$schema['title']}', \$type = '{$schema['type']}')->\r\n";
                }
            }
        }
        return $body;
    }

    /**
     * 构建搜索操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildGetSearchBody($model_name, $schema_arr = [])
    {
        $body = "";

        $body .= "//接受参数\r\n";
        $body .= "\$search = \$request->get('search', '');\r\n";
        $body .= "\$sort   = \$request->get('sort', 'id');\r\n";
        $body .= "\$order  = \$request->get('order', 'asc');\r\n";
        $body .= "\$limit  = \$request->get('limit',0);\r\n";
        $body .= "\$offset = \$request->get('offset', config('config.page_limit'));\r\n";

        $body .= "\r\n";
        $body .= "//解析params\r\n";
        $body .= "parse_str(\$search);\r\n";

        $body .= "\r\n";
        $body .= "//组合查询条件\r\n";
        $body .= "\$map = [];\r\n";

        $body .= self::mergeSearchPageSchema($schema_arr);

        $body .= "\r\n";
        $body .= "\$data = {$model_name}::search(\$map, \$sort, \$order, \$limit, \$offset);\r\n";

        $body .= "\r\n";
        $body .= "echo json_encode([\r\n";
        $body .= "\t'total' => \$data['count'],\r\n";
        $body .= "\t'rows'  => \$data['data'],\r\n";
        $body .= "]);\r\n";
        return $body;
    }

    /**
     * 组合编辑页面的字段
     *
     * @param $schema_arr
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeSearchPageSchema($schema_arr)
    {
        $body = '';
        if (!empty($schema_arr)) {

            $schema_type_arr = self::getSchemaArr();


            foreach ($schema_arr as $schema) {

                //把当前字段类型转义成小写
                $schema['schema_type'] = strtolower($schema['schema_type']);

                //如果当前字段可以为搜索,并且mysql字段类型,在int,float,char,date类型当中,则组合当前的字段的搜索条件
                if ($schema['is_search'] == true && array_key_exists($schema['schema_type'], $schema_type_arr)) {
                    switch ($schema['schema_type']) {
                        case "int":
                            $body .= "if (!empty(\${$schema['name']})) {\r\n";
                            $body .= "\t\$map['${$schema['name']}'] = \${$schema['name']}; \r\n";
                            $body .= "} \r\n";
                            break;
                        case "float":
                            $body .= "if (!empty(\${$schema['name']})) {\r\n";
                            $body .= "\t\$map['{$schema['name']}'] = \${$schema['name']}; \r\n";
                            $body .= "} \r\n";
                            break;
                        case "char":
                            $body .= "if (!empty(\${$schema['name']})) {\r\n";
                            $body .= "\t\$map['{$schema['name']}'] = ['LIKE', '%'.\${$schema['name']}.'%']; \r\n";
                            $body .= "} \r\n";
                            break;
                        case "date":
                            $body .= "if (!empty(\${$schema['name']})) {\r\n";
                            $body .= "\t\$map['{$schema['name']}'] = \${$schema['name']}; \r\n";
                            $body .= "} \r\n";
                            break;
                    }
                }
            }
        }
        return $body;
    }

    /**
     * 构建显示编辑页面操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildGetEditBody($model_name, $title, $schema_arr = [])
    {
        $body = "";
        $body .= "\$data = {$model_name}::find(\$request->get('id'));\r\n";

        $body .= "\r\n";
        $body .= "return\t\$this->html_builder->\r\n";
        $body .= "\t\tbuilderTitle('{$title}')->\r\n";
        $body .= self::mergeEditPageSchema($schema_arr);
        $body .= "\t\tbuilderEditData(\$data)->\r\n";
        $body .= "\t\tbuilderConfirmBotton('确认', '', 'btn btn-success')->\r\n";
        $body .= "\t\tbuilderEdit();";

        return $body;
    }

    /**
     * 组合编辑页面的字段
     *
     * @param $schema_arr
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeEditPageSchema($schema_arr)
    {
        $body = '';
        if (!empty($schema_arr)) {
            foreach ($schema_arr as $schema) {
                $body .= "\t\tbuilderFormSchema('{$schema['name']}', '{$schema['title']}', \$type = '{$schema['type']}', \$default = '{$schema['default']}', \$notice = '{$schema['notice']}', \$class = '{$schema['class']}', \$rule = '{$schema['rule']}', \$err_message = '{$schema['err_message']}')->\r\n";
            }
        }
        return $body;
    }

    /**
     * 构建处理编辑操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildPostEditBody($model_name)
    {
        $body = "";
        $body .= "\$data    = \$request->all();\r\n";
        $body .= "\$Model   = {$model_name}::findOrFail(\$data['id']);\r\n";
        $body .= "\$Model->update(\$data);\r\n";
        $body .= "\$this->response(self::SUCCESS_STATE_CODE, trans('response.update_success'));";
        return $body;
    }

    /**
     * 构建显示增加页面操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildGetAddBody($title, $schema_arr = [])
    {
        $body = "";
        $body .= "return\t\$this->html_builder->\r\n";
        $body .= "\t\tbuilderTitle('{$title}')->\r\n";
        $body .= self::mergeAddPageSchema($schema_arr);
        $body .= "\t\tbuilderConfirmBotton('确认', '', 'btn btn-success')->\r\n";
        $body .= "\t\tbuilderAdd();";

        return $body;
    }

    /**
     * 组合添加页面的字段
     *
     * @param $schema_arr
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function mergeAddPageSchema($schema_arr)
    {
        $body = '';
        if (!empty($schema_arr)) {
            foreach ($schema_arr as $schema) {
                $body .= "\t\tbuilderFormSchema('{$schema['name']}', '{$schema['title']}', \$type = '{$schema['type']}', \$default = '{$schema['default']}', \$notice = '{$schema['notice']}', \$class = '{$schema['class']}', \$rule = '{$schema['rule']}', \$err_message = '{$schema['err_message']}')->\r\n";
            }
        }
        return $body;
    }

    /**
     * 构建处理添加操作
     *
     * @return $this
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function buildPostAddBody($model_name)
    {
        $body = "";
        $body .= "\$data                = \$request->all();\r\n";
        $body .= "\$affected_number     = {$model_name}::create(\$data);\r\n";
        $body .= "return  \$affected_number->id > 0  ? \$this->response(self::SUCCESS_STATE_CODE, trans('response.add_success')) : \$this->response(self::ERROR_STATE_CODE, trans('response.add_error'));";
        return $body;
    }



}

