<div class="form-group">
       <div class="col-sm-12">
           <input type="<?php echo $schema['type']; ?>"
                  name="<?php echo $schema['name']; ?>"
                  value="<?php echo empty( array_get($data, $schema['name']) ) ? $schema['default'] : array_get($data, $schema['name']); ?>"
                  <?php if($schema['read_only'] == true):?>
                  readonly="readonly"
                  <?php endif;?>
                  <?php if($schema['disabled'] == true):?>
                  disabled="disabled"
                  <?php endif;?>
                  class="form-control <?php echo $schema['class']; ?>"
           >
       </div>
</div>