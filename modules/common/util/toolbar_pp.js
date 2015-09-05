/**
 * @function:头部js
 * @author : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper'),
	data_transport = require('common/core_data'),
	passport = require('util/passport');

var toolbar={
	init:function(){
		var self = this;
		if(K.login()){

			//修改导航栏
			var user_info =  JSON.parse($.cookie('ppinf')),
				user_id = user_info.userId,
				user_token = user_info.token;

			//调用接口，获取未读消息数
			$.extend(data_transport, {
				"userId":user_id,
				"token":user_token
			});

			$.ajax({
				url: '/api/msg/getUnreadCount.do',
				type: 'post',
				data: data_transport,
				success:function(_rel){
					if(_rel.code == 0){
						var msg_none = _rel.data.result;
						$("#wdl").addClass('hide');
						var _html =  '<p class="name-msg"><a href="/my/account/systemMsg.html" class="name">'+user_info.loginName+'</a><a href="/my/account/systemMsg.html" class="msg-num">'+msg_none+'</a></p>'+
							'<ul>'+
								'<li class="ti"><a href="#">欢迎您，'+user_info.loginName+'</a></li>'+
								'<li><a href="#" class="login1">充值</a></li>'+
								'<li><a href="#" class="login2">提现</a></li>'+
								'<li><a href="/my/account/systemMsg.html" class="login3">消息提醒</a><a href="/my/account/systemMsg.html" class="msg-num">'+msg_none+'</a></li>'+
								'<li><a href="javascript:void(0)" id="logout" class="login4">退出登录</a></li>'+
							'</ul>'
						$('#ydl').html(_html).removeClass('hide');
						self.event_handler();
					}
				}
			});
			
		}else{
			//跳转到登陆页面
			K.gotohref("/users/login.html?return_to="+location.href.replace(/^.*?\/\/.*?\//,"/"));	
		}
		
	},
	event_handler:function(){
		$("#logout").on("click",function(){
			passport.doLogout();
		});
	}
}

module.exports = toolbar;