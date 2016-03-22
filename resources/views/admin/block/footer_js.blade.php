@include('admin.block.base_js')
<script>
    var app = bingo.action(function ($view, $ajax, $var) {
        $view.menu_id   = <?php echo $menu_id ;?>;
        $view.top_bar   = [];
        $view.side_menu = [];

        //获取顶级菜单
        $view.query = function () {
            $ajax("<?php echo createUrl('Admin\Admin\AdminMenuController@getAdminTopMenu') ?>").success(function (r) {
                if (r.code == HTTP_CODE.SUCCESS_CODE) {
                    $view.top_bar = r.data;
                    $view.click();
                    $view.$update();
                } else {
                    //如果不为空，则显示错误信息
                    if (r.msg != '') toastr.warning(r.msg);
                    //如果为true表示跳转到新连接
                    r.target == true && setTimeout(function () {
                        location.href = r.href;
                    }, 1000)
                }

            }).get();
        };
        $view.query();

        //获取子级菜单
        $view.click = function (msg) {
            if (msg) {
                $view.menu_id = msg;
            }
            //设置cookie
            //cookie("menu_id", $view.menu_id);
            $ajax("<?php echo createUrl('Admin\Admin\AdminMenuController@getAdminMenu') ?>").param({'parent_id': $view.menu_id}).success(function (r) {
                if (r.code == HTTP_CODE.SUCCESS_CODE) {
                    $view.side_menu = r.data;
                    $view.$update();
                } else {
                    //如果不为空，则显示错误信息
                    if (r.msg != '') toastr.warning(r.msg);
                    //如果为true表示跳转到新连接
                    r.target == true && setTimeout(function () {
                        location.href = r.href;
                    }, 1000)
                }

            }).get();
        };

        //保存点击左侧菜单id
        $view.saveChildMenuId = function (child_menu_id) {
            child_menu_id > 0 && cookie("child_menu_id", child_menu_id);
        }

    });


    //顶部菜单给定选中状态
    $(document).on('click', '#topbar li', function () {
        $("#topbar a").removeClass('topnav_hover');
        $(this).find('a').addClass('topnav_hover');
    })

</script>