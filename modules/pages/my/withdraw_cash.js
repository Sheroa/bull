/**
 * @function:提现页面js
 * @author:ZY
 */

 var sidebar = require("util/sidebar"),
 	api = require("api/api"),
 	K = require("util/Keeper"),
 	navBar = require("util/navbar");

 navBar.init(index);
 sidebar.init();

 var width_draw_cash = {
 	init:function(){
 		//页面渲染
 		api.call('/api/user/getIdentityInfoByUser.do',{},function(data){
 			var bank_card_num = data.result.bankCardNo,
 				// container     = $(".add-bank"),
 				container_binded = $('#bank_info');
 			if(!bank_card_num){
 				//用户没有绑定银行卡
 				// container.show();
 			}else{
 				//用户绑定银行卡
 				var obj = data.result,
 					info_pad = container_binded.find(".border-pad"),
 					buf = [];
 				buf.push('<p class="bank-name">'+data.result.bankCode+'</p>');
 				buf.push('<p class="card-kind">储蓄卡</p>');
 				buf.push('<p class="card-owner">户名：'+K.name_map(data.result.userName)+'</p>');
 				if(data.result.bindCard){
 					buf.push('<p class="card-bound"><i>已绑定</i><em>'+K.bank_card_map(data.result.bankCardNo)+'</em></p>');	
 					container_binded.append('<p class="sub-text">单笔限额20万，单日限额200万。<br>实际请参考您的银行限额设置。</p>');
 				}else{
 					buf.push('<p class="card-num">'+K.bank_card_map(data.result.bankCardNo)+'</p>');
 					container_binded.append('<a href="javascript:void(0);" class="alter">修改</a>');	
 				}
 					debugger;			
 				info_pad.html(buf.join(""));

 				container_binded.show();
 			}
 		});
 	}
 }

 width_draw_cash.init();