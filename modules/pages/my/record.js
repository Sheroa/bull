/**
 * @function:系统信息页面js
 * @author:ZY
 */

var api     = require("api/api"),
	sidebar = require("util/sidebar"),
	K       = require('util/Keeper'),
	toolbar = require('util/toolbar_pp'),
	navBar = require("util/navbar");





var record = {
	init:function(){
		toolbar.init();
		navBar.init(index);
		sidebar.init();
		this.event_handler();
	},
	tpl:{

	},
	event_handler:function(){

		//头部信息ajax获取
		api.call('/api/account/getUserTreasure.do',{

		},function(_rel){
			var result = _rel.result;
		})

	}
}

record.init();