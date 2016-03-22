@section('header')
@include('admin.block.header')
<style>
    .top_image{border: 2px solid red;}
</style>
@show
@include('admin.block.body')
@include('admin.weidian.goods_images.add_image_form')
@include('admin.block.footer')
</html>
<script>
    var batchUploadImagesUrl = '<?php echo createUrl("Admin\Weidian\GoodsImageController@getUploadView");?>';
    var delImageToTopUrl = '<?php echo createUrl('Admin\Weidian\GoodsImageController@postDelete') ;?>'
</script>
 <script src="<?php echo elixir('dist/multi_upload_image.js');?>"></script>