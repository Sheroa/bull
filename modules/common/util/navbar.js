/**
 * @function:设置头部选中状态
 * @author : ZY 
 */

var $ = require('jquery');

function setMenuCurClass(curIndex){
	$("#nav").children('a').removeClass('selected').eq(curIndex).addClass("selected")
}

module.exports.setMenuCurClass = setMenuCurClass;