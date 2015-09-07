/**
 * @function:我的银行卡页面js
 * @author:ZY
 */

 var $ = require('jquery'),
 	 sidebar = require("util/sidebar"),
 	 navBar = require("util/navbar"),
 	 K = require("util/Keeper"),
 	 api = require("api/api");

 navBar.init(index);
 sidebar.init();

 //dialog
 require('ui/dialog/dialog');

 var my_card = {
 	init:function(){
 		this.event_handler();
 	},
 	tpl:{
 		bank_list: 	function(){
 			var buf = [];
 			buf.push('<p class="ti">填写银行卡信息<a href="#" class="quit"></a></p>');
 			buf.push('<div class="cont2"><p>');
 			buf.push('<span class="p-ti">选择银行</span>');
 			buf.push('<select name="bank-select" id="bank-select">');
 			buf.push('<option data-code="0">');
 			buf.push('请选择银行');
 			buf.push('</option>');
 			buf.push('</select>');
 			buf.push('<span>');
 			buf.push('<img src="/static/img/bank/back-logo.png" alt="" class="bank-logo">');
 			buf.push('</span></p>');
 			// buf.push('<p class="error-msg">请选择银行</p>');
 			buf.push('<p><span class="p-ti">银行卡号</span><input type="text" id="bank_number" placeholder="请输入您本人的借记卡号"></p>');
 			buf.push('<p class="error-msg"></p>');
 			buf.push('<p class="moreInf"><a href="javascript:void(0)">查看充值支持银行及限额</a></p>');
 			buf.push('<p><a href="javascript:void(0);" class="gray-btn cancel_btn">取消</a><a href="javascript:void(0);" class="light-btn confirm_btn">确定</a></p></div>')
 			return buf.join("");
 		}
 	},
 	event_handler:function(){
 		
 		var self = this,
 			bank_list = [];

 		//添加银行卡
 		$(".add-bank").on("click",function(){
 			var _this = $(this);
 				

 			$.Dialogs({
 			    "id" : "diglog_wrapper",
 			    "overlay" : true,
 			    "cls" : "dialog-wrapper popbox-bankrank",
 			    "closebtn" : ".quit,span.close,.cancel_btn",
 			    "auto" : false,
 			    "msg" :self.tpl.bank_list(),
 			    openfun : function () {

 			    	//获取银行卡列表信息
 			    	if(bank_list.length == 0){
 			    		api.call('/api/payment/queryBankList',{},function(data){
 			    			$.each(data.list,function(index,obj){
 			    				bank_list.push('<option data-code='+obj.bank_code+' data-provider='+obj.provider+'>'+obj.bank_name+'</option>');
 			    			});

 			    			$("#bank-select").append(bank_list.join(""));
 			    		})
 			    	}else{

 			    		$("#bank-select").append(bank_list.join(""));

 			    	}

 			    	//确认btn
 			    	$(".confirm_btn").on("click",function(){

 			    		var selected_option = $("select[name='bank-select']").find("option:selected").attr("data-code"),
 			    			bank_card_num = $.trim($("#bank_number").val()),
 			    			error_msg = $(this).parents(".diginfo").find(".error-msg");
 			    		if(selected_option == 0){
 			    			error_msg.text("请选择银行");
 			    			return false;
 			    		}

 			    		//银行卡号校验
 			    		if(bank_card_num.length == 0){
 			    			error_msg.text("输入您本人的借记卡卡号");
 			    			return false;
 			    		}

 			    		if(!K.bank_card_check(bank_card_num)){
 			    			error_msg.text("银行卡卡号格式有误，请重新输入");
 			    			return false;
 			    		}

 			    		error_msg.text("");
 			    	})
 			    }
 			});
 		});
 	}
 }

my_card.init();