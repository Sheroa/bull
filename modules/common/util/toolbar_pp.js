/**
 * @function:头部js
 * @author : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper'),
	data_transport = require('common/core_data'),
	api = require('api/api'),
	passport = require('util/passport');

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
						'<li><a href="/my/refund/recharge.html" class="login1">充值</a></li>'+
						'<li><a href="/my/refund/withdrawCash.html" class="login2">提现</a></li>'+
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
	event_handler:function(){
		$("#logout").on("click",function(){
			passport.doLogout();
		});
	}
}

module.exports = toolbar;