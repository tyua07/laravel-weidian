<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-4 last_child_div">
        <div class="skin skin-flat">
            <div class="row">

                <!-- 下拉列表框 -->
                <div class="col-sm-10">
                    <select class="form-control"
                            <?php if($schema['read_only'] == true):?>
                                readonly="readonly"
                            <?php endif;?>
                            <?php if($schema['disabled'] == true):?>
                            disabled="disabled"
                            <?php endif;?>
                            name="<?php echo $schema['name']; ?>">
                            <?php if ($schema['option']): ?>
                                <?php foreach ($schema['option'] as $k => $option): ?>
                                    <option
                                        <?php if ( ($option['id'] == $schema['option_value_schema']) || ( arrayGet($data, $schema['name']) === $option['id'])) :?>
                                            <?php echo "selected='selected' ";?>
                                        <?php endif; ?>
                                        value="<?php echo $option['id']; ?>" >
                                        <?php if ($option['level'] > 0) :?>
                                            <?php echo str_repeat('&nbsp;&nbsp;', $option['level']); ;?>
                                        <?php endif;?>
                                        <?php echo $option[$schema['option_value_name']]; ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                    </select>
                </div>
                <!-- 下拉列表框 -->

                <?php if(!empty($schema['attr']) && $schema['attr']['is_copy'] == true) :?>
                        <!-- 可复制 -->
                <button class="btn btn-default col-sm-2 addSelect" onclick="addSelect(this)" type="button">+</button>
                <!-- 可复制 -->
                <?php endif;?>

            </div>

            <!-- 表单提示 -->
            <span class="help-block"><?php echo $schema['notice']; ?></span>
            <!-- 表单提示 -->

        </div>
    </div>
    <!-- 右侧 -->

</div>