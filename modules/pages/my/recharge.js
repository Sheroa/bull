/**
 * @function:充值页面js
 * @author:ZY
 */

var $       = require("jquery"),
	sidebar = require("util/sidebar"),
 	navbar  = require("util/navbar"),
 	artTemplate 	= require("artTemplate"),
 	cache_data = "",
 	api     = require("api/api"),
 	K = require("util/Keeper"),
 	data_transport = require('common/core_data'),
 	temp_data = "",
 	toolbar = require('util/toolbar_pp');


toolbar.init();

//任务执行
require('ui/dialog/dialog');

var user_info =  JSON.parse($.cookie('ppinf')),
	user_id = user_info.userId,
	user_token = user_info.token,
	sms_obj = {
		'name':'',
		'idCardNo':'',
		'bankCardNo':'',
		'bankCode':''
	};

var recharge = {
	tpl:{
		success:function(){
			var buf = [];
			buf.push('<p class="ti">充值状态</p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">充值成功,3秒后跳转至交易记录。<br><a href="/my/refund/record.html">点击直接跳转</a></p>');
			buf.push('</div>');
			return buf.join("");
		},
		setPaypwd:function(){
			var buf = [];
			buf.push('<p class="ti">设置交易密码</p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">请设置交易密码，<br>3秒后自动跳转到交易密码设置页面。<br><a href="/my/account/manage.html">点击直接跳转</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
 	//初始化
 	init:function(){

 		var self = this;
 			

 		this.navBar(index);
 		this.sidebar();

 		//查询银行卡信息
 		api.call('/api/user/getIdentityInfoByUser.do',{},function(_rel){

 			var bindCard = _rel.result.bindCard; //是否完成绑定银行卡
 			if(bindCard){

 				$("#binded").show();

 				sms_obj.name = _rel.result.userName;
 				sms_obj.idCardNo = _rel.result.identityCard;
 				sms_obj.bankCardNo = _rel.result.bankCardNo;
 				sms_obj.bankCode = _rel.result.bankCode;

 				$.extend(sms_obj,{
 					'mobile':_rel.result.userMobile
 				});
 				
 				//用户已经绑定了银行卡，此时应该进入recharge2.html
 				$(".bank-icbc .border-pad").html(require('./bank_card_info').show(_rel));

 				self.event_handler_bind();

 			}else{

 				//用户没有绑定银行卡
 				$("#binding").show();
 				self.bank_list(function(){
 					//输入接口返回信息
 					var identityCard = _rel.result.identityCard,
 						bankCardNo   = _rel.result.bankCardNo,
 						userName     = _rel.result.userName,
 						bankCode     = _rel.result.bankCode;

 					if(identityCard){
 						$("#truename").val(userName);
 						$("#id_number").val(identityCard);
 						$("#bank_number").val(bankCardNo);
 						$("#bank-select").find("option[data-code='"+bankCode+"']").attr('selected',true);
 						$("#bank-select").change();
 						$("#binding").find(".nextBtn").eq(0).trigger("click");
 					}

 				});
 				self.event_handler();

 				
 			}

 		});


 	},
 	navBar:function(index){
 		navbar.init(index);
 	},
 	sidebar:function(){
 		sidebar.init();
 	},
 	bank_list:function(callback){
 		$.ajax({
 			url:'/api/payment/queryBankList',
 			method:'post',
 			data:{
 				'appVersion':'0.1',
 				'source':'web'
 			},
 			success:function(result){
 				if(result.code == 0){
 					var bank_data = result.data.list,
 						_html = [];
 					$.each(bank_data,function(index,obj){
 						_html.push('<option data-code='+obj.bank_code+' data-provider='+obj.provider+'>'+obj.bank_name+'</option>');
 					});
 					$("#bank-select").append(_html.join(""));
 					cache_data = artTemplate.compile(__inline("./recharge/bank_list.tmpl"))(result);
 					callback();
 				}else{
 					//alert("获取银行卡数据返回错误");
 				}
 			}
 		});
 	},
 	get_special_bank:function(bank_num){
 		//个人中心-个人信息展示
 		$.extend(data_transport, {
 			"userId":user_id,
 			"token":user_token,
 			"bankCardNo":bank_num
 		});

 		$.ajax({
 			url: '/api/payment/getBankCardInfo.do',
 			type: 'post',
 			data: data_transport,
 			success:function(_rel){
 				if(_rel.code == 0){
 					var bank_code = _rel.data.result.cardInfoData.bank_code;
 					$("#bank-select").find("option[data-code='"+bank_code+"']").attr("selected",true);
 					$("#bank-select").change();
 				}else{
 					$("#bank-select").find("option[data-code='0']").attr("selected",true);
 					$("#bank-select").change();
 				}
 			}
 		});
 	},
 	event_handler:function(){

 		var self = this;
 		$(".nextBtn").on("click",function(){
 			//先做表单验证
 			var _this = $(this), 
 				result = self.valid_check(),
 				error_msg = _this.parents(".border-box").find(".error-msg"),
 				error_msg_final = _this.parents(".border-box").next().find(".error-msg")
 			if(result){
 				// debugger;
 				error_msg.text(result);
 				return false;
 			}
 			error_msg.text("");
            error_msg_final.text("");

 			var true_name = $.trim($('#truename').val()),
 				id_number = $.trim($('#id_number').val()),
 				bank_number = $.trim($('#bank_number').val());
 			sms_obj.name = true_name;
 			sms_obj.idCardNo = id_number;
 			sms_obj.bankCardNo = bank_number;
 			sms_obj.bankCode = 	$("#bank-select").find('option:selected').attr('data-code');

 			//判断银行卡号和银行是否关联
 			api.call('/api/payment/getBankCardInfo.do',{
 				'bankCardNo':bank_number
 			},function(_rel){
 				var bank_code_rel = _rel.result.bankCodeData.bank_code;
 				if(bank_code_rel != $("#bank-select").find('option:selected').attr('data-code')){
 					//银行于银行卡号不配
 					error_msg.text("银行卡号与银行名称不符");
 				}else{
		 			//判断连连，还是快钱
		 			$("#recharge").attr("payType",$("#bank-select").find('option:selected').attr('data-provider'));

		 			//发送ajax请求
		 			api.call('/api/user/improveIdentityInfo.do',{
		 				'name': true_name,
		 				'idCardNo':id_number,
		 				'bankCardNo':bank_number,
		 				'bankCode': $('#bank-select').find('option:selected').attr('data-code'),
		 				'bankName':$('#bank-select').find('option:selected').val()
		 			},function(data){
		 				_this.parents(".border-box").find(".error-msg").html("");
		 				//绑定成功 请求接口，获取用户账户余额
		 				api.call('/api/account/getUserAsset.do',{

		 				},function(_rel){
		 					var ableBalanceAmount = (_rel.result.ableBalanceAmount/10000).toFixed(2);
							$(".ableBalanceAmount").text("￥"+ableBalanceAmount);
		 				});
		 				 //判断是连连还是快钱
		 				 var pay_way = $("select[name='bank-select']").find("option:selected").attr("data-provider");
		 				 //连连 - 没有手机号 
		 				 if(pay_way == "lian_lian"){
		 				 	$(".operator_box").find("p[data-type='kuaiqian']").hide();
		 				 }else if(pay_way == "kuai_qian"){
		 				 	$(".operator_box").find("p[data-type='kuaiqian']").show();
		 				 }
		 				 $(".operator_box").slideDown('400');
		 			},function(_rel){
		 				_this.parents(".border-box").find(".error-msg").html(_rel.msg);
		 			});
 				}
 			},function(_rel){
 				error_msg.text(_rel.msg);
 			});

 		});

 		$("#bank-select").change(function(){
 			var _this = $(this),
 				bank_alias = _this.children('option:selected').attr('data-code'),
 				img = _this.next().find('img');

 			$(".operator_box").hide();

 			//每一次选中银行，触发一次事件-修改后面图片
 			if(bank_alias == 0){
 				img.attr('src','/static/img/bank/back-logo.png')
 			}else{
 				img.attr('src','/static/img/bank/'+bank_alias+".png")
 			}
 		});

 		$("#phone_num").on("focus",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".recharge-oprate").find(".error-msg");
 			error_msg.text("");
 		});

 		$(".money").on("focus",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".recharge-oprate").find(".error-msg");
 			error_msg.text(""); 			
 		});

 		$(".shortOne").on("focus",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".recharge-oprate").find(".error-msg");
 			error_msg.text("");  			
 		});

 		var order_id = "";
 		$(".verify_sms").on("click",function(){
 			var count = 60,
 				_this = $(this),
 				error_msg = _this.parents(".recharge-oprate").find(".error-msg");

 			//校验
 			var phone_num = $.trim($("#phone_num").val()),
 				money = $.trim( _this.parents("div").find(".money").val());

 			if(!phone_num){
 				error_msg.text("请输入手机号");
 				return false;
 			}

 			if(!K.is_phone(phone_num)){
 				error_msg.text("手机号码格式不正确，请重新输入");
 				return false;
 			}

 			if(!money){
 				error_msg.text("请输入充值金额");
 				return false;
 			}

 			error_msg.text("");

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

 			self.sendMobileCode(phone_num,money,function(para,trans_data){
 				order_id = para;
 				temp_data = trans_data;
 			})
 		});

 		$(".moreInf").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :cache_data,
			    openfun : function () {
			    }
			});
 		});

 		//判断用户有无设置交易密码
 		function verifyPayPwd(callback){
 			api.call('/api/user/verifyPayPwdState.do',{

 			},function(_rel){
 				if(_rel.result){
 					callback();
 				}else{
 					$.Dialogs({
 					    "id" : "diglog_wrapper",
 					    "overlay" : true,
 					    "cls" : "dialog-wrapper popbox-bankrank2",
 					    "closebtn" : ".quit,span.close",
 					    "auto" : false,
 					    "msg" :self.tpl.setPaypwd(),
 					    openfun : function () {
 					    	window.timer_set_pay_pwd = setTimeout(function(){
 					    		K.gotohref("/my/account/manage.html");
 					    		clearTimeout(timer_set_pay_pwd);
 					    	},3000);
 					    }
 					});
 				}
 			});
 		}

 		$("#recharge").on("click",function(){
 			var _this = $(this),
 				sms_code = _this.parents("div").find(".shortOne"),
				animate_obj = _this.parents(".operator_box"),
				error_msg = _this.parents(".recharge-oprate").find(".error-msg"),
				money = $.trim(animate_obj.find(".money").val()),
				phone_num = $.trim($("#phone_num").val()),
				user_info = JSON.parse($.cookie("ppinf")),
				payType = _this.attr("paytype");

 			if(payType == "lian_lian"){

 				//连连
 				if(!money){
 					error_msg.text("请输入充值金额");
 					return false;
 				}

 				error_msg.text("");

 				verifyPayPwd(function(){
	 				api.call('/api/payment/directPay.do',{
	 					'name':user_info.name,
	 					'idCardNo':$.trim($("#id_number").val()),
	 					'mobile':user_info.loginName,
	 					'totalAmount':money*10000,
	 					'bankCardNo':$.trim($("#bank_number").val()),
	 					'bankCode':$("#bank-select").find("option:selected").attr("data-code"),
	 					"payMethod":'standard',
	 					'payType':'card_front',
	 					'returnUrl':'/my/refund/record.html',
	 					'itemName':'充值金额多少元'
	 				},function(_rel){
	 					var result = _rel.result,
	 						payUrl = result.payUrl,
	 						req_data = result.payParaMap.req_data;
						$("body").append('<form id="pay_now" action="'+payUrl+'" method="'+result.method+'"><input name="req_data" id="req_data"/></form>');
						$("#req_data").val(req_data);
						$("#pay_now").submit();
	 				},function(_rel){
	 					error_msg.parents(".operator_box").find('.error-msg').remove();
	 				});
 				});
 			}else{
 				//快钱
 				
 				if(!phone_num){
 					error_msg.text("请输入手机号");
 					return false;
 				}

 				if(!K.is_phone(phone_num)){
 					error_msg.text("手机号码格式不正确，请重新输入");
 					return false;
 				}

 				if(!money){
 					error_msg.text("请输入充值金额");
 					return false;
 				}

 				if(!$.trim(sms_code.val())){
 					error_msg.text("请输入手机验证码");
 					return false;
 				}

 				error_msg.text("");

 				verifyPayPwd(function(){
 					$.extend(temp_data,{
 						'validCode':$.trim(sms_code.val()),
 						'inRecordNo':order_id
 					});
 					if(_this.hasClass('gray-btn')){
 						return false;
 					}
 					_this.addClass('gray-btn');
 					api.call("/api/payment/firstBindCardPay.do",temp_data,function(_rel){
 						var result = _rel.result;
 						if(result){
 							//充值成功
 							_this.removeClass('gray-btn');
 							$.Dialogs({
 							    "id" : "diglog_wrapper",
 							    "overlay" : true,
 							    "cls" : "dialog-wrapper popbox-bankrank2",
 							    "closebtn" : ".quit,span.close",
 							    "auto" : false,
 							    "msg" :self.tpl.success(),
 							    openfun : function () {
 							    	window.timer = setTimeout(function(){
 							    		K.gotohref("/my/refund/record.html");
 							    		clearTimeout(timer);
 							    	},3000);
 							    }
 							});
 						}
 					},function(_rel){
 						error_msg.text(_rel.msg);
 						_this.removeClass('gray-btn');
 					});
 				});
 			}

 		});

 		$("#bank_number").keydown(function(event) {
 			var _this = $(this),
 				bank_num = $.trim(_this.val());
			if (event.keyCode == "13") {//keyCode=13是回车键
				self.get_special_bank(bank_num);
			}
 		});

 		$("#bank_number").on("blur",function(){
 			var _this = $(this),
 				bank_num = $.trim(_this.val());
			self.get_special_bank(bank_num);
 		});

 		$("#bank_number").on("focus",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".border-box").find(".error-msg");
			error_msg.text("");
 		});
 	},
 	event_handler_bind:function(){
 		var self = this;
 		//显示账户余额
 		api.call('/api/account/getUserAsset.do',{},function(_rel){
 			var ableBalanceAmount = (_rel.result.ableBalanceAmount/10000).toFixed(2);
 			$(".ableBalanceAmount").text('￥'+ableBalanceAmount);
 		});

 		//密码输入框
 		$(".bank-pwd").each(function(index, el) {
 			$(el).find("input").each(function(index, el) {
 				var _this = $(el);
 				_this.on("keyup",function(event){
 					var self = $(this);

 					if(event.which == 8){
 						self.text("");
 						self.prev().focus();
 					}else{
 						self.next().focus();
 					}
 				});
 			});	
 		});

 		//二次充值页面-点击充值Btn
 		$("#recharge-2").on("click",function(){
 			var _this = $(this),
 				actived_div = _this.parents(".border-box"),
 				money = $.trim(actived_div.find(".money").val()),
 				error_msg = actived_div.find('.error-msg'),
 				pwd_array = [];
 			if(_this.hasClass('gray-btn')){
 				return false;
 			}
 			_this.addClass('gray-btn')

 			$.each(actived_div.find(".bank-pwd").find("input"), function(index, val) {
 				 pwd_array.push($(val).val());
 			});

 			//校验操作

 			//输入金额
 			if(!money){
 				error_msg.text("请输入购买金额");
 				return false;
 			}
 			//校验密码
 			if(pwd_array.join("").length < 6){
 				error_msg.text("请输入交易密码");
 				return false;
 			}

 			error_msg.text("");
 			$.extend(sms_obj,{
 				'totalAmount':money*10000,
 				'payPwd':pwd_array.join(""),
 				'payMethod':'quick_pay',
 				'payType':'direct',
 				'itemName':'充值金额多少元',
 				'returnUrl':'/my/personCenter.html'
 			});
 			//ajax请求
 			api.call('/api/payment/directPayByPwd.do',sms_obj,function(_rel){
 				// K.gotohref('/my/personCenter.html');
 				_this.removeClass('gray-btn');

 				$.Dialogs({
 				    "id" : "diglog_wrapper",
 				    "overlay" : true,
 				    "cls" : "dialog-wrapper popbox-bankrank2",
 				    "closebtn" : ".quit,span.close",
 				    "auto" : false,
 				    "msg" :self.tpl.success(),
 				    openfun : function () {
 				    	window.timer = setTimeout(function(){
 				    		K.gotohref("/my/refund/record.html");
 				    		clearTimeout(timer);
 				    	},3000);
 				    }
 				});
 			},function(_rel){
 				_this.removeClass('gray-btn')
 				error_msg.text(_rel.msg);
 			});
 		})
 	},
 	valid_check:function(){
 		
 		var true_name = $('#truename'),
 			id_number = $('#id_number'),
 			bank_number = $('#bank_number'),
 			bank_select = $('#bank-select');


 		//校验真实姓名
 		if(!(true_name && true_name.val() != '') || !K.isChinese(true_name.val())){
 			return '请输入身份证上的姓名';
 		}

 		//校验身份证号码
 		if(!(id_number && id_number.val() != '')){
 			return '请输入正确的身份证号码';
 		}

 		if(id_number.val().length != 18){
 			return '身份证格式有误请重新输入';
 		}

 		//银行卡号
 		if(!(bank_number && bank_number.val() != '')){
 			return '请输入您本人的借记卡卡号';
 		}

 		if(!K.bank_card_check($.trim(bank_number.val()))){
 			return '银行卡卡号格式有误，请重新输入';
 		}

 		// 判断是否选择银行
 		if(!(bank_select && bank_select.find('option:selected').attr('data-code') != '0')){
 			return '请选择银行';
 		}
 		return false;
 	},
 	sendMobileCode:function(phone_num,money,callback){
 		$.extend(sms_obj,{
 			'mobile': phone_num,
 			'totalAmount':money*10000,
 			'payMethod':'quick_pay',
 			'payType':'direct',
 			'itemName':'充值金额多少元'
 		});

 		var error_msg = $("#binding").find(".operator_box .error_msg");

 		api.call('/api/payment/firstPaySendSms.do',sms_obj,function(_rel){
 			error_msg.text("");
 			// $("#append_error_msg").parents(".operator_box").find('.error-msg').remove();
 			var order_id = _rel.result;
 			if(order_id){
 				//生成流水单号
 				callback(order_id,sms_obj);
 			}
 		},function(_rel){
 			error_msg.text(_rel.msg);
 			// $("#append_error_msg").after('<p class="error-msg">'+_rel.msg+'</p>');
 			var _this = $(".verify_sms");
 			_this.removeClass('disabled');
 			_this.removeClass('gray-btn').addClass('light-btn');
 			_this.html("手机验证码");
 			window.clearInterval(timer);
 		});
 	}
}

recharge.init();