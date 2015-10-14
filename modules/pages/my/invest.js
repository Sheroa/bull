/**
 * @function : 我要理财
 * @author :  ZY
 */


var api = require("api/api"),
	sidebar = require("util/sidebar"),
	toolbar = require('util/toolbar_pp'),
	artTemplate= require("artTemplate"),
	K       = require('util/Keeper'),
	navBar = require("util/navbar");


require('util/extend_fn');
require('ui/dialog/dialog');

window.pro_type =  "current";
window.pro_state = "queryInvestRecords";
window.pro_stated = 2;
window.filter = {
	'pageIndex': 1,
	'pageSize': 10
};
window.first_tab_index = 0;

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
var invest = {
	init: function() {

		var self = this;

		toolbar.init();
		navBar.init(index);
		sidebar.init();
		self.UI();
		self.event_handler();
		var url = K.getParm();
		//getlist();
		if(url.a){
			$(".tab").find("span").eq(url.a).trigger("click");
		}else{
			$(".tab").find("span").eq(0).trigger("click");
		}
		
	},
	tpl: {
		redemption: function() {
			var buf = [];
			buf.push('<p class="ti">赎回操作<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">可赎回余额</span><i id="redemption_money">{{#redemption_money}}元</i></p>');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">赎回金额</span><input type="number" id="redemption_money_input" placeholder="最低100元起"></p>');
			buf.push('<p style="padding-left:32px;"><span class="p-ti">交易密码</span><span class="bank-pwd"><input maxlength="1" type="password"><input maxlength="1" type="password"><input  maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"><input maxlength="1" type="password"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span><a href="/users/find_pwd.html" class="forget-pwd">忘记密码</a></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p style="margin-top:5px;"><a href="javascript:void(0);" class="light-btn confirm_btn">确定</a></p>');
			buf.push('<p style="padding-left:32px;color:#f27835;">温馨提示：</p>');
			buf.push('<p style="padding-left:32px;" class="sub-text">1，若赎回后剩余的可赎回余额低于100元，需将剩余余额一并赎回；</p>');
			buf.push('<p style="padding-left:32px;" class="sub-text">2，如果赎回后重新购买活期宝，新的投资收益将从5.5%开始计算；</p>');
			buf.push('<p style="padding-left:32px;" class="sub-text">3，输入赎回金额后，系统将自动匹配您的投资记录，优先赎回收益率相对较低的投资（即最近的投资）</p>');



			buf.push('</div>');
			return buf.join("");
		},
		success:function(){
			var buf = [];
			buf.push('<p class="ti">赎回成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">尊敬的用户，您已成功赎回活期宝{{#money}}元， <br>可进入<a href="/my/invest.html">我的投资-活期宝-已赎回</a>栏目查看详情。<br>多谢您的支持，祝您投资愉快！</p>');
			buf.push('<p><a href="/my/invest.html" class="light-btn">查看详情</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	UI: function() {
		//Pie.defaults.tooltipTemplate = "<%if (label){%><%=label%>: <%}%>"; 
		
		//api调用，获取用户财富模块
		api.call('/api/account/getUserAsset.do', {}, function(_rel) {
			var ableBalanceAmount = _rel.result.ableBalanceAmount, //账户余额
				currentProductAmount = _rel.result.currentProductAmount, //活期宝
				fixedProductAmount = _rel.result.fixedProductAmount, //固定投资
				floatProductAmount = _rel.result.floatProductAmount; //浮动投资

			if(ableBalanceAmount == 0 && currentProductAmount == 0 && fixedProductAmount == 0 && floatProductAmount == 0){
				Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%><%}%>";
				var data = [{
					value: 1,
					color: "#f27835",
					highlight: "#f27835",
					label: "无资产"
				}];
			}else{
				Chart.defaults.global.tooltipTemplate =  "<%if (label){%><%=label%>: <%}%><%= value %>";
				var data = [{
					value: (ableBalanceAmount / 10000).toFixed(2),
					color: "#f27835",
					highlight: "#f27835",
					label: "账户余额"
				}, {
					value: (currentProductAmount / 10000).toFixed(2),
					color: "#f39c11",
					highlight: "#f39c11",
					label: "活期宝"
				}, {
					value: (fixedProductAmount / 10000).toFixed(2),
					color: "#58d68d",
					highlight: "#58d68d",
					label: "固定投资"
				}, {
					value: (floatProductAmount / 10000).toFixed(2),
					color: "#6699cc",
					highlight: "#6699cc",
					label: "浮动投资"
				}];
			}

			var ctx = document.getElementById("myChart_finance").getContext("2d");
			new Chart(ctx).Pie(data);
			$("#totalAmount").text('￥' + (_rel.result.totalAmount / 10000).toFixed(2));
			//数据
			var buf = [];
			buf.push('<p><em class="bar1"></em><i>账户余额：</i><strong>￥' + (ableBalanceAmount / 10000).toFixed(2) + '</strong></p>');
			buf.push('<p><em class="bar2"></em><i>活期宝：</i><strong>￥' + (currentProductAmount / 10000).toFixed(2) + '</strong></p>');
			buf.push('<p><em class="bar3"></em><i>固定收益：</i><strong>￥' + (fixedProductAmount / 10000).toFixed(2) + '</strong></p>');
			buf.push('<p><em class="bar4"></em><i>浮动收益：</i><strong>￥' + (floatProductAmount / 10000).toFixed(2) + '</strong></p>');

			$("#finance").html(buf.join(""));

		});

		api.call('/api/product/getProductProfit.do', {}, function(_rel) {
			var totalProfitAmount = _rel.result.totalProfitAmount, // 累计总收益
				currentProfitAmount = _rel.result.currentProfitAmount, // 活期宝收益
				fixedProfitAmount = _rel.result.fixedProfitAmount, // 固定理财收益
				floatProfitAmount = _rel.result.floatProfitAmount; // 浮动理财收益

			if(totalProfitAmount == 0){
				Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%><%}%>";
				var data = [{
					value: 1,
					color: "#f39c11",
					highlight: "#f39c11",
					label: "无收益"
				}];
			}else{
				Chart.defaults.global.tooltipTemplate =  "<%if (label){%><%=label%>: <%}%><%= value %>";
				var data = [{
					value: (currentProfitAmount/10000).toFixed(2),
					color: "#f39c11",
					highlight: "#f39c11",
					label: "活期宝收益"
				}, {
					value: (fixedProfitAmount/10000).toFixed(2),
					color: "#58d68d",
					highlight: "#58d68d",
					label: "固定理财收益"
				}, {
					value: (floatProfitAmount/10000).toFixed(2),
					color: "#6699cc",
					highlight: "#6699cc",
					label: "浮动理财收益"
				}];		
			}

			var ctx = document.getElementById("myChart_revenue").getContext("2d");
			new Chart(ctx).Pie(data);
			$("#totalProfitAmount").text('￥' + (totalProfitAmount / 10000).toFixed(2));
			//数据
			var buf = [];
			buf.push('<p><em class="bar2"></em><i>活期宝：</i><strong>￥' + (currentProfitAmount / 10000).toFixed(2) + '</strong></p>');
			buf.push('<p><em class="bar3"></em><i>固定收益：</i><strong>￥' + (fixedProfitAmount / 10000).toFixed(2) + '</strong></p>');
			buf.push('<p><em class="bar4"></em><i>浮动收益：</i><strong>￥' + (floatProfitAmount / 10000).toFixed(2) + '</strong></p>');
			$("#revenue").html(buf.join(""));


		});
	},
	invest_list_show: function() {
		var self = this;
		var request_url_array = ['/api/product/current/queryInvestRecords.do',
									'/api/product/current/queryRedeemRecords.do'],
			request_url = "";
		// console.log(K.getParm());

		// K.getParm("a")
		if(first_tab_index == 0){
			$(".table-ti").eq(0).find("em").each(function(){
				var _this = $(this);
				if(_this.hasClass('selected')){
					request_url = request_url_array[_this.index()];
					return false;
				}
			});
		}else if(first_tab_index == 1){
			$(".table-ti").eq(1).find("em").each(function(){
				var _this = $(this);
				if(_this.hasClass('selected')){
					request_url = "/api/product/dayAdd/queryInvestRecords.do";
					var state_array = [2,3];
					$.extend(filter, {
						'state':state_array[_this.index()],
						'proType':1
					});
					
					return false;
				}
			});
		}else{
			$("#content").html("暂无数据");
			return false;
		}
		api.call(request_url, filter, function(data) {

			//list
			var list = data.list;
			if(list.length == 0){
				$("#content").html("暂无数据");
				return false;
			}

			if(first_tab_index == 0){
				//为活期宝列表
				var tmpl_index = request_url_array.indexOf(request_url); //0或1
				if(tmpl_index==0){
					var cache_data = $.trim(artTemplate.compile(__inline("./invest/invest1.tmpl"))(data));
				}else{
					var cache_data = $.trim(artTemplate.compile(__inline("./invest/invest2.tmpl"))(data));
				}
			}else if(first_tab_index == 1){
				//为天天牛列表
				var tmpl_index_ttn = [2,3].indexOf(filter.state); //0或1
				if(tmpl_index_ttn==0){
					var cache_data = $.trim(artTemplate.compile(__inline("./invest/invest3.tmpl"))(data));			
				}else{
					var cache_data = $.trim(artTemplate.compile(__inline("./invest/invest4.tmpl"))(data));
				}
			}
			$("#content").html(cache_data);
			if(first_tab_index==0  && tmpl_index == 0){
				//活期宝产品，持有中
				api.call('/api/product/current/assetQuery.do',{

				},function(_rel){
					var result = _rel.result,
						fMoneyAmount = result.fMoneyAmount,
						fProfitYesterday = result.fProfitYesterday,
						fProfit = result.fProfit;
					$('.hqb-msg').find("i").eq(0).text("￥"+(fMoneyAmount/10000).toFixed(2));
					$('.hqb-msg').find("i").eq(1).text("￥"+(fProfitYesterday/10000).toFixed(2));
					$('.hqb-msg').find("i").eq(2).text("￥"+(fProfit/10000).toFixed(2));
				});
			}
			var pageSize = data.pageSize,
			totalRecord = data.totalCount,
			pageNum = getPageNum(pageSize, totalRecord);

			if (pageNum > 1) { //页码大于1，才显示
				var _html = [];
				if (filter.pageIndex > 1) {
					_html.push('<a href="javascript:filter.pageIndex--;getlist();"><</a> ');
				}
				var se = pageUtil(filter.pageIndex, pageNum);
				if (se[0] > 1) {
					_html.push(' <a href="javascript:filter.pageIndex=1;getlist();">1</a> ...');
				}
				for (var i = se[0]; i <= se[1]; i++) {
					if (filter.pageIndex == i) {
						_html.push(' <a href="javascript:void(0);" class="selected">' + i + '</a> ');
					} else {
						_html.push(' <a href="javascript:filter.pageIndex=' + i + ';getlist();">' + i + '</a> ');
					}
				}
				if (se[1] < pageNum) {
					_html.push(' ... <a href="javascript:filter.pageIndex=' + pageNum + ';getlist();">' + pageNum + '</a> ');
				}

				if (filter.pageIndex < pageNum) {
					_html.push(' <a href="javascript:filter.pageIndex++;getlist();">></a> ');
				}

				$(".pages").html(_html.join(""));
			}
		});


	},
	event_handler: function() {

		var self = this;

		// //一级tab切换
		// $('.navObj', '.tab').bind('click', function() {
		// 	$('.selected', '.tab').removeClass('selected');
		// 	$(this).addClass('selected');
		// 	window.pro_type = $('.selected', '.tab').data('type');
		// 	addSecondTab();
		// 	self.invest_list_show();
		// });
		// //二级tab切换
		// function addSecondTab(){
		// 	var navList = [];
		// 	if (pro_type == "hfb"){
		// 		navList.push('<em class="selected">募集中产品</em><em>持有中产品</em><em>已回款产品</em>');
		// 	}else{
		// 		if(pro_type == "current"){
		// 			navList.push('<em class="selected" data-state="queryInvestRecords">持有中产品</em><em data-state="queryRedeemRecords">赎回记录</em>');
		// 		}else{
		// 			navList.push('<em class="selected" data-state="queryInvestRecords" data-stated="2">持有中产品</em><em data-state="queryInvestRecords" data-stated="3">已回款产品</em>');
		// 		}
		// 		$('.table-ti', '.myInput').html(navList.join(''));
		// 		$('em', '.table-ti').bind('click', function() {
		// 			$('.selected', '.table-ti').removeClass('selected');
		// 			$(this).addClass('selected');
		// 			window.pro_state = $('.selected', '.table-ti').data('state');
		// 			if(pro_type == "dayAdd"){
		// 			window.pro_stated = $('.selected', '.table-ti').data('stated');}
		// 			self.invest_list_show();
		// 		})
		// 	}
		// }

		//一级tab切换
		$(".tab-col").tabSwitch({
			navObj:'.navObj',
			className:'.cont',
			curSel:'selected',
			selectorIndex:'.navObj'
		},function(){
			var navObj_array = $(".navObj");
			navObj_array.each(function(index, el) {
				var _this = $(el); //确定一级切换index
				if(_this.hasClass('selected')){
					window.first_tab_index = _this.index(".navObj")
					$(".cont").eq(index).find("em").removeClass('selected');
					$(".cont").eq(index).find("em").eq(0).addClass('selected');
					//回复值
					filter.pageIndex = 1;
					getlist();
					return false;
				}
				
			});
		});

		$(".table-ti").each(function(index, el) {
			var _this = $(el);
			_this.find("em").on("click",function(){
				_this.find("em").removeClass('selected');
				$(this).addClass('selected');
				filter.pageIndex = 1;
				getlist();
			})			
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
		},function(){

		});

		$(document).on("click",".redemption",function(){
			var _this = $(this);
			$.Dialogs({
				"id": "diglog_wrapper",
				"overlay": true,
				"cls": "dialog-wrapper popbox-bankrank outter",
				"closebtn": ".quit,span.close",
				"auto": false,
				"msg": K.ParseTpl(self.tpl.redemption(),{"redemption_money":$(".hqb-msg").find("i").eq(0).text().replace('￥',"")}),
				"openfun": function() {

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

					$(".confirm_btn").on("click",function(){
						//校验
						var _this = $(this),
							animate_obj = _this.parents("div"),
							error_msg =  animate_obj.find(".error-msg"),
							redemption_money = $.trim($("#redemption_money_input").val());

						if(!redemption_money){
							error_msg.text("请填写赎回金额");
							return false;
						}

						var pwd_array = []
						$.each($(".bank-pwd").find("input"), function(index, val) {
							 pwd_array.push($(val).val());
						});
						
						if(pwd_array.join("").length < 6){
							error_msg.text("请输入交易密码");
							return false;
						}

						error_msg.text("");

						//调用赎回接口
						api.call('/api/product/current/applyRedeem.do',{
							'redeemAmount':redemption_money*10000,
							'payPassword':pwd_array.join(""),
							'productId':'123'
						},function(_rel){
							var result = _rel.result;
							if(result){
								$(".outter .quit").trigger("click");
								$.Dialogs({
									"id": "diglog_wrapper",
									"overlay": true,
									"cls": "dialog-wrapper popbox-bankrank",
									"closebtn": ".quit,span.close",
									"auto": false,
									"msg": K.ParseTpl(self.tpl.success(),{'money':redemption_money})
								});
							}
						},function(_rel){
							error_msg.text(_rel.msg);
						});
					});

					//赎回金额
					$("#redemption_money_input").on("blur",function(){
						var _this = $(this),
							redemption_money = _this.val(),
							compare_money = parseFloat($("#redemption_money").attr("placeholder").replace("元",""));
						if(redemption_money<100){
							_this.val(100);
						}else if(redemption_money>compare_money){
							_this.val(compare_money);
						}
					});
				}
			});
		})

		//api调用，获取用户财富模块
		api.call('/api/account/getUserAsset.do', {}, function(_rel) {
			var currentProductAmount = _rel.result.currentProductAmount;
			if (!currentProductAmount) {
				//显示赎回btn
				$(".redemption").show();
			}
		});
	}
}
window.getlist = invest.invest_list_show;
invest.init();