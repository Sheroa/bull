/**
 * @function:头部js
 * @author : ZY
 */

var $ = require('jquery'),
	K = require('util/Keeper');

var toolbar={
	init:function(){
		if(K.login()){
			//修改导航栏
		}else{
			//跳转到登陆页面
			K.gotohref("/users/login.html?return_to="+location.href.replace(/^.*?\/\/.*?\//,"/"));	
		}
	}
}

module.exports = toolbar;