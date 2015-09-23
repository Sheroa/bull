/**
 * @function : 联系我们页面js
 * @author  : ZY
 */

var $     		  = require('jquery');  
	navBar        = require("util/navbar"),
	artTemplate 	= require("artTemplate"),
	api     = require("api/api"),
 	sidebar_index = require("./sidebar"),


navBar.init(index);

window.filter = {
'pageIndex':1,
'pageSize':10
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

var insurance = {
	
	//初始化
	init:function(){
		this.sidebar();

		//新闻列表
		api.call('/api/news/queryNewsMedia',filter,function(data){
			var cache_data = artTemplate.compile(__inline("./media/list.tmpl"))(data);
			if(!cache_data){
				$("#list").html("<h4 class='notice'>暂无数据！</h4>");
			}else{
				$("#list").html(cache_data);
			}
			

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
	},

	//sidebar
	sidebar:function(){
		// debugger;
		$($(".left-tab").find("a").eq(sidebar_index)).addClass('selected');
	}
}

insurance.init();