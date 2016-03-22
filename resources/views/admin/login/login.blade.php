<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>管理系统</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="">
  @include('admin.block.base_header')
  <link rel="stylesheet" href="<?php echo elixir('dist/login.css');?>">
</head>
<body>
<!-- Preloader -->
<div id="preloader">
  <div id="status">&nbsp;</div>
</div>
<div class="container">
  <div class="" id="login-wrapper">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div id="logo-login">
          <h1>管理系统 <span><?php echo config('config.version') ;?></span> </h1>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="account-box">
          <form action="<?php echo createUrl('Admin\LoginController@postLogin') ;?>" method="post" class="ajax-form">
            <div>
              <div class="form-group">
                <label for="inputUsernameEmail">用户名</label>
                <input type="text" name="admin_name" id="inputUsernameEmail" class="form-control" datatype="e" placeholder="请输入用户名" >
                <p class="bg-warning Validform_checktip"></p>
              </div>
              <div class="form-group">
                <label for="inputPassword">密码</label>
                <input type="password" name="password" id="inputPassword" class="form-control" datatype="*6-16"  placeholder="请输入密码">
                <p class="bg-warning Validform_checktip"></p>
              </div>
              <div class="checkbox pull-left">
                <label>
                  <input name="remember_me" type="checkbox">
                  记住用户名 </label>
              </div>
              <div class="row-block">
                <div class="row">
                  <div class="col-md-12 row-block">
                    <section class="button-submit">
                      <button data-style="slide-up"
                              class="ladda-button btn btn-primary btn-block pull-cnter"
                              data-size="l"
                              style="background-color:#286090"
                              >
                        <span class="ladda-label">登 录 </span>
                      </button>
                    </section>
                  </div>
                </div>
              </div>
              <div class="row-block">
                <div class="row"> </div>
              </div>
            </div>
            <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
          </form>
        </div>
      </div>
    </div>
    <p>&nbsp;</p>
    <div style="text-align:center;margin:0 auto;">
      <h6 style="color:#fff;">Copyright(C)<?php echo date('Y') ;?> <?php echo config('config.site_name');?> All Rights Reserved<br />
      </h6>
    </div>
  </div>
</div>
@include('admin.block.footer_js')
</body>
</html>
