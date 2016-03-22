
<?php if( $is_show_form !== false ):?>
        <!-- 如果builderIsShowForm 设置为 true的时候，则不需要显示form标签 -->
<form id="form" method="<?php echo $method; ?>" action="<?php echo !empty($confirm_button) ? $confirm_button["url"] : ''; ?>" class="form-horizontal bucket-form ajax-form" enctype="multipart/form-data" >
<?php endif;?>

        <?php if (!empty($schemas)): ?>
        <?php foreach ($schemas as $schema): ?>

        <?php if ($schema['type'] == 'text'): ?>
                <!-- 文本框 -->
        @include('admin.html_builder.layout.text')

        <?php elseif ($schema['type'] == 'search'): ?>
                <!-- 搜索框 -->
        @include('admin.html_builder.layout.search')

        <?php elseif ($schema['type'] == 'label') : ?>
                <!-- label -->
        @include('admin.html_builder.layout.label')

        <?php elseif ($schema['type'] == 'hidden') : ?>
                <!-- 隐藏域 -->
        @include('admin.html_builder.layout.hidden')


        <?php elseif ($schema['type'] == 'textarea'): ?>
                <!-- 多行文本框 -->
        @include('admin.html_builder.layout.textarea')

        <?php elseif ($schema['type'] == 'password'): ?>
                <!-- 密码框 -->
        @include('admin.html_builder.layout.password')

        <?php elseif ($schema['type'] == 'date'): ?>
                <!-- 日期框 -->
        @include('admin.html_builder.layout.date')

        <?php elseif ($schema['type'] == 'image'): ?>
                <?php if($build_html_type == 'edit' ):?>
                <!-- 如果是edit页面，则显示这种类型图片框 -->
                        <!-- 图片框 -->
                        @include('admin.html_builder.layout.image.edit')
                <?php else:?>
                        <!-- 图片框(添加页面) -->
                        @include('admin.html_builder.layout.image.add')
                <?php endif;?>
        <?php elseif ($schema['type'] == 'upload_image'): ?>
                <!-- 图片上传框 -->
        @include('admin.html_builder.layout.upload_image.edit')

        <?php elseif ($schema['type'] == 'ueditor'): ?>
                <!-- 百度富文本编辑器 -->
        @include('admin.html_builder.layout.ueditor')
        <?php elseif ($schema['type'] == 'ckeditor'): ?>
                <!-- ckeditor 富文本编辑器 -->
        @include('admin.html_builder.layout.ckeditor')

        <?php elseif ($schema['type'] == 'radio'): ?>
                <!-- 单选框 -->
        @include('admin.html_builder.layout.radio')

        <?php elseif ($schema['type'] == 'checkbox'): ?>
                <!-- 复选框 -->
        @include('admin.html_builder.layout.checkbox')

        <?php elseif ($schema['type'] == 'select'): ?>
                <!-- 下拉选择框 -->
        @include('admin.html_builder.layout.select')

        <?php elseif ($schema['type'] == 'multiSelect'): ?>
                <!-- 双向选择器 -->

        @include('admin.html_builder.layout.multiselect')
        <?php elseif ($schema['type'] == 'file'): ?>
                <!-- 文件上传框 -->
        @include('admin.html_builder.layout.file')

        <?php elseif ($schema['type'] == 'rating'): ?>
                <!-- 评分 -->
        @include('admin.html_builder.layout.rating')

        <?php endif; ?>

        <?php endforeach; ?>
        <?php endif; ?>


        <?php if(!empty($confirm_button)):?>
                <div class="form-group">
                        <div class="col-lg-offset-3 col-lg-10 row-block">
                                <section class="button-submit">
                                        <button data-style="slide-up"
                                                class="ladda-button <?php echo $confirm_button['class']; ?>  pull-cnter col-md-2"
                                                data-size="l"
                                                >
                                                <span class="ladda-label"><?php echo $confirm_button['title']; ?></span>
                                        </button>
                                </section>
                        </div>
                </div>
        <?php endif;?>

<?php if($build_html_type == 'edit'):?>
        <!-- 如果是编辑页面则显示id 隐藏域 -->
        <input name="id" type="hidden" value="<?php echo $data->id; ?>"/>
<?php endif;?>

<input name="_token" type="hidden" value="<?php echo csrf_token(); ?>"/>

<?php if( $is_show_form !== false ):?>
        <!-- 如果builderIsShowForm 设置为 true的时候，则不需要显示form标签 -->
        </form>
<?php endif;?>
