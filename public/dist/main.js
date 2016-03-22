/*
 * Toastr
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
/* global define */
; (function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container;
            var listener;
            var toastId = 0;
            var toastType = {
                error: 'error',
                info: 'info',
                success: 'success',
                warning: 'warning'
            };

            var toastr = {
                clear: clear,
                remove: remove,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                subscribe: subscribe,
                success: success,
                version: '2.1.1',
                warning: warning
            };

            var previousToast;

            return toastr;

            ////////////////

            function error(message, title, optionsOverride) {
                return notify({
                    type: toastType.error,
                    iconClass: getOptions().iconClasses.error,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function getContainer(options, create) {
                if (!options) { options = getOptions(); }
                $container = $('#' + options.containerId);
                if ($container.length) {
                    return $container;
                }
                if (create) {
                    $container = createContainer(options);
                }
                return $container;
            }

            function info(message, title, optionsOverride) {
                return notify({
                    type: toastType.info,
                    iconClass: getOptions().iconClasses.info,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function subscribe(callback) {
                listener = callback;
            }

            function success(message, title, optionsOverride) {
                return notify({
                    type: toastType.success,
                    iconClass: getOptions().iconClasses.success,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function warning(message, title, optionsOverride) {
                return notify({
                    type: toastType.warning,
                    iconClass: getOptions().iconClasses.warning,
                    message: message,
                    optionsOverride: optionsOverride,
                    title: title
                });
            }

            function clear($toastElement, clearOptions) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if (!clearToast($toastElement, options, clearOptions)) {
                    clearContainer(options);
                }
            }

            function remove($toastElement) {
                var options = getOptions();
                if (!$container) { getContainer(options); }
                if ($toastElement && $(':focus', $toastElement).length === 0) {
                    removeToast($toastElement);
                    return;
                }
                if ($container.children().length) {
                    $container.remove();
                }
            }

            // internal functions

            function clearContainer (options) {
                var toastsToClear = $container.children();
                for (var i = toastsToClear.length - 1; i >= 0; i--) {
                    clearToast($(toastsToClear[i]), options);
                }
            }

            function clearToast ($toastElement, options, clearOptions) {
                var force = clearOptions && clearOptions.force ? clearOptions.force : false;
                if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
                    $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function () { removeToast($toastElement); }
                    });
                    return true;
                }
                return false;
            }

            function createContainer(options) {
                $container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass)
                    .attr('aria-live', 'polite')
                    .attr('role', 'alert');

                $container.appendTo($(options.target));
                return $container;
            }

            function getDefaults() {
                return {
                    tapToDismiss: true,
                    toastClass: 'toast',
                    containerId: 'toast-container',
                    debug: false,

                    showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
                    showDuration: 300,
                    showEasing: 'swing', //swing and linear are built into jQuery
                    onShown: undefined,
                    hideMethod: 'fadeOut',
                    hideDuration: 1000,
                    hideEasing: 'swing',
                    onHidden: undefined,

                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'toast-error',
                        info: 'toast-info',
                        success: 'toast-success',
                        warning: 'toast-warning'
                    },
                    iconClass: 'toast-info',
                    positionClass: 'toast-top-right',
                    timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
                    titleClass: 'toast-title',
                    messageClass: 'toast-message',
                    target: 'body',
                    closeHtml: '<button type="button">&times;</button>',
                    newestOnTop: true,
                    preventDuplicates: false,
                    progressBar: false
                };
            }

            function publish(args) {
                if (!listener) { return; }
                listener(args);
            }

            function notify(map) {
                var options = getOptions();
                var iconClass = map.iconClass || options.iconClass;

                if (typeof (map.optionsOverride) !== 'undefined') {
                    options = $.extend(options, map.optionsOverride);
                    iconClass = map.optionsOverride.iconClass || iconClass;
                }

                if (shouldExit(options, map)) { return; }

                toastId++;

                $container = getContainer(options, true);

                var intervalId = null;
                var $toastElement = $('<div/>');
                var $titleElement = $('<div/>');
                var $messageElement = $('<div/>');
                var $progressElement = $('<div/>');
                var $closeElement = $(options.closeHtml);
                var progressBar = {
                    intervalId: null,
                    hideEta: null,
                    maxHideTime: null
                };
                var response = {
                    toastId: toastId,
                    state: 'visible',
                    startTime: new Date(),
                    options: options,
                    map: map
                };

                personalizeToast();

                displayToast();

                handleEvents();

                publish(response);

                if (options.debug && console) {
                    console.log(response);
                }

                return $toastElement;

                function personalizeToast() {
                    setIcon();
                    setTitle();
                    setMessage();
                    setCloseButton();
                    setProgressBar();
                    setSequence();
                }

                function handleEvents() {
                    $toastElement.hover(stickAround, delayedHideToast);
                    if (!options.onclick && options.tapToDismiss) {
                        $toastElement.click(hideToast);
                    }

                    if (options.closeButton && $closeElement) {
                        $closeElement.click(function (event) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
                                event.cancelBubble = true;
                            }
                            hideToast(true);
                        });
                    }

                    if (options.onclick) {
                        $toastElement.click(function () {
                            options.onclick();
                            hideToast();
                        });
                    }
                }

                function displayToast() {
                    $toastElement.hide();

                    $toastElement[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing, complete: options.onShown}
                    );

                    if (options.timeOut > 0) {
                        intervalId = setTimeout(hideToast, options.timeOut);
                        progressBar.maxHideTime = parseFloat(options.timeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                        if (options.progressBar) {
                            progressBar.intervalId = setInterval(updateProgress, 10);
                        }
                    }
                }

                function setIcon() {
                    if (map.iconClass) {
                        $toastElement.addClass(options.toastClass).addClass(iconClass);
                    }
                }

                function setSequence() {
                    if (options.newestOnTop) {
                        $container.prepend($toastElement);
                    } else {
                        $container.append($toastElement);
                    }
                }

                function setTitle() {
                    if (map.title) {
                        $titleElement.append(map.title).addClass(options.titleClass);
                        $toastElement.append($titleElement);
                    }
                }

                function setMessage() {
                    if (map.message) {
                        $messageElement.append(map.message).addClass(options.messageClass);
                        $toastElement.append($messageElement);
                    }
                }

                function setCloseButton() {
                    if (options.closeButton) {
                        $closeElement.addClass('toast-close-button').attr('role', 'button');
                        $toastElement.prepend($closeElement);
                    }
                }

                function setProgressBar() {
                    if (options.progressBar) {
                        $progressElement.addClass('toast-progress');
                        $toastElement.prepend($progressElement);
                    }
                }

                function shouldExit(options, map) {
                    if (options.preventDuplicates) {
                        if (map.message === previousToast) {
                            return true;
                        } else {
                            previousToast = map.message;
                        }
                    }
                    return false;
                }

                function hideToast(override) {
                    if ($(':focus', $toastElement).length && !override) {
                        return;
                    }
                    clearTimeout(progressBar.intervalId);
                    return $toastElement[options.hideMethod]({
                        duration: options.hideDuration,
                        easing: options.hideEasing,
                        complete: function () {
                            removeToast($toastElement);
                            if (options.onHidden && response.state !== 'hidden') {
                                options.onHidden();
                            }
                            response.state = 'hidden';
                            response.endTime = new Date();
                            publish(response);
                        }
                    });
                }

                function delayedHideToast() {
                    if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                        intervalId = setTimeout(hideToast, options.extendedTimeOut);
                        progressBar.maxHideTime = parseFloat(options.extendedTimeOut);
                        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime;
                    }
                }

                function stickAround() {
                    clearTimeout(intervalId);
                    progressBar.hideEta = 0;
                    $toastElement.stop(true, true)[options.showMethod](
                        {duration: options.showDuration, easing: options.showEasing}
                    );
                }

                function updateProgress() {
                    var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100;
                    $progressElement.width(percentage + '%');
                }
            }

            function getOptions() {
                return $.extend({}, getDefaults(), toastr.options);
            }

            function removeToast($toastElement) {
                if (!$container) { $container = getContainer(); }
                if ($toastElement.is(':visible')) {
                    return;
                }
                $toastElement.remove();
                $toastElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                    previousToast = undefined;
                }
            }

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    } else {
        window['toastr'] = factory(window['jQuery']);
    }
}));

/**
 * Created by anywhere1000 on 15/6/7.
 */

/**
 * Tools 构造方法
 *
 * @constructor
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function Tools()
{
    //初始化
    this._construct()
}

/**
 * 初始化
 *
 * @private
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype._construct = function ()
{

}

/**
 * 更新 Ckeditor
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.updateCkeditroData = function ()
{
    try {
        for (instance  in CKEDITOR.instances ) {
            CKEDITOR.instances[instance].updateElement();
        }
    }catch(e){
    }
}

/**
 * 启用按钮动画
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.startButtonAnmate = function ()
{
    try {
        l = $('.ladda-button').ladda();
        //开启按钮动画
        l.ladda('start');
    } catch(e){
    }
}

/**
 * 关闭按钮动画
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.stopButtonAnmate = function ()
{
    try {
        l.ladda('stop');
    } catch(e){
    }
}

/**
 * 过滤 表单提交内容
 *
 * @param content
 * @returns {*}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.filterFormContents = function (content)
{
    if (!content) {
        return content;
    }

    //反序列化
    var params = content.split('&');
    for (var i=0; i < params.length; i++) {
        if ( params[i].indexOf('search_name_xxxxx') >= 0){
            params.splice(i, 1);
        }
    }

    return params.join('&');
}

/**
 * 反序列化
 *
 * @param content
 * @returns {*}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.unserialize = function (content)
{
    var data = content.split('&');
    var json = [];

    data.forEach(function(param){
        param       = param.split('=');
        var value   = "'"+param[0]+"' : " + "'"+(param[1])+"'";
        json.push(value);
    })
    return $.parseJSON("{" + json.join(',') + "}");
}

/**
 * 把url 参数字符串 解析成 json
 *
 * @param url
 * @returns {{}}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.parseQueryString = function (url)
{
    var obj         = {};
    var keyvalue    = [];
    var key         = "",value="";
    var paraString  = url.substring(0, url.length).split("&");

    for(var i in paraString)
    {
        keyvalue    = paraString[i].split("=");
        key         = keyvalue[0];
        value       = decodeURIComponent(keyvalue[1]);
        value       = value.replace(/\+/g, ' ');
        obj[key]    = value;
    }
    return obj;
}

/**
 * 解析 Response Json
 *
 * @param data
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Tools.prototype.parseResponseJson = function (data, callback)
{
    if(data.code == HTTP_CODE.SUCCESS_CODE){
        //弹出提示框
        if ( data.msg != '') toastr.success(data.msg);
        //如果为true表示跳转到新连接
        data.target == true && setTimeout(function(){
            location.href = data.href;
        },1000)

    } else if (data.code == HTTP_CODE.REDIRECT_CODE) {
        location.href = data.href;
    } else{
        if ( data.msg != '') toastr.warning(data.msg);
        //如果为true表示跳转到新连接
        data.target == true && setTimeout(function(){
            location.href = data.href;
        },1000)
    }

    //如果有回调方法，则执行回调方法
    $.isFunction(callback) && callback(data);
}



/**
 * Created by anywhere1000 on 15/6/7.
 */

/**
 * 弹出选择图片提示框
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function showChoseImageDialog(obj, source, image_type){
    var _this = $(obj);
    layer.open({
        title:'搜索图片',
        type: 2,
        content: [choseImageDialog+"?source="+source+"&image_type="+image_type, 'no'] ,//这里content是一个普通的String
        zIndex: layer.zIndex,
        btn: ['确认', '取消'],
        yes: function(layero, index){
            var body = layer.getChildFrame('body', 0);
            var size = body.find('.chose_icon').size();//选中数量
            if(size <= 0){
                alert('请选择图片');
                return;
            }

            //设置图片
            var imagePath       = body.find('.chose_icon').parents('.imagebox').find('img').attr('data-src');
            var imageRealPath   = body.find('.chose_icon').parents('.imagebox').find('img').attr('src');
            //设置input值
            _this.parents('.form-group').find('input[type=hidden]').val(imagePath);
            //修改图片src属性
            _this.parents('.form-group').find('img').attr('src', imageRealPath);
            layer.closeAll()

        },
        cancel: function(layero, index){
            layer.closeAll()
        }
    });
}


/**
 * 加载验证码
 *
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function loadCaptchaImg(obj){
    var _this = $(obj);
    var src = _this.find('img').attr('src');
    _this.find('img').attr('src', src+"?"+Math.round())
}

/**
 *
 * 退出登录
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function logout(){
    $.get(logout_url, {}, function(data){
        base.tools.parseResponseJson($.parseJSON(data));
    })
}

/**
 * 设置语言
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function settingLocale(locale){
    $.get(setting_locale_url, {'locale' : locale}, function(data){
        base.tools.parseResponseJson($.parseJSON(data));
    })
}

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
/*! layer-v1.9.3 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */
;!function(a,b){"use strict";var c,d,e={getPath:function(){var a=document.scripts,b=a[a.length-1],c=b.src;if(!b.getAttribute("merge"))return c.substring(0,c.lastIndexOf("/")+1)}(),config:{},end:{},btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],type:["dialog","page","iframe","loading","tips"]};a.layer={v:"1.9.3",ie6:!!a.ActiveXObject&&!a.XMLHttpRequest,index:0,path:e.getPath,config:function(a,b){var d=0;return a=a||{},layer.cache=e.config=c.extend(e.config,a),layer.path=e.config.path||layer.path,"string"==typeof a.extend&&(a.extend=[a.extend]),layer.use("skin/layer.css",a.extend&&a.extend.length>0?function f(){var c=a.extend;layer.use(c[c[d]?d:d-1],d<c.length?function(){return++d,f}():b)}():b),this},use:function(a,b,d){var e=c("head")[0],a=a.replace(/\s/g,""),f=/\.css$/.test(a),g=document.createElement(f?"link":"script"),h="layui_layer_"+a.replace(/\.|\//g,"");return layer.path?(f&&(g.rel="stylesheet"),g[f?"href":"src"]=/^http:\/\//.test(a)?a:layer.path+a,g.id=h,c("#"+h)[0]||e.appendChild(g),function i(){(f?1989===parseInt(c("#"+h).css("width")):layer[d||h])?function(){b&&b();try{f||e.removeChild(g)}catch(a){}}():setTimeout(i,100)}(),this):void 0},ready:function(a,b){var d="function"==typeof a;return d&&(b=a),layer.config(c.extend(e.config,function(){return d?{}:{path:a}}()),b),this},alert:function(a,b,d){var e="function"==typeof b;return e&&(d=b),layer.open(c.extend({content:a,yes:d},e?{}:b))},confirm:function(a,b,d,f){var g="function"==typeof b;return g&&(f=d,d=b),layer.open(c.extend({content:a,btn:e.btn,yes:d,cancel:f},g?{}:b))},msg:function(a,d,f){var h="function"==typeof d,i=e.config.skin,j=(i?i+" "+i+"-msg":"")||"layui-layer-msg",k=g.anim.length-1;return h&&(f=d),layer.open(c.extend({content:a,time:3e3,shade:!1,skin:j,title:!1,closeBtn:!1,btn:!1,end:f},h&&!e.config.skin?{skin:j+" layui-layer-hui",shift:k}:function(){return d=d||{},(-1===d.icon||d.icon===b&&!e.config.skin)&&(d.skin=j+" "+(d.skin||"layui-layer-hui")),d}()))},load:function(a,b){return layer.open(c.extend({type:3,icon:a||0,shade:.01},b))},tips:function(a,b,d){return layer.open(c.extend({type:4,content:[a,b],closeBtn:!1,time:3e3,maxWidth:210},d))}};var f=function(a){var b=this;b.index=++layer.index,b.config=c.extend({},b.config,e.config,a),b.creat()};f.pt=f.prototype;var g=["layui-layer",".layui-layer-title",".layui-layer-main",".layui-layer-dialog","layui-layer-iframe","layui-layer-content","layui-layer-btn","layui-layer-close"];g.anim=["layui-anim","layui-anim-01","layui-anim-02","layui-anim-03","layui-anim-04","layui-anim-05","layui-anim-06"],f.pt.config={type:0,shade:.3,fix:!0,move:g[1],title:"&#x4FE1;&#x606F;",offset:"auto",area:"auto",closeBtn:1,time:0,zIndex:19891014,maxWidth:360,shift:0,icon:-1,scrollbar:!0,tips:2},f.pt.vessel=function(a,b){var c=this,d=c.index,f=c.config,h=f.zIndex+d,i="object"==typeof f.title,j=f.maxmin&&(1===f.type||2===f.type),k=f.title?'<div class="layui-layer-title" style="'+(i?f.title[1]:"")+'">'+(i?f.title[0]:f.title)+"</div>":"";return f.zIndex=h,b([f.shade?'<div class="layui-layer-shade" id="layui-layer-shade'+d+'" times="'+d+'" style="'+("z-index:"+(h-1)+"; background-color:"+(f.shade[1]||"#000")+"; opacity:"+(f.shade[0]||f.shade)+"; filter:alpha(opacity="+(100*f.shade[0]||100*f.shade)+");")+'"></div>':"",'<div class="'+g[0]+" "+(g.anim[f.shift]||"")+(" layui-layer-"+e.type[f.type])+(0!=f.type&&2!=f.type||f.shade?"":" layui-layer-border")+" "+(f.skin||"")+'" id="'+g[0]+d+'" type="'+e.type[f.type]+'" times="'+d+'" showtime="'+f.time+'" conType="'+(a?"object":"string")+'" style="z-index: '+h+"; width:"+f.area[0]+";height:"+f.area[1]+(f.fix?"":";position:absolute;")+'">'+(a&&2!=f.type?"":k)+'<div class="layui-layer-content'+(0==f.type&&-1!==f.icon?" layui-layer-padding":"")+(3==f.type?" layui-layer-loading"+f.icon:"")+'">'+(0==f.type&&-1!==f.icon?'<i class="layui-layer-ico layui-layer-ico'+f.icon+'"></i>':"")+(1==f.type&&a?"":f.content||"")+'</div><span class="layui-layer-setwin">'+function(){var a=j?'<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>':"";return f.closeBtn&&(a+='<a class="layui-layer-ico '+g[7]+" "+g[7]+(f.title?f.closeBtn:4==f.type?"1":"2")+'" href="javascript:;"></a>'),a}()+"</span>"+(f.btn?function(){var a="";"string"==typeof f.btn&&(f.btn=[f.btn]);for(var b=0,c=f.btn.length;c>b;b++)a+='<a class="'+g[6]+b+'">'+f.btn[b]+"</a>";return'<div class="'+g[6]+'">'+a+"</div>"}():"")+"</div>"],k),c},f.pt.creat=function(){var a=this,b=a.config,f=a.index,h=b.content,i="object"==typeof h;switch("string"==typeof b.area&&(b.area="auto"===b.area?["",""]:[b.area,""]),b.type){case 0:b.btn="btn"in b?b.btn:e.btn[0],layer.closeAll("dialog");break;case 2:var h=b.content=i?b.content:[b.content||"http://sentsin.com?from=layer","auto"];b.content='<iframe scrolling="'+(b.content[1]||"auto")+'" allowtransparency="true" id="'+g[4]+f+'" name="'+g[4]+f+'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="'+b.content[0]+'"></iframe>';break;case 3:b.title=!1,b.closeBtn=!1,-1===b.icon&&0===b.icon,layer.closeAll("loading");break;case 4:i||(b.content=[b.content,"body"]),b.follow=b.content[1],b.content=b.content[0]+'<i class="layui-layer-TipsG"></i>',b.title=!1,b.shade=!1,b.fix=!1,b.tips="object"==typeof b.tips?b.tips:[b.tips,!0],b.tipsMore||layer.closeAll("tips")}a.vessel(i,function(d,e){c("body").append(d[0]),i?function(){2==b.type||4==b.type?function(){c("body").append(d[1])}():function(){h.parents("."+g[0])[0]||(h.show().addClass("layui-layer-wrap").wrap(d[1]),c("#"+g[0]+f).find("."+g[5]).before(e))}()}():c("body").append(d[1]),a.layero=c("#"+g[0]+f),b.scrollbar||g.html.css("overflow","hidden").attr("layer-full",f)}).auto(f),2==b.type&&layer.ie6&&a.layero.find("iframe").attr("src",h[0]),4==b.type?a.tips():a.offset(),b.fix&&d.on("resize",function(){a.offset(),(/^\d+%$/.test(b.area[0])||/^\d+%$/.test(b.area[1]))&&a.auto(f),4==b.type&&a.tips()}),b.time<=0||setTimeout(function(){layer.close(a.index)},b.time),a.move().callback()},f.pt.auto=function(a){function b(a){a=h.find(a),a.height(i[1]-j-k-2*(0|parseFloat(a.css("padding"))))}var e=this,f=e.config,h=c("#"+g[0]+a);""===f.area[0]&&f.maxWidth>0&&(/MSIE 7/.test(navigator.userAgent)&&f.btn&&h.width(h.innerWidth()),h.outerWidth()>f.maxWidth&&h.width(f.maxWidth));var i=[h.innerWidth(),h.innerHeight()],j=h.find(g[1]).outerHeight()||0,k=h.find("."+g[6]).outerHeight()||0;switch(f.type){case 2:b("iframe");break;default:""===f.area[1]?f.fix&&i[1]>d.height()&&(i[1]=d.height(),b("."+g[5])):b("."+g[5])}return e},f.pt.offset=function(){var a=this,b=a.config,c=a.layero,e=[c.outerWidth(),c.outerHeight()],f="object"==typeof b.offset;a.offsetTop=(d.height()-e[1])/2,a.offsetLeft=(d.width()-e[0])/2,f?(a.offsetTop=b.offset[0],a.offsetLeft=b.offset[1]||a.offsetLeft):"auto"!==b.offset&&(a.offsetTop=b.offset,"rb"===b.offset&&(a.offsetTop=d.height()-e[1],a.offsetLeft=d.width()-e[0])),b.fix||(a.offsetTop=/%$/.test(a.offsetTop)?d.height()*parseFloat(a.offsetTop)/100:parseFloat(a.offsetTop),a.offsetLeft=/%$/.test(a.offsetLeft)?d.width()*parseFloat(a.offsetLeft)/100:parseFloat(a.offsetLeft),a.offsetTop+=d.scrollTop(),a.offsetLeft+=d.scrollLeft()),c.css({top:a.offsetTop,left:a.offsetLeft})},f.pt.tips=function(){var a=this,b=a.config,e=a.layero,f=[e.outerWidth(),e.outerHeight()],h=c(b.follow);h[0]||(h=c("body"));var i={width:h.outerWidth(),height:h.outerHeight(),top:h.offset().top,left:h.offset().left},j=e.find(".layui-layer-TipsG"),k=b.tips[0];b.tips[1]||j.remove(),i.autoLeft=function(){i.left+f[0]-d.width()>0?(i.tipLeft=i.left+i.width-f[0],j.css({right:12,left:"auto"})):i.tipLeft=i.left},i.where=[function(){i.autoLeft(),i.tipTop=i.top-f[1]-10,j.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left+i.width+10,i.tipTop=i.top,j.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color",b.tips[1])},function(){i.autoLeft(),i.tipTop=i.top+i.height+10,j.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color",b.tips[1])},function(){i.tipLeft=i.left-f[0]-10,i.tipTop=i.top,j.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color",b.tips[1])}],i.where[k-1](),1===k?i.top-(d.scrollTop()+f[1]+16)<0&&i.where[2]():2===k?d.width()-(i.left+i.width+f[0]+16)>0||i.where[3]():3===k?i.top-d.scrollTop()+i.height+f[1]+16-d.height()>0&&i.where[0]():4===k&&f[0]+16-i.left>0&&i.where[1](),e.find("."+g[5]).css({"background-color":b.tips[1],"padding-right":b.closeBtn?"30px":""}),e.css({left:i.tipLeft,top:i.tipTop})},f.pt.move=function(){var a=this,b=a.config,e={setY:0,moveLayer:function(){var a=e.layero,b=parseInt(a.css("margin-left")),c=parseInt(e.move.css("left"));0===b||(c-=b),"fixed"!==a.css("position")&&(c-=a.parent().offset().left,e.setY=0),a.css({left:c,top:parseInt(e.move.css("top"))-e.setY})}},f=a.layero.find(b.move);return b.move&&f.attr("move","ok"),f.css({cursor:b.move?"move":"auto"}),c(b.move).on("mousedown",function(a){if(a.preventDefault(),"ok"===c(this).attr("move")){e.ismove=!0,e.layero=c(this).parents("."+g[0]);var f=e.layero.offset().left,h=e.layero.offset().top,i=e.layero.outerWidth()-6,j=e.layero.outerHeight()-6;c("#layui-layer-moves")[0]||c("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+f+"px; top:"+h+"px; width:"+i+"px; height:"+j+'px; z-index:2147483584"></div>'),e.move=c("#layui-layer-moves"),b.moveType&&e.move.css({visibility:"hidden"}),e.moveX=a.pageX-e.move.position().left,e.moveY=a.pageY-e.move.position().top,"fixed"!==e.layero.css("position")||(e.setY=d.scrollTop())}}),c(document).mousemove(function(a){if(e.ismove){var c=a.pageX-e.moveX,f=a.pageY-e.moveY;if(a.preventDefault(),!b.moveOut){e.setY=d.scrollTop();var g=d.width()-e.move.outerWidth(),h=e.setY;0>c&&(c=0),c>g&&(c=g),h>f&&(f=h),f>d.height()-e.move.outerHeight()+e.setY&&(f=d.height()-e.move.outerHeight()+e.setY)}e.move.css({left:c,top:f}),b.moveType&&e.moveLayer(),c=f=g=h=null}}).mouseup(function(){try{e.ismove&&(e.moveLayer(),e.move.remove()),e.ismove=!1}catch(a){e.ismove=!1}b.moveEnd&&b.moveEnd()}),a},f.pt.callback=function(){function a(){var a=f.cancel&&f.cancel(b.index);a===!1||layer.close(b.index)}var b=this,d=b.layero,f=b.config;b.openLayer(),f.success&&(2==f.type?d.find("iframe")[0].onload=function(){this.className="",f.success(d,b.index)}:f.success(d,b.index)),layer.ie6&&b.IE6(d),d.find("."+g[6]).children("a").on("click",function(){var e=c(this).index();0===e?f.yes?f.yes(b.index,d):layer.close(b.index):1===e?a():f["btn"+(e+1)]?f["btn"+(e+1)](b.index,d):layer.close(b.index)}),d.find("."+g[7]).on("click",a),f.shadeClose&&c("#layui-layer-shade"+b.index).on("click",function(){layer.close(b.index)}),d.find(".layui-layer-min").on("click",function(){layer.min(b.index,f),f.min&&f.min(d)}),d.find(".layui-layer-max").on("click",function(){c(this).hasClass("layui-layer-maxmin")?(layer.restore(b.index),f.restore&&f.restore(d)):(layer.full(b.index,f),f.full&&f.full(d))}),f.end&&(e.end[b.index]=f.end)},e.reselect=function(){c.each(c("select"),function(a,b){var d=c(this);d.parents("."+g[0])[0]||1==d.attr("layer")&&c("."+g[0]).length<1&&d.removeAttr("layer").show(),d=null})},f.pt.IE6=function(a){function b(){a.css({top:f+(e.config.fix?d.scrollTop():0)})}var e=this,f=a.offset().top;b(),d.scroll(b),c("select").each(function(a,b){var d=c(this);d.parents("."+g[0])[0]||"none"===d.css("display")||d.attr({layer:"1"}).hide(),d=null})},f.pt.openLayer=function(){var a=this;layer.zIndex=a.config.zIndex,layer.setTop=function(a){var b=function(){layer.zIndex++,a.css("z-index",layer.zIndex+1)};return layer.zIndex=parseInt(a[0].style.zIndex),a.on("mousedown",b),layer.zIndex}},e.record=function(a){var b=[a.outerWidth(),a.outerHeight(),a.position().top,a.position().left+parseFloat(a.css("margin-left"))];a.find(".layui-layer-max").addClass("layui-layer-maxmin"),a.attr({area:b})},e.rescollbar=function(a){g.html.attr("layer-full")==a&&(g.html[0].style.removeProperty?g.html[0].style.removeProperty("overflow"):g.html[0].style.removeAttribute("overflow"),g.html.removeAttr("layer-full"))},layer.getChildFrame=function(a,b){return b=b||c("."+g[4]).attr("times"),c("#"+g[0]+b).find("iframe").contents().find(a)},layer.getFrameIndex=function(a){return c("#"+a).parents("."+g[4]).attr("times")},layer.iframeAuto=function(a){if(a){var b=layer.getChildFrame("body",a).outerHeight(),d=c("#"+g[0]+a),e=d.find(g[1]).outerHeight()||0,f=d.find("."+g[6]).outerHeight()||0;d.css({height:b+e+f}),d.find("iframe").css({height:b})}},layer.iframeSrc=function(a,b){c("#"+g[0]+a).find("iframe").attr("src",b)},layer.style=function(a,b){var d=c("#"+g[0]+a),f=d.attr("type"),h=d.find(g[1]).outerHeight()||0,i=d.find("."+g[6]).outerHeight()||0;(f===e.type[1]||f===e.type[2])&&(d.css(b),f===e.type[2]&&d.find("iframe").css({height:parseFloat(b.height)-h-i}))},layer.min=function(a,b){var d=c("#"+g[0]+a),f=d.find(g[1]).outerHeight()||0;e.record(d),layer.style(a,{width:180,height:f,overflow:"hidden"}),d.find(".layui-layer-min").hide(),"page"===d.attr("type")&&d.find(g[4]).hide(),e.rescollbar(a)},layer.restore=function(a){var b=c("#"+g[0]+a),d=b.attr("area").split(",");b.attr("type");layer.style(a,{width:parseFloat(d[0]),height:parseFloat(d[1]),top:parseFloat(d[2]),left:parseFloat(d[3]),overflow:"visible"}),b.find(".layui-layer-max").removeClass("layui-layer-maxmin"),b.find(".layui-layer-min").show(),"page"===b.attr("type")&&b.find(g[4]).show(),e.rescollbar(a)},layer.full=function(a){var b,f=c("#"+g[0]+a);e.record(f),g.html.attr("layer-full")||g.html.css("overflow","hidden").attr("layer-full",a),clearTimeout(b),b=setTimeout(function(){var b="fixed"===f.css("position");layer.style(a,{top:b?0:d.scrollTop(),left:b?0:d.scrollLeft(),width:d.width(),height:d.height()}),f.find(".layui-layer-min").hide()},100)},layer.title=function(a,b){var d=c("#"+g[0]+(b||layer.index)).find(g[1]);d.html(a)},layer.close=function(a){var b=c("#"+g[0]+a),d=b.attr("type");if(b[0]){if(d===e.type[1]&&"object"===b.attr("conType")){b.children(":not(."+g[5]+")").remove();for(var f=0;2>f;f++)b.find(".layui-layer-wrap").unwrap().hide()}else{if(d===e.type[2])try{var h=c("#"+g[4]+a)[0];h.contentWindow.document.write(""),h.contentWindow.close(),b.find("."+g[5])[0].removeChild(h)}catch(i){}b[0].innerHTML="",b.remove()}c("#layui-layer-moves, #layui-layer-shade"+a).remove(),layer.ie6&&e.reselect(),e.rescollbar(a),"function"==typeof e.end[a]&&e.end[a](),delete e.end[a]}},layer.closeAll=function(a){c.each(c("."+g[0]),function(){var b=c(this),d=a?b.attr("type")===a:1;d&&layer.close(b.attr("times")),d=null})},e.run=function(){c=jQuery,d=c(a),g.html=c("html"),layer.open=function(a){var b=new f(a);return b.index}},"function"==typeof define?define(function(){return e.run(),layer}):function(){e.run(),layer.use("skin/layer.css")}()}(window);
/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.5",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.5",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.5",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.5",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.5",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.5",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),
d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.5",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
 
//BACKGROUND CHANGER

  $(function() {
      $("#button-bg").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg5.jpg')no-repeat center center fixed"
          });
      });
      $("#button-bg2").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg2.jpg')no-repeat center center fixed"
          });
      });


      $("#button-bg3").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg.jpg')no-repeat center center fixed"
          });


      });

      $("#button-bg5").click(function() {
          $("body").css({
              "background": "url('/assets/img/giftly.png')repeat"
          });

      });

      $("#button-bg6").click(function() {
          $("body").css({
              "background": "#2c3e50"
          });

      });

      $("#button-bg7").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg3.png')repeat"
          });

      });
      $("#button-bg8").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg8.jpg')no-repeat center center fixed"
          });
      });
      $("#button-bg9").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg9.jpg')no-repeat center center fixed"
          });
      });

      $("#button-bg10").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg10.jpg')no-repeat center center fixed"
          });
      });
      $("#button-bg11").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg11.jpg')no-repeat center center fixed"
          });
      });
      $("#button-bg12").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg12.jpg')no-repeat center center fixed"
          });
      });

      $("#button-bg13").click(function() {
          $("body").css({
              "background": "url('/assets/img/bg13.jpg')repeat"
          });

      });
      /**
       * Background Changer end
       */
  });

//TOGGLE CLOSE
    $('.nav-toggle').click(function() {
        //get collapse content selector
        var collapse_content_selector = $(this).attr('href');

        //make the collapse content to be shown or hide
        var toggle_switch = $(this);
        $(collapse_content_selector).slideToggle(function() {
            if ($(this).css('display') == 'block') {
                //change the button label to be 'Show'
                toggle_switch.html('<span class="entypo-minus-squared"></span>');
            } else {
                //change the button label to be 'Hide'
                toggle_switch.html('<span class="entypo-plus-squared"></span>');
            }
        });
    });


    $('.nav-toggle-alt').click(function() {
        //get collapse content selector
        var collapse_content_selector = $(this).attr('href');

        //make the collapse content to be shown or hide
        var toggle_switch = $(this);
        $(collapse_content_selector).slideToggle(function() {
            if ($(this).css('display') == 'block') {
                //change the button label to be 'Show'
                toggle_switch.html('<span class="entypo-up-open"></span>');
            } else {
                //change the button label to be 'Hide'
                toggle_switch.html('<span class="entypo-down-open"></span>');
            }
        });
        return false;
    });
    //CLOSE ELEMENT
    $(".gone").click(function() {
        var collapse_content_close = $(this).attr('href');
        $(collapse_content_close).hide();



    });

//tooltip
    $('.tooltitle').tooltip();
 
(function(e,t){"use strict";function m(){}function g(e,t){if(!e){return}if(typeof e==="object"){e=[].slice.call(e)}for(var n=0,r=e.length;n<r;n++){t.call(e,e[n],n)}}function y(e,n){var r=Object.prototype.toString.call(n).slice(8,-1);return n!==t&&n!==null&&r===e}function b(e){return y("Function",e)}function w(e){return y("Array",e)}function E(e){var t=e.split("/"),n=t[t.length-1],r=n.indexOf("?");return r!==-1?n.substring(0,r):n}function S(e){e=e||m;if(e._done){return}e();e._done=1}function x(e,t,n,r){var i=typeof e==="object"?e:{test:e,success:!!t?w(t)?t:[t]:false,failure:!!n?w(n)?n:[n]:false,callback:r||m};var s=!!i.test;if(s&&!!i.success){i.success.push(i.callback);c.load.apply(null,i.success)}else if(!s&&!!i.failure){i.failure.push(i.callback);c.load.apply(null,i.failure)}else{r()}return c}function T(e){var t={};if(typeof e==="object"){for(var n in e){if(!!e[n]){t={name:n,url:e[n]}}}}else{t={name:E(e),url:e}}var r=o[t.name];if(r&&r.url===t.url){return r}o[t.name]=t;return t}function N(e){e=e||o;for(var t in e){if(e.hasOwnProperty(t)&&e[t].state!==v){return false}}return true}function C(e){e.state=p;g(e.onpreload,function(e){e.call()})}function k(e,n){if(e.state===t){e.state=h;e.onpreload=[];M({url:e.url,type:"cache"},function(){C(e)})}}function L(){var e=arguments,t=[].slice.call(e,1),n=t[0];if(!a){i.push(function(){c.load.apply(null,e)});return c}if(!!n){g(t,function(e){if(!b(e)&&!!e){k(T(e))}});O(T(e[0]),b(n)?n:function(){c.load.apply(null,t)})}else{O(T(e[0]))}return c}function A(){var e=arguments,t=e[e.length-1],n={};if(!b(t)){t=null}g(e,function(r,i){if(r!==t){r=T(r);n[r.name]=r;O(r,t&&i===e.length-2?function(){if(N(n)){S(t)}}:null)}});return c}function O(e,t){t=t||m;if(e.state===v){t();return}if(e.state===d){c.ready(e.name,t);return}if(e.state===h){e.onpreload.push(function(){O(e,t)});return}e.state=d;M(e,function(){e.state=v;t();g(s[e.name],function(e){S(e)});if(f&&N()){g(s.ALL,function(e){S(e)})}})}function M(t,r){function i(t){t=t||e.event;o.onload=o.onreadystatechange=o.onerror=null;r()}function s(t){t=t||e.event;if(t.type==="load"||/loaded|complete/.test(o.readyState)&&(!n.documentMode||n.documentMode<9)){o.onload=o.onreadystatechange=o.onerror=null;r()}}r=r||m;var o;if(/\.css[^\.]*$/.test(t.url)){o=n.createElement("link");o.type="text/"+(t.type||"css");o.rel="stylesheet";o.href=t.url}else{o=n.createElement("script");o.type="text/"+(t.type||"javascript");o.src=t.url}o.onload=o.onreadystatechange=s;o.onerror=i;o.async=false;o.defer=false;var u=n.head||n.getElementsByTagName("head")[0];u.insertBefore(o,u.lastChild)}function _(){var e=n.getElementsByTagName("script");for(var t=0,r=e.length;t<r;t++){var i=e[t].getAttribute("data-headjs-load");if(!!i){c.load(i);return}}}function D(e,t){if(e===n){if(f){S(t)}else{r.push(t)}return c}if(b(e)){t=e;e="ALL"}if(typeof e!=="string"||!b(t)){return c}var i=o[e];if(i&&i.state===v||e==="ALL"&&N()&&f){S(t);return c}var u=s[e];if(!u){u=s[e]=[t]}else{u.push(t)}return c}function P(){if(!n.body){e.clearTimeout(c.readyTimeout);c.readyTimeout=e.setTimeout(P,50);return}if(!f){f=true;_();g(r,function(e){S(e)})}}function H(){if(n.addEventListener){n.removeEventListener("DOMContentLoaded",H,false);P()}else if(n.readyState==="complete"){n.detachEvent("onreadystatechange",H);P()}}var n=e.document,r=[],i=[],s={},o={},u="async"in n.createElement("script")||"MozAppearance"in n.documentElement.style||e.opera,a,f,l=e.head_conf&&e.head_conf.head||"head",c=e[l]=e[l]||function(){c.ready.apply(null,arguments)},h=1,p=2,d=3,v=4;if(n.readyState==="complete"){P()}else if(n.addEventListener){n.addEventListener("DOMContentLoaded",H,false);e.addEventListener("load",P,false)}else{n.attachEvent("onreadystatechange",H);e.attachEvent("onload",P);var B=false;try{B=!e.frameElement&&n.documentElement}catch(j){}if(B&&B.doScroll){(function F(){if(!f){try{B.doScroll("left")}catch(t){e.clearTimeout(c.readyTimeout);c.readyTimeout=e.setTimeout(F,50);return}P()}})()}}c.load=c.js=u?A:L;c.test=x;c.ready=D;c.ready(n,function(){if(N()){g(s.ALL,function(e){S(e)})}if(c.feature){c.feature("domloaded",true)}});setTimeout(function(){a=true;g(i,function(e){e()})},300)})(window)
//Sliding Effect Control
//head.js("/assets/js/skin-select/jquery.cookie.js");
head.js("/assets/js/skin-select/skin-select.js");

//Showing Date
//head.js("/assets/js/clock/date.js");

//Bootstrap
//head.js("/assets/js/bootstrap.js");

//NEWS STICKER
head.js("/assets/js/newsticker/jquery.newsTicker.js", function() {

    var nt_title = $('#nt-title').newsTicker({
        row_height: 18,
        max_rows: 1,
        duration: 5000,
        pauseOnHover: 0
    });


});

//------------------------------------------------------------- 


////Acordion and Sliding menu

head.js("/assets/js/custom/scriptbreaker-multiple-accordion-1.js", function() {

    //$(".topnav").accordionze({
    //    accordionze: true,
    //    speed: 500,
    //    closedSign: '<img src="/assets/img/plus.png">',
    //    openedSign: '<img src="/assets/img/minus.png">'
    //});

});

////Right Sliding menu

head.js("/assets/js/slidebars/slidebars.min.js", function() {

    $(document).ready(function() {
        var mySlidebars = new $.slidebars();

        $('.toggle-left').on('click', function() {
            mySlidebars.toggle('right');
        });
    });
});

//-------------------------------------------------------------

//SEARCH MENU
head.js("/assets/js/search/jquery.quicksearch.js", function() {

    $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');



});
//-------------------------------------------------------------



//EASY PIE CHART
//head.js("/assets/js/gage/jquery.easypiechart.min.js", function() {
//
//    $(function() {
//
//
//        $('.chart').easyPieChart({
//            easing: 'easeOutBounce',
//            trackColor: '#ffffff',
//            scaleColor: '#ffffff',
//            barColor: '#FF0064',
//            onStep: function(from, to, percent) {
//                $(this.el).find('.percent').text(Math.round(percent));
//            }
//        });
//        var chart = window.chart = $('.chart').data('easyPieChart');
//        $('.js_update').on('click', function() {
//            chart.update(Math.random() * 100);
//        });
//
//        $('.speed-car').easyPieChart({
//            easing: 'easeOutBounce',
//            trackColor: 'rgba(0,0,0,0.3)',
//            scaleColor: 'transparent',
//            barColor: '#0085DF',
//
//            lineWidth: 8,
//            onStep: function(from, to, percent) {
//                $(this.el).find('.percent2').text(Math.round(percent));
//            }
//        });
//        var chart = window.chart = $('.chart2').data('easyPieChart');
//        $('.js_update').on('click', function() {
//            chart.update(Math.random() * 100);
//        });
//        $('.overall').easyPieChart({
//            easing: 'easeOutBounce',
//            trackColor: 'rgba(0,0,0,0.3)',
//            scaleColor: '#323A45',
//            lineWidth: 35,
//            lineCap: 'butt',
//            barColor: '#FFB900',
//            onStep: function(from, to, percent) {
//                $(this.el).find('.percent3').text(Math.round(percent));
//            }
//        });
//    });
//
//});
//-------------------------------------------------------------

//TOOL TIP

head.js("/assets/js/tip/jquery.tooltipster.js", function() {

    $('.tooltip-tip-x').tooltipster({
        position: 'right'

    });

    $('.tooltip-tip').tooltipster({
        position: 'right',
        animation: 'slide',
        theme: '.tooltipster-shadow',
        delay: 1,
        offsetX: '-12px',
        onlyOne: true

    });
    $('.tooltip-tip2').tooltipster({
        position: 'right',
        animation: 'slide',
        offsetX: '-12px',
        theme: '.tooltipster-shadow',
        onlyOne: true

    });
    $('.tooltip-top').tooltipster({
        position: 'top'
    });
    $('.tooltip-right').tooltipster({
        position: 'right'
    });
    $('.tooltip-left').tooltipster({
        position: 'left'
    });
    $('.tooltip-bottom').tooltipster({
        position: 'bottom'
    });
    $('.tooltip-reload').tooltipster({
        position: 'right',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    $('.tooltip-fullscreen').tooltipster({
        position: 'left',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    //For icon tooltip



});
//------------------------------------------------------------- 

//NICE SCROLL

head.js("/assets/js/nano/jquery.nanoscroller.js", function() {

    $(".nano").nanoScroller({
        //stop: true
        scroll: 'top',
        scrollTop: 0,
        sliderMinHeight: 40,
        preventPageScrolling: true
        //alwaysVisible: false

    });

});
//------------------------------------------------------------- 






//------------------------------------------------------------- 
//PAGE LOADER
//head.js("/assets/js/pace/pace.js", function() {
//
//    paceOptions = {
//        ajax: false, // disabled
//        document: false, // disabled
//        eventLag: false, // disabled
//        elements: {
//            selectors: ['.my-page']
//        }
//    };
//
//});

//------------------------------------------------------------- 

//SPARKLINE CHART
head.js("/assets/js/chart/jquery.sparkline.js", function() {

    $(function() {
        $('.inlinebar').sparkline('html', {
            type: 'bar',
            barWidth: '8px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#A8BDCF'
        });
        $('.linebar').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#44BBC1'
        });
        $('.linebar2').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#AB6DB0'
        });
        $('.linebar3').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#19A1F9'
        });
    });

    $(function() {
        var sparklineLogin = function() {
            $('#sparkline').sparkline(
                [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
                    type: 'line',
                    width: '100%',
                    height: '25',
                    lineColor: '#ffffff',
                    fillColor: '#0DB8DF',
                    lineWidth: 1,
                    spotColor: '#ffffff',
                    minSpotColor: '#ffffff',
                    maxSpotColor: '#ffffff',
                    highlightSpotColor: '#ffffff',
                    highlightLineColor: '#ffffff'
                }
            );
        }
        var sparkResize;
        $(window).resize(function(e) {
            clearTimeout(sparkResize);
            sparkResize = setTimeout(sparklineLogin, 500);
        });
        sparklineLogin();
    });


});

//------------------------------------------------------------- 

//DIGITAL CLOCK
//head.js("/assets/js/clock/jquery.clock.js", function() {
//
//    //clock
//    $('#digital-clock').clock({
//        offset: '+5',
//        type: 'digital'
//    });
//
//
//});


//------------------------------------------------------------- 
//
//head.js("/assets/js/gage/raphael.2.1.0.min.js", "/assets/js/gage/justgage.js", function() {
//
//
//
//    var g1;
//    window.onload = function() {
//        var g1 = new JustGage({
//            id: "g1",
//            value: getRandomInt(0, 1000),
//            min: 0,
//            max: 1000,
//            relativeGaugeSize: true,
//            gaugeColor: "rgba(0,0,0,0.4)",
//            levelColors: "#0DB8DF",
//            labelFontColor : "#ffffff",
//            titleFontColor: "#ffffff",
//            valueFontColor :"#ffffff",
//            label: "VISITORS",
//            gaugeWidthScale: 0.2,
//            donut: true
//        });
//    };
//
//
//
//});
window.console&&window.console.log||(window.console={log:function(){},error:function(){},info:function(){},table:function(){}});(function(){var a=false,c=null,b="";"use strict";var j=b,o=Object.prototype.toString,e=Object.prototype.hasOwnProperty,p=function(){},k,g=c,h=function(){if(g==c)g=$('<div style="display:none"></div>');return g},i=0,f=0,d=window.bingo={version:{major:1,minor:2,rev:0,toString:function(){return[this.major,this.minor,this.rev].join(".")}},isDebug:a,prdtVersion:b,supportWorkspace:a,stringEmpty:j,noop:p,newLine:"\r\n",hasOwnProp:function(b,a){return e.call(b,a)},trace:function(a){console.error&&console.error(a.stack||a.message||a+b)},isType:function(a,b){return o.apply(b)==="[object "+a+"]"},isUndefined:function(a){return typeof a==="undefined"||a===k},isNull:function(a){return a===c||this.isUndefined(a)},isBoolean:function(a){return this.isType("Boolean",a)},isNullEmpty:function(a){return this.isNull(a)||a===j},isFunction:function(a){return this.isType("Function",a)},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},isString:function(a){return this.isType("String",a)},isObject:function(b){var a=this;return!a.isNull(b)&&a.isType("Object",b)&&!a.isElement(b)&&!a.isWindow(b)},isPlainObject:function(b){if(!this.isObject(b))return a;try{if(b.constructor&&!e.call(b,"constructor")&&!e.call(b.constructor.prototype,"isPrototypeOf"))return a}catch(d){return a}var c;for(c in b);return c===k||e.call(b,c)},isArray:function(a){return Array.isArray?Array.isArray(a):this.isType("Array",a)},isWindow:function(a){return!this.isNull(a)&&a==a.window},isElement:function(b){var c=b&&(b.ownerDocument||b).documentElement;return c?true:a},trim:function(a){return this.isString(a)?a.replace(/(^\s*)|(\s*$)|(^\u3000*)|(\u3000*$)|(^\ue4c6*)|(\ue4c6*$)/g,b):this.isNull(a)?b:a.toString()},isStringEquals:function(b,c){return b==c?true:!this.isString(b)||!this.isString(c)?a:b.toUpperCase()==c.toUpperCase()},replaceAll:function(a,b,d,c){if(this.isNullEmpty(a)||this.isNullEmpty(b))return a;b=b.replace(/([^A-Za-z0-9])/g,"\\$1");a=a.replace(new RegExp(b,c||"g"),d);return a},toStr:function(a){return this.isNull(a)?b:a.toString()},inArray:function(b,d,g,h){var e=this.isFunction(b)?b:c;if(arguments.length==2&&!e)return d&&d.indexOf&&d.indexOf(b);var f=-1;this.each(d,function(c,d){if(e){if(e.call(c,c,d)){f=d;return a}}else if(c===b){f=d;return a}},g,h);return f},removeArrayItem:function(d,b){for(var c=[],a=0,e=b.length;a<e;a++)b[a]!=d&&c.push(b[a]);return c},sliceArray:function(c,a,b){isNaN(a)&&(a=0);isNaN(b)&&(b=c.length);if(a<0)a=b+a;if(a<0)a=0;return Array.prototype.slice.call(c,a,a+b)},makeAutoId:function(){var a=(new Date).valueOf();f=a===i?f+1:0;i=a;return[a,f].join("_")},each:function(e,l,k,f){if(this.isNull(e)||!d.isNumeric(e.length))return;var i=c,b=d.isNumeric(k)?k:0;if(b<0)b=e.length+b;if(b<0)b=0;var j=f?b-1:e.length,h=f?e.length-1:b;if(f&&h<=j||!f&&h>=j)return;for(var m=f?-1:1,g=h;g!=j;g+=m){i=e[g];if(l.call(i,i,g)===a)break}},eachProp:function(b,f){if(!b)return;var c;for(var e in b)if(d.hasOwnProp(b,e)){c=b[e];if(f.call(c,c,e)===a)break}},htmlEncode:function(a){if(this.isNullEmpty(a))return b;var c=h();c.text(a);a=c.html();return a},htmlDecode:function(a){if(this.isNullEmpty(a))return b;var c=h();c.html(a);var d=c.text();return d},urlEncode:function(a){return this.isNullEmpty(a)?b:encodeURI(a)},urlDecode:function(a){return this.isNullEmpty(a)?b:decodeURI(a)},clearObject:function(a){for(var b=0,e=arguments.length;b<e;b++){a=arguments[b];d.eachProp(a,function(b,e){if(b&&b.$clearAuto===true)if(b.dispose)b.dispose();else d.clearObject(b);a[e]=c})}},extend:function(a){var b=arguments.length;if(b<=0)return a;if(b==1){for(var e in a)d.hasOwnProp(a,e)&&(this[e]=a[e]);return this}for(var f=c,g=1;g<b;g++){f=arguments[g];!this.isNull(f)&&d.eachProp(f,function(b,c){a[c]=b})}return a},clone:function(d,b,c){b=b!==a;return m.clone(d,b,c)},proxy:function(b,a){return function(){return a&&a.apply(b,arguments)}}},l=["bingoV"+d.version.major].join(b),n=[l,d.version.minor].join("_");window[l]=window[n]=d;var m={isCloneObject:function(a){return d.isPlainObject(a)},clone:function(a,b,c){return!a?a:d.isArray(a)?this.cloneArray(a,b):c||this.isCloneObject(a)?this.cloneObject(a,b,c):a},cloneObject:function(e,a,c){var b={};d.eachProp(e,function(d,e){if(a)d=m.clone(d,a,c);b[e]=d});return b},cloneArray:function(f,e){for(var g=[],b=c,h=f.length,d=0;d<h;d++){b=f[d];if(e!==a)b=this.clone(b,e);g.push(b)}return g}}})();(function(b){var a=null;"use strict";var c=/[\[\.]?[\'\"]?([^\[\]\.\'\"]+)[\'\"]?[\]\.]?/g,d=function(b){c.lastIndex=0;var a=[];b.replace(c,function(c,b){if(g(c)&&a.length>0)a[a.length-1].isArray=true;a.push({attrname:b,isArray:false})});return a},f=function(h,e,k){if(!h||b.isNullEmpty(e))return;if(e.indexOf(".")<0&&e.indexOf("]")<0)h[e]=k;for(var g=d(e),f=h,i=a,l=g.length-1,c=a,j=0;j<l;j++){i=g[j];c=i.attrname;if(b.isNull(f[c]))f[c]=i.isArray?[]:{};f=f[c]}c=g[l].attrname;f[c]=k},g=function(a){return a.indexOf("]")>=0&&(a.indexOf('"')<0&&a.indexOf("'")<0)},e=function(h,e){if(!h||b.isNullEmpty(e))return;if(e.indexOf(".")<0&&e.indexOf("]")<0)return h[e];for(var g=d(e),f=h,j=a,k=g.length-1,c=a,i=0;i<k;i++){j=g[i];c=j.attrname;if(b.isNull(f[c]))return f[c];f=f[c]}c=g[k].attrname;return f[c]};b.extend({datavalue:function(a,b,c){if(arguments.length>=3)f(a,b,c);else return e(a,b)}})})(bingo);(function(c){var b=null,a=true;"use strict";c.Event=function(f,e){var b=function(a){a&&b.on(a);return arguments.length==0?b:this};b.__bg_isEvent__=a;b.__eventList__=e||[];c.extend(b,d);b.owner(f);return b};c.isEvent=function(b){return b&&b.__bg_isEvent__===a};var d={_end:false,_endArg:undefined,owner:function(a){if(arguments.length==0)return this.__owner__;else{this.__owner__=a;return this}},_this:function(){return this.owner()||this},on:function(a){if(a)this._checkEnd(a)||this.__eventList__.push({one:false,callback:a});return this},one:function(b){if(b)this._checkEnd(b)||this.__eventList__.push({one:a,callback:b});return this},off:function(b){var a=this;if(b){var d=[];c.each(a.__eventList__,function(){this.callback!=b&&d.push(this)});a.__eventList__=d}else a.__eventList__=[];return a},_checkEnd:function(b){var a=this;if(a._end){var d=a._endArg||[],c=a._this();setTimeout(function(){b.apply(c,d)},1)}return a._end},end:function(c){var b=this;b._end=a;b._endArg=c;b.trigger(c);b.off();return b},trigger:function(){var f=this;for(var h=f.__eventList__,i=b,e=b,d=b,j=f._this(),g=0,k=h.length;g<k;g++){e=h[g];if(e.one===a){d||(d=f.__eventList__);d=c.removeArrayItem(e,d)}if((i=e.callback.apply(j,arguments[0]||[]))===false)break}d&&(f.__eventList__=d);return i},triggerHandler:function(){var e=this,f=e.__eventList__,d=b,g=e._this();if(f.length==0)return;d=f[0];var h=d.callback.apply(g,arguments[0]||[]);if(d.one===a)e.__eventList__=c.removeArrayItem(d,e.__eventList__);return h},clone:function(a){return c.Event(a||this.owner(),this.__eventList__)},size:function(){return this.__eventList__.length}}})(bingo);(function(a){var c=true,b=false;"use strict";var e="isVar1212";a.isVariable=function(a){return a&&a._isVar_==e};a.variableOf=function(b){return a.isVariable(b)?b():b};var g=a.variable=function(k,h,j){var i=a.variableOf(k),g=function(c){g.owner=this;if(arguments.length==0){var f=g._get_?g.$get():g.value;g.owner=null;return f}else{c=a.variableOf(c);var e=a.clone(g.$get());if(g._set_)g._set_.call(g,c);else g.value=c;c=g.$get();var d=!a.equals(c,e);if(d)g.$setChange();else g._triggerFn([c],b);g.owner=null;return g.$owner()||this}};g._isVar_=e;g._isChanged=c;a.extend(g,f);d&&a.extend(g,d);g.$owner(h).$view(j);g(i);return g},d=null;g.extend=function(b){if(!b)return;d=a.extend(d||{},b)};var f={size:function(){var a=this.$get();return a&&a.length||0},_triggerChange:function(){var a=this.$get();this._triggerFn([a],c)},_addFn:function(f,e,c,d){var b=this;(b._fnList||(b._fnList=[])).push({fn:f,change:e,disposer:c,_priority:d||50});b._fnList=a.linq(b._fnList).sortDesc("_priority").toArray();return b},_triggerFn:function(h,f){var d=this;if(d._fnList){var g=d,e=b;a.each(d._fnList,function(){var b=this;if(b.disposer&&b.disposer.isDisposed){e=c;a.clearObject(b);return}(f||!b.change)&&b.fn.apply(g,h)});if(e)d._fnList=a.linq(d._fnList).where(function(){return this.fn}).toArray()}},$off:function(e){var d=this;if(arguments.length>0)d._fnList=a.linq(d._fnList).where(function(){if(this.fn==e){a.clearObject(this);return b}else return c}).toArray();else{a.each(d._fnList,function(){a.clearObject(this)});d._fnList=[]}},$assign:function(a,c,d){return this._addFn(a,b,c||this.$view(),d)},$subs:function(a,b,d){return this._addFn(a,c,b||this.$view(),d)},$setChange:function(c){var a=this;a._isChanged=c!==b;a._isChanged&&a._triggerChange();return a},_obsCheck:function(){var a=this._isChanged;this._isChanged=b;return a},$get:function(c){var b=this;if(arguments.length==0)return b._get_?b._get_.call(b):b.value;else{a.isFunction(c)&&(b._get_=c);return b}},$set:function(c){var b=this;if(a.isFunction(c)){b._set_=c;b(b.$get())}return b},$view:function(a){if(arguments.length==0)return this._view_;else{this._view_=a;return this}},$owner:function(a){if(arguments.length==0)return this._owner_;else{this._owner_=a;return this}},$linq:function(){return a.linq(this.$get())},clone:function(d){var b=this,c=a.variable(b.value);c._get_=b._get_;c._set_=b._set_;c.$owner(d||b.$owner()).$view(b.$view());return c}}})(bingo);(function(a){var c=true,b=null;"use strict";var f=function(d,e){var b=d.prototype,c=b.__bg_property__||(b.__bg_property__={});a.eachProp(e,function(d,e){if(!(a.isPlainObject(d)||a.isArray(d)))b[e]=d;else c[e]=d})},d="__pro_names__",h=function(f,e){var b=f.prototype,c=b[d]?b[d].split(","):[];a.eachProp(e,function(d,a){d=e[a];b[a]=n(a,d);c.push(a)});b[d]=c.join(",")},n=function(c,d){var h=a.isObject(d),f=h&&d.$set,e=h&&d.$get,g=b;if(f||e)g=function(i){var h=j(this),g=a.hasOwnProp(h,c)?h[c]:(h[c]={value:a.clone(d.value)});g.owner=this;if(arguments.length==0){var k=e?e.call(g):g.value;g.owner=b;return k}else{if(f)f.call(g,i);else g.value=i;g.owner=b;return this}};else g=function(e){var b=j(this);if(arguments.length==0)return a.hasOwnProp(b,c)?b[c]:d;else{b[c]=e;return this}};return g},j=function(a){return a._bg_prop_||(a._bg_prop_={})},e="NewObject_define",g=function(b,a){this._define=b;a&&this._Base(a)};a.extend(g.prototype,{_Base:function(d){var b=this._define;b.prototype=new d(e);b.prototype.constructor=b;var c=b.prototype.__bg_property__;if(c)b.prototype.__bg_property__=a.clone(c);b.prototype.base=function(){var b=this,c=d.prototype;b.base=c.base;if(c.___Initialization__==a.noop)b.base.apply(b,arguments);else c.___Initialization__.apply(b,arguments)}},Define:function(a){f(this._define,a);return this},Initialization:function(a){this._define.prototype.___Initialization__=a;return this},Static:function(b){a.extend(this._define,b);return this},Prop:function(a){h(this._define,a);return this}});a.isClassObject=function(a){return a&&a.__bg_isObject__===c};a.isClass=function(a){return a&&a.__bg_isClass__===c};a.Class=function(){for(var n,k,o,j=b,p=0,r=arguments.length;p<r;p++){j=arguments[p];if(j)if(a.isClass(j))k=j;else if(a.isFunction(j))o=j;else if(a.isString(j))n=j}k||(k=a.Class.Base);var d=function(){if(arguments[0]!=e)return d.NewObject.apply(window,arguments)};d.__bg_isClass__=c;d.prototype.___Initialization__=a.noop;d.prototype.base=a.noop;d.extend=function(a){f(d,a)};d.extendProp=function(a){h(d,a)};d.NewObject=function(){var b=new d(e);if(b.__bg_property__){var c=a.clone(b.__bg_property__);a.extend(b,c)}if(b.___Initialization__==a.noop)b.base&&b.base.apply(b,arguments);else b.___Initialization__.apply(b,arguments);b.___Initialization__=a.noop;b.base=a.noop;d._onInit_&&d._onInit_.trigger([b]);d._onDispose_&&b.onDispose(function(){d._onDispose_.trigger([b])});return b};d.onInit=m;d.onDispose=l;var q=new g(d,k);o&&o.call(q);q=b;!a.isNullEmpty(n)&&i(n,d);return d};var m=function(c){var b=this;if(c){b._onInit_||(b._onInit_=a.Event());b._onInit_.on(c)}return b},l=function(c){var b=this;if(c){b._onDispose_||(b._onDispose_=a.Event());b._onDispose_.on(c)}return b},i=function(h,g){for(var c=h.split("."),b=window,d="",e=c.length-1,f=0;f<e;f++){d=c[f];if(!a.isNullEmpty(d)){if(a.isNull(b[d]))b[d]={};b=b[d]}}b[c[e]]&&k(b[c[e]],g);return b[c[e]]=g},k=function(c,b){a.eachProp(c,function(d,c){if(!a.hasOwnProp(b,c))b[c]=d})};a.Class.makeDefine=function(a,b){i(a,b)};a.Class.Base=a.Class(function(){var e="$dispose";this.Define({__bg_isObject__:c,isDisposed:false,disposeStatus:0,dispose:function(){var b=this;if(b.disposeStatus===0)try{b.disposeStatus=1;b.trigger(e)}finally{a.clearObject(b);b.disposeStatus=2;b.isDisposed=c;b.dispose=a.noop}},onDispose:function(a){return this.on(e,a)},disposeByOther:function(b){if(b&&b.dispose&&!b.isDisposed){var c=a.proxy(this,function(){this.dispose()});b.onDispose(c);this.onDispose(function(){b.isDisposed||b.onDispose().off(c)})}return this},$prop:function(e){var f=this,c=f[d];if(a.isNullEmpty(c))return arguments.length==0?b:f;c=c.split(",");var g=f;if(arguments.length==0){e={};a.each(c,function(a){e[a]=g[a]()});return e}else{a.eachProp(e,function(d,b){a.inArray(b,c)>=0&&g[b](e[b])});return f}}});this.Define({getEvent:function(d){var c=this;if(d){c.__events__||(c.__events__={});var e=c.__events__;return e[d]||(e[d]=a.Event(c))}return b},hasEvent:function(a){return this.__events__&&this.__events__[a]&&this.__events__[a].size()>0},on:function(b,a){if(b&&a)this.getEvent(b).on(a);return this},one:function(b,a){if(b&&a)this.getEvent(b).one(a);return this},off:function(a,b){this.hasEvent(a)&&this.getEvent(a).off(b);return this},end:function(a,b){a&&this.getEvent(a).end(b);return this},trigger:function(a){if(this.hasEvent(a)){var b=arguments.length>1?arguments[1]:[];return this.getEvent(a).trigger(b)}},triggerHandler:function(a){if(this.hasEvent(a)){var b=arguments.length>1?arguments[1]:[];return this.getEvent(a).triggerHandler(b)}}})});a.Class.Define=function(b){if(a.isObject(b)){var g=b.$base,d=b.$init,c=b.$dispose,e=b.$static,f=b.$prop;g&&delete b.$base;d&&delete b.$init;c&&delete b.$dispose;e&&delete b.$static;f&&delete b.$prop;return a.Class(g||a.Class.Base,function(){var a=this;f&&a.Prop(f);a.Define(b);(d||c)&&a.Initialization(function(){if(c)this.onDispose(c);d&&d.apply(this,arguments)});e&&a.Static(e)})}}})(bingo);(function(a){"use strict";var b=a.linqClass=a.Class(function(){var b=null,c=true;this.Define({concat:function(d,e){var b=this;b._doLastWhere();e=e===c;!a.isArray(d)&&(d=[d]);var f=e?d:b._datas,g=e?b._datas:d;b._datas=f.concat(g);return b},_backup:b,backup:function(){var a=this;a._doLastWhere();a._backup=a._datas;return a},restore:function(b){var a=this;if(b===c){var d=a.toArray();if(d.length==0)a._datas=a._backup}else a._datas=a._backup;return a},each:function(d,b,c){this._doLastWhere();a.each(this._datas,d,b,c);return this},where:function(b,d,c,e){if(!a.isFunction(b)){var g=b,f=d;b=function(){return this[g]==f}}this._doLastWhere();this._lastWhere={fn:b,index:d,count:a.isNumeric(c)?c:-1,rever:e};return this},_lastWhere:b,_doLastWhere:function(f,e,g){var d=this,c=d._lastWhere;if(c){d._lastWhere=b;var i=c.fn,f=a.isNumeric(f)?f:c.index,e=a.isNumeric(e)?e:c.count,g=!a.isUndefined(g)?g:c.rever,h=[];d.each(function(a,b){if(i.call(a,a,b)){h.push(a);if(e!=-1){e--;if(e==0)return false}}},f,g);d._datas=h}return d},select:function(b,f){var d=this;if(!a.isFunction(b)){var g=b;b=function(){return this[g]}}d._doLastWhere();var e=[];d.each(function(a,d){if(f===c)e=e.concat(b.call(a,a,d));else e.push(b.call(a,a,d))});d._datas=e;return d},sort:function(b){var a=this;a._doLastWhere();a._datas=a._datas.sort(function(d,e){var a=b(d,e);return a>0||a===c?1:a<0||a===false?-1:0});return a},sortAsc:function(b){var c=a.isFunction(b);return this.sort(function(a,d){return c?b.call(a,a)-b.call(d,d):b?a[b]-d[b]:a-d})},sortDesc:function(b){var c=a.isFunction(b);return this.sort(function(a,d){return c?b.call(d,d)-b.call(a,a):b?d[b]-a[b]:d-a})},unique:function(b){var c=this;c._doLastWhere();var e=[],d=[];if(!a.isFunction(b))if(arguments.length==0)b=function(a){return a};else{var f=b;b=function(a){return a[f]}}c.each(function(c,g){var f=b.call(c,c,g);if(a.inArray(f,d)<0){e.push(c);d.push(f)}});c._datas=e;return c},count:function(){this._doLastWhere();return this._datas.length},first:function(a){this._doLastWhere(0,1);return this._datas[0]||a},last:function(a){this._doLastWhere(0,1,c);return this._datas[0]||a},contain:function(){this._doLastWhere(0,1);return this.count()>0},index:function(){var b=this._datas,c=this.first();return a.inArray(c,b)},sum:function(b){this._doLastWhere();if(!a.isFunction(b)){var c=b;b=function(a){return c?a[c]:a}}var d=0;this.each(function(a,c){d+=b?b.call(a,a,c):a});return d},avg:function(b){this._doLastWhere();if(!a.isFunction(b)){var d=b;b=function(a){return d?a[d]:a}}var c=0;this.each(function(a,d){c+=b?b.call(a,a,d):a});return c==0?0:c/this._datas.length},take:function(c,b){this._doLastWhere();if(isNaN(b)||b<0)b=this.count();return a.sliceArray(this._datas,c,b)},toArray:function(){this._doLastWhere();return this._datas},toPage:function(f,a){var b=this.toArray(),d=1,c=1,a=a,e=b.length,b=b;if(b.length>0){c=parseInt(e/a)+(e%a!=0?1:0);d=f>c?c:f<1?1:f;b=this.take((d-1)*a,a)}return{currentPage:d,totalPage:c,pageSize:a,totals:e,list:b}},_getGroupByValue:function(e,c,d){for(var a=0,f=c.length;a<f;a++)if(c[a][d]==e)return c[a];return b},group:function(g,f,h){var d=this;f||(f="group");h||(h="items");if(!a.isFunction(g)){var m=g;g=function(a){return a[m]}}d._doLastWhere();for(var j=[],l=d._datas,n=l.length,e=b,c=b,k=b,i=0;i<n;i++){e=l[i];k=g.call(e,e,i);c=d._getGroupByValue(k,j,f);if(c==b){c={};c[f]=k;c[h]=[e];j.push(c)}else c[h].push(e)}d._datas=j;return d}});this.Initialization(function(a){this._datas=a||[]})});a.linq=function(a){return b.NewObject(a)}})(bingo);(function(a){var b=false;"use strict";var c=function(b,c){return a.isNull(b)||a.isNull(c)?b===c:a.isArray(b)?f(b,c):b instanceof RegExp?e(b,c):a.isFunction(b)?a.isFunction(c)&&b.valueOf()===c.valueOf():a.isObject(b)?d(b,c):typeof b===typeof c&&b.valueOf()===c.valueOf()},e=function(b,a){return a instanceof RegExp&&b.source===a.source&&b.global===a.global&&b.ignoreCase===a.ignoreCase&&b.multiline===a.multiline},f=function(d,e){if(d===e)return true;if(!a.isArray(e)||d.length!=e.length)return b;for(var f=0,g=d.length;f<g;f++)if(!c(d[f],e[f]))return b;return true},d=function(d,e){if(d===e)return true;if(!a.isObject(e))return b;var f=0;for(var g in d){f++;if(a.hasOwnProp(d,g)&&!c(d[g],e[g]))return b}for(var h in e)f--;return f===0};a.extend({equals:function(a,b){return c(a,b)}})})(bingo);(function(a){"use strict";var b=window.document,c=b.head||b.getElementsByTagName("head")[0]||b.documentElement,d=c.getElementsByTagName("base")[0],e=/loaded|complete|undefined/i,h=/SCRIPT/i,g=function(h,k,j,g){var e=b.createElement("script");e.importurl=h;e.imporid=j||a.makeAutoId();e.async="async";e.src=h;if(g){var i=a.isFunction(g)?g(h):g;i&&(e.charset=i)}f(e,k||a.noop);d?c.insertBefore(e,d):c.appendChild(e);return j},f=function(b,c){var d=function(){if(!b)return;if(e.test(b.readyState)){b.onload=b.onerror=b.onreadystatechange=null;!a.isDebug&&b.parentNode&&b.parentNode.removeChild(b);setTimeout(function(){if(!b)return;try{c&&c(b.importurl,b.imporid,b)}finally{b=undefined;c=null}},1)}};b.onload=b.onerror=b.onreadystatechange=function(){d()}};a.extend({fetch:function(c,a,d,b){return g(c,a,d,b)}})})(bingo);(function(a){var c=null,b="?";"use strict";var j,v=[],f=[],e=[],d=[[],[]],m=function(b,c){return a.inArray(function(c){return a.isStringEquals(c,b)},c)},F=function(a){return m(a,v)>=0||m(a,f)>=0||m(a,e)>=0},C=function(f,c,b){!a.isNumeric(b)&&(b=a.usingPriority.Normal);z(f);d[b]||(d[b]=[]);d[b].push(c);if(e.length>0)E();else setTimeout(function(){i()&&l()},1)},z=function(d){var c=a.stringEmpty;a.each(d,function(d){if(a.isNull(d))return;c=a.route(d);c=A(c);if(!a.supportWorkspace&&!a.isNullEmpty(a.prdtVersion))c=[c,c.indexOf(b)>=0?"&":b,"_version_=",a.prdtVersion].join("");!F(c)&&e.push(c)})},E=function(){if(e.length>0){var b=e;e=[];a.each(b,function(b){f.push(b);a.fetch(b,y)})}},i=function(){return e.length<=0&&f.length<=0},g=j,y=function(b){v.push(b);f=a.removeArrayItem(b,f);g!=j&&clearTimeout(g);g=setTimeout(function(){g=j;i()&&l()},5)},l=function(){var b=true;a.each(d,function(f,c){var e=d[c];d[c]=[];a.each(e,function(b){a.isFunction(b)&&b()});if(d[c].length>0){b=false;return false}});if(!b)i()&&l()},n=[],x=function(b,a){return{path:a,mapPath:b,pathReg:p(a)}},D=function(b,c){b=a.route(b);c=a.route(c);var d=w(c);if(a.isNull(d))n.push(x(b,c));else d.mapPath=b},w=function(d,e){var b=a.inArray(function(b){if(e===true&&b.pathReg){b.pathReg.lastIndex=0;return b.pathReg.test(d)}else return a.isStringEquals(b.path,d)},n);return b>=0?n[b]:c},A=function(b){var a=w(b,true);return a&&a.mapPath||b},h=/(\W)/g,r=/(\\([?*]))/g,q=/\\\*\\\*/g,u=/\?[^?=]+\=.*$/,B=/[?*]+/,s=function(b){return!a.isNullEmpty(b)&&B.test(b.replace(u,""))},p=function(b){if(!s(b))return c;var a=b.match(u);if(a){a=a[0];b=b.replace(a,"");a=a.replace(h,"\\$1")}else a="";h.lastIndex=0;r.lastIndex=0;q.lastIndex=0;var d=b.replace(h,"\\$1").replace(q,".*").replace(r,"[^./]$2");d=["^",d,a,"$"].join("");return new RegExp(d)};a.extend({using:function(){if(arguments.length<=0)return;for(var e=[],d=c,g=0,b=c,f=0,h=arguments.length;f<h;f++){b=arguments[f];if(b)if(a.isFunction(b))d=b;else if(a.isNumeric(b))g=b;else e=e.concat(b)}C(e,function(){d&&d()},g)},makeRegexMapPath:p,isRegexMapPath:s,usingMap:function(c,b){if(a.isNullEmpty(c)||!b||b.length<=0)return;a.each(b,function(b){if(a.isNullEmpty(b))return;D(c,b)})},usingPriority:{First:0,NormalBefore:45,Normal:50,NormalAfter:55,Last:100},path:function(c){if(this.isObject(c))this.extend(o,c);else if(arguments.length>1)o[arguments[0]]=arguments[1];else{var d=c.split(b);c=d[0];c=k(c);if(d.length>1)c+=b+a.sliceArray(d,1).join(b);return c}}});var o={},t=/%([^%]*)%/i,k=function(d){if(a.isNullEmpty(d)||d.indexOf("%")<0)return d;var h="";if(d.indexOf(b)){var i=d.split(b);d=i[0];h=i[1]}t.lastIndex=0;var e=d.match(t),f=a.stringEmpty,g=o;if(e)if(g[e[1]])f=k(d.replace(e[0],g[e[1]]));else f=k(d.replace(e[0],a.stringEmpty));e=c;g=c;return!h?f:[f,h].join(b)}})(bingo);(function(b){var h="list",g="user",e="system",c=null,d="$",a="";"use strict";b.route=function(a,c){if(arguments.length==1)return b.routeContext(a).toUrl;else a&&c&&i.add(a,c)};b.routeContext=function(a){return i.getRouteByUrl(a)};b.routeLink=function(c,d){var b=i.getRuote(c);return b?j(b.context.url,d,1):a};b.routeLinkQuery=function(c,f){c||(c=a);var e=a;if(c.indexOf(d)>=0||c.indexOf("?")>=0){var g=b.routeContext(c);f=b.extend({},f,g.params.queryParams);var h=c.indexOf(d)>=0?d:"?";c=c.split(h)[0]}b.eachProp(f,function(b,c){b=encodeURIComponent(b||a);e=[e,d,c,":",b].join(a)});return[c,e].join(a)};var f=/\{([^}]+)\}/gi,m=function(n,e){if(!n||!e.url)return c;var h=e.url,k=b.isRegexMapPath(h);if(k){var l=h.indexOf(d)>=0?h.split(d)[0]:h;f.lastIndex=0;l=l.replace(f,"*");e._reg||(e._reg=b.makeRegexMapPath(l));if(!e._reg.test(n))return c}var g=n.split(d),p=g[0].split("/"),o=e._matchUrlList||(e._matchUrlList=h.split("/"));if(p.length!=o.length)return k?{}:c;var j={},i=true,m;b.each(o,function(c,d){m=p[d];if(!(k&&b.isRegexMapPath(c))){f.lastIndex=0;if(f.test(c))j[c.replace(f,"$1")]=decodeURIComponent(m||a);else{i=c==m;if(!i)return false}}});var q=j.queryParams={};if(i&&g.length>1){g=b.sliceArray(g,1);b.each(g,function(d){var c=d.split(":"),b=c[0],e=decodeURIComponent(c[1]||a);b&&(j[b]=q[b]=e)})}return i?j:c},k=function(){var e={app:c,module:c,controller:c,action:c},a=this.params;if(a){var i=a.app,h=a.module,g=b.isNullEmpty(i)?b.defaultApp():b.app(i),d=b.isNullEmpty(h)?g.defaultModule():g.module(h),f=d?d.controller(a.controller):c,j=f?f.action(a.action):d?d.action(a.action):c;e.app=g;e.module=d;e.controller=f;e.action=j}return e},l=function(c,d,b,a){return{name:c,params:a,url:d,toUrl:b,actionContext:k}},j=function(c,j,i){f.lastIndex=0;if(!c||!j)return b.path(c);var e=a,h=a,g=a;b.eachProp(j,function(j,f){h=["{",f,"}"].join(a);g=encodeURIComponent(j||a);if(c.indexOf(h)>=0)c=b.replaceAll(c,h,g);else if(f!="module"&&f!="controller"&&f!="action"&&f!="service"&&f!="app"&&f!="queryParams")if(i==1)e=[e,d,f,":",g].join(a);else e=[e,"&",f,"=",g].join(a)});if(e)if(i==1)c=[c,e].join(a);else if(c.indexOf("?")>=0)c=[c,e].join(a);else c=[c,e.substr(1)].join("?");return b.path(c)},i={datas:[],defaultRoute:{url:"**",toUrl:function(a){return a}},add:function(e,a){var c=this,d=c.getRuote(e);if(b.isUndefined(a.priority))a.priority=100;if(d)d.context=a;else c.datas.push({name:e,context:a});c.datas=b.linq(c.datas).sort(function(a,b){return b.context.priority-a.context.priority}).toArray()},getRuote:function(d){var a=c;b.each(this.datas,function(){if(this.name==d){a=this;return false}});return a},getRouteByUrl:function(f){if(!f)return a;var g=f.split("?");if(g.length>1)f=g[0];var e=c,h=a,d=c;b.each(this.datas,function(){e=this.context;d=m(f,e);if(d){h=this.name;return false}});if(!d){e=i.defaultRoute;h="defaultRoute"}if(d||e.defaultValue)d=b.extend({},e.defaultValue,d);if(b.isFunction(e.toUrl))e.toUrl;var k=b.isFunction(e.toUrl)?e.toUrl.call(e,f,d):e.toUrl;if(g.length>1){d||(d={});g[1].replace(/([^=&]+)\=([^=&]*)/g,function(c,b,a){d[b]=a})}var k=j(k,d);return l(h,f,k,d)}};b.route("view",{priority:100,url:"view/{module}/{controller}/{action}",toUrl:"modules/{module}/views/{controller}/{action}.html",defaultValue:{module:e,controller:g,action:h}});b.route("action",{url:"action/{module}/{controller}/{action}",toUrl:"modules/{module}/controllers/{controller}.js",defaultValue:{module:e,controller:g,action:h}});b.route("viewS",{url:"view/{module}/{action}",toUrl:"modules/{module}/{action}.html",defaultValue:{module:e,action:h}});b.route("actionS",{url:"action/{module}/{action}",toUrl:"modules/{module}/scripts/{action}.js",defaultValue:{module:e,action:h}});b.route("service",{url:"service/{module}/{service}",toUrl:"modules/{module}/services/{service}.js",defaultValue:{module:e,service:g}});b.route("serviceS",{url:"service/{service}",toUrl:"modules/services/{service}.js",defaultValue:{module:e,service:g}})})(bingo);(function(a){"use strict";a.cacheToObject=function(a){return a&&a.__bg_cache__?a.__bg_cache__:(a.__bg_cache__=c.NewObject())};var f=function(c,d){var b=a.linq(c._datas).where(function(){return this.key==d}).first();b&&(b.t=(new Date).valueOf());return b},b=function(a,f,e,c){c>0&&d(a,c);var b={t:(new Date).valueOf(),key:f,value:e};a._datas.push(b);return b},d=function(b,e){var d=b._datas.length,c=5;if(d>=e+c)b._datas=a.linq(b._datas).sortAsc("t").take(c)},e=function(b,c){b._datas=a.linq(b._datas).where(function(){return this.key!==c}).toArray()},g=function(b,c){return a.linq(b._datas).where(function(){return this.key==c}).contain()},c=a.Class(function(){this.Prop({max:0,context:null});this.Define({key:function(){if(arguments.length==0)return this._key;else{this._key=a.sliceArray(arguments,0).join("_");return this}},_getItem:function(){var c=this,d=c.key();if(d){var h=c._datas,g=f(c,d);if(g)return g;else{var e=c.context();if(a.isFunction(e))return b(c,d,e(),c.max())}}},"get":function(){var a=this._getItem();return a&&a.value},"set":function(c){var a=this,d=a._getItem();if(d)d.value=c;else{var e=a.key();e&&b(a,e,c,a.max())}return a},has:function(){var a=this.key();return a?g(this,a):false},clear:function(){var a=this,b=a.key();a.has()&&e(a,b);return a},clearAll:function(){this._datas=[];return this}});this.Initialization(function(){this._datas=[]})})})(bingo);(function(c,b){var a=true;"use strict";var d="bingoLinkToDom";c.extend({linkToDom:function(f,a){if(f&&c.isFunction(a)){var e=b(f);if(e.size()>0)e.one(d,a);else a.call(e)}return a},unLinkToDom:function(a,c){if(a){var e=b(a);if(c)e.off(d,c);else e.off(d)}},isUnload:false});c.linkToDom.LinkToDomClass=c.Class(function(){this.Define({isDisposeFormDom:false,linkToDom:function(e){var d=this;d.__linkToDomInit();if(e){d.unlinkToDom();var f=d.__bg_lnk_dom=b(e);d.__bg_lnk_fn=c.linkToDom(f,c.proxy(d,function(){this.isDisposeFormDom=a;this.dispose();this.isDisposeFormDom=a}))}return d},unlinkToDom:function(){var b=this;if(b.__bg_lnk_dom&&b.isDisposeFormDom!==a){c.unLinkToDom(b.__bg_lnk_dom,b.__bg_lnk_fn);b.__bg_lnk_dom=null}return b},__linkToDomInit:function(){if(this.__isLinkToDomInit)return;this.__isLinkToDomInit=a;this.onDispose(function(){this.unlinkToDom()})}})});var e=b.cleanData;b.cleanData=function(f){for(var c=0,a;(a=f[c])!=null;c++)try{b(a).triggerHandler(d)}catch(g){}e.apply(b,arguments)};b(window).unload(function(){c.isUnload=a;b(document.body).remove();b(document.documentElement).remove()})})(bingo,window.jQuery);(function(b){var a=null;"use strict";var l=function(a){var c={priority:50,tmpl:"",tmplUrl:"",replace:false,include:false,view:false,compileChild:true};a=a();if(b.isFunction(a)||b.isArray(a))c.link=a;else c=b.extend(c,a);return c},o=function(a,c){if(b.isNullEmpty(a))return;a=a.toLowerCase();return arguments.length==1?f.call(this,"_commands",a):(this._commands[a]=l(c))},s=function(c,d){return b.isNullEmpty(c)?a:arguments.length==1?f.call(this,"_filters",c):(this._filters[c]=d)},p=function(c,e){var a=this,d=arguments.length;return d==0?a._factorys:d==1?b.factory.factoryClass.NewObject().module(a).setFactory(c):e===true?f.call(a,"_factorys",c):(a._factorys[c]=e)},k=function(a,c){if(b.isNullEmpty(a))return;if(arguments.length==1)return f.call(this,"_factoryExtends",a);else{c.$owner={module:this};return this._factoryExtends[a]=c}},q=function(a,c){if(b.isNullEmpty(a))return;if(arguments.length==1)return f.call(this,"_services",a);else{c.$owner={module:this};return this._services[a]=c}},m=function(h,k){var f=this;if(b.isNullEmpty(h))return;var d=f._controllers[h];if(!d)d=f._controllers[h]={module:f,name:h,_actions:{},action:r};if(b.isFunction(k)){var j=e;!j&&(e=f);var i=c;!i&&(c=e.app);g=d;k.call(d);g=a;!j&&(e=a);!i&&(c=a)}return d},r=function(b,c){var a=this;if(arguments.length==1)return a._actions[b];else{c.$owner={conroller:a,module:a.module};return a._actions[b]=c}},n=function(b,c){if(arguments.length==1)return this._actions[b];else{c.$owner={conroller:a,module:this};return this._actions[b]=c}},d=function(){return e||b.defaultModule(c)},f=function(f,e){var a=this,c=a[f][e];if(!c){var d=b.defaultModule(a.app);if(a!=d)c=d[f][e];if(!c&&a.app!=h){var d=b.defaultModule();if(a!=d)c=d[f][e]}}return c},t=function(g,i){var f=this;if(b.isNullEmpty(g))return a;var d=f._module[g];if(!d)d=f._module[g]={name:g,_services:{},_controllers:{},_commands:{},_filters:{},_factorys:{},_actions:{},action:n,service:q,controller:m,command:o,filter:s,factory:p,_factoryExtends:{},factoryExtend:k,app:f};if(b.isFunction(i)){var h=c;!h&&(c=f);e=d;i.call(d);e=a;!h&&(c=a)}return d},j=function(){return this.module("_$defaultModule$_")},i={},u={},c=a,e=a,g=a;b.extend({defaultModule:function(a){return a?a.defaultModule():h.defaultModule()},getModuleByView:function(a){return a?a.$getModule():b.defaultModule()},module:function(){var a=c||h;return a.module.apply(a,arguments)},defaultApp:function(){return h},getAppByView:function(a){return this.getModuleByView(a).app},app:function(e,f){if(this.isNullEmpty(e))return a;var d=i[e];if(!d)d=i[e]={name:e,_module:{},module:t,defaultModule:j,action:function(){var a=this.defaultModule();return a.action.apply(a,arguments)},service:function(){var a=this.defaultModule();return a.service.apply(a,arguments)},controller:function(){var a=this.defaultModule();return a.controller.apply(a,arguments)},command:function(){var a=this.defaultModule();return a.command.apply(a,arguments)},filter:function(){var a=this.defaultModule();return a.filter.apply(a,arguments)},factory:function(){var a=this.defaultModule();return a.factory.apply(a,arguments)},factoryExtend:function(){var a=this.defaultModule();return a.factoryExtend.apply(a,arguments)}};if(b.isFunction(f)){c=d;f.call(d);c=a}return d},service:function(){var a=d();return a.service.apply(a,arguments)},factoryExtend:function(){var a=d();return a.factoryExtend.apply(a,arguments)},controller:function(){var a=d();return a.controller.apply(a,arguments)},action:function(a){if(b.isFunction(a)||b.isArray(a))return a;else if(g)return g.action.apply(g,arguments);else{var c=d();return c.action.apply(c,arguments)}},command:function(){var a=d();return a.command.apply(a,arguments)},filter:function(){var a=d();return a.filter.apply(a,arguments)},factory:function(){var a=d();return a.factory.apply(a,arguments)}});var h=b.app("_$defaultApp$_")})(bingo);(function(a){"use strict";var e=a.Class(function(){var d=true,c=null;this.Prop({name:"",view:c,viewnode:c,viewnodeAttr:c,widthData:c,node:c,module:c,fn:c,params:c});this.Define({reset:function(){this.view(c).viewnode(c).viewnodeAttr(c).widthData(c).node(c).params(c);return this},_newInjectObj:function(){var c=this,d=c.viewnodeAttr(),b=c.viewnode()||d&&d.viewnode(),e=c.view()||b&&b.view()||a.rootView(),g=c.node()||b&&b.node()||e.$node(),f=c.widthData()||b&&b.getWithData();return{node:g,$view:e,$viewnode:b,$attr:d,$withData:f,$command:d&&d.command,$injectParam:c.params()}},inject:function(f,e){var a=this,h=a.fn(),c=h.$injects,b=c&&c.length>0?a._newInjectObj():{},g=a._inject(f||a.viewnodeAttr()||a.viewnode()||a.view(),a.name(),b,{},d);return e===d?b:g},_inject:function(e,d,b,h,m){var f=this.fn();if(!f)throw new Error("not find factory: "+d);var g=f.$injects,n=c,j=[],k=this;if(g&&g.length>0){var i=c;a.each(g,function(a){if(a in b)i=b[a];else i=b[a]=k.setFactory(a)._inject(e,a,b,h,false);j.push(i);k._doExtend(e,a,b,h)})}var l=f.apply(f.$owner||e,j)||{};if(a.isString(d)&&d){b[d]=l;m&&this._doExtend(e,d,b,h)}return l},_doExtend:function(f,b,e,a){if(a[b]!==d){a[b]=d;var c=this._getExtendFn(b);c&&this.setFactory(c)._inject(f,"",e,a,false)}},_getParams:function(g){var e=this,d,c,f=g.indexOf("$")>0,b="",h=g;if(f){b=g.split("$");h=b[1];b=b[0]}if(e.view()){d=a.getAppByView(e.view());c=f?d.module(b):a.getModuleByView(e.view())}else{c=e.module();d=c.app;if(f)c=d.module(b)}return{app:d,module:c,name:h}},_getExtendFn:function(e){var d=this._getParams(e),a=d.module.factoryExtend(d.name);return a?b(a):c},_getFactoryFn:function(h){var g=this._getParams(h),a=g.module,e=g.name,f=a.factory(e,d)||a.service(e);return f?b(f):c},setFactory:function(d){var e=c,f=c;if(a.isFunction(d)||a.isArray(d)){e=b(d);d=""}else e=this._getFactoryFn(d);return this.name(d).fn(e)}})});a.factory.factoryClass=e;var c=function(){};c.$injects=[];var d=/^\s*function[^(]*?\(([^)]+?)\)/i,b=function(b){if(b&&(b.$injects||b.$fn))return b.$fn||b;var e=c;if(a.isArray(b)){var f=a.clone(b,false);e=b.$fn=f.pop();e.$injects=f;e.$owner=b.$owner}else if(a.isFunction(b)){e=b;var g=e.toString(),f=[];g.replace(d,function(c,b){b&&a.each(b.split(","),function(b){b=a.trim(b);b&&f.push(b)})});e.$injects=f}return e}})(bingo);(function(a){"use strict";var b="isModel1212";a.isModel=function(a){return a&&a._isModel_==b};a.modelOf=function(b){b=a.variableOf(b);return a.isModel(b)?b.toObject():b};var e=function(c){var b=c||{},d;a.eachProp(this,function(d,c){if(a.isVariable(b[c]))b[c](d);else if(c!="_isModel_"&&c!="toObject"&&c!="fromObject"&&c!="toDefault"&&c!="_p_")b[c]=a.variableOf(d)});return b},c=function(b,c){b&&a.eachProp(b,a.proxy(this,function(e,d){var b=this;if(d in b)if(a.isVariable(b[d]))b[d](e);else b[d]=a.variableOf(e);else if(c)b[d]=a.variable(e)}));return this},d=function(){this.fromObject(this._p_)};a.model=function(g,h){g=a.modelOf(g);var f={},i;a.eachProp(g,function(b,c){f[c]=a.variable(b,f,h)});f._isModel_=b;f._p_=g;f.toObject=e;f.fromObject=c;f.toDefault=d;return f}})(bingo);(function(a){"use strict";var b=a.Class(function(){var c=true,b=false,e=function(l,i,j,m,k,h){h||(h=50);var o=a.isFunction(i),n=function(){var b;if(o)b=i.call(e);else{var c=l._view;b=a.datavalue(c,i);if(a.isUndefined(b))b=a.datavalue(window,i)}return a.isModel(b)?a.modelOf(b):b},g=n(),e={_callback:j,dispose:d,_priority:h};if(a.isVariable(g)){e.check=f;e.isChange=b;var p=l._view;e.varo=g;g.$subs(function(a){j.call(e,a);l.publishAsync()},k||p,h)}else{if(m)g=a.clone(g);e.check=function(){if(k&&k.isDisposed){e.dispose&&e.dispose();return}var d=n(),f=m?!a.equals(d,g):d!=g;if(f){g=m?a.clone(d):d;j.call(this,d);return c}return b}}return e},f=function(){return b},d=function(){a.clearObject(this)};this.Define({unSubscribe:function(e){var d=this;if(arguments.length>0)d._subscribes=a.linq(d._subscribes).where(function(){if(this._callback==e){this.dispose();return b}else return c}).toArray();else{a.each(d._subscribes,function(){this.dispose()});d._subscribes=[]}return d},subscribe:function(h,d,i,f,g){var b=this,c=e(b,h,d,i,f,g);b._subscribes.push(c);b._subscribes=a.linq(b._subscribes).sortDesc("_priority").toArray();return c},publish:function(){var a=this;a._publishTime=0;a._publish&&a._publish();return a},publishAsync:function(){var a=this;if(!a._pbAsync_){var b=a;a._pbAsync_=setTimeout(function(){b._pbAsync_=null;b.publish()},5)}return a},_publishTime:0,_publish:function(){var d=this,e=b,g=b;a.each(d._subscribes,function(){if(!this.check){g=c;return}if(this.check())e=c});if(g)d._subscribes=a.linq(d._subscribes).where(function(){return this.check}).toArray();if(e){if(d._publishTime<10){d._publishTime++;var f=d;setTimeout(function(){f.isDisposed||f._publish()},5)}}else d._publishTime=0}});this.Initialization(function(c){var b=this;b._view=c,b._subscribes=[];b.disposeByOther(c);b.onDispose(function(){a.each(this._subscribes,function(){this.dispose()})})})});a.observer=function(a){return a&&(a.__observer__||(a.__observer__=b.NewObject(a)))};a.observer.observerClass=b})(bingo);(function(a){var b=null;"use strict";a.ajax=function(b,a){return e.NewObject(b).view(a)};a.ajaxSync=function(b){return c.NewObject().view(b).dependent(a.noop)};a.ajaxSyncAll=function(b,a){return f(b,a)};var d=a.ajax.ajaxBaseClass=a.Class(function(){var a=function(a,b){return function(e,d,c){(e==a||a=="alway")&&b.apply(c,d)}};this.Define({view:function(a){if(arguments.length==0)return this._view;this._view=a;return this},_callbacks:function(){this._calls||(this._calls=$.Callbacks("stopOnFalse"));return this._calls},_reject:function(a){this._calls&&this._callbacks().fire("fail",a||[],this)},_resolve:function(a){this._calls&&this._callbacks().fire("done",a||[],this)},success:function(b){b&&this._callbacks().add(a("done",b));return this},error:function(b){b&&this._callbacks().add(a("fail",b));return this},alway:function(b){b&&this._callbacks().add(a("alway",b));return this},fromOther:function(b){var a=this;if(b instanceof d){a._view=b._view;a._calls=b._calls;var c=b.$prop();a.$prop(c)}return a}})}),e=a.ajax.ajaxClass=a.Class(d,function(){var f=false,d=true,h=this;h.Static({holdServer:function(d,b,a,c){return[b,a,c]}});var g=function(a){if(a.isDisposed)return;setTimeout(function(){a.dispose()},1)},i=function(c,r){var i=c.view();if(c.isDisposed||i&&i.isDisposed){g(c);return}var n=c.holdParams(),m=a.clone(n?n.call(c):c.param()||{}),q=c.holdServer()||e.holdServer,l=b,j=c.url(),h="",o=c.cacheTo();if(o){h=c.cacheQurey()?j:j.split("?")[0];if(!a.equals(m,{}))h=[h,window.JSON?JSON.stringify(m):$.getJSON(m)].join("_");h=h.toLowerCase();l=a.cacheToObject(o).max(c.cacheMax()).key(h);if(l.has()){var k=l.get();if(a.isObject(k))k=a.clone(k);c.isCacheData=d;if(c.async())setTimeout(function(){if(!c.isDisposed){i&&i.isDisposed||c._resolve([k]);g(c)}});else c._resolve([k]);g(c);return}}var p=function(b,e,j){if(!c.isDisposed){if(!(i&&i.isDisposed))try{var k=q(c,b,e,j);b=k[0],e=k[1],j=k[2];if(e===d){l&&l.key(h).set(b);c._resolve([b])}else c._reject([b,f,j])}catch(m){a.trace(m)}g(c)}};if(!a.supportWorkspace&&!a.isNullEmpty(a.prdtVersion))j=[j,j.indexOf("?")>=0?"&":"?","_version_=",a.prdtVersion].join("");$.ajax({type:r,url:j,data:m,async:c.async(),cache:c._ajaxCache(),dataType:c.dataType(),success:function(a,c,b){p(a,d,b)},error:function(b,c,a){p(a,f,b)}})};h.Prop({url:{$set:function(b){this.value=a.route(b)}},async:d,dataType:"json",_ajaxCache:f,param:{},cacheTo:b,cacheMax:-1,cacheQurey:d,holdServer:b,holdParams:b});h.Define({isCacheData:f,addToAjaxSync:function(a){a||(a=c.lastSync(this.view()));a&&a.dependent(this);return this},post:function(){var b=this;b.async()&&b.addToAjaxSync();i(b,"post");b.post=a.noop;return b},"get":function(){var b=this;b.async()&&b.addToAjaxSync();i(b,"get");b.get=a.noop;return b}});h.Initialization(function(a){this.url(a)})}),c=a.ajax.ajaxaSyncClass=a.Class(d,function(){this.Static({_syncList:[],getSyncList:function(a){return a&&a.__syncList_&&(a.__syncList_=[])||this._syncList},lastSync:function(d){var a=this.getSyncList(d),c=a.length;return c>0?a[c-1]:b}});this.Define({resolve:function(){this._count=0;this._resolve();this.dispose()},reject:function(){this._count=0;this._reject();this.dispose()},dependent:function(c){var b=this;b.addCount();var d=b;if(a.isFunction(c))try{c.call(b);setTimeout(function(){!d.isDisposed&&d.decCount()},1)}catch(e){a.trace(e);b.reject()}else{b.view()||c.view()||c.view(b.view());c.view()||b.view()||b.view(c.view());c.error(function(){setTimeout(function(){!d.isDisposed&&d.reject()},1)}).success(function(){setTimeout(function(){!d.isDisposed&&d.decCount()},1)})}return b},_count:0,addCount:function(a){this._count+=arguments.length==0?1:a;return this},decCount:function(){this._count--;this._checkResolve();return this},_checkResolve:function(){this._count<=0&&this.resolve()}})}),f=function(g,d){if(!g)return b;var f=c.getSyncList(d),e=c.lastSync(d),a=c.NewObject();e&&e.dependent(a);f.push(a);a.view(d).dependent(g);f.pop();return a}})(bingo);(function(b,f){var h="bingo_cmpwith_",d=false,e=true,a=null,c="";"use strict";b.extend({compile:function(a){return m.NewObject().view(a)},tmpl:function(b,a){return n.NewObject(b).view(a)},_startMvc:function(){b.using(function(){var a=b.rootView(),c=a.$node();a.onReadyAll(function(){b.__readyE.end()});b.compile(a).fromNode(c).compile()},b.usingPriority.NormalAfter)},__readyE:b.Event(),ready:function(a){this.__readyE.on(a)}});var o=b.compile.injectTmplWithDataIndex=function(e,d,b){var a="<!--bingo_cmpwith_";return[a,d,"-->",e,a,b,"-->"].join(c)};b.compile.getNodeContentTmpl=function(e){var d=f(e),b=c,a=d.children();if(a.size()===1&&a.is("script"))b=a.html();else b=d.html();return b};var j=a,i=b.compile.removeNode=function(a){j.append(a);j.html(c)},g={compiledAttrName:["_bg_cpl",b.makeAutoId()].join("_"),isCompileNode:function(a){return a[this.compiledAttrName]=="1"},setCompileNode:function(a){a[this.compiledAttrName]="1"},_makeCommand:function(i,f,g,h){var a=i;!b.isNullEmpty(a.tmplUrl)&&b.tmpl(a.tmplUrl,f).cacheQurey(e).async(d).success(function(b){a.tmpl=b}).get();a.compilePre&&b.factory(a.compilePre).view(f).node(g).inject();if(a.as){var c=b.factory(a.as).view(f).node(g).inject();if(c&&c.length>0)h.list=(h.list||[]).concat(c)}return a},newTraverseParams:function(){return{node:a,parentViewnode:a,view:a,data:a,withData:a,action:a,withDataList:a}},traverseNodes:function(d){var e=this,c=d.node;if(c.nodeType===1){if(!e.isCompileNode(c)){e.setCompileNode(c);if(!e.analyzeNode(c,d))return}var f=c.firstChild;if(f){var g=[];do g.push(f);while(f=f.nextSibling);e.traverseChildrenNodes(g,d)}}else if(c.nodeType===3)if(!d.parentViewnode._isCompileText(c)){var h=b.view;d.parentViewnode._setCompileText(c);var i=c.nodeValue;h.textTagClass.hasTag(i)&&h.textTagClass.NewObject(d.view,d.parentViewnode,c,c.nodeName,i,d.withData)}c=d=a},traverseChildrenNodes:function(m,c){for(var f=[],g=[],k=c.withDataList,l=c.withData,a,n=b.clone(c,d,e),h=-1,j=0,o=m.length;j<o;j++){a=m[j];if(this.isComment(a))g.push(a);else{h=k?this.getTmplWithdataIndex(a):-1;if(h==-1){if(a.nodeType===1||a.nodeType===3){c.node=a,c.withData=l;this.traverseNodes(c);c=b.clone(n,d,e)}}else{l=c.withData=k[h];f.push(a)}}}(g.length>0||f.length>0)&&i(g.concat(f))},commentTest:/^\s*#/,isComment:function(a){return a.nodeType==8&&this.commentTest.test(a.nodeValue)},getTmplWithdataIndex:function(e){if(e.nodeType==8){var a=e.nodeValue;if(!b.isNullEmpty(a)&&a.indexOf(h)>=0){var d=parseInt(a.replace(h,c),10);return d<0?-2:d}}return-1},isTmplWithdataNode:function(c){if(c.nodeType==8){var a=c.nodeValue;return!b.isNullEmpty(a)&&a.indexOf(h)>=0}return d},checkTmplWithdataNode:function(c){var b=[],a=[];c.each(function(){if(g.isTmplWithdataNode(this))a.push(this);else b.push(this)});a.length>0&&i(a);return f(b)},analyzeNode:function(k,h){var z="[bg-include]",l="bg-include",v=k.tagName,j=a;if(b.isNullEmpty(v))return d;v=v.toLowerCase();var F=h.view.$getModule();j=F.command(v);var o=[],C=[],s=e,w=a,y=d,u=d,t=d,J=v=="script";if(J)s=d;var E=function(b,a,c,e,d){y=a.replace;u=a.include;w=a.tmpl;t||(t=a.view);!s||(s=a.compileChild);b.push({aName:c,aVal:e,type:d,command:a})},B={},A=[],r=a,m=a;if(j){j=g._makeCommand(j,h.view,k,B);E(o,j,v,c,"node")}else{var x=k.attributes;if(x&&x.length>0){var n=a,G;do{G=x.length;for(var I=0,Q=G;I<Q;I++){n=x[I];m=n&&n.nodeName;if(b.inArray(m,A)<0){A.push(m);r=n&&n.nodeValue;if(J&&m=="type")m=r;j=F.command(m);if(j){j=g._makeCommand(j,h.view,k,B);if(j.compilePre)r=n&&n.nodeValue;E(o,j,m,r,"attr");if(y||u)break}else if(r)b.view.textTagClass.hasTag(r)&&C.push({node:n,aName:m,aVal:r})}}}while(G!=x.length)}}B.list&&b.each(B.list,function(){var a=this.name;if(b.inArray(a,A)<0){A.push(a);j=F.command(a);E(o,j,a,this.value,"attr");if(y||u)return d}});var p=a,q=b.view;if(o.length>0)if(y||u){var H=f(k);if(!b.isNullEmpty(w)){var D=f(f.parseHTML(w));u&&w.indexOf(l)>=0&&D.find(z).add(D.filter(z)).each(function(){var a=f(this);if(b.isNullEmpty(a.attr(l))){var c=H.clone(d);g.setCompileNode(c[0]);a.removeAttr(l);a.append(c)}});var O=h.view,L=h.parentViewnode,P=b.clone(h,d,e);D.each(function(){var c=this;if(c.nodeType===1){if(t){h.view=q.viewClass.NewObject(c,O);if(h.action){h.view.$addAction(h.action);h.action=a}h.withData=a}p=q.viewnodeClass.NewObject(h.view,c,t?a:L,h.withData);h.parentViewnode=p;var f=o[o.length-1];q.viewnodeAttrClass.NewObject(h.view,p,f.type,f.aName,f.aVal,f.command)}if(s){h.node=c;g.traverseNodes(h)}h=b.clone(P,d,e)}).insertBefore(H)}i(H);s=d}else{!b.isNullEmpty(w)&&f(k).html(w);if(t){h.view=q.viewClass.NewObject(k,h.view);if(h.action){h.view.$addAction(h.action);h.action=a}h.withData=a}var K=h.parentViewnode;p=q.viewnodeClass.NewObject(h.view,k,t?a:K,h.withData);h.parentViewnode=p;var M=a;b.each(o,function(){var a=this;M=q.viewnodeAttrClass.NewObject(h.view,p,a.type,a.aName,a.aVal,a.command)})}if(!(y||u)&&C.length>0){var N=a;b.each(C,function(){N=q.textTagClass.NewObject(h.view,p||h.parentViewnode,this.node,this.aName,this.aVal,a,k)})}return s}},n=b.compile.tmplClass=b.Class(b.ajax.ajaxClass,function(){var a=b.ajax.ajaxClass.prototype,c={};this.Define({_initAjax:function(){var a=this;if(a._init_tmpl_===e)return;a._init_tmpl_=e;var d=a.view();d&&!d.isDisposed&&d._addReadyDep();a.onDispose(function(){d&&!d.isDisposed&&d._decReadyDep()}).dataType("text");b.compile.tmplCacheMetas.test(a.url())&&a.cacheTo(a.cacheTo()||c).cacheMax(a.cacheMax()<=0?350:a.cacheMax());a._ajaxCache(b.supportWorkspace)},"get":function(){this._initAjax();a["get"].call(this)},post:function(){this._initAjax();a.post.call(this)}});this.Initialization(function(a){this.base(a)})});b.compile.tmplCacheMetas=/\.(htm|html|tmpl|txt)(\?.*)*$/i;var m=b.compile.templateClass=b.Class(function(){var i="compiled",h="compilePre",j=function(e,b,f,c,d){g.traverseChildrenNodes(e,{node:a,parentViewnode:b,view:f,withData:a,action:d,withDataList:c})},k={};this.Static({cacheMax:100});this.Prop({action:a,async:e,fromUrl:c,withData:a,withDataList:a,stop:d,view:a});this.Define({fromJquery:function(a){this._jo=f(a);return this},appendTo:function(a){this._parentNode=f(a)[0];return this},fromNode:function(a){return this.fromJquery(a)},fromHtml:function(a){return this.fromJquery(f.parseHTML(a,e))},_isEnd:function(){var a=this;return a.isDisposed||a.stop()||a.view()&&a.view().isDisposed},onCompilePre:function(a){return this.on(h,a)},onCompiled:function(a){return this.on(i,a)},_compile:function(){var a=this,c=a._jo,f=a._parentNode||c&&c.parent()[0];if(!f)return;var l=!a._parentNode;try{a.trigger(h,[c]);var d=a.view(),e=b.view.viewnodeClass.getViewnode(f);if(d){if(e.view()!=d)e=d.$viewnode()}else d=b.view(f)||e.view();var n=a.withData(),k=a.withDataList(),m=a.action();j(c,e,d,k,m);k&&k.length>0&&(c=g.checkTmplWithdataNode(c));!l&&c.appendTo(f);d._handel()}catch(o){b.trace(o)}a.trigger(i,[c]);a.dispose()},compile:function(){var a=this;if(a._isEnd())return a;if(a._jo)a._compile();else if(a._parentNode&&a.fromUrl()){var c=a,d=a.view();b.tmpl(a.fromUrl(),d).success(function(a){if(c._isEnd())return;c.fromHtml(a).compile()}).async(a.async()).onDispose(function(){c.dispose()}).get()}return a}})}),k=b.compile.bindClass=b.Class(function(){var f={_cacheName:"__contextFun__",resetContextFun:function(a){a[f._cacheName]={}},evalScriptContextFun:function(j,a,m,l,i){a=a!==d;var e=["content",a].join("_"),g=j[f._cacheName];if(g[e])return g[e];var k=j.$attrValue();try{var h=[a?"return ":c,k,";"].join(c);return g[e]=new Function("$view","node","$withData","bingo",["with ($view) {",i?"with ($withData) {":c,"return bingo.proxy(node, function (event) {",a?["try {",h,"} catch (e) {","if (bingo.isDebug) bingo.trace(e);","}"].join(c):h,"});",i?"}":c,"}"].join(c))(m,l,i,b)}catch(n){console.warn(["evalScriptContextFun: ",h].join(c));b.trace(n);return j[e]=function(){return k}}}};this.Prop({view:a,node:a,viewnode:a,_filter:{$get:function(){var a=this,e=a.value;if(!b.isNullEmpty(e)){a.value=c;var d=a.owner;a.filter=b.filter.createFilter(e,d.view(),d.node(),d.getWithData())}return a.filter}},$attrValue:{$get:function(){var a=this.owner._filter();return a?a.content:this.value},$set:function(a){if(this.value!=a){this.value=a;var b=this.owner;b._filter(a);f.resetContextFun(b)}}}});this.Define({$eval:function(c){var a=this,b=a.getWithData(),e=f.evalScriptContextFun(a,d,a.view(),a.node(),b);return e(c)},$resultsNoFilter:function(c){var a=this,b=a.getWithData(),d=f.evalScriptContextFun(a,e,a.view(),a.node(),b);return d(c)},$results:function(a){var b=this.$resultsNoFilter(a);return this.$filter(b)},$getValNoFilter:function(){var e=this.$attrValue(),d=e,a=this.getWithData(),c;if(a)c=b.datavalue(a,d);if(b.isUndefined(c)){a=this.view();c=b.datavalue(a,d)}if(b.isUndefined(c)){a=window;c=b.datavalue(a,d)}return c},$value:function(f){var c=this,g=c.$attrValue(),e=g,d=c.getWithData(),a;if(d)a=b.datavalue(d,e);if(b.isUndefined(a)){d=c.view();a=b.datavalue(d,e)}if(b.isUndefined(a)){d=window;a=b.datavalue(d,e)}if(arguments.length>0){if(b.isVariable(a))a(f);else if(b.isUndefined(a))b.datavalue(c.getWithData()||c.view(),e,f);else b.datavalue(d,e,f);return c}else return c.$filter(a)},$filter:function(a){var b=this._filter();return b?b.filter(a):a},getWithData:function(){return this._withData}});this.Initialization(function(e,d,b,c){var a=this;a._withData=c;a.view(e).node(d);a.content=b;a.$attrValue(b)})});b.compile.bind=function(d,c,b,a){return k.NewObject(d,c,b,a)};var l=b.compile.nodeBindClass=b.Class(b.linkToDom.LinkToDomClass,function(){this.Define({$getAttr:function(f){var d=this;if(!b.hasOwnProp(d._attrs,f)){var e=d.node().attributes[f];e=e?e.nodeValue:c;d._attrs[f]=!b.isNullEmpty(e)?k.NewObject(d.view(),d.node(),e,d.withData()):a}return d._attrs[f]},$attrValue:function(d,e){var a=this;if(arguments.length==1){var b=a.node().attributes[d];return b?a.$getAttr(d).$attrValue():c}else{var b=a.$getAttr(d);b&&b.$attrValue(e);return a}},$eval:function(c,b){var a=this.$getAttr(c);return a&&a.$eval(b)},$results:function(c,b){var a=this.$getAttr(c);return a&&a.$results(b)},$value:function(c,b){var a=this.$getAttr(c);if(!a)return;if(arguments.length==1)return a.$value();else{a.$value(b);return this}}});this.Prop({view:a,node:a,withData:a});this.Initialization(function(e,c,d){var a=this;a.base();a.withData(d).view(e).node(c);a.linkToDom(c);a._attrs={};a.onDispose(function(){var a=this._attrs;b.eachProp(a,function(a){a.dispose&&a.dispose()})})})});b.compile.bindNode=function(c,b,a){return l.NewObject(c,b,a)};f(function(){j=f("<div></div>");b._startMvc()})})(bingo,window.jQuery);(function(a){var d=false,c=true,b=null;"use strict";a.view=function(d){var c=$(d);if(c.size()==0)return b;else{var a=e.getViewnode(c[0]);return a?a.view():b}};var g=b;a.rootView=function(){return g};var j=a.view.viewClass=a.Class(a.linkToDom.LinkToDomClass,function(){var h="_readyAll_",f="_initdata_",g="_initdatasrv_",i="_actionBefore_";this.Define({_setParent:function(a){if(a){this.$parentView(a);a._addChild(this)}},_addChild:function(a){this.$children.push(a)},_removeChild:function(c){var b=this.$children;b=a.removeArrayItem(c,b);this.$children=b},_compile:function(){var a=this.$viewnode();!a.isDisposed&&a._compile()},_action:function(){var b=this,e=b;if(b._actions.length>0){b.end(i);var f=b._actions;b._actions=[];a.each(f,function(){a.factory(this).view(e).inject()})}var d=b.$viewnode();!d.isDisposed&&d._action();if(!b.isDisposed&&b._isReadyDec_!==c){b._isReadyDec_=c;setTimeout(function(){e._decReadyDep()},10)}},_link:function(){var a=this.$viewnode();!a.isDisposed&&a._link()},_handel:function(){var a=this;a._action();a._compile();a._link();a._handleChild()},_handleChild:function(){a.each(this.$children,function(){!this.isDisposed&&this._handel()})},$isReady:d,_sendReady:function(){this._sendReady=a.noop;var b=this;a.ajaxSyncAll(function(){b.end(g)},this).alway(function(){a.ajaxSyncAll(function(){b.end(f)},b).alway(function(){b.end("_ready_");b.$isReady=c;b._decReadyParentDep();b.$update()})})},onActionBefore:function(a){return this.on(i,a)},onInitDataSrv:function(a){return this.on(g,a)},onInitData:function(a){return this.on(f,a)},onReady:function(a){return this.on("_ready_",a)},onReadyAll:function(a){return this.on(h,a)},_addReadyDep:function(){var b=this,c=b.__readySync;if(!c)c=b.__readySync=a.ajaxSync(b).success(a.proxy(b,function(){if(this.isDisposed)return;this._sendReady()}));!c.isDisposed&&c.addCount();return b},_decReadyDep:function(){var a=this.__readySync;a&&!a.isDisposed&&a.decCount();return this},_addReadyParentDep:function(){var b=this,c=b.__readyParentSync;if(!c)c=b.__readyParentSync=a.ajaxSync(b).success(a.proxy(b,function(){if(this.isDisposed)return;this.end(h);var a=this.$parentView();a&&a.disposeStatus==0&&a._decReadyParentDep()}));!c.isDisposed&&c.addCount();return b},_decReadyParentDep:function(){var a=this.__readyParentSync;a&&!a.isDisposed&&a.decCount();return this},$setModule:function(a){a&&(this._module=a);return this},$getModule:function(){return this._module||a.defaultModule(this.$getApp())},$setApp:function(a){a&&(this._app=a);return this},$getApp:function(){return this._app||(this._module?this._module.app:a.defaultApp())},$addAction:function(a){a&&this._actions.push(a);return this},$getViewnode:function(a){return e.getViewnode(a||this.$node())},$getNode:function(a){var b=this.__$node||(this.__$node=$(this.$node()));return a?b.find(a):b},$update:function(){return this.$publish()},$updateAsync:function(){this.$isReady===c&&this.$observer().publishAsync();return this},$apply:function(b,c){var a=this;if(b){a.$update();b.apply(c||a);a.$updateAsync()}return a},$proxy:function(b,c){var a=this;return function(){a.$update();b.apply(c||this,arguments);a.$updateAsync()}},$publish:function(){this.$isReady&&this.$observer().publish();return this},$observer:function(){return a.observer(this)},$subscribe:function(e,a,d,b,c){return this.$observer().subscribe(e,a,d,b,c)},$subs:function(){return this.$subscribe.apply(this,arguments)},$using:function(d,b){this._addReadyDep();var c=this;a.using(d,function(){if(c.isDisposed)return;b&&b();c._decReadyDep()},a.usingPriority.NormalAfter);return this},$timeout:function(a,c){this._addReadyDep();var b=this;return setTimeout(function(){if(!b.isDisposed){a&&a();b.$updateAsync()._decReadyDep()}},c||1)}});this.Prop({$parentView:b,$node:b,$viewnode:b});this.Initialization(function(e,d){var c=this;c.base();c.linkToDom(e);a.extend(c,{$children:[],_module:b,_app:b,_actions:[]});c.$node(e);if(d){c._setParent(d);d._addReadyParentDep()}c._addReadyDep();c._addReadyParentDep();c.onDispose(function(){var b=this,c=b.$parentView();c&&c.disposeStatus==0&&c._removeChild(b);if(!b.isDisposeFormDom){!b.$viewnode().isDisposed&&b.$viewnode().dispose();a.each(b.$children,function(a){a&&a.dispose()})}})})}),e=a.view.viewnodeClass=a.Class(a.linkToDom.LinkToDomClass,function(){var f=this;f.Static({vnName:["bg_cpl_node",a.makeAutoId()].join("_"),vnDataName:["bg_domnode",a.makeAutoId()].join("_"),getViewnode:function(a){return a?this.isViewnode(a)?$(a).data(this.vnDataName):this.getViewnode(a.parentNode||document.documentElement):b},setViewnode:function(a,b){a[this.vnName]="1";$(a).data(this.vnDataName,b)},removeViewnode:function(b){var a=b.node;a[this.vnName]=="0";$(a).removeData(this.vnDataName)},isViewnode:function(a){return a[this.vnName]=="1"}});f.Define({_setParent:function(b){var a=this;if(b){a.parentViewnode(b);b._addChild(a)}else a.view().$viewnode(a)},_addChild:function(a){this.children.push(a)},_removeChild:function(c){var b=this.children;b=a.removeArrayItem(c,b);this.children=b},_sortAttrs:function(){if(this.attrList.length>1)this.attrList=a.linq(this.attrList).sortDesc("_priority").toArray()},_compile:function(){var b=this;if(!b._isCompiled){b._isCompiled=c;b._sortAttrs();a.each(b.attrList,function(){!this.isDisposed&&this._compile()})}a.each(b.children,function(){!this.isDisposed&&this._compile()});b._resetCmpText()},_action:function(){var b=this;if(!b._isAction){b._isAction=c;a.each(b.attrList,function(){!this.isDisposed&&this._action()})}a.each(b.children,function(){!this.isDisposed&&this._action()})},_link:function(){var b=this;if(!b._isLinked){b._isLinked=c;a.each(b.attrList,function(){!this.isDisposed&&this._link()})}a.each(b.textList,function(){!this.isDisposed&&this._link()});a.each(b.children,function(){!this.isDisposed&&this._link()})},$getAttr:function(c){c=c.toLowerCase();var e=b;a.each(this.attrList,function(){if(this.attrName==c){e=this;return d}});return e},$html:function(c){var b=this.node();if(arguments.length>0){$(b).html("");a.compile(this.view()).fromHtml(c).appendTo(b).compile();return this}else return $(b).html()},getWithData:function(){return this._withData},_isCompileText:function(b){return b?a.inArray(b,this._textNodes)>=0:d},_setCompileText:function(a){this._textNodes.push(a)},_rmCompileText:function(b){this._textNodes=a.removeArrayItem(b,this._textNodes)},_resetCmpText:function(){this._textNodes=a.linq(this._textNodes).where(function(){return!h(this)}).toArray();var b=a.rootView().$viewnode();this!=b&&b._resetCmpText()}});f.Prop({view:b,node:b,parentViewnode:b});f.Initialization(function(h,f,c,g){var b=this;b.base();b.linkToDom(f);e.setViewnode(f,b);a.extend(b,{attrList:[],textList:[],children:[],_isCompiled:d,_isLinked:d,_isAction:d,_textNodes:[]});b._withData=g||c&&c.getWithData();b.view(h).node(f)._setParent(c);b.onDispose(function(){var b=this;if(!b.isDisposeFormDom){e.removeViewnode(b);a.each(b.children,function(a){a&&a.dispose()})}a.each(b.attrList,function(a){a&&a.dispose()});a.each(b.textList,function(a){a&&a.dispose()});var c=b.parentViewnode();if(c)c.disposeStatus==0&&c._removeChild(b);b.attrList=b.children=b.textList=b._textNodes=[]})})}),i=a.view.viewnodeAttrClass=a.Class(a.compile.bindClass,function(){var e="onChange";this.Define({_priority:50,_compile:function(){var c=this.command,b=c.compile;b&&a.factory(b).viewnodeAttr(this).widthData(this.getWithData()).inject()},_action:function(){var c=this.command,b=c.action;b&&a.factory(b).viewnodeAttr(this).widthData(this.getWithData()).inject()},_link:function(){var b=this,d=b.command,c=d.link;c&&a.factory(c).viewnodeAttr(b).widthData(b.getWithData()).inject();b._init()},onChange:function(a){return this.on(e,a)},onInit:function(a){return this.on("onInit",a)},$subs:function(c,b,f){var a=this;if(arguments.length==1){b=c;var d=a;c=function(){return d.$results()}}var g=b,d=a;b=function(a){var b=g.apply(this,arguments);d.trigger(e,[a]);return b};a.view().$subs(c,b,f,a,100);return a},$subsResults:function(c,e){var b=d;return this.$subs(a.proxy(this,function(){var c=this.$resultsNoFilter();b=a.isVariable(c);return b?c:this.$filter(c)}),a.proxy(this,function(a){c&&c.call(this,b?this.$filter(a):a)}),e)},$subsValue:function(c,e){var b=d;return this.$subs(a.proxy(this,function(){var c=this.$getValNoFilter();b=a.isVariable(c);return b?c:this.$filter(c)}),a.proxy(this,function(a){c&&c.call(this,b?this.$filter(a):a)}),e)},_init:function(){var d=this;d.__isinit=c;var f=d.__initParam;if(f){var g=f.p,h=f.p1;d.__initParam=b;var e=a.isFunction(g)?g.call(d):g;e=a.variableOf(e);h.call(d,e);d.trigger("onInit",[e])}},$init:function(b,c){var a=this;if(arguments.length==1){c=b;var d=a;b=function(){return d.$results()}}a.__initParam={p:b,p1:c};a.__isinit&&a._init();return a},$initResults:function(b){return this.$init(a.proxy(this,function(){return this.$results()}),b)},$initValue:function(b){return this.$init(a.proxy(this,function(){return this.$value()}),b)}});this.Initialization(function(g,b,f,e,d,c){var a=this;a.base(g,b.node(),d,b.getWithData());a.viewnode(b);b.attrList.push(a);a.type=f;a.attrName=e.toLowerCase();a.command=c;a._priority=c.priority||50})}),h=function(a){try{return!a||!a.parentNode||!a.parentNode.parentNode||!a.parentNode.parentElement}catch(b){return c}},f=a.view.textTagClass=a.Class(function(){var e=this;e.Static({_regex:/\{\{(.+?)\}\}/gi,_regexRead:/^\s*:\s*/,hasTag:function(a){this._regex.lastIndex=0;return this._regex.test(a)}});e.Define({_link:function(){var e=this;if(!e._isLinked){e._isLinked=c;var n=e.attrValue,i=[],h=e,j=e.node(),s=j.nodeType,u=e.attrName,l=e.view(),r=e.parentNode(),k=d,g=b,o=function(a){if(s!=3)j.nodeValue=a;else{m();g=$.parseHTML(a);$(g).insertAfter(j)}},m=function(){g&&a.compile.removeNode(g);g=b},p=n.replace(f._regex,function(g,b){var d={};if(f._regexRead.test(b))b=b.replace(f._regexRead,"");else k=c;var e=a.compile.bind(l,j,b,h.getWithData());d.text=g,d.context=e;i.push(d);var m=e.$results();return d.value=a.toStr(a.variableOf(m))});o(p);p="";if(k){a.each(i,function(b){var c=b.context,e=b.text;l.$subs(function(){return h._isRemvoe()?a.makeAutoId():c.$results()},function(c){if(h._isRemvoe()){h.dispose();return}b.value=a.toStr(c);q()},d,h,100)});var q=function(){var b=n;a.each(i,function(a){var d=a.text,c=a.value;b=b.replace(d,c)});o(b)}}var t=function(){m();a.each(i,function(a){a.context&&a.context.dispose()});i=b};e.onDispose(function(){h=g=j=l=r=b;t()});!k&&setTimeout(a.proxy(e,function(){this.dispose()}),1)}},_isRemvoe:function(){var a=this,b=a.node&&a.node();return a.isDisposed||h(a.parentNode()||b)},getWithData:function(){return this._withData}});e.Prop({view:b,node:b,parentNode:b,viewnode:b});e.Initialization(function(i,c,e,d,g,h,f){var b=this;b._withData=h||c.getWithData();b.view(i).viewnode(c).node(e).parentNode(f);c.textList.push(b);b.attrName=d&&d.toLowerCase();b.attrValue=g;e.nodeValue="";b.onDispose(function(){var c=this;if(c.node().nodeType==3){var b=c.viewnode();if(b&&b.disposeStatus==0){b.textList=a.removeArrayItem(c,b.textList);b._rmCompileText(c.node())}}})})});(function(){var d=document.documentElement,c=a.view;g=c.viewClass.NewObject(d);c.viewnodeClass.NewObject(g,d,b,b)})()})(bingo);(function(a){"use strict";a.filter.createFilter=function(c,e,d,a){return b.createFilter(c,e,d,a)};a.filter.regex=/[|]+[ ]?([^|]+)/g;var b={hasFilter:function(b){a.filter.regex.lastIndex=0;return a.filter.regex.test(b)},removerFilterString:function(b){if(a.isNullEmpty(b)||!this.hasFilter(b))return b;a.filter.regex.lastIndex=0;var c=b.replace(a.filter.regex,function(a){return a.indexOf("||")==0?a:""});return a.trim(c)},getFilterStringList:function(b){if(a.isNullEmpty(b)||!this.hasFilter(b))return[];var c=[];a.filter.regex.lastIndex=0;b.replace(a.filter.regex,function(b,a){b.indexOf("||")!=0&&c.push(a)});return c},getScriptContextFun:function(f,e,j,i,d){var b=f._ca||(f._ca={}),c="cont";if(b[c])return b[c];var h=["{",e,"}"].join(""),g=["return ",h,";"].join("");try{return b[c]=new Function("$view","$node","$withData","bingo",["with ($view) {",d?"with ($withData) {":"","return function ($data) {","try {",g,"} catch (e) {","if (bingo.isDebug) bingo.trace(e);","}","};",d?"}":"","}"].join(""))(j,i,d,a)}catch(k){a.trace(k);return b[c]=function(){return e}}},hasFilterParam:function(a){return a.indexOf(":")>=0},getFilterParamName:function(c){var b=c.split(":");return a.trim(b[0])},getFilterByView:function(c,b){return c?c.$getModule(b).filter(b):a.filter(b)},paramFn:function(f,c,e,d,a){return b.getScriptContextFun(f,c,e,d,a)},getFilterObjList:function(c,d,h,g){var e=this.getFilterStringList(h);if(e.length==0)return[];var f=[];a.each(e,function(j){var e=null;j=a.trim(j);if(a.isNullEmpty(j))return;var i={name:e,paramFn:e,fitlerFn:e},h=e;if(b.hasFilterParam(j)){i.name=b.getFilterParamName(j);h=b.getFilterByView(c,i.name);if(!h)return;h=c?a.factory(h).view(c).node(d).inject():h();i.paramFn=b.paramFn(i,j,c,d,g)}else{i.name=j;h=b.getFilterByView(c,i.name);if(!h)return;h=c?a.factory(h).view(c).node(d).inject():h()}i.fitlerFn=h;i.fitlerVal=function(c){var a=this;if(!a.fitlerFn)return c;var b=e;if(a.paramFn){b=a.paramFn(c);b&&(b=b[a.name])}return a.fitlerFn(c,b)};f.push(i)});return f},createFilter:function(d,h,g,f){var c={contentOrg:d},e=b.hasFilter(d);c._filters=e?b.getFilterObjList(h,g,d,f):[];c.content=b.removerFilterString(d);c.contentFT=d.replace(c.content,"");if(c._filters.length>0)c.filter=function(c){var b=a.variableOf(c);a.each(this._filters,function(){b=this.fitlerVal(b)});return b};else c.filter=function(a){return a};return c}}})(bingo);(function(a){var d=false,c=true,b=null;"use strict";a.render=function(d,f,e){a.render.regex.lastIndex=0;i.lastIndex=0;d=d.replace(i,"");var c=a.render.regex.test(d)?o(d,f,e):b;c&&(c=h(c));return{render:function(i,h,g,b,a){return!c?d:j(c,f,e,i,h,g,b,a)}}};a.render.regex=/\{\{\s*(\/?)(\:|if|else|for|tmpl|header|footer|empty|loading)(.*?)\}\}/g;var g=/[ ]*([^ ]+)[ ]+in[ ]+(?:(.+)[ ]+tmpl[ ]*=[ ]*(.+)[/]|(.+))*/g,m=/\/\s*$/,i=/<!--\s*\#(?:.|\n)*?-->/g,f=function(e,r,n,o,f,h,m,l,i){var d={isIf:r===c,ifReturn:c,isElse:m===c,isForeach:l===c,isEnd:n===c,isTag:o===c,role:a.isUndefined(i)?0:i,content:e,forParam:b,filterContext:b,fn:a.noop,flt:b,children:[]};if(d.isTag)if(!d.isEnd){d.filterContext=e;if(d.isForeach){var p=d.content;g.lastIndex=0;p.replace(g,function(){var c=d.forParam={};c.itemName=arguments[1];var b=arguments[2];c.tmpl=a.trim(arguments[3]);if(a.isNullEmpty(b))b=arguments[4];b=a.trim(b);var e=a.filter.createFilter(b,f,h);d.content=e.content;d.flt=e;c.dataName=d.content=e.content})}else{var j=a.filter.createFilter(e,f,h);d.content=j.content;d.flt=j}var q=k(d.content,f);d.fn=function(c,b){return q(c,b,a)}}return d},k=function(b,c){if(a.isNullEmpty(b))return a.noop;var d=b;try{return new Function("$view","$data","bingo",["try {",c?"with ($view) {":"","with ($data || {}) {","return "+b+";","}",c?"}":"","} catch (e) {",'return bingo.isDebug ? ("Error: " + (e.message || e)) : e.message;',"} finally {","$data = null;","}"].join(""))}catch(f){if(a.isDebug){var e=["Error:",f.message||f," render:",d].join("");throw new Error(e);}else return function(){return f.message}}},o=function(l,p,o){var k=[],g=0,e=[],i=d,h=0,j=function(a){return a>0?e[a-1].children:k},n=function(a){return a>0?e.pop().children:k};l.replace(a.render.regex,function(w,G,v,l,x,E){var D=E.slice(g,x),q=a.isNullEmpty(D)?b:f(D),r=e.length,k=j(r),A=G=="/",z=v=="tmpl";if(!i){i=z;if(z){g=x+w.length;h=1;return}}else{if(z)if(A){h--;i=h>0}else h++;q&&k.push(q);i&&k.push(f(w));g=x+w.length;return}var F=l.indexOf(" ")==0;!a.isNullEmpty(l)&&(l=a.trim(l));var t=v=="else";if(t)if(!a.isNullEmpty(l))if(!F)t=d;else{l=a.trim(l);l=a.isNullEmpty(l)?"true":l}else l="true";var B=v=="if"||t,y=v=="for",C=d;if(y)C=m.test(l);var s=0;switch(v){case"header":s=1;break;case"footer":s=2;break;case"empty":s=3;break;case"loading":s=4}var u=f(l,B,A,c,p,o,t,y,s);if(t){k=n(r);q&&k.push(q);r=e.length;k=j(r);k.push(u);e.push(u)}else if(A){k=n(r);q&&k.push(q);if(B){r=e.length;k=j(r);k.push(u)}}else{k=j(r);q&&k.push(q);k.push(u);(B||y&&!C||s>0)&&e.push(u)}g=x+w.length});g<l.length&&k.push(f(l.slice(g)));return k},h=function(d){var c={header:b,footer:b,empty:b,loading:b,body:[]};a.each(d,function(){var a=this;switch(a.role){case 1:c.header=a;break;case 2:c.footer=a;break;case 3:c.empty=a;break;case 4:c.loading=a;break;default:c.body.push(a)}});return c},l=function(e,f){for(var a,b=f;b>=0;b--){a=e[b];if(a.isEnd&&a.isIf)break;if(a.isIf&&a.ifReturn)return c}return d},e=function(n,f,m,b,k,i){var g=[],o=[];a.each(n,function(o,v){if(!o.isTag)g.push(o.content);else if(!o.isEnd)if(o.isForeach){var q=o.forParam;if(!q)return;var r=q.tmpl,t=o.flt.filter(o.fn(f,b),b),p="";if(a.isNullEmpty(r)){var s=o.compileData;if(!s){s=o.compileData=h(o.children);o.children=[]}p=j(s,f,m,t,q.itemName,b,k,i)}else{if(!o.__renderObj){var u=r.indexOf("#")!=0;if(!u)p=$(r).html();else a.tmpl(r,f).success(function(a){p=a}).cacheQurey(c).async(d).get();if(a.isNullEmpty(p))return;o.__renderObj=a.render(p,f,m)}p=o.__renderObj.render(t,q.itemName,b,k,i)}g.push(p)}else if(o.isIf){if(o.isElse){if(l(n,v-1)||!(o.ifReturn=o.flt.filter(o.fn(f,b),b)))return}else if(!(o.ifReturn=o.flt.filter(o.fn(f,b),b)))return;var w=e(o.children,f,m,b,k,i);g.push(w)}else{var x=o.flt.filter(o.fn(f,b),b);g.push(x)}});return g.join("")},n=function(n,r,q,p,f,h,j,i,m,g){var c="_",b=i?a.clone(i,d):{};b.$parent=i;b[[f,"index"].join(c)]=b.$index=h;b[[f,"count"].join(c)]=b.$count=j;b[[f,"first"].join(c)]=b.$first=h==0;b[[f,"last"].join(c)]=b.$last=h==j-1;var k=h%2==0;b[[f,"odd"].join(c)]=b.$odd=k;b[[f,"even"].join(c)]=b.$even=!k;b[f]=p;g&&g.push(b);var o=g?g.length-1:-1,l=e(n,r,q,b,h,g);return g?a.compile.injectTmplWithDataIndex(l,o,m):l},j=function(c,k,j,g,m,i,h,f){a.isString(m)||(m="item");var d=[],p=f?f.length:-1,o=b;if(p>=0){o=a.compile.injectTmplWithDataIndex("",-1,p-1);d.push(o)}c.header&&d.push(e(c.header.children,k,j,i,h,f));if(a.isNull(g)){var l=c.loading||c.empty;l&&d.push(e(l.children,k,j,i,h,f))}else{if(!a.isArray(g))g=[g];if(g.length==0){var l=c.empty||c.loading;l&&d.push(e(l.children,k,j,i,h,f))}else{var q=c.body,r=g.length;a.each(g,function(b,a){d.push(n(q,k,j,b,m,a,r,i,h,f))})}}p>=0&&d.push(o);c.footer&&d.push(e(c.footer.children,k,j,i,h,f));return d.join("")}})(bingo);(function(a,j){var f="$observer",e="$withData",c="node",b="$view";"use strict";a.factory("$rootView",function(){return a.rootView()});a.factory("$compile",[b,function(b){return function(){return a.compile(b)}}]);a.factory("$tmpl",[b,function(b){return function(c){return a.tmpl(c,b)}}]);a.factory("$node",[c,function(a){return j(a)}]);a.factory("$factory",[b,function(b){return function(c){return a.factory(c).view(b)}}]);a.factory("$ajax",[b,function(b){var c=function(c){return a.ajax(c,b)};c.syncAll=function(c){return a.ajaxSyncAll(c,b)};return c}]);a.factory("$filter",[b,c,e,function(c,d,b){return function(f,e){return a.filter.createFilter(f,c,d,e||b)}}]);a.factory("$var",[b,function(b){return function(d,c){return a.variable(d,c,b)}}]);a.factory("$model",[b,function(b){return function(c){return a.model(c,b)}}]);a.factory("$bindContext",[b,c,e,function(c,d,b){return function(g,f,e){f||(f=d);e||(e=b);return a.compile.bind(c,f,g,e)}}]);a.factory("$nodeContext",[b,c,e,function(c,d,b){return function(f,e){f||(f=d);e||(e=b);return a.compile.bindNode(c,f,e)}}]);a.factory(f,[b,function(b){return a.observer(b)}]);a.each(["$subscribe","$subs"],function(b){a.factory(b,[f,"$attr",function(a,b){return function(e,c,d){return a.subscribe(e,c,d,b)}}])});a.factory("$module",[b,function(b){return function(e){var c=null,d=arguments.length==0?b.$getModule():b.$getApp().module(e);return!d?c:{$service:function(e){var f=d.service(e);return!f?c:a.factory(e).view(b).inject()},$controller:function(f){var e=d.controller(f);return!e?c:{$action:function(f){var d=e.action(f);return!d?c:a.factory(d).view(b).inject()}}}}}}]);a.factory("$route",function(){return function(b){return a.route(b)}});a.factory("$routeContext",function(){return function(b){return a.routeContext(b)}});var g={},i=a.cacheToObject(g).max(100);a.factory("$cache",function(){return i});var h={},d=a.cacheToObject(h).max(20);a.factory("$param",[b,function(){return function(b,a){d.key(b);if(arguments.length<=1){var c=d.get();d.clear();return c}else d.set(a)}}])})(bingo,window.jQuery);(function(a){a.factory("$linq",function(){return function(b){return a.linq(b)}})})(bingo);(function(a){var b="bg-route",c="_bg_location_";a.location=function(f){a.isString(f)&&(f='[bg-name="'+f+'"]');var e=null;if(a.isString(f))e=$(f);else if(f)e=$(f).closest("["+b+"]");var h=e&&e.size()>0?true:false;if(!h)e=$(document.documentElement);var g=e.data(c);if(!g){g=d.NewObject().ownerNode(e).linkToDom(e).isRoute(h).name(e.attr("bg-name")||"");e.data(c,g)}return g};a.location.onHref=a.Event();a.location.onLoaded=a.Event();var d=a.location.Class=a.Class(a.linkToDom.LinkToDomClass,function(){var d="onCloseBefore",c="bg-location-change";this.Prop({ownerNode:null,isRoute:false,name:""});this.Define({queryParams:function(){return this.routeParams().queryParams},routeParams:function(){var c=this.url(),b=a.routeContext(c);return b.params},href:function(f,e){var d=a.isNullEmpty(e)?this.isRoute()?this.ownerNode():null:$("["+b+'][bg-name="'+e+'"]');d&&d.size()>0&&d.attr(b,f).trigger(c,[f]);return this},reload:function(a){return this.href(this.url(),a)},onChange:function(a){var b=this;this.isRoute()&&a&&this.ownerNode().on(c,function(d,c){a.call(b,c)})},onLoaded:function(b){var c=this;this.isRoute()&&b&&this.ownerNode().on("bg-location-loaded",function(e,d){b.call(c,d);a.location.onLoaded.trigger([c])})},url:function(){return this.isRoute()?this.ownerNode().attr(b):window.location+""},toString:function(){return this.url()},views:function(){return a.view(this.ownerNode()).$children},close:function(){if(!this.isRoute())return;if(this.trigger(d)===false)return;this.ownerNode().remove()},onCloseBefore:function(a){return this.on(d,a)},onClosed:function(c){var a="onClosed",b=this;if(b.__closeed!==true){b.__closeed=true;b.onDispose(function(){this.trigger(a)})}return b.on(a,c)}})});a.factory("$location",["node",function(b){return a.location(b)}])})(bingo);(function(a){a.factory("$render",["$view","node",function(b,c){return function(d){return a.render(d,b,c)}}])})(bingo);(function(a){a.factory("$timeout",["$view",function(a){return function(b,c){return a.$timeout(function(){b&&b()},c)}}])})(bingo);(function(a){var b="bg-action-add";a.each(["bg-action",b],function(d){var c=d==b;a.command(d,function(){var b=null;return{priority:c?995:1e3,tmpl:"",tmplUrl:"",replace:false,include:false,view:!c,compileChild:c,compilePre:b,action:b,link:b,compile:["$view","$compile","$node","$attr",function(d,h,i,k){var g=k.$attrValue(),e=b;if(!a.isNullEmpty(g)){e=k.$results();if(!e)e=a.datavalue(d.$parentView(),g)}if(a.isNullEmpty(g)||a.isFunction(e)||a.isArray(e)){e&&d.$addAction(e);!c&&d.$using([],function(){h().fromNode(i[0].childNodes).compile()})}else{var l=g,j=a.routeContext(l),f=j.actionContext();if(f.action){d.$setApp(f.app);d.$setModule(f.module);d.$addAction(f.action);!c&&d.$using([],function(){h().fromNode(i[0].childNodes).compile()})}else d.$using(l,function(){var a=j.actionContext();if(a.action){d.$setApp(a.app);d.$setModule(a.module);d.$addAction(a.action);!c&&d.$using([],function(){h().fromNode(i[0].childNodes).compile()})}})}}]}})})})(bingo);(function(a){a.each("attr,prop,src,checked,disabled,enabled,readonly,class".split(","),function(b){a.command("bg-"+b,function(){return["$view","$attr","$node",function(f,d,c){var a="checked",e=function(e){var d="disabled";switch(b){case"attr":c.attr(e);break;case"prop":c.prop(e);break;case"enabled":c.prop(d,!e);break;case d:case"readonly":case a:c.prop(b,e);break;default:c.attr(b,e)}};d.$subsResults(function(a){e(a)},b=="attr"||b=="prop");d.$initResults(function(a){e(a)});b==a&&c.click(function(){var b=c.prop(a);d.$value(b);f.$update()})}]})})})(bingo);(function(a){a.each("event,click,blur,change,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,contextmenu".split(","),function(b){a.command("bg-"+b,function(){return["$view","$node","$attr",function(i,h,e){var g=function(b,a){h.on(b,function(){var b=a.apply(this,arguments);i.$update();return b})};if(b!="event"){var c=e.$value();if(!a.isFunction(c))c=function(a){return e.$eval(a)};g(b,c)}else{var d=e.$results();if(a.isObject(d)){var c=null;for(var f in d)if(a.hasOwnProp(d,f)){c=d[f];a.isFunction(c)&&g(f,c)}}}}]})})})(bingo);(function(a){"use strict";var b=/[ ]*([^ ]+)[ ]+in[ ]+(?:(.+)[ ]+tmpl[ ]*=[ ]*(.+)|(.+))/;a.each(["bg-for","bg-render"],function(b){a.command(b,function(){return{priority:100,compileChild:false,link:["$view","$compile","$node","$attr","$render","$tmpl",function(p,l,g,f,m,o){var b=c(g,f);g.html("");if(!b)return;var k=b.itemName,d=b.tmpl,h=function(e){var d=g,b="";d.html("");var c=[];b=i.render(e,k,null,-1,c);a.isNullEmpty(b)||l().fromHtml(b).withDataList(c).appendTo(d).compile()},j=function(a){i=m(a);f.$subsResults(function(a){h(a)},true);f.$initResults(function(a){h(a)})},e="",i=null;if(a.isNullEmpty(d))e=b.html;else{var n=d.indexOf("#")!=0;if(n)o(d).success(function(b){!a.isNullEmpty(b)&&j(b)}).get();else e=$(d).html()}!a.isNullEmpty(e)&&j(e)}]}})});var c=function(h,g){var c=g.content;if(a.isNullEmpty(c))c="item in {}";if(!b.test(c))c=["item in ",c].join("");var f="",d="",e="";c.replace(b,function(){f=arguments[1];d=arguments[2];e=a.trim(arguments[3]);if(a.isNullEmpty(d))d=arguments[4]});g.$attrValue(d);return{itemName:f,dataName:d,tmpl:e,html:e?"":a.compile.getNodeContentTmpl(h)}}})(bingo);(function(a){var b="$location";a.command("bg-route",function(){return{priority:1e3,replace:false,view:true,compileChild:false,compile:["$compile","$node","$attr",b,function(e,b,d,c){var a=null;c.onChange(function(c){a&&a.stop();a=e().fromUrl(c).appendTo(b).onCompilePre(function(){b.html("")}).onCompiled(function(){a=null;b.trigger("bg-location-loaded",[c])}).compile()});d.$init(function(){return d.$attrValue()},function(a){a&&c.href(a)})}]}});a.command("bg-route-load",function(){return[b,"$attr",function(b,c){c.$initResults(function(c){a.isFunction(c)&&b.onLoaded(function(a){c.call(b,a)})})}]});$(function(){$(document.documentElement).on("click","[href]",function(){var c=$(this),b=c.attr("href");if(b.indexOf("#")>=0){b=b.split("#");b=b[b.length-1].replace(/^[#\s]+/,"");if(!a.isNullEmpty(b)){var d=c.attr("bg-target");if(a.location.onHref.trigger([c,b,d])===false)return;var e=a.location(this);e.href(b,d)}}})})})(bingo);(function(a){a.command("bg-html",function(){return["$attr","$node","$compile",function(b,c,e){var d=function(b){c.html(a.toStr(b));e().fromJquery(c).compile()};b.$subsResults(function(a){d(a)});b.$initResults(function(a){d(a)})}]})})(bingo);(function(a){var b="bg-render-if",c="_tif_"+a.makeAutoId();a.each(["bg-if",b],function(e){var d=e==b;a.command(e,function(){return{compileChild:false,compile:["$attr","$node","$compile","$render",function(e,b,h,i){var f=a.compile.getNodeContentTmpl(b),j=d?i(f):null,g=function(a){b.html("");if(a){b.show();h().fromHtml(d?j.render({},c):f).appendTo(b).compile()}else b.hide()};e.$subsResults(function(a){g(a)});e.$initResults(function(a){g(a)})}]}})})})(bingo);(function(a){var b="bg-render-include",c="_tinc_"+a.makeAutoId();a.each(["bg-include",b],function(e){var d=e==b;a.command(e,function(){return["$view","$attr","$viewnode","$tmpl","$render",function(j,b,f,i,g){var h=b.$attrValue();if(a.isNullEmpty(h))return;var e=function(b){var e=b.indexOf("#")!=0,a="";if(e)i(b).success(function(b){a=b;f.$html(d?g(a).render({},c):a)}).get();else{a=$(b).html();f.$html(d?g(a).render({},c):a)}};b.$initResults(function(c){var d=!a.isUndefined(c);if(d){b.$subsResults(function(a){e(a)});e(c)}else e(h)})}]})})})(bingo);(function(a){a.command("bg-model",function(){return["$view","$node","$attr",function(j,c,e){var b="checked",d="checkbox_value_02",i=c.is(":radio"),f=c.is(":checkbox");f&&c.data(d,c.val());var g=function(){var a=c;return f?a.prop(b)?a.data(d):"":a.val()},h=function(d){var e=c;d=a.toStr(d);if(f)e.prop(b,e.val()==d);else if(i)e.prop(b,e.val()==d);else e.val(d)};if(i)c.click(function(){var a=g();e.$value(a);j.$update()});else c.on("change",function(){var a=g();e.$value(a);j.$update()});e.$subsValue(function(a){h(a)});e.$initValue(function(a){h(a)})}]})})(bingo);(function(a){a.each("style,show,hide,visible".split(","),function(b){a.command("bg-"+b,function(){return["$attr","$node",function(c,a){var d=function(c){switch(b){case"style":a.css(c);break;case"hide":c=!c;case"show":if(c)a.show();else a.hide();break;case"visible":c=c?"visible":"hidden";a.css("visibility",c);break;default:a.css(b,c)}};c.$subsResults(function(a){d(a)},b=="style");c.$initResults(function(a){d(a)})}]})})})(bingo);(function(a){a.command("bg-text",function(){return["$attr","$node",function(b,d){var c=function(b){d.text(a.toStr(b))};b.$subsResults(function(a){c(a)});b.$initResults(function(a){c(a)})}]})})(bingo);(function(a){var b="bg-render-include",c="_tinc_"+a.makeAutoId();a.each(["bg-include",b],function(e){var d=e==b;a.command(e,function(){return["$view","$attr","$viewnode","$tmpl","$render",function(j,b,f,i,g){var h=b.$attrValue();if(a.isNullEmpty(h))return;var e=function(b){var e=b.indexOf("#")!=0,a="";if(e)i(b).success(function(b){a=b;f.$html(d?g(a).render({},c):a)}).get();else{a=$(b).html();f.$html(d?g(a).render({},c):a)}};b.$initResults(function(c){var d=!a.isUndefined(c);if(d){b.$subsResults(function(a){e(a)});e(c)}else e(h)})}]})})})(bingo);(function(a){a.command("bg-node",function(){return["$attr","node",function(a,b){a.$value(b)}]})})(bingo);(function(a){a.command("text/bg-script",function(){return{priority:300,compileChild:false,compile:["$attr","$node","$bindContext",function(c,d,b){c.$init(function(){return d.html()},function(d){if(!a.isNullEmpty(d)){var c=b(d);c.$eval();c.dispose()}})}]}});a.command("bg-not-compile",function(){return{compileChild:false}})})(bingo);(function(a){"use strict";a.filter("eq",function(){return function(a,b){return a==b}});a.filter("neq",function(){return function(a,b){return a!=b}});a.filter("not",function(){return function(a){return!a}});a.filter("gt",function(){return function(a,b){return a>b}});a.filter("gte",function(){return function(a,b){return a>=b}});a.filter("lt",function(){return function(a,b){return a<b}});a.filter("lte",function(){return function(a,b){return a<=b}});a.filter("len",function(){return function(b){return b?a.isUndefined(b.length)?0:b.length:0}});a.filter("text",function(){return function(b){return a.htmlEncode(b)}});a.filter("html",function(){return function(b){return a.htmlDecode(b)}});a.filter("val",function(){return function(b,a){return a}});a.filter("len",function(){return function(a){return a&&a.length?a.length:0}});a.filter("sw",function(){return function(i,a){var b=a.length,d=b%2==1,h=d?a[b-1]:"";d&&b--;for(var g=null,f=false,e,c=0;c<b;c+=2){e=a[c];if(i==e){g=a[c+1],f=true;break}}return f?g:h}});a.filter("take",function(){return function(c,b){return a.linq(c).take(b[0],b[1])}});a.filter("asc",function(){return function(d,c){var b=a.linq(d);if(!a.isNullEmpty(c))b.sortAsc(c);else b.sortAsc();return b.toArray()}});a.filter("desc",function(){return function(d,c){var b=a.linq(d);if(!a.isNullEmpty(c))b.sortDesc(c);else b.sortDesc();return b.toArray()}})})(bingo)