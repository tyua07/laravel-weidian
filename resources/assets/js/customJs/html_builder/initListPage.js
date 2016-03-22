/**
 *   初始化表格
 *
 */
$(function(){
    $('#' + tableName).bootstrapTable({
        cookie          : true,
        cookieIdTable   : tableName,
        sortOrder       : "desc",
        strictSearch    : false,
        pageSize        : pageSize,
        queryParams     : function (params) {
            params.search = $('.search_form').serialize();
            var search_str = '';
            $.each(base.tools.parseQueryString(params.search), function(key, value){
                search_str += key + "=" + $.trim(value) + '&';
            })
            params.search = search_str.substring(0, search_str.length -1);
            return params;
        }
    })
})