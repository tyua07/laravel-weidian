@section('header')
@include('admin.block.header')
@include('UEditor::head');
<script src="/ckeditor/ckeditor.js"></script>
<link rel="stylesheet" href="<?php echo elixir('dist/builder_update.js');?>">
@show

@include('admin.block.body')
@include('admin.html_builder.edit.edit_form_main')
@include('admin.block.footer')
 <script src="<?php echo elixir('dist/builder_update.js');?>"></script>
</html>



