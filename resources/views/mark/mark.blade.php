<script src="http://cdn.bootcss.com/jquery/2.1.4/jquery.js"></script>
@include('editor::head')


<div class="editor">
    <?php echo Form::textarea('content', '', ['class' => 'form-control','id'=>'myEditor']) ;?>
</div>