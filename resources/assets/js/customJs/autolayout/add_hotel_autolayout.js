/**
 * Created by zaiseoul on 16/2/17.
 */
$(function(){
    var viewConfig = {
        reference : $('#hotel_name_en_parent .control-label'),//排版参照物
    };


    //设置 酒店类型 、interpark约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [
        'H:|-[hotel_type_parent(partner_parent)]-[partner_parent]-|',
        'V:|[hotel_type_parent(=='+AutoLayout.CONST.height.default+'),partner_parent(==hotel_type_parent)]|',
    ] );

    //设置 地区、手续费约束
    var AutoLayout2 = new AutoLayoutObject("form", viewConfig, [
        'H:|--18-[region_id_parent(==180)]-0-[interest_parent(357)]',
        'V:|[region_id_parent(=='+AutoLayout.CONST.height.default+'),interest_parent(==region_id_parent)]|',
    ] );

})