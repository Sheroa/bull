/**
 * @function:系统信息页面js
 * @author:ZY
 */

var api     = require("api/api"),
	sidebar = require("util/sidebar"),
	K       = require('util/Keeper'),
	toolbar = require('util/toolbar_pp'),
	navBar = require("util/navbar");





var manage = {
	init:function(){
		toolbar.init();
		navBar.init(index);
		sidebar.init();
		this.event_handler();
	},
	tpl:{
		identify_step1:function(){
			var buf = [];
			buf.push('<p>填写身份证银行信息：</p>');
			buf.push('<p><span class="p-ti">真实姓名</span><input id="true_name" type="text" value="{{#userName}}"></p>');
			buf.push('<p><span class="p-ti">身份证号码</span><input id="id_number" type="text" value="{{#identityCard}}"></p>');
			buf.push('<p><span class="p-ti">选择银行</span><select name="bank-select" id="bank-select"><option data-code="0">请选择银行</option></select><span><img src="/static/img/bank/back-logo.png" alt="" class="bank-logo"></span></p>');
			buf.push('<p class="no-margin"><span class="p-ti">银行卡号</span><input type="text" id="bank_number" value="{{#bankCardNo}}" placeholder="请输入您本人的借记卡号"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="btn-line2"><a href="javascript:void(0);" class="gray-btn cancel_btn">取消</a><a href="javascript:void(0);" class="light-btn confirm_btn">确认</a></p>');
			return buf.join("");
		},
		modify_pay_pwd:function(){
			var buf = [];
			buf.push('<p>修改交易密码：</p>');
			buf.push('<p class="no-margin"><span class="p-ti">原交易密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span></p>');
			buf.push('<p class="no-margin"><span class="p-ti">新交易密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span></p>');
			buf.push('<p class="no-margin"><span class="p-ti">确认密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="btn-line"><a href="javascript:void(0);" class="light-btn confirm_btn">确认</a></p>');
			return buf.join("");
		},
		find_pay_pwd:function(){
			var buf = [];
			buf.push('<p>找回交易密码：</p>');
			buf.push('<p><span class="p-ti">手机号码</span><span class="phone_num"></span></p>');
			buf.push('<p class="captcha no-margin"><span class="p-ti">验证码</span><input type="text" class="sms_code" placeholder="请输入短信验证码"><a href="javascript:void(0)" class="light-btn verify_sms">获取验证码</a></p>');
			buf.push('<p class="sub-text sms_info"></p>');
			buf.push('<p class="no-margin"><span class="p-ti">交易密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span></p>');
			buf.push('<p class="no-margin"><span class="p-ti">确认密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="btn-line"><a href="javascript:void(0);" class="light-btn confirm_btn">确认</a></p>');
			return buf.join("");
		},
		set_pay_pwd:function(){
			var buf = [];
			buf.push('<p>设置交易密码：</p>');
			buf.push('<p class="no-margin"><span class="p-ti">交易密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span></p>');
			buf.push('<p class="no-margin"><span class="p-ti">确认密码</span><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="btn-line"><a href="javascript:void(0);" class="light-btn confirm_btn">确认</a></p>');
			return buf.join("");
		
		},
		modify_success_pay_pwd:function(){
			var buf = [];
			buf.push('<p class="ti">修改成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p>交易密码修改成功</p>');
			buf.push('<p style="margin-top:5px;"><a href="javascript:void(0);" class="light-btn confirm">确定</a></p>');
			buf.push('</div>');
			return buf.join("");
		},
		modify_success_pwd:function(){
			var buf = [];
			buf.push('<p class="ti">修改成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p>登陆密码修改成功</p>');
			buf.push('<p style="margin-top:5px;"><a href="javascript:void(0);" class="light-btn confirm">确定</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	event_handler:function(){

		var self = this;

		//手机认证
		var user_info = JSON.parse($.cookie("ppinf")).loginName;
		$("div[data-type='phoneIdentity']").find(".cont").text(K.phone_num_map(user_info));

		//判断用户是否实名认证
		var verifyIdentity = $("div[data-type='verifyIdentity']"),
			identify_content = verifyIdentity.find(".sub-msg"),
			identify_btn = verifyIdentity.find(".main-msg"),
			identify_title = identify_btn.find(".cont");

		// api.call('/api/user/getUserInfo.do',{},function(_rel){
		// 	var certNo = _rel.result.certNo,
		// 		user_info = _rel.result;
		// 	// user_info.memberName = K.name_map(user_info.memberName);
		// 	// user_info.certNo = K.bank_card_map(user_info.certNo);
		// 	identify_content.html("");
		// 	if(certNo){ //数据库中含有身份证号-无论是否验证
		// 		//进一步判断是否认证
		// 		api.call('/api/user/verifyIdentityState.do',{},function(_rel){
		// 			var result = _rel.result;
		// 			if(!result){ //未进行实名认证
		// 				identify_title.addClass('cont2').html('成功充值任意金额方可认证身份证信息（<em>已填写</em>）');
		// 				identify_btn.find("a").remove();
		// 				identify_btn.append('<a href="javascript:void(0);" class="light-btn"><em id = "modify">修改</em></a>');
		// 				identify_btn.append('<a href="/my/refund/recharge.html" class="light-btn">充值</a>');

		// 				identify_content.html(K.ParseTpl(self.tpl.identify_step1(),user_info));
						
		// 			}else{ //已进行实名认证
		// 				identify_title.addClass('cont2').text(K.name_map(user_info.memberName)+'（'+K.bank_card_map(user_info.certNo)+'）身份证不允许修改、更换或注销');
		// 				identify_btn.find("a").remove();
		// 				identify_content.remove();
		// 			}
		// 		})
		// 	}else{ //没有完成身份信息
		// 		identify_btn.addClass('need-write');
		// 		identify_title.html('完成身份信息才能投资，实名认证后身份证不允许修改、更换或注销（<em>未填写</em>）');
		// 		identify_btn.find("a").remove();
		// 		identify_btn.append('<a href="javascript:void(0);" class="light-btn"><em id="modify">立即填写</em></a>');
		// 		identify_content.html(K.ParseTpl(self.tpl.identify_step1(),user_info));
		// 	}
		// });

		api.call("/api/user/getIdentityInfoByUser.do",{},function(_rel){
			var result1 = _rel.result,
				certNo = result1.identityCard,
				bankCode = result1.bankCode,
				user_info = result1;
			identify_content.html("");
			if(certNo){ //数据库中含有身份证号-无论是否验证
				//进一步判断是否认证
				api.call('/api/user/verifyIdentityState.do',{},function(_rel){
					var result = _rel.result;
					if(!result){ //未进行实名认证
						identify_title.addClass('cont2').html('成功充值任意金额方可认证身份证信息（<em>已填写</em>）');
						identify_btn.find("a").remove();
						identify_btn.append('<a href="javascript:void(0);" class="light-btn"><em id = "modify" data-code="'+bankCode+'">修改</em></a>');
						identify_btn.append('<a href="/my/refund/recharge.html" class="light-btn">充值</a>');

						identify_content.html(K.ParseTpl(self.tpl.identify_step1(),user_info));
						
					}else{ //已进行实名认证
						identify_title.addClass('cont2').text(K.name_map(user_info.userName)+'（'+K.bank_card_map(user_info.identityCard)+'）身份证不允许修改、更换或注销');
						identify_btn.find("a").remove();
						identify_content.remove();
					}
				})
			}else{ //没有完成身份信息
				identify_btn.addClass('need-write');
				identify_title.html('完成身份信息才能投资，实名认证后身份证不允许修改、更换或注销（<em>未填写</em>）');
				identify_btn.find("a").remove();
				identify_btn.append('<a href="javascript:void(0);" class="light-btn"><em id="modify">立即填写</em></a>');
				identify_content.html(K.ParseTpl(self.tpl.identify_step1(),user_info));
			}
		});


		$(document).on("click","#modify",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg"),
				bankCode = _this.attr('data-code');
			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				_this.addClass('selected');
				animate_obj.slideDown();
			}

			$("#bank-select").change(function(){
				var _this = $(this),
					bank_alias = _this.children('option:selected').attr('data-code'),
					img = _this.next().find('img');

				//每一次选中银行，触发一次事件-修改后面图片
				if(bank_alias == 0){
					img.attr('src','')
				}else{
					img.attr('src','/static/img/bank/'+bank_alias+".png")
				}
			});

			//调用银行接口，输出银行
			api.call('/api/payment/queryBankList',{

			},function(_rel){
				var bank_list = _rel.list,
					_html = [];
				$.each(bank_list,function(index,obj){
					_html.push('<option data-code='+obj.bank_code+' data-provider='+obj.provider+'>'+obj.bank_name+'</option>');
				});
				$("#bank-select").append(_html.join(""));

				$("#bank-select").find("option[data-code='"+bankCode+"']").attr('selected',true);
				$("#bank-select").change();
			});

			//确认btn
			var confirm_btn = animate_obj.find(".confirm_btn");
			confirm_btn.on("click",function(){
				//姓名
				//身份证号
				var true_name = $('#true_name'),
					id_number = $('#id_number'),
					error_msg = animate_obj.find(".error-msg"),
					bank_number = $('#bank_number'),
					bank_select = $('#bank-select');

				//校验真实姓名
				if(!(true_name && true_name.val() != '') || !K.isChinese(true_name.val())){
					error_msg.text('请输入身份证上的姓名');
					return false;
				}

				//校验身份证号码
				if(!(id_number && id_number.val() != '')){
					error_msg.text('请输入正确的身份证号码');
					return false;
				}
				if(id_number.val().length != 18){
					error_msg.text('身份证格式有误请重新输入');
					return false;
				}


				// 判断是否选择银行
				if(!(bank_select && bank_select.find('option:selected').attr('data-code') != '0')){
					error_msg.text('请选择银行');
					return false;
				}

				//银行卡号
				if(!(bank_number && bank_number.val() != '')){
					error_msg.text('请输入您本人的借记卡卡号');
					return false;
				}

				if(!K.bank_card_check($.trim(bank_number.val()))){
					error_msg.text('银行卡卡号格式有误，请重新输入');
					return false;
				}
				error_msg.text("");

				// api.call('/api/user/verifyIdentityInfo.do',{
				// 	'name':$.trim(true_name.val()),
				// 	'idCardNo':$.trim(id_number.val())
				// },function(_rel){
				// 	console.log("成功");
				// })
				//验证通过-发送ajax				
				api.call('/api/user/improveIdentityInfo.do',{
					'name': true_name.val(),
					'idCardNo':id_number.val(),
					'bankCardNo':bank_number.val(),
					'bankName': $('#bank-select').find('option:selected').val(),
					'bankCode':$('#bank-select').find('option:selected').attr('data-code')
				},function(_rel){
					location.reload(true);
				},function(_rel){
					error_msg.text(_rel.msg);
				});
			})

			//取消btn
			var cancel_btn = animate_obj.find(".cancel_btn");
			cancel_btn.on("click",function(){
				_this.removeClass('selected');
				animate_obj.slideUp();
			})
		});
		//修改用户密码
		$("#modify_pwd").on("click",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg");

			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				_this.addClass('selected');
				animate_obj.slideDown();
			}

			//取消btn
			var cancel_btn = animate_obj.find(".cancel_btn");
			cancel_btn.on("click",function(){
				_this.removeClass('selected');
				animate_obj.slideUp();
			})

			var confirm_btn = animate_obj.find(".confirm_btn")
			confirm_btn.on("click",function(){
				var _this = $(this);
				error_msg = animate_obj.find(".error-msg"),
				old_pwd = $.trim(animate_obj.find(".old_pwd").val()),
				new_pwd = $.trim(animate_obj.find(".new_pwd").eq(0).val()),
				new_pwd_array = animate_obj.find(".new_pwd"),
				compare_array = [];

				$.each(new_pwd_array,function(index,value){
					var _this = $(this),
						pwd_item = $.trim(_this.val());
					compare_array.push(pwd_item);
				});

				if(!old_pwd){
					error_msg.html("请输入您的原始密码！");
					return false;
				}

				if(!new_pwd){
					error_msg.html("请重置您的登录密码！");
					return false;
				}

				if(!K.pwd_valid_check(new_pwd)){
					error_msg.html("密码过于简单，请设置字母+数字的密码!");
					return false;
				}
				
				//确认密码的判断
				if(compare_array[0] != compare_array[1]){
					error_msg.html("两次密码不一致，请重新输入!");
					return false;
				}
				error_msg.html("");

				//校验结束，发送ajax请求
				api.call('/api/user/modifyLoginPwd.do',{
					'oldLoginPwd':old_pwd,
					'newLoginPwd':new_pwd
				},function(_rel){
					var reuslt = _rel.result;
					if(reuslt){
						// error_msg.html("密码修改成功");
						// $("#modify_pwd").trigger('click');						
						$.Dialogs({
							"id": "diglog_wrapper",
							"overlay": true,
							"cls": "dialog-wrapper popbox-bankrank outter",
							"closebtn": ".quit,span.close",
							"auto": false,
							"msg": self.tpl.modify_success_pwd(),
							"openfun":function(){
								//确定
								$(".confirm").on("click",function(){
									location.reload(true);
								});
							}
						});
					}
				},function(_rel){
					error_msg.html(_rel.msg);
				});
			})

		})

		//密码输入框
		$(".visible").on("click",function(){
			var _this = $(this),
				input_obj = _this.prev();
			if(input_obj.attr('type') == 'password'){
				input_obj.attr('type','text');
			}else{
				input_obj.attr('type','password')
			}
		});

		//判断用户是否设置交易密码
		var verifypwd = $("div[data-type='verifypwd']"),
			verifypwd_content = verifypwd.find(".sub-msg"),
			verifypwd_btn = verifypwd.find(".main-msg"),
			verifypwd_title = verifypwd_btn.find(".cont");
		api.call('/api/user/verifyPayPwdState.do',{

		},function(_rel){
			var result = _rel.result;
			if(result){ //用户已经设置交易密码
				verifypwd_title.addClass('cont2').html('已设置');
				verifypwd_btn.find("a").remove();
				verifypwd_btn.append('<a href="javascript:void(0);" class="light-btn" id="modifyPayPwd"><em>修改</em></a>');
				verifypwd_btn.append('<a href="javascript:void(0);" class="light-btn" id="findPayPwd"><em>找回</em></a>');
			}else{ //用户没有设置交易密码
				verifypwd_btn.addClass('need-write');
				verifypwd_title.html('设置交易密码方可进行充值投资资金提取（<em>未设置</em>）');
				verifypwd_btn.find("a").remove();
				verifypwd_btn.append('<a href="javascript:void(0);" class="light-btn" id="immidate_set"><em>立即设置</em></a>');
			}
		});

		//立刻设置交易密码
		$(document).on("click","#immidate_set",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg");
			
			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				_this.addClass('selected');
				animate_obj.html(self.tpl.set_pay_pwd());
				animate_obj.slideDown();
			}

			//密码输入框
			$(".bank-pwd").each(function(index, el) {
				$(el).find("input").each(function(index, el) {
					var _this = $(el);
					_this.on("keyup",function(event){
						var self = $(this),
							code = event.which;

						if(code == 8){
							self.text("");
							self.prev().focus();
						}else{
							//48-50 
							if(!((code>=48 && code<=57)||(code>=96 && code<=105))){
								self.val("");
								return false;
							}
							if(self.val()){
								self.next().focus();
							}	
						}
					});
				});	
			});


			//确认btn
			var confirm_btn = animate_obj.find(".confirm_btn");

			confirm_btn.on("click",function(){
				var _this = $(this),
					bank_pwd = animate_obj.find(".bank-pwd"),
					compare_array = [],
					error_msg = animate_obj.find('.error-msg');


		 			$.each(bank_pwd,function(index,value){
		 				var pwd_item = $(this),
		 					pwd_array = [];
		 				$.each(pwd_item.find("input"),function(k,v){
		 					pwd_array.push($(v).val());
		 				});
		 				compare_array.push(pwd_array.join(""));
		 				
		 			});


		 			if(compare_array[0].length != 6 || compare_array[1].length != 6){
		 				error_msg.text("请设置交易密码，保障资金安全");
		 				return false;
		 			}
					if(compare_array[0] != compare_array[1]){
						error_msg.html("两次输入的密码不一致，请重新输入");
						return false;
					}
					error_msg.text("");

					//校验完成-请求接口
					api.call('/api/user/setPayPassword.do',{
						'payPwd':compare_array[0]
					},function(_rel){
						var result = _rel.result;
						if(result){
							location.reload(true);
						}
					},function(_rel){
						error_msg.html(_rel.msg);
					});
			});

		})

		$(document).on("click","#modifyPayPwd",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg");
			
			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				$("#findPayPwd").removeClass('selected');
				_this.addClass('selected');
				animate_obj.slideUp(function(){
					animate_obj.html(self.tpl.modify_pay_pwd());
					animate_obj.slideDown();
						//密码输入框
						$(".bank-pwd").each(function(index, el) {
							$(el).find("input").each(function(index, el) {
								var _this = $(el);
								_this.on("keyup",function(event){
									var self = $(this),
										code = event.which;

									if(code == 8){
										self.text("");
										self.prev().focus();
									}else{
										//48-50 
										if(!((code>=48 && code<=57)||(code>=96 && code<=105))){
											self.val("");
											return false;
										}
										if(self.val()){
											self.next().focus();
										}
										
									}
								});
							});	
						});

						//确认btn
						var confirm_btn = animate_obj.find(".confirm_btn");

						confirm_btn.on("click",function(){
							var _this = $(this),
								bank_pwd = animate_obj.find(".bank-pwd"),
								compare_array = [],
								old_pwd = "",
								error_msg = animate_obj.find('.error-msg');


					 			$.each(bank_pwd,function(index,value){
					 				var pwd_item = $(this),
					 					pwd_array = [];
					 				$.each(pwd_item.find("input"),function(k,v){
					 					pwd_array.push($(v).val());
					 				});
					 				if(index == 0){
					 					old_pwd = pwd_array.join("");
					 				}else{
					 					compare_array.push(pwd_array.join(""));	
					 				}
					 				
					 			});

					 			if(old_pwd.length != 6){
					 				error_msg.text("请输入原始密码");
					 				return false;
					 			}

					 			if(compare_array[0].length != 6 || compare_array[1].length != 6){
					 				error_msg.text("请设置交易密码，保障资金安全");
					 				return false;
					 			}
								if(compare_array[0] != compare_array[1]){
									error_msg.html("两次输入的密码不一致，请重新输入");
									return false;
								}
								error_msg.text("");

								//校验完成-请求接口
								api.call('/api/user/modifyPayPassword.do',{
									'oldPayPwd':old_pwd,
									'newPayPwd':compare_array[0]
								},function(_rel){
									var result = _rel.result;
									if(result){
										$.Dialogs({
											"id": "diglog_wrapper",
											"overlay": true,
											"cls": "dialog-wrapper popbox-bankrank outter",
											"closebtn": ".quit,span.close",
											"auto": false,
											"msg": self.tpl.modify_success_pay_pwd(),
											"openfun":function(){
												//确定
												$(".confirm").on("click",function(){
													location.reload(true);
												});
											}
										});
									}
								},function(_rel){
									error_msg.html(_rel.msg);
								});
						});
				});

			}

		});

		$(document).on("click","#findPayPwd",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg");
			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				$("#modifyPayPwd").removeClass('selected');
				_this.addClass('selected');
				animate_obj.slideUp(function(){
					animate_obj.html(self.tpl.find_pay_pwd());
					animate_obj.find(".phone_num").text(K.phone_num_map(user_info));
					animate_obj.slideDown();


						//密码输入框
						$(".bank-pwd").each(function(index, el) {
							$(el).find("input").each(function(index, el) {
								var _this = $(el);
								_this.on("keyup",function(event){
									var self = $(this),
										code = event.which;

									if(code == 8){
										self.text("");
										self.prev().focus();
									}else{
										//48-50 
										if(!((code>=48 && code<=57)||(code>=96 && code<=105))){
											self.val("");
											return false;
										}
										if(self.val()){
											self.next().focus();
										}
										
									}
								});
							});	
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

							self.sendMobileCode(user_info,$(".sms_info"))
						});

						//确认btn
						var confirm_btn = animate_obj.find(".confirm_btn");
						confirm_btn.on("click",function(){
							var _this = $(this),
								bank_pwd = animate_obj.find(".bank-pwd"),
								compare_array = [],
								sms_code = animate_obj.find(".sms_code"),
								error_msg = animate_obj.find('.error-msg');

								if($.trim(sms_code.val()).length == 0){
									error_msg.text("请输入短信验证码");
									return false;
								}
					 			$.each(bank_pwd,function(index,value){
					 				var pwd_item = $(this),
					 					pwd_array = [];
					 				$.each(pwd_item.find("input"),function(k,v){
					 					pwd_array.push($(v).val());
					 				});
					 				compare_array.push(pwd_array.join(""));	
					 				
					 			});

					 			if(compare_array[0].length != 6 || compare_array[1].length != 6){
					 				error_msg.text("请设置交易密码，保障资金安全");
					 				return false;
					 			}
								if(compare_array[0] != compare_array[1]){
									error_msg.html("两次输入的密码不一致，请重新输入");
									return false;
								}
								error_msg.text("");

								//
								api.call('/api/user/verifySmsCodeByResetPayPwd.do',{
									'smsCode':$.trim(sms_code.val())
								},function(_rel){

									api.call('/api/user/resetPayPwd.do',{

										'newPayPwd':compare_array[0],
										'smsCode':_rel.result

									},function(_rel){
										location.reload(true);
									},function(_rel){
										error_msg.html(_rel.msg);
									});
								},function(_rel){
									error_msg.html(_rel.msg);
								});
						});

						//取消btn
						var cancel_btn = animate_obj.find(".cancel_btn");
						cancel_btn.on("click",function(){
							_this.removeClass('selected');
							animate_obj.slideUp();
						})
				});


				
				
			}

		});
	},
	sendMobileCode:function(phone_num,sms_obj){

		api.call('/api/user/sendSmsCodeByResetPayPwd.do',{
			'mobile': phone_num
		},function(_rel){
			sms_obj.text("验证码已发至手机"+phone_num);
		},function(_rel){
			sms_obj.text("验证码发送失败");
		});
		
	}
}

manage.init();