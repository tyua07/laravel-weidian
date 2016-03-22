<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-9">
    <ul class="navbar-nav menu-left-nest topnav" id="topbar" bg-render="item in top_bar">
        <script type="text/html">
            {{if item.id == <?php echo $menu_id ;?>; }}
            <li><a class="topnav_hover" bg-click="click('{{: item.id}}')" href="javascript:void(0)"
                   bg-text="item.menu_name"></a></li>
            {{else}}
            <li><a bg-click="click('{{: item.id}}')" href="javascript:void(0)" bg-text="item.menu_name"></a></li>
            {{/if}}
        </script>
    </ul>
</div>