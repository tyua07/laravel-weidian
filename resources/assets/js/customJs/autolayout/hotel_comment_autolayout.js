/**
 * Created by zaiseoul on 16/1/18.
 */
$(function(){
    var viewConfig = {
        reference   : $('#title_parent .control-label'),//排版参照物
        height      : (AutoLayout.CONST.height.default * 6) //强制设置高度
    };


    //设置 销售价(RMB)、销售价(KR)约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [
        'H:|-39-[hotel_id_parent(create_date_parent)]-130-[create_date_parent]-|',
        'H:|-40-[info_lastname_parent(create_date_parent-50)]-115-[info_firstname_parent]-|',
        'H:|-39-[score_facility_parent(create_date_parent)]-[score_location_parent]-|',
        'H:|-39-[score_clean_parent(create_date_parent)]-50-[score_friendly_parent]-|',
        'H:|-39-[score_recommend_parent(create_date_parent)]',

        //'V:|[hotel_id_parent(=='+AutoLayout.CONST.height.default+'),create_date_parent(==hotel_id_parent)]|',

        'V:|-[hotel_id_parent(info_lastname_parent,score_facility_parent,score_clean_parent,score_recommend_parent)]-[info_lastname_parent]-[score_facility_parent]-[score_clean_parent]-[score_recommend_parent]-|',
        'V:|-[create_date_parent(info_firstname_parent,score_location_parent,score_friendly_parent,score_recommend_parent)]-[info_firstname_parent]-[score_location_parent]-[score_friendly_parent]-[score_recommend_parent]-|',

        //'V:|[info_lastname_parent(=='+AutoLayout.CONST.height.default+'),info_firstname_parent(==info_lastname_parent)]|',
    ] );

})