/**
 * Created by anywhere1000 on 15/6/7.
 */

//网络请求状态码
var HTTP_CODE = {
    'SUCCESS_CODE'  : 200,//请求成功
    'ERROR_CODE'    : 400, //请求失败
    'REDIRECT_CODE' : 302, //跳转
}

$(function(){

    $('.ajax-form').on('submit', function (e) {
        //取消默认动作，防止表单两次提交
        base.ajaxForm(this) == false && e.preventDefault();
    });

    //菜单折叠
    $(document).on('click','.tooltip-tip',function(){
        var css = $(this).next('ul').css('display');
        if(css == 'none'){
            //再展示点击的菜单
            $(this).next('ul').slideDown('normal');
            //给当前菜单添加选中状态
            $('.menu-div a').removeClass('topnav_hover');
        }else{
            $(this).next('ul').slideUp('normal');
        }
    });
    //菜单折叠

    //设置ajax csrf
    base.setAjaxCsrf();
    //设置 layer 配置信息
    base.setLayerConfig();
    //设置  toastr 提示框配置信息
    base.setToastrConfig();

})

/**
 * Base构造方法
 *
 * @constructor
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function Base()
{
    //初始化
    this._construct();
    this.tools = new Tools();

}


/**
 * 初始化
 *
 * @private
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype._construct = function ()
{
    //设置对象属性
    this.setAttribute()
}

/**
 * 设置对象属性
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.setAttribute = function ()
{

    this.attribute = {
        is_check_form : true,//设置当前表单为验证通过
    }
}

/**
 * 设置ajax csrf
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.setAjaxCsrf = function ()
{
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN'      : $('meta[name="csrf-token"]').attr('content'),
            'X-Requested-With'  : 'XMLHttpRequest'
        }
    });
}

/**
 * 设置 layer 配置信息
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.setLayerConfig = function ()
{
    layer.config({
        skin        : 'layer-ext-moon',
        extend      : './skin/mono/style.css',
        closeBtn    : 1,//关闭按钮
        shift       : 1,//动画
        shade       : [0.9, '#ccc'],//遮罩
        shadeClose  : true,//是否点击遮罩关闭
        maxmin      : true,//最大最小化。
        area        : ['1024px', '700px'],
        scrollbar   : true//是否禁用浏览器滚动条
    });
}

/**
 * 设置  toastr 提示框配置信息
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.setToastrConfig = function ()
{
    toastr.options = {
        "closeButton"       : true,
        "debug"             : false,
        "positionClass"     : "toast-top-right",
        "onclick"           : null,
        "showDuration"      : "300",
        "hideDuration"      : "1000",
        "timeOut"           : "1500",
        "extendedTimeOut"   : "1000",
        "showEasing"        : "swing",
        "hideEasing"        : "linear",
        "showMethod"        : "fadeIn",
        "hideMethod"        : "fadeOut"
    }
}

/**
 * ajax-form
 *
 * 示例：<form class="ajax-form" method="post" action="xxx">
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.ajaxForm = function (obj)
{
    var _this       = $(obj);//当前操作对象
    var form        = _this;//设置当前form对象
    var _tools      = this.tools;//工具对象
    var _instanceof = this;//当前对象实例
    var action      = _this.attr('action');//当前表单提交地址
    var method      = _this.attr('method');//当前表单提交方式

    //如果是get方式直接跳转
    if(method.toLocaleLowerCase() == 'get'){
        return true;
    }

    //如果表单验证不通过,则返回
    if (this.attribute.is_check_form == false) {
        return false;
    }

    //如果禁止base.js 解析 则跳过
    if(form.find('input[name=status]').val() == 'false'){
        return true;
    }

    //检测提交地址
    if (!action) {
        return false;
    }

    //前置操作
    this.ajaxFormBefore();

    //默认提交方式为get
    if (!method) {
        method = 'get';
    }

    //获取表单内容
    var formContent = this.tools.filterFormContents(_this.serialize());

    if ($(':file').size() > 0 ) {
        $.ajax(action, {
            type        : method,
            files       : $(":file", obj),
            data        : formContent,
            iframe      : true,
            dataType    : "json",
            processData : true
        }).success(function (data) {
            _tools.parseResponseJson(data, _instanceof.ajaxFormCallback);
            //关闭按钮事件
            _tools.stopButtonAnmate()
        });
    } else {
        $.ajax(action, {
            type        : method,
            files       : $(":file", obj),
            data        :formContent,
            dataType    : "json",
            processData : true
        }).success(function (data) {
            _tools.parseResponseJson(data, _instanceof.ajaxFormCallback);
            //关闭按钮事件
            _tools.stopButtonAnmate()
        });
    }
    //返回
    return false;
}

/**
 * ajax提交表单前置操作
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.ajaxFormBefore = function ()
{
    //更新 Ckeditor
    this.tools.updateCkeditroData();
    //开启按钮动画
    this.tools.startButtonAnmate();
}

/**
 * ajax form 回调方法
 *
 * @param data
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.ajaxFormCallback = function (data)
{

}

/**
 * 删除信息
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.del = function (obj, url)
{
    var _this       = $(obj);
    var _instanceof = this;

    if(url != ''){
        $.get(url, {}, function (data) {
            _instanceof.parseResponseJson(data, _instanceof.ajaxFormCallback);
            _this.parents('tr').slideUp();
        })
    }
}

/**
 * 验证表单
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Base.prototype.checkForm = function (obj)
{
    var _instanceof = this;

    obj.Validform({
        beforeCheck : function (curform) {
            return true;
        },
        tiptype:function(msg, o, cssctl){
            switch(o.type){
                case 3:
                    o.obj.parents('.form-group').find('.alert').removeClass('hide').find('.err_message').text(msg);
                    _instanceof.attribute.is_check_form = false;//设置表单为验证不通过
                    break;
                case 2:
                    o.obj.parents('.form-group').find('.alert').addClass('hide').find('.err_message').text('');
                    _instanceof.attribute.is_check_form = true;//设置表单为验证通过
                    break;
            }
        }

    });

}

//实例化 base 对象
var base = new Base();