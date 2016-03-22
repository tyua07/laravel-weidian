<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Laravel</title>

	<link rel="stylesheet" href="<?php echo elixir('dist/base.css');?>">
	<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<script src="<?php echo elixir('dist/base.js');?>"></script>
	<style>
		body{background: #fff;  }
        form{margin: 20px 0;}
	</style>
</head>
<body>
<div class="container">
    <h3>创建<?php echo $table_name;?>表配置信息</h3>
    <form class="form-horizontal ajax-form" method="post" action="<?php echo createUrl('\Yangyifan\AutoBuild\Http\Controllers\HomeController@postCurd') ;?>">

        <!-- Request -->
        <div class="panel panel-default">
            <div class="panel-heading">Request</div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="inputEmail3" class="col-sm-2 control-label">Request 文件名</label>
                    <div class="col-sm-10">
                        <input type="text" name="request[file_name]" class="form-control" id="inputEmail3" value="<?php echo $content['request[file_name]'] ;?>" placeholder="例如:'App/Request/Admin/UserInfo/UserInfoRequest'的格式 ">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPassword3" class="col-sm-2 control-label">Request 文件标题</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="request[file_title]" value="<?php echo $content['request[file_title]'] ;?>" id="inputPassword3" placeholder="例如:'会员Request'">
                    </div>
                </div>
            </div>
        </div>
        <!-- Request -->

        <!-- Model -->
        <div class="panel panel-default">
            <div class="panel-heading">Model</div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="inputEmail3" class="col-sm-2 control-label">Model 文件名</label>
                    <div class="col-sm-10">
                        <input type="text" name="model[file_name]" class="form-control" value="<?php echo $content['model[file_name]'] ;?>" id="inputEmail3" placeholder="例如:'App/Request/Admin/UserInfo/UserInfoModel'的格式 ">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPassword3" class="col-sm-2 control-label">Model 文件标题</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="model[file_title]" value="<?php echo $content['model[file_title]'] ;?>" id="inputPassword3" placeholder="例如:'会员模型'">
                    </div>
                </div>
            </div>
        </div>
        <!-- Model -->

        <!-- Controller -->
        <div class="panel panel-default">
            <div class="panel-heading">Controller</div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="inputEmail3" class="col-sm-2 control-label">Controller 文件名</label>
                    <div class="col-sm-10">
                        <input type="text" name="controller[file_name]" class="form-control" value="<?php echo $content['controller[file_name]'] ;?>" id="inputEmail3" placeholder="例如:'App/Request/Admin/UserInfo/UserInfoController'的格式 ">
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputPassword3" class="col-sm-2 control-label">Controller 文件标题</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" name="controller[file_title]" value="<?php echo $content['controller[file_title]'] ;?>" id="inputPassword3" placeholder="例如:'会员控制器'">
                    </div>
                </div>
            </div>
        </div>
        <!-- Controller -->


        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">确认生成</button>
            </div>
        </div>
        <input type="hidden" name="table_name"  value="<?php echo $table_name;?>">
    </form>
</div>
<script src="<?php echo elixir('dist/main.js');?>"></script>
</body>
</html>
