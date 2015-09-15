/**
 * @author  : ZY
 */

var toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	api    = require("api/api"),
	sidebar = require("./sidebar"),
	navBar = require("util/navbar");

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
			buf.push('<p><span class="p-ti">结息时间</span><span class="num2">'+K.getTime.getDateStr(Date.now()+90*24*60*60*1000)+'</span></p>');
			buf.push('<p><span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p><span class="p-ti">预期收益</span><span class="num2" id="expected_revenue">0.00元</span></p>');
			buf.push('<p class="ttn-btn"><a href="/users/login.html" class="light-btn">登录购买</a></p>');
			return buf.join("");
		},
		ydl:function(){
			var buf = [];
			buf.push('<p><span class="p-ti">剩余金额</span><span class="num">￥{{#remaMoney}}</span></p>');
			buf.push('<p><span class="p-ti">账户余额</span><span class="num ableBalanceAmount">￥{{#ableBalanceAmount}}</span><a href="/my/refund/recharge.html" class="recharge">[充值]</a></p>');
			buf.push('<p style="margin-bottom:5px;">');
			buf.push('<span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="sub-text" style="letter-spacing:-1px;">每人累计可购买50000元，您还可以购买50000元</p>');
			buf.push('<p class="sub-text"><input type="checkbox" checked="checked" class="check"><a class="protocol" href="javascript:void(0)">《活期宝投资协议》</a></p>');
			buf.push('<p><a class="light-btn purchase">购买</a></p>	');
			return buf.join("");	
		}
	},
	UI:function(){

		var entrance = $("#entrance"),
			self     = this;

		if(K.login()){
			// entrance.html(self.tpl.ydl());

			// api.call('/api/product/current/queryProductInfo',{},function(_rel){

			// 	api.call('/api/account/getUserAsset.do',{},function(_asset){
			// 		var parse_obj = _rel.result;
			// 		$.extend(parse_obj,_asset.result);
			// 		entrance.html(K.ParseTpl(self.tpl.ydl(),parse_obj));

			// 		self.event_handler_login();
			// 	});
				
			// });
		}else{

			var fid = 'bf5a23ea-3171-47a7-b726-e78a7c74f283';
			entrance.html(self.tpl.wdl()),
			self.event_handler_wdl();

		}
	},
	event_handler:function(){

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
			$("#expected_revenue").text((purchase_money*0.08*90/360).toFixed(2)+"元");
		});

	},
	event_handler_login:function(){

		//立即购买按钮
		$(".purchase").on("click",function(){
			
			var _this     = $(this),
				error_msg = $("#entrance").find(".error-msg"),
				purchase_money = $.trim($("#purchase_money").val()),
				ableBalanceAmount = $.trim($(".ableBalanceAmount").val()),
				checked = $("#entrance").find("input[type='checkbox']").is(":checked");

			if(!purchase_money){
				error_msg.text('请填写购买金额！');
				return false;
			}

			if(purchase_money > ableBalanceAmount){
				error_msg.text('余额不足，请充值！');
				return false;
			}

			if(!checked){
				error_msg.text('请勾选服务协议');
				return false;
			}

			error_msg.text("");
		});

		//投资协议
		$(".protocol").on("click",function(){
			var msg = '<p class="ti">活期宝投资协议<a href="#" class="quit"></a></p><div class="cont4"><p>为了保障您的自身权益、防范投资风险，请于注册或投资前仔细阅读并完全理解本协议的全部内容以及与本产品相关的全部产品规则，其中用粗字体予以标注的，是与您的权益有或可能具有重大关系，及对本公司具有或可能具有免责或限制责任的条款，请您充分知悉并了解小牛钱罐子产品的运作规则、投资范围以及协议双方的权利、义务和责任。您必须在不加修改地无条件完全接受本协议所包含的条款、条件和本平台已经发布的或将来可能发布的各类规则，并且遵守有关互联网或本平台的相关法律、规定与规则的前提下，才能进入用户注册程序。您只有成功注册成为本平台用户后，才能使用本平台提供的用户服务。根据《中华人民共和国合同法》，如您通过进入注册程序并点击相应确认按钮，即表示您与本平台已达成协议，自愿接受本协议。</p></div>';
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :msg
			});
		})
	},
	event_handler_wdl:function(){
		
	}
}

hqb.init();