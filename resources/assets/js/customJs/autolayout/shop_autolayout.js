/**
 * Created by zaiseoul on 16/1/18.
 */
$(function(){
    var viewConfig = {
        reference   : $('#address_parent .control-label'),//排版参照物
    };


    //设置地区、分类、是否使用优惠券约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[region_id_parent(category_id_parent,is_coupon_parent)]-[category_id_parent]-[is_coupon_parent]-|',
        'V:|[region_id_parent(=='+AutoLayout.CONST.height.default+'),category_id_parent(==region_id_parent),is_coupon_parent(==region_id_parent)]',
    ] );

    //设置经度、纬度约束
    var AutoLayout2 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[lat_parent(==lng_parent)]-82-[lng_parent]-|',
        'V:|[lat_parent(=='+AutoLayout.CONST.height.default+'),lng_parent(==lat_parent)]',
    ] );

    //设置商家名称、商家韩文名称约束
    var AutoLayout3 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[shop_name_parent(==shop_name_kr_parent)]-[shop_name_kr_parent]-|',
        'V:|[shop_name_parent(=='+AutoLayout.CONST.height.default+'),shop_name_kr_parent(==shop_name_parent)]',
    ] );

})