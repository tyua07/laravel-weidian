<!DOCTYPE html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Laravel</title>
	<?php echo Html::script('/assets/js/jquery.min.js');?>
	<?php echo Html::style('/assets/css/bootstrap.css');?>
	<?php echo Html::style('/bootstrap-table/src/bootstrap-table.css');?>
	<script>
        $(function(){
            $('form').submit(function(e){
                e.preventDefault();
                $.post('<?php url("") ;?>')
            })
        })
	</script>
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
               data-detail-formatter="detailFormatter"
               data-minimum-count-columns="2"
               data-show-pagination-switch="true"
               data-pagination="true"
               data-page-list="[10, 12, 25, 50, 100, ALL]"
               data-show-footer="true"
               data-side-pagination="server"
               data-url="<?php echo url('admin/resource/search') ;?>"
               data-response-handler="responseHandler">
  </table>
    </div>

<!-- Scripts --> 

<script src="/layer-v1.9.3/layer/layer.js"></script> 
<script src="/assets/js/bootstrap.js"></script>
<script src="/bootstrap-table/src/bootstrap-table.js"></script>
<script src="/bootstrap-table/src/locale/bootstrap-table-zh-CN.js"></script>
<script src="/bootstrap-table/src/extensions/export/bootstrap-table-export.js"></script>
<script src="/bootstrap-table/src/extensions/export/tableExport.js"></script>
<script src="/bootstrap-table/src/extensions/editable/bootstrap-table-editable.js"></script>
<script src="/bootstrap-table/src/extensions/editable/bootstrap-editable.js"></script>

<script>
        var $table = $('#table'),
            $remove = $('#remove'),
            selections = [];

        $(function () {
            $table.bootstrapTable({
                height: getHeight(),
                columns: [

                    [
                    {
                            field: 'id',
                            title: 'id',
                            sortable: true,
                            editable: false,
                            align: 'center'
                        },

                        {
                            field: 'file_name',
                            title: '文件名称',
                            sortable: true,
                            editable: true,
                            footerFormatter: totalNameFormatter,
                            align: 'left'
                        }, {
                            field: 'file_type',
                            title: '文件类型',
                            sortable: true,
                            align: 'center',
                            editable: {
                                type: 'text',
                                title: '文件类型',
                                validate: function (value) {
                                    value = $.trim(value);
                                    if (!value) {
                                        return 'This field is required';
                                    }
                                    if (!/^$/.test(value)) {
                                        return 'This field needs to start width $.'
                                    }
                                    var data = $table.bootstrapTable('getData'),
                                        index = $(this).parents('tr').data('index');
                                    console.log(data[index]);
                                    return '';
                                }
                            },
                            footerFormatter: totalPriceFormatter
                        },  {
                           field: 'status',
                           title: '文件状态',
                           sortable: true,
                           editable: true,
                           footerFormatter: totalNameFormatter,
                           align: 'center'
                       }, {
                        field: 'sort',
                        title: '排序',
                        sortable: true,
                        editable: true,
                        footerFormatter: totalNameFormatter,
                        align: 'center'
                    },{
                              field: 'created_at',
                              title: '创建时间',
                              sortable: true,
                              editable: true,
                              footerFormatter: totalNameFormatter,
                              align: 'center'
                          },{
                            field: '操作',
                            title: '操作',
                            align: 'center',
                            events: operateEvents,
                            formatter: operateFormatter
                        }
                    ]
                ]
            });
            // sometimes footer render error.
            setTimeout(function () {
                $table.bootstrapTable('resetView');
            }, 200);
            $table.on('check.bs.table uncheck.bs.table ' +
                    'check-all.bs.table uncheck-all.bs.table', function () {
                $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

                // save your data, here just save the current page
                selections = getIdSelections();
                // push or splice the selections if you want to save all data selections
            });
            $table.on('expand-row.bs.table', function (e, index, row, $detail) {
                if (index % 2 == 1) {
                    $detail.html('Loading from ajax request...');
                    $.get('LICENSE', function (res) {
                        $detail.html(res.replace(/\n/g, '<br>'));
                    });
                }
            });
            $table.on('all.bs.table', function (e, name, args) {
                console.log(name, args);
            });
            $remove.click(function () {
                var ids = getIdSelections();
                $table.bootstrapTable('remove', {
                    field: 'id',
                    values: ids
                });
                $remove.prop('disabled', true);
            });
            $(window).resize(function () {
                $table.bootstrapTable('resetView', {
                    height: getHeight()
                });
            });
        });

        function getIdSelections() {
            return $.map($table.bootstrapTable('getSelections'), function (row) {
                return row.id
            });
        }

        function responseHandler(res) {
            $.each(res.rows, function (i, row) {
                row.state = $.inArray(row.id, selections) !== -1;
            });
            return res;
        }

        function detailFormatter(index, row) {
            var html = [];
            $.each(row, function (key, value) {
                html.push('<p><b>' + key + ':</b> ' + value + '</p>');
            });
            return html.join('');
        }

        function operateFormatter(value, row, index) {
            return [
                '<a class="like" href="javascript:void(0)" title="Like">',
                '<i class="glyphicon glyphicon-heart"></i>',
                '</a>  ',
                '<a class="remove" href="javascript:void(0)" title="Remove">',
                '<i class="glyphicon glyphicon-remove"></i>',
                '</a>'
            ].join('');
        }

        window.operateEvents = {
            'click .like': function (e, value, row, index) {
                alert('You click like action, row: ' + JSON.stringify(row));
            },
            'click .remove': function (e, value, row, index) {
                $table.bootstrapTable('remove', {
                    field: 'id',
                    values: [row.id]
                });
            }
        };

        function totalTextFormatter(data) {
            return 'Total';
        }

        function totalNameFormatter(data) {
            return data.length;
        }

        function totalPriceFormatter(data) {
            var total = 0;
            $.each(data, function (i, row) {
                //total += +(row.price.substring(1));
            });
            return '$' + total;
        }

        function getHeight() {
            return $(window).height() - $('h1').outerHeight(true);
        }
    </script>
</body>
</html>
