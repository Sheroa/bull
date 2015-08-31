/**
 * @function:首页js
 * @author :ZY
 */

var navBar = require("util/navbar"),
	banner = require("ui/banner"),
	$      = require('jquery');

require('util/extend_fn');

var index_page = {
	init:function(){
		this.nav_bar(index);
		this.banner();
		this.tab_switch();
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