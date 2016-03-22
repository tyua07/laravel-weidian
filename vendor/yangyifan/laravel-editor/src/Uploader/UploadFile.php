<?php

// +----------------------------------------------------------------------
// | date: 2015-10-10
// +----------------------------------------------------------------------
// | UploadFile.php: 文件/图像普通上传
// +----------------------------------------------------------------------
// | Author: yangyifan <yangyifanphp@gmail.com>
// +----------------------------------------------------------------------


namespace Yangyifan\UEditor\Uploader;

use Yangyifan\UEditor\Uploader\Upload;
use Yangyifan\Upload\Upload AS BaseUpload;
use Yangyifan\Upload\Upyun\Upload as UpYun;
use App\Library\Image;

class UploadFile  extends Upload
{
    use UploadQiniu;

    /**
     * 构造方法
     *
     * UploadFile constructor.
     * @param array $config
     * @param $request
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function __construct($config, $request)
    {
        parent::__construct($config, $request);
        $this->upload           = new BaseUpload();
        $this->upload->drive    = new UpYun();//选择上传引擎
        $this->image_source     = $config['image_source'];
        $this->image_type       = $config['image_type'];
        $this->path             = Image::getPath($this->image_source, $this->image_type);
    }


    /**
     * 处理上传
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    public function doUpload()
    {


        $file = $this->request->file($this->fileField);
        if (empty($file)) {
            $this->stateInfo = $this->getStateInfo("ERROR_FILE_NOT_FOUND");
            return false;
        }
        if (!$file->isValid()) {
            $this->stateInfo = $this->getStateInfo($file->getError());
            return false;

        }

        $this->file     = $file;
        $this->oriName  = $this->file->getClientOriginalName();
        $this->fileSize = $this->file->getSize();
        $this->fileType = $this->getFileExt();
        $this->fullName = $this->getFullName();
        $this->filePath = $this->path . $this->oriName ;
        $this->fileName = basename($this->filePath);

        //检查文件大小是否超出限制
        if (!$this->checkSize()) {
            $this->stateInfo = $this->getStateInfo("ERROR_SIZE_EXCEED");
            return false;
        }
        //检查是否不允许的文件格式
        if (!$this->checkType()) {
            $this->stateInfo = $this->getStateInfo("ERROR_TYPE_NOT_ALLOWED");
            return false;
        }

        if(config('UEditorUpload.core.mode')=='local'){
            try {
                $this->file->move(dirname($this->filePath), $this->fileName);
                $this->stateInfo = $this->stateMap[0];
            } catch (FileException $exception) {
                $this->stateInfo = $this->getStateInfo("ERROR_WRITE_CONTENT");
                return false;
            }

        } elseif (config('UEditorUpload.core.mode')=='qiniu'){

            $content=file_get_contents($this->file->getPathname());
            return $this->uploadQiniu($this->filePath,$content);

        } elseif (config('UEditorUpload.core.mode')=='upyun') {
            $this->upload->write($this->filePath, $this->request->file($this->fileField));

            //todo 继续完善 判断状态码
            $this->fullName= Image::getImageRealPath($this->fileName, $this->image_source, $this->image_type);
            $this->stateInfo =  $this->stateMap[0];
            return true;
        } else {
            $this->stateInfo = $this->getStateInfo("ERROR_UNKNOWN_MODE");
            return false;
        }




        return true;

    }
}
