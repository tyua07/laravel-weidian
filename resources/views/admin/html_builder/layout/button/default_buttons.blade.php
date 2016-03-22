<button
        <?php if(!empty($button['url'])):?>
            onclick="window.location.href='<?php echo $button['url'];?>'"
        <?php endif;?>
        style="margin-right: 10px;"
        type="button"
        class="btn btn-primary <?php if(!empty($button['class'])){echo $button['class'];}else{echo ' ';}?> "
        >
    <span style="font-size: 12px;top: 1px;">
        <span class="margin-iconic <?php if(!empty($button['icon_class'])){echo $button['icon_class'];}else{echo ' ';}?> ">
        </span>
        <?php echo $button['name'];?>
    </span>

</button>