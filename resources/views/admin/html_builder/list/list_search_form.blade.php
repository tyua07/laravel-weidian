<form method="<?php echo $method; ?>" class="form-inline search_form" onsubmit="return false;">
    <?php if(is_array($search_schema) && count($search_schema) > 0 ):?>
        <?php foreach($search_schema as $schema):?>
            <?php if($schema['type'] == 'text'):?>
                <!-- 文本框 -->
                @include('admin.html_builder.list.layout.text')
            <?php elseif($schema['type'] == 'hidden'):?>
                <!-- 隐藏域 -->
                @include('admin.html_builder.list.layout.hidden')
            <?php elseif($schema['type'] == 'date'):?>
                <!-- 日期框 -->
                @include('admin.html_builder.list.layout.date')
            <?php elseif($schema['type'] == 'select'):?>
                <!--下拉选择框 -->
                @include('admin.html_builder.list.layout.select')
            <?php endif;?>
        <?php endforeach;?>
    <button type="submit" class="btn btn-info search_btn"><?php echo trans('base.search') ;?></button>
    <?php endif;?>

</form>