<div class="form-group" id="<?php echo $schema['name']; ?>_parent" >

    <!-- 左侧 -->
    <label class="col-sm-2 control-label"><?php echo $schema['title'] ? $schema['title'] . ':' : ''; ?></label>
    <!-- 左侧 -->

    <!-- 右侧 -->
    <div class="col-sm-4 last_child_div">


        <!-- 评分容器 -->
            <div class="">
                <!-- 评分 -->
                    <div class="<?php echo $schema['name']; ?>_div" data-length="<?php echo isset($schema['attr']['numberMax']) ? $schema['attr']['numberMax'] : 5;?>" data-score="<?php echo $schema['default'] ? : 0; ?>" style="float:left" ></div>
                <!-- 评分 -->

                <!-- 显示分数 -->
                    <div style="float:left">(<span><?php echo $schema['default'] ? : 0; ?></span> / <?php echo isset($schema['attr']['numberMax']) ? $schema['attr']['numberMax'] : 5;?>)</div>
                <!-- 显示分数 -->
            </div>
        <!-- 评分容器 -->


        <script>
            $(function(){
                var length = Math.floor($('.<?php echo $schema['name']; ?>_div').attr('data-length'));
                $('.<?php echo $schema['name']; ?>_div').raty({
                    path        : "/raty/img",
                    number      : length,
                    scoreName   : "<?php echo $schema['name']; ?>", //保存值的隐藏域
                    score       : function() {
                        return $(this).attr('data-score');
                    },
                    click       : function(score, evt) {
                        $('input[name=<?php echo $schema['name']; ?>]').val(score );
                        $('.<?php echo $schema['name']; ?>_div').next('div').find('span').text(score);
                    }
                });
            })
        </script>

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