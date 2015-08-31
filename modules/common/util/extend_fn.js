/**
 * @function:扩展jq
 * @author : ZY
 */

var $ = require('jquery');

$.fn.extend({
	tabSwitch:function(options){
		var defaults = {
			navObj:"a",
			className:".tabContent",
			curSel:"click",
			eventName:"click",
			offset:"0",
			selectorIndex:""	
		};
		var opts = $.extend(defaults,options);
		var _thisObj = $(this);
		_thisObj.find(opts.navObj).on(opts.eventName,function(e){
			var _this = $(this);
			var index = _this.index(opts.selectorIndex);
			if(_this.attr("data-index")){
				index = parseInt(_this.attr("data-index")) || index;
			}
			_thisObj.find(opts.navObj).removeClass(opts.curSel);
			_this.addClass(opts.curSel);

			_thisObj.find(opts.className).removeClass('show');
			_thisObj.find(opts.className).eq(index+parseInt(opts.offset)).addClass('show');
		});
			
	}
});