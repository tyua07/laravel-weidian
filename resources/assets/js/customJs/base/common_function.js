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
