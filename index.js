/*
 * @Author lizhenhua
 * @version 2018/4/28
 * @description 
 */


$(function () {
    initEvent()
})

function initEvent() {
    var data = {};

    //初始化验证
    var validate = new myValidate({
        id:"perfectData",     //需要检查的表单id
    });

    //获取数据
    $("#two").click(function () {
        //验证数据
        if(validate.verify()){
             data = validate.getFormData();
        }
    })

    $("#three").click(function () {
        validate.clearData()
    });
    
    $("#four").click(function () {
        validate.fillData(data)
    });

    $("#five").click(function () {
        validate.noEdit(["more","companyName","sex","interest","renterId"])
    });

}





 