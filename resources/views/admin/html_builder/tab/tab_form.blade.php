<style>
    .tabcontrol > .content {
        height: auto
    }

    .tabcontrol > .content > .body {
        position: static;
    }
</style>
<div class="content-wrap">
    <div class="row">

        <div class="col-sm-12">
            <div class="nest" id="tabClose">
                <div class="title-alt">
                    <h6>
                        <?php echo $title; ?></h6>

                    <div class="titleClose">
                        <a class="gone" href="#tabClose">
                            <span class="entypo-cancel"></span>
                        </a>
                    </div>
                    <div class="titleToggle">
                        <a class="nav-toggle-alt" href="#tab">
                            <span class="entypo-up-open"></span>
                        </a>
                    </div>

                </div>

                <!-- tab  -->
                <div>

                    <?php if (!empty($tabs_schemas)): ?>

                        <!-- 导航 tabs -->
                        <ul class="nav nav-tabs" role="tablist">
                            <?php foreach ($tabs_schemas as $k => $tabs_schema): ?>
                                <?php $data = $tab_data[$k]; ?>
                                <?php $confirm_button = $tab_confirm_button[$k]; ?>
                                <?php $tabs_schema = unserialize($tabs_schema); ?>
                                    <?php if($k == 0) :?>
                                        <li role="presentation" class="active">
                                            <a href="#<?php echo $k;?>" aria-controls="<?php echo $k;?>" role="tab" data-toggle="tab"><?php echo $tabs_schema->title; ?></a>
                                        </li>
                                    <?php else:?>
                                        <li role="presentation" class="">
                                            <a href="#<?php echo $k;?>" aria-controls="<?php echo $k;?>" role="tab" data-toggle="tab"><?php echo $tabs_schema->title; ?></a>
                                        </li>
                                    <?php endif;?>
                            <?php endforeach; ?>
                        </ul>
                        <!-- 导航 tabs -->

                        <!-- 内容  tabs-->
                            <form method="<?php echo $method; ?>" action="<?php echo $post_url; ?>" class="form-horizontal bucket-form ajax-form" enctype="multipart/form-data" >
                                <div class="tab-content">
                                    <?php foreach ($tabs_schemas as $k => $tabs_schema): ?>
                                    <?php $data = $tab_data[$k]; ?>
                                    <?php $confirm_button = $tab_confirm_button[$k]; ?>
                                    <?php $tabs_schema = unserialize($tabs_schema); ?>
                                    <?php if($k == 0) :?>
                                    <div role="tabpanel" class="tab-pane active" id="<?php echo $k;?>">
                                        <?php $schemas  = $tabs_schema->form_schema;?>
                                        <?php $title    = $tabs_schema->title; ?>
                                        <?php $method   = $tabs_schema->method; ?>
                                        @include('admin.html_builder.edit.edit_form_main')
                                    </div>
                                    <?php else:?>
                                    <div role="tabpanel" class="tab-pane " id="<?php echo $k;?>">
                                        <?php $schemas  = $tabs_schema->form_schema; ?>
                                        <?php $title    = $tabs_schema->title; ?>
                                        <?php $method   = $tabs_schema->method; ?>
                                        @include('admin.html_builder.edit.edit_form_main')
                                    </div>
                                    <?php endif;?>
                                    <?php endforeach; ?>
                                </div>
                            </form>

                        </div>
                        <!--  内容  tabs -->


                    <?php endif; ?>
                </div>
                <!-- tab  -->


            </div>
        </div>


    </div>
</div>