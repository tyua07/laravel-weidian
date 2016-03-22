<?php if(count($list_buttons) > 0 ):?>
    <div class="row" style="margin: 10px 0;">
        <div class="btn-group" role="group" style="width: 100%;" aria-label="...">
            <?php foreach($list_buttons as $button):?>

                <?php if(is_array($button['events']) && count($button['events']) > 0 ):?>
                    <!--事件类型按钮 -->
                    @include('admin.html_builder.layout.button.event_buttons')
                <?php else:?>
                     <!--默认类型按钮 -->
                    @include('admin.html_builder.layout.button.default_buttons')
                <?php endif;?>
            <?php endforeach;?>
        </div>
    </div>
<?php endif;?>