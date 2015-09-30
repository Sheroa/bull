/**
 * @function ： 展示绑定银行卡信息
 * @author  : ZY
 */


var K = require('util/Keeper');


var info = {
	show:function(data){
		var buf = [],
			obj = data.result;
		buf.push('<p class="bank-name">'+obj.bankName+'</p>');
		buf.push('<p class="card-kind">储蓄卡</p>');
		buf.push('<p class="card-num">'+K.bank_card_map(data.result.bankCardNo)+'</p>');
		buf.push('<img src="/static/img/bank/'+obj.bankCode+'2.png">');			
		return buf.join("");
	}
}

module.exports = info;