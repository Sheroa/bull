/**
 * @function:充值页面js
 * @author:ZY
 */

var $       = require("jquery");
	sidebar = require("util/sidebar"),
 	navbar  = require("util/navbar"),
 	artTemplate 	= require("artTemplate"),
 	cache_data = "",
 	api     = require("api/api"),
 	K = require("util/Keeper"),
 	data_transport = require('common/core_data'),
 	toolbar = require('util/toolbar_pp');


toolbar.init();

//任务执行
require('ui/dialog/dialog');

var user_info =  JSON.parse($.cookie('ppinf')),
	user_id = user_info.userId,
	user_token = user_info.token;

var recharge = {
 	//初始化
 	init:function(){

 		var self = this;

 		this.navBar(index);
 		this.sidebar();

 		//查询银行卡信息
 		api.call('/api/user/getIdentityInfoByUser.do',{},function(_rel){
 			var bank_card_num = _rel.result.bankCardNo;
 			if(bank_card_num){

 				$("#binded").show();

 				//用户已经绑定了银行卡，此时应该进入recharge2.html
 				$(".bank-icbc .border-pad").html(require('./bank_card_info').show(_rel));

 				//获取账户余额
 				api.call('/api/account/getAbleBalance.do',{},function(_rel){
 					//获取余额
 				},function(_rel){
 					alert(_rel.msg);
 				});

 			}else{

 				//用户没有绑定银行卡
 				$("#binding").show();
 				self.bank_list();
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
 	bank_list:function(){
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
 				}
 			}
 		});
 	},
 	event_handler:function(){

 		var self = this;
 		$(".nextBtn").on("click",function(){
 			//先做表单验证
 			var _this = $(this), 
 				result = self.valid_check();
 			if(result){
 				// debugger;
 				_this.parents(".border-box").find(".error-msg").html(result);
 				return false;
 			}
 			_this.parents(".border-box").find(".error-msg").html();


 			var true_name = $.trim($('#truename').val()),
 				id_number = $.trim($('#id_number').val()),
 				bank_number = $.trim($('#bank_number').val());

 			//发送ajax请求
 			api.call('/api/user/improveIdentityInfo.do',{
 				'name': true_name,
 				'idCardNo':id_number,
 				'bankCardNo':bank_number,
 				'bankName': $('#bank-select').find('option:selected').attr('data-code'),
 				'bankCode':$('#bank-select').find('option:selected').val()
 			},function(data){
 				//绑定成功
 				
 				 //判断是连连还是快钱
 				 var pay_way = $("select[name='bank-select']").find("option:selected").attr("data-provider");
 				 //连连 - 没有手机号 
 				 if(pay_way == "lian_lian"){
 				 	$(".operator_box").find("p[data-type='kuaiqian']").hide();
 				 }else if(pay_way == "kuai_qian"){
 				 	$(".operator_box").find("p[data-type='kuaiqian']").show();
 				 }
 				 $(".operator_box").slideDown('400');
 			});


 		});

 		$("#bank-select").change(function(){
 			var _this = $(this),
 				bank_alias = _this.children('option:selected').attr('data-code'),
 				img = _this.next().find('img');

 			$(".operator_box").hide();

 			//每一次选中银行，触发一次事件-修改后面图片
 			if(bank_alias == 0){
 				img.attr('src','')
 			}else{
 				img.attr('src','/static/img/bank/'+bank_alias+".png")
 			}
 		});


 		$(".verify_sms").on("click",function(){
 			var count = 60,
 				_this = $(this);

 			//校验
 			var phone_num = $.trim($("#phone_num").val()),
 				error_msg = $("#append_error_msg");

 			if(!phone_num){
 				error_msg.after("<p class='error-msg'>请输入手机号</p>")
 				return false;
 			}

 			error_msg.parents(".operator_box").find('.error-msg').remove();

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

 			self.sendMobileCode(phone_num)
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

 		$("#bank_number").keydown(function(event) {
 			var _this = $(this),
 				bank_num = $.trim(_this.val());
			if (event.keyCode == "13") {//keyCode=13是回车键
				self.get_special_bank(bank_num);
			}
 		});
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

recharge.init();