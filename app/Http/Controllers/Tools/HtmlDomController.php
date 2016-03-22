<?php

// +----------------------------------------------------------------------
// | date: 2015-08-21
// +----------------------------------------------------------------------
// | HtmlDomController.php: 采集库
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\BaseController;

use App;

use App\Model\Tools\HtmlModel;

class HtmlDomController extends BaseController{

    private $html;

    /**
     * 构造函数
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct(){
        //设置对象
        $this->html = App::make('App\Library\simple_html_dom');
        load_func('common');
    }

    /**
     * 开始执行采集
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getIndex(){
        //获得任务
        $all_task = config('config.html');


        if(!empty($all_task)){
            foreach($all_task as $task){

                //加载网址
                $this->html->load_file($task['url']);
                foreach($this->html->find($task['parent_dom']) as $article) {

                    if($task['type'] == true && !empty($article->children)){
                        foreach($article->children as $child){
                            $this->findChild($child, $task);
                        }
                    }else{
                        $this->findChild($article, $task);
                    }
                }
            }
        }
    }

    /**
     * 查找元素，并且写入数据
     *
     * @param $child
     * @param $task
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    private function findChild($child, $task){
        $tmp_url = parse_url($task['url']);

        //判断内容不能为空
        if($child->find($task['child_dom'], $task['number'])->innertext == ''){
            return;
        }

        $url = $child->find($task['child_dom'], $task['number'])->getAttribute('href');
        $url = str_replace(['../', './'], ['/', $tmp_url['path']], $url);


        $data = parse_url($url);
        if(empty($data['host'])){

            $url = $tmp_url['scheme'] . '://' . $tmp_url['host'] . $url;
        }

        $title = $child->find($task['child_dom'], $task['number'])->plaintext;
        $title = iconv(mb_detect_encoding($title, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5')), 'UTF-8', $title);

        //如果内容为空则跳过
        if(empty($title)){
            return;
        }
        if(empty($url)){
            return;
        }
        //写入数据
        HtmlModel::task($title, $url, $task['cat_id']);
    }

    public function a(){
        return false;
    }

}