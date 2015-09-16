/**
 * @author  : ZY
 */

var toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	api    = require("api/api"),
	sidebar = require("./sidebar"),
	navBar = require("util/navbar"),
	ttn_type = parseInt(location.href.replace(/[^?#]*\//,"").split(".")[0],10);

require('util/extend_fn');
require('ui/dialog/dialog');


var hqb = {
	init:function(){

		var self = this;
		//头部信息
		navBar.init(index);
		toolbar.init();
		sidebar.init();
		self.UI();
		self.event_handler();
	},
	tpl:{
		wdl:function(){
			var buf=[];
			console.log();
			buf.push('<p><span class="p-ti">计息时间</span><span class="num2">'+K.getTime.getDateStr(Date.now()+24*60*60*1000)+'</span></p>');
			buf.push('<p><span class="p-ti">结息时间</span><span class="num2">'+K.getTime.getDateStr(Date.now()+ttn_type*24*60*60*1000)+'</span></p>');
			buf.push('<p><span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p><span class="p-ti">预期收益</span><span class="num2" id="expected_revenue">0.00元</span></p>');
			buf.push('<p class="ttn-btn"><a href="/users/login.html" class="light-btn">登录购买</a></p>');
			return buf.join("");
		},
		ydl:function(){
			var buf = [];
			buf.push('<p><span class="p-ti">账户余额</span><span class="num">￥{{#ableBalanceAmount}}</span><a href="/my/refund/recharge.html" class="recharge">[充值]</a></p>');
			buf.push('<p style="margin-bottom:5px;"><span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p><span class="p-ti">使用红包</span><select name="redbag-select" class="redbag-select" id=""><option data-code="0">未选择（2个可用）</option></select><a href="javascript:void(0);" id="red_paper_detail" class="redDetail">详情</a></p>');
			buf.push('<p><span class="p-ti">预期收益</span><span class="num2" id="expected_revenue">0.00元</span></p>');
			buf.push('<p class="sub-text" style="padding-left:0"><input type="checkbox" class="check" checked="true"><a href="javascript:void(0);" id="revenue_transport">《收益权转让协议》</a><input type="checkbox" class="check" checked="true" style="margin-left:15px;"><a  href="javascript:void(0);" id="info_consult">《信息咨询与管理协议》</a></p>');
			buf.push('<p><a class="light-btn">购买</a></p>');
			return buf.join("");	
		},
		red_paper_detail:function(){
			// <p class="ti">红包详情<a href="#" class="quit"></a></p>
			// <div class="cont">
			// 	<div class="redbag">
			// 		<div class="num">
			// 			<p class="title">￥20</p>
			// 			<p>剩余20天</p>
			// 		</div>
			// 		<div class="text">
			// 			<span>
			// 				<p class="title">投资返现红包</p>
			// 				<p>单笔投资满1000元且投<br>资期限90天以上时可用</p>
			// 			</span>
			// 		</div>
			// 	</div>
			// 	<div class="redbag">
			// 		<div class="num">
			// 			<p class="title">￥20</p>
			// 			<p>剩余20天</p>
			// 		</div>
			// 		<div class="text">
			// 			<span>
			// 				<p class="title">投资返现红包</p>
			// 				<p>单笔投资满1000元且投<br>资期限90天以上时可用</p>
			// 			</span>
			// 		</div>
			// 	</div>
			// </div>
		},
		revenue_transport:function(){
			var buf = [];
			buf.push('<p class="ti">收益权转让协议<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont4">');
			buf.push('<p>甲方（受让人）：</p>');
			buf.push('<p>证件类型：身份证</p>');
			buf.push('<p>证件号：</p>');
			buf.push('<p>联系电话：</p>');
			buf.push('<p>乙方（出让人）：彭钢</p>');
			buf.push('<p>身份证号码：430511197005153531</p>');
			buf.push('<p>鉴于：</p>');
			buf.push('<p>1、乙方作为深圳市小牛稳盈三号投资企业(有限合伙)（下称“合伙企业”）的有限合伙人，基于 《深圳市小牛稳盈三号投资企业(有限合伙)合伙协议书》,完成了相对应的合伙企业出资份额的认购。</p>');
			buf.push('</div>');
			return buf.join("");
		},
		info_consult:function(){
			var buf=[];
			buf.push('<p class="ti">信用咨询与管理服务协议<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont4">');
			buf.push('<p>甲方（受让人）：</p>');
			buf.push('<p>证件类型：身份证</p>');
			buf.push('<p>证件号：</p>');
			buf.push('<p>联系电话：</p>');
			buf.push('<p>乙方：小牛新财富管理有限公司</p>');
			buf.push('<p>地址：深圳市福田区彩田路2009号瀚森大厦17楼</p>');
			buf.push('<p>注册号：4403011107262598</p>');
			buf.push('<p>根据《中华人民共和国合同法》及相关法律法规的规定，双方遵循平等、自愿、互利和诚实信用原则，友好协商，就乙方为甲方提供信用咨询与管理服务达成一致，以兹信守。</p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	UI:function(){

		var entrance = $("#entrance"),
			self     = this;

		if(K.login()){
			

			// api.call('/api/product/current/queryProductInfo',{},function(_rel){

			// 	api.call('/api/account/getUserAsset.do',{},function(_asset){
			// 		var parse_obj = _rel.result;
			// 		$.extend(parse_obj,_asset.result);
			// 		entrance.html(K.ParseTpl(self.tpl.ydl(),parse_obj));

			// 		self.event_handler_login();
			// 	});
				
			// });
		
			api.call('/api/account/getUserAsset.do',{},function(_asset){
				var parse_obj = _asset.result;

				entrance.html(K.ParseTpl(self.tpl.ydl(),K.inverse_to_money(parse_obj)));
				self.event_handler_login();
			});

		}else{

			var fid = 'bf5a23ea-3171-47a7-b726-e78a7c74f283';
			entrance.html(self.tpl.wdl()),
			self.event_handler_wdl();

		}
	},
	event_handler:function(){

		var flow = {
			'90':0.08,
			'180':0.09,
			'360':0.10
		};
		//活期宝下面的tab切换
		$(".tab-col").tabSwitch({
			navObj:'.navObj',
			className:'.cont',
			curSel:'selected',
			selectorIndex:'.navObj'
		});

		//购买金额-计算收益
		$("#entrance").on("keydown","#purchase_money",function(){
			var _this = $(this),
				purchase_money = $.trim(_this.val());
			
			$("#expected_revenue").text((purchase_money*flow[ttn_type]*ttn_type/360).toFixed(2)+"元");
		});

	},
	event_handler_login:function(){

		var self = this;

		$("#red_paper_detail").on("click",function(){
			alert("fuck");
			// $.Dialogs({
			//     "id" : "diglog_wrapper",
			//     "overlay" : true,
			//     "cls" : "dialog-wrapper popbox-bankrank",
			//     "closebtn" : ".quit,span.close",
			//     "auto" : false,
			//     "msg" :msg
			// });
		});

		$("#revenue_transport").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.revenue_transport()
			});
		});

		$("#info_consult").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.info_consult()
			});
		})

	},
	event_handler_wdl:function(){
		
	}
}

hqb.init();