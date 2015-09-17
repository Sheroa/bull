/**
 * @function:系统信息页面js
 * @author:ZY
 */

var api     = require("api/api"),
	sidebar = require("util/sidebar"),
	K       = require('util/Keeper'),
	toolbar = require('util/toolbar_pp'),
	navBar = require("util/navbar");





var discount = {
	init:function(){
		toolbar.init();
		navBar.init(index);
		sidebar.init();
		this.event_handler();
	},
	event_handler:function(){

		var self = this;

		$(".tab span").on("click",function(){
			var _this = $(this),
				status = _this.attr("data-status"),
				tab_cont = $(".tab-cont");
			tab_cont.slideUp();
			if(_this.hasClass('selected')){
				return false;
			}
			$(".tab span").removeClass('selected');
			_this.addClass('selected');
			api.call('/api/activity/findRedPacketList.do',{
				'status':status
			},function(_rel){
				var list = _rel.list;
				if(list.length <= 0){
					//没有数据，写入暂无红包
					tab_cont.html('<div class="red-bagNo"></div>');
					tab_cont.slideDown();
				}else{
					//有数据
					var className = "";
					if(status == "UNEXCHANGE"){
						className = "";
					}else if(status == "EXCHANGED"){
						className = "red-used";
					}else if(status == "OVERDUE"){
						className = "red-dated";
					}		
					var array = [];
					$.each(list, function(index, val) {
						var buf = [];
						buf.push('<div class="redbag '+className+'">');
						buf.push('<div class="num"><p class="title">￥'+(val.fMoney/10000).toFixed(2)+'</p><p>剩余'+K.getTime.countDown(new Date(val.fExpireDate).getTime()).D+'天</p></div>');
						buf.push('<div class="text"><span><p class="title">'+val.fName+'</p><p>'+val.fRemark+'</p></span></div></div>');
						array.push(buf.join(""));
					});
					tab_cont.html(array.join(""));
					tab_cont.slideDown();
				}
			});
		})

		//查询红包数
		//未使用
		api.call('/api/activity/getRedPacketCount.do',{
			'status':'UNEXCHANGE'
		},function(_rel){
			var num = _rel.result;
			$(".tab span").eq(0).find("i").text(num);
		});

		//已使用
		api.call('/api/activity/getRedPacketCount.do',{
			'status':'EXCHANGED'
		},function(_rel){
			var num = _rel.result;
			$(".tab span").eq(1).find("i").text(num);
		});

		//已过期
		api.call('/api/activity/getRedPacketCount.do',{
			'status':'OVERDUE'
		},function(_rel){
			var num = _rel.result;
			$(".tab span").eq(2).find("i").text(num);
		});

	}
}

discount.init();