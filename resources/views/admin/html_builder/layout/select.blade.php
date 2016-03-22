<?php if( (!empty($schema['attr']) && $schema['attr']['is_copy'] == true ) &&  (is_array($schema['option_value_schema']) && count($schema['option_value_schema']) >= 1 ) ) :?>
    <!-- 如果当前 是可复制的select ，并且option的值是数组，代表需要多个select -->
    @include('admin.html_builder.layout.select.multi_select')
<?php else:?>
    @include('admin.html_builder.layout.select.select')
<?php endif;?>