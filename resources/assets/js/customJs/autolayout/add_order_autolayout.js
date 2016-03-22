/**
 * Created by zaiseoul on 16/1/18.
 */
$(function(){
    var viewConfig = {
        reference : $('#remark_parent .control-label'),//排版参照物
    };


    //设置 销售价(RMB)、销售价(KR)约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[pay_price_parent(pay_price_krw_parent)]-[pay_price_krw_parent]-|',
        'V:|[pay_price_parent(=='+AutoLayout.CONST.height.default+'),pay_price_krw_parent(==pay_price_parent)]|',
    ] );

})