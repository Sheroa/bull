/**
 * @function:提现页面js
 * @author:ZY
 */

 var sidebar = require("util/sidebar"),
 	api = require("api/api"),
 	K = require("util/Keeper"),
 	toolbar = require('util/toolbar_pp'),
 	navBar = require("util/navbar"),
 	bank_card_num = "";


 require('ui/dialog/dialog');
 toolbar.init();
 navBar.init(index);
 sidebar.init();

 var temp_user = "";

 var width_draw_cash = {
 	tpl:{
 		success:function(){
 			var buf = [];
 			buf.push('<p class="ti">提现状态</p>');
 			buf.push('<div class="cont3">');
 			buf.push('<p class="buy-ok">提现申请已提交，等待系统审核</p>');
 			buf.push('<p><a href="/my/refund/record.html" class="light-btn">查看交易记录</a></p>')
 			buf.push('</div>');
 			return buf.join("");
 		}
 	},
 	init:function(){

 		var self = this;
		api.call('/api/account/getWithdrawBankCard.do',{

		},function(_rel){
			var userCardData = _rel.result.userCardData,
				buf = [],
				container_binded = $('#bank_info'),
				info_pad = container_binded.find(".border-pad");
			temp_user = _rel.result;
			buf.push('<p class="bank-name">'+userCardData.bank_name+'</p>');
			buf.push('<p class="card-kind">储蓄卡</p>');
			buf.push('<p class="card-bound"><i>已绑定</i><em>'+K.bank_card_map(userCardData.user_card_no)+'</em></p>');	
			buf.push('<img src="/static/img/bank/'+userCardData.bank_code+'2.png">');	
			container_binded.append('<p class="sub-text">单笔限额20万，单日限额200万。<br>实际请参考您的银行限额设置。</p>');
			info_pad.html(buf.join(""));
			container_binded.show();

			//账户可用余额查询
			api.call('/api/account/getUserAsset.do',{},function(_data){
				 var ableBalanceAmount = (_data.result.ableBalanceAmount/10000).toFixed(2);
				 $(".ableBalanceAmount").text("￥"+ableBalanceAmount);
				 $(".money").attr("placeholder","本次可提取"+ableBalanceAmount+"元");

				 var userOutFee = _rel.result.userOutFee,
				 	limitTimes = userOutFee.limitTimes,
				 	hasFee = userOutFee.hasFee,
				 	fee = userOutFee.fee;
				 if(limitTimes > 0){
				 	$("#tip").html('<span class="p-ti">提现费用</span>本月还能免费提现<i>'+limitTimes+'</i>次');
				 }else{
				 	if(ableBalanceAmount < 2){
				 		$("#tip").html('<span class="p-ti">提现费用</span><i>账户余额不足支付2元手续费</i>');
				 	}else if(fee > 0){
				 		$("#tip").html('<span class="p-ti">提现费用</span>账户余额将扣除'+(fee/10000).toFixed(2)+'元手续费');
				 	}
				 }
			},function(_rel){
				alert(_rel.msg);
			});



		})


		//银卡开户行地址
		// api.call('/api/payment/findProvinceList.do',{},function(_rel){
		// 	var list = _rel.list,
		// 		province_list = [];
			
		// 	$.each(list, function(index, val) {
		// 		var str = '<option value="'+val.code+'">'+val.name+'</option>';
		// 		province_list.push(str);	 
		// 	});

		// 	$("#province").append(province_list.join(""));
		// });

		// $("#province").change(function(){
		// 	var self    = $(this),
		// 		city_id = self.children('option:selected').val(),
		// 		city_name = self.children('option:selected').text();
			
		// 	if(city_id == 0){
		// 		//选中option为请选择城市返回，并且清空
		// 		$("#city").html("<option value='0'>请选择城市</option>");
		// 		//$("#bank").html("<option value='0'>请选择支行</option>");
		// 		return false;
		// 	}

		// 	api.call('/api/payment/findCityList.do',{
		// 		'provinceId':city_id,
		// 		'provinceCode':city_name
		// 	},function(_rel){
		// 		var list = _rel.list,
		// 			city_list = [];
		// 		city_list.push('<option value="0">请选择城市</option>');
		// 		$.each(list,function(index,val){
		// 			var str = '<option value="'+val.code+'">'+val.name+'</option>';
		// 			city_list.push(str);
		// 		});

		// 		$("#city").html(city_list.join(""));
		// 	});
		// });

		// $("#city").change(function(){
		// 	var self    = $(this),
		// 		city_id = self.children('option:selected').val(),
		// 		city_name = self.children('option:selected').text();
			
		// 	if(city_id == 0){
		// 		//选中option为请选择城市返回，并且清空
		// 		//$("#bank").html("<option value='0'>请选择支行</option>");
		// 		return false;
		// 	}

		// 	api.call('/api/payment/findBankBranchList.do',{
		// 		'cityId':city_id,
		// 		'cityCode':city_name,
		// 		'bankCardNo':bank_card_num
		// 	},function(_rel){
		// 		var list = _rel.list,
		// 			city_list = [];
		// 		city_list.push('<option value="0">请选择支行</option>');
		// 		$.each(list,function(index,val){
		// 			var str = '<option value="'+val.branchId+'">'+val.branchName+'</option>';
		// 			city_list.push(str);
		// 		});

		// 		$("#bank").html(city_list.join(""));
		// 	});
		// });

		//密码输入框
		$(".bank-pwd").find("input").each(function(index, el) {
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

		//提现		
		$("#withdraw").on("click",function(){
			var _this = $(this),
				actived_div = _this.parents("div"),
				money = $.trim(actived_div.find(".money").val()),
				error_msg = actived_div.find('.error-msg'),
				pwd_array = [];
			$.each(actived_div.find(".bank-pwd").find("input"), function(index, val) {
				 pwd_array.push($(val).val());
			});

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

			api.call('/api/account/userWithdrawByPayPwd.do',{
				'name':temp_user.userCardData.user_name,
				'idCardNo':temp_user.userCardData.identity_card,
				'amount':money*10000,
				"payPwd":pwd_array.join("")
			},function(_rel){
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
				error_msg.text(_rel.msg);
			});
		})
 	}
 }

 width_draw_cash.init();