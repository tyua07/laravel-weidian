$(function(){
    layer.config({
        area:['auto', 'auto'],
    });
})

/**
 * 弹出批量上传图片弹出框
 */
function batchUploadImages(obj, id){
    var _this = $(obj);
    layer.open({
        title:'批量上传图片',
        type: 2,
        area:['1024px', '700px'],
        content: [batchUploadImagesUrl + "?id="+ id , 'no'] ,//这里content是一个普通的String
        btn: ['确认'],
        yes: function(layero, index){
            layer.closeAll()
            window.parent.location.href = window.parent.location.href
        },
    });
}

/**
 * 软删除图片
 *
 * @param obj
 * @param id
 * @param product_id
 */
function delImageToTop(obj, id, _id)
{
    var _this = $(obj);

    //询问框
    layer.confirm('是否删除？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax(delImageToTopUrl, {
            type : 'post',
            data:{id: id, _id: _id},
            dataType: "json",
        }).success(function (data) {
            if(data.code == HTTP_CODE.SUCCESS_CODE){
                _this.parents('.image_list').remove()
                layer.closeAll()
                toastr.success(data.msg);
            } else{
                layer.closeAll()
                toastr.warning(data.msg);
            }
        });
    }, function(){

    });


}