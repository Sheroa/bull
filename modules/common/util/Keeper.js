/**
 * @function : 全局注入-工具类方法
 * @author : ZY
 */

var $ = require('jquery');

if(!Keeper){
	var Keeper = {

	}
}

Keeper.version = '1.0.12';

$.extend(Keeper,{
	/**
	 * 标志替换
	 * @param {Object} str
	 * @param {Object} data
	 */
	ParseTpl: function(str, data) {
		var result;
		var patt = new RegExp("\{{\#([a-zA-z0-9]+)\}}");
		while ((result = patt.exec(str)) != null) {
			var v = data[result[1]] === 0 ? "0" : data[result[1]] || '';
			str = str.replace(new RegExp(result[0], "g"), v);
		};
		return str;
	},
	getTime: {
			now: function() {
				return (new Date()).getTime();
			},
			getDateStr: function(time, splitStr) {
				var hms = function(n) {
					if ($.type(n) !== 'number') return;
					if (n == 3) {
						return " " + h + ":" + m + ":" + s;
					}
					if (n == 4) {
						return " " + hh + ":" + mm;
					}
					if (n == 6) {
						return " " + hh + ":" + mm + ":" + ss;
					}
					return "";
				}
				if (!splitStr) {
					if (time < 10) {
						splitStr = time;
						time = new Date();
					}
				}

				var time = time || new Date();
				var rs = '-',
					HHMMSS = '',
					t = new Date(time);
				t.setTime(time);
				var Y = t.getFullYear(),
					YY = Y + "".substring(2, 4),
					M = t.getMonth() + 1,
					D = t.getDate(),
					h = t.getHours(),
					m = t.getMinutes(),
					s = t.getSeconds();
				var MM = M < 10 ? '0' + M : M,
					DD = D < 10 ? '0' + D : D,
					hh = h < 10 ? '0' + h : h,
					mm = m < 10 ? '0' + m : m,
					ss = s < 10 ? '0' + s : s;
				var data = {
					"Y": Y,
					"YY": YY,
					"M": M,
					"MM": MM,
					"D": D,
					"DD": DD,
					"h": h,
					"hh": hh,
					"m": m,
					"mm": mm,
					"s": s,
					"ss": ss
				};
				switch ($.type(splitStr)) {
					case 'string':
						rs = splitStr;
						break;
					case 'number':
						HHMMSS = hms(splitStr)
						break;
					case 'object':
						if (splitStr.tpl) {
							str = $.ParseTpl ? $.ParseTpl(splitStr.tpl, data) : data;
							return str;
							break;
						}
						rs = splitStr.rs ? splitStr.rs : rs;
						HHMMSS = hms(splitStr.HHMMSS ? splitStr.HHMMSS : HHMMSS);
						break;
				}
				var str = Y + rs + M + rs + D + HHMMSS;
				return str;
			},
			friendly: function(time) {
				//设置只支持秒数～
				if ($.type(time) != "number") return '';
				var tip = '',
					second = 1000,
					minute = second * 60,
					hour = minute * 60,
					now_time = +new Date,
					now = new Date(),
					now_year = now.getFullYear(),
					now_month = now.getMonth(),
					now_date = now.getDate(),
					now_midnight = new Date(now_year, now_month, now_date),
					midnight_time = now_midnight.getTime(),
					diff = now_time - time;
				// 处理时间格式
				if (diff < 0) {
					tip = '';
				} else if (diff <= minute * 5) {
					tip = '刚刚';
				} else if (diff < hour) {
					var m = Math.floor(diff / minute);
					tip = m + '分钟前';
				} else if (diff < now_time - midnight_time) {
					var t = new Date(time),
						hh = t.getHours(),
						mm = t.getMinutes();
					if (hh < 10) {
						hh = '0' + hh;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					tip = '今日 ' + hh + ':' + mm;
				} else {
					var t = new Date(time),
						YY = t.getFullYear(),
						MM = t.getMonth() + 1,
						DD = t.getDate(),
						hh = t.getHours(),
						mm = t.getMinutes();
					if (MM < 10) {
						MM = '0' + MM;
					}
					if (DD < 10) {
						DD = '0' + DD;
					}
					if (hh < 10) {
						hh = '0' + hh;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					tip = YY + '年' + MM + '月' + DD + '日 ' + hh + ':' + mm;
				}
				return tip;
			},
			countDown: function() {
				if (parseInt(arguments[0]) > 0) {
					var t = this,
						type = false;
					times = Math.floor((arguments[0] - (arguments[1] || (new Date()).getTime())) / 1000);
					if (times < 0) {
						type = true;
						times = times < 0 ? -times : times;
					}
					return {
						t: type,
						s: times % 60,
						ss: times % 60 < 10 ? "0" + times % 60 : times % 60,
						m: Math.floor(times / 60) % 60,
						mm: Math.floor(times / 60) % 60 < 10 ? "0" + Math.floor(times / 60) % 60 : Math.floor(times / 60) % 60,
						h: Math.floor(times / 3600) % 24,
						hh: Math.floor(times / 3600) % 24 < 10 ? "0" + Math.floor(times / 3600) % 24 : Math.floor(times / 3600) % 24,
						D: Math.floor(times / 86400),
						DD: Math.floor(times / 86400) < 10 ? "0" + Math.floor(times / 86400) : Math.floor(times / 86400)
					}
				} else {
					return {};
				}
			},
			countTimer: new Array()
	}
});

module.exports = Keeper;