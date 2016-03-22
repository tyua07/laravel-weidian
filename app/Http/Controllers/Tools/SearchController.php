<?php

// +----------------------------------------------------------------------
// | date: 2015-12-25
// +----------------------------------------------------------------------
// | SearchController.php: 搜索控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Tools;

use App\Http\Requests;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class SearchController extends BaseController
{
    /**
     * 构造方法
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 首页
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex()
    {
        $xs = app('search', [
            'config_name' => 'search/demo.ini'
        ]);
        $index  = $xs->index;
        $search = $xs->search;

        $search->setFuzzy()->setQuery("侧试");
        $docs       = $search->search();
        $count      = $search->count();



        // 由于拼写错误，这种情况返回的数据量可能极少甚至没有，因此调用下面方法试图进行修正
        $corrected = $search->getCorrectedQuery();

        if (count($corrected) !== 0)
        {
            // 有纠错建议，列出来看看；此情况就会得到 "测试" 这一建议
            echo "您是不是要找：\n";
            foreach ($corrected as $word)
            {
                echo $word . "\n";
            }
        }

        //dd($related_words);
        dd($docs, $count);
    }
}
