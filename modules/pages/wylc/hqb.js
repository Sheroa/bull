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
			buf.push('<input type="number" id="purchase_money" placeholder="100元起购"></p>');
			buf.push('<p><a href="/users/login.html?return_to=/wylc/hqb.html" class="light-btn">登录购买</a></p>');
			return buf.join("");
		},
		ydl:function(){
			var buf = [];
			buf.push('<p><span class="p-ti">剩余金额</span><span class="num">￥{{#remaMoney}}</span></p>');
			buf.push('<p><span class="p-ti">账户余额</span><span class="num ableBalanceAmount">￥{{#ableBalanceAmount}}</span><a href="javascript:void(0)" class="recharge recharge_btn">[充值]</a></p>');
			buf.push('<p style="margin-bottom:5px;">');
			buf.push('<span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="sub-text" style="letter-spacing:-1px;">每人累计可购买50000元，您还可以购买<i style="font-style:normal">{{#fbuyBalance}}</i>元</p>');
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
						if(typeof parse_obj[i] == "number" && parse_obj[i] >= 10000){
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

				var parse_obj = _rel.result;
				for(var i in parse_obj){
					if(typeof parse_obj[i] == "number" && parse_obj[i] >= 10000000){
						if(i == "fbuyBalance"){
							parse_obj[i] = (parse_obj[i]/10000).toFixed(0);
						}else{
							parse_obj[i] = (parse_obj[i]/10000).toFixed(2);	
						}
						
					}
				}

				var result_str = K.ParseTpl(self.tpl.wdl(),parse_obj),
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

		//购买金额
		
	},
	event_handler_login:function(){

		var self = this;

		//立即购买按钮
		$(".purchase").on("click",function(){
			
			var _this     = $(this),
				error_msg = $("#entrance").find(".error-msg"),
				max_money = parseFloat(error_msg.next().find("i").text()),
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

			if(parseFloat(purchase_money)>max_money ||  parseFloat(purchase_money) > 50000){
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
			    				var self = $(this),
			    					code = event.which;

			    				if(code == 8){
			    					self.text("");
			    					self.prev().focus();
			    				}else{
			    					//48-50 
			    					if(!((code>=48 && code<=57)||(code>=96 && code<=105))){
			    						self.val("");
			    						return false;
			    					}
			    					if(self.val()){
			    						self.next().focus();
			    					}
			    					
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
			    			self.UI();
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
			var msg=[];
			msg.push('<p class="ti">活期宝投资协议<a href="#" class="quit"></a></p>');
			msg.push('<div class="cont4">');
			msg.push('<p>为了保障您的自身权益、防范投资风险，请于注册或投资前仔细阅读并完全理解本协议的全部内容以及与本产品相关的全部产品规则，其中用粗字体予以标注的，是与您的权益有或可能具有重大关系，及对本公司具有或可能具有免责或限制责任的条款，请您充分知悉并了解小牛钱罐子产品的运作规则、投资范围以及协议双方的权利、义务和责任。您必须在不加修改地无条件完全接受本协议所包含的条款、条件和本平台已经发布的或将来可能发布的各类规则，并且遵守有关互联网或本平台的相关法律、规定与规则的前提下，才能进入用户注册程序。您只有成功注册成为本平台用户后，才能使用本平台提供的用户服务。根据《中华人民共和国合同法》，如您通过进入注册程序并点击相应确认按钮，即表示您与本平台已达成协议，自愿接受本协议及其相关附件所有的条款；此后，您不得以未阅读本服务条款内容作任何形式的抗辩，也不得以未签署书面协议为由否认本协议的效力。一旦加入本投资计划即视为对本协议全部条款及相关业务规则已充分理解并完全接受。 请注意：本协议约定仅限于您与甲方因本协议及相关附属协议或规则所产生的法律关系及法律纠纷，不涉及您与本平台的其他用户之间因网上交易而产生的法律关系及法律纠纷。</p>');
			msg.push('<p>甲方：深圳市小牛投资咨询有限公司</p>');
			msg.push('<p>注：甲方拥有“小牛钱罐子”的经营权</p>');
			msg.push('<p>注册号：440301112229634</p>');
			msg.push('<p>注册号：440301112229634</p>');
			msg.push('<p>住所：深圳市前海深港合作区前湾一路1号A栋201室（入驻深圳市前海商务秘书有限公司）</p>');
			msg.push('<p>乙方（姓名）：<em class="name"></em></p>');
			msg.push('<p>小牛钱罐子注册手机号：<em class="register_phone"></em></p>');
			msg.push('<p>身份证号码：<em class="identify_num"></em></p>');
			msg.push('<p>在甲方已经充分在本协议内容中作出以下风险提示，乙方已经充分了解并清楚知晓本产品有关风险的前提下，双方就乙方委托甲方将其资金进行分散出借以及申购、赎回货币基金等（以下简称“本投资计划”）相关事项，协商一致，达成如下协议： </p>');
			msg.push('<p>风险提示如下：</p>');
			msg.push('<p>1. 投资风险：乙方加入本投资计划后，可通过分散投资方式降低单一借款项目所带来的投资风险，但本投资计划不同于银行储蓄，乙方既可能分享投资所产生的收益，也可能承担投资所带来的损失。乙方应判断本投资计划与其自身风险承受能力、其资产管理需求是否相匹配后，自行决定是否加入本投资计划。</p>');
			msg.push('<p>2. 市场风险：甲方承诺将基于诚实信用、勤勉尽责的原则协助乙方将资金出借给借款客户、购买货币基金，但本投资计划在运作过程中可能面临各种市场风险，甲方并不保证本投资计划一定会产生盈利，亦不保证最低收益。</p>');
			msg.push('<p>3. 政策风险：本投资计划依据现行相关法律法规和政策设计，如相关法律法规、政策等发生变化，可能影响本投资计划的正常进行，甚至终止本投资计划。</p>');
			msg.push('<p>4. 信息传递风险：本投资计划存续期内，甲方可根据本协议约定对本协议及相关规则进行调整，甚至终止本投资计划。届时，甲方将在小牛钱罐子（包括但不限于官网公告、站内信、手机平台等方式）进行公布。乙方应根据本协议所载的公告方式及时查询相关信息，如因乙方未及时查询，或通讯故障、系统故障以及其他不可抗力等因素的影响使得乙方未能及时了解到相关调整，由此产生的责任和风险由乙方自行承担。</p>');
			msg.push('<p>5. 不可抗力风险：由于自然灾害、战争、社会动乱、罢工、非因甲方原因引起的本网站及相关第三方的设备、系统出现故障或缺陷、病毒、黑客攻击、网络故障、网络中断等不可抗力因素的出现，将严重影响本投资计划的正常运行。</p>');
			msg.push('<p>名词解释：</p>');
			msg.push('<p>在本协议中，除非本协议上下文另有解释，下列词语具有以下含义：</p>');
			msg.push('<p>1 小牛钱罐子：指为甲、乙双方进行本协议投资交易提供居间服务的APP平台。</p>');
			msg.push('<p>2 小牛钱罐子帐户：指乙方以自身名义在小牛钱罐子注册后系统自动产生的虚拟账户，可以通过第三方支付机构或其他通道进行充值或提现。</p>');
			msg.push('<p>3 出借人（乙方）：指成功注册为小牛钱罐子帐户的会员，可参考甲方的推荐自主选择出借一定金额的资金给借款客户或参与投资交易，且具有完全民事权利和民事行为能力的自然人。</p>');
			msg.push('<p>4 合作机构：指与甲方建立合作关系的机构，包括但不限于第三方支付机构、基金管理公司、小额贷款公司、融资性担保公司等。</p>');
			msg.push('<p>5 担保：指合作机构为出借人的借款提供的全额本息保障方式，包括但不限于保证、抵押、质押等方式，或承诺进行代偿、债权回购、债权收购或发放后备贷款等方式。</p>');
			msg.push('<p>6 《小牛钱罐子货币基金服务协议》：指本投资计划中包含的货币基金产品所适用的协议。</p>');
			msg.push('<p>7 计息资金：指乙方在本协议项下的出借给借款客户的资金以及购买货币基金的资金之和中已开始计算收益的资金，但不包括已确认赎回的资金。</p>');
			msg.push('<p>8 加入资金：指出借人加入到本投资计划的资金，具体包括出借给借款客户的资金及出借人委托甲方购买货币基金的资金。</p>');
			msg.push('<h5>一、主要内容</h5>');
			msg.push('<p>1.1 本平台专注为有理财需求的投资人（以下简称“投资人”）和有资金需求的融资人（以下简称“借款人”）搭建一个安全、透明、便捷的投融资网络交易平台，为注册用户提供投资咨询、财务规划、投资管理等咨询服务，以及借款人推荐、贷后信用管理等服务。在注册和使用本平台服务期间，您应提供您自身的真实、最新、有效及完整的信息资料并保证自您注册之时起至您使用本平台服务的所有期间，其所提交的所有资料和信息（包括但不限于电子邮件地址、联系电话、联系地址、邮政编码、个人身份信息）有效性及安全性。</p>');
			msg.push('<p>1.2 活期宝：指甲方根据乙方的委托，对与甲方合作的合作机构推荐的产品（包括但不限于借款项目、货币基金等）进行分散筛选、协助乙方将加入资金出借给借款客户或申购货币基金、自动转让或赎回货币基金的投资计划。出借人的加入资金及加入资金所产生的收益，在满足本协议相关规则的前提下，可在申购满7日后的任意时刻申请部分或全部赎回。</p>');
			msg.push('<p>1.3 投资范围：本投资计划的投资范围包含货币型基金及经与甲方合作的合作机构推荐的全额本息担保的借款项目。</p>');
			msg.push('<p>1.4 预期收益：乙方知悉、了解并同意，小牛钱罐子宣传页面显示的与本投资计划相关的收益均为预期收益，甲方未以任何方式对加入资金的本金及预期收益进行承诺或担保，乙方的加入资金存在因各种原因不能够全额收回的风险（见风险提示部分）；同时，在实际收益未达到预期收益的情况下，乙方仅能收取其当笔加入资金所对应的实际收益。</p>');
			msg.push('<p>1.5 收益结算：本协议项下的加入资金按自然月实际结算的收益。每自然月获得的收益以实际结算为准，收益将在乙方小牛钱罐子账户中显示。</p>');
			msg.push('<p>1.6 服务计划:乙方同意按照《小牛钱罐子活期宝投资协议》提供资金出借，并接受甲方的相关服务。乙方从其资金实际出借日算起满7日后，即可向甲方申请赎回，同时不可撤销地授权甲方为其寻找债权受让人及以乙方名义办理债权转让手续，乙方将把对应的债权全部或部分转让给甲方为其推荐到的债权受让人，转让价值为其申请转让时乙方欲转让债权的公允价值，由甲方协助债权受让人在债权成功转让后的3个工作日内，将转让价值一次性支付至乙方在甲方平台上的小牛钱罐子账户。</p>');
			msg.push('<p>1.7 加入资金来源保证：乙方保证其在本协议项下的加入资金来源合法，乙方为该加入资金的合法所有人。因第三方对加入资金归属、合法性问题提出异议产生纠纷，由乙方自行承担责任。</p>');
			msg.push('<p>1.8 乙方在本投资计划中的加入资金总额、变动情况、收益等以乙方小牛钱罐子账户记录为准。</p>');
			msg.push('<h5>二、本协议的成立及生效</h5>');
			msg.push('<p>2.1 本协议成立：乙方按照小牛钱罐子的规则，在购买相关产品前，通过在小牛钱罐子上勾选“我同意《小牛钱罐子活期宝投资协议》”以及点击“购买”按钮（具体以APP显示为准）确认后，即视为乙方与甲方已达成协议并同意接受本协议的所有约定内容以及小牛钱罐子平台上所包含的其他与本协议有关的各项规则或协议的规定（包括但不限于相关的《小牛钱罐子基金服务协议》及小牛钱罐子平台发布的与本产品相关的规则、信息等）。</p>');
			msg.push('<p>2.2 加入资金冻结：乙方点击“购买”按钮（具体以APP显示为准）确认后，即视为乙方已经向甲方发出不可撤销的授权指令，授权甲方委托相应的第三方支付机构及/或甲方开立监管账户的监管银行等合作机构，在乙方小牛钱罐子账户中，冻结等同于乙方当笔加入资金数额金额的资金。上述冻结将会在甲方为乙方进行当笔加入资金的划转时解除。</p>');
			msg.push('<p>2.3 资金划转：</p>');
			msg.push('<p>2.3.1 当笔加入资金全部冻结，且甲方系统完成当笔加入资金的货币基金申购及借款项目投标后，根据所投货币基金的《小牛钱罐子货币基金服务协议》、基金管理公司与甲方签订的合作协议的相关约定，与甲方合作的货币基金管理公司及特定项目的借款客户即不可撤销地授权甲方委托相应的第三方支付机构或监管银行等合作机构，将当笔加入资金由监管账户划转至货币基金管理公司及对应的借款客户指定的银行账户。</p>');
			msg.push('<p>2.3.2 甲方将在任意一笔加入资金全部冻结后的当日（包含周末及节假日）内完成该笔加入资金的统一划转。</p>');
			msg.push('<p>2.4 本协议生效：本协议于甲方完成乙方首次加入资金的划转之日立即生效，本协议生效后对甲、乙双方后续操作（包括但不限于再次加入资金、赎回资金等）具有约束力，无须反复签订协议。</p>');
			msg.push('<h5>三、投资及资产管理</h5>');
			msg.push('<p>3.1 乙方将全权委托甲方按照本协议的有关约定，完成对加入资金进行货币基金的申购以及出借；同时，乙方在此授权甲方在完成上述申购及出借后以乙方名义代为签署相应的《小牛钱罐子货币基金服务协议》（包括但不限于相关的《小牛钱罐子基金服务协议》、及小牛钱罐子平台发布的与本产品相关的规则、信息等）。</p>');
			msg.push('<p>3.2 投资及资产管理规则：</p>');
			msg.push('<p>3.2.1 乙方的加入资金按自然月计算收益，由乙方发出赎回指令时统一结算收益。</p>');
			msg.push('<p>3.2.2 为尽力达到小牛钱罐子宣传页面显示的预期年化收益率，在乙方加入本投资计划后、退出前，包括但不限于加入资金、赎回资金、收益复投及为调整乙方在本投资计划中全部加入资金投资于各类资产的比例而进行的资金投资分配时，乙方不可撤销地委托并授权甲方通过其系统按一定比例自动配置投资于各类资产的资金，包含但不限于对货币型基金的申购及赎回、对借款项目的购买及转让等操作。</p>');
			msg.push('<p>3.2.3若甲方按本协议约定为乙方投资的借款项目，在乙方加入项目后，其加入的借款项目出现逾期还款且相关合作机构未立即履行担保义务的情况下，则此借款项目将自动退出本投资计划，并以借款项目的形式显示在乙方小牛钱罐子账户中，乙方将按该借款项目的还款方式及剩余还款期限，获得相应的本金及利息回款。</p>');
			msg.push('<p>3.3 乙方加入本投资计划后，甲方将按照乙方加入本投资计划的时间先后顺序，协助乙方将加入资金出借给借款客户及购买货币基金。</p>');
			msg.push('<h5>四、收益及费用</h5>');
			msg.push('<p>4.1 预期收益：按本协议第1.4款约定计算。</p>');
			msg.push('<p>4.2 收益起算时间：申购当日即开始计算。</p>');
			msg.push('<p>4.3 费用种类：除本协议有明确规定外，甲方收取的具体费用类型及标准（包括但不限于赎回费用）以甲方在小牛钱罐子平台上或通过其他形式另行公布的相关规则为准。</p>');
			msg.push('<h5>五、赎回管理</h5>');
			msg.push('<p>5.1 赎回方式：乙方可选择部分或全部转让其在本投资计划中的借款项目及赎回货币基金（以下统称为“赎回”，但不包含已申请赎回的资金）。如需赎回，乙方需在小牛钱罐子平台上发出赎回申请指令，并等待甲方确认该赎回申请并作出相应的处理。</p>');
			msg.push('<p>5.2 发出赎回申请： 乙方可在加入资金的7个自然日后发出赎回申请，乙方发起赎回申请后则无法撤销该申请。</p>');
			msg.push('<p>5.3 在甲方确认乙方发出的赎回申请时，乙方全权授权委托甲方按照相关投资及管理规则，将乙方所持有的货币基金进行赎回或将未到期的借款项目代为债权转让，并将以乙方名义代为签署相应协议。</p>');
			msg.push('<p>5.4 甲方确保因赎回而转让的借款项目，具备较高的投资优先级。</p>');
			msg.push('<p>5.5 收益结算：申请赎回的资金收益结算精确到日，甲方确认乙方赎回申请的当天不计息。</p>');
			msg.push('<p>5.6 资金到账时间：乙方的赎回申请被甲方确认后，一般在确认后的3个工作日内完成赎回，赎回资金将显示在乙方小牛钱罐子账户中。</p>');
			msg.push('<p>5.7 赎回失败：甲方将按照合同约定确认并处理乙方的赎回申请，但不能保证乙方的赎回申请能够成功实现。乙方发起的赎回申请被甲方确认后的第3个工作日24：00（含24:00）时，若甲方仍未能按照约定将乙方当次拟赎回的资金所对应的全部项目进行赎回，则成功赎回的货币基金产品及成功转让的借款项目部分所对应的资金，将显示在乙方小牛钱罐子账户中；未成功转让的借款项目部分将自动退出本投资计划，并以借款项目的形式显示在乙方小牛钱罐子账户中，乙方将按该借款项目的还款方式及剩余还款期限，获得相应的本金及利息回款直至该借款项目完成全部还款。</p>');
			msg.push('<h5>六、本协议的修改及终止</h5>');
			msg.push('<p>6.1 甲、乙双方均确认，本协议的签订、生效和履行以不违反法律为前提。如果本协议中的任何一条或多条被有关政府部门认定为违反所须适用的法律、法规，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力。</p>');
			msg.push('<p>6.2 乙方同意甲方有权根据国家法律法规、监管政策、自律规定、市场变化等对本协议及与本协议相关的规则进行调整，甚至终止本投资计划。调整或修改后的协议内容及相关业务规则将在小牛钱罐子（包括但不限于手机平台、官网公告、站内信等方式）进行公布并立即生效，无需甲方另行通知乙方。如果乙方不接受该修改或调整，可选择立即以赎回本投资计划中全部加入资金的方式以终止本服务；如乙方继续使用本投资计划的即被视为接受修改或调整，并受修改或调整后的协议及相关业务规则的约束。</p>');
			msg.push('<p>6.3 乙方同意，在甲方终止本投资计划时，乙方持有的本投资计划项下的货币基金产品，将全部赎回至乙方小牛钱罐子账户余额；乙方持有的本投资计划项下的借款项目将以借款项目的形式显示在乙方小牛钱罐子账户中，乙方将按该借款项目的还款方式及剩余还款期限，获得相应的本金及/或利息回款直至该借款项目完成全部还款。</p>');
			msg.push('<p>6.4 本协议的任何修改、补充均须以小牛钱罐子电子文本形式更换新版本作出。</p>');
			msg.push('<h5>七、其他</h5>');
			msg.push('<p>7.1 本协议以电子文本形式在小牛钱罐子平台上自动生成。</p>');
			msg.push('<p>7.2 如双方在本协议履行过程中发生任何争议，应友好协商解决；如协商不成，则须提交华南国际经济贸易仲裁委员会进行仲裁。</p>');
			msg.push('<p>7.3 与本协议相关的其他具体操作规则以甲方小牛钱罐子APP平台展示为准，并作为本协议的附件，如具体规则与本协议存在矛盾之处，以具体规则为准。乙方同意本协议即视为同时同意本协议相关附件。</p>');
			msg.push('<h5>附件一：</h5>');
			msg.push('<h5 style="text-align:center;">小牛钱罐子货币基金服务协议</h5>');
			msg.push('<p>本《小牛钱罐子货币基金服务协议》（“本协议”）由以下双方签订：</p>');
			msg.push('<p>甲方：深圳市小牛投资咨询有限公司</p>');
			msg.push('<p>住所：深圳市前海深港合作区前湾一路1号A栋201室（入驻深圳市前海商务秘书有限公司）</p>');
			msg.push('<p>乙方（姓名）：<em class="name"></em></p>');
			msg.push('<p>小牛钱罐子注册手机号：<em class="register_phone"></em></p>');
			msg.push('<p>身份证号码：<em class="identify_num"></em></p>');
			msg.push('<p>根据我国《合同法》及其他相关法律、法规，甲、乙双方本着自愿、平等、互利的原则，就乙方委托甲方将乙方资金加入小牛钱罐子活期宝投资计划的部分资金投资于诺安基金管理有限公司（以下简称“诺安基金”）管理的货币基金类产品事宜，双方协商一致，达成以下协议：</p>');
			msg.push('<p>特别提示：在乙方接受本协议之前，请仔细阅读本协议的全部内容。一旦参与小牛钱罐子活期宝投资计划，接受小牛钱罐子提供的货币基金服务即视为对本协议全部条款及相关业务规则已充分理解并完全接受。乙方应在加入本活期宝投资计划之前自行判断是否使用本货币基金服务（以下简称为“本服务”），甲方将不对本服务下的收益作出任何保证和承诺，乙方应自行判断并承担风险。若乙方不同意本协议的全部或部分内容，请勿进行后续操作。</p>');
			msg.push('<h6>第一条 货币基金服务介绍</h6>');
			msg.push('<p>1、“货币基金服务”指甲方根据乙方的委托，为乙方办理诺安基金管理的货币基金类产品申购或赎回业务的服务。</p>');
			msg.push('<p>2、“活期宝”指甲方根据乙方的委托，对与甲方合作的合作机构推荐的产品（包括但不限于借款项目、货币基金等）进行分散筛选、协助乙方将加入资金出借给借款客户或申购货币基金、自动转让或赎回货币基金的投资计划。乙方加入资金及加入资金所产生的收益，在满足本协议相关规则的前提下，可在申购满7日后申请部分或全部赎回，可以更好的满足出借人对资金的灵活需求。</p>');
			msg.push('<p>3、《小牛钱罐子活期宝投资协议》指乙方同意加入活期宝投资计划时，通过小牛钱罐子平台与甲方在线签署的关于就乙方委托甲方将其资金进行分散出借以及申购、赎回货币基金等相关事项的协议。</p>');
			msg.push('<p>4、货币基金服务投资的产品为：诺安货币市场基金。</p>');
			msg.push('<p>5、收益：为乙方投资诺安货币市场基金所产生的收益。</p>');
			msg.push('<p>6、申购、赎回的处理时限：T日15点前发起申购，T+1日计息，T+2日显示收益；T日发起赎回，T日到达乙方小牛钱罐子的账户。</p>');
			msg.push('<p>7、T日：是指基金公司确认的提交有效申请的工作日。</p>');
			msg.push('<p>8、T＋n日：是指T日后第n个工作日（不包含T日）。</p>');
			msg.push('<p>9、工作日：是指上海证券交易所或深圳证券交易所的正常交易日。</p>');
			msg.push('<p>10、乙方勾选同意《小牛钱罐子活期宝投资协议》，并点击活期宝投资页面中所示的“购买”按钮后，即视为乙方签署本服务协议并同意开通本服务，亦表示乙方同意授权甲方进行本协议项下的相关操作，包括但不限于发起货币基金的申购或赎回操作，无需乙方对每次操作单独授权。</p>');
			msg.push('<p>11、甲方为尽力达到活期宝预期年化收益率，在乙方加入本服务后、退出前，包括但不限于加入资金、赎回资金、收益复投及为调整乙方在活期宝投资计划中全部加入资金投资于各类资产的比例而进行的资金投资分配时，乙方同意不可撤销地委托并授权甲方通过其小牛钱罐子平台系统按一定比例自动配置投资于各类资产的资金，包含但不限于对货币型基金的申购及赎回、对借款项目的购买及转让等操作。</p>');
			msg.push('<p>12、本服务所产生的收益按加入本服务的自然月计算，由乙方发出赎回指令时统一结算。</p>');
			msg.push('<p>13、乙方使用本服务所需支付给甲方的费用除甲方或基金公司有作出明确的规定外，无需另行向甲方支付任何服务费用。</p>');
			msg.push('<h6>第二条 乙方的权利及义务</h6>');
			msg.push('<p>1、乙方通过本服务将加入活期宝投资计划，其投资的资金在经过甲方系统按比例分配后将进行基金的申购及赎回。</p>');
			msg.push('<p>2、乙方开通本服务后，甲方按照本协议约定的相关规则，发起申购或赎回本协议所述的基金产品的操作，无需乙方另行操作。</p>');
			msg.push('<p>3、乙方应保证提交给甲方的本人信息真实、完整、准确，不得有任何虚假，并应在相关信息变更时负责对信息及时更新。</p>');
			msg.push('<p>4、乙方同意，甲方可以根据市场流动性等情况对本服务规则进行临时变更和调整，甚至终止本服务的提供。变更时甲方将通过其手机平台、站内信、官网公告等方式通知乙方，通过上述方式通知即视为甲方履行了告知义务。</p>');
			msg.push('<p>5、乙方保证不为任何非法目的或以任何非法方式使用本协议约定的服务，并承诺遵守中华人民共和国相关法律法规和相关的互联网国际惯例。否则，甲方有权终止提供本服务或撤销乙方账户。</p>');
			msg.push('<p>6、乙方应妥善保管自己的身份及账户信息，所有使用乙方身份及账户信息所发出的一切指令均视为乙方本人所为，乙方应对此产生的后果负责。 </p>');
			msg.push('<h6>第三条 甲方的权利与义务</h6>');
			msg.push('<p>1、甲方应严格遵照协议约定的内容，及时为乙方进行申购或赎回本协议所述基金类产品，确保乙方享受货币基金服务的及时性。</p>');
			msg.push('<p>2、在本协议下，甲方仅为乙方提供申购或赎回基金类产品的服务，甲方为乙方提供本服务并不代表甲方对本产品的收益作出任何明示或暗示的担保，或对此承担任何连带责任，甲方也无法保证乙方通过本服务购买基金一定会盈利或不亏本，乙方应自行承担该协议下的投资风险。</p>');
			msg.push('<p>3、甲方应对乙方提供的相关身份资料及在交易中产生的交易记录保密，但有权查询的法定机构根据法律法规规定要求提供，或为完成交易指令的需要向第三方提供的情形除外。</p>');
			msg.push('<p>4、如甲方发现乙方提供的相关资料或交易行为中存在虚假陈述、误导性陈述或重大遗漏等问题，或可能会导致不良后果的，有权向乙方询问，要求乙方进一步提供必要的信息或直接对该交易、乙方及相关的交易作出相应的处理。</p>');
			msg.push('<h6>第四条 协议的变更及终止</h6>');
			msg.push('<p>1、甲方享有修改本协议内容的权利，但不得损害乙方的合法权益。</p>');
			msg.push('<p>2、本协议签署后，若有关法律、法规、监管部门规章、及其他甲方和乙方应共同遵守的文件发生修订，本协议与之违背的内容及条款将自行失效，但本协议其他内容和条款继续有效。</p>');
			msg.push('<p>3、下述任一情形发生时，本协议将终止：</p>');
			msg.push('<p>1) 乙方自行撤销账户的；</p>');
			msg.push('<p>2) 甲方按照本协议及相关规则撤销乙方账户的；</p>');
			msg.push('<p>3) 因不可抗力使本协议无法继续履行的；</p>');
			msg.push('<p>4) 其他根据本协议约定或法律法规之规定，终止本服务的。</p>');
			msg.push('<h6>第五条 不可抗力</h6>');
			msg.push('<p>不可抗力定义：指在本协议签署后发生的、本协议签署时不能预见的、其发生与后果无法避免或克服的、妨碍任何一方全部或部分履约的所有事件。上述事件包括地震、台风、水灾、火灾、战争、国际或国内运输中断、政府或公共机构的行为（包括重大法律变更或政策调整）、流行病、民乱、罢工，以及一般国际商业惯例认作不可抗力的其他事件。</p>');
			msg.push('<p>因发生不可抗力事件导致业务无法进行的，本协议当事人可以免责，但应及时通知本协议其他当事人并积极采取措施予以解决。</p>');
			msg.push('<h6>第六条 免责声明</h6>');
			msg.push('<p>1)甲方制定且预先通知的系统停机维护期间；</p>');
			msg.push('<p>2)因出现不可抗力情形，造成甲方系统障碍不能正常执行业务；</p>');
			msg.push('<p>3)因包括但不限于银行端、基金公司端或甲方端的电信机线设备原因导致的发生错误、迟延、中断或不能传递；</p>');
			msg.push('<p>4)因电信部门技术调整政府管制造成的暂时性关闭等各种因素影响网络正常经营，造成网络出现异常的；</p>');
			msg.push('<p>5)因乙方自身主观过错或过失造成的，包括但不限于乙方的小牛钱罐子账户或密码被他人冒用、盗用、或其他非法使用之情形，除非可证明甲方对损失的形成存在故意或重大过失，否则甲方将不承担任何责任；</p>');
			msg.push('<p>6)其他无法预见、无法避免、无法克服的第三方原因。</p>');
			msg.push('<h6>第七条 违约责任</h6>');
			msg.push('<p>本协议任何一方违反本协议规定的内容，给对方造成损害的，应当承担违约责任，赔偿对方因此而造成的损失，包括但不限于财产损失、名誉损失等。</p>');
			msg.push('<h6>第八条 法律适用与争议解决</h6>');
			msg.push('<p>1、本协议的成立、生效、履行和解释，均适用中华人民共和国法律；如法律无明文规定的，应适用甲方相关的业务规定和通行的行业惯例。</p>');
			msg.push('<p>2、本协议履行过程中发生争议的，可由当事人协商解决。如果当事人不愿协商解决或协商不成的，任何一方均应将争议提交华南国际经济贸易仲裁委员会进行仲裁。</p>');
			msg.push('<h6>第九条 其他</h6>');
			msg.push('<p>在不违反法律法规的前提下，甲方对本协议拥有修改权和最终解释权。</p>');
			msg.push('<p>与本协议相关的其他具体操作规则以甲方小牛钱罐子APP平台上的展示为准，并作为本协议的附件，如具体规则与本协议不一致的，以具体规则为准。乙方同意本协议即视为同意本协议相关附件。</p>');
			msg.push('</div>');
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :msg.join(""),
			    "openfun":function(){
			    	api.call('/api/user/getIdentityInfoByUser.do',{

			    	},function(_rel){
			    		var result  = _rel.result,
			    			userName = result.userName || "",
			    			userMobile = result.userMobile || "",
			    			identityCard = result.identityCard || "";
			    		$(".popbox-bankrank .name").text(userName);
			    		$(".popbox-bankrank .register_phone").text(userMobile);
			    		$(".popbox-bankrank .identify_num").text(identityCard);
			    	});
			    }
			});
		});

		$("#purchase_money").on("blur",function(){
			var _this = $(this),
				purchase_money = _this.val(),
				error_msg = _this.parents("#entrance").find(".error-msg"),
				max_money = error_msg.next().find("i").text();
			if(purchase_money < 100){
				error_msg.text("购买金额100元起！");
				return false;
			}else if(purchase_money>max_money ||  purchase_money > 50000){
				error_msg.text("填写金额超过个人限额！");
				return false;
			}

			error_msg.text("");
		});
	}
}

hqb.init();