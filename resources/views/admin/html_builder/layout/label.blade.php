<div class="form-group">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-4 last_child_div">
        <span><?php echo !empty($schema['default']) ? $schema['default'] : array_get($data, $schema['name']); ?></span>

        <!-- 表单提示 -->
        <span class="help-block"><?php echo $schema['notice']; ?></span>
        <!-- 表单提示 -->

    </div>
    <!-- 右侧 -->

</div>