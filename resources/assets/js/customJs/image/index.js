/**
 * Created by anywhere1000 on 15/9/18.
 */


/**
 * 弹出上传提示框
 *
 * @author yangyifan <yangyifanphp@gmail.com>
 */
function showUploadDialog(params){
    layer.open({
        title:'上传文件',
        type: 2,
        content: params.url //这里content是一个普通的String
    });
}