/**
 * @function : 全局注入-工具类方法
 * @author : ZY
 */

var $ = require('jquery'),
	passport = require('util/passport');

require("cookie");

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
				if(!splitStr){
					var str = Y + "年" + M + "月" + D + "日";
				}else{
					var str = Y + rs + M + rs + D + HHMMSS;
				}
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
	},
	isChinese:function(str){
		var CHINESE_VALID = /[\u4e00-\u9fa5]+/g;
		return CHINESE_VALID.test(str);
	},
	bank_card_check:function(bankno){
		if (bankno.length < 16 || bankno.length > 19) {
			//$("#banknoInfo").html("银行卡号长度必须在16到19之间");
			return false;
		}
		var num = /^\d*$/;  //全数字
		if (!num.exec(bankno)) {
			//$("#banknoInfo").html("银行卡号必须全为数字");
			return false;
		}
		//开头6位
		var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
		if (strBin.indexOf(bankno.substring(0, 2))== -1) {
			//$("#banknoInfo").html("银行卡号开头6位不符合规范");
			return false;
		}
	    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
	 
	    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
	    var newArr=new Array();
	    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
	        newArr.push(first15Num.substr(i,1));
	    }
	    var arrJiShu=new Array();  //奇数位*2的积 <9
	    var arrJiShu2=new Array(); //奇数位*2的积 >9
	     
	    var arrOuShu=new Array();  //偶数位数组
	    for(var j=0;j<newArr.length;j++){
	        if((j+1)%2==1){//奇数位
	            if(parseInt(newArr[j])*2<9)
	            arrJiShu.push(parseInt(newArr[j])*2);
	            else
	            arrJiShu2.push(parseInt(newArr[j])*2);
	        }
	        else //偶数位
	        arrOuShu.push(newArr[j]);
	    }
	     
	    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
	    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
	    for(var h=0;h<arrJiShu2.length;h++){
	        jishu_child1.push(parseInt(arrJiShu2[h])%10);
	        jishu_child2.push(parseInt(arrJiShu2[h])/10);
	    }        
	     
	    var sumJiShu=0; //奇数位*2 < 9 的数组之和
	    var sumOuShu=0; //偶数位数组之和
	    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
	    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
	    var sumTotal=0;
	    for(var m=0;m<arrJiShu.length;m++){
	        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
	    }
	     
	    for(var n=0;n<arrOuShu.length;n++){
	        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
	    }
	     
	    for(var p=0;p<jishu_child1.length;p++){
	        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
	        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
	    }      
	    //计算总和
	    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
	     
	    //计算Luhm值
	    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
	    var luhm= 10-k;
	     
	    if(lastNum==luhm){
	    	return true;
	    }
	    else{
		    return false;
	    }        
	},
	is_phone:function(phoneNum){
		var PHONE_VALID = /^0?1[3|4|5|8][0-9]\d{8}$/;
		return PHONE_VALID.test(phoneNum);
	},
	pwd_valid_check:function(pwd){
		var PWD_VALID = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/;
		return PWD_VALID.test(pwd);
	},
	phone_num_map:function(phoneNum){
		return phoneNum.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
	},
	name_map:function(name){
		var len = name.length,
			tmp = [];
		for(var i=0;i<len-1;i++){
			tmp.push("*");
		}
		return tmp.join("")+name[len-1];
	},
	bank_card_map:function(num){
		var len = num.length,
			tmp = [];
		for(var i=0;i<len-4;i++){
			tmp.push("*");
		}
		return tmp.join("")+num.slice(len-4);
	},
	/**
	 * 取参数
	 * @param {Object} u
	 * @param {Object} o
	 */
	getParm: function(u, o) {
		var params, locallink = window.location.toString(),
			url = u ? u : locallink;

		if ($.type(url) == "object") {
			params = $.param(url);
			locallink = o ? o : locallink;
			if (locallink.indexOf("?") == -1) {
				locallink += "?";
			} else {
				locallink += "&";
			}
			return locallink += params;
		} else if ($.type(url) == "string") {
			var arr = url.split("?"),
				parms = arr[1],
				params = {};
			if (parms && parms.indexOf("&")) {
				var parmList = parms.split("&");
				jQuery.each(parmList, function(key, val) {
					if (val && val.indexOf("=")) {
						var parmarr = val.split("=");
						if ($.type(o) == "string" && o == parmarr[0]) {
							params = parmarr[1] == null ? '' : parmarr[1];
							return true;
						} else {
							params[parmarr[0]] = parmarr[1];
						}
					}
				});
			}
		}
		return params;
	},
	login:function(){
	    var r;
	    if( !$.cookie("ppinf") ){
	        r = false;
	    }else{
	        r = JSON.parse($.cookie("ppinf"));
	    }
	    return r;
	},
	/**
	 * 自动跳转
	 */
	gotohref: function(url, target) {
	    window.href = url;
	    $('body').append($("<a>").attr("href", url).bind("click", function() {
	        window.location = $(this).attr("href");
	        return;
	    }).trigger("click"));
	},
	/**
	 * 获取cookie
	 */
	get_user_info:function(key){
		return passport.getUserInfoItem(key);
	},
	inverse_to_money:function(parse_obj){
		for(var i in parse_obj){
			console.log();
			if(typeof parse_obj[i] == "number" && parse_obj[i] >= 10000000){
				parse_obj[i] = (parse_obj[i]/10000).toFixed(2);
			}
		}
		return parse_obj;
	}
});

module.exports = Keeper;