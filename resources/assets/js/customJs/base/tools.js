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


