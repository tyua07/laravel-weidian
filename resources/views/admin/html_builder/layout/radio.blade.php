<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-5 last_child_div">
        <div class="skin skin-flat">

            <?php if ($schema['option']): ?>
                <?php foreach ($schema['option'] as $key => $option): ?>
                    <label for="<?php echo $schema['name']; ?>_<?php echo $key; ?>" class="radio-inline">
                        <input type="radio"
                               id="<?php echo $schema['name']; ?>_<?php echo $key; ?>"
                               name="<?php echo $schema['name']; ?>"
                               value="<?php echo $key; ?>"
                               <?php if ($schema['option_value_schema'] == $key) {
                                echo 'checked="checked"';
                                } ?>
                               aria-describedby="help-block"
                               <?php if($schema['read_only'] == true):?>
                               readonly="readonly"
                               <?php endif;?>
                               <?php if($schema['disabled'] == true):?>
                               disabled="disabled"
                               <?php endif;?>
                               tabindex="11"/>
                        <?php echo $option; ?>
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