<nav role="navigation" class="navbar navbar-static-top">
    <div class="container-fluid">

        <div id="bs-example-navbar-collapse-1" class="collapse navbar-collapse">
            <!-- 父级菜单 -->
            <div id="nt-title-container" class="navbar-left">
                @include('admin.block.top_bar')
            </div>
            <!-- 父级菜单 -->

            <!-- 登录信息 -->
            <ul style="margin-right:0;" class="nav navbar-nav navbar-right">
                <li>
                    <a data-toggle="dropdown" class="dropdown-toggle"
                       href="#">Hi, <?php echo $admin_info->admin_name; ?>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0)" onclick="logout()">
                        &#160;&#160; <?php echo trans('response.logout');?></a>
                </li>

                <li class="hidden-xs hidden-sm hidden-md hidden">
                    <a class="toggle-left" href="#">
                        <span style="font-size:20px;" class="entypo-list-add"></span>
                    </a>
                </li>
            </ul>
            <!-- 登录信息 -->

        </div>
    </div>
</nav>