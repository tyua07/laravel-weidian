<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>选择图片</title>
	<?php echo Html::script('/assets/js/jquery.min.js');?>
	<?php echo Html::style('/assets/css/bootstrap.css');?>
	<?php echo Html::style('/bootstrap-table/src/bootstrap-table.css');?>
	<style>
	    img{cursor: pointer;}
	    .chose_img{border:1px solid #a94442;}
	</style>
	</head>
	<body>

<div class="container">
      <div id="toolbar" class="form-inline">

         <div class="form-group" style="display: inline-block;">
                <label for="exampleInputName2">文件类型</label>
                <select name="" id="" class="form-control">
                      <option value="">图片</option>
                </select>
        </div>
    </div>
      <table id="table"
               data-toolbar="#toolbar"
               data-search="true"
               data-show-refresh="true"
               data-show-toggle="true"
               data-show-columns="true"
               data-show-export="true"
               data-detail-view="true"

               data-minimum-count-columns="2"
               data-pagination="true"
               data-page-list="[10, 12, 25, 50, 100, ALL]"
               data-show-footer="true"
               data-side-pagination="server"
               data-url="<?php echo url('admin/resource/search') ;?>"
               data-show-header="false"
               data-response-handler="responseHandler"
               >
  </table>
    </div>

<!-- Scripts --> 


<script src="/assets/js/bootstrap.js"></script>
<script src="/bootstrap-table/src/bootstrap-table.js"></script>
<script src="/bootstrap-table/src/locale/bootstrap-table-zh-CN.js"></script>
<script src="/bootstrap-table/src/extensions/export/bootstrap-table-export.js"></script>
<script src="/bootstrap-table/src/extensions/export/tableExport.js"></script>
<script src="/bootstrap-table/src/extensions/editable/bootstrap-table-editable.js"></script>
<script src="/bootstrap-table/src/extensions/editable/bootstrap-editable.js"></script>

<script>

        var $table = $('#table'),
            html = '';

        $(function () {
            $table.bootstrapTable({
                width:getWidth(),
                height:getHeight()
            });
        });

       /**
        *   获得高度
        */
        function getHeight() {
            return $(window).height() - $('h1').outerHeight(true);
        }

       /**
        *   获得宽度
        */
        function getWidth(){
            return $table.width - $('h1').outerWidth(true);
        }

       /**
        *  处理响应，组合dom
        */
        function responseHandler(res){
            $('#table').hide();

            $.each(res.rows,function(i, value){
                html += '<div class="col-xs-6 col-md-3 thumbnail_div">';
                html += '<a href="javascript:void()" class="thumbnail">';
                html += value.file_name;
                html += '</a>';
                html += '</div>';
            })
            $('.fixed-table-body').append(html);
            return '';
        }

        /**
         * 选中图片时间
         */
        function choseImage(obj){
            $('.thumbnail').removeClass('chose_img')
            $(obj).parents('.thumbnail').addClass('chose_img');
        }
    </script>
</body>
</html>
