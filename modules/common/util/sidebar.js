/**
 * @function；个人中心->左侧栏  动画效果
 */

var $ = require('jquery');

var href=window.location.href,
	type="";

if(href.indexOf("personCenter")!=-1){//个人中心

	typeof = "personCenter";

}else if(href.indexOf("fund")!=-1){//资金

	$($("p[data-type='fund']")[0]).trigger("click");
	$($("p[data-type='fund']")[0]).addClass("selected");
	if(href.indexOf("record")!=-1){
		$("li[data-type='record']").addClass("selected");
	}else if(href.indexOf("recharge")!=-1){
		$("li[data-type='recharge']").addClass("selected");
	}else if(href.indexOf("withdrawCash")!=-1){
		$("li[data-type='withdrawCash']").addClass("selected");
	}
	
}
$("p[data-type='"+type+"']").addClass("selected");
