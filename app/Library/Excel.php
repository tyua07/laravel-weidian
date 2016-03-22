<?php

// +----------------------------------------------------------------------
// | date: 2015-09-14
// +----------------------------------------------------------------------
// | Excel.php: 表格
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Library;

use Maatwebsite\Excel\Facades\Excel AS MaatwebsiteEcel;

class Excel
{

    /**
     * 导出excle
     *
     * @param $file_name
     * @param $data
     * @param $head
     * @param string $title
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public static function export($file_name, $data, $head, $title = '')
    {
        //设置超时时间
        set_time_limit(0);

        MaatwebsiteEcel::create($file_name, function($excel) use ($title, $data, $head){
            // 设置标题
            $excel->setTitle($title);
            //设置列
            $excel->sheet('First sheet', function($sheet) use ($data, $head) {
                $sheet->fromArray(objToArray($data));
                $sheet->row(1, $head);

            });

        })->download('xls');;

    }


}