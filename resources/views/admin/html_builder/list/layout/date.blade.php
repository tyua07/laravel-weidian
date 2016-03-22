<div class="form-group">
    <label for="<?php echo $schema['name'] ;?>"><?php echo !empty($schema['title']) ? $schema['title'] : " " ;?></label>
    <input
            type="text"
            name="<?php echo $schema['name'] ;?>"
            class="form-control <?php echo $schema['class'] ;?>"
            readonly="readonly"
            onclick="WdatePicker({<?php if(!empty($schema['default'])){echo "{$schema['default']}";}else{echo "dateFmt:'yyyy-MM-dd HH:mm:ss'";}?>})"
            <?php if( isset($schema['attr']) && isset($schema['attr']['style']) ){echo "style=" . $schema['attr']['style'];};?>
            <?php if( isset($schema['attr']) && isset($schema['attr']['default_date']) ){echo "value=" . $schema['attr']['default_date'];};?>
            >
</div>