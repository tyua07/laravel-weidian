
@section('header')
@include('admin.block.header')
<style>
  .horizontal {display: inline-block;margin-left: 10px;}
  dd{width: 120px;height: auto;}
</style>
@show

@include('admin.block.body')
@include('admin.admin.function.main')
@include('admin.block.footer')
</html>

<script>

  function checke_all(obj){
    var _this = $(obj);
    if(_this.prop('checked') == true){
      $('input[type=checkbox]').prop('checked', 'checked');
    }else{
      $('input[type=checkbox]').removeAttr('checked');
    }

  }

  function check_first_input(obj){
    var _this = $(obj);
    if(_this.prop('checked') == true){
      _this.parents('dl').find('input').prop('checked','checked');
    }else{
      _this.parents('dl').find('input').removeAttr('checked');
    }

  }

  function check_second_input(obj){
    var _this = $(obj);
    if(_this.prop('checked') == true){
      _this.parents('dt').find('input').prop('checked','checked');
    }else{
      _this.parents('dt').find('input').removeAttr('checked');
    }
  }

</script>
