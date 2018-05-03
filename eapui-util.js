/**
 * 公用方法
 * @author zhc
 */

UI.util = new function() {
		
	/**
	 * 获取页面唯一的uuid
	 */
	this.guid = (function() {
		var counter = 0;
		
		return function(prefix){
			var guid = (+new Date()).toString(32);
			for(i = 0; i < 5; i++){
				guid += Math.floor( Math.random() * 65535 ).toString( 32 );
			}
			return (prefix || '') + guid + (counter++).toString( 32 );
		}; 
	})();
	
	/**
	 * 空函数
	 */
	this.noop = function(){}
	
	/**
	 * 获取页面链接参数
	 * @param name 参数的key值
	 */
	this.getUrlParam = function(name){
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (!results) { 
			return ''; 
		}
		return decodeURIComponent(results[1]) || '';
	};
	
	/**
	 * 对象深度克隆
	 * @param obj 克隆对象
	 */
	this.clone = function(obj){  
		    var o, obj;  
		    if (obj.constructor == Object){  
		        o = new obj.constructor();   
		    }else{  
		        o = new obj.constructor(obj.valueOf());   
		    }  
		    for(var key in obj){  
		        if ( o[key] != obj[key] ){   
		            if ( typeof(obj[key]) == 'object' ){   
		                o[key] = this.clone(obj[key]);  
		            }else{  
		                o[key] = obj[key];  
		            }  
		        }  
		    }  
		    o.toString = obj.toString;  
		    o.valueOf = obj.valueOf;  
		    return o;  
	};
	
	/**
	 * 进度条
	 * @param text 提示内容
	 */
	this.progressbar = function(option){
		var options = $.extend({
				elem: $(document.body),
				html: '<div class="progress-wrap">'+
						'<div class="progress w80 m0 mr10" style="display:inline-block;vertical-align:middle;"><div class="progress-bar"></div></div>'+
						'<span class="percentage"></span>'+
					'</div>',
				level1:60,
				level2:90,
				colorL1:'#0078d7',
				colorL2:'#F2AF00',
				colorL3:'#D70000',
				callback: function(){
					
				}
        }, option);
		
		var progressbar = $(options.elem);
		
		progressbar.append(options.html);
		
		return {
			setValue: function ( percent ){
				if(percent<=100){
					var color = '';
					var $progressBar = progressbar.find('.progress-bar'),
					$progressPercent = progressbar.find('.percentage');
					if ( percent <= options.level1 ) {
						color = options.colorL1;
					} else if ( percent > options.level1 && percent < options.level2 ) {
						color = options.colorL2;
					}else{
						color = options.colorL3;
					}
					$progressBar.css({'width':percent +'%', 'background':color});
					$progressPercent.html(percent +'%');
				}
			}
		}
		
	}
	
	/**
	 * tab切换
	 * @param text 提示内容
	 */
	this.tabs = function(){
		
		$("[tabs-control]").click(function(){
			var $this = $(this);
			var tabControl = $this.attr("tabs-control");
			$this.addClass("active").siblings().removeClass("active");
			$(tabControl).addClass("active").siblings().removeClass("active");
		});
	}
	
	
	/**
	 * 页面浮动提示框，在顶层页面显示
	 * @param text 提示内容
	 * @param type  
	 */
	this.alert = function(text, type){
		if(window.top.UI && window != window.top){
			//在顶层页面弹出
			window.top.UI.util.alert(text, type);
			return ;
		}
		
		var html = '<div class="notify-wrapper alert-wrapper ' + (type || '') + '">' +
				   '    <iframe frameborder="no" border="0"></iframe>' + 
				   '	<div class="notify">' +
				   '        <div class="notify-content">' + text + '</div>' +
				   '	</div>' +
				   '</div>';
		
		var $notify = $(html);
		
		var parentBody = $(document.body);
		
		//显示窗口，点击移出窗口
		
		$notify.click(function(){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		}).appendTo(parentBody).fadeIn();
		
		//5秒后移出窗口
		setTimeout(function(){
			$notify.fadeOut(function(){
				$(this).remove();
			});
		}, 5000);
		var left = $notify.width() / 2;
		$notify.css({'margin-left': -left + 'px'});
	};
	
	/**
	 * 页面确认提示框，在顶层页面显示
	 * @param text {String} 提示内容
	 * @param okcallback {Function} 确定后回调
	 * @param cancelcallback {Function} 取消后回调
	 */
	this.confirm = function(text, okcallback, cancelcallback){
		var returnObj = null;
		if(window.top.UI && window != window.top){
			//在顶层页面弹出
			window.top.UI.util.confirm(text, okcallback, cancelcallback);
			return ;
		}
		
		var html = '<div class="notify-layer"></div>'+
			       '<div class="notify-wrapper confirm-wrapper">' +
				   '    <iframe frameborder="no" border="0"></iframe>' + 
				   '	<div class="notify">' +
				   '        <div class="notify-content">' + text + '</div>' +
				   '		<div class="confirm-btns"><button class="btn mr10 btn-primary notify-confirm">确定</button><button class="btn btn-gray notify-cancel">取消</button></div>'+
				   '	</div>' 
				   '</div>';
		
		var $notify = $(html);
		
		var parentBody = $(document.body);
		
		//显示窗口，点击移出窗口
		
		$notify.appendTo(parentBody).fadeIn();
		parentBody.find('.notify-confirm').focus();
		$notify.find(".notify-confirm").click(function(){
			
			$notify.remove();
			
			if(okcallback){
				returnObj = okcallback();
			}
			
		});
		
		$notify.find(".notify-cancel").click(function(){
			
			$notify.remove();
			
			if(cancelcallback){
				returnObj = cancelcallback();
			}
		});
		
		var $confirmWrapper = $notify.find('.confirm-wrapper');
		var left = $confirmWrapper.width() / 2;
		$confirmWrapper.css({'margin-left': -left + 'px'});
		return returnObj;
	}
	
	
	/**
	 * 页面确认提示框，在顶层页面显示
	 * @param title {String} 提示内容
	 * @param renderHtml {String} 表单内容 
	 * @param okcallback {Function} 确定后回调
	 * @param cancelcallback {Function} 取消后回调
	 */
	this.prompt = function( options ){
		
		var defaultValidate = "required";
		var defaultVtext = '输入域';
		
		var defaultForm = '<div class="form-group default">'+
				'<input class="form-control ml5" name="PROMPT_NAME" id="PROMPT_NAME" type="text" maxlength="100" ui-validate="'+ defaultValidate +'" ui-vtext="'+ defaultVtext +'">'+
				'</div>'; 
		
		var opts = $.extend({
			title : '',
			renderHtml: defaultForm,
			defaultValidate : defaultValidate,
			defaultVtext : defaultVtext,
			okcallback: function(){},
			cancelcallback : function(){},
			okText : '确定',
			cancelText: '取消'
		}, options);
		
		var returnObj = null;
		
		if(window.top.UI && window != window.top){
			//在顶层页面弹出
			window.top.UI.util.prompt(opts);
			return ;
		}
		
		var html = '<div class="notify-layer"></div>'+
	       '<div class="notify-wrapper confirm-wrapper notify-form">' +
		   '    <iframe frameborder="no" border="0"></iframe>' + 
		   '	<div class="notify">' +
		   '        <div class="notify-title">'+ opts.title +'</div>'+
		   '        <div class="notify-content prompt-form">' + opts.renderHtml + '</div>' +
		   '		<div class="confirm-btns"><button class="btn mr10 btn-primary notify-confirm">'+ opts.okText +'</button><button class="btn btn-gray notify-cancel">'+ opts.cancelText +'</button></div>'+
		   '	</div>' 
		   '</div>';

			var $notify = $(html);
			
			var parentBody = $(document.body);
			
			//显示窗口，点击移出窗口
			var params = '';
			
			$notify.appendTo(parentBody).fadeIn();
			parentBody.find('.notify-confirm').focus();
			$notify.find(".notify-confirm").click(function(){
				
				if(UI.util.validateForm($('.prompt-form'))) {
					params = UI.util.formToBean($('.prompt-form'));
					
					if(opts.okcallback){
						returnObj = opts.okcallback(params);
					}
					
					if( returnObj ){
						$notify.remove();
					}
				}
				
			});
			
			$notify.find(".notify-cancel").click(function(){
				
				if(opts.cancelcallback){
					returnObj = opts.cancelcallback();
				}
				
				$notify.remove();
			});
			
			var $confirmWrapper = $notify.find('.confirm-wrapper');
			var left = $confirmWrapper.width() / 2;
			$confirmWrapper.css({'margin-left': -left + 'px'});
			return returnObj;
					
	}
	
	
	/**
	 * 控制台打印输出
	 * @param info 输出信息
	 */
	this.debug = function(info){
		try{
			if(console != undefined && console != null && console.info){
				console.info(info);
			}
		}catch (e) {
		}
	};
	
	/**
	 * 将null，undefined类型 转换为空字符串
	 */
	this.strToString = function(string) {
		if (string == null || string == "null" || string == 'NULL' || string == undefined
				|| str == 'undefined' || str == 'UNDEFINED') {
			return "";
		}
		
		return string;
	}
	
	/**
	 * 弹出模态窗口
	 */
	this.openModelWindow = function(url, model, width, height){

	    var top = (window.screen.availHeight - 30 - height)/2; 	
	    var left = (window.screen.availWidth - 10 - width)/2; 	
	  	return window.showModalDialog(url, model, calcDialogPosition(width, height));
	    
	}
	
	/**
	 * 打开弹出窗口
	 */
	this.openWindow = function(url,title, width, height){

	    var top = (window.screen.availHeight - 30 - height)/2; 	
	    var left = (window.screen.availWidth - 10 - width)/2;
	    return window.open(url,title,"height=" + height + ", width=" + width + ", left=" + left + ", top=" + top + ", toolbar =no, menubar=no, resizable=yes, location=no, status=no, border=no");
	    
	}

	function calcDialogPosition(dialogWidth, dialogHeight) {
	    var iWidth = dialogWidth;
	    var iHeight = dialogHeight;
	    var iTop = (window.screen.availHeight - 20 - iHeight) / 2;
	    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
	    return 'dialogWidth:' + iWidth + 'px;dialogHeight:' + iHeight + 'px;dialogTop: ' + iTop + 'px; dialogLeft: ' + iLeft + 'px; center:yes; scroll:no; status:no; resizable:0; location:no';
	}
	
	/**
	 * 兼容 ie firefox 获取 iframe window
	 */
	this.getIFrameWindow = function(elem, id){
		if(elem.frames){
			elem.frames[id].window;
		}
		return elem.getElementById(id).contentWindow;
	}
	
	function getFormValue($elem){
		var type = $elem.attr("type") || $elem[0].tagName;
		
		if(type == "radio"){
			if($elem.is(":checked")){
				return $elem.val();
			}
		} else if(type == "checkbox"){
			if($elem.is(":checked")){
				return $elem.val();
			}
		} else if(type == "ui-rating") {
			return $elem.rating("getValue");
			
		} else if(type == "ui-switch") {
			return $elem.uiswitch("getValue");
			
		} else if(type == "dropdown-tree") {
			return $elem.find(".tree-title").attr("title");
			//return $elem.dropdowntree("getSelectIds");
		} else if(type == "filtertag") {
			return $elem.filtertag("getSelectFilter");
			
		} else if( type == "SELECT" || type == "select"){
			var value = $elem.val();
			
			if( Object.prototype.toString.call(value).toLowerCase() == '[object array]'){

				var value = value.join(',');
			}
			return value;
			
		}else {
			return $elem.val();
		}
		return null;
	}
	/**
	 * 传进来一个form对象,将这个form对象的元素转成一个bean,如果包含属性ui-ignore则忽略该表单项
	 */
	this.formToBean = function($form){

		var bean = {};
		
		var checkedValue = 1;
		 
		$form.find("input, select, textarea, .ui-rating, .ui-switch, .dropdown-tree, .filtertag").each(function(){
			if($(this).is("[ui-ignore]")){
				return ;
			}
			var name = $(this).attr("name");
			var type = $(this).attr("type") || $(this)[0].tagName;
			
			if(type == "button" || type == "reset" || type == "submit"){
				return ;
			}

			var value = getFormValue($(this));
			
			if(value != null){
				if(typeof value == 'string'){
					value = $.trim(value);
				}
				if(type == 'checkbox'){
					if(bean[name] == undefined){
						bean[name] = value;
					} else {
						bean[name] += ',' + value;
					}
				} else {
					bean[name] = value;
				}
			}
		});

		return bean;
	}
	
	/**
	 * 绑定表单
	 */
	this.bindForm = function($form, formData) {
		
		var checkedValue = 1;
			 
		$form.find("input,textarea,select,.ui-rating,.ui-switch,.dropdown-tree,.filtertag,img").each(function(){
			var name = $(this).attr("name"),
				id   = $(this).attr('id') ;
			var type = $(this).attr("type") || $(this)[0].tagName;
			
			if(type == "button" || type == "reset" || type == "submit" || name == ''){
				return ;
			}
			
			if(formData[name] == undefined || formData[name] == null){
				return ;
				//formData[name] = '';
			}
			
			if(type == "radio"){
				if($(this).val() == formData[name]){
					$(this).prop("checked", true);
				}
			} else if(type == "checkbox"){
				var value = formData[name];
				if(value.length > 0 /*&& value.indexOf(',') != -1*/){//mod by linsj 20160418
					var temp = value.split(',');
					var $pre = $(this).parent().parent();
					for ( var i = 0; i < temp.length; i++) {
						var input = $pre.find('input[type="checkbox"][name="'+name+'"][value="'+temp[i]+'"]');
						input.prop("checked", true);
						/*if(input.length == 0){
								var html = '<label class="checkbox-inline"><input type="checkbox" '
										+ 'value="' + temp[i] + '" ' + 'name="' + name
										+ '"><em>' + temp[i] + '</em></label>';
								$pre.append(html);
						} else {
							$('input[type="checkbox"][value="'+temp[i]+'"]').prop("checked", true);
						}*/
					}
				}
				
				/*if(checkedValue == formData[name]){
					$(this).prop("checked", true);
				}*/
			} else if(type == "ui-rating") {
				$(this).rating("setValue", formData[name]);
				
			} else if(type == "ui-switch") {
				$(this).uiswitch("setValue", formData[name]);
				
			} else if(type == "dropdown-tree") {
				//to be implement
			} else if(type == "filtertag") {
				
			} else if(type == 'img'){
				
				$(this).attr("src", formData[name]);
				
			} else if( $(this).attr('multiple')=='multiple' ){
				
				UI.control.getControlById(id).setMultiValue(formData[name]);
				
			} else if( $(this).hasClass("select2-offscreen") ) {
				
				$(this).select2("data", formData[name]);
				
			} else {
				
				$(this).val(formData[name]);
				
			}
		});
		
	}
	
	var validatePatterns = { 
		"required":     [/^[\S+\s*\S+]+$/ig, "不能为空！"],
		"integer":      [/^(0|[1-9][0-9]*)$/, "必须为整数！"],	
		"numeric":      [/^\d+(\.\d+)?$/, "不是合法的数字！"],
		"currency":     [/^\d+\.\d{1,2}$/, "不是合法的货币数字！"],
		"email":        [/^\w+@\w+(\.\w+)*$/, "不合法的email输入！"],
		"phone":        [/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/, "电话不合法！"],
		"mustChecked":  [/0+/g, "checkbox不能为空！"],
		"mustSelected": [/0+/g, "select不能为空！"],
		"ipAddress":    [/^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/, "不是有效的IP地址！"],
		"netport":      [/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, "不合法的端口！"],
		"mac":          [/^[0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}[-][0-9,a-f,A-F]{2}$/, "不合法的mac地址！"], 
		"year":         [/^(\d{4})$/, "年份不合法！"],
		"mouth":		[/^(\d{4})-(0\d{1}|1[0-2])$/, "月份不合法！"],
		"date":         [/^{\d}{4}\-{\d}{2}\-{\d}{2}$/, "日期不合法！"],
		"timeHour":		[/^(0\d{1}|1\d{1}|2[0-3])$/, "小时不合法！"],  //HH
		"timeMinute":	[/^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/, "分钟不合法！"], //HH:mm
		"timeSeconds":  [/^(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/, "时间不合法！"], //HH:mm:ss
		"chineseOnly":	[/[^\u4E00-\u9FA5]/g, "输入不合法！请只输入中文！"],
		"mobilePhone":  [/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, "手机号不合法！"],
		"specials":     [/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>?]{1}[^`~!@$%^&+=\\\][\{\}:;'\,<>?]{0,}$/, "不能输入特殊字符！"],
		"pattern":      [null, "数据不合法！请确认"],
		"carCode":      [/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/, "车牌号格式不正确"],
		"idCard":       [/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, "身份证号格式不正确"],
		'postcode':     [/^\d{6}$/, "邮编格式不正确"],
		'longitude':    [/^-?((180(\.0{0,6})?)|((\d{1,2}|1[0-7]\d)(\.\d{0,6})?))$/, "不是有效的经度！"],
		'latitude':     [/^-?((90(\.0{0,6})?)|((\d|[1-8]\d)(\.\d{0,6})?))$/, "不是有效的纬度！"],
		'digitOrLetter':[/^[A-Za-z0-9]*$/,"格式不正确(只支持数字或字母)"]
	};
	
	/**
	 * 表单验证
	 * ui-validate 属性， minlength, maxlength,min (最小值),max (最大值)
	 * 如果不需要验证隐藏项，flag需要传递值，默认不传值，兼容适用于tab页面切换的情况
	 */
	this.validateForm = function($form,flag){
		
		var checkAll = true;
		$form.find("[ui-validate]").each(function(){
			if(flag){
				if($(this).is(':hidden')){
					return ;
				}
			}
			var validate = $(this).attr("ui-validate");
			
			var pattern = $(this).attr('ui-pattern');
			
			var objectReg = new RegExp(/\{.*\}/g);
			
			var name = $(this).attr("name");
			
			var vtext = $(this).attr("ui-vtext");
			
			var type = $(this).attr("type") || $(this)[0].tagName;
			
			if(vtext == undefined || vtext == null || vtext == ''){
				vtext = name;
			}
			
			var value = $.trim(getFormValue($(this)));

			function getPattern(p){
				var reg = null;
				p = $.trim(p);
				if(p == "pattern") {
					reg = [eval("/" + pattern + "/i"), validatePatterns["pattern"][1] ];
				} else {
					reg = validatePatterns[p];  
				}
				if(reg == null) {

					var msg = "[" + vtext + "]验证Pattern配置错误：" + p;
					UI.util.alert(msg, 'warn');

					throw new Error(msg);
				}
				return reg;
			}
			
			var pats = null;
			var allPatterns = '';
			if(objectReg.test(validate)){
				validate = eval("(" + validate + ")");
				
				if(validate.min && !isNaN(validate.min) && value != ''){
					if(value < validate.min){
						UI.util.alert("[" + vtext + "]不能小于" + validate.min, "warn");
						$(this).focus();
						checkAll = false;
						return false;
					}
				}
				
				if(validate.max && !isNaN(validate.max) && value != ''){
					if(value > validate.max){
						UI.util.alert("[" + vtext + "]不能大于" + validate.max, "warn");
						$(this).val(validate.max);
						$(this).focus();
						checkAll = false;
						return false;
					}
				}
				if(validate.minlength && !isNaN(validate.minlength) && value != ''){
					if(value.length < validate.minlength){
						UI.util.alert("[" + vtext + "]不能少于" + validate.minlength + "个字符！", "warn");
						$(this).focus();
						checkAll = false;
						return false;
					}
				}
				
				if(validate.maxlength && !isNaN(validate.maxlength) && value != ''){
					//中文字符算两个字符，英文和数字算一个字符
					var len = value.length;
					var blen = 0; 
					for(i=0; i<len; i++) { 
						if ((value.charCodeAt(i) & 0xff00) != 0) { 
							blen ++; 
						} 
						blen ++; 
					}
					if(blen > validate.maxlength){
						UI.util.alert("[" + vtext + "]不能超过" + validate.maxlength + "个字符！", "warn");
						$(this).focus();
						checkAll = false;
						return false;
					}
				}
				
				if(validate.pattern){
					pats = validate.pattern.split(",");
				}
				
				allPatterns = validate.pattern;
			} else {
				pats = validate.split(",");
				
				allPatterns = validate;
			}
			
			if(allPatterns != null && allPatterns.indexOf("required") >= 0 || value != '') {
				if(pats != null){
					for(var i = 0; i < pats.length; i++){
						
						var reg = getPattern(pats[i]);
						if(!value.match(reg[0]) || (value.match(reg[0])==-1) && type =="SELECT"){
							var vinfo = $(this).attr("ui-vinfo");
							if(vinfo == undefined || vinfo == null || vinfo == ''){
								vinfo = "[" + vtext + "]" + reg[1];
							}
							UI.util.alert(vinfo, "warn");
							checkAll = false;
							return false;
						}
					}
				}
			}
			
		});
		
		return checkAll;
	}
	
			
	var showDialog = {};
	
	var commonWindowCallback = [];
	
	var windowStack = [];
	/**
	 * 显示弹出窗口
	 * @isOcx true：关闭ocx
	 * @parentFrame currentPage 弹窗在当前框架; top弹窗在最外层框架
	 * @windowType 窗体所在位置 left,middle,right;默认middle
	 */
	this.openCommonWindow = function(params){
		if(params.width == undefined || params.width == null){
			params.width = '50%';
		}
		if(params.height == undefined || params.height == null){
			params.height = '100%';
		}
		var defaults = { 
				src: '',
				title: '',
				width: 600,
				height: 400,
				callback: function(){},
				overlay:true,
				overlayClickClose: false,
				parentFrame:'top',
				isOcx: true,
				isCache: false,
				isDrag: false,
				windowType: 'middle',
				icon: '',
				top:'0',
				left:'0'
	        };
		params = $.extend(true, defaults, params);
		if(params.windowType != 'middle'){
			params.overlayClickClose = true;
		}
	    
		if(window.top.UI && window != window.top){
			if(params.parentFrame == 'top'){
				window.top.UI.util.openCommonWindow(params);
				return ;
			}
		}
		
		var contentHtml = '';
		var windowId = '';
		if(typeof params.src == 'string'){
			contentHtml = "<iframe name='windowIframe' src='"+params.src+"' style='width:100%; height:100%;border:0;' frameborder='0'></iframe>";
			windowId = params.src;
		} else {
			contentHtml = params.src.html;
			windowId = params.src.id;
        }
		if(showDialog[windowId]){
			if( params.isOcx ){
        		$(".ocx").hide();
        		$('[frameocx] iframe').contents().find(".ocx").hide();
        	}
			showDialog[windowId].dialog.show();
			
		} else {
			showDialog[windowId] = {
					dialog: $.Dialog({
				        shadow: false,
				        overlay: params.overlay,
				        flat: true,
				        draggable: params.isDrag,
				        icon: params.icon,
				        title: params.title,
				        width: params.width,
				        height: params.height,
				        padding: 0,
				        windowType: params.windowType,
				        top:params.top ,
				        overlayClickClose: params.overlayClickClose,
				        onShow: function(_dialog){
				            var content = _dialog.children('.content');
				            
				            content.html(contentHtml);
				            if( params.isOcx ){
				        		$(".ocx").hide();
				        		$('[frameocx]').contents().find(".ocx").hide();
				        	}
				        },
				        onBeforeClose: function(_dialog){
				        	if( params.isOcx ){
				        		$(".ocx").show();
				        		$('[frameocx]').contents().find(".ocx").show();
				        	}
				        	if(!showDialog[windowId].isCache){
				        		//解决ie下iframe输入框焦点丢失的问题
				        		_dialog.find("iframe").remove();
				      //  		$(this).remove(); 
								delete showDialog[windowId];
							}
				        },
				        isCloseRemove: !params.isCache
					}),
					isCache: params.isCache
				};
			
		}
		windowStack.push(windowId);
			
		commonWindowCallback.push(params.callback);
	}
	/**
	 * 显示弹出窗口
	 * @isOcx true：关闭ocx
	 */
	this.showCommonWindow = function(src, title, width, height, callback, type, isOcx, isCache, isDrag, icon){
		
		if(window.top.UI && window != window.top){
			if(!type || type != 'currentPage'){
				window.top.UI.util.showCommonWindow(src, title, width, height, callback, type, isOcx, isCache, isDrag, icon);
				return ;
			}
		}
		
		/*if(showDialog){
			this.closeCommonWindow();
		}*/
		var contentHtml = '';
		var windowId = '';
		if(typeof src == 'string'){
			contentHtml = "<iframe name='windowIframe' src='"+src+"' style='width:100%; height:100%;border:0;' frameborder='0'></iframe>";
			windowId = src;
		} else {
			contentHtml = src.html;
			windowId = src.id;
        }
		
		if(showDialog[windowId]){
			if( isOcx ){
        		$(".ocx").hide();
        		$('[frameocx] iframe').contents().find(".ocx").hide();
        	}
			showDialog[windowId].dialog.show();
			
		} else {
			showDialog[windowId] = {
					dialog: $.Dialog({
				        shadow: true,
				        overlay: true,
				        flat: true,
				        draggable: isDrag == undefined || isDrag == null ? false : isDrag,
				        icon: icon || '',
				        title: title,
				        width: width,
				        height: height,
				        padding: 0,
				        sysButtons: {
				        	btnMax: true,
				        	btnClose:true
			            },
				        onShow: function(_dialog){
				            var content = _dialog.children('.content');
				            
				            content.html(contentHtml);
				            if( isOcx ){
				        		$(".ocx").hide();
				        		$('[frameocx] iframe').contents().find(".ocx").hide();
				        	}
				        },
				        onBeforeClose: function(_dialog){
				        	if( isOcx ){
				        		$(".ocx").show();
				        		$('[frameocx] iframe').contents().find(".ocx").show();
				        	}
				        	if(!showDialog[windowId].isCache){
				        		//解决ie下iframe输入框焦点丢失的问题
				        		_dialog.find("iframe").remove();
				      //  		$(this).remove(); 
								delete showDialog[windowId];
							}
				        },
				        isCloseRemove: isCache == undefined ? true : !isCache
					}),
					isCache: isCache
				};
			
		}
		windowStack.push(windowId);
			
		commonWindowCallback.push(callback);
	}
	
	/**
	 * 窗口返回的回调函数
	 */
	this.returnCommonWindow = function(){
		if(commonWindowCallback.length > 0){
			callback = commonWindowCallback.pop();
			callback.apply(this, arguments);
		}
	};
	
	/**
	 * 隐藏弹出窗口
	 */
	this.closeCommonWindow = function(){
		
		 var windowId = windowStack.pop();
		 if(!showDialog[windowId].isCache){	
				
			showDialog[windowId].dialog.close();	
				
			delete showDialog[windowId];
				
		} else {
			showDialog[windowId].dialog.close();
		}
	};
	/**
	 * 代理执行;当有样式disable时不执行
	 */
	this.disableProxy = function(func, scope, authority){
		
		if($(scope).hasClass("disable") || $(scope).hasClass("disable-permission")){
			return false;
		}
		return func.call(scope);
	}
	
	/**
	 * showLoadingPanel 显示加载面板…
	 */
	this.showLoadingPanel = function(process,type){
		
		if(window.top.UI && window != window.top){
			if(!type || type != 'currentPage'){
				window.top.UI.util.showLoadingPanel(process);
				return ;
			}
		}
		
		if($(document.body).find('.bg-loading').length == 0){
			var html = '<div class="bg-loading full-screen" style="display: none;"><div class="gif-loading"></div></div>';
			var $loading = $(html);
			var parentBody = $(document.body);
			$loading.appendTo(parentBody).show();
		}
	
//		if(UI.util.isInt(process)){
//			process = process +'%'
//		}
		$(document.body).find('.gif-loading').html( process);
	};
	
	/**
	 * showLoadingPanel 隐藏加载面板…
	 */
	this.hideLoadingPanel = function(type){
		
		if(window.top.UI && window != window.top){
			if(!type || type != 'currentPage'){
				window.top.UI.util.hideLoadingPanel();
				return ;
			}
		}
		
		var $loading = $(document.body).find('.bg-loading');
		$loading.fadeOut(function(){
			$loading.remove();
		});
		
	};
	this.isInt = function(str) {
		if(str.length>=10){
			return false;
		}
		var er = /^\d+$/;
		return er.test(str);
	}
	
	/**
	 * showCommonIframe 显示ifrmae…
	 */
	this.showCommonIframe = function(object,url){
		$(object).find('iframe').attr("src", url);
		$(object).show();
	}
	
	/**
	 * hideCommonIframe 隐藏ifrmae…
	 */
	this.hideCommonIframe = function(object,callback){
		
		var returnObj = null;
		
		if(callback){
			returnObj = callback();
		}
		
		$(object).find('iframe').attr("src", '');
		$(object).hide();
		
		return returnObj;
	}
	
	
	/**
	 * 格式化数字  如：1435454   格式化后：1,435,454
	 * */
	this.renderNumber = function (num){
		var ret = "";
		ret += num;
		if(num!=null && num!=''){
			ret = ret.split("").reverse().join("").replace(/(\d{3})(?=[^$])/g, "$1,").split("").reverse().join("");
		}
	    return ret;  
	}

	
	
	this.loadImage = function(img, altUrl, timeout, callback) {
		
		var timer, url = img.src , imgload = true;
		
		if( !altUrl ){
			altUrl = '/ui/plugins/eapui/img/nophoto.jpg';
		}
		
		function clearTimer() {
			if (timer) {                
				clearTimeout(timer);
				timer = null;
			}
		}

		function handleFail() {	
			
			clearTimer();
			
			img.src = altUrl;
			
			imgload = false ;
			
		}

		img.onerror = img.onabort = handleFail;
		
		img.onload = function() {
			clearTimer();
		};
		
		timer = setTimeout(function() {	
			
			handleFail();
			
			if( imgload == true ){
				callback();
			}
			
		}, timeout);
		
	}
	
	//isSpace 表示所选开始时间是否大于前space天，
	this.timeLinkage = function(options){
		var defaults = {
			begin: '',
			end: '',
			space: 6,
			format: 'yyyy-MM-dd'
		}
		var options = $.extend(true, defaults, options);
		
		options.begin = options.begin.replace(/\-/g, "/");
		options.end = options.end.replace(/\-/g, "/");
		
		var begin = new Date(options.begin);
	    var end = new Date(options.end);
	    
	    var now = new Date();
		var spaceDate = new Date(now.getTime() - options.space * 24 * 3600 * 1000);
		
		var isSpace = begin.getTime() > spaceDate.getTime();
		
	    var time = end.getTime() - begin.getTime();
    	time = Math.floor(time/(24*3600*1000));
	    if(begin.getTime() > end.getTime() || time > options.space){
	    	begin.setDate(begin.getDate() + options.space);
	    	if(isSpace){
	    		begin = new Date();
	    	}
	    	newDate = begin.format(options.format);
			return {
					isSpace : isSpace,
					newDate: newDate
				};
		}else{
			options.end = options.end.replace(/\//g, "-");
			return {
				isSpace : isSpace,
				newDate: options.end
			};
		}
	}
	
	
	
	/**
	 * getDateTime
	 */
	this.getDateTime = function(obj, format) {    
		var defaultDateFromat = "yyyy-MM-dd",result = {},desc=[];
		var dateTime = new Array(),  
			bt = new Date(), 
			et = new Date(),
			_weekday = bt.getDay(),
			_monthday = bt.getDate(),
			y = bt.getFullYear(),
			m = bt.getMonth() + 1,
			endDay = new Date(y,m,0).getDate();
		
		if (_weekday == 0) {
			_weekday = 7;
		}   
		desc = getDescByDay();
		if ( obj == 'yesterday') {    
			bt.setDate(bt.getDate() - 1);
			et.setDate(et.getDate() - 1);
			desc = getDescByDay();
		} else if (obj=="thisWeek") {         
			bt.setDate(bt.getDate() - (_weekday - 1));
			desc = getDescByWeek();
		} else if (obj=="thisFullWeek"){
			bt.setDate(bt.getDate() - (_weekday - 1));
			et.setDate(et.getDate() + (7 - _weekday));
			desc = getDescByWeek();
		} else if (obj=="lastWeek") {  
			bt.setDate(bt.getDate() - 7 + (1 - _weekday));
			et.setDate(et.getDate() - _weekday);
			desc = getDescByWeek();
		} else if (obj=="thisMonth") {          
			bt.setDate(bt.getDate() + (1 - _monthday));
			desc = getDescByMonth(endDay);
		} else if(obj=="thisFullMonth"){
			bt.setDate(bt.getDate() + (1 - _monthday));
			et.setDate(endDay);
			desc = getDescByMonth(endDay);
		}else if (obj=="lastMonth") { 
			endDay = new Date(y,m-1,0).getDate();
			bt.setMonth(bt.getMonth() - 1);  
			et.setMonth(et.getMonth());   
			var _dayNum = (et - bt) / ( 24 * 60 * 60 * 1000);
			bt.setDate(bt.getDate() + (1 - _monthday));
			et.setDate(et.getDate() - _monthday);  
			desc = getDescByMonth(endDay);
		} else if (obj=="thisYear") { 
			bt = new Date(et.getFullYear() + "-01-01");
			desc = getDescByYear();
		} 
		
		
		if (!format){
			format = defaultDateFromat;
		}
		var bT = bt.format(format);    
		var eT = et.format(format);   
		
		if(format == "yyyy-MM-dd HH:mm:ss" ){
			bT = bt.format(defaultDateFromat + ' 00:00:00');
			eT = et.format(defaultDateFromat + ' 23:59:59');
		}
		
		function getDescByMonth( endDay){
			var rest = [];
			for(var i = 1 ; i <= endDay ; i++ ){
				rest.push(i + "号");
			}
			return rest;
		}
		function getDescByDay(){
			var rest = [];
			for(var i = 0 ; i <= 23 ; i++ ){
				rest.push(i + "时");
			}
			return rest;
		}
		function getDescByWeek(){
			var rest = ['周一','周二','周三','周四','周五','周六','周日'];
			return rest;
		}
		function getDescByYear() {
			var rest = [];
			for (var i = 1;i <= 12;i++) {
				rest.push(i + "月");
			}
			return rest;
		}
		result = {
				bT : bT,
				eT : eT,
				desc : desc
			}
		UI.util.debug(result);
		return result;  
	}
	
	this.getOnDateTypeSearch = function(DType,SType, amount){
		//DType日期类型
		//SType搜索类型
		var cDate = new Date();
		cDay = cDate.getDate();
		cDate.setDate(cDay-1);
		
		cYear = cDate.getFullYear();
		cMonth = cDate.getMonth()+1;
		cDay = cDate.getDate();
		
		eT = cDate.format('yyyy-MM-dd 23:59:59');
		
		if( DType=="year" ){
			cDate.setYear(cYear + amount);
		}else if( DType=="month" ){
			cDate.setMonth(cMonth + amount-1);
		}else if( DType=="day" ){
			cDate.setDate(cDay + amount);
		}
		lYear = cDate.getFullYear();
		lMonth = cDate.getMonth()+1;
		lDay = cDate.getDate();
		bT = cDate.format('yyyy-MM-dd 00:00:00');
		var result = {
				bT : bT,
				eT: eT,
				desc:[]
			};
		
		if( SType=="day" ){
			cDate.setMonth(cDate.getMonth()+1, 1); 
			cDate.setDate(0);
			mT = cDate.getDate();//上一个月最后一天
			for(var i=lDay; i<=mT; i++){
				result.desc.push(lMonth + '月' + i + '号');
			}
			for(var i=1;i<=cDay;i++){
				result.desc.push(cMonth + '月' + i + '号');
			}
		}else if(SType=='month'){
			for(var i=lMonth;i<=12;i++){
				result.desc.push(lYear + '年' + i + '月');
			}
			for(var i=1;i<=cMonth;i++){
				result.desc.push(cYear + '年' + i + '月');
			}
		}else if(SType=='season'){
			if(DType=='year'){
				var len = Math.abs(amount);
			}else if(DType=='month'){
				amount = Math.abs(amount);
				var len = amount/12;
			}
			for(j=0; j<len; j++){
				for(var i=1; i<=12; i=i+3){
					var str = (lYear + j) + '年第' + Math.ceil(i/3) + '季度';
					result.desc.push(str);
				}
			}
			for(var i=1; i<=cMonth; i=i+3){
				result.desc.push(cYear + '年第' + Math.ceil(i/3) + '季度');
			}
		}else if(SType=="year"){
			for(var i=lYear; i<=cYear; i++){
				result.desc.push(i + '年');
			}
		}
		UI.util.debug(result);
		return result;
	}
	
	
	var self = this;
	(function(){
		var dateSettings = {
				dayNamesShort:["日", "一", "二", "三", "四", "五", "六"],
				dayNames:["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
				monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
				monthNamesShort:["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
				shortYearCutoff:"+10",
				ticksTo1970:(((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000)
		};
		function daylightSavingAdjust(date) {
			if (!date) {
				return null;
			}
			date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
			return date;
		}
		
		function getDaysInMonth(year, month) {
			return 32 - daylightSavingAdjust(new Date(year, month, 32)).getDate();
		}
		// 日期转换到字符串，格式：'yy-mm-dd'
		function formatDate(format, date, settings) {
			if (!date) {
				return "";
			}

			var iFormat,
				dayNamesShort = (settings ? settings.dayNamesShort : null) || dateSettings.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || dateSettings.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || dateSettings.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || dateSettings.monthNames,
				// Check whether a format character is doubled
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				// Format a number, with leading zero if necessary
				formatNumber = function(match, value, len) {
					var num = "" + value;
					if (lookAhead(match)) {
						while (num.length < len) {
							num = "0" + num;
						}
					}
					return num;
				},
				// Format a name, short or long as requested
				formatName = function(match, value, shortNames, longNames) {
					return (lookAhead(match) ? longNames[value] : shortNames[value]);
				},
				output = "",
				literal = false;

			if (date) {
				for (iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
							literal = false;
						} else {
							output += format.charAt(iFormat);
						}
					} else {
						switch (format.charAt(iFormat)) {
							case "d":
								output += formatNumber("d", date.getDate(), 2);
								break;
							case "D":
								output += formatName("D", date.getDay(), dayNamesShort, dayNames);
								break;
							case "o":
								output += formatNumber("o",
									Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
								break;
							case "m":
								output += formatNumber("m", date.getMonth() + 1, 2);
								break;
							case "M":
								output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
								break;
							case "y":
								output += (lookAhead("y") ? date.getFullYear() :
									(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
								break;
							case "@":
								output += date.getTime();
								break;
							case "!":
								output += date.getTime() * 10000 + dateSettings.ticksTo1970;
								break;
							case "'":
								if (lookAhead("'")) {
									output += "'";
								} else {
									literal = true;
								}
								break;
							default:
								output += format.charAt(iFormat);
						}
					}
				}
			}
			return output;
		}
		// 字符串转换到日期
		function parseDate(format, value, settings) {
			if (format == null || value == null) {
				throw "Invalid arguments";
			}

			value = (typeof value === "object" ? value.toString() : value + "");
			if (value === "") {
				return null;
			}

			var iFormat, dim, extra,
				iValue = 0,
				shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || dateSettings.shortYearCutoff,
				shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
					new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
				dayNamesShort = (settings ? settings.dayNamesShort : null) || dateSettings.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || dateSettings.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || dateSettings.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || dateSettings.monthNames,
				year = -1,
				month = -1,
				day = -1,
				doy = -1,
				literal = false,
				date,
				// Check whether a format character is doubled
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				// Extract a number from the string value
				getNumber = function(match) {
					var isDoubled = lookAhead(match),
						size = (match === "@" ? 14 : (match === "!" ? 20 :
						(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
						digits = new RegExp("^\\d{1," + size + "}"),
						num = value.substring(iValue).match(digits);
					if (!num) {
						throw "Missing number at position " + iValue;
					}
					iValue += num[0].length;
					return parseInt(num[0], 10);
				},
				// Extract a name from the string value and convert to an index
				getName = function(match, shortNames, longNames) {
					var index = -1,
						names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
							return [ [k, v] ];
						}).sort(function (a, b) {
							return -(a[1].length - b[1].length);
						});

					$.each(names, function (i, pair) {
						var name = pair[1];
						if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
							index = pair[0];
							iValue += name.length;
							return false;
						}
					});
					if (index !== -1) {
						return index + 1;
					} else {
						throw "Unknown name at position " + iValue;
					}
				},
				// Confirm that a literal character matches the string value
				checkLiteral = function() {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw "Unexpected literal at position " + iValue;
					}
					iValue++;
				};

			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						checkLiteral();
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							day = getNumber("d");
							break;
						case "D":
							getName("D", dayNamesShort, dayNames);
							break;
						case "o":
							doy = getNumber("o");
							break;
						case "m":
							month = getNumber("m");
							break;
						case "M":
							month = getName("M", monthNamesShort, monthNames);
							break;
						case "y":
							year = getNumber("y");
							break;
						case "@":
							date = new Date(getNumber("@"));
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "!":
							date = new Date((getNumber("!") - dateSettings.ticksTo1970) / 10000);
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "'":
							if (lookAhead("'")){
								checkLiteral();
							} else {
								literal = true;
							}
							break;
						default:
							checkLiteral();
					}
				}
			}

			if (iValue < value.length){
				extra = value.substr(iValue);
				if (!/^\s+/.test(extra)) {
					throw "Extra/unparsed characters found in date: " + extra;
				}
			}

			if (year === -1) {
				year = new Date().getFullYear();
			} else if (year < 100) {
				year += new Date().getFullYear() - new Date().getFullYear() % 100 +
					(year <= shortYearCutoff ? 0 : -100);
			}

			if (doy > -1) {
				month = 1;
				day = doy;
				do {
					dim = getDaysInMonth(year, month - 1);
					if (day <= dim) {
						break;
					}
					month++;
					day -= dim;
				} while (true);
			}

			date = daylightSavingAdjust(new Date(year, month - 1, day));
			if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
				throw "Invalid date"; // E.g. 31/02/00
			}
			return date;
		}
		/**
		 * 反序列化OSS上传的文件ID，将其转换为完整路径
		 */
		function decodeOSSFileId(fid){
			var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var fileTypes = [ "BMP", "JPG", "JPEG", "PNG", "GIF", "MP4", "CSV", "XLS", "XLSX", "DOC", "DOCX", "PPT", "PPTX", "DBF", "MDB" , "DH" , "HIK" , "MPG" , "OTHER" ];
			
			function getFileType(){			
				return fileTypes[fid.charCodeAt(fid.length-1)-48];
			}
			
			function getDisk(){			
				return chars[Math.floor(getBody()/1000000000000000000) + 11];
			}
			
			function getSequence(){
				return fid.charCodeAt(0)-48;
			}
			
			function getBody(){
				function index36(c){
					var code = c.charCodeAt();
					var acode = 'a'.charCodeAt();
					var zcode = '0'.charCodeAt();
					return c<'a'?(code-zcode):code-acode+10;
				}
				function str362long(){
					var l=0;
					var str = fid.substr(1,fid.length-2);
					for(var i=0;i<str.length;i++){
						l+= index36(str.charAt(i))*Math.pow(36,i);
					}
					return l;
				}
				return str362long();
			}
			
			function getDir(){
				var path = "";
				var part = Math.floor((getBody()%1000000000000)/1000000000);
				
				function long2str16(f){			
					if (f < 16) {
						path += (chars[f % 16]);
					} else {				
						path += (chars[parseInt(f / 16)]);
						long2str16(f % 16);
					}
				}
				
				long2str16(part);
				
				if(path.length==1){
					path = "0"+path;
				}
				return path;			
			}	
			
			function getFileDate(outputPattern){			
				var datePart = ""+Math.floor((getBody()%1000000000000000000)/1000000000000);
				var fileDate = parseDate('ymmdd',datePart);
				return outputPattern?formatDate(outputPattern,fileDate):fileDate;
			}
			
			return {
				fileId:fid,
				fileType:getFileType(),
				fileDate:getFileDate('yy-mm-dd'),
				sequence:getSequence(),
				disk:getDisk(),				
				dir:getDir(),
				getFullPath:function(isRelative){
					return (isRelative?"/":this.disk+"://")+this.fileDate+"/"+this.dir+"/"+this.fileId+"."+this.fileType;
				}
			};		
		}
		
		self.parseDate = parseDate;
		self.formateDate = formatDate;
		self.decodeOSSFileId = decodeOSSFileId;
	})();
	
}
 