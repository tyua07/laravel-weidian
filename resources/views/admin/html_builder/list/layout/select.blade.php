<div class="form-group" >
    <label for="<?php echo $schema['name'] ;?>"><?php echo !empty($schema['title']) ? $schema['title'] : " " ;?></label>
    <select
            class="form-control"
            name="<?php echo $schema['name'] ;?>"
            <?php if( isset($schema['attr']) && isset($schema['attr']['style']) ){echo "style=" . $schema['attr']['style'];};?>
            >
        <?php if($schema['option']):?>
        <option value="0" ><?php echo trans('base.place_chose');?></option>
        <?php foreach($schema['option'] as $k=>$option):?>
        <option <?php if($option['id'] == $schema['option_value_schema']){ echo "selected='selected' ";} ?> value="<?php echo $option['id'];?>"   >
            <?php if($option['level'] > 0 ){echo str_repeat('&nbsp;&nbsp;', $option['level']);}?>
            <?php echo $option[$schema['option_value_name']];?>
        </option>
        <?php endforeach;?>
        <?php endif;?>
    </select>
</div>