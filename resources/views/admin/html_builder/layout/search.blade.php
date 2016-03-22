<div class="form-group">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 搜索框 -->
    <div class="col-sm-3">
        <input type="text"
               name="search_name_xxxxx"
               value="<?php echo $schema['default']; ?>"
               <?php if($schema['read_only'] == true):?>
               readonly="readonly"
               <?php endif;?>
               <?php if($schema['disabled'] == true):?>
               disabled="disabled"
               <?php endif;?>
               class="form-control <?php echo $schema['class']; ?>"
        >
    </div>
    <!-- 搜索框 -->

    <!-- 右侧 -->
    <div class="col-sm-3">
        <a href="javascript:void(0)" onclick='searchForSelect(this, <?php echo $schema['option'];?>)' class="btn btn-info">搜索</a>
        <select name="<?php echo $schema['name']; ?>" onchange="selectSearch(this)" class="form-control select-con">
            <option value="" >请选择</option>
        </select>
        <input type="hidden" name="<?php echo $schema['name']; ?>" value="<?php echo arrayGet($data, $schema['name']) == '' ? $schema['default'] : arrayGet($data, $schema['name']); ?>">
    </div>
    <!-- 右侧 -->

</div>

<div class="form-group">
    <div class="col-sm-3 col-sm-offset-3">

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
</div>
