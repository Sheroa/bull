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
		self.UI();
		self.event_handler();

	},
	tpl:{
		redemption:function(){
			var buf = [];
			buf.push('<p class="ti">赎回操作<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">赎回金额</span><input type="text" placeholder="最高***元"></p>');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">交易密码</span><span class="bank-pwd"><input maxlength="1" type="password"><input maxlength="1" type="password"><input  maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span><a href="/users/find_pwd.html" class="forget-pwd">忘记密码</a></p>');
			buf.push('<p class="error-msg">错误信息</p>');
			buf.push('<p style="margin-top:5px;"><a href="javascript:void(0);" class="light-btn">确定</a></p>');
			buf.push('</div>');
			return buf.join("");	
		}
	},
	UI:function(){
		//api调用，获取用户财富模块
		api.call('/api/account/getUserAsset.do',{},function(_rel){
			var ableBalanceAmount = _rel.result.ableBalanceAmount, //账户余额
				currentProductAmount = _rel.result.currentProductAmount, //活期宝
				fixedProductAmount = _rel.result.fixedProductAmount, //固定投资
				floatProductAmount = _rel.result.floatProductAmount; //浮动投资

			var data = [
			    {
			        value: 100,
			        color:"#f27835",
			        highlight: "#f27835",
			        label: "账户余额"
			    },
			    {
			        value: 100,
			        color: "#f39c11",
			        highlight: "#f39c11",
			        label: "活期宝"
			    },
			    {
			        value: 50,
			        color: "#58d68d",
			        highlight: "#58d68d",
			        label: "固定投资"
			    },
			    {
			        value: 50,
			        color: "#6699cc",
			        highlight: "#6699cc",
			        label: "浮动投资"
			    }
			]
			var ctx = document.getElementById("myChart_finance").getContext("2d");
			new Chart(ctx).Pie(data);
			$("#ableBalanceAmount").text('￥'+(ableBalanceAmount/10000).toFixed(2));	
			//数据
			var buf = [];
			buf.push('<p><em class="bar1"></em><i>账户余额：</i><strong>￥'+(ableBalanceAmount/10000).toFixed(2)+'</strong></p>');
			buf.push('<p><em class="bar2"></em><i>活期宝：</i><strong>￥'+(currentProductAmount/10000).toFixed(2)+'</strong></p>');
			buf.push('<p><em class="bar3"></em><i>固定收益：</i><strong>￥'+(fixedProductAmount/10000).toFixed(2)+'</strong></p>');
			buf.push('<p><em class="bar4"></em><i>浮动收益：</i><strong>￥'+(floatProductAmount/10000).toFixed(2)+'</strong></p>');

			$("#finance").html(buf.join(""));
												
		});

		api.call('/api/product/getProductProfit.do',{},function(_rel){
			var totalProfitAmount = _rel.result.totalProfitAmount,  // 累计总收益
				currentProfitAmount = _rel.result.currentProfitAmount,  // 活期宝收益
				fixedProfitAmount = _rel.result.fixedProfitAmount,  // 固定理财收益
				floatProfitAmount = _rel.result.floatProfitAmount;  // 浮动理财收益

				var data = [
				    {
				        value: 100,
				        color: "#f39c11",
				        highlight: "#f39c11",
				        label: "活期宝收益"
				    },
				    {
				        value: 50,
				        color: "#58d68d",
				        highlight: "#58d68d",
				        label: "固定理财收益"
				    },
				    {
				        value: 50,
				        color: "#6699cc",
				        highlight: "#6699cc",
				        label: "浮动理财收益"
				    }
				]

				var ctx = document.getElementById("myChart_revenue").getContext("2d");
				new Chart(ctx).Pie(data);
				$("#totalProfitAmount").text('￥'+(totalProfitAmount/10000).toFixed(2));				
				//数据
				var buf = [];
				buf.push('<p><em class="bar2"></em><i>活期宝：</i><strong>￥'+(currentProfitAmount/10000).toFixed(2)+'</strong></p>');
				buf.push('<p><em class="bar3"></em><i>固定收益：</i><strong>￥'+(fixedProfitAmount/10000).toFixed(2)+'</strong></p>');
				buf.push('<p><em class="bar4"></em><i>浮动收益：</i><strong>￥'+(floatProfitAmount/10000).toFixed(2)+'</strong></p>');
				$("#revenue").html(buf.join(""));


		});
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