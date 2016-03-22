<!-- base -->
<script src="<?php echo elixir("dist/main.js");?>"></script>

<script src="/my97-date/WdatePicker.js"></script>

<?php if (!empty($scription_arr)): ?>
<?php foreach ($scription_arr as $scription): ?>
<script src="<?php echo $scription; ?>"></script>
<?php endforeach; ?>
<?php endif; ?>
<!-- base -->