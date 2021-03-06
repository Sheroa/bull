/**
 * @function : 登陆页面feature
 * @author  : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper'),
	api = require('api/api'),
	passport = require('util/passport');

// navBar.init(index);

var login = {
	init:function(){
		this.event_handler();
	},
	event_handler:function(){
		var self = this;
		//登陆 bind - click事件
		$(".btn_login").on('click',function(){
			var login_check = self.valid_check(),
				phone_num = $.trim($("#userName").val()),
				user_pwd = $.trim($("#userPass").val()),
				pcInput = $("#pcInput").is(":checked");
			if(login_check){
				//显示错误信息
				$(".error-msg").html(login_check);
				return false;
			}
			$(".error-msg").html("");
			// debugger;
			//用户名、密码ok,进入表单验证
			passport.username = phone_num;
			passport.pwd = user_pwd;
			passport.pcInput = pcInput;
			passport.loginMsg = $(".error-msg");
			passport.doLogin();
			
		});

		$(".visible").on("click",function(){
			var _this = $(this),
				input_obj = _this.prev();
			if(input_obj.attr('type') == 'password'){
				input_obj.attr('type','text');
			}else{
				input_obj.attr('type','password')
			}
		});

		//回车触发
		$("#userPass").on("keypress",function(event){
			//回车触发
			if(event.keyCode == 13){
				$(".btn_login").trigger('click');
			}
		});
	},
	valid_check:function(){
		var phone_num = $("#userName"),
			user_pwd  = $("#userPass");

		//检测手机号码
		if(!(phone_num && phone_num.val() != '')){
			return "请输入手机号码";
		}

		if(!K.is_phone($.trim(phone_num.val()))){
			return "手机号码格式不正确，请重新输入";
		}
		
		//校验登陆密码
		if(!(user_pwd && user_pwd.val() != '')){
			return "请输入登陆密码";
		}
	}
}

login.init();