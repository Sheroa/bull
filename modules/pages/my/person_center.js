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
		
	}
}

index_page.init();