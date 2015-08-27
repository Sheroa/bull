/**
 * @function : 安全保障页面js
 * @author  : ZY
 */

var $     		  = require('jquery');  
	navBar        = require("util/navbar"),
 	sidebar_index = require("./sidebar"),


navBar.init(index);

var insurance = {
	
	//初始化
	init:function(){
		this.sidebar();
	},

	//sidebar
	sidebar:function(){
		// debugger;
		$($(".left-tab").find("a").eq(sidebar_index)).addClass('selected');
	}
}

insurance.init();