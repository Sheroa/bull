/**
 * @function:首页js
 * @author :ZY
 */

var navBar = require("util/navbar"),
	banner = require("ui/banner"),
	toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	artTemplate 	= require("artTemplate"),
	api     = require("api/api"),
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
			api.call('/api/account/getUserWallet.do',{

			},function(_rel){
				var result = _rel.result,
					toInvestAmount = (result.toInvestAmount/10000).toFixed(2),
					redPacketCount = result.redPacketCount;
				login_area.addClass('login-after');
				var str = self.tpl.login_success();
				login_area.html(str.replace(/\{\{.+\}\}/,K.phone_num_map(phone_num)));
				$("#toInvestAmount").text("￥"+toInvestAmount);
				$("#redPacketCount").text(redPacketCount+"个");

				//首页-活期宝-剩余金额		
				api.call('/api/product/current/queryProductInfo',{},function(_rel){
					var result = _rel.result,
						remaMoney = result.remaMoney;				
					$(".fRedeemMoney").append('<p>剩余金额：<em>'+(remaMoney/10000).toFixed(2)+'</em></p>');
				});
			},function(_rel){

			});

			//debugger;

		}else{ //用户未登入
			login_area.removeClass('login-after');
			//debugger;
			login_area.html(self.tpl.login_before());
			require('./users/login');
			$(".assure").hover(function(){
				$(this).next().show();
			},function(){
				$(this).next().hide();
			});
		}

		//首页新闻列表
		api.call('/api/news/queryNewsMedia',{
			'pageIndex':1,
			'pageSize':3
		},function(_rel){
			$("#media_list").html(artTemplate.compile(__inline("./news/list.tmpl"))(_rel));
		});

		this.nav_bar(index);
		this.banner();
		this.tab_switch();
	},
	tpl:{
		login_success:function(){
			var buf = [];
			buf.push('<h4>{{login_name}}<i style="font-size:14px;font-style:normal;">欢迎您！</i></h4>');
			buf.push('<h5><span>账户余额</span><em id="toInvestAmount"></em></h5>');
			buf.push('<h5><span>未使用红包</span><em id="redPacketCount"></em><a href="/my/discount.html">点击查看</a></h5>');
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
			buf.push('<a href="/users/find_pwd.html" class="fr">忘记密码?</a></p>');
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