<?php

// +----------------------------------------------------------------------
// | date: 2015-10-09
// +----------------------------------------------------------------------
// | ListsUpyun.php: 列表页 for Upyun
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\UEditor;

use Yangyifan\Upload\Upload;
use Yangyifan\Upload\Upyun\Upload as Upyun;
use App\Library\Image;

class ListsUpyun
{
    /**
     * 构造方法
     *
     * @param $allowFiles
     * @param $listSize
     * @param $path
     * @param $request
     * @param Upload $upload
     * @param Qiniu $qiniu
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($config, $request)
    {
        $this->allowFiles       = substr(str_replace(".", "|", join("", $config['imageManagerAllowFiles'])), 1);
        $this->listSize         = $config['imageManagerListSize'];
        $this->image_source     = $config['image_source'];
        $this->image_type       = $config['image_type'];
        $this->path             = Image::getPath($this->image_source, $this->image_type);
        $this->request          = $request;
        $this->upload           = new Upload();
        $this->upload->drive    = new Upyun();//选择上传引擎
    }

    /**
     * 获得文件列表
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getList()
    {
        $size   = $this->request->get('size', $this->listSize);
        $start  = $this->request->get('start', '');

        $items = $this->upload->listFiles($this->path);

        if(empty($items)){
            return [
                "state" => "no match file",
                "list"  => [],
                "start" => $start,
                "total" => 0
            ];
        }

        $files=[];
        foreach ($items as  $v) {
            if (preg_match("/\.(" . $this->allowFiles . ")$/i", $v['name'])) {
                $files[] = [
                    'url'   => Image::getImageRealPath($v['name'], $this->image_source, $this->image_type),
                    'mtime' => $v['type'],
                ];
            }
        }
        if(empty($files)){
            return [
                "state" => "no match file",
                "list"  => [],
                "start" => $start,
                "total" => 0
            ];
        }
        /* 返回数据 */
        $result = [
            "state" => "SUCCESS",
            "list"  => $files,
            "start" => $start,
            "total" => count($files)
        ];

        return $result;
    }

}
