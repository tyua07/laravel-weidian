<?php

// +----------------------------------------------------------------------
// | date: 2015-10-09
// +----------------------------------------------------------------------
// | ListsQiniu.php: 列表页 for 七牛
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace Yangyifan\UEditor;

use Yangyifan\Upload\Upload;
use Yangyifan\Upload\Qiniu\Upload as Qiniu;
use App\Library\Image;

class ListsQiniu
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
        $this->path             = $config['imageManagerListPath'];
        $this->request          = $request;
        $this->upload           = new Upload();
        $this->upload->drive    = new Qiniu();//选择上传引擎
    }

    /**
     * 获得文件列表
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function getList()
    {
        $size = $this->request->get('size', $this->listSize);
        $start = $this->request->get('start', '');
        //$auth = new Auth(config('UEditorUpload.core.qiniu.accessKey'), config('UEditorUpload.core.qiniu.secretKey'));

        //$bucketManager = new BucketManager($auth);
        //list($items, $marker, $error) = $bucketManager->listFiles(config('UEditorUpload.core.qiniu.bucket'), $this->path, $start, $size);

        $items = $this->upload->listFiles($this->path);

        if ($error) {
            return [
                "state" => $error->message(),
                "list"  => array(),
                "start" => $start,
                "total" => 0
            ];
        }
        if(empty($items)){
            return [
                "state" => "no match file",
                "list" => array(),
                "start" => $start,
                "total" => 0
            ];
        }

        $files=[];
        foreach ($items as  $v) {
            if (preg_match("/\.(" . $this->allowFiles . ")$/i", $v['key'])) {
                $files[] = array(
                    'url'   => Image::getImageRealPath($v['key']),
                    'mtime' => $v['mimeType'],
                );
            }
        }
        if(empty($files)){
            return [
                "state" => "no match file",
                "list" => array(),
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
