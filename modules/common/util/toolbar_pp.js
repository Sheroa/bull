/**
 * @function:头部js
 * @author : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper'),
	data_transport = require('common/core_data'),
	api = require('api/api'),
	passport = require('util/passport');

	require('ui/dialog/dialog');

var toolbar={
	init:function(){
		var self = this;
		if(K.login()){

			var user_info =  JSON.parse($.cookie('ppinf'));

			api.call('/api/msg/getUnreadCount.do',{},function(data){
				var msg_none = data.result;
				$("#wdl").addClass('hide');
				var _html =  '<p class="name-msg"><a href="/my/account/systemMsg.html" class="name">'+K.phone_num_map(user_info.loginName)+'</a><a href="/my/account/systemMsg.html" class="msg-num">'+msg_none+'</a></p>'+
					'<ul>'+
						'<li class="ti"><a href="/my/personCenter.html">欢迎您，'+K.phone_num_map(user_info.loginName)+'</a></li>'+
						'<li><a href="javascript:void(0)" class="login1 recharge_btn">充值</a></li>'+
						'<li><a href="javascript:void(0)" data-type="withdrawCash" class="login2">提现</a></li>'+
						'<li><a href="/my/account/systemMsg.html" class="login3">消息提醒</a><a href="/my/account/systemMsg.html" class="msg-num">'+msg_none+'</a></li>'+
						'<li><a href="javascript:void(0)" id="logout" class="login4">退出登录</a></li>'+
					'</ul>'
				$('#ydl').html(_html).removeClass('hide');
				self.event_handler();
			});
		}else{
			//跳转到登陆页面	
			if(location.href.indexOf('my') > 0 ){
				K.gotohref("/users/login.html?return_to="+location.href.replace(/^.*?\/\/.*?\//,"/"));
			}	
		}
		
	},
	tpl:{
		setPaypwd:function(){
			var buf = [];
			buf.push('<p class="ti">设置交易密码</p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">为保障资金安全，请先设置交易密码，<br>3秒后自动跳转到交易密码设置页面。<br><a href="/my/account/manage.html?d=1">点击直接跳转</a></p>');
			buf.push('</div>');
			return buf.join("");
		},
		recharge:function(){
			var buf = [];
			buf.push('<p class="ti">未充值成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">请先充值后提现，马上<a href="/my/refund/recharge.html">充值</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	event_handler:function(){
		$("#logout").on("click",function(){
			passport.doLogout();
		});

		//充值设置交易密码
		var self = this;
		$(document).on("click",".recharge_btn",function(){
			api.call('/api/user/verifyPayPwdState.do',{

			},function(_rel){
				if(_rel.result){
					K.gotohref("/my/refund/recharge.html");
				}else{
					$.Dialogs({
					    "id" : "diglog_wrapper",
					    "overlay" : true,
					    "cls" : "dialog-wrapper popbox-bankrank2",
					    "closebtn" : ".quit,span.close",
					    "auto" : false,
					    "msg" :self.tpl.setPaypwd(),
					    openfun : function () {
					    	window.timer_set_pay_pwd = setTimeout(function(){
					    		K.gotohref("/my/account/manage.html?d=1");
					    		clearTimeout(timer_set_pay_pwd);
					    	},3000);
					    }
					});
				}
			});
		});

		$(document).on("click","a[data-type='withdrawCash']",function(){
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

module.exports = toolbar;