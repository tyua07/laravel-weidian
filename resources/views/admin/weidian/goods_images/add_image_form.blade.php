<div class="content-wrap">
    <div class="row">
        <div class="col-sm-12">
            <div class="nest" id="elementClose">

                <div class="title-alt">
                    <h6><?php echo $title; ?></h6>

                    <div class="titleClose"><a class="gone" href="#elementClose"> <span class="entypo-cancel"></span>
                        </a></div>
                    <div class="titleToggle"><a class="nav-toggle-alt" href="#element"> <span
                                    class="entypo-up-open"></span> </a></div>
                </div>

                <div class="body-nest" id="element">
                    <div class="panel-body">

                        <!-- 按钮 -->
                        <div class="col-xs-12 col-md-12" style="margin:10px 0;">

                            <!-- 返回按钮 -->
                            <div class="col-sm-1" style="margin-right: 20px;">
                                <a href="<?php echo createUrl('Admin\Weidian\GoodsController@getIndex') ;?>" class="btn btn-success">
                                    <span class="margin-iconic glyphicon glyphicon-arrow-left "></span>
                                    返回
                                </a>
                            </div>
                            <!-- 返回按钮 -->

                            <!-- 批量上传按钮 -->
                            <div class="col-sm-1">
                                <button onclick="batchUploadImages(this, <?php echo $goods_id;?>)" type="button"
                                        class="btn btn-info btn-lg" style="margin-left: 10px;">
                                    <span class="entypo-picture"></span>&nbsp;&nbsp;批量上传
                                </button>
                            </div>
                            <!-- 批量上传按钮 -->

                        </div>
                        <!-- 按钮 -->

                        <!-- 图片列表 -->
                        <?php if(count($image_arr) > 0 ) :?>

                            <ul class="col-sm-12 image_list_container" style="margin-top: 20px;">
                                <?php foreach ($image_arr as $image) :?>
                                    <li class="col-xs-6 col-md-6 image_list" id="<?php echo  $image->id;?>" style="overflow: hidden;">
                                        <div class="row imageSelector">
                                            <div class="col-sm-4 col-sm-offset-1">
                                                <a href="#" class="thumbnail">
                                                    <img src="<?php echo $image->media;?>" alt="..." style="width: 150px;height: 100px;">
                                                </a>
                                            </div>
                                            <div class="col-sm-3">
                                                <button type="button" class="btn btn-sm btn-danger" onclick="delImageToTop(this, <?php echo $image->id;?>, <?php echo $image->goods_id;?>)">删除</button>
                                            </div>
                                        </div>

                                    </li>
                                <?php endforeach;?>
                            </ul>

                        <?php endif;?>
                        <!-- 图片列表 -->


                    </div>
                </div>
            </div>
        </div>
    </div>
</div>