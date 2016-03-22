/**
 * Created by zaiseoul on 15/12/3.
 */

/**
 * 复制一个select
 *
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function addSelect(obj)
{
    var _this   = $(obj);
    var html    = _this.parents('.form-group').clone(true)

    //替换add 按钮 dom ,改成移除 按钮
    html.find('.addSelect').replaceWith(createRemoveBtnDom());

    //替换name
    var select = html.find('select');
    select.attr('name', select.attr('name').replace(/(\[\d*\]){1}/ig, '[]'));

    html.find('select').replaceWith(select);
    _this.parents('.form-group').after(html);
}

/**
 * 创建移除按钮dom
 *
 * @returns {string}
 */
function createRemoveBtnDom()
{
    return '<button class="btn btn-default col-sm-2 removeSelect" onclick="removeSelect(this)" type="button">-</button>'
}

/**
 * 移除一个（复制的） select
 *
 * @param obj
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function removeSelect(obj)
{
    $(obj).parents('.form-group').remove()
}