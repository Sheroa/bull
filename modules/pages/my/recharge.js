/**
 * @function:充值页面js
 * @author:ZY
 */

var $       = require("jquery");
	sidebar = require("util/sidebar"),
 	navbar  = require("util/navbar");

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
 			var result = self.valid_check();
 			if(result){
 				console.log(result);
 				return false;
 			}
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
 			
 			$(".operator_box").hide();
 			//每一次选中银行，触发一次事件-修改后面图片
 			
 		});
 		$(".moreInf").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :'<p class="ti">银行充值限额表<a href="javascript:void(0)" class="quit"></a></p>'+
			'<div class="cont">'+
				'<table>'+
					'<tr>'+
						'<th width="110">银行名称</th>'+
						'<th>单笔限额</th>'+
						'<th>单日限额</th>'+
						'<th>单月限额</th>'+
					'</tr>'+
					'<tr>'+
						'<td>工商银行</td>'+
						'<td>50,000</td>'+
						'<td>500,000</td>'+
						'<td>无限额</td>'+
					'</tr>'+
				'</table>'+
				'</div>',
			    openfun : function () {
			    	 $('.popbox-bankrank .quit').on('click',function(){
			    	 	//关闭dialog弹窗
			    	 	debugger;
			    	 	$('.popbox-bankrank span.close').trigger('click');
			    	 })
			    }
			});
 		})
 	},
 	valid_check:function(){
 		
 		//校验真实姓名
 		if(!($('#truename') && $('#truename').val() != '')){
 			return '请输入用户名';
 		}

 		//校验身份证号码
 		if(!($('#id_number') && $('#id_number').val() != '')){
 			return '请输入身份证号码';
 		}

 		//银行卡号
 		if(!($('#id_number') && $('#bank_number').val() != '')){
 			return '请输入银行卡号';
 		}	

 		//判断是否选择银行
 		// if(!($('#bank-select') && $('#bank-select').find('option:selected').attr('data-code') != '0')){
 		// 	return '请选择银行';
 		// }
 		return false;
 	}
}

recharge.init();