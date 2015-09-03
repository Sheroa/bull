/**
 * @function : 注册页面js
 * @author  : ZY
 */
 var $ = require('jquery'),
 	K = require('util/Keeper');

 var register = {
 	init:function(){
 		this.event_handler();
 	},
 	event_handler:function(){
 		var self = this;
 		//登陆 bind - click事件
 		$(".next_step_one").on('click',function(){
 			var login_check = self.valid_check();
 			if(login_check){
 				//显示错误信息
 				$(".error-msg").find("em").html(login_check);
 				return false;
 			}
 			
 			//第一步成功 进入第二步
 			$(".contOne").addClass('hide');
 			$(".contTwo").removeClass("hide");
 		});

 		$(".verify_sms").on("click",function(){

 			var count = 60,
 				_this = $(this) ;//倒计时1min

 			//短信验证
 			var verify_code = $("#verify_code");
 			if($.trim(verify_code.val()) == ""){
 				verify_code.html("请输入手机验证码！");
 				return false;
 			}
 			verify_code.html("");

 			//防止重复点击
 			if($(this).hasClass('disabled')){
 				return false;
 			}

 			$(this).addClass('disabled');

 			window.timer = window.setInterval(function(){
 				if(count == 0){
 					_this.removeClass('disabled');
 					_this.html("手机验证码");
 					window.clearInterval(timer);
 				}else{
 					_this.html(count+"秒后重新获取");
 					count--;
 				}
 			},1000);

 			//t.sendMobileCode(mobileNum)
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
 		
 		//验证注册密码
 		if(!(user_pwd && user_pwd.val() != '')){
 			return "请输入登陆密码";
 		}


 	}
 }

 register.init();