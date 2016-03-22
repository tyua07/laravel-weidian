<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-9 last_child_div">
        <div class="skin skin-flat">
            <?php if ($schema['option']): ?>
                <?php foreach ($schema['option'] as $key => $value): ?>
                    <label for="<?php echo $schema['name']; ?>_<?php echo $key; ?>" class="checkbox-inline">
                        <input  type="checkbox"
                                id="<?php echo $schema['name']; ?>_<?php echo $key; ?>"
                                name="<?php echo $schema['name']; ?>"
                                value="<?php echo $key; ?>" <?php if (!empty($schema['option_value_schema']) && in_array($key, $schema['option_value_schema'])) {
                                    echo 'checked="checked"';
                                } ?> aria-describedby="help-block" tabindex="11"
                                id="flat-checkbox-1"
                                <?php if($schema['read_only'] == true):?>
                                    readonly="readonly"
                                <?php endif;?>
                                <?php if($schema['disabled'] == true):?>
                                    disabled="disabled"
                                <?php endif;?>
                        />
                        <?php echo $value; ?>
                    </label>
                <?php endforeach; ?>
            <?php endif; ?>

            <!-- 表单提示 -->
            <span class="help-block"><?php echo $schema['notice']; ?></span>
            <!-- 表单提示 -->

        </div>
    </div>
    <!-- 右侧 -->

</div>

