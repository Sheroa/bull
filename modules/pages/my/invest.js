/**
 * @function : 我要理财
 * @author :  ZY
 */


var api     = require("api/api"),
 	sidebar = require("util/sidebar"),
 	toolbar = require('util/toolbar_pp'),
  	navBar = require("util/navbar");


require('util/extend_fn');
require('ui/dialog/dialog');

var invest = {
	init:function(){

		var self = this;

		toolbar.init();
		navBar.init(index);
		sidebar.init();
		self.event_handler();

		var data = [
		    {
		        value: 100,
		        color:"#F7464A",
		        highlight: "#FF5A5E",
		        label: "Red"
		    },
		    {
		        value: 50,
		        color: "#46BFBD",
		        highlight: "#5AD3D1",
		        label: "Green"
		    },
		    {
		        value: 50,
		        color: "#FDB45C",
		        highlight: "#FFC870",
		        label: "Yellow"
		    }
		]

		var ctx = document.getElementById("myChart_finance").getContext("2d");
		var ctx_1 = document.getElementById("myChart_revenue").getContext("2d");
		new Chart(ctx).Pie(data);
		new Chart(ctx_1).Pie(data);
	},
	tpl:{
		redemption:function(){
			var buf = [];
			buf.push('<p class="ti">赎回操作<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">赎回金额</span><input type="text" placeholder="最高***元"></p>');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">交易密码</span><span class="bank-pwd"><input maxlength="1" type="password"><input maxlength="1" type="password"><input  maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span><a href="/users/find_pwd.html" class="forget-pwd">忘记密码</a></p>');
			buf.push('<p><a href="javascript:void(0);" class="light-btn">确定</a></p>');
			buf.push('</div>');
			return buf.join("");	
		}
	},
	UI:function(){

	},
	event_handler:function(){

		var self = this;

		//一级tab切换
		$(".tab-col").tabSwitch({
			navObj:'.navObj',
			className:'.cont',
			curSel:'selected',
			selectorIndex:'.navObj'
		});

		//二级tab切换
		$(".tab-col-second").each(function(index, el) {
			var _this = $(el);
			_this.tabSwitch({
				navObj:'.tab'+index+' em',
				className:'.sub-tab',
				curSel:'selected',
				selectorIndex:'.tab'+index+' em'
			});
		});

		//赎回
		$(".redemption").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.redemption(),
			    "openfun":function(){

			    	//密码输入框
			    	$(".bank-pwd").each(function(index, el) {
			    		$(el).find("input").each(function(index, el) {
			    			var _this = $(el);
			    			_this.on("keyup",function(event){
			    				var self = $(this);

			    				if(event.which == 8){
			    					self.text("");
			    					self.prev().focus();
			    				}else{
			    					self.next().focus();
			    				}
			    			});
			    		});	
			    	});
			    }
			});
		});

		//api调用，获取用户财富模块
		api.call('/api/account/getUserAsset.do',{},function(_rel){
			var currentProductAmount = _rel.result.currentProductAmount;
			if(!currentProductAmount){
				//显示赎回btn
				$(".redemption").show();
			}
		});
	}
}

  invest.init();