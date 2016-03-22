<div class="form-group">

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <div class="col-sm-3">
        <div class="col-xs-6 col-md-6">
            <a href="javascript:void(0)" class="thumbnail">
                <img src="<?php echo \App\Library\Image::getDefaultImage(); ?>" style="border:1px solid #000;padding: 5px;width: 150px;height: 150px;"/>
            </a>
        </div>
        <div class="col-xs-12 col-md-12" style="margin:10px 0;">
            <button onclick="showChoseImageDialog(this, <?php echo $schema['option']['source']; ?>, <?php echo $schema['option']['image_type']; ?>)" type="button"
                    class="btn btn-info btn-lg" style="margin-left: 10px;">
                <span class="entypo-picture"></span>&nbsp;&nbsp;选 择 图 片
            </button>
        </div>
        <input type="hidden" name="<?php echo $schema['name']; ?>"
               value="<?php echo arrayGet($data, $schema['name']) == '' ? $schema['default'] : arrayGet($data, $schema['name']); ?>"/>
        <span class="help-block"><?php echo $schema['notice']; ?></span>

        <div class="alert alert-danger hide" role="alert">
                                                    <span class="glyphicon glyphicon-exclamation-sign"
                                                          aria-hidden="true"></span>
            <span class="sr-only">Error:</span>
            <span class="err_message"></span>
        </div>
    </div>
</div>