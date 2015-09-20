/**
 * @function : 登陆页面feature
 * @author  : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper'),
	data_transport = require('common/core_data'),
	passport = require('util/passport'),
	navBar = require("util/navbar");

navBar.init(index);

var pwd = {
	init:function(){
		this.event_handler();
	},
	event_handler:function(){

		var self = this,
			phone_number = "",
			smsCode = "";

		$(".next_step_one").on("click",function(){

			var phone_num = $.trim($("#phone_num").val()),
				_this = $(this),
				error_msg = _this.parents(".fcontOne").find(".little-wd");

			//检测手机号码
			if(!(phone_num && phone_num != '')){
				error_msg.text("请输入手机号码");
				return false;
			}

			if(!K.is_phone(phone_num)){
				error_msg.text("手机号码格式不正确，请重新输入");
				return false;
			}

			error_msg.text("");

			//第一步校验完成，进入第二步
			$("#phone_map").text(K.phone_num_map(phone_num));
			phone_number = phone_num;

			$(".findOne").removeClass('findOne').addClass('findTwo');
			$(".fcontOne").addClass('hide');
			$(".fcontTwo").removeClass('hide');

		});

		//密码
		$(".visible").on("click",function(){
			var _this = $(this),
				input_obj = _this.prev();
			if(input_obj.attr('type') == 'password'){
				input_obj.attr('type','text');
			}else{
				input_obj.attr('type','password')
			}
		});

		$(".next_step_two").on("click",function(){
			var _this = $(this),
				identify_code = $.trim($("#identify_code").val()),
				error_msg = _this.parents(".fcontTwo").find(".little-wd");

			//检测验证码
			if(identify_code == ""){
				error_msg.text("请输入手机验证码！");
				return false;
			}
			error_msg.text("");
			smsCode = identify_code;
			$(".findTwo").removeClass('findTwo').addClass('findThree');
			$(".fcontTwo").addClass('hide');
			$(".fcontThree").removeClass('hide');
		});


		$(".verify_sms").on("click",function(){
			var count = 60,
				_this = $(this);

			//防止重复点击
			if($(this).hasClass('disabled')){
				return false;
			}

			$(this).addClass('disabled');
			$(this).removeClass('light-btn').addClass('gray-btn');

			window.timer = window.setInterval(function(){
				if(count == 0){
					_this.removeClass('disabled');
					_this.removeClass('gray-btn').addClass('light-btn');
					_this.html("手机验证码");
					window.clearInterval(timer);
				}else{
					_this.html(count+"秒后重新获取");
					count--;
				}
			},1000);

			self.sendMobileCode(phone_number)
		});

		$(".next_step_three").on("click",function(){
			var _this = $(this),
				error_msg = _this.parents(".fcontThree").find(".little-wd"),
				old_pwd = $.trim($("#old_pwd").val()),
				new_pwd = $.trim($("#new_pwd").val());

			if(!old_pwd){
				error_msg.html("请重置您的登录密码！");
				return false;
			}

			if(!K.pwd_valid_check(old_pwd)){
				error_msg.html("密码过于简单，请设置字母+数字的密码!");
				return false;
			}
			
			if(!new_pwd){
				error_msg.html("请确认您重置的登录密码！");
				return false;
			}

			if(new_pwd != old_pwd){
				error_msg.html("两次密码不一致，请重新输入!");
				return false;
			}

			error_msg.html("");


			//调用接口，重置密码
			$.extend(data_transport,{
				'mobile':phone_number,
				'smsCode':smsCode,
				'newLoginPwd':new_pwd
			});
			$.ajax({
				url: '/api/user/resetLoginPwd',
				type: 'post',
				data: data_transport,
				success:function(result){
					if(result.code == 0){
						//跳转到登陆页面
						K.gotohref("/users/login.html");	
					}else{
						error_msg.html(result.msg);
					}
				}
			});
			
		})
	},
	sendMobileCode:function(phone_num){
		$.extend(data_transport,{
			'mobile': phone_num
		});

		//忘记密码
		$.ajax({
			url: '/api/user/sendSmsCodeByResetLoginPwd',
			type: 'post',
			data: data_transport,
			success:function(result){
				if(result.code == 0){
					$("#identify_code").html("验证码已发至手机"+phone_num);
				}else{
					$("#identify_code").html("<em>验证码发送失败</em>");
				}
			}
		});
	}
}

pwd.init();