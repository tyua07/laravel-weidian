/**
 * Created by anywhere1000 on 15/10/4.
 */


/**
 * 构建builder Html 页面 搜索模块【展现模板】
 *
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function searchForSelect(obj, params){
    //获得数据
    var data = getSearchData(obj, params.url)

    if (data){
        var html = '';
        for(attr in data){
            html += '<option value="' + data[attr].id + '" >' + data[attr].name + '</option>'
        }
        $(obj).next('select').append(html)
    }
}

/**
 * 获得数据
 *
 * @param obj
 * @param url
 * @returns {{}}
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function getSearchData(obj, url){
    var _this       = $(obj);
    var name        = _this.parents('.form-group').find('input[name=search_name_xxxxx]').val();
    var _data       = {};
    if (name == ''){
        alert('请选择搜索的名称');
        return;
    }

    $.ajax({
        url         : url,
        async       : false,
        dataType    : 'json',
        data        : {'name' : name},
        success:function(data){
            if(data.code == HTTP_CODE.SUCCESS_CODE){
                _data =  data.data;
            }else{
                toastr.warning(data.msg);
            }
        }
    });

    return _data;
}

/**
 * 选择下拉列表框
 *
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function selectSearch(obj){
    var _this        = $(obj)
    var name        = _this.val();

    if(name){
        _this.next('input:hidden').val(name);
    }
}