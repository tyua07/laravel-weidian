/**
 * 商品对象
 *
 * @constructor
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function Goods()
{
    //初始化
    this.__construct();
}

/**
 * 初始化
 *
 * @private
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Goods.prototype.__construct = function ()
{
}

/**
 * 拉取微店
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Goods.prototype.pullWeidianCategory = function(url)
{
    //开启按钮动画
    base.tools.startButtonAnmate();
    this.send(url);
}

/**
 * 同步微店商品
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Goods.prototype.syncWeidianCategory = function(url)
{
    //开启按钮动画
    base.tools.startButtonAnmate();
    this.send(url);
}

/**
 * 删除微店商品
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Goods.prototype.deleteCategory = function(url, category_id)
{
    //开启按钮动画
    base.tools.startButtonAnmate();
    var _this = this;

    if ( category_id > 0 ) {
        layer.config({
            area:['100px', '180px'],
        });

        //询问框
        layer.confirm('是否删除商品', {
            btn: ['是', '否'] //按钮
        }, function(){
            _this.send(url, {id : category_id});
            layer.closeAll();
            window.location.reload();
        }, function(){

        });
    } else {
        base.tools.stopButtonAnmate();
    }
}

/**
 * 发送数据
 *
 * @param url       url
 * @param params    参数
 * @author yangyifan <yangyifanphp@gmail.com>
 */
Goods.prototype.send = function (url, params) {

    params = params || {};

    $.ajax({
        url         : url,
        type        : 'POST',
        data        : params,
        async       : false,
        dataType    : 'json',
        success     : function (data) {
            base.tools.parseResponseJson(data);
            base.tools.stopButtonAnmate();
        }
    })
}

var goods = new Goods();