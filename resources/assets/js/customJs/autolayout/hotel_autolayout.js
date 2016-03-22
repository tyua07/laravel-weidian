/**
 * Created by zaiseoul on 16/1/18.
 */
$(function(){
    var viewConfig = {
        reference   : $('#ex_condition_kr_parent .control-label'),//排版参照物
        height      : (150 + 11) * 4,//收到设置父级的高度
    };

    //设置约束
    var AutoLayout1 = new AutoLayoutObject("form", viewConfig, [

        ////设置 酒店名称（韩文），酒店名称（中文），酒店名称（英文）水平约束
        'H:|-[hotel_name_kr_parent(hotel_user_profile_kr_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[hotel_name_parent(hotel_name_kr_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[hotel_name_en_parent(hotel_name_kr_parent)]-[hotel_user_profile_kr_parent]-|',

        //设置 酒店地址（韩），酒店地址（中），酒店地址（英） 水平约束
        'H:|-[hotel_address_kr_parent(hotel_user_profile_kr_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[hotel_address_parent(hotel_address_kr_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[hotel_address_en_parent(hotel_address_en_parent)]-[hotel_user_profile_kr_parent]-|',

        //设置 纬度，经度，手续费 水平约束
        'H:|-[interest_parent(hotel_user_profile_kr_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[lng_parent(interest_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[lat_parent(lng_parent)]-[hotel_user_profile_kr_parent]-|',

        //设置 特惠酒店（最低价保障），状态，排序约束
        'H:|-[is_discount_parent(lat_parent+120)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[state_parent(lat_parent)]-[hotel_user_profile_kr_parent]-|',
        'H:|-[sort_parent(state_parent)]-[hotel_user_profile_kr_parent]-|',

        'H:[hotel_user_profile_parent(hotel_user_profile_kr_parent)]-|',
        'H:[introduction_kr_parent(hotel_user_profile_kr_parent.width-24)]-|',
        'H:[introduction_parent(hotel_user_profile_kr_parent.width-24)]-|',

        'V:|-[hotel_name_kr_parent(hotel_name_parent,hotel_name_en_parent,hotel_address_kr_parent,hotel_address_parent,hotel_address_en_parent,interest_parent,lng_parent,lat_parent,is_discount_parent,state_parent,sort_parent)]-[hotel_name_parent]-[hotel_name_en_parent]-[hotel_address_kr_parent]-[hotel_address_parent]-[hotel_address_en_parent]-[interest_parent]-[lng_parent]-[lat_parent]-[is_discount_parent]-[state_parent]-[sort_parent]-|',
        'V:|-[hotel_user_profile_kr_parent(hotel_user_profile_parent,introduction_kr_parent,hotel_user_profile_kr_parent,introduction_parent)]-[hotel_user_profile_parent]-[introduction_kr_parent]-[introduction_parent]-|',
    ] );

})