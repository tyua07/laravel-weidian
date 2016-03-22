@include('admin.block.header')

<body>

<!-- Main content -->
<section class="page-error" style="margin: 40px auto;">

    <div class="error-page">
        <h2 class="headline text-info">Error</h2>
        <div class="error-content">
            <h3><i class="fa fa-warning text-yellow"></i><?php echo trans('response.error_page');?></h3>
            <p>
                 <?php echo $message;?><a class="error-link" href='/'><?php echo trans('response.return_to_home') ;?></a>
            </p>
        </div>
    </div>

</section>

@section('js')
    @include('admin.block.footer_js')
@show

</body>

</html>
