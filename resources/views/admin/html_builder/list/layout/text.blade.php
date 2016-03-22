<div class="form-group">
    <label for="<?php echo $schema['name'] ;?>"><?php echo !empty($schema['title']) ? $schema['title'] : " " ;?></label>
    <input
            type="<?php echo $schema['type'] ;?>"
            name="<?php echo $schema['name'] ;?>"
            class="form-control <?php echo $schema['class'] ;?>"
            <?php if( isset($schema['attr']) && isset($schema['attr']['style']) ){echo "style=" . $schema['attr']['style'];};?>
            >
</div>