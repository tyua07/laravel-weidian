<link rel="stylesheet" href="<?php echo elixir('dist/base.css');?>">
<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
 <script src="http://html5shim.googlecode.com/svn/trunk/html5.js" ></script>
<![endif]-->
<script src="<?php echo elixir('dist/base.js');?>"></script>
<script>
    //定义全局url
    var fileUrl             = '<?php echo config("config.file_url");?>';//资源网址
    var choseImageDialog    = "<?php echo url('admin/resource/chose-image-dialog');?>";//弹出选择图片提示框 url
    var confirm_text        = '<?php echo trans('base.comfirm_add_data') ;?>';
    var concel_text         = '<?php echo trans('base.cancel');?>';
    var locale              = '<?php echo  "zh-CN";?>';
    var logout_url          = '<?php echo createUrl("Admin\HomeController@getLogout") ;?>';
</script>
<style>
    .wrap-fluid {
        width:90%;
        margin-left: 160px;
        float: left;
    }
</style>