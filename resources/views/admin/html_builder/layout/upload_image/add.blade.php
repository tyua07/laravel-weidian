<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-9">

        <!-- 默认图片 -->
        <div class="col-xs-2 col-md-2 hidden" style="padding-left:0;">
            <a href="javascript:void(0)" class="thumbnail">
                <img src="<?php echo $schema['default']; ?>" style="border:1px solid #000;padding: 5px;width: 150px;height: 150px;"/>
            </a>
        </div>
        <!-- 默认图片 -->

        <!-- 上传框 -->
        <div class="col-xs-12 col-md-12" style="margin:10px 0;padding-left:0;">
            <div class="col-sm-3" style="padding-left: 0;">
                <input type="file" name="<?php echo $schema['name']; ?>" class="form-control" multiple="multiple">
            </div>
        </div>
        <!-- 上传框 -->

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