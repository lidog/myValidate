/*
 * @Author lizhenhua
 * @version 2018/4/28
 * @description 
 */

/*
 //回填数据
 validate.fillData(data);

 //设置禁止修改
 validate.noEdit([name1,name2]);*/

function myValidate(paramOption) {
    var defaultOption = {
        id: "form",     //需要检查的表单id
        data: {},       //回填数据
        noEdit: [],     //禁止编辑数据
        noHide: true,    //是否检查隐藏项，默认不检查
        errClass: 'err', //检查出错误会在元素上加上的类名
        selfValidate: [],//自定义验证项.一个数组，元素是项目Id，当检查到该元素时执行回调函数selfValidateCallback;
        selfValidateCallback:[function(patten,val) {}],
        validateContentName: "form-item-content", //包裹项目的div的class,
        validateItem: "validate", //自定义属性 查找器,
        valKey: 'name',  //获取值时，返回一个对象集合，此定义一个属性值作为key，name='password' => {password:123}
        errTips: 'mes',  //通过此属性 定义 错误提示
        errTipsClass: 'err-key',  //错误提示的类名
        errCallback: null,//验证不通过时 的回调函数;参数是第一个出错的项目对象验证信息
    };
    var option = $.extend(true, defaultOption, paramOption);
    var _this = this;
    this.option = option;
    var $form = $("#" + option.id);
    var $item = $form.find("[" + option.validateItem + "]");
    var obj = {
        text: [],
        textArea: [],
        select: [],
        checkbox: [],
        radio: [],
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
        "password":[/^(\w){6,20}$/,'只能输入6-20个字母、数字、下划线'],
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
                    //获取正则与 待验证值
                    var patten = _this.getPatten($o);
                    var val = _this.getItemData($o,type,true);
                    var idIndex = option.selfValidate.indexOf($o[0].id);

                    //以下会逐个，判断所有的规则
                    if(patten) {
                        //必填验证 ；validate="required"
                        if (patten.required && patten.required.test(val)) {
                            checkAll = false;
                            patten.mes = patten.requiredMes;
                        };
                        //自定义正则 和 内置正则验证 validate="self:/^(\d){6,20}$/g；email"
                        if (patten.reg&&val!=="") {  //有正则验证，并有值的项目；
                            if (!val.match(patten.reg) || (val.match(patten.reg) == -1)) {
                                //self 正则 与 内置正则 都放在一起处理，消息优先显示自定义 正则
                                patten.mes = patten.selfMes || patten.defaultMes;
                                checkAll = false;
                            }
                        };
                        //长度 验证  validate="length:[a,b]"
                        if (patten.len) {
                            val = val.replace(/[\u0391-\uFFE5]/g, "aa");
                            if (!patten.len.test(val)) {
                                checkAll = false;
                                patten.mes = patten.lenMes;
                            }
                        };
                        //确认对比 验证 check: 源id  validate="check:userPassword"
                        if (patten.check && val != patten.check) {
                            checkAll = false;
                            patten.mes = patten.checkMes;
                        }
                    }

                    //如果是自定义处理，就执行对应处理函数;处理函数应该返回一个bool 值
                    if($o[0].id&&idIndex!=-1){
                        var bool = option.selfValidateCallback[idIndex](patten,val);
                        if(bool==false||bool==true){
                            checkAll = bool;
                        }else {
                            checkAll = true;
                        }
                    }

                    if(!checkAll){
                        //如果有错，就运行 自定义错误函数，或者内置 错误函数;并跳出循环
                        if(option.errCallback){
                            option.errCallback(patten)
                        }else {
                            _this.showErr(patten);
                        }
                        return false;
                    }
                })
            }else {
                return false;
            }
        });
        return checkAll;
    };
    //错误提示函数
    this.showErr = function (patten) {
        var $o = patten.$o;
        var $box = $o;
        if($o[0].type == "checkbox"||$o[0].type == "radio"){
            $box = $o.closest("."+option.validateContentName)
        };
        $box.addClass(option.errTipsClass);
        setTimeout(function () {
            $box.removeClass(option.errTipsClass);
        },500)
        console.log(patten.mes)
    };
    /**
     * 功能：或取验证规则
     * self:自定义正则返回的验证对象
     * check：确认密码是否一样，回来的是与之对比的值
     * mes：错误提示
     * [name]Mes：对应匹配的项目mes
     * required：必填
     */
    this.getPatten = function($o) {
        var vldPatterns = $o.attr(option.validateItem).split(';');
        var mes = $o.attr(option.errTips);
        mes = mes?mes:"";
        var patten = {$o:$o,mes:mes};
        if(vldPatterns.length>0&&vldPatterns[0]) {
            //通过循环 找到所有配置的正则
            $.each(vldPatterns, function (i, pat) {
                if (validatePatterns[pat]) {
                    if (pat == "required") {
                        patten.required = validatePatterns[pat][0];
                        patten.requiredMes = mes + validatePatterns[pat][1];
                    } else {
                        patten.reg = validatePatterns[pat][0];
                        //内置正则优先使用 内置错误提示 ,此时mes 是 项目名称
                        patten.defaultMes = mes + validatePatterns[pat][1];
                    }
                } else if (pat.indexOf("check") != -1) {
                    var once = $("#" + pat.split(':')[1]).val();
                    patten.check = once;
                    patten.checkMes = mes + "不一致";
                } else if (pat.indexOf("self") != -1) {
                    // patten.reg = new RegExp(eval("/"+ $.trim(pat.split(':')[1]) +"/g"));  eval 直接返回正则对象，所以不用new了
                    patten.reg = eval($.trim(pat.split(':')[1]));
                    patten.selfMes = mes;
                } else if (pat.indexOf('length') != -1) {
                    var len = eval(pat.split(':')[1]);
                    if (len.length == 2) {
                        patten.len = eval("/^(\\w){" + len[0] + "," + len[1] + "}$/g");
                        patten.lenMes = "输入长度为" + len[0] + "到" + len[1] + "的字符(中文占2个字符)";
                    } else {
                        patten.len = eval("/^(\\w){" + len[0] + ",}$/g");
                        patten.lenMes = "输入长度为" + len[0] + "的字符(中文占2个字符)";
                    }
                }
            });
        }
        return patten;
    };

    //获取单个 item的值
    this.getItemData = function ($obj, type,onlyVal) {
        var name = $obj.attr('name');
        var obj = new Object();
        if (type == 'text'||type =="textArea"||type=="select") {
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

    //获取表单的所有 项目值，返回data 对象；
    this.getFormData = function () {
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
    
    //回填表单
    this.fillData = function (data) {
        $.each(data,function (i,o) {
            var name = i;
            var target =$form.find('[name="'+name+'"]');
            if(target.length>0){
                if(target.length>1){
                    //checkbox 回填
                    if(target[0].tagName=="INPUT"&&target[0].type=="checkbox"){
                        if(o!=""){
                            var arr = o.split(';');
                            $.each(arr,function (k,val) {
                                $form.find("[name='"+name+"'][value='"+val+"']").prop('checked',true);
                            })
                        }
                    }
                    //radio 回填
                    if(target[0].tagName=="INPUT"&&target[0].type=="radio"){
                        if(o!=""){
                            $form.find("[name='"+name+"'][value='"+o+"']").prop('checked',true);
                        }
                    }
                };
                if(target.length==1){
                    //div 回填
                    if(target[0].tagName=="DIV"){
                        if(o!=""){
                            target.html(o);
                        }
                    }else {
                        target.val(o);
                    }
                };
            }
        })
    };

    //清空表单 推荐使用元素标签 的form 事件<input  class="btn"  type="reset" value="清空">
    this.clearData = function () {
        $item.each(function (i,o) {
            if(o.tagName == "INPUT"){
                if(o.type == "radio"){
                    o.checked= false;
                    $(o).closest(option.validateContentName).find("input[default-checked]").prop("checked",true);
                }else if(o.type=="checkbox"){
                    o.checked = false
                }else {
                    $(o).val('');
                }
            };
            if(o.tagName == "SELECT"){
                $(o).find('option').eq(0).prop('selected',true);
            };
            if(o.tagName == "TEXTAREA"){
                $(o).val('');
            };
            if(o.tagName == "DIV"){
                $(o).html('');
            };
        })
    };

    //设置不可用项目
    this.noEdit = function (arr) {
        $.each(arr,function (i,o) {
            var target = $form.find("[name='"+o+"']");
            setInterval(function () {
                target.attr({
                    readonly:true,
                    disabled:true
                })
            },100)
        })
    };

    //初始化回填表单
    if(JSON.stringify(option.data)!="{}"){
        this.fillData(option.data)
    };

    //初始化设置 禁用
    if(JSON.stringify(option.noEdit)!="[]"){
        this.noEdit(option.noEdit);
    }

}

 