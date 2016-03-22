<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Laravel</title>
	@section('header')
        	@include('......admin.block.header')
            <?php echo Html::style('/assets/js/upload/demos/css/uploader.css');?>
            <?php echo Html::style('/assets/js/upload/demos/css/demo.css');?>
            <?php echo Html::style('/assets/js/dropZone/downloads/css/dropzone.css');?>
            <script type="text/javascript" src="/qiniu.js/qiniu.min.js"></script>
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
               <div class="title-alt">
                 <h6> DropZone</h6>
                 <div class="titleClose"> <a class="gone" href="#DropZoneClose"> <span class="entypo-cancel"></span> </a> </div>
                 <div class="titleToggle"> <a class="nav-toggle-alt" href="#DropZone"> <span class="entypo-up-open"></span> </a> </div>
               </div>
               <div class="body-nest" id="DropZone">
                 <form action="<?php echo url('tools/upload/upload') ;?>" class="dropzone" id="my-dropzone">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                 </form>
                 <button style="margin-top:10px;" class="btn btn-info" id="submit-all">Submit all files</button>
               </div>
             </div>
           </div>
         </div>
       </div>

    </div>
    <!-- MAIN EFFECT -->
    @section('js')
    	@include('......admin.block.footer_js')
    	@parent
    	<script type="text/javascript" src="/assets/js/upload/demos/js/demo.min.js"></script>
        <script type="text/javascript" src="/assets/js/upload/src/dmuploader.min.js"></script>
        <script type="text/javascript" src="/assets/js/dropZone/lib/dropzone.js"></script>
        <script type="text/javascript">

            $('#drag-and-drop-zone').dmUploader({
                dataType: 'json',
                allowedTypes: 'image/*',
                extFilter: 'jpg;png;gif',
                onInit: function() {
                    $.danidemo.addLog('#demo-debug', 'default', 'Plugin initialized correctly');
                },
                onBeforeUpload: function(id) {
                    $.danidemo.addLog('#demo-debug', 'default', 'Starting the upload of #' + id);

                    $.danidemo.updateFileStatus(id, 'default', 'Uploading...');
                },
                onNewFile: function(id, file) {
                    $.danidemo.addFile('#demo-files', id, file);
                },
                onComplete: function() {
                    $.danidemo.addLog('#demo-debug', 'default', 'All pending tranfers completed');
                },
                onUploadProgress: function(id, percent) {
                    var percentStr = percent + '%';

                    $.danidemo.updateFileProgress(id, percentStr);
                },
                onUploadSuccess: function(id, data) {
                    $.danidemo.addLog('#demo-debug', 'success', 'Upload of file #' + id + ' completed');

                    $.danidemo.addLog('#demo-debug', 'info', 'Server Response for file #' + id + ': ' + JSON.stringify(data));

                    $.danidemo.updateFileStatus(id, 'success', 'Upload Complete');

                    $.danidemo.updateFileProgress(id, '100%');
                },
                onUploadError: function(id, message) {
                    $.danidemo.updateFileStatus(id, 'error', message);

                    $.danidemo.addLog('#demo-debug', 'error', 'Failed to Upload file #' + id + ': ' + message);
                },
                onFileTypeError: function(file) {
                    $.danidemo.addLog('#demo-debug', 'error', 'File /'+ file.name + '/ cannot be added: must be an image');
                },
                onFileSizeError: function(file) {
                    $.danidemo.addLog('#demo-debug', 'error', 'File /'+ file.name + '/ cannot be added: size excess limit');
                },
                /*onFileExtError: function(file){
                  $.danidemo.addLog('#demo-debug', 'error', 'File /'' + file.name + '/' has a Not Allowed Extension');
                },*/
                onFallbackMode: function(message) {
                    $.danidemo.addLog('#demo-debug', 'info', 'Browser not supported(do something else here!): ' + message);
                }
            });
            </script>
        <script>
            Dropzone.options.myDropzone = {

                // Prevents Dropzone from uploading dropped files immediately
                autoProcessQueue: false,

                init: function() {
                    var submitButton = document.querySelector("#submit-all")
                    myDropzone = this; // closure

                    submitButton.addEventListener("click", function() {
                        myDropzone.processQueue(); // Tell Dropzone to process all queued files.
                    });

                    // You might want to show the submit button only when
                    // files are dropped here:
                    this.on("addedfile", function() {
                        // Show submit button here and/or inform user to click it.
                    });

                }
            };
            </script>
    @show
    <!-- /MAIN EFFECT -->

</body>
</html>
