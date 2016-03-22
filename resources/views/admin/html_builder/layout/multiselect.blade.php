<div class="form-group">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-9 last_child_div">

        <!-- 待选区 -->
        <div class="select_side">
            <p>待选区</p>
            <select id="selectL" name="<?php echo $schema['name'];?>_left" multiple="multiple">
                <?php if (!empty($schema['option'])): ?>
                    <?php foreach ($schema['option'] as $k => $option): ?>
                        <option value="<?php echo $option['id']; ?>"><?php echo $option[$schema['option_value_name']]; ?></option>
                    <?php endforeach; ?>
                <?php endif; ?>
            </select>
        </div>
        <!-- 待选区 -->

        <!-- 操作按钮 -->
        <div class="select_opt">
            <p id="toright" title="添加">></p>
            <p id="toleft" title="移除"><</p>
        </div>
        <!-- 操作按钮 -->

        <!-- 已选区 -->
        <div class="select_side">
            <p>已选区</p>
            <select id="selectR" name="<?php echo $schema['name'];?>_right" multiple="multiple">
                <?php if (!empty($schema['option_value_schema'])): ?>
                <?php foreach ($schema['option_value_schema'] as $k => $option): ?>
                <option
                        value="<?php echo $option['id']; ?>"><?php echo $option[$schema['option_value_name']]; ?></option>
                <?php endforeach; ?>
                <?php endif; ?>
            </select>
        </div>
        <!-- 已选区 -->

        <input type="hidden" name="<?php echo $schema['name']; ?>" value="">
    </div>
    <!-- 右侧 -->

</div>