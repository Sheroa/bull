/**
 * @function:设置头部选中状态
 * @author : ZY 
 */

var $ = require('jquery');

var navbar = {
	init: function(index) {

		this.setMenuCurClass(index);
		this.head_nav_hover();

	},
	setMenuCurClass: function(curIndex) {
		$("#nav").children('a').removeClass('selected').eq(curIndex).addClass("selected");
	},
	head_nav_hover: function() {
		$("#nav").children('a').hover(function() {
			if (!(typeof($(this).attr("id")) == "undefined")) {
				var thisId = $(this).attr("id");
				var subList = $("." + thisId);
				$(subList).show();
				$(this).addClass("selected");
			} 
		}, function() {
			var thisId = $(this).attr("id");
			var subList = $("." + thisId);
			$(subList).hide();
			$(this).removeClass("selected");
		})
		$("#nav").children('ul').hover(function() {
			var thisClass = $(this).attr("class");
			var aLink = $("#" + thisClass);
			$(this).show();
			$(aLink).addClass("selected");
		}, function() {
			var thisClass = $(this).attr("class");
			var aLink = $("#" + thisClass);
			$(this).hide();
			$(aLink).removeClass("selected");
		})
	}
}

module.exports = navbar;