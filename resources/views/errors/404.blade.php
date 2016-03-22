<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Apricot v1.2</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
    body {
        overflow:hidden!important;
        padding-top: 120px;
    }
    </style>
    @section('header')
        	@include('admin.block.header')
        	<link rel="stylesheet" href="/assets/css/extra-pages.css">
    @show
</head>

<body><div id="awwwards" class="right black"><a href="http://www.awwwards.com/best-websites/apricot-navigation-admin-dashboard-template" target="_blank">best websites of the world</a></div>
    <!-- Preloader -->
    <div id="preloader">
        <div id="status">&nbsp;</div>
    </div>


    <div class="logo-error">
        <h1>Apricot
            <span>v1.0</span>
        </h1>
    </div>

    <!-- Main content -->
    <section class="page-error">

        <div class="error-page">
            <h2 class="headline text-info">404</h2>
            <div class="error-content">
                <h3><i class="fa fa-warning text-yellow"></i> Oops! Page not found.</h3>
                <p>
                    We could not find the page you were looking for. Meanwhile, you may <a class="error-link" href='index.html'>return to dashboard</a> or try using the search form.
                </p>
                <form class='search-form'>
                    <input type="text" name="search" class='form-control' placeholder="Search">
                </form>
            </div>
            <!-- /.error-content -->
        </div>
        <!-- /.error-page -->

    </section>



@section('js')
	@include('admin.block.footer_js')
@show

</body>

</html>
