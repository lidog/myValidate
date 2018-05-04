# myValidate

### 基于jq 写的一个 表单插件；

![Alt 功能模块](https://github.com/lidog/myValidate/blob/master/EgImages/2.png)

![Alt 演示](https://github.com/lidog/myValidate/blob/master/EgImages/eg.gif)

# 使用方法

## 初始化

    var validate = new myValidate({
        id:"perfectData",     //需要检查的表单id
    });


## 初始化配置说明


    defaultOption = {
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

    默认配置都可以通过 配置对应项修改


## 针对业务场景的主要方法；


        //验证表单所有项目 全部通过返回 true
         validate.verify()

        //获取表单值 data 是一个对象
        var data = validate.getFormData();

        //回填数据
        validate.fillData(data);

        //设置禁止修改
        validate.noEdit([name1,name2]);

        //清空表单 默认值要设置 default-checked="true"
        validate.clearData();

        //清空表单推荐使用 type="reset" 表单原属性；
        <form>
            <input  class="btn"  type="reset" value="清空">
        </form>


## html配置；

    要配合 html 使用本插件，下面介绍html主要配置：

### validate

    <div class="form-item">
        <div class="form-item-label">企业名称 :</div>
        <div class="form-item-content"><input validate="chineseOnly;required" name="companyName" type="text" tabIndex="5" mes="企业名称"></div>
        <div class="form-item-state">*</div>
    </div>

    其中 默认带 "validate" 属性的项目会被视为 验证对象；
    你可以通过配置 validateItem: "xxx",修改

    validate 的取值主要有几种方式：

    validate="required"  //此项目为必填

    validate="self:/^\s*$/g;"   //此项目使用自定义正则验证；(使用自定正则，必须加上 mes 属性，所谓错误提示)

    validate="length:[10,20]"   //此项目只允许填入10到20个字符；(中文作为2个字符算)

    validate="chineseOnly;required"  //此项目为必填，并且只能是中文；其中 “chineseOnly”为内置正则代名词；

#### 内置的正则 代名词 有：

        var validatePatterns = {
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

### name

    需要验证的 项目 必须带有 name 属性；
    name 会作为最终 生产的data对象 的key，值为value；
    同时 name 在插件内部也会频繁使用；
    var data = validate.getFormData();
    data = {
        yourName："lidog"
    }
   你可以通过配置 valKey: "xxx",修改

### mes
    此属性定义 错误提示
    你可以通过配置 errTips: "xxx",修改

### default-checked="true"
    带有此属性的项目被设置为 默认选中；如果你使用 type="reset" 的方式 重置表单，则不用；

### form-item-content
    包裹项目的div的class
    你可以通过配置 validateContentName: "xxx",修改


## 待续解决的问题

    * 验证不按照表单的顺序；

