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
                                    <form method="post" action="<?php echo action('Admin\Admin\AdminFunctionController@postUpdateLimitFunction');?>" class="form-horizontal ajax-form">

                                        <?php if(!empty($all_user_function)):?>
                                            <?php foreach($all_user_function as $function):?>
                                                <dl class="clearfix col-sm-offset-1">
                                                    <dt><input type="checkbox" class="horizontal" onclick='check_first_input(this)' name="function_id[]" <?php if($function->checked == true){ echo "checked='checked'";}?> value="<?php echo $function->id;?>" ><h4 class="horizontal"><?php echo $function->function_name;?></h4></dt>
                                                    <?php if(!empty($function->child)):?>
                                                        <?php foreach($function->child as $child):?>
                                                            <dd class="pull-left center-block"><input type="checkbox" class="horizontal" onclick='check_second_input(this)' name="function_id[]" <?php if($child->checked == true){ echo "checked='checked'";}?> value="<?php echo $child->id;?>" ><h6 class="horizontal"><?php echo $child->function_name;?></h6></dd>
                                                        <?php endforeach;?>
                                                    <?php endif;?>
                                                </dl>
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

