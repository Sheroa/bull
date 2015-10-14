/**
 * @author  : ZY
 */

var toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	api    = require("api/api"),
	sidebar = require("./sidebar"),
	navBar = require("util/navbar");

require('util/extend_fn');
require('ui/dialog/dialog');
require("ui/radialIndicator");

var hqb = {
	init:function(){

		var self = this;
		//头部信息
		navBar.init(index);
		toolbar.init();
		sidebar.init();
		self.event_handler();	
		$('#indicatorContainer').radialIndicator({
	        barColor: '#f27835',
	        barWidth: 8,
	        initValue: 100,
	        radius:60,
	        roundCorner : true,
	        percentage: true
    	});
	},
	event_handler:function(){

		//活期宝下面的tab切换
		$(".tab-col").tabSwitch({
			navObj:'.navObj',
			className:'.cont',
			curSel:'selected',
			selectorIndex:'.navObj'
		});

	}
}

hqb.init();