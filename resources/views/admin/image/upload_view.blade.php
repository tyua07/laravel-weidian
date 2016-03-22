<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $title;?></title>
    @section('header')
        @include('admin.block.header')
        <link href="<?php echo elixir('dist/upload_image_dialog.css');?>" rel="stylesheet" >
    @show
    <style>
        body{background: #fff;}
    </style>
</head>
<body>


<div class="container">

    <div class="content-wrap">
        <div class="row">
            <div class="col-sm-12">
                <div class="nest" id="DropZoneClose">

                    <!-- 标题 -->
                    <div class="title-alt">
                        <div class="row">
                            <div class="col-sm-2">
                                <h6><?php echo trans('base.upload_title_1') ;?></h6>
                            </div>
                        </div>
                    </div>
                    <!-- 标题 -->

                    <!-- 上传框 -->
                    <div class="body-nest" id="DropZone">
                        <form action="<?php echo $upload_url ;?>" class="dropzone" id="my-dropzone">
                            <input type="hidden" name="_token" value="<?php echo  csrf_token();?>">
                            <input type="hidden" name="_id" value="<?php echo $id;?>">
                        </form>
                        <button style="margin-top:10px;" class="btn btn-info" id="submit-all"><?php echo trans('base.upload_title_1') ;?></button>
                    </div>
                    <!-- 上传框 -->

                </div>
            </div>
        </div>
    </div>

</div>
<!-- MAIN EFFECT -->
@section('js')
    @parent
    @include('admin.block.base_js')
     <script src="<?php echo elixir('dist/upload_image_dialog.js');?>"></script>
    <script type="text/javascript">

        //上传
        Dropzone.options.myDropzone = {
            maxFiles        : <?php echo config('upload.maxFiles');?>, //限制最多10个文件每次
            parallelUploads : <?php echo config('upload.parallelUploads');?>,//允许一起上传的文件个数
            maxFilesize     : <?php echo config('upload.maxFilesize');?>, //限制文件大小为单位是M
            addRemoveLinks  : true, //添加删除按钮
            paramName       :"<?php echo $input_name ;?>",//表单名称
            uploadMultiple  : false, //允许上传多个
            acceptedFiles   : "<?php echo config('upload.acceptedFiles');?>",//允许上传文件的类型
            autoProcessQueue: false,

            //初始化
            init: function() {
                var submitButton    = document.querySelector("#submit-all")
                myDropzone          = this; // closure
                submitButton.addEventListener("click", function() {
                    myDropzone.processQueue(); // Tell Dropzone to process all queued files.
                });
                this.on("addedfile", function() {
                });
                this.on('maxfilesexceeded', function() {
                    toastr.warning("<?php echo trans('base.upload_title_3', ['number' => config('upload.maxFiles')]) ;?>");
                });

            },

            //上传成功回调
            success: function(file){
                var _data = $.parseJSON(file.xhr.response);
                if (_data.code == HTTP_CODE.SUCCESS_CODE) {
                    if ( _data.msg != '' ) toastr.success(_data.msg);
                    return file.previewElement.classList.add("dz-success");
                }else{
                    if ( _data.msg != '' ) toastr.warning(_data.msg);
                    return file.previewElement.classList.add("dz-error");
                }

            }
        };
    </script>
    @show
            <!-- /MAIN EFFECT -->

</body>
</html>
