/**
 * @function:首页js
 * @author :ZY
 */

var navBar = require("util/navbar"),
	banner = require("ui/banner"),
	toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	$      = require('jquery');

require('util/extend_fn');

toolbar.init();

var index_page = {
	init:function(){
		var login_area = $('.login-area'),
			user_info =  JSON.parse($.cookie('ppinf') || null),
			phone_num = user_info && user_info.loginName,
			self = this;

		if(K.login()){ //用户登入
			login_area.addClass('login-after');
			var str = self.tpl.login_success();
			login_area.html(str.replace(/\{\{.+\}\}/,K.phone_num_map(phone_num)));
		}else{ //用户未登入
			login_area.removeClass('login-after');
			//debugger;
			login_area.html(self.tpl.login_before());
			require('./users/login');
		}
		this.nav_bar(index);
		this.banner();
		this.tab_switch();
	},
	tpl:{
		login_success:function(){
			var buf = [];
			buf.push('<h4>{{login_name}}</h4>');
			buf.push('<h5>欢迎您访问小牛钱罐子</h5>');
			buf.push('<a href="/my/personCenter.html" class="light-btn">进入个人中心</a>');
			buf.push('<p class="assure2"><img src="/static/img/assure.png" alt="" align="absmiddle"><span>账户资金安全由中国人保承保</span></p>');		
			return buf.join("");
		},
		login_before:function(){
			var buf = [];
			buf.push('<div class="textField">');
			buf.push('<span class="user"></span><input name="passport" id="userName" type="text" placeholder="手机号码">');
			buf.push('</div>');
			buf.push('<div class="textField">');
			buf.push('<span class="pwd"></span><input name="userPsw" id="userPass" type="password" placeholder="登录密码"><a class="visible"></a>');
			buf.push('</div>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="remember">');
			buf.push('<input name="" value="1" id="" type="checkbox" class="fl"><span class="fl">记住登录</span><a href="/users/find_pwd.html" class="fr">忘记密码?</a></p>');
			buf.push('<button class="btn_login" type="submit" onfocus="this.blur()">立即登录</button>');
			buf.push('<h5><a href="/users/register.html" target="_blank">没有账户，立即注册</a></h5>');
			buf.push('<span class="assure"></span>');
			buf.push('<div class="assurecont">');
			buf.push('<div class="contword">');
			buf.push('<p>账户资金安全由中国人保承保</p>');
			buf.push('<div class="cont-bk"></div>');
			buf.push('<span></span>');
			buf.push('</div>');
			buf.push('</div>');
			return buf.join("");

		}
	},
	nav_bar:function(index){
		navBar.init(index);
	},
	banner:function(){
		banner.init();
	},
	tab_switch:function(){
		$(".horizon").each(function(){
			var _this = $(this);
			_this.tabSwitch({
				navObj:'.a-tab',
				className:'.front-area',
				curSel:'selected',
				selectorIndex:'.a-tab',
				eventName:'mouseenter'
			});
		});
	}
}

index_page.init();