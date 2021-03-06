/**
 * @function:封装ajax函数
 * @author : ZY
 */

var $         = require("jquery"),
	K         = require("util/Keeper"),
	versions  = require("util/versions");


var api = {
	call: function (requestUrl, data, callback,fail_callback) {
		$.ajax({
			url: requestUrl	,
			type: 'post',
			data: this.addVersion(data),
			success:function(_rel){
				if(_rel.code == 0){
					callback(_rel.data);
				}else if(_rel.code == 999){
					//跳转到登陆页面 
					var options = {path:'/'};
					$.cookie("ppinf","",options);
					if(location.href.indexOf('my') > 0){
						K.gotohref("/users/login.html?return_to="+location.href.replace(/^.*?\/\/.*?\//,"/"));
					}
				}else{
					fail_callback && fail_callback(_rel);
				}
			}
		});

	}
};


/*
    *获取版本号
    *@param {data} data 初始化参数集
*/
api.getVersion = function () {
	return "1.0.1";
};


/*
    *添加版本号， 公共函数
    *@param {data} data 初始化参数集        
*/
api.addVersion = function (data) {

	var user_info =  JSON.parse($.cookie('ppinf') || null),
		user_id = user_info && user_info.userId,
		user_token = user_info && user_info.token;

	if(!user_info){
		return $.extend({
			"source": versions.getSource(),
			"appVersion": this.getVersion()
		},data);
	}else{
		return $.extend({
			"userId":user_id,
			"token":user_token,
			"source": versions.getSource(),
			"appVersion": this.getVersion()
		},data);
	}

};	

module.exports = api;

