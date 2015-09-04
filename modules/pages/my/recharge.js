/**
 * @function:充值页面js
 * @author:ZY
 */

var $       = require("jquery");
	sidebar = require("util/sidebar"),
 	navbar  = require("util/navbar"),
 	artTemplate 	= require("artTemplate"),
 	cache_data = "",
 	K = require("util/Keeper");

//任务执行
require('ui/dialog/dialog');

var recharge = {
 	//初始化
 	init:function(){
 		this.navBar(index);
 		this.sidebar();
 		this.bank_list();
 		this.event_handler();
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
 	event_handler:function(){

 		var self = this;
 		$(".nextBtn").on("click",function(){
 			//先做表单验证
 			var _this = $(this), 
 				result = self.valid_check();
 			if(result){
 				// debugger;
 				_this.parents(".border-box").find(".error-msg").html("<span class='p-ti'></span>"+result);
 				return false;
 			}
 			_this.parents(".border-box").find(".error-msg").html("<span class='p-ti'></span>");
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
 	}
}

recharge.init();