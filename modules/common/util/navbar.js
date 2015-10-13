/**
 * @function:设置头部选中状态
 * @author : ZY 
 */

var $ = require('jquery');

var navbar = {
	init: function(index) {
		this.setMenuCurClass(index);
		this.head_nav_hover();
		this.head_login_hover();

	},
	setMenuCurClass: function(curIndex) {
		$("#nav").children('a').removeClass('selected').eq(curIndex).addClass("selected");
	},
	head_nav_hover: function() {
		$("#nav").children('a').hover(function() {
			if (!(typeof $(this).attr("id")  == "undefined")) {
				var thisId = $(this).attr("id");
				var subList = $("." + thisId);
				$(subList).show();
				$(this).addClass("click");
			} 
		}, function() {
			if (!(typeof $(this).attr("id")  == "undefined")) {
				var thisId = $(this).attr("id");
				var subList = $("." + thisId);
				$(subList).hide();
				$(this).removeClass("click");
			}
		})
		$("#nav").children('ul').hover(function() {
			var thisClass = $(this).attr("class");
			var aLink = $("#" + thisClass);
			$(this).show();
			$(aLink).addClass("click");
		}, function() {
			var thisClass = $(this).attr("class");
			var aLink = $("#" + thisClass);
			$(this).hide();
			$(aLink).removeClass("click");
		})
	},
	head_login_hover:function(){
		$(".regis-login").hover(function(){
			$(this).find("ul").show();
		},function(){
			$(this).find("ul").hide();
		})
		$(".regis-login ul").hover(function(){
			$(this).show(); 
		},function(){
			$(this).hide();
		});
	}
}

module.exports = navbar;