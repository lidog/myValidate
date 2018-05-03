/*
 * @Author lizhenhua
 * @version 2018/4/28
 * @description 
 */


$(function () {
    initEvent()
})

function initEvent() {

    //初始化验证
    var validate = new myValidate({
        id:"perfectData",     //需要检查的表单id
    });


    //获取数据
    $("#two").click(function () {
        //验证数据
        if(validate.verify()){
            var data = validate.getFormData();
            console.log(data)
        }
    })

    //验证数据
    // var verify = validate.verify();

}





 