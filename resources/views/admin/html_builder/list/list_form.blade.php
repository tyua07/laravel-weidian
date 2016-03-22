<div class="content-wrap">
  <div class="row">
    <div class="col-sm-12">
      <div class="nest" id="FootableClose">
        <div class="title-alt">
          <h6> <?php echo $title; ?></h6>
        </div>
        <div class="body-nest" id="Footable">

            <!-- 按钮组 -->
            @include('admin.html_builder.layout.buttons')
            <!-- 按钮组 -->

          <div class="container-fluid">

                <!-- 工具栏 -->
                <div id="toolbar" class="form-inline">

                    <!-- 搜索表单 -->
                    @include('admin.html_builder.list.list_search_form')
                    <!-- 搜索表单 -->

                </div>
                <!-- 工具栏 -->

                <table id="<?php echo $table_name ;?>"
                         data-toolbar="#toolbar"
                         data-toolbar-align="left"
                         data-search="true"
                         data-pagination="true"
                         data-page-list="[<?php echo $limit_number;?>]"
                         data-show-footer="false"
                         data-side-pagination="server"
                         data-url="<?php echo $get_json_url ;?>"
                         data-query-params="queryParams">


                 <thead>
                      <tr>
                          <?php if(!empty($schemas) && is_array($schemas)):?>
                          <?php foreach($schemas as $k=>$schema):?>
                              <th
                                      data-field="<?php echo $k;?>"
                                      data-sortable=<?php echo $schema["is_sort"];?>
                                      data-class="<?php echo $schema['class'];?>"
                                      >
                                  <?php echo $schema['comment'];?>
                              </th>
                          <?php endforeach;?>
                          <?php endif;?>
                       </tr>
                  </thead>

            </table>
              </div>


        </div>
      </div>
    </div>
  </div>
</div>