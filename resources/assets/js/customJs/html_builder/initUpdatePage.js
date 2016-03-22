$(document).ready(function () {
    //验证表单
    base.checkForm($(".ajax-form"));
    //设置双向选择器
    setMultiSelect();
});

/**
 *
 * 设置双向选择器
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function setMultiSelect()
{
    var leftSel     = $("#selectL");
    var rightSel    = $("#selectR");

    $("#toright").bind("click",function(){
        leftSel.find("option:selected").each(function(){
            $(this).remove().appendTo(rightSel);
            setMultiSelectVal(rightSel, $(this))
        });
    });
    $("#toleft").bind("click",function(){
        rightSel.find("option:selected").each(function(){
            $(this).remove().appendTo(leftSel);
        });
    });
    leftSel.dblclick(function(){
        $(this).find("option:selected").each(function(){
            $(this).remove().appendTo(rightSel);
        });
    });
    rightSel.dblclick(function(){
        $(this).find("option:selected").each(function(){
            $(this).remove().appendTo(leftSel);
        });
    });
    $("#sub").click(function(){
        setMultiSelectVal(rightSel, $(this))
    });

}

/**
 * 设置双向选择器值
 *
 * @param rightSel
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function setMultiSelectVal(rightSel, obj){
    var selVal = [];
    rightSel.find("option").each(function(){
        selVal.push(this.value);
    });
    selVals = selVal.join(",");
    obj.parents('.form-group').find('input[type=hidden]').val(selVals);
}