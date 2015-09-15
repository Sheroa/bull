/**
 * @function : 个人中心js
 * @author  : ZY
 */

var navBar  = require("util/navbar"),
	sidebar = require("util/sidebar"),
	$       = require('jquery'),
	toolbar = require('util/toolbar_pp'),
	K       = require('util/Keeper'),
	api     = require("api/api"),
	data_transport = require('common/core_data'),
	artTemplate 	= require("artTemplate");

toolbar.init();
require('util/extend_fn');

var user_info =  JSON.parse($.cookie('ppinf')),
	user_id = user_info.userId,
	user_token = user_info.token;

var index_page = {
	init:function(){
		this.profile();
		this.nav_bar(index);
		this.side_bar();
		this.tab_switch();
		this.event_handler();
	},
	nav_bar:function(index){
		navBar.init(index);
	},
	side_bar:function(){
		sidebar.init();
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
	},
	profile:function(){
		//个人中心-个人信息展示

		api.call('/api/account/getUserTreasure.do',{},function(_rel){
			var render_data = _rel.result;
			$.extend(render_data,user_info);
			var _html = artTemplate.compile(__inline("./person_center/profile.tmpl"))(render_data);
			$("#profile").html(_html);
		},function(_rel){
			alert(_rel.msg);
		});
		
	},
	event_handler:function(){
		api.call('/api/user/getUserBindCardState.do',{},function(_rel){
			var isSetPayPwd = _rel.result.isSetPayPwd, //设置交易密码
				isAuthentication = _rel.result.isAuthentication, //实名认证
				isBindCard = _rel.result.isBindCard,//绑定银行卡
				url_array = [
					"/my/account/manage.html", //账户管理
					"/my/account/bankCard.html",	//银行卡
					"/my/account/manage.html" //账户管理
				];
		
			//实名认证
			if(isAuthentication){
				$(".service").children('span').eq(0).addClass('selected');
			}
			//绑定银行卡
			if(isBindCard){
				$(".service").children('span').eq(1).addClass('selected');
			}
			//设置交易密码
			if(isSetPayPwd){
				$(".service").children('span').eq(2).addClass('selected');
			}

			//给span绑定click事件
			$(".service span").on("click",function(){
				var _this = $(this);
				if(_this.hasClass('selected')){
					return false;
				}
				K.gotohref(url_array[_this.index()]);
			});

			
		});
	}
}

index_page.init();