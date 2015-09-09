/**
 * @function : 注册页面js
 * @author  : ZY
 */
var $ = require('jquery'),
 	data_transport = require('common/core_data'),
 	K = require('util/Keeper'),
 	api = require('api/api'),
 	passport = require('util/passport');

 var register = {
 	init:function(){
 		this.event_handler();
 	},
 	event_handler:function(){
 		var self = this,
 			phone_number = "",
 			login_info = null;
 		//登陆 bind - click事件
 		$(".next_step_one").on('click',function(){
 			var login_check = self.valid_check(),
 				_this = $(this),
 				error_msg = _this.parents(".contOne").find(".error-msg em");
 			if(login_check){
 				//显示错误信息
 				error_msg.html(login_check);
 				return false;
 			}
 			
 			error_msg.html("");
 			phone_number = $.trim($("#phone_num").val());

 			//第一步成功 进入第二步
 			$(".contOne").addClass('hide');
 			$(".contTwo").removeClass("hide");
 			$(".stepOne").removeClass('stepOne').addClass('stepTwo');
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

 		//第二步-下一步
 		$(".next_step_two").on("click",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".contTwo").find("#identify_code"),
 				checked = _this.parents(".contTwo").find("input[type='checkbox']");

 			//短信验证
 			var verify_code = $("#verify_code");
 			if($.trim(verify_code.val()) == ""){
 				error_msg.html("<em>请输入手机验证码！</em>");
 				return false;
 			}
 			error_msg.html("");

 			//阅读并同意 
 			if(!checked.is(":checked")){
 				error_msg.html("<em>没有阅读</em>");
 				return false;
 			}
 			error_msg.html("");
 			
 			//请求注册接口开始进行注册
 			$.extend(data_transport,{
 				'account':$.trim($("#phone_num").val()),
 				'loginPwd':$.trim($("#user_pwd").val()),
 				'smsCode':$.trim(verify_code.val()),
 				'referrer':$.trim($("#recommand_person").val())
 			});
 			$.ajax({
 				url: '/api/user/register',
 				type: 'post',
 				data: data_transport,
 				success:function(_rel){

 					if(_rel.code == 0){
 						//注册成功
	 					login_info = _rel.data.result;
	 					passport.saveLoginInfo(login_info);

			 			//将第三步手机编译显示
			 			$("#phone_map").text(K.phone_num_map(phone_number));

			 			//第二步成功  进入第三步
					 	$(".contTwo").addClass('hide');
					 	$(".contThree").removeClass("hide");
					 	$(".stepTwo").removeClass('stepTwo').addClass('stepThree');	
 					}else{
 						//显示错误信息
 						error_msg.html("<em>"+_rel.msg+"</em>");
 					}
 				}
 			});
 			


	

 		});

 		//第三部-设置
 		$(".set_btn").on("click",function(){
 			var _this = $(this),
 				bank_pwd = _this.parents(".contThree").find(".bank-pwd"),
 				compare_array = [],
 				error_msg = _this.parents(".contThree").find(".error-msg em")

 			$.each(bank_pwd,function(index,value){
 				var pwd_item = $(this),
 					pwd_array = [];
 				$.each(pwd_item.find("input"),function(k,v){
 					pwd_array.push($(v).val());
 				});
 				compare_array.push(pwd_array.join(""));
 			})

 			if(compare_array[0].length != 6 || compare_array[1].length != 6){
 				error_msg.text("请设置交易密码，保障资金安全");
 				return false;
 			}
 			error_msg.text("");
			if(compare_array[0] != compare_array[1]){
				error_msg.html("两次输入的密码不一致，请重新输入");
				return false;
			}
			error_msg.text("");

			//调用接口
			api.call('/api/user/setPayPassword.do',{
				'payPwd':compare_array[0]
			},function(data){
				K.gotohref("/my/personCenter.html");
			});
 		})

 		//第三部-跳过
 		$(".step_over").on("click",function(){
 			K.gotohref("/my/personCenter.html");	
 		})
 	},
 	valid_check:function(){
 		var user_pwd  = $("#user_pwd"),
 			phone_num = $("#phone_num");

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

 		if(!K.pwd_valid_check($.trim(user_pwd.val()))){
 			return "密码过于简单，请设置字母+数字的密码";
 		}


 	},
 	sendMobileCode:function(phone_num){
 		$.extend(data_transport,{
 			'mobile': phone_num
 		});
 		$.ajax({
 			url: '/api/user/sendSmsCodeByRegister',
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

 register.init();