/**
 * @function : 登陆页面feature
 * @author  : ZY
 */

var $ = require('jquery');

var login = {
	init:function(){
		this.event_handler();
	},
	event_handler:function(){
		var self = this;
		//登陆 bind - click事件
		$(".btn_login").on('click',function(){
			self.valid_check();
		});
	},
	valid_check:function(){
		var user_name = $("#userName"),
			user_pwd  = $("#userPass");


		//检测手机号码
		if(!(user_name && user_name.val() != '')){
			return "";
		}

		// if(){
			
		// }
	}
}

login.init();