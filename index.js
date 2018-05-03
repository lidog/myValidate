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
        if(validate.verify()){
            var data = validate.getData();
            console.log(data)
        }
    })

    //验证数据
    // var verify = validate.verify();

}

// var a = new student({name:1354});
// console.log(a.name)
// function student(obj) {
//     var k = {
//         name:'abc'
//     }
//
//     k = $.extend(k,obj);
//
//     this.name = k.name
// }


//获取数据
/*var data = validate.getData();

//回填数据
validate.fillData(data);

//设置禁止修改
validate.noEdit([name1,name2]);*/


function myValidate(paramOption) {
    var defaultOption = {
        id: "form",     //需要检查的表单id
        noHide: true,    //是否检查隐藏项，默认不检查
        errClass: 'err', //检查出错误会在元素上加上的类名
        selfValidate: [],//自定义验证项.一个数组，元素是项目Id，当检查到该元素时执行回调函数selfValidateCallback;
        selfValidateCallback:function ($item) {},
        validateItem: "validate", //自定义属性 查找器,
        valKey: 'name',  //获取值时，返回一个对象集合，此定义一个属性值作为key，name='password' => {password:123}
        errTips: 'mes',  //通过此属性 定义 错误提示
        errCallback: function ($item) { },//验证不通过时 的回调函数;参数是第一个出错的项目对象
    };
    var option = $.extend(true, defaultOption, paramOption);
    var _this = this;
    this.option = option;
    var $form = $("#" + option.id);
    var $item = $form.find("[" + option.validateItem + "]");
    var obj = {
        text: [],
        select: [],
        checkbox: [],
        radio: [],
        textArea: [],
        div: [],
    };
    if ($item.length > 0) {
        $item.each(function (i, o) {
            if (o.tagName == 'INPUT') {
                if (o.type == 'text'||o.type == 'password') {
                    obj.text.push(o);
                }
                if (o.type == 'radio') {
                    obj.radio.push(o);
                }
            };
            if(o.tagName == "INPUT"&&o.type == 'checkbox'){
                obj.checkbox.push(o);
            }
            if (o.tagName == 'DIV') {
                obj.div.push(o);
            };
            if (o.tagName == 'SELECT') {
                obj.select.push(o);
            };
            if (o.tagName == 'TEXTAREA') {
                obj.textArea.push(o);
            };
        })
    }
    //内置正则
    var validatePatterns = {
        // "required": [/^[\S+\s*\S+]+$/ig, "不能为空！"],
        "required": [/^\s*$/g, "不能为空！"],
        "integer": [/^(0|[1-9][0-9]*)$/, "必须为整数！"],
        "numeric": [/^\d+(\.\d+)?$/, "不是合法的数字！"],
        "currency": [/^\d+\.\d{1,2}$/, "不是合法的货币数字！"],
        "email": [/^\w+@\w+(\.\w+)*$/, "不合法的email输入！"],
        "phone": [/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/, "电话不合法！"],
        "password":[/^(\w){6,20}$/,'密码格式只能输入6-20个字母、数字、下划线'],
        "mustChecked": [/0+/g, "checkbox不能为空！"],
        "mustSelected": [/0+/g, "select不能为空！"],
        "ipAddress": [/^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/, "不是有效的IP地址！"],
        "netport": [/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, "不合法的端口！"],
        "mac": [/^[0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}$/, "不合法的mac地址！"],
        "year": [/^(\d{4})$/, "年份不合法！"],
        "mouth": [/^(\d{4})-(0\d{1}|1[0-2])$/, "月份不合法！"],
        "date": [/^{\d}{4}\-{\d}{2}\-{\d}{2}$/, "日期不合法！"],
        "timeHour": [/^(0\d{1}|1\d{1}|2[0-3])$/, "小时不合法！"],  //HH
        "timeMinute": [/^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/, "分钟不合法！"], //HH:mm
        "timeSeconds": [/^(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/, "时间不合法！"], //HH:mm:ss
        // "chineseOnly": [/[^\u4E00-\u9FA5]/g, "输入不合法！请只输入中文！"],
        "chineseOnly": [/[\u4e00-\u9fa5]/g, "输入不合法！请只输入中文！"],
        "mobilePhone": [/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, "手机号不合法！"],
        "specials": [/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>?]{1}[^`~!@$%^&+=\\\][\{\}:;'\,<>?]{0,}$/, "不能输入特殊字符！"],
        "pattern": [null, "数据不合法！请确认"],
        "carCode": [/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/, "车牌号格式不正确"],
        "idCard": [/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, "身份证号格式不正确"],
        'postcode': [/^\d{6}$/, "邮编格式不正确"],
        'longitude': [/^-?((180(\.0{0,6})?)|((\d{1,2}|1[0-7]\d)(\.\d{0,6})?))$/, "不是有效的经度！"],
        'latitude': [/^-?((90(\.0{0,6})?)|((\d|[1-8]\d)(\.\d{0,6})?))$/, "不是有效的纬度！"],
        'digitOrLetter': [/^[A-Za-z0-9]*$/, "格式不正确(只支持数字或字母)"]
    };

    //验证函数
    this.verify = function () {
        var checkAll = true;
        $.each(obj,function (i,itemArr) {
            if(checkAll){
                var type = i;
                $.each(itemArr,function (i,o) {
                    var $o = $(o);
                    if (option.noHide) {
                        if ($o.is(':hidden')) {
                            return true;
                        }
                    }
                    //获取正则与值验证
                    var patten = _this.getPatten($o);
                    var val = _this.getItemData($o,type,true);
                    if(patten&&patten.required&&patten.required.test(val)){
                        _this.showErr(patten);
                        checkAll = false;
                        return false;
                    };
                    if(patten&&patten.reg&&!patten.reg.test(val)){
                        _this.showErr(patten);
                        checkAll = false;
                        return false;
                    };
                    if(patten&&patten.check&&val!=patten.check){
                        _this.showErr(patten);
                        checkAll = false;
                        return false;
                    };
                    if(patten&&patten.len&&!patten.len.test(val)){
                        _this.showErr(patten);
                        checkAll = false;
                        return false;
                    };
                })
            }else {
                return false;
            }
        });
        return checkAll;
    };
    this.showErr = function (patten) {
        var $o = patten.$o;
        var $box = $o;
        if($o[0].type == "checkbox"||$o[0].type == "radio"){
            $box = $o.closest('.form-item-content')
        };
        $box.addClass('err-key');
        setTimeout(function () {
            $box.removeClass('err-key');
        },500)
        console.log(patten.mes);
    };
    /**
     * 功能：或取验证规则
     * self:自定义正则返回的验证对象
     * check：确认密码是否一样，回来的是与之对比的值
     * mes：错误提示
     */
    this.getPatten = function($o) {
        var vldPatterns = $o.attr(option.validateItem).split(';');
        var mes = $o.attr(option.errTips);
        if(vldPatterns.length>0&&vldPatterns[0]){
            var patten = {mes:mes,$o:$o};
            $.each(vldPatterns,function (i,pat) {
                if(validatePatterns[pat]){
                    if(pat=="required"){
                        patten.required = validatePatterns[pat][0];
                    }else {
                        patten.reg = validatePatterns[pat][0];
                    }
                    patten.mes = patten.mes?patten.mes:validatePatterns[pat][1];
                };
                if(pat.indexOf("check")!=-1){
                    var once = $("#"+pat.split(':')[1]).val();
                    patten.check = once
                };
                if(pat.indexOf("self")!=-1){
                    // patten.reg = new RegExp(eval("/"+ $.trim(pat.split(':')[1]) +"/g"));
                    patten.reg = eval( $.trim(pat.split(':')[1]));
                };
                if(pat.indexOf('length')!=-1){
                    var len = eval(pat.split(':')[1]);
                    if(len.length==2){
                        patten.len =eval("/^(\\d){" + len[0] +","+ len[1] + "}$/g");
                    }else {
                        patten.len = eval("/^(\\d){" + len[0] +"}$/g");
                    }
                }
            });
            return patten;
        }else {
            return false
        }
    };

    //获取单个 item的值
    this.getItemData = function ($obj, type,onlyVal) {
        var name = $obj.attr('name');
        var obj = new Object();
        if (type == 'text'||type =="textArea") {
            obj[name] = $.trim($obj.val());
        }
        if (type == 'div') {
            obj[name] =  $.trim($obj.html());
        }
        if (type == 'checkbox') {
            var arr = [];
            $('input[name="'+name+'"]:checked').each(function () {
                arr.push($(this).val());
            });
            obj[name] = arr.join(';');
        }
        if( type =="radio"){
            obj[name] = $("input[name='"+name+"']:checked").val();
        }
        //把 非常规字符转为 空字符
        if(obj[name] == null || obj[name] == "null" || obj[name] == 'NULL' || obj[name] == undefined
        || obj[name] == 'undefined' || obj[name] == 'UNDEFINED') {
            obj[name] =  "";
        }
        if(onlyVal){
            return obj[name]
        }else {
            return obj;
        }
    } ;

    this.getData = function () {
        var data = {};
        if ($item.length > 0) {
            $item.each(function (i, o) {
                var type = 'text';
                if (o.tagName == 'INPUT') {
                    if (o.type == 'text'||o.type == 'password') {
                        type = 'text';
                    }
                };
                if (o.tagName == 'SELECT') {
                    type = 'text';
                };
                if (o.tagName == 'TEXTAREA') {
                    type = 'text';
                };
                if (o.tagName == "INPUT"&&o.type == 'radio') {
                    type = 'radio';
                };
                if(o.tagName == "INPUT"&&o.type == 'checkbox'){
                    type = 'checkbox';
                };
                if (o.tagName == 'DIV') {
                    type = 'div';
                };
                var val = _this.getItemData($(o), type);
                $.extend(data, val);
            })
        }
        return data;
    }
}


 