/**
 * @function : 登陆页面feature
 * @author  : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper');

var login = {
	init:function(){
		this.event_handler();
	},
	event_handler:function(){
		var self = this;
		//登陆 bind - click事件
		$(".btn_login").on('click',function(){
			var login_check = self.valid_check();
			if(login_check){
				//显示错误信息
				$(".error-msg").html(login_check);
				return false;
			}
		});
	},
	valid_check:function(){
		var phone_num = $("#phone_num"),
			user_pwd  = $("#user_pwd");


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