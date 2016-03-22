<div class="content-wrap">
    <div class="row">
        <div class="col-sm-12">
            <div class="nest" id="elementClose">

                <div class="title-alt">
                    <h6><?php echo $title; ?></h6>

                    <div class="titleClose"><a class="gone" href="#elementClose"> <span class="entypo-cancel"></span>
                        </a></div>
                    <div class="titleToggle"><a class="nav-toggle-alt" href="#element"> <span
                                class="entypo-up-open"></span> </a></div>


                </div>

                @include('admin.html_builder.layout.buttons')


                <div class="body-nest" id="element">
                    <div class="panel-body">
                            <!-- 引入表单 -->
                            @include('admin.html_builder.edit.edit_form')

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>





