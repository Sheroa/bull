/**
 * @function : 个人中心js
 * @author  : ZY
 */

var navBar  = require("util/navbar"),
	sidebar = require("util/sidebar"),
	$       = require('jquery'),
	toolbar = require('util/toolbar_pp'),
	K       = require('util/Keeper'),
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
		$.extend(data_transport, {
			"userId":user_id,
			"token":user_token
		});

		$.ajax({
			url: '/api/account/getUserTreasure.do',
			type: 'post',
			data: data_transport,
			success:function(_rel){
				if(_rel.code == 0){
					var render_data = _rel.data.result;
					$.extend(render_data,user_info);
					var _html = artTemplate.compile(__inline("./person_center/profile.tmpl"))(render_data);
					$("#profile").html(_html);
				}
			}
		});
		
		
	}
}

index_page.init();