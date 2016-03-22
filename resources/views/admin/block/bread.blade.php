<?php if(!empty($location_arr)):?>

<div class="row">
    <div id="paper-top">
    </div>
</div>

<ul id="breadcrumb">
    <!-- 面包屑导航 -->
    <li><span class="entypo-home"></span></li>
    <li><i class="fa fa-lg fa-angle-right"></i></li>

    <?php $total_location = count($location_arr);?>

    <?php foreach ($location_arr as  $k => $location) :?>
    <?php if( ($total_location - 1) == $k):?>
    <li><a href="<?php echo createUrl($location->menu_url) ?>"
           title="Sample page 1"><?php echo $location->menu_name;?></a></li>
    <?php else:?>
    <li><a href="<?php echo createUrl($location->menu_url) ?>"
           title="Sample page 1"><?php echo $location->menu_name;?></a></li>
    <li><i class="fa fa-lg fa-angle-right"></i></li>
    <?php endif;?>

    <?php endforeach;?>

</ul>
<?php endif;?>
