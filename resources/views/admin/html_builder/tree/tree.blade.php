@section('header')
@include('admin.block.header')
<link href="<?php echo elixir('dist/builder_tree.css');?>" rel="stylesheet" >
@show
@include('admin.block.body')
@include('admin.html_builder.tree.tree_form')
@include('admin.block.footer')
<script src="<?php echo elixir('dist/builder_tree.js');?>"></script> 
</html>


