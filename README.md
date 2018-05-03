# myValidate

### 基于jq 写的一个 表单插件；

![Alt 功能模块](https://github.com/lidog/myValidate/blob/master/EgImages/2.png)

![Alt 演示](https://github.com/lidog/myValidate/blob/master/EgImages/eg.gif)

# 使用方法

## 初始化
    <pre><code>

    //初始化
    var validate = new myValidate({
        id:"perfectData",     //需要检查的表单id
    });

    //初始化配置说明

    defaultOption = {
        id: "form",                     //需要检查的表单id
        data: {},                       //初始回填 数据对象
        noEdit: [],                       //设置禁用的项目，由name组成的数组
        noHide: true,                   //是否检查隐藏项，默认不检查
        errClass: 'err',                //检查出错误会在元素上加上的类名
        selfValidate: [],               //自定义验证项.一个数组，元素是项目Id，当检查到该元素时执行对应index回调函数selfValidateCallback;
        selfValidateCallback:[function ($item) {}],
        validateItem: "validate",        //自定义属性 查找器,
        valKey: 'name',                  //获取值时，返回一个对象集合，此定义一个属性值作为key，name='password' => {password:123}
        errTips: 'mes',                 //通过此属性 定义 错误提示
        errCallback: null,              //验证不通过时 的回调函数;参数是第一个出错的项目对象验证信息
    };


    </code></pre>


## 针对业务场景的主要方法；

    <pre><code>

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


    </code></pre>

