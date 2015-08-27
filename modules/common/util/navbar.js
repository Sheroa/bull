/**
 * @function:设置头部选中状态
 * @author : ZY 
 */

var $ = require('jquery');

var navbar = {
	init:function(index){

		this.setMenuCurClass(index);
		this.head_nav_hover();

	},
	setMenuCurClass:function(curIndex){
		$("#nav").children('a').removeClass('selected').eq(curIndex).addClass("selected");
	},
	head_nav_hover:function(){
		if(typeof($(this).attr("id"))=="undefined"){
			return
		}else{
			var thisId=$(this).attr("id");
			var subList=$(".'+thisId+'");
			$(subList).addClass("show");
		}
	}
}

module.exports = navbar;

