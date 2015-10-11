/**
 * @function:页面侧边-点击提现btn，判断用户有没有绑定银行卡，也就是用户有没有进行充值
 * @author:ZY
 */

var api     = require("api/api"),
	$       = require('jquery'),
	K       = require('util/Keeper');

//任务执行
require('ui/dialog/dialog');

var sidebar = {
	tpl:{
		recharge:function(){
			var buf = [];
			buf.push('<p class="ti">未充值成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">请先充值后提现，马上<a href="/my/refund/recharge.html">充值</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	init:function(){
		var self  = this;
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
								
					$.Dialogs({
					    "id" : "diglog_wrapper",
					    "overlay" : true,
					    "cls" : "dialog-wrapper popbox-bankrank",
					    "closebtn" : ".quit,span.close",
					    "auto" : false,
					    "msg" :self.tpl.recharge()
					});
				}
			});
		});
	}
}

sidebar.init();
