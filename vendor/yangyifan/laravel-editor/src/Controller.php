<?php

// +----------------------------------------------------------------------
// | date: 2015-10-09
// +----------------------------------------------------------------------
// | Controller.php: 基础控制器
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------

namespace Yangyifan\UEditor;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Yangyifan\UEditor\Uploader\UploadScrawl;
use Yangyifan\UEditor\Uploader\UploadFile;
use Yangyifan\UEditor\Uploader\UploadCatch;

class Controller extends BaseController
{

    /**
     * 构造方法
     *
     * Controller constructor.
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct()
    {

    }

    /**
     * 处理编辑器请求
     *
     * @param Request $request
     * @return mixed
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function server(Request $request)
    {
        $config = config('UEditorUpload.upload');
        $action = $request->get('action');


        switch ($action) {

            case 'config':
                $result = $config;
                break;
            case 'uploadimage':
                $config['maxSize']      = $config['imageMaxSize'];
                $config['fieldName']    = $config['imageFieldName'];
                $config['allowFiles']    = $config['imageAllowFiles'];
                $result = with(new UploadFile($config, $request))->upload();
                break;
            case 'uploadscrawl':
                $upConfig = [
                    "pathFormat"    => $config['scrawlPathFormat'],
                    "maxSize"       => $config['scrawlMaxSize'],
                    //   "allowFiles" => $config['scrawlAllowFiles'],
                    "oriName"       => "scrawl.png",
                    'fieldName'     => $config['scrawlFieldName'],
                ];
                $result = with(new UploadScrawl($upConfig, $request))->upload();
                break;
            case 'uploadvideo':
                $upConfig = [
                    "pathFormat"    => $config['videoPathFormat'],
                    "maxSize"       => $config['videoMaxSize'],
                    "allowFiles"    => $config['videoAllowFiles'],
                    'fieldName'     => $config['videoFieldName'],
                ];
                $result = with(new UploadFile($upConfig, $request))->upload();
                break;
            case 'uploadfile':
                $config['maxSize']      = $config['imageMaxSize'];
                $config['fieldName']    = $config['imageFieldName'];
                $config['allowFiles']    = $config['imageAllowFiles'];
                $result = with(new UploadFile($config, $request))->upload();
                break;
            /* 列出图片 */
            case 'listimage':
                switch (config('UEditorUpload.core.mode')) {
                    case 'local';
                        $result = with(new Lists(
                            $config['imageManagerAllowFiles'],
                            $config['imageManagerListSize'],
                            $config['imageManagerListPath'],
                            $request))->getList();
                        break;
                    case 'qiniu';
                        $result = with(new ListsQiniu(
                            $config,
                            $request))->getList();
                        break;
                    case 'upyun';
                        $result = with(new ListsUpyun(
                            $config,
                            $request))->getList();
                        break;
                }
                break;
            /* 列出文件 */
            case 'listfile':
                if (config('UEditorUpload.core.mode') == 'local') {
                    $result = with(new Lists(
                        $config['fileManagerAllowFiles'],
                        $config['fileManagerListSize'],
                        $config['fileManagerListPath'],
                        $request))->getList();
                }else if (config('UEditorUpload.core.mode') == 'qiniu') {
                    $result = with(new ListsQiniu(
                        $config['fileManagerAllowFiles'],
                        $config['fileManagerListSize'],
                        $config['fileManagerListPath'],
                        $request))->getList();
                }
                break;

            /* 抓取远程文件 */
            case 'catchimage':

                $upConfig = [
                    "pathFormat"    => $config['catcherPathFormat'],
                    "maxSize"       => $config['catcherMaxSize'],
                    "allowFiles"    => $config['catcherAllowFiles'],
                    "oriName"       => "remote.png",
                    'fieldName'     => $config['catcherFieldName'],
                ];

                $sources = \Input::get($upConfig['fieldName']);
                $list = [];
                foreach ($sources as $imgUrl) {
                    $upConfig['imgUrl'] = $imgUrl;
                    $info = with(new UploadCatch($upConfig, $request))->upload();

                    array_push($list, [
                        "state"     => $info["state"],
                        "url"       => $info["url"],
                        "size"      => $info["size"],
                        "title"     => htmlspecialchars($info["title"]),
                        "original"  => htmlspecialchars($info["original"]),
                        "source"    => htmlspecialchars($imgUrl)
                    ]);
                }
                $result = [
                    'state' => count($list) ? 'SUCCESS' : 'ERROR',
                    'list' => $list
                ];


                break;
        }

        return response()->json($result, 200, [], JSON_UNESCAPED_UNICODE);

    }


}
