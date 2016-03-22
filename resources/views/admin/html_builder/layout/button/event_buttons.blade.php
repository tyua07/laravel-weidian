<button
        <?php if(!empty($button['url'])):?>
        onclick="window.location.href='<?php echo $button['url'];?>'"
        <?php endif;?>
        style="margin-right: 10px;border: 0;"
        data-style="slide-up"
        data-size="xs"
        <?php foreach ($button['events'] as $evnet):?>
            <?php if(strpos($evnet['name'], 'on') !== false):?>
                <?php echo "{$evnet['name']} ='{$evnet['function_name']}({$evnet['params']})' " ;?>
            <?php else: ?>
                <?php echo "on{$evnet['name']} = '{$evnet['function_name']}({$evnet['params']})' " ;?>
            <?php endif;?>
        <?php endforeach;?>
        type="button"
        class="btn btn-primary <?php if(!empty($button['class'])){echo $button['class'];}else{echo ' ';}?> ladda-button "
        >
    <span class="ladda-label" style="font-size: 12px;top: 1px;">
        <span class="margin-iconic <?php if(!empty($button['icon_class'])){echo $button['icon_class'];}else{echo ' ';}?> ">
        </span>
        <?php echo $button['name'];?>
    </span>
</button>