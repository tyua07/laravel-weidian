@section('header')
@include('admin.block.header')
<script src="/ckeditor/ckeditor.js"></script>
@include('UEditor::head');
@include('admin.block.header')
<link href="<?php echo elixir('dist/builder_tab.css');?>" rel="stylesheet" >
<style>
    .tabcontrol > .content > .body{padding: 0px 2.5%;}
    .nest .title-alt{margin: 10px auto 0;}
</style>
@show

@include('admin.block.body')
@include('admin.html_builder.tab.tab_form')
@include('admin.block.footer')
<script src="<?php echo elixir('dist/builder_tab.js');?>"></script> 
</html>

