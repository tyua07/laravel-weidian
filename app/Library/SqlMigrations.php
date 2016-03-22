<?php

// +----------------------------------------------------------------------
// | date: 2015-12-13
// +----------------------------------------------------------------------
// | SqlMigrationgs.php: 导出数据相关
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Library;

use \DB;
use Illuminate\Support\Str;

class SqlMigrations
{
    private static $ignore 		= ['migrations']; //不需要数据迁移的表
    private static $database 	= "";             // 数据库名称
    private static $schema 		= [];
    private static $instance;
    private static $up 			= "";
    private static $down 		= "";

    //组合 查询 字段的 select
    private static $selects 	= [
        'column_name AS field',
        'column_type AS type ',
        'is_nullable AS is_null ',
        'column_key AS is_key ',
        'column_default AS is_default ',
        'extra AS extra',
        'data_type AS data_type'
    ];


    /**
     * 获得全部表
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getTables()
    {
        return DB::select('SELECT table_name FROM information_schema.tables WHERE table_schema="' . self::$database . '"');
    }

    /**
     * 获得表字段
     *
     * @param $table
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getTableDescribes($table)
    {
        return  DB::table('information_schema.columns')
                ->where('table_schema', '=', self::$database)
                ->where('table_name', '=', $table)
                ->select(self::$selects)
                ->get();
    }

    /**
     * 获得字段索引
     *
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getForeignTables()
    {
        return  DB::table('information_schema.KEY_COLUMN_USAGE')
                ->where('CONSTRAINT_SCHEMA', '=', self::$database)
                ->where('REFERENCED_TABLE_SCHEMA', '=', self::$database)
                ->select('TABLE_NAME')
                ->distinct()
                ->get();
    }

    /**
     * 外键
     *
     * @param $table
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function getForeigns($table)
    {
        return DB::table('information_schema.KEY_COLUMN_USAGE')
                ->where('CONSTRAINT_SCHEMA', '=', self::$database)
                ->where('REFERENCED_TABLE_SCHEMA', '=', self::$database)
                ->where('TABLE_NAME', '=', $table)
                ->select('COLUMN_NAME', 'REFERENCED_TABLE_NAME', 'REFERENCED_COLUMN_NAME')
                ->get();
    }

    /**
     * 编译字段
     *
     * @return string
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function compileSchema()
    {
        $upSchema 	= "";
        $downSchema = "";

        foreach (self::$schema as $name => $values) {
            //如果当前表在igonore 里面,则跳过
            if (in_array($name, self::$ignore)) continue;

            $upSchema 	.= "{$values['up']}";
            $downSchema .= "{$values['down']}";
        }

        $schema = "<?php \r\n
            //
            // NOTE Migration Created: " . date("Y-m-d H:i:s") . "
            // --------------------------------------------------

            use Illuminate\\Database\\Schema\\Blueprint;
            use Illuminate\\Database\\Migrations\\Migration;

            class Create" . str_replace('_', '', Str::title(self::$database)) . "Database  extends Migration {
                //
                // NOTE - Make changes to the database.
                // --------------------------------------------------
                public function up()
                {
                " . $upSchema . "
                " . self::$up . "
                }
                //
                // NOTE - Revert the changes to the database.
                // --------------------------------------------------
                public function down()
                {
                " . $downSchema . "
                " . self::$down . "
                }
            }";

        return $schema;
    }

    /**
     * up
     *
     * @param $up
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function up($up)
    {
        self::$up = $up;
    }

    /**
     * down
     *
     * @param $down
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function down($down)
    {
        self::$down = $down;
    }

    /**
     * igonore
     *
     * @param $tables
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function ignore($tables)
    {
        self::$ignore = array_merge($tables, self::$ignore);
        return self::$instance;
    }

    /**
     * 写入文件
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function write()
    {
        $schema 	= self::compileSchema();
        $filename 	= date('Y_m_d_His') . "_create_" . self::$database . "_database.php";
        $path 		= base_path('database/migrations/');
        //写入文件
        file_put_contents($path.$filename, $schema, 0777);
    }

    /**
     * 转换
     *
     * @param $database
     * @return SqlMigrations
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function convert($database)
    {

        self::$database = $database;
        $tables 		= self::getTables();

        foreach ($tables as $key => $value) {
            if (in_array($value->table_name, self::$ignore)) continue;

            $down 			= "Schema::drop('{$value->table_name}');";
            $up 			= "Schema::create('{$value->table_name}', function($" . "table) {\n";
            $tableDescribes = self::getTableDescribes($value->table_name);

            foreach ($tableDescribes as $values) {
                $data = self::setSchema($values);
                $up .= " $" . "table->{$data['method']}('{$values->field}'{$data['numbers']}){$data['nullable']}{$data['default']}{$data['unsigned']}{$data['unique']};\n";
            }
            $up .= " });\n\n";
            self::$schema[$value->table_name] = [
                'up' 	=> $up,
                'down' 	=> $down
            ];
        }

        // add foreign constraints, if any
        $tableForeigns = self::getForeignTables();

        if (sizeof($tableForeigns) !== 0) {
            foreach ($tableForeigns as $key => $value) {
                $up = "Schema::table('{$value->TABLE_NAME}', function($" . "table) {\n";
                $foreign = self::getForeigns($value->TABLE_NAME);
                foreach ($foreign as $k => $v) {
                    $up .= " $" . "table->foreign('{$v->COLUMN_NAME}')->references('{$v->REFERENCED_COLUMN_NAME}')->on('{$v->REFERENCED_TABLE_NAME}');\n";
                }
                $up .= " });\n\n";
                self::$schema[$value->TABLE_NAME . '_foreign'] = [
                    'up' 	=> $up,
                    'down' 	=> $down
                ];
            }
        }
    }

    /**
     * 设置字段类型
     *
     * @param $values
     * @return array
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private static function setSchema($values)
    {
        $method 	= "";
        $para 		= strpos($values->type, '(');
        $type 		= $para > -1 ? strtolower(substr($values->type, 0, $para)) : strtolower($values->type);
        $numbers 	= "";
        $nullable 	= $values->is_null == "NO" ? "" : "->nullable()";
        $default 	= empty($values->dafault) ? "" : "->default(\"{$values->dafault}\")";
        $unsigned 	= strpos($values->type, "unsigned") === false ? '' : '->unsigned()';
        $unique 	= $values->is_key == 'UNI' ? "->unique()" : "";

        switch ($type) {
            //整形
            case 'tinyint':
                $method = 'tinyInteger';
                break;
            case 'smallint':
                $method = 'smallInteger';
                break;
            case 'mediumint':
                $method = 'mediumInteger';
                break;
            case 'int' :
            case 'integer':
                $method = 'unsignedInteger';
                break;
            case 'bigint':
                $method = 'bigInteger';
                break;

            //浮点型
            case 'float' :
                $method = 'float';
                break;
            case 'double' :
                $method = 'double';
                break;
            case 'decimal' :
                $para 		= strpos($values->type, '(');
                $numbers 	= ", " . substr($values->type, $para + 1, -1);
                $method 	= 'decimal';
                break;

            //date 类型
            case 'date':
                $method = 'date';
                break;
            case 'timestamp' :
                $method = 'timestamp';
                break;
            case 'datetime' :
                $method = 'dateTime';
                break;
            case 'time' :
                $method = 'time';
                break;

            //字符串类型
            case 'char' :
            case 'varchar' :
                $para 		= strpos($values->type, '(');
                $numbers 	= ", " . substr($values->type, $para + 1, -1);
                $method 	= 'string';
                break;
            case 'mediumtext' :
                $method = 'mediumtext';
                break;
            case 'text' :
                $method = 'text';
                break;
        }
        if ($values->is_key == 'PRI') {
            $method = 'increments';
        }

        return [
            'method' 	=> $method,
            'numbers'	=> $numbers,
            'default' 	=> $default,
            'unsigned' 	=> $unsigned,
            'unique'	=> $unique,
            'nullable'	=> $nullable,
        ];
    }
}