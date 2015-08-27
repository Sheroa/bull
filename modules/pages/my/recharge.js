/**
 * @function:充值页面js
 * @author:ZY
 */

var $       = require("jquery");
	sidebar = require("util/sidebar"),
 	navbar  = require("util/navbar");



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
 					$("#bank-select").html(_html.join(""));
 				}else{
 					alert("获取银行卡数据返回错误");
 				}
 			}
 		});
 	},
 	event_handler:function(){

 		$(".nextBtn").on("click",function(){
 			//先做表单验证
 			
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
 	}
}

recharge.init();