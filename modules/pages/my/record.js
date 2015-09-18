/**
 * @function:系统信息页面js
 * @author:ZY
 */

var api     = require("api/api"),
	sidebar = require("util/sidebar"),
	K       = require('util/Keeper'),
	toolbar = require('util/toolbar_pp'),
	navBar = require("util/navbar");

window.filter = {
 		'pageIndex':1,
 		'pageSize':10,
 		'transType':0
 	};

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

var record = {
	init:function(){
		toolbar.init();
		navBar.init(index);
		sidebar.init();
		this.event_handler();
		this.record_list_show();
	},
	event_handler:function(){

		//头部信息ajax获取
		api.call('/api/account/getUserTreasure.do',{

		},function(_rel){
			var result = _rel.result;
			$("#toInvestAmount").text("￥"+(result.toInvestAmount/10000).toFixed(2));
			$("#withdrawBlockedAmount").text("￥"+(result.withdrawBlockedAmount/10000).toFixed(2));
		});

	},
	record_list_show:function(){

		var self = this;

		api.call('/api/account/queryUserBalanceLogByPage.do',filter,function(data){
			// var cache_data = artTemplate.compile(__inline("./system_msg/msg_list.tmpl"))(data);
			// if(!cache_data){
			// 	$("#msg_list").html("<h4 class='notice'>暂无消息！</h4>");
			// }else{
			// 	$("#msg_list").html(cache_data);
			// }
			

			var pageSize = data.pageSize,
				totalRecord = data.totalCount,
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
		});
	}
}

window.getlist = record.record_list_show;
record.init();