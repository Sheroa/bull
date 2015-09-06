/**
 * @function:系统信息页面js
 * @author:ZY
 */

var sidebar = require("util/sidebar"),
	artTemplate 	= require("artTemplate"),
	data_transport = require('common/core_data'),
	toolbar = require('util/toolbar_pp'),
 	navBar = require("util/navbar");

 toolbar.init();

 navBar.init(index);
 sidebar.init();


 var user_info =  JSON.parse($.cookie('ppinf')),
 	user_id = user_info.userId,
 	user_token = user_info.token,
 	filter = {
 		'pageIndex':1,
 		'pageSize':10
 	};
window.filter = filter;
 //获取页码总数
 function getPageNum(pageSize,totalRecord){
 	if(totalRecord%pageSize == 0){
 		return totalRecord/pageSize;
 	}else{
 		return Math.ceil(totalRecord/pageSize);
 	}
 }

 //页码
 function pageUtil(index,total){
 	var start = 1, end = total;
 	if (total > 5) {
 		if (index <= 3) {
 			end = 5;
 		} else if (index >= total - 2) {
 			start = total - 4;
 		} else {
 			start = index - 2;
 			end = index + 2;
 		}
 	}
 	return [ start, end ];
 }

 var msg = {
 	init:function(){
 		this.msg_list_show();
 		this.event_handler();
 	},
 	event_handler:function(){

 		$("#msg_list").on("click",".ti",function(){
 			var _this = $(this),
 				par = _this.parent(),
 				obj = _this.next(".cont");
 			if(par.hasClass('selected')){
 				par.removeClass('selected');
 				obj.hide();
 			}else{
 				par.addClass('selected');
 				obj.show();
 			}
 			
 		});

 		$("#msg_list").on("click",".checkbox",function(e){
 			//添加class 决定选中还是非选中
 			

 			//阻止冒泡
 			e.stopPropagation();
 		});

 		//删除消息btn
 		$("#delete_btn").on("click",function(){

 		})
 	},
 	msg_list_show:function(){

 		var self = this;

 		$.extend(data_transport, {
 			"userId":user_id,
 			"token":user_token
 		},filter);

 		$.ajax({
 			url: '/api/msg/querSystemMessage.do',
 			type: 'post',
 			data: data_transport,
 			success:function(_rel){
 				var cache_data = artTemplate.compile(__inline("./system_msg/msg_list.tmpl"))(_rel);
 				$("#msg_list").html(cache_data);

 				var pageSize = _rel.data.pageSize,
 					totalRecord = _rel.data.totalCount,
 					pageNum = getPageNum(pageSize,totalRecord);

 				if(pageNum > 1){ //页码大于1，才显示
 					var _html = [];
 					if(filter.pageIndex > 1){
 						_html.push('<a href="javascript:filter.pageIndex--;getlist();"><</a> ');
 					}
 					var se = pageUtil(filter.pageIndex,pageNum);
 					if(se[0] > 1){
 						_html.push(' <a href="javascript:filter.pageIndex=1;getlist();">1</a> ...');
 					}
 					for(var i=se[0];i<=se[1];i++){
 						if(filter.pageIndex==i){
 							_html.push(' <a href="javascript:void(0);" class="selected">'+i+'</a> ');
 						}else{
 							_html.push(' <a href="javascript:filter.pageIndex='+i+';getlist();">'+i+'</a> ');
 						}
 					}
 					if(se[1] < pageNum){
 						_html.push(' ... <a href="javascript:filter.pageIndex='+pageNum+';getlist();">'+pageNum+'</a> ');
 					}
 					
 					if(filter.pageIndex < pageNum){
 						_html.push(' <a href="javascript:filter.pageIndex++;getlist();">></a> ');
 					}

 					$(".pages").html(_html.join(""));
 				}
 			}
 		});

 	}
 }

window.getlist = msg.msg_list_show;

 msg.init();