/**
 * @function : 我要理财系列页面左侧
 * @author  : ZY 
 */


var $ = require('jquery'),
	api    = require("api/api");

var href=window.location.href,
	type="";



 var sideBar = {
 	init:function(){

 		this.animate_controll();
 		this.default_select();
 		this.data_api();

 	},
 	data_api:function(){
 		api.call('/api/product/queryProductList',{
 			'isFlow':1
 		},function(_rel){
 			debugger;
 		});
 	},
 	default_select:function(){
 		//删除class_name selected
 		$('a[data-type]').removeClass('selected');

 		if(href.indexOf("hqb")!=-1){//活期宝

 			type = "hqb";

 		}else if(href.indexOf("ttn")!=-1){//天天牛

 			$($("a[data-type='ttn']")[0]).trigger("click");
 			$($("a[data-type='ttn']")[0]).addClass("selected");
 			if(href.indexOf("90")!=-1){
 				$("a[data-type='ttn_90']").addClass("selected");
 			}else if(href.indexOf("180")!=-1){
 				$("a[data-type='ttn_180']").addClass("selected");
 			}else if(href.indexOf("360")!=-1){
 				$("a[data-type='ttn_360']").addClass("selected");
 			}
 			
 		}else if(href.indexOf('hfb') != -1){//惠芳宝
 			$($("a[data-type='hfb']")[0]).trigger("click");
 			$($("a[data-type='hfb']")[0]).addClass("selected");
 			if(href.indexOf("hfb1")!=-1){
 				$("a[data-type='hfb1']").addClass("selected");
 			}
 		}

 		$("a[data-type='"+type+"']").addClass("selected");
 	},
 	animate_controll:function(){
 		$("a[data-level]").on("click",function(){
 			var _self = $(this);
 			$(".left-tab").find("a[data-level]").removeClass('selected');
 			_self.addClass('selected');

 			$(".left-tab ul").each(function(){
 				if($(this).attr('data-releative') == _self.attr("data-type")){
 					return true;
 				}
 				if(!$(this).is(':hidden')){
 					$(this).hide();
 				}
 			});
 			
 			if(_self.next("ul").is(":hidden")){
 				_self.next('ul').show();
 			}else{
 				_self.next('ul').hide();
 			}
 		});
 	}
 }
 module.exports = sideBar;