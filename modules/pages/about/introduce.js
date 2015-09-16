/**
 * @function : 联系我们页面js
 * @author  : ZY
 */

var $     		  = require('jquery');  
	navBar        = require("util/navbar"),
	toolbar = require('util/toolbar_pp')
 	sidebar_index = require("./sidebar"),


navBar.init(index);

var insurance = {
	
	//初始化
	init:function(){
		toolbar.init();
		this.sidebar();
	},

	//sidebar
	sidebar:function(){
		// debugger;
		$($(".left-tab").find("a").eq(sidebar_index)).addClass('selected');
	}
}

insurance.init();