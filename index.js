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
        //需要检查的表单id
        id:"perfectData",
        //自定义错误处理方法；可以在此定义自己的错误提示；
        errCallback:function (patten) {
            validate.showErr(patten)
        },
        //自定义某个组件的验证方法；当检查到id为 companyName的项时，就会执行与id对应下标的selfValidateCallback；
        selfValidate:["companyName","realName"],
        selfValidateCallback:[
            function (patten,val) {
                 return true
            },
            function (a,b) {
                console.log(a,b)
                return false
            }
        ]
    });

    //获取数据
    $("#two").click(function () {
        //验证数据
        if(validate.verify()){
             data = validate.getFormData();
             console.log(data)
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





 