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

 toolbar.init();
 navBar.init(index);
 sidebar.init();

 var width_draw_cash = {
 	init:function(){
 		//页面渲染
 		api.call('/api/user/getIdentityInfoByUser.do',{},function(data){
 			var bank_card_num = data.result.bankCardNo,
 				container     = $(".add-bank"),
 				container_binded = $('#bank_info');
 			if(!bank_card_num){
 				//用户没有绑定银行卡
 				// container.show();
 			}else{
 				//用户绑定银行卡
 				var obj = data.result,
 					info_pad = container_binded.find(".border-pad"),
 					buf = [];
 				buf.push('<p class="bank-name">'+data.result.bankName+'</p>');
 				buf.push('<p class="card-kind">储蓄卡</p>');
 				bank_card_num = data.result.bankCardNo;
 				if(data.result.bindCard){
 					buf.push('<p class="card-bound"><i>已绑定</i><em>'+K.bank_card_map(data.result.bankCardNo)+'</em></p>');	
 					container_binded.append('<p class="sub-text">单笔限额20万，单日限额200万。<br>实际请参考您的银行限额设置。</p>');
 				}else{
 					buf.push('<p class="card-num">'+K.bank_card_map(data.result.bankCardNo)+'</p>');
 					buf.push('<span></span>');
 					//container_binded.append('<a href="javascript:void(0);" class="alter">修改</a>');	
 				}
 				
 				info_pad.html(buf.join(""));

 				container_binded.show();
 			}
 		});

		//账户可用余额查询
		api.call('/api/account/getUserAsset.do',{},function(_rel){
			 var ableBalanceAmount = _rel.result.ableBalanceAmount;
			 $(".ableBalanceAmount").text("￥"+ableBalanceAmount);
		},function(_rel){
			alert(_rel.msg);
		});

		//银卡开户行地址
		api.call('/api/payment/findProvinceList.do',{},function(_rel){
			var list = _rel.list,
				province_list = [];
			
			$.each(list, function(index, val) {
				var str = '<option value="'+val.code+'">'+val.name+'</option>';
				province_list.push(str);	 
			});

			$("#province").append(province_list.join(""));
		});

		$("#province").change(function(){
			var self    = $(this),
				city_id = self.children('option:selected').val(),
				city_name = self.children('option:selected').text();
			
			if(city_id == 0){
				//选中option为请选择城市返回，并且清空
				$("#city").html("<option value='0'>请选择城市</option>");
				//$("#bank").html("<option value='0'>请选择支行</option>");
				return false;
			}

			api.call('/api/payment/findCityList.do',{
				'provinceId':city_id,
				'provinceCode':city_name
			},function(_rel){
				var list = _rel.list,
					city_list = [];
				city_list.push('<option value="0">请选择城市</option>');
				$.each(list,function(index,val){
					var str = '<option value="'+val.code+'">'+val.name+'</option>';
					city_list.push(str);
				});

				$("#city").html(city_list.join(""));
			});
		});

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
 	}
 }

 width_draw_cash.init();