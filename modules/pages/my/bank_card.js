/**
 * @function:我的银行卡页面js
 * @author:ZY
 */

 var $ = require('jquery'),
 	 sidebar = require("util/sidebar"),
 	 navBar = require("util/navbar"),
 	 K = require("util/Keeper"),
 	 artTemplate 	= require("artTemplate"),
 	 toolbar = require('util/toolbar_pp'),
 	 api = require("api/api"),
 	 bank_list = [];

 navBar.init(index);
 sidebar.init();
 toolbar.init();
 
 //dialog
 require('ui/dialog/dialog');

 var my_card = {
 	init:function(){

 		var _self = this,
 			bank_list_api = null;

 		//页面渲染
 		api.call('/api/user/getIdentityInfoByUser.do',{},function(data){
 			var bank_card_num = data.result.bankCardNo,
 				container     = $(".add-bank"),
 				container_binded = $('#bank_info');
 			if(!bank_card_num){
 				//用户没有绑定银行卡
 				container.show();
 			}else{
 				//用户绑定银行卡
 				var obj = data.result,
 					info_pad = container_binded.find(".border-pad"),
 					buf = [];
 				buf.push('<p class="bank-name">'+data.result.bankName+'</p>');
 				buf.push('<p class="card-kind">储蓄卡</p>');
 				buf.push('<p class="card-owner">户名：'+K.name_map(data.result.userName)+'</p>');
 				buf.push('<img src="/static/img/bank/'+data.result.bankCode+'2.png">');
 				if(data.result.bindCard){
 					buf.push('<p class="card-bound"><i>已绑定</i><em>'+K.bank_card_map(data.result.bankCardNo)+'</em></p>');	
 					container_binded.append('<p class="sub-text">单笔限额20万，单日限额200万。<br>实际请参考您的银行限额设置。</p>');
 				}else{
 					buf.push('<p class="card-num">'+K.bank_card_map(data.result.bankCardNo)+'</p>');
 					container_binded.append('<a href="javascript:void(0);" class="alter" data-bank-info='+JSON.stringify(data.result)+'>修改</a>');	
 				}
 								
 				info_pad.html(buf.join(""));

 				container_binded.show();
 			}
 			_self.event_handler();
 		});

		//银行列表渲染
		api.call('/api/payment/queryBankList',{},function(data){
			bank_list_api = artTemplate.compile(__inline("./bank_card/bank_list.tmpl"))(data);
			$("#bank_list_view").html(bank_list_api);
			$.each(data.list,function(index,obj){
				bank_list.push('<option data-code='+obj.bank_code+' data-provider='+obj.provider+'>'+obj.bank_name+'</option>');
			});
		});		
 	},
 	tpl:{
 		bank_list: 	function(){
 			var buf = [];
 			buf.push('<p class="ti">修改银行卡信息<a href="#" class="quit"></a></p>');
 			buf.push('<div class="cont2">');
 			buf.push('<p><span class="p-ti">真实姓名</span><input type="text" id="true_name" placeholder="请输入真实姓名"></p>');
 			buf.push('<p><span class="p-ti">身份证号码</span><input type="text" id="identify_num" placeholder="请输入您真实的身份证号码"></p>');
 			buf.push('<p><span class="p-ti">选择银行</span>');
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
 			buf.push('<p><a href="javascript:void(0);" class="gray-btn cancel_btn">取消</a><a href="javascript:void(0);" class="light-btn confirm_btn">确定</a></p></div>')
 			return buf.join("");
 		}
 	},
 	event_handler:function(){
 		
 		var self = this;

 		function bind_func(){
 			var _this = $(this),
 				user_info = JSON.parse(_this.attr('data-bank-info') || null),
 				identify_card = user_info && user_info.identityCard;

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

 			    	api.call("/api/user/getIdentityInfoByUser.do",{},function(_rel){
 			    		var user_info = _rel.result,
 			    			true_name = user_info.userName,
 			    			identify_num = user_info.identityCard,
 			    			bankCode = user_info.bankCode,
 			    			bank_number = user_info.bankCardNo;
 			    		$("#true_name").val(true_name);
 			    		$("#identify_num").val(identify_num);
 			    		$("#bank_number").val(bank_number);
 			    		$("#bank-select").find("option[data-code='"+bankCode+"']").attr('selected',true);
 			    		$("#bank-select").change();
 			    	});

 			    	//确认btn
 			    	$(".confirm_btn").on("click",function(){

 			    		var selected_option = $("select[name='bank-select']").find("option:selected").attr("data-code"),
 			    			bank_card_num = $.trim($("#bank_number").val()),
 			    			error_msg = $(this).parents(".diginfo").find(".error-msg"),
 			    			identify_card = $.trim($("#identify_num").val()),
 			    			true_name = $.trim($("#true_name").val());



		    			//校验真实姓名
		    			if((true_name.length == 0 || !K.isChinese(true_name))){
		    				error_msg.text("输入您本人的借记卡卡号");
		    				return false;
		    			}

		    			//身份证校验
		    			if(identify_card.length == 0){
		    				error_msg.text("请输入正确的身份证号码");
		    				return false;
		    			}

		    			if(identify_card.length != 18){
		    				error_msg.text("身份证格式有误请重新输入");
		    				return false;
		    			}

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


 			    		//发送ajax请求，修改银行卡
 			    		api.call('/api/user/improveIdentityInfo.do',{

 			    			'name': true_name,
 			    			'idCardNo':identify_card,
 			    			'bankCardNo':bank_card_num,
 			    			'bankName':$("select[name='bank-select']").find("option:selected").val(),
 			    			'bankCode':selected_option

 			    		},function(data){
 			    			location.reload(true);
 			    		},function(){
 			    			//输出错误信息
 			    			
 			    		});
 			    	});

 			    	//银行卡下拉菜单
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
 			    }
 			});
 		}

 		//添加银行卡
 		$(".add-bank").on("click",bind_func);

 		$(".alter").on("click",bind_func);

 	}
 }

my_card.init();