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

var product_id = "";

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
			buf.push('<p><span class="p-ti">剩余金额</span><span class="num">￥{{#remaMoney}}</span></p>');
			buf.push('<p><span class="p-ti">购买金额</span>');
			buf.push('<input type="text" placeholder="100元起购"></p>');
			buf.push('<p><a href="/users/login.html?return_to=/wylc/hqb.html" class="light-btn">登录购买</a></p>');
			return buf.join("");
		},
		ydl:function(){
			var buf = [];
			buf.push('<p><span class="p-ti">剩余金额</span><span class="num">￥{{#remaMoney}}</span></p>');
			buf.push('<p><span class="p-ti">账户余额</span><span class="num ableBalanceAmount">￥{{#ableBalanceAmount}}</span><a href="/my/refund/recharge.html" class="recharge">[充值]</a></p>');
			buf.push('<p style="margin-bottom:5px;">');
			buf.push('<span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="sub-text" style="letter-spacing:-1px;">每人累计可购买50000元，您还可以购买{{#fbuyBalance}}元</p>');
			buf.push('<p class="sub-text"><input type="checkbox" checked="checked" class="check"><a class="protocol" href="javascript:void(0)">《活期宝投资协议》</a></p>');
			buf.push('<p><a class="light-btn purchase">购买</a></p>	');
			return buf.join("");	
		},
		pay_pwd:function(){
			var buf = [];
			buf.push('<p class="ti">请输入交易密码<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p>请输入交易密码：</p>');
			buf.push('<p><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span><a href="/my/account/manage.html" class="forget-pwd">忘记密码</a></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p><a href="javascript:void(0);" class="light-btn confirm_purchase">确定</a></p>');
			buf.push('</div>');
			return buf.join("");
		},
		success:function(){
			var buf = [];
			buf.push('<p class="ti">购买成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">尊敬的用户，您已成功购买活期宝{{#money}}元，<br>可进入<a href="/my/invest.html">个人中心-我的投资</a>栏目查看详情。<br>多谢您的支持，祝您投资愉快！</p>');
			buf.push('<p><a href="/my/invest.html" class="light-btn">查看详情</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	UI:function(){

		var entrance = $("#entrance"),
			self     = this;

		if(K.login()){
			// entrance.html(self.tpl.ydl());

			api.call('/api/product/current/queryProductInfo',{},function(_rel){

				product_id = _rel.result.productId;

				api.call('/api/account/getUserAsset.do',{},function(_asset){
					var parse_obj = _rel.result;
					$.extend(parse_obj,_asset.result);
					for(var i in parse_obj){
						console.log();
						if(typeof parse_obj[i] == "number" && parse_obj[i] >= 10000000){
							if(i == "fbuyBalance"){
								parse_obj[i] = (parse_obj[i]/10000).toFixed(0);
							}else{
								parse_obj[i] = (parse_obj[i]/10000).toFixed(2);	
							}
							
						}
					}
					entrance.html(K.ParseTpl(self.tpl.ydl(),parse_obj));

					self.event_handler_login();
				});
				
			});
		}else{

			api.call('/api/product/current/queryProductInfo',{},function(_rel){

				var result_str = K.ParseTpl(self.tpl.wdl(),_rel.result),
					user_id = $.cookie("ppinf");
				
				entrance.html(result_str);
			});

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

	},
	event_handler_login:function(){

		var self = this;

		//立即购买按钮
		$(".purchase").on("click",function(){
			
			var _this     = $(this),
				error_msg = $("#entrance").find(".error-msg"),
				purchase_money = $.trim($("#purchase_money").val()),
				ableBalanceAmount = $.trim($(".ableBalanceAmount").text().replace('￥','')),
				checked = $("#entrance").find("input[type='checkbox']").is(":checked");

			if(!purchase_money){
				error_msg.text('请填写购买金额！');
				return false;
			}

			if(parseFloat(purchase_money) < 100){
				error_msg.text('购买金额100元起！');
				return false;
			}

			if(parseFloat(purchase_money) > 50000){
				error_msg.text('填写金额超过个人限额！');
				return false;
			}

			if(parseFloat(purchase_money) > parseFloat(ableBalanceAmount)){
				error_msg.text('余额不足，请充值！');
				return false;
			}

			if(!checked){
				error_msg.text('请勾选服务协议');
				return false;
			}

			error_msg.text("");

			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank outter",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.pay_pwd(),
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


			    	$(".confirm_purchase").on("click",function(){
			    		var _this = $(this),
			    			error_msg = _this.parents("#diglog_wrapper").find(".error-msg");

			    		var pwd_array = []
			    		$.each($(".bank-pwd").find("input"), function(index, val) {
			    			 pwd_array.push($(val).val());
			    		});
			    		
			    		if(pwd_array.join("").length < 6){
			    			error_msg.text("请输入交易密码");
			    			return false;
			    		}

			    		error_msg.text("");

			    		api.call('/api/product/current/buyProduct.do',{
			    			'investAmount':purchase_money*10000,
			    			'payPassword':pwd_array.join(""),
			    			'platform':'web',
			    			'sellChannel':'local',
			    			'productId':product_id	
			    		},function(_rel){
			    			$(".outter .quit").trigger("click");
			    			$.Dialogs({
			    			    "id" : "diglog_wrapper",
			    			    "overlay" : true,
			    			    "cls" : "dialog-wrapper popbox-bankrank",
			    			    "closebtn" : ".quit,span.close",
			    			    "auto" : false,
			    			    "msg" :K.ParseTpl(self.tpl.success(),{'money':purchase_money})
			    			});
			    		},function(_rel){
			    			error_msg.text(_rel.msg);
			    		});
			    	})
			    }
			});
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
	}
}

hqb.init();