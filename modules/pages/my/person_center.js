/**
 * @function : 个人中心js
 * @author  : ZY
 */

var navBar = require("util/navbar"),
	sidebar = require("util/sidebar"),
	$      = require('jquery');

require('util/extend_fn');

var index_page = {
	init:function(){
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
	}
}

index_page.init();