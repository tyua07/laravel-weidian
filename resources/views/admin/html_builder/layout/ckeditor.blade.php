<div class="form-group" id="<?php echo $schema['name']; ?>_parent">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-7 last_child_div">
        <textarea  name="<?php echo $schema['name']; ?>"
                  id="<?php echo $schema['name']; ?>"
                  datatype="<?php echo $schema['rule']; ?>"
                  errormsg="<?php echo $schema['err_message']; ?>"
                   <?php if($schema['read_only'] == true):?>
                    readonly="readonly"
                   <?php endif;?>
                   <?php if($schema['disabled'] == true):?>
                   disabled="disabled"
                   <?php endif;?>
                  class=" <?php echo $schema['class']; ?>"><?php echo arrayGet($data, $schema['name']) == '' ? '' : arrayGet($data, $schema['name']); ?></textarea>

        <!-- 实例化编辑器 -->
        <script type="text/javascript">
            <?php if (!empty($schema['default'])) :?>
                    editor = CKEDITOR.replace("<?php echo $schema['name'] ;?>", {
                <?php if (!empty($schema['default'])) :?>
                    <?php echo "{$schema['default']}";?>
                <?php endif;?>
            });
            <?php else:?>
                editor = CKEDITOR.replace("<?php echo $schema['name'] ;?>");
            <?php endif;?>
        </script>
        <!-- 实例化编辑器 -->

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