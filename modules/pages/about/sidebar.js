/**
 * @function : 关于我们页面组-左侧导航栏js
 * @author  : ZY
 */

var $ = require('jquery'),
 	about_child_page = ['introduce','media','insurance','partner','contact'],
 	href = location.href,
 	PAGE_NOTATION = /\/([a-z]+)\./,
 	target_index = "";

//对href进行正则匹配-获取到item判断是第几个，从而给左侧列表增加selected class
if(PAGE_NOTATION.test(href.replace("http://",""))){
	target_index =  about_child_page.indexOf(RegExp.$1);
}

module.exports = target_index;