<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>构建代码</title>

	<link rel="stylesheet" href="<?php echo elixir('dist/base.css');?>">
	<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<script src="<?php echo elixir('dist/base.js');?>"></script>
	<style>
		.navbar{  margin:0!important;  }
        table{background: #fff!important}
	</style>
</head>
<body>
<!-- 顶部导航条 -->
<nav class="navbar navbar-inverse">
	<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-9" aria-expanded="false">
		<span class="sr-only">数据库表列表</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
	</button>
	<a class="navbar-brand" href="#">数据库列表</a>
</nav>
<!-- 顶部导航条 -->

<div class="container">

    <table class="table table-bordered table-hover table-condensed table-responsive" style="margin: 20px 0;">
        <tr>
            <td align="center">Tabel Name</td>
            <td align="center">操作</td>
        </tr>

        <?php if(!empty($all_table)):?>
            <?php foreach ($all_table as $table) :?>
                <tr>
                    <td align="center"> <?php echo $table['table_name']?></td>
                    <td align="center">
                        <button type="button" data-table-name="<?php echo $table['table_name']?>" class="btn btn-default create-request-config">生成Request配置</button>
                        <button type="button" data-table-name="<?php echo $table['table_name']?>" class="btn btn-info create-controller-config">生成Controller配置</button>
                        <button type="button" data-table-name="<?php echo $table['table_name']?>" class="btn btn-success curd">生成CURD</button>
                    </td>
                </tr>
            <?php endforeach;?>
        <?php endif;?>
    </table>

</div>

<script src="<?php echo elixir('dist/main.js');?>"></script>
<script>
    /**
     * 自动生成
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    function AutoBuild()
    {
        //执行构造方法
        this.__construct();
    }

    /**
     * 构造方法
     *
     * @private
     @author yangyifan <yangyifanphp@gmail.com>
     */
    AutoBuild.prototype.__construct = function ()
    {

    }

    /**
     * 创建Request配置
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    AutoBuild.prototype.createRequestConfig = function ($table_name)
    {
        //iframe层
        layer.open({
            type: 2,
            title: '创建Request配置',
            shadeClose: true,
            shade: 0.8,
            content: '<?php echo createUrl("\Yangyifan\AutoBuild\Http\Controllers\Config\RequestController@getIndex") ;?>?table_name=' + $table_name //iframe的url
        });
    }

    /**
     * 创建Controller配置
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    AutoBuild.prototype.createControllerConfig = function ($table_name)
    {
        //iframe层
        layer.open({
            type: 2,
            title: '创建Controller配置',
            shadeClose: true,
            shade: 0.8,
            content: '<?php echo createUrl("\Yangyifan\AutoBuild\Http\Controllers\Config\ControllerController@getIndex") ;?>?table_name=' + $table_name //iframe的url
        });
    }

    /**
     * 生成curd页面
     *
     * @author yangyifan <yangyifanphp@gmail.com>
     */
    AutoBuild.prototype.curd = function ($table_name)
    {
        //iframe层
        layer.open({
            type: 2,
            title: '生成curd页面',
            shadeClose: true,
            shade: 0.8,
            content: '<?php echo createUrl("\Yangyifan\AutoBuild\Http\Controllers\HomeController@getCurd") ;?>?table_name=' + $table_name //iframe的url
        });
    }

    //实例化对象
    var $autoBuild = new AutoBuild();

    $(function ()
    {
        /**
         * 创建Request配置
         *
         */
        $('.create-request-config').on('click', function()
        {
            var $table_name = $(this).attr('data-table-name');
            $autoBuild.createRequestConfig($table_name);
        })

        /**
         * 创建Controller配置
         *
         */
        $('.create-controller-config').on('click', function()
        {
            var $table_name = $(this).attr('data-table-name');
            $autoBuild.createControllerConfig($table_name);
        })

        /**
         * 生成curl页面
         *
         */
        $('.curd').on('click', function ()
        {
            var $table_name = $(this).attr('data-table-name');
            $autoBuild.curd($table_name);
        })
    })



</script>
</body>
</html>
