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
 	user_token = user_info.token;

 var msg = {
 	init:function(){
 		this.msg_list_show();
 		this.event_handler();
 	},
 	event_handler:function(){

 		$("#msg_list").on("click",".ti",function(){
 			var _this = $(this);
 			_this.next(".cont").toggle();
 		});
 	},
 	msg_list_show:function(){

 		$.extend(data_transport, {
 			"userId":user_id,
 			"token":user_token,
 			"pageIndex":1,
 			"pageSize":10
 		});

 		$.ajax({
 			url: '/api/msg/querSystemMessage.do',
 			type: 'post',
 			data: data_transport,
 			success:function(_rel){
 				var cache_data = artTemplate.compile(__inline("./system_msg/msg_list.tmpl"))(_rel);
 				$("#msg_list").html(cache_data);
 			}
 		});

 	}
 }

 msg.init();