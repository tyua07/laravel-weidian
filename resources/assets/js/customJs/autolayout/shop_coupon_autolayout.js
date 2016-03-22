/**
 * Created by zaiseoul on 16/1/18.
 */
$(function(){
    var viewConfig = {
        reference : $('#coupon_image_parent .control-label'),//排版参照物
    };


    //设置 标题（中文） 和 标题（韩文）约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[coupon_title_parent(coupon_title_kr_parent)]-50-[coupon_title_kr_parent]-|',
        'V:|[coupon_title_parent(=='+AutoLayout.CONST.height.default+'),coupon_title_kr_parent(==coupon_title_parent)]',
    ] );

    //设置折扣内容（中文） 和 折扣内容（韩文）约束
    var AutoLayout2 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[discount_parent(==discount_kr_parent)]-[discount_kr_parent]-|',
        'V:|[discount_parent(=='+AutoLayout.CONST.height.default+'),discount_kr_parent(==discount_parent)]',
    ] );

    //设置开始时间和结束时间约束
    var AutoLayout3 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[expire_start_parent(==expire_end_parent)]-45-[expire_end_parent]-|',
        'V:|[expire_start_parent(=='+AutoLayout.CONST.height.default+'),expire_end_parent(==expire_start_parent)]',
    ] );

})