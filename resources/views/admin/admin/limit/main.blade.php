<div class="content-wrap">
                <div class="row">
                    <div class="col-sm-12">

                        <div class="nest" id="tabletreeClose">
                            <div class="title-alt">
                                <h6><?php echo $title; ?></h6>
                                <div class="titleClose">
                                    <a class="gone" href="#tabletreeClose">
                                        <span class="entypo-cancel"></span>
                                    </a>
                                </div>
                                <div class="titleToggle">
                                    <a class="nav-toggle-alt" href="#tabletree">
                                        <span class="entypo-up-open"></span>
                                    </a>
                                </div>

                            </div>

                            <div class="body-nest" id="tabletree">

                                <div class="container">
                                    <form method="post" action="<?php echo action('Admin\Admin\AdminMenuController@postUpdateLimitMenu');?>" class="form-horizontal ajax-form">

                                        <?php if(!empty($all_user_menu)):?>
                                        <?php foreach($all_user_menu as $menu):?>
                                        <div class="dl">
                                            <div class="dt"><input type="checkbox" class="horizontal" onclick='check_first_input(this)' name="menu_id[]" <?php if($menu->checked == true){ echo "checked='checked'";}?> value="<?php echo $menu->id;?>" ><h4 class="horizontal"><?php echo $menu->menu_name;?></h4></div>
                                            <?php if(!empty($menu->child)):?>
                                            <?php foreach($menu->child as $child):?>
                                            <div class="dd">
                                                <input type="checkbox" class="horizontal" onclick='check_second_input(this)' name="menu_id[]" <?php if($child->checked == true){ echo "checked='checked'";}?> value="<?php echo $child->id;?>" >
                                                <h5 class="horizontal"><?php echo $child->menu_name;?></h5>
                                                <br>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <?php if(!empty($child->child)):?>
                                                <?php foreach($child->child as $last_child):?>
                                                <input type="checkbox" class="horizontal" onclick='check_second_input(this)' name="menu_id[]" <?php if($last_child->checked == true){ echo "checked='checked'";}?> value="<?php echo $last_child->id;?>" >
                                                <h6 class="horizontal"><?php echo $last_child->menu_name;?></h6>
                                                <?php endforeach;?>
                                                <?php endif;?>
                                            </div>
                                            <?php endforeach;?>
                                            <?php endif;?>
                                        </div>
                                        <hr>
                                        <?php endforeach;?>
                                        <?php endif;?>

                                        <div class="row">
                                            <div class="col-sm-12">
                                                <input type="checkbox"  onclick='checke_all(this)'   />全选

                                                <section class="button-submit">
                                                    <button data-style="slide-up"
                                                            class=" btn btn-success ladda-button pull-cnter col-md-1"
                                                            data-size="l"
                                                            >
                                                        <span class="ladda-label">确认</span>
                                                    </button>
                                                </section>
                                            </div>
                                        </div>

                                        <input type="hidden" name="limit_id" value="<?php echo $limit_id ;?>">
                                    </form>
                                </div>



                            </div>

                        </div>


                    </div>
                </div>
            </div>
            <!-- /END OF CONTENT -->

