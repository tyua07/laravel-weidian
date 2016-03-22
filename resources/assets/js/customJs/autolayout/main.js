/**
 * Created by zaiseoul on 16/1/18.
 */
var AutoLayout = window.AutoLayout;

//设置对象常量（用于坐标宽度、高度）
AutoLayout.CONST = {
    height : {
        default : 41,//默认高度
    }
}
/**
 * 创建 autolayout 布局
 *
 * @param viewId dom的ID
 * @param viewConfig view的配置信息
 * @param visualFormat view的约束
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function AutoLayoutObject (viewId, viewConfig, visualFormat)
{
    this.viewId         = viewId;//View Dom 的id
    this.viewDom        = document.getElementById(this.viewId);// View dom 对象
    this.visualFormat   = visualFormat || [];//view的约束
    this.viewConfig 	= {};//配置

    //视图配置
    var option = {
        reference 			: null,//排版参照物
        const_margin 		: 27,//自动布局子元素下面的label与div的margin（left&right）
        child_label_class	: "control-label",//子元素 label的class名称
        width 				: 0,//父级的宽度
        height 				: 0,//父级的高度
    }
    this.viewConfig 	= $.extend(option, viewConfig);

    this.view          = new AutoLayout.View();//实例化视图 autolayout

    //执行构造方法
    this.__contrust();
    //调用析构方法
    this.__destruct();
}

/**
 * 计算文字宽度
 *
 * @param $dom
 * @returns {*}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.getCurrentStrWidth = function ($dom)
{
    var currentObj = $('<pre>').hide().appendTo(document.body);
    $(currentObj).html($dom.text()).css('font', $dom.css('font-family'));
    var width = currentObj.width();
    currentObj.remove();
    return width;
}

/**
 * 更新约束的水平约束
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.updateVisualFormat = function ()
{
    if (this.viewConfig.reference != null) {
        var position    = this.viewConfig.reference.position();//没有采用autolayout元素的lefy值
        var fontWidth   = this.getCurrentStrWidth(this.viewConfig.reference);//文字的宽度
        var width   	= this.viewConfig.reference.innerWidth();//文字的宽度
        position.right 	= width - (position.left * 2);

        for (var i = 0; i < this.visualFormat.length - 1; i++) {
            //如果是水平约束，则修改水平方向 子级相对与 父级的间距
            if (this.visualFormat[i][0] != 'V') {//因为默认可以省略“H”，所以判断不对“V”了
                //修改子级的第一个元素与父级的水平左间距
                this.visualFormat[i] = this.updateFirstChildLeftMargin(this.visualFormat[i], position.right);
            }
        };
    }
}

/**
 * 计算子级的第一个元素与父级的水平左间距
 *
 * @param $visualFormat
 * @param $margin_right
 * @returns {*}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.updateFirstChildLeftMargin = function ($visualFormat, $margin_right)
{

    $margin_right -= (this.getFristChildTextWidth($visualFormat) + 20);

    //匹配当前左间距
    $arr = $visualFormat.match(/\|(\-*)(\d*)(\-*)\[/);

    if ($arr && isNaN($arr[2]) == false ) {

        //如果是 “--” 表示是负值。
        if ($arr[1] == "--") {
            $arr[2] = -$arr[2];
        }
        $margin_right -= $arr[2];
    }
    return $visualFormat.replace(/\|([\-|\d]*)\[/, '|-'+Math.abs($margin_right)+'-[');
}

/**
 * 得到第一个子元素的文字宽度
 * @param $visualFormat
 * @returns {number}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.getFristChildTextWidth = function ($visualFormat)
{
    var arr = $visualFormat.match(/\[(\w+)(\(\w+(\,\w+)*\))?\]/, $visualFormat);
    if (!arr) {
        return $visualFormat;
    }
    return this.getCurrentStrWidth($('#' + arr[1] + " ." + this.viewConfig.child_label_class)) - this.viewConfig.const_margin;
}

/**
 * 构造方法
 *
 * @private
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.__contrust = function ()
{
    //更新约束的水平约束
    this.updateVisualFormat();
    //设置约束
    this.addConstraints(this.visualFormat);
    //重构约束的html结构，用父级div包起来
    this.updateHtml();
    //设置class
    this.setClass();
    //设置  transform 属性
    this.setTransFormAttr();
}

/**
 * 设置 class
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.setClass = function ()
{
    this.elements = {};
    for (var key in this.view.subViews) {
        var elm = document.getElementById(key);
        if (elm) {
            elm.className += elm.className ? ' abs' : ' abs';
            this.elements[key] = elm;
        }
    }
}

/**
 * 设置  transform 属性
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.setTransFormAttr = function ()
{
    this.transformAttr = ('transform' in document.documentElement.style) ? 'transform' : undefined;
    this.transformAttr = this.transformAttr || (('-webkit-transform' in document.documentElement.style) ? '-webkit-transform' : 'undefined');
    this.transformAttr = this.transformAttr || (('-moz-transform' in document.documentElement.style) ? '-moz-transform' : 'undefined');
    this.transformAttr = this.transformAttr || (('-ms-transform' in document.documentElement.style) ? '-ms-transform' : 'undefined');
    this.transformAttr = this.transformAttr || (('-o-transform' in document.documentElement.style) ? '-o-transform' : 'undefined');
}

/**
 * 获得dom结构
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.getDomStruct = function ()
{
    //父级dom ID 名称
    this.parenName      = this.viewId;
    //父级dom ID名称数组
    this.childNameArr   = [];

    if (this.view.subViews) {
        for (key in this.view.subViews) {
            if (key == this.parenName) {
                continue;
            }
            this.childNameArr.push(key);
        }
    }
}

/**
 * 重构约束的html结构，用父级div包起来
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.updateHtml = function()
{
    //获得dom结构
    this.getDomStruct();

    if (this.childNameArr.size <= 0) {
        return false;
    }
    //子元素的第一个元素
    var fristChildDomName = this.childNameArr[0];
    //创建的父级dom的class 名称，用子元素的id拼接出字符串
    var tmpClass = this.childNameArr.join('');//

    $('#' + fristChildDomName).before("<div class='"+tmpClass+" form-group' style='position: relative;overflow: hidden;'></div>");

    //临时变量，保存dom对象
    var tmp = {};
    //临时变量，保存当前子元素的全部高度，然后复制最大高度，给父级元素
    var heightArray = [];
    for (var i = 0; i < this.childNameArr.length; i++) {
        tmp = $('#' + this.childNameArr[i]).clone(true);
        heightArray.push($('#' + this.childNameArr[i]).outerHeight())

        if ($.isEmptyObject(tmp) == false) {
            //移除dom
            $('#' + this.childNameArr[i]).remove();
            //把dom对象，追加进创建的父级dom
            tmp.appendTo( $('.' + tmpClass));
        }
    }

    //如果设置当前高度，则取设置的高度
    if (this.viewConfig.height > 0 ) {
        $('.' + tmpClass).css('height' , this.viewConfig.height);
    } else {
        //否则，取当前子元素里面最高的元素
        $('.' + tmpClass).css('height' , Math.max.apply(null, heightArray));
    }
}

/**
 * 给当前视图，增加约束
 *
 * @param visualFormat
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.addConstraints= function (visualFormat)
{
    this.view.addConstraints(AutoLayout.VisualFormat.parse(visualFormat, {extended: true}))
}

/**
 * 设置 子元素的style
 *
 * @param elm dom对象
 * @param left left
 * @param top top
 * @param width 宽度
 * @param height 高度
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.setAbsoluteSizeAndPosition = function (elm, left, top, width, height) {
    //更新元素样式
    elm.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px;' + this.transformAttr + ': translate3d(' + left + 'px, ' + top + 'px, 0px);');
}

/**
 * 更新自动布局
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.updateLayout = function ()
{
    //设置父级的宽度和高度,如果this.viewConfig 里面有配置了宽度和高度，则直接去配置信息里面的，如果没有，则取viewDom的宽度和高度
    this.view.setSize(this.viewConfig.width > 0 ? this.viewConfig.width : $(this.viewDom).innerWidth(), this.viewConfig.height > 0 ? this.viewConfig.height: $(this.viewDom).innerHeight());

    for (key in this.view.subViews) {
        if (key == this.viewId) continue;
        this.subView = this.view.subViews[key];
        if (this.elements[key]) {
            this.setAbsoluteSizeAndPosition(this.elements[key], this.subView.left, this.subView.top, this.subView.width, this.subView.height);
        }
        //更新视图，表单区域栅栏位9分（之前是3份）
        this.updateClass(key);
    }
}

/**
 * 更新视图
 *
 * @param $id
 */
AutoLayoutObject.prototype.updateClass = function ($id)
{
    var div_class          = '.last_child_div';//当前元素下面的最后一个div

    //如果当前已经修改了，则不需要修改
    if ( (($('#'+$id).children(div_class).size())) < 0 ) {
        return false;
    }
    $('#'+$id).children('label').attr('class', 'pull-left control-label');
    $('#'+$id).children('label').css({"margin": "0 "+this.viewConfig.const_margin+"px"});

    $('#'+$id).children(div_class).css({'overflow' : 'hidden'});
    $('#'+$id).children(div_class).attr('class', '');
}

/**
 * 析构方法
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
AutoLayoutObject.prototype.__destruct = function ()
{
    var _this = this;
    $(window).bind('resize', function(){
        _this.updateLayout();
    });
    this.updateLayout();
}