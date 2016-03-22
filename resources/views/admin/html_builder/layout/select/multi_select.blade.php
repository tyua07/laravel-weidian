<!-- 如果当前 是可复制的select ，并且option的值是数组，代表需要多个select -->
<?php foreach($schema['option_value_schema'] as $option_key => $option_val) :?>
<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-3 last_child_div">
        <div class="skin skin-flat">
            <div class="row">

                <!-- 下拉列表框 -->
                <div class="col-sm-10">
                    <select
                            <?php if($schema['read_only'] == true):?>
                            readonly="readonly"
                            <?php endif;?>
                            <?php if($schema['read_only'] == true):?>
                            readonly="readonly"
                            <?php endif;?>
                            <?php if($schema['disabled'] == true):?>
                            disabled="disabled"
                            <?php endif;?>
                            class="form-control"
                            name="<?php echo $schema['name']; ?>">
                            <?php if ($schema['option']): ?>
                                <?php foreach ($schema['option'] as $k => $option): ?>

                                    <option
                                        <?php if ( ($option['id'] == $option_val) || (arrayGet($data, $schema['name']) === $option['id'])) :?>
                                            <?php echo "selected='selected' ";?>
                                        <?php endif; ?>
                                        value="<?php echo $option['id']; ?>" >
                                        <?php if ($option['level'] > 0) :?>
                                            <?php echo str_repeat('&nbsp;&nbsp;', $option['level']);?>
                                        <?php endif; ?>
                                        <?php echo $option[$schema['option_value_name']]; ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                    </select>
                </div>
                <!-- 下拉列表框 -->

                <!-- 可复制 -->
                <?php if(!empty($schema['attr']) && $schema['attr']['is_copy'] == true) :?>
                    <?php if ($option_key == 0) :?>
                        <button class="btn btn-default col-sm-2 addSelect" onclick="addSelect(this)" type="button">+</button>
                    <?php else:?>
                        <button class="btn btn-default col-sm-2 addSelect" onclick="removeSelect(this)" type="button">-</button>
                    <?php endif;?>
                <?php endif;?>
                <!-- 可复制 -->

            </div>

            <!-- 表单提示 -->
            <span class="help-block"><?php echo $schema['notice']; ?></span>
            <!-- 表单提示 -->

        </div>
    </div>
    <!-- 右侧 -->

</div>
<?php endforeach;?>
