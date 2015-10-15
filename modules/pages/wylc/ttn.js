/**
 * @author  : ZY
 */

var toolbar = require('util/toolbar_pp'),
	K = require('util/Keeper'),
	api    = require("api/api"),
	sidebar = require("./sidebar"),
	artTemplate 	= require("artTemplate"),
	navBar = require("util/navbar"),
	ttn_type = parseInt(location.href.replace(/[^?#]*\//,"").split(".")[0],10);

require('util/extend_fn');
require('ui/dialog/dialog');


var hqb = {
	init:function(){

		var self = this;
		//头部信息
		navBar.init(index);
		toolbar.init();
		sidebar.init();
		self.UI();
		self.event_handler();
	},
	tpl:{
		wdl:function(){
			var buf=[];
			console.log();
			buf.push('<p><span class="p-ti">计息时间</span><span class="num2">'+K.getTime.getDateStr(Date.now()+24*60*60*1000)+'</span></p>');
			buf.push('<p><span class="p-ti">结息时间</span><span class="num2">'+K.getTime.getDateStr(Date.now()+ttn_type*24*60*60*1000)+'</span></p>');
			buf.push('<p><span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p><span class="p-ti">预期收益</span><span class="num2" id="expected_revenue">0.00元</span></p>');
			buf.push('<p class="ttn-btn"><a href="/users/login.html" class="light-btn">登录购买</a></p>');
			return buf.join("");
		},
		ydl:function(){
			var buf = [];
			buf.push('<p><span class="p-ti">账户余额</span><span class="num ableBalanceAmount">￥{{#ableBalanceAmount}}</span><a href="javascript:void(0)" class="recharge recharge_btn">[充值]</a></p>');
			buf.push('<p style="margin-bottom:5px;"><span class="p-ti">购买金额</span><input id="purchase_money" type="number" placeholder="100元起购"></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p><span class="p-ti">使用红包</span><select name="redbag-select" class="redbag-select" id="redbag-select"></select><a href="javascript:void(0);" id="red_paper_detail" class="redDetail">详情</a></p>');
			buf.push('<p><span class="p-ti">预期收益</span><span class="num2" id="expected_revenue">0.00元</span></p>');
			buf.push('<p class="sub-text" style="padding-left:0"><input type="checkbox" class="check" checked="true"><a href="javascript:void(0);" id="revenue_transport">《收益权转让协议》</a><input type="checkbox" class="check" checked="true" style="margin-left:15px;"><a  href="javascript:void(0);" id="info_consult">《信息咨询与管理协议》</a></p>');
			buf.push('<p><a class="light-btn purchase">购买</a></p>');
			return buf.join("");	
		},
		red_paper_detail:function(){
			// <p class="ti">红包详情<a href="#" class="quit"></a></p>
			// <div class="cont">
			// 	<div class="redbag">
			// 		<div class="num">
			// 			<p class="title">￥20</p>
			// 			<p>剩余20天</p>
			// 		</div>
			// 		<div class="text">
			// 			<span>
			// 				<p class="title">投资返现红包</p>
			// 				<p>单笔投资满1000元且投<br>资期限90天以上时可用</p>
			// 			</span>
			// 		</div>
			// 	</div>
			// 	<div class="redbag">
			// 		<div class="num">
			// 			<p class="title">￥20</p>
			// 			<p>剩余20天</p>
			// 		</div>
			// 		<div class="text">
			// 			<span>
			// 				<p class="title">投资返现红包</p>
			// 				<p>单笔投资满1000元且投<br>资期限90天以上时可用</p>
			// 			</span>
			// 		</div>
			// 	</div>
			// </div>
		},
		revenue_transport:function(){
			var buf = [];
			buf.push('<p class="ti">收益权转让协议<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont4">');
			buf.push('<p class="userName">甲方（受让人）：<em></em></p>');
			buf.push('<p>证件类型：身份证</p>');
			buf.push('<p class="identityCard">证件号：<em></em></p>');
			buf.push('<p class="userMobile">联系电话：<em></em></p>');
			buf.push('<p>乙方（出让人）：彭钢</p>');
			buf.push('<p>身份证号码：430511197005153531</p>');
			buf.push('<p>鉴于：</p>');
			buf.push('<p>1、乙方作为深圳市小牛稳盈三号投资企业(有限合伙)（下称“合伙企业”）的有限合伙人，基于 《深圳市小牛稳盈三号投资企业(有限合伙)合伙协议书》,完成了相对应的合伙企业出资份额的认购。</p>');
			buf.push('<p>2、甲方（或其指定的第三方主体）自愿以本协议约定的条件受让乙方对合伙企业实缴出资额中的相对应的合伙企业出资份额的收益权（以下简称“收益权”）。为此，甲、乙双方经过充分友好协商，就乙方持有的收益权转让事宜达成如下协议：</p>');
			buf.push('<h6>第一条、转让标的</h6>');
			buf.push('<p>本协议转让的标的：乙方享有的对合伙企业出资份额的投资收益权，该收益权与合伙企业出资份额相对应，本次转让的收益权为总额人民币(金额确认后显示)（大写）¥(金额确认后显示)（小写）的合伙出资份额所对应收益权的一部分。</p>');
			buf.push('<p>乙方受让甲方收益权的受让价款为人民币(金额确认后显示)（大写）¥(金额确认后显示)（小写），该价款对应相同金额的合伙出资份额收益权。</p>');
			buf.push('<h6>第二条、权利保证</h6>');
			buf.push('<p>乙方承诺：截止本协议签订之时，乙方所持有的该项有限合伙出资份额系依法取得、合法拥有，不存在任何权属争议，也未以任何方式设置抵押、质押、保证或其他形式的担保，也无任何其他权利受限的情形。</p>');
			buf.push('<h6>第三条、甲方收益权持有期限</h6>');
			buf.push('<p>1、甲方收益权持有期限指甲方受让并持有上述投资收益权的时间跨度，乙方根据持有期限以及年化收益率综合计算应享有收益。本协议收益权持有期限为：收益权受让价款到账乙方账户次日起至受让价款到账乙方账户的第 90 日，收益权受让价款到账当日以及收益权期限届满后乙方按本协议第四条约定进行回购的期限不作为收益权持有期限。</p>');
			buf.push('<p>2、乙方应于回购时向甲方一次性支付持有期限内产生的收益，收益权持有期限与预期年化收益率对照表如下：</p>');
			buf.push('<table>');
			buf.push('<tr><th>期限</th><th>预期年化收益率</th></tr>');
			buf.push('<tr><td>90天</td><td>8%</td></tr>');
			buf.push('<tr><td>180天</td><td>9%</td></tr>');
			buf.push('<tr><td>360天</td><td>10%</td></tr>');
			buf.push('</table>');
			buf.push('<p style="text-align:right;">2015-06-10</p>');
			buf.push('<p>根据预期年化收益率计算，甲方获得的预期收益=受让乙方收益权价款金额×预期年化收益率×实际持有收益权天数/360（一年按360天计）。</p>');
			buf.push('<h6>第四条、收益权实现及回购</h6>');
			buf.push('<p>1、乙方通过回购方式实现本协议中约定由甲方享有的收益权。</p>');
			buf.push('<p>2、 甲方收益权持有期限届满后五个工作日内，乙方应向甲方按时足额回购上述收益权。回购价格为：收益权原受让价款+收益权持有期限内依年化收益率所产生的收益。</p>');
			buf.push('<p>2、 甲方收益权持有期限届满后五个工作日内，乙方应向甲方按时足额回购上述收益权。回购价格为：收益权原受让价款+收益权持有期限内依年化收益率所产生的收益。</p>');
			buf.push('<p>3、甲方收益权持有期间及甲方收益权受让价款到账乙方账户当日，甲方不可赎回或要求乙方提前回购收益权。</p>');
			buf.push('<h6>第五条、受让价款的支付</h6>');
			buf.push('<p>如果甲方对上述转让标的没有异议，须于本协议签署日后30天内将本协议第一条中约定的受让价款支付到乙方账户。甲方委托并授权小牛新财富管理有限公司以及小牛新财富管理有限公司指定的第三方支付机构将受让价款划付到乙方账户中。 自款项到账次日，上述收益权转让即生效。</p>');
			buf.push('<h6>第六条、声明与承诺</h6>');
			buf.push('<p>1、双方均具备签订及履行本协议的主体资格、权利能力和行为能力，均已取得签订与履行本协议所必须的授权、批准及许可。</p>');
			buf.push('<p>2、双方在本协议中所承担的义务合法有效，且不与各方承担的其他义务相冲突。</p>');
			buf.push('<h6>第七条、保密义务</h6>');
			buf.push('<p>1、双方对在本协议签订与履行过程中所获得的信息、合同、资料、数据及其他商业秘密承担保密义务，除办理相关登记或批准所必需，不得向任何第三方提供或披露。</p>');
			buf.push('<p>2、前项所列义务不因本协议的解除、终止、失效而免除。</p>');
			buf.push('<h6>第八条、违约责任</h6>');
			buf.push('<p>双方均应全面履行本协议的各项约定；如因违约造成某一方损失的，另一方应依法承担赔偿责任。</p>');
			buf.push('<h6>第九条、争议解决</h6>');
			buf.push('<p>本协议的签订、履行及争议均适用中华人民共和国法律。</p>');
			buf.push('<p>凡与本协议有关的争议，双方应友好协商，妥善解决；协商不成的，提交华南国际经济贸易仲裁委员会，依据仲裁申请之时该会施行的仲裁规则进行仲裁。仲裁裁决是终局的，对各方均有约束力，由此产生的仲裁费、差旅费、担保费及保全费均由违约方承担。</p>');
			buf.push('<h6>第十条、协议生效</h6>');
			buf.push('<p>本协议一式叁份，甲乙双方各执一份，交甲方指定的第三方（小牛新财富管理有限公司）持一份，每份均具同等法律效力。本协议经甲、乙双方签字盖章之日起成立，甲方价款到达乙方账户之日起生效。未尽事宜，另行协商。</p>');
			buf.push('<p class="userName">甲方：<em></em></p>');
			buf.push('<p class="date_now">日期：<em></em></p>');
			buf.push('<p>乙方：彭钢</p>');
			buf.push('<p class="date_now">日期：<em></em></p>');
			buf.push('</div>');
			return buf.join("");
		},
		info_consult:function(){
			var buf=[];
			buf.push('<p class="ti">信用咨询与管理服务协议<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont4">');
			buf.push('<p class="userName">甲方（受让人）：<em></em></p>');
			buf.push('<p>证件类型：身份证</p>');
			buf.push('<p class="identityCard">证件号：<em></em></p>');
			buf.push('<p class="userMobile">联系电话：<em></em></p>')
			buf.push('<p>乙方：小牛新财富管理有限公司</p>');
			buf.push('<p>地址：深圳市福田区彩田路2009号瀚森大厦17楼</p>');
			buf.push('<p>注册号：4403011107262598</p>');
			buf.push('<p>根据《中华人民共和国合同法》及相关法律法规的规定，双方遵循平等、自愿、互利和诚实信用原则，友好协商，就乙方为甲方提供信用咨询与管理服务达成一致，以兹信守。</p>');
			buf.push('<h6>第一条 释义</h6>');
			buf.push('<p>在本合同中，除非上下文另有解释，下列词语具有以下含义：</p>');
			buf.push('<p>1.1 受让人：指参考乙方的推荐、自主选择以一定数量资金受让收益权的自然人。</p>');
			buf.push('<p>1.2 出让人：指经乙方信用评估、出让收益权，由乙方推荐给受让人并得到受让人一定数量的资金的特定的自然人。</p>');
			buf.push('<p>1.3《收益权转让协议》：指乙方促成受让人与出让人签署的《收益权转让协议》。</p>');
			buf.push('<p>1.4 风险备用金账户：指为甲方利益考虑、由乙方设立并管理、以乙方的名义单独开立的一个专用银行账户，由乙方从出让人支付的服务费中提取一定金额存入此专用账户。本专用账户的款项专款专用，用于补偿乙方所服务的受让人一定程度的潜在兑付（本金和利息）损失。</p>');
			buf.push('<p>1.5 收益权：指《收益权转让协议》项下受让人拥有的全部权益，收益权以人民币计价。</p>');
			buf.push('<p>1.6 工作日：指中华人民共和国法律规定的工作日（法定工作日）。</p>');
			buf.push('<h6>第二条 收益权受让方式</h6>');
			buf.push('<p>甲方就乙方推荐的收益权项目签署《收益权转让协议》，并将转让款项支付给所认购的收益权的出让方，从而完成收益权的受让。</p>');
			buf.push('<h6>第三条 甲方权利与义务</h6>');
			buf.push('<p>3.1 甲方参考乙方推荐后，拥有最终决定是否受让出让人收益权的权利。</p>');
			buf.push('<p>3.2 甲方享有基于《收益权转让协议》项下约定的收益权益。</p>');
			buf.push('<p>3.3 对于本协议的沟通、履行过程中甲方所获知的包括但不限于乙方及出让人的各项信息，甲方确保不向任何第三人透露，甲方有义务为出让人的信用信息及乙方的业务内容进行保密。如果甲方擅自、不恰当地向他人透露出让人的信用信息或乙方的商业秘密，由此对出让人或乙方造成的损失，由甲方承担全部责任。本条款在本协议有效期内及终止后均具有法律效力。</p>');
			buf.push('<p>3.4 甲方保证其所用于受让的资金来源合法，甲方是该资金的合法所有人。因第三人对资金归属、合法性等问题产生的争议，由甲方负责解决。</p>');
			buf.push('<p>3.5 甲方变更账户信息、通讯地址、电话等相关重要信息，须及时通知乙方。因甲方未及时通知乙方而导致自身受到损失，由甲方自行承担责任。</p>');
			buf.push('<p>3.6 乙方推荐的出让人对甲方违约时，甲方授权及委托乙方采取合法合理的措施进行及时催收和追讨。</p>');
			buf.push('<h6>第四条 乙方的权利和义务</h6>');
			buf.push('<p>4.1 乙方应当按照本协议的规定，为甲方提供服务，履行诚实、信用、谨慎、有效的管理义务；</p>');
			buf.push('<p>4.2 乙方有义务对出让人的资格进行评估、筛选，最终决定是否将出让人推荐给甲方；</p>');
			buf.push('<p>4.3 乙方提供信用管理服务，有权向受让人收取本协议项下的服务费用；</p>');
			buf.push('<p>4.4 乙方应审慎管理风险备用金账户，并就账户情况向甲方进行定期披露；</p>');
			buf.push('<p>4.5 乙方推荐的出让人对甲方违约时，乙方根据甲方的授权及委托采取合法合理的措施进行及时催收和追讨；</p>');
			buf.push('<p>4.6 乙方须对甲方个人信息、资产情况及本协议项下所涉其他服务相关情况和资料依法保密；</p>');
			buf.push('<p>4.7 乙方应妥善保存与甲方资产相关的全部资料以备查阅，保存期限为本协议存续期间及本协议终止之日起3年。</p>');
			buf.push('<h6>第五条 收益权的实现</h6>');
			buf.push('<p>根据甲方与特定出让人签署的《收益权转让协议》中的约定，出让人有义务对甲方按约定一次性将收益权原受让价款与收益权持有期限内依年化收益率所产生的收益支付至甲方提供的如下账户。甲方须确保如下账户为甲方名下合法有效的银行账户，甲方变更该账户时必须签署《受让人客户信息变更书》并经乙方确认后方可变更；如因甲方未及时书面通知乙方而引发的损失由甲方自行承担。</p>');
			buf.push('<p>户名（与甲方姓名一致）： </p>');
			buf.push('<p>开户银行：</p>');
			buf.push('<p>账号：</p>');
			buf.push('<p>上述账户与甲方支付受让价款的账户保持一致。</p>');
			buf.push('<h6>第六条 甲方回款风险的处置方式</h6>');
			buf.push('<p>6.1 当出让人发生违约时，甲方选择如下之一的方式处置兑付风险：</p>');
			buf.push('<p>6.1.1 由甲方自行承担损失和风险，同时自行享有因出让人违约所支付的罚息、违约金等；</p>');
			buf.push('<p>6.1.2 由风险备用金账户进行出让人回款风险的共担，规则如下：</p>');
			buf.push('<p>风险备用金的提取比例由乙方根据出让人的整体违约状况进行设定，并有权进行适当的调整。</p>');
			buf.push('<p>乙方以季度为周期向甲方披露风险备用金账户整体信息情况；同时，如果甲方在披露期内得到风险备用金账户的补偿，将披露甲方的具体受偿情况。</p>');
			buf.push('<p>6.2 甲方选择风险备用金账户进行风险共担的情况下，甲方受偿可能属于如下情形之一：</p>');
			buf.push('<p>6.2.1 在风险备用金账户当期余额足以支付当期所有选择此方式的受让人所对应的发生逾期的出让人的逾期本息时，由风险备用金账户将当期所有违约出让人的全部逾期本息金额支付给甲方及其他受让人，甲方和其他受让人在各自对应的《收益权转让协议》下约定的本息回收情况将保持不变。在甲方得到乙方的风险备用金账户代偿当期本息后，甲方所持有的收益权由乙方取得，出让人其后所偿还的逾期款本息、罚息、违约金等相关权益归属乙方。乙方将此部分所得无偿计提入风险备用金账户。</p>');
			buf.push('<p>6.2.2 在风险备用金账户当期余额不足以支付当期所有选择此方式的受让人所应收的逾期本息时，则当期所有选择此方式的受让人按照各自对应的违约出让人的逾期本息金额占当期所有受让人对应的违约出让人的逾期本息总额的比例对风险备用金账户的当期资金进行分配，甲方和其他受让人当期未得到分配的部分自动记入下一期，与下一期发生的新逾期款继续进行上述同样原则的按比例分配，依此类推。</p>');
			buf.push('<p>风险备用金的提取比例由乙方根据出让人的整体违约状况进行设定，并有权进行适当的调整。</p>');
			buf.push('<p>乙方以季度为周期向甲方披露风险备用金账户整体信息情况；同时，如果甲方在披露期内得到风险备用金账户的补偿，将披露甲方的具体受偿情况。</p>');
			buf.push('<h6>第七条 风险提示</h6>');
			buf.push('<p>7.1 政策风险</p>');
			buf.push('<p>国家因宏观政策、财政政策、货币政策、行业政策、地区发展政策等因素引起的系统风险；</p>');
			buf.push('<p>7.2 出让人信用风险</p>');
			buf.push('<p>当出让人短期或者长期丧失还款能力（包括但不限于出让人收入情况、财产状况发生变化、人身出现意外、发生疾病、死亡等情况），或者出让人的兑付意愿发生变化时，甲方的收益权可能无法按时实现；如果甲方在本协议第六条中选择的是第二种风险承担方式，则当风险备用金账户余额不足以弥补当期所有的逾期出让人违约金额时，甲方当期应得到的回款可能延迟回收；</p>');
			buf.push('<p>7.3 不可抗力</p>');
			buf.push('<p>由于战争、动乱、自然灾害等不可抗力因素的出现而可能导致甲方资产损失的风险。</p>');
			buf.push('<h6>第八条 乙方服务费收取标准</h6>');
			buf.push('<p>就乙方依据本协议为甲方提供的信用咨询与管理服务，甲方应当向乙方支付管理费用（暂不收取）。</p>');
			buf.push('<h6>第九条 税务处理</h6>');
			buf.push('<p>甲方在收益权受让过程产生的相关税费，由甲方自行向主管税务机关申报、缴纳，乙方不提供代申报、代缴服务。</p>');
			buf.push('<h6>第十条 违约责任</h6>');
			buf.push('<p>任何一方违反本协议的约定，使得本协议的全部或部分不能履行，均应承担违约责任，并赔偿对方因此遭受的损失（包括由此产生的诉讼费和律师费）；如双方违约，根据实际情况各自承担相应的责任。违约方应赔偿因其违约而给守约方造成的损失，包括合同履行后可以获得的利益，但不得超过违约方订立合同时可以预见或应当预见的因违反合同可能造成的损失。</p>');
			buf.push('<h6>第十一条 争议的处理</h6>');
			buf.push('<p>本协议在履行过程中，如发生任何争执或纠纷，且协商不成的，双方约定华南国际经济贸易仲裁委员会提起仲裁，由此产生的诉讼费、律师费、担保费及保全费等均由违约方承担。</p>');
			buf.push('<h6>第十二条 其他事项</h6>');
			buf.push('<p>12.1 如果甲方出现收益权的继承或赠与，必须由主张权利的继承人或受赠人向乙方出示经国家权威机关认证的继承或赠与权利归属证明文件，乙方确认后方予协助进行资产的转移，由此产生的相关税费，由主张权利的继承人或受赠人，向主管税务机关申报、缴纳，乙方不负责；</p>');
			buf.push('<p>12.2 本协议附件作为本协议的有效组成部分，与本协议效力一致；本协议附件与本协议的规定不一致的，以附件为准；</p>');
			buf.push('<p>12.3 本协议的传真件、复印件、扫描件等有效复本的效力与本协议原件效力一致；</p>');
			buf.push('<p>12.4 双方确认，本协议的签署、生效和履行以不违反中国的法律法规为前提。如果本协议中的任何一条或多条违反适用的法律法规，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力；</p>');
			buf.push('<p>12.5 本协议一式贰份，甲、乙双方各保留一份，由甲、乙双方签字盖章后生效。</p>');
			buf.push('<p>甲方申明：甲方确认在签署本协议前已仔细阅读了本协议及相关附件，对本协议的所有条款及相关附件的内容已经阅悉，均无异议，并对双方的合作关系、有关权利、义务和责任条款的法律含义达成充分的理解，对乙方所提示的风险有充分的了解和预期，甲方接受因收益权受让行为所产生的全部收益及风险。</p>');
			buf.push('<p class="userName">甲方：<em></em></p>');
			buf.push('<p class="date_now">日期：<em></em></p>');
			buf.push('<p>乙方：彭钢</p>');
			buf.push('<p class="date_now">日期：<em></em></p>');
			buf.push('</div>');
			return buf.join("");
		},
		pay_pwd:function(){
			var buf = [];
			buf.push('<p class="ti">请输入交易密码<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p>请输入交易密码：</p>');
			buf.push('<p><span class="bank-pwd"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"><input type="password" maxlength="1"></span></p>');
			buf.push('<p class="sub-text"><span>请输入6位字交易密码</span><a href="/my/account/manage.html" class="forget-pwd">忘记密码</a></p>');
			buf.push('<p class="error-msg"></p>');
			buf.push('<p><a href="javascript:void(0);" class="light-btn confirm_purchase">确定</a></p>');
			buf.push('</div>');
			return buf.join("");
		},
		success:function(){
			var buf = [];
			buf.push('<p class="ti">购买成功<a href="#" class="quit"></a></p>');
			buf.push('<div class="cont3">');
			buf.push('<p class="buy-ok">尊敬的用户，您已成功购买天添牛{{#ttn_type}}期{{#money}}元，<br>可进入<a href="/my/invest.html?a=1">个人中心-我的投资</a>栏目查看详情。<br>多谢您的支持，祝您投资愉快！</p>');
			buf.push('<p><a href="/my/invest.html?a=1" class="light-btn">查看详情</a></p>');
			buf.push('</div>');
			return buf.join("");
		}
	},
	UI:function(){

		var entrance = $("#entrance"),
			self     = this;
			var flow = {
				'90':0.08,
				'180':0.09,
				'360':0.10
			};
		if(K.login()){
			

			// api.call('/api/product/current/queryProductInfo',{},function(_rel){

			// 	api.call('/api/account/getUserAsset.do',{},function(_asset){
			// 		var parse_obj = _rel.result;
			// 		$.extend(parse_obj,_asset.result);
			// 		entrance.html(K.ParseTpl(self.tpl.ydl(),parse_obj));

			// 		self.event_handler_login();
			// 	});
				
			// });
		
			api.call('/api/account/getUserAsset.do',{},function(_asset){
				var parse_obj = _asset.result;

				entrance.html(K.ParseTpl(self.tpl.ydl(),K.inverse_to_money(parse_obj)));
				self.event_handler_login();
				// $("#purchase_money").on("blur",function(){
				// 	var _this = $(this),
				// 		purchase_money = $.trim(_this.val()),
				// 		highest_money = parseFloat(_this.parents("#entrance").find(".ableBalanceAmount").text().replace(/[^\d]+/,""));
					
				// 	if(purchase_money < 100){  //最低100元
				// 		_this.val(100);
				// 		purchase_money = 100;
				// 	}else if(purchase_money > highest_money){
				// 		_this.val(highest_money);
				// 		purchase_money = highest_money;
				// 	}

				// 	$("#expected_revenue").text((purchase_money*flow[ttn_type]*ttn_type/360).toFixed(2)+"元");
				// });

				$("#purchase_money").on("blur",function(){
					var _this = $(this),
						purchase_money = _this.val(),
						error_msg = _this.parents("#entrance").find(".error-msg");
					if(purchase_money < 100){
						error_msg.text("购买金额100元起！");
						return false;
					}else if(purchase_money > 1000000){
						error_msg.text("超过单笔限额100万！");
						return false;
					}

					error_msg.text("");
				});
			});

		}else{

			var fid = 'bf5a23ea-3171-47a7-b726-e78a7c74f283';
			entrance.html(self.tpl.wdl()),
			self.event_handler_wdl();
			// $("#purchase_money").on("blur",function(){
			// 	var _this = $(this),
			// 		purchase_money = $.trim(_this.val()),
			// 		highest_money = parseFloat(_this.parents("#entrance").find(".ableBalanceAmount").replace(/[^\d]+/,""));
				
			// 	if(purchase_money < 100){  //最低100元
			// 		_this.val(100);
			// 		purchase_money = 100;
			// 	}else if(purchase_money > highest_money){
			// 		_this.val(highest_money);
			// 		purchase_money = highest_money;
			// 	}

			// 	$("#expected_revenue").text((purchase_money*flow[ttn_type]*ttn_type/360).toFixed(2)+"元");
			// });

			$("#purchase_money").on("blur",function(){
				var _this = $(this),
					purchase_money = _this.val(),
					error_msg = _this.parents("#entrance").find(".error-msg");
				if(purchase_money < 100){
					error_msg.text("购买金额100元起！");
					return false;
				}else if(purchase_money > 1000000){
					error_msg.text("超过单笔限额100万");
					return false;
				}

				error_msg.text("");
			});
		}


	},
	event_handler:function(){

		var flow = {
			'90':0.08,
			'180':0.09,
			'360':0.10
		};
		//活期宝下面的tab切换
		$(".tab-col").tabSwitch({
			navObj:'.navObj',
			className:'.cont',
			curSel:'selected',
			selectorIndex:'.navObj'
		});

		//购买金额-计算收益
		$("#entrance").on("input propertychange","#purchase_money",function(){
			var _this = $(this),
				purchase_money = $.trim(_this.val()),
				error_msg  =  _this.parents("#entrance").find(".error-msg");
			
			//输入金额的限制
			if(purchase_money > 1000000){
				error_msg.text("超过单笔限额100万");
				return false;
			}

			error_msg.text("");

			$("#expected_revenue").text((purchase_money*flow[ttn_type]*ttn_type/360).toFixed(2)+"元");
		});



	},
	event_handler_login:function(){

		var self = this;

		var selected_obj = "",
			array = [];

		window.red_packet = setInterval(function(){
			if(window.trigger){
				$("ul[data-releative='ttn']").find("li").each(function(index, el) {
					var _this = $(el);
					if(_this.children("a").hasClass('selected')){
						selected_obj =  _this.children('a');
						api.call('/api/activity/findRedPacketList.do',{
							'productId':selected_obj.attr("data-id"),
							'status':'UNEXCHANGE'
						},function(_rel){
							var list = _rel.list,
								red_list = [];
							red_list.push('<option data-id="">未选择（'+list.length+'个可用）</option>');
							array.push('<p class="ti">红包详情<a href="#" class="quit"></a></p><div class="cont">');
							$.each(list, function(index, val) {
								var buf = [];
								buf.push('<div class="redbag">');
								buf.push('<div class="num"><p class="title">￥'+(val.fMoney/10000).toFixed(2)+'</p><p>剩余'+K.getTime.countDown(new Date(val.fExpireDate).getTime()).D+'天</p></div>');
								buf.push('<div class="text"><span><p class="title">'+val.fName+'</p><p>'+val.fRemark+'</p></span></div></div>');
								array.push(buf.join(""));
								red_list.push('<option data-id='+val.fid+'>返现￥'+(val.fMoney/10000).toFixed(2)+'元</option>');
							});
							if(list.length == 0){
								//没有红包的情况下
								array.push("<img src='/static/img/red-bag-no.jpg' style='margin-top:70px'/>");
							}
							array.push('</div>');
							$("#redbag-select").html(red_list.join(""));
						});
						return false;
					}
				});
				clearInterval(window.red_packet);
				window.trigger = false;
			}
		},100);

		$("#red_paper_detail").on("click",function(){
			var selected_obj = "";
			$("ul[data-releative='ttn']").find("li").each(function(index, el) {
				var _this = $(el);
				if(_this.children("a").hasClass('selected')){
					selected_obj =  _this.children('a');
					return false;
				}
			});

			api.call('/api/activity/findRedPacketList.do',{
				'productId':selected_obj.attr("data-id"),
				'status':'UNEXCHANGE'
			},function(_rel){
				// var array = [],
				// 	list = _rel.list,
				// 	red_list = [];
				// red_list.push('<option data-code="0">未选择（'+list.length+'个可用）</option>');
				// array.push('<p class="ti">红包详情<a href="#" class="quit"></a></p><div class="cont">');
				// $.each(list, function(index, val) {
				// 	var buf = [];
				// 	buf.push('<div class="redbag">');
				// 	buf.push('<div class="num"><p class="title">￥'+(val.fMoney/10000).toFixed(2)+'</p><p>剩余'+K.getTime.countDown(new Date(val.fExpireDate).getTime()).D+'天</p></div>');
				// 	buf.push('<div class="text"><span><p class="title">'+val.fName+'</p><p>'+val.fRemark+'</p></span></div></div>');
				// 	array.push(buf.join(""));
				// 	red_list.push('<option>返现￥'+(val.fMoney/10000).toFixed(2)+'元</option>');
				// });
				// array.push('</div>');
				// $("#redbag-select").html(red_list.join(""));

				$.Dialogs({
				    "id" : "diglog_wrapper",
				    "overlay" : true,
				    "cls" : "dialog-wrapper popbox-bankrank2",
				    "closebtn" : ".quit,span.close",
				    "auto" : false,
				    "msg" :array.join("")
				});
			});
			// $.Dialogs({
			//     "id" : "diglog_wrapper",
			//     "overlay" : true,
			//     "cls" : "dialog-wrapper popbox-bankrank",
			//     "closebtn" : ".quit,span.close",
			//     "auto" : false,
			//     "msg" :msg
			// });
		});

		$("#purchase_money").on("focus",function(){
			var _this = $(this),
				error_msg = _this.parents("#entrance").find(".error-msg");
			error_msg.text("");
		});

		//收益权转让
		$("#revenue_transport").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.revenue_transport(),
			    "openfun":function(){
			    	api.call('/api/user/getIdentityInfoByUser.do',{

			    	},function(_rel){
			    		var result  = _rel.result,
			    			userName = result.userName || "",
			    			userMobile = result.userMobile || "",
			    			identityCard = result.identityCard || "";
			    		$(".popbox-bankrank .identityCard").find("em").text(identityCard);
			    		$(".popbox-bankrank .userMobile").find("em").text(userMobile);
			    		$(".popbox-bankrank .userName").find("em").text(userName);
			    		$(".popbox-bankrank .date_now").find("em").text(K.getTime.getDateStr(Date.now()+24*60*60*1000));
			    	});
			    }
			});
		});


		// 信用咨询与管理服务协议
		$("#info_consult").on("click",function(){
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.info_consult(),
			    "openfun":function(){
			    	api.call('/api/user/getIdentityInfoByUser.do',{

			    	},function(_rel){
			    		var result  = _rel.result,
			    			userName = result.userName || "",
			    			userMobile = result.userMobile || "",
			    			identityCard = result.identityCard || "";
		    			$(".popbox-bankrank .identityCard").find("em").text(identityCard);
		    			$(".popbox-bankrank .userMobile").find("em").text(userMobile);
		    			$(".popbox-bankrank .userName").find("em").text(userName);
		    			$(".popbox-bankrank .date_now").find("em").text(K.getTime.getDateStr(Date.now()+24*60*60*1000));
			    	});
			    }
			});
		});

		//立即购买按钮
		$(".purchase").on("click",function(){
			
			var _this     = $(this),
				error_msg = $("#entrance").find(".error-msg"),
				purchase_money = $.trim($("#purchase_money").val()),
				ableBalanceAmount = $.trim($(".ableBalanceAmount").text().replace('￥','')),
				checked = $("#entrance").find("input[type='checkbox']").eq(0).is(":checked") && $("#entrance").find("input[type='checkbox']").eq(1).is(":checked");

			if(!purchase_money){
				error_msg.text('请填写购买金额！');
				return false;
			}

			if(parseFloat(purchase_money) < 100){
				error_msg.text('购买金额100元起！');
				return false;
			}

			if(parseFloat(purchase_money) > 1000000){
				error_msg.text('超过单笔限额100万');
				return false;
			}

			if(parseFloat(purchase_money) > parseFloat(ableBalanceAmount)){
				error_msg.text('余额不足，请充值！');
				return false;
			}

			if(!checked){
				error_msg.text('请勾选服务协议');
				return false;
			}

			error_msg.text("");

			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank outter",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :self.tpl.pay_pwd(),
			    "openfun":function(){
			    	//密码输入框
			    	$(".bank-pwd").each(function(index, el) {
			    		$(el).find("input").each(function(index, el) {
			    			var _this = $(el);
			    			_this.on("keyup",function(event){
			    				var self = $(this),
			    					code = event.which;

			    				if(code == 8){
			    					self.text("");
			    					self.prev().focus();
			    				}else{
			    					//48-50 
			    					if(!((code>=48 && code<=57)||(code>=96 && code<=105))){
			    						self.val("");
			    						return false;
			    					}
			    					if(self.val()){
			    						self.next().focus();
			    					}
			    					
			    				}
			    			});
			    		});	
			    	});


			    	$(".confirm_purchase").on("click",function(){
			    		var _this = $(this),
			    			error_msg = _this.parents("#diglog_wrapper").find(".error-msg");

			    		var pwd_array = []
			    		$.each($(".bank-pwd").find("input"), function(index, val) {
			    			 pwd_array.push($(val).val());
			    		});
			    		
			    		if(pwd_array.join("").length < 6){
			    			error_msg.text("请输入交易密码");
			    			return false;
			    		}

			    		error_msg.text("");

			    		api.call('/api/product/dayAdd/buyProduct.do',{
			    			'investAmount':purchase_money*10000,
			    			'payPassword':pwd_array.join(""),
			    			'platform':'web',
			    			'sellChannel':'local',
			    			'productId':selected_obj.attr("data-id"),
			    			'redId':$("#redbag-select").find("option:selected").attr("data-id")	
			    		},function(_rel){
			    			$(".outter .quit").trigger("click");
			    			$.Dialogs({
			    			    "id" : "diglog_wrapper",
			    			    "overlay" : true,
			    			    "cls" : "dialog-wrapper popbox-bankrank",
			    			    "closebtn" : ".quit,span.close",
			    			    "auto" : false,
			    			    "msg" :K.ParseTpl(self.tpl.success(),{'money':purchase_money,'ttn_type':ttn_type})
			    			});
			    		},function(_rel){
			    			error_msg.text(_rel.msg);
			    		});
			    	})
			    }
			});
		});

	},
	event_handler_wdl:function(){
		$("#purchase_money").on("focus",function(){
			var _this = $(this),
				error_msg = _this.parents("#entrance").find(".error-msg");
			error_msg.text("");
		});
	}
}

hqb.init();