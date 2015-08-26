/**
 * @function；个人中心->左侧栏  动画效果
 */
 var $ = require('jquery');

 var href=window.location.href,
 	type="";

function sideBar(){

}

var sideBar = {
	init:function(){

		this.animate_controll();
		this.default_select();

	},
	default_select:function(){
		//删除class_name selected
		$('a[data-type]').removeClass('selected');

		if(href.indexOf("personCenter")!=-1){//个人中心

			type = "personCenter";

		}else if(href.indexOf("fund")!=-1){//资金

			$($("a[data-type='fund']")[0]).trigger("click");
			$($("a[data-type='fund']")[0]).addClass("selected");
			if(href.indexOf("record")!=-1){
				$("a[data-type='record']").addClass("selected");
			}else if(href.indexOf("recharge")!=-1){
				$("a[data-type='recharge']").addClass("selected");
			}else if(href.indexOf("withdrawCash")!=-1){
				$("a[data-type='withdrawCash']").addClass("selected");
			}
			
		}else if(href.indexOf('account') != -1){//账号
			$($("a[data-type='account']")[0]).trigger("click");
			$($("a[data-type='account']")[0]).addClass("selected");
			if(href.indexOf("bankCard")!=-1){
				$("a[data-type='bankCard']").addClass("selected");
			}else if(href.indexOf("systemMsg")!=-1){
				$("a[data-type='systemMsg']").addClass("selected");
			}
		}

		$("a[data-type='"+type+"']").addClass("selected");
	},
	animate_controll:function(){
		$("a[data-level]").on("click",function(){
			var _self = $(this);
			$(".left-tab ul").each(function(){
				if(!$(this).is(':hidden')){
					$(this).show();
				}
			});
			if(_self.next("ul").is(":hidden")){
				_self.next('ul').show();
			}else{
				_self.next('ul').hide();
			}
		})
	}
}
module.exports = sideBar;

