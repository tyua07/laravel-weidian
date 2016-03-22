<body bg-action="app">
<!-- TOP NAVBAR -->
@section('top_side')
@include('admin.block.top_side')
@show
        <!-- /END OF TOP NAVBAR -->

<!-- SIDE MENU -->
@section('side_menu')
@include('admin.block.side_menu')
@show
        <!-- END OF SIDE MENU -->

<!--  PAPER WRAP -->
<div class="wrap-fluid">

    <div class="container-fluid paper-wrap bevel tlbr">
        <!-- CONTENT -->


        <!-- 面包屑 -->
        @section('bread')
        @include('admin.block.bread')
        @show
                <!-- END 面包屑 -->
