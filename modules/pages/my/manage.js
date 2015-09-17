/**
 * @function:系统信息页面js
 * @author:ZY
 */

var api     = require("api/api"),
	sidebar = require("util/sidebar"),
	K       = require('util/Keeper'),
	toolbar = require('util/toolbar_pp'),
	navBar = require("util/navbar");





var manage = {
	init:function(){
		toolbar.init();
		navBar.init(index);
		sidebar.init();
		this.event_handler();
	},
	tpl:{
		identify_step1:function(){
			var buf = [];
			buf.push('<p>填写身份证银行信息：</p>');
			buf.push('<p><span class="p-ti">真实姓名</span><input id="true_name" type="text" value="{{#memberName}}"></p>');
			buf.push('<p><span class="p-ti">身份证号码</span><input id="id_number" type="text" value="{{#certNo}}"></p>');
			buf.push('<p><span class="p-ti">选择银行</span><select name="bank-select" id="bank-select"><option data-code="0">请选择银行</option></select></p>');
			buf.push('<p class="no-margin"><span class="p-ti">银行卡号</span><input type="text" placeholder="请输入您本人的借记卡号"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p class="btn-line2"><a href="javascript:void(0);" class="gray-btn cancel_btn">取消</a><a href="javascript:void(0);" class="light-btn confirm_btn">确认</a></p>');
			return buf.join("");
		}
	},
	event_handler:function(){

		var self = this;

		//手机认证
		var user_info = JSON.parse($.cookie("ppinf")).loginName;
		$("div[data-type='phoneIdentity']").find(".cont").text(K.phone_num_map(user_info));

		//判断用户是否实名认证
		var verifyIdentity = $("div[data-type='verifyIdentity']"),
			identify_content = verifyIdentity.find(".sub-msg"),
			identify_btn = verifyIdentity.find(".main-msg"),
			identify_title = identify_btn.find(".cont");

		api.call('/api/user/getUserInfo.do',{},function(_rel){
			var certNo = _rel.result.certNo,
				user_info = _rel.result;
			// user_info.memberName = K.name_map(user_info.memberName);
			// user_info.certNo = K.bank_card_map(user_info.certNo);
			identify_content.html("");
			if(certNo){ //数据库中含有身份证号-无论是否验证
				//进一步判断是否认证
				api.call('/api/user/verifyIdentityState.do',{},function(_rel){
					var result = _rel.result;
					if(!result){ //未进行实名认证
						identify_title.addClass('cont2').html('成功充值任意金额方可认证身份证信息（<em>已填写</em>）');
						identify_btn.find("a").remove();
						identify_btn.append('<a href="javascript:void(0);" class="light-btn"><em id = "modify">修改</em></a>');
						identify_btn.append('<a href="/my/refund/recharge.html" class="light-btn">充值</a>');

						identify_content.html(K.ParseTpl(self.tpl.identify_step1(),user_info));
						
					}else{ //已进行实名认证
						identify_title.addClass('cont2').text('陈*（430***********6011）身份证不允许修改、更换或注销');
						identify_btn.find("a").remove();
						identify_content.remove();
					}
				})
			}else{ //没有完成身份信息
				identify_content.html(self.tpl.identify_step1);
			}
		});

		$(document).on("click","#modify",function(){
			var _this = $(this),
				animate_obj = _this.parents(".each").find(".sub-msg");
			if(_this.hasClass('selected')){
				_this.removeClass('selected');
				animate_obj.slideUp();
			}else{
				_this.addClass('selected');
				animate_obj.slideDown();
			}

			//确认btn
			var confirm_btn = animate_obj.find(".confirm_btn");
			confirm_btn.on("click",function(){
				//姓名
				//身份证号
				var true_name = $('#true_name'),
					id_number = $('#id_number');

				//校验真实姓名
				if(!(true_name && true_name.val() != '') || !K.isChinese(true_name.val())){
					true_name.parent().next().text('请输入身份证上的姓名');
					return false;
				}
				true_name.parent().next().text('');
				//校验身份证号码
				if(!(id_number && id_number.val() != '')){
					id_number.parent().next().text('请输入正确的身份证号码');
					return false;
				}
				if(id_number.val().length != 18){
					id_number.parent().next().text('身份证格式有误请重新输入');
					return false;
				}
				id_number.parent().next().text('');

				api.call('/api/user/verifyIdentityInfo.do',{
					'name':$.trim(true_name.val()),
					'idCardNo':$.trim(id_number.val())
				},function(_rel){
					console.log("成功");
				})
				
			})

			//取消btn
			var cancel_btn = animate_obj.find(".cancel_btn");
			cancel_btn.on("click",function(){
				_this.removeClass('selected');
				animate_obj.slideUp();
			})
		})
	}
}

manage.init();