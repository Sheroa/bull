/**
 * @function:页面侧边-点击提现btn，判断用户有没有绑定银行卡，也就是用户有没有进行充值
 * @author:ZY
 */

var api     = require("api/api"),
	$       = require('jquery'),
	K       = require('util/Keeper');

var sidebar = {
	init:function(){

		$("a[data-type='withdrawCash']").on("click",function(){
			api.call('/api/user/getIdentityInfoByUser.do',{

			},function(_rel){
				var result = _rel.result,
					is_bind_card = result.bindCard;

				if(is_bind_card){
					//绑定银行卡成功
					K.gotohref('/my/refund/withdrawCash.html');
				}else{
					//没有绑定银行卡，跳转dialog
					alert("请跳转到充值页面");
				}
			});
		});
	}
}

sidebar.init();
