/**
 * @function : 我要理财
 * @author :  ZY
 */


var api = require("api/api"),
	sidebar = require("util/sidebar"),
	toolbar = require('util/toolbar_pp'),
	artTemplate= require("artTemplate"),
	navBar = require("util/navbar");


require('util/extend_fn');
require('ui/dialog/dialog');

window.pro_type =  "current";
window.pro_state = "queryInvestRecords";
window.pro_stated = 2;
window.filter = {
	'pageIndex': 1,
	'pageSize': 10,
	'transType': ""
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
var invest = {
	init: function() {

		var self = this;

		toolbar.init();
		navBar.init(index);
		sidebar.init();
		self.UI();
		self.event_handler();

	},
	tpl: {
		redemption: function() {
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
	UI: function() {
		//api调用，获取用户财富模块
		api.call('/api/account/getUserAsset.do', {}, function(_rel) {
			var ableBalanceAmount = _rel.result.ableBalanceAmount, //账户余额
				currentProductAmount = _rel.result.currentProductAmount, //活期宝
				fixedProductAmount = _rel.result.fixedProductAmount, //固定投资
				floatProductAmount = _rel.result.floatProductAmount; //浮动投资

			var data = [{
				value: ableBalanceAmount / 10000,
				color: "#f27835",
				highlight: "#f27835",
				label: "账户余额"
			}, {
				value: currentProductAmount / 10000,
				color: "#f39c11",
				highlight: "#f39c11",
				label: "活期宝"
			}, {
				value: fixedProductAmount / 10000,
				color: "#58d68d",
				highlight: "#58d68d",
				label: "固定投资"
			}, {
				value: floatProductAmount / 10000,
				color: "#6699cc",
				highlight: "#6699cc",
				label: "浮动投资"
			}]
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

			var data = [{
				value: 100,
				color: "#f39c11",
				highlight: "#f39c11",
				label: "活期宝收益"
			}, {
				value: 50,
				color: "#58d68d",
				highlight: "#58d68d",
				label: "固定理财收益"
			}, {
				value: 50,
				color: "#6699cc",
				highlight: "#6699cc",
				label: "浮动理财收益"
			}]

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
		var invest_host = '/api/product/' + pro_type + '/' + pro_state+'.do';
		if (pro_type == "dayAdd") {
			$.extend(filter, {
				'state': pro_stated,
				'proType': 1
			});
		}
		api.call(invest_host, filter, function(data) {
			if (pro_type == 'current') {
				var cache_data = pro_state == 'queryInvestRecords' ? $.trim(artTemplate.compile(__inline("./invest/invest1.tmpl"))(data)) : $.trim(artTemplate.compile(__inline("./invest/invest2.tmpl"))(data));
			} else if (pro_type == 'dayAdd') {
				var cache_data = pro_stated == 2 ? $.trim(artTemplate.compile(__inline("./invest/invest2.tmpl"))(data)) : $.trim(artTemplate.compile(__inline("./invest/invest3.tmpl"))(data));
			}
			if (!cache_data) {
				$("#invest_list").html("<h4 class='notice'>暂无数据！</h4>");
			} else if (pro_type == 'hfb') {
				$("#invest_list").html("<h4 class='notice'>暂无数据！</h4>");
			} else {
				$("#invest_list").html(cache_data);
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

		//一级tab切换
		$('.navObj', '.tab').bind('click', function() {
			$('.selected', '.tab').removeClass('selected');
			$(this).addClass('selected');
			window.pro_type = $('.selected', '.tab').data('type');
			if (pro_type == 'hfb') {
				return
			} else {
				addSecondTab();
				self.invest_list_show();
			}
		});
		//二级tab切换
		function addSecondTab(){
			var navList = [];
			if (pro_type == "hfb"){
				navList.push('<em class="selected">募集中产品</em><em>持有中产品</em><em>已回款产品</em>');
			}else{
				if(pro_type == "current"){
					navList.push('<em class="selected" data-state="queryInvestRecords">持有中产品</em><em data-state="queryRedeemRecords">赎回记录</em>');
				}else{
					navList.push('<em class="selected" data-state="queryInvestRecords" data-stated="2">持有中产品</em><em data-state="queryInvestRecords" data-stated="3">已回款产品</em>');
				}
				$('.table-ti', '.myInput').html(navList.join(''));
				$('em', '.table-ti').bind('click', function() {
					$('.selected', '.table-ti').removeClass('selected');
					$(this).addClass('selected');
					window.pro_state = $('.selected', '.table-ti').data('state');
					if(pro_type == "dayAdd"){
					window.pro_stated = $('.selected', '.table-ti').data('stated');}
					self.invest_list_show();
				})
			}
		}

		//赎回
		$(".redemption").on("click", function() {
			$.Dialogs({
				"id": "diglog_wrapper",
				"overlay": true,
				"cls": "dialog-wrapper popbox-bankrank",
				"closebtn": ".quit,span.close",
				"auto": false,
				"msg": self.tpl.redemption(),
				"openfun": function() {

					//密码输入框
					$(".bank-pwd").each(function(index, el) {
						$(el).find("input").each(function(index, el) {
							var _this = $(el);
							_this.on("keyup", function(event) {
								var self = $(this);

								if (event.which == 8) {
									self.text("");
									self.prev().focus();
								} else {
									self.next().focus();
								}
							});
						});
					});
				}
			});
		});

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