/**
 * @function: 首页bannerjs
 * @author :zy
 */

var $ = require('jquery');

var banner = {
	init:function(){

		var timer;
		var setSliderTimer = function(){
			clearInterval(timer);
		     timer = setInterval(function(){
		    	//var default_url=$(".imglist[idx=1]").attr('data-url');
		    	//$(".imglist[idx=1]").css('background-image','url('+default_url+')');
		    	 var mycount = $(".imglist").size();
		    	 var idx = parseInt($(".imglist[data='show']").attr("idx"));
		    	 var nextIdx;
		    	 if(mycount==1){
		    		 return;
		    	 }
		    	 if(idx >= mycount){
		    		 nextIdx = 1;
		    	 }else{
		    		 nextIdx = idx+1;
		    	 }
				 $(".imglist[data='show']").attr("data", "hidden").animate({opacity:0}, 1000, function(){
					 $(this).hide();
					 $(this).css("opacity", 1);
				 });
				 var url=$(".imglist[idx="+nextIdx+"]").attr('data-url');
				 $(".imglist[idx="+nextIdx+"]").attr("data", "show").css("opacity", 0).css('background','url('+url+') no-repeat center #f25b2e').show().animate({opacity:1}, 1000);
		    	 $(".ul_btn a").removeClass("ws_selbull");
		    	 $(".ul_btn li").removeClass("hover");
		    	 $(".ul_btn a[idx="+nextIdx+"]").addClass("ws_selbull");
		    	 $(".ul_btn li[idx="+nextIdx+"]").addClass("hover");
		     }, 5000);
		};
		$(".ul_btn").hover(function(){
		      clearInterval(timer);  
		});
		$(".imglist").hover(function(){
		      clearInterval(timer);  
		},function(){
			setSliderTimer();
		}).trigger("mouseleave");
		$(".ul_btn a").click(function(){
		      clearInterval(timer);
		      var curIdx = $(this).attr("idx");
		      if($(".imglist[data='show']").attr("idx") != curIdx){
		    	 $(".ul_btn a").removeClass("ws_selbull");
		    	 $(".ul_btn li").removeClass("hover");
		    	 $(".ul_btn a[idx="+curIdx+"]").addClass("ws_selbull");
		    	 $(".ul_btn li[idx="+curIdx+"]").addClass("hover");
				 $(".imglist[data='show']").attr("data", "hidden").animate({opacity:0}, 1000, function(){
					 $(this).hide();
					 $(this).css("opacity", 1);
				 });
				 var url=$(".imglist[idx="+curIdx+"]").attr('data-url');
				 $(".imglist[idx="+curIdx+"]").attr("data", "show").css('background','url('+url+') no-repeat center #f25b2e').css("opacity", 0).show().animate({opacity:1}, 1000);
		      }
		});
		$(".ul_btn").css("margin-left", -1*$(".ul_btn").width()/2+"px");
		$(".ul_btn").show();
	}
}

module.exports = banner;
