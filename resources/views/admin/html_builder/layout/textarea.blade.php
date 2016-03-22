<div class="form-group" id="<?php echo $schema['name']; ?>_parent">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-4 last_child_div">
        <textarea
                style="height: 150px;;" name="<?php echo $schema['name']; ?>"
                <?php if (empty($schema['rule'])) {
                    echo 'ignore="ignore"';
                } else {
                    echo 'datatype=' . $schema['rule'];
                }; ?>
                errormsg="<?php echo $schema['err_message']; ?>"
                class=" form-control <?php echo $schema['class']; ?>"
                <?php if($schema['read_only'] == true):?>
                readonly="readonly"
                <?php endif;?>
                <?php if($schema['disabled'] == true):?>
                disabled="disabled"
                <?php endif;?>
                 ><?php echo !empty($schema['default']) ? $schema['default'] : arrayGet($data, $schema['name']); ?></textarea>

        <!-- 表单提示 -->
        <span class="help-block"><?php echo $schema['notice']; ?></span>
        <!-- 表单提示 -->

        <!-- 当表单规则验证错误时，显示错误提示 -->
        <div class="alert alert-danger hide" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>
            <span class="err_message"></span>
        </div>
        <!-- 当表单规则验证错误时，显示错误提示 -->

    </div>
    <!-- 右侧 -->

</div>