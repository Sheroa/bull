/**
 * @function : 注册页面js
 * @author  : ZY
 */
var $ = require('jquery'),
 	data_transport = require('common/core_data'),
 	K = require('util/Keeper'),
 	api = require('api/api'),
 	passport = require('util/passport');

 	require('ui/dialog/dialog');

 var register = {
 	init:function(){
 		this.event_handler();
 	},
 	event_handler:function(){
 		var self = this,
 			phone_number = "",
 			login_info = null,
 			flow = false;

 		$("#phone_num").on("blur",function(){
 			var _this = $(this),
 				phone_num = _this.val(),
 				error_msg = _this.parents(".contOne").find(".error-msg em");
 			api.call("/api/user/verifyAccountState",{
 				'account':phone_num
 			},function(_rel){
 				var result = _rel.result;
 				if(!result){
 					//不能注册
 					error_msg.text("您的手机号已注册！");
 					return false;
 				}
 				flow = true;
 			},function(_rel){
 				flow = true;
 			});
 		});

 		//密码
 		$(".visible").on("click",function(){
 			var _this = $(this),
 				input_obj = _this.prev();
 			if(input_obj.attr('type') == 'password'){
 				input_obj.attr('type','text');
 			}else{
 				input_obj.attr('type','password')
 			}
 		});

 		//登陆 bind - click事件
 		$(".next_step_one").on('click',function(){
 			var login_check = self.valid_check(),
 				_this = $(this),
 				error_msg = _this.parents(".contOne").find(".error-msg em");
 			if(!flow){
 				return false;
 			}
 			if(login_check){
 				//显示错误信息
 				error_msg.html(login_check);
 				return false;
 			}
 			
 			error_msg.html("");
 			phone_number = $.trim($("#phone_num").val());

 			//第一步成功 进入第二步
 			$(".contOne").addClass('hide');
 			$(".contTwo").removeClass("hide");
 			$(".stepOne").removeClass('stepOne').addClass('stepTwo');
 		});

 		$(".verify_sms").on("click",function(){
 			var count = 60,
 				_this = $(this);

 			//防止重复点击
 			if($(this).hasClass('disabled')){
 				return false;
 			}

 			$(this).addClass('disabled');
 			$(this).removeClass('light-btn').addClass('gray-btn');

 			window.timer = window.setInterval(function(){
 				if(count == 0){
 					_this.removeClass('disabled');
 					_this.removeClass('gray-btn').addClass('light-btn');
 					_this.html("手机验证码");
 					window.clearInterval(timer);
 				}else{
 					_this.html(count+"秒后重新获取");
 					count--;
 				}
 			},1000);

 			self.sendMobileCode(phone_number)
 		});

 		//第二步-下一步
 		$(".next_step_two").on("click",function(){
 			var _this = $(this),
 				error_msg = _this.parents(".contTwo").find("#identify_code"),
 				checked = _this.parents(".contTwo").find("input[type='checkbox']");

 			//短信验证
 			var verify_code = $("#verify_code");
 			if($.trim(verify_code.val()) == ""){
 				error_msg.html("<em>请输入手机验证码！</em>");
 				return false;
 			}
 			error_msg.html("");

 			//阅读并同意 
 			if(!checked.is(":checked")){
 				error_msg.html("<em>没有阅读</em>");
 				return false;
 			}
 			error_msg.html("");
 			
 			//请求注册接口开始进行注册
 			$.extend(data_transport,{
 				'account':$.trim($("#phone_num").val()),
 				'loginPwd':$.trim($("#user_pwd").val()),
 				'smsCode':$.trim(verify_code.val()),
 				'referrer':$.trim($("#recommand_person").val())
 			});
 			$.ajax({
 				url: '/api/user/register',
 				type: 'post',
 				data: data_transport,
 				success:function(_rel){

 					if(_rel.code == 0){
 						//注册成功
	 					login_info = _rel.data.result;
	 					passport.saveLoginInfo(login_info);

			 			//将第三步手机编译显示
			 			$("#phone_map").text(K.phone_num_map(phone_number));

			 			//第二步成功  进入第三步
					 	$(".contTwo").addClass('hide');
					 	$(".contThree").removeClass("hide");
					 	$(".stepTwo").removeClass('stepTwo').addClass('stepThree');	
 					}else{
 						//显示错误信息
 						error_msg.html("<em>"+_rel.msg+"</em>");
 					}
 				}
 			});
 			
 		});

		//协议
		$(".protocol").on("click",function(){
			var msg=[];
			msg.push('<p class="ti">小牛钱罐子用户服务协议<a href="#" class="quit"></a></p>');
			msg.push('<div class="cont4">');
			msg.push('<p>小牛钱罐子（下称“本网站”）由深圳市前海小牛网络科技有限公司成立并运营。在贵方注册成为本网站用户前请务必仔细阅读以下条款。若贵方一旦注册，则表示贵方同意接受本网站的服务并受以下条款的约束。若贵方不接受以下条款，请贵方立即停止注册或主动停止使用本网站的服务。请注意：本协议约定仅限于您与甲方因本协议及相关附属协议或规则所产生的法律关系及法律纠纷，不涉及您与本平台的其他用户之间因网上交易而产生的法律关系及法律纠纷。</p>');
			msg.push('<h5>第一章、 本协议的签署和修订</h5>');
			msg.push('<p>1. 本网站只接受持有中国有效身份证明的18周岁以上具有完全民事行为能力的自然人以及经合法程序设立的企业成为网站用户，如贵方不符合资格，请勿注册，否则本网站有权随时中止或终止贵方的用户资格。</p>');
			msg.push('<p>2. 本协议内容包括以下条款及本网站已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的一部分，与协议正文具有同等法律效力。本协议是贵方与本网站共同签订的，适用于贵方在本网站的全部活动。在贵方注册成为用户时，贵方已经阅读、理解并接受本协议的全部条款及各类规则，并承诺遵守中国的各类法律规定，如有违反而导致任何法律后果的发生，贵方将以自己的名义独立承担所有相应的法律责任。</p>');
			msg.push('<p>3. 本网站有权根据需要不时地修改本协议或根据本协议制定、修改各类具体规则并在本网站相关系统板块发布，无需另行单独通知贵方。贵方应不时地注意本协议及具体规则的变更，若贵方在本协议及具体规则内容公告变更后继续使用本服务的，表示贵方已充分阅读、理解并接受修改后的协议和具体规则内容，也将遵循修改后的协议和具体规则使用本网站的服务；同时就贵方在协议和具体规则修订前通过本网站进行的交易及其效力，视为贵方已同意并已按照本协议及有关规则进行了相应的授权和追认。若贵方不同意修改后的协议内容，贵方应停止使用本网站的服务。</p>');
			msg.push('<p>4. 贵方通过自行或授权有关方根据本协议及本网站有关规则、说明操作确认本协议后，本协议即在贵方和本网站之间产生法律效力。本协议不涉及贵方与本网站的其他用户之间因网上交易而产生的法律关系或法律纠纷，但贵方在此同意将全面接受和履行与本网站其他用户在本网站签订的任何电子法律文本，并承诺按该等法律文本享有和/或放弃相应的权利、承担和/或豁免相应的义务。</p>');
			msg.push('<h5>第二章、 服务的提供</h5>');
			msg.push('<p>1. 本网站提供的服务包括但不限于：发布借款需求、查阅交易及投资机会、签订和查阅合同、资金充值、提现、代收、代付等，具体详情以本网站当时提供的服务内容为准。贵方同意，针对借款人用户，本网站有权根据借款人提供的各项信息及本网站独立获得的信息评定借款人在本网站所拥有的个人信用等级，或决定是否审核通过借款人的借款申请。</p>');
			msg.push('<p>2. 基于运行和交易安全的需要，本网站可以暂时停止提供、限制或改变本网站服务的部分功能，或提供新的功能。在任何功能减少、增加或者变化时，只要贵方仍然使用本网站的服务，表示贵方仍然同意本协议或者变更后的协议。</p>');
			msg.push('<p>3. 贵方确认，贵方在本网站上按本网站服务流程所确认的交易状态将成为本网站为贵方进行相关交易或操作（包括但不限于冻结资金、代为支付或收取款项、订立合同等）的明确指令。贵方同意本网站有权按相关指令依据本协议和/或有关文件和规则对相关事项进行处理。 </p>');
			msg.push('<p>4. 贵方未能及时对交易状态进行修改或确认或未能提交相关申请所引起的任何纠纷或损失由贵方本人负责，本网站不承担任何责任。</p>');
			msg.push('<h5>第三章、 交易管理及费用</h5>');
			msg.push('<p>1. 在贵方成功注册后，贵方可以自行或授权贵方的代理人根据本网站有关规则和说明，通过本网站确认签署有关协议并经本网站审核通过后实现借款需求或资金的投资（投资方式包括但不限于向借款人直接投资、购买理财产品或受让债权等形式）。详细操作规则及方式请见有关协议及本网站相关页面的规则和说明。</p>');
			msg.push('<p>2. 本网站将为贵方的借款、还款或资金的投资、回收、投资等交易提供服务，并在服务过程中根据有关文件、协议和/或本网站页面的相关规则、说明等收取必要的服务或管理费用，其具体内容、比例、金额等事项请参见有关文件及本网站相关页面的规则和说明（包括但不限于，就贵方每一笔成功转让的债权，本网站有权基于贵方所转让债权的金额向贵方收取一定比例的转让管理费等款项作为服务费用，具体比例及金额等请参见本网站的债权转让相关规则和说明）。贵方同意，本网站有权不时调整前述服务或管理费用的类型或金额等具体事项并根据本协议和相关规则进行公告、修改。</p>');
			msg.push('<h5>第四章、 资金管理</h5>');
			msg.push('<p>1. 就贵方在本网站进行的借款或投资，本网站和/或本网站委托的第三方机构将为贵方提供“资金管理服务”，主要包括但不限于：资金的充值、提现、代收、代付、查询等。贵方可以通过本网站有关页面的具体规则或说明详细了解。</p>');
			msg.push('<p>2. 贵方了解，上述充值、提现、代收、代付以及查询等服务涉及本网站与第三方支付机构或金融机构的合作。贵方同意：(a) 受第三方支付机构或金融机构可能仅在工作日进行资金代扣及划转的现状等各种原因所限，本网站不对前述服务的资金到账时间做任何承诺，也不承担与此相关的责任，包括但不限于由此产生的利息、货币贬值等损失；(b) 一经贵方使用前述服务，即表示贵方不可撤销地授权本网站进行相关操作，且该等操作是不可逆转的，贵方不能以任何理由拒绝付款或要求取消交易。就前述服务，贵方应按照有关文件及第三方支付机构或金融机构的规定支付第三方的费用，贵方与第三方之间就费用支付事项产生的争议或纠纷，与本网站无关。</p>');
			msg.push('<p>3. 贵方保证并承诺贵方通过本网站平台进行交易的资金来源合法。贵方同意，本公司有权按照包括但不限于公安机关、检察机关、法院等司法机关、行政机关、军事机关的要求协助对贵方的账户及资金等进行查询、冻结或扣划等操作。</p>');
			msg.push('<p>4. 本网站有权基于交易安全等方面的考虑不时设定涉及交易的相关事项，包括但不限于交易限额、交易次数等。贵方了解，本网站的前述设定可能会对贵方的交易造成一定不便，贵方对此没有异议。</p>');
			msg.push('<p>5. 如果本网站发现了因系统故障或其他原因导致的处理错误，无论有利于本网站还是有利于贵方，本网站都有权在根据本协议规定通知贵方后纠正该错误。如果该错误导致贵方实际收到的金额少于贵方应获得的金额，则本网站在确认该处理错误后会尽快将贵方应收金额与实收金额之间的差额存入贵方的用户账户。如果该错误导致贵方实际收到的金额多于贵方应获得的金额，则无论错误的性质和原因为何，贵方都应及时根据本网站向贵方发出的有关纠正错误的通知的具体要求返还多收的款项或进行其他操作。贵方理解并同意，贵方因前述处理错误而多付或少付的款项均不计利息，本网站不承担因前述处理错误而导致的任何损失或责任（包括贵方可能因前述错误导致的利息、汇率等损失），但因本网站恶意而导致的处理错误除外。</p>');
			msg.push('<p>6. 在任何情况下，对于贵方使用本网站服务过程中涉及由第三方提供相关服务的责任由该第三方承担，本网站不承担该等责任。因贵方自身的原因导致本网站服务无法提供或提供时发生任何错误而产生的任何损失或责任，由贵方自行负责，本网站不承担责任。</p>');
			msg.push('<h5>第五章、 电子合同</h5>');
			msg.push('<p>1. 在本网站平台交易需订立的协议采用电子合同方式，可以有一份或者多份并且每一份具有同等法律效力。贵方或贵方的代理人根据有关协议及本网站的相关规则在本网站确认签署的电子合同即视为贵方本人真实意愿并以贵方本人名义签署的合同，具有法律效力。贵方应妥善保管自己的账户密码等账户信息，贵方通过前述方式订立的电子合同对合同各方具有法律约束力，贵方不得以账户密码等账户信息被盗用或其他理由否认已订立的合同的效力或不按照该等合同履行相关义务。</p>');
			msg.push('<p>2. 贵方根据本协议以及本网站的相关规则签署电子合同后，不得擅自修改该合同。本网站向贵方提供电子合同的保管查询、核对等服务，如对电子合同真伪或电子合同的内容有任何疑问，贵方可通过本网站的相关系统板块查阅有关合同并进行核对。如对此有任何争议，应以本网站记录的合同为准。</p>');
			msg.push('<h5>第六章、 用户信息及隐私权保护</h5>');
			msg.push('<p>1.用户信息的提供、搜集及核实</p>');
			msg.push('<p>1.1贵方有义务在注册时提供自己的真实资料，并保证诸如电子邮件地址、联系电话、联系地址、邮政编码等内容的有效性、安全性和及时更新，以便本网站为贵方提供服务并与贵方进行及时、有效的联系。贵方应完全独自承担因通过这些联系方式无法与贵方取得联系而导致的贵方在使用本服务过程中遭受的任何损失或增加任何费用等不利后果。</p>');
			msg.push('<p>1.2本网站可能自公开及私人资料来源收集贵方的额外资料，以更好地了解本网站用户，并为其度身订造本网站服务、解决争议和确保在网站进行交易的安全性。本网站仅收集本网站认为就此目的及达成该目的所必须的关于贵方的个人资料。</p>');
			msg.push('<p>1.3贵方同意本网站可以自行或通过合作的第三方机构对贵方提交或本网站搜集的用户信息（包括但不限于贵方的个人身份证信息等）进行核实，并对获得的核实结果根据本协议及有关文件进行查看、使用和留存等操作。</p>');
			msg.push('<p>1.4本网站按照贵方在本网站上的行为自动追踪关于贵方的某些资料。本网站利用这些资料进行有关本网站之用户的人口统计、兴趣及行为的内部研究，以更好地了解贵方以便向贵方和本网站的其他用户提供更好的服务。</p>');
			msg.push('<p>1.5本网站在本网站的某些网页上使用诸如“Cookies”的资料收集装置。“Cookies”是设置在贵方的硬盘上的小档案，以协助本网站为贵方提供度身订造的服务。本网站亦提供某些只能通过使用“Cookies”才可得到的功能。本网站还利用“Cookies”使贵方能够在某段期间内减少输入密码的次数。“Cookies”还可以协助本网站提供专门针对贵方的兴趣而提供的资料。</p>');
			msg.push('<p>1.6如果贵方将个人通讯信息（例如：手机短信、电邮或信件）交付给本网站，或如果其他用户或第三方向本网站发出关于贵方在本网站上的活动或登录事项的通讯信息，本网站可以将这些资料收集在贵方的专门档案中。</p>');
			msg.push('<p>2. 用户信息的使用和披露</p>');
			msg.push('<p>2.1 贵方同意本网站可使用关于贵方的个人资料（包括但不限于本网站持有的有关贵方的档案中的资料，及本网站从贵方目前及以前在本网站上的活动所获取的其他资料）以解决争议、对纠纷进行调停、确保在本网站进行安全交易，并执行本网站的服务协议及相关规则。本网站有时候可能调查多个用户以识别问题或解决争议，特别是本网站可审查贵方的资料以区分使用多个用户名或别名的用户。为限制在网站上的欺诈、非法或其他刑事犯罪活动，使本网站免受其害，贵方同意本网站可通过人工或自动程序对贵方的个人资料进行评价。</p>');
			msg.push('<p>2.2 贵方同意本网站可以使用贵方的个人资料以改进本网站的推广和促销工作、分析网站的使用率、改善本网站的内容和产品推广形式，并使本网站的网站内容、设计和服务更能符合用户的要求。这些使用能改善本网站的网页，以调整本网站的网页使其更能符合贵方的需求，从而使贵方在使用本网站服务时得到更为顺利、有效、安全及度身订造的交易体验。</p>');
			msg.push('<p>2.3 贵方同意本网站利用贵方的资料与贵方联络并（在某些情况下）向贵方传递针对贵方的兴趣而提供的信息，例如：有针对性的广告条、行政管理方面的通知、产品提供以及有关贵方使用本网站的通讯。贵方接受本协议即视为贵方同意收取这些资料。</p>');
			msg.push('<p>2.4 贵方注册成功后应妥善保管贵方的用户名和密码。贵方确认，无论是贵方还是贵方的代理人，用贵方的用户名和密码登录本网站后在本网站的一切行为均代表贵方并由贵方承担相应的法律后果。</p>');
			msg.push('<p>2.5 本网站对于贵方提供的、自行收集到的、经认证的个人信息将按照本协议及有关规则予以保护、使用或者披露。本网站将采用行业标准惯例以保护贵方的个人资料，但鉴于技术限制，本网站不能确保贵方的全部私人通讯及其他个人资料不会通过本协议中未列明的途径泄露出去。</p>');
			msg.push('<p>2.6 贵方使用本网站服务进行交易时，贵方即授权本公司将贵方的包括但不限于真实姓名、联系方式、信用状况等必要的个人信息和交易信息披露给与贵方交易的另一方或本网站的合作机构（仅限于本网站为完成拟向贵方提供的服务而合作的机构）。</p>');
			msg.push('<p>2.7 本网站有义务根据有关法律要求向司法机关和政府部门提供贵方的个人资料。在贵方未能按照与本协议、本网站有关规则或者与本网站其他用户签订的有关协议的约定履行自己应尽的义务时（包括但不限于当贵方作为借款人借款逾期或有其他违约时），本网站有权根据自己的判断、有关协议和规则、国家生效裁决文书或者与该笔交易有关的其他用户的合理请求披露贵方的个人资料（包括但不限于在本网站及互联网络上公布贵方的违法、违约行为，并有关将该内容记入任何与贵方相关的信用资料、档案或数据库），并且作为投资人的其他用户可以采取发布贵方的个人信息的方式追索债权或通过司法部门要求本网站提供相关资料，本网站对此不承担任何责任。</p>');
			msg.push('<p>3. 贵方对其他用户信息的使用</p>');
			msg.push('<p>3.1在本网站提供的交易活动中，贵方无权要求本网站提供其他用户的个人资料，除非符合以下条件：</p>');
			msg.push('<p>（1） 贵方已向法院起诉其他用户的在本网站活动中的违约行为；</p>');
			msg.push('<p>（2） 与贵方有关的其他用户逾期未归还借款本息；</p>');
			msg.push('<p>（3） 本网站被吊销营业执照、解散、清算、宣告破产或者其他有碍于贵方收回借款本息的情形。</p>');
			msg.push('<p>3.2 如贵方通过签署有关协议等方式获得其他用户的个人信息，贵方同意不将该等个人信息用于除还本付息或向借款人追索债权以外的其他任何用途，除非该等信息根据适用的法律规定、被有管辖权的法院或政府部门要求披露。</p>');
			msg.push('<h5>第七章、 不保证及使用限制</h5>');
			msg.push('<p>1.不保证</p>');
			msg.push('<p>1.1 在任何情况下，本网站及其股东、创建人、高级职员、董事、代理人、关联公司、母公司、子公司和雇员（以下称“本网站方”）均不以任何明示或默示的方式对贵方使用本网站服务而产生的任何形式的直接或间接损失承担法律责任，包括但不限于资金损失、利润损失、营业中断损失等，无论贵方通过本网站形成的借贷关系是否适用本网站的风险备用金规则或者是否存在第三方担保，并且本网站方不保证网站内容的真实性、充分性、及时性、可靠性、完整性和有效性，并且免除任何由此引起的法律责任。</p>');
			msg.push('<p>1.2 本网站不能保证也没有义务保证第三方网站上的信息的真实性和有效性。贵方应按照第三方网站的服务协议使用第三方网站，而不是按照本协议。第三方网站的内容、产品、广告和其他任何信息均由贵方自行判断并承担风险，而与本网站无关。</p>');
			msg.push('<p>1.3 因为本网站或者涉及的第三方网站的设备、系统存在缺陷、黑客攻击、网络故障、电力中断、计算机病毒或其他不可抗力因素造成的损失，本网站均不负责赔偿，贵方的补救措施只能是与本网站协商终止本协议并停止使用本网站。但是，中国现行法律、法规另有规定的除外。</p>');
			msg.push('<p>2.使用限制</p>');
			msg.push('<p>2.1 贵方承诺合法使用本网站提供的服务及网站内容。贵方不得利用本服务从事侵害他人合法权益之行为，不得在本网站从事任何可能违反中国的法律、法规、规章和政府规范性文件的行为或者任何未经授权的行为，如擅自进入本网站的未公开的系统、不正当的使用账号密码和网站的任何内容等。</p>');
			msg.push('<p>2.2 贵方不得使用本网站提供的服务或其他电子邮件转发服务发出垃圾邮件或其他可能违反本协议的内容。</p>');
			msg.push('<p>2.3 本网站没有义务监测网站内容，但是贵方确认并同意本网站有权不时地根据法律、法规、政府要求透露、修改或者删除必要的信息，以便更好地运营本网站并保护自身及本网站的其他合法用户。</p>');
			msg.push('<p>2.4 本网站中全部内容的版权均属于本网站所有，该等内容包括但不限于文本、数据、文章、设计、源代码、软件、图片、照片及其他全部信息（以下称“网站内容”）。网站内容受中华人民共和国著作权法及各国际版权公约的保护。未经本网站事先书面同意，贵方承诺不以任何方式、不以任何形式复制、模仿、传播、出版、公布、展示网站内容，包括但不限于电子的、机械的、复印的、录音录像的方式和形式等。贵方承认网站内容是属于本网站的财产。未经本网站书面同意，贵方亦不得将本网站包含的资料等任何内容镜像到任何其他网站或者服务器。任何未经授权对网站内容的使用均属于违法行为，本网站将追究贵方的法律责任。</p>');
			msg.push('<p>2.5 由于贵方违反本协议或任何法律、法规或侵害第三方的权利，而引起第三方对本网站提出的任何形式的索赔、要求、诉讼，本网站有权向贵方追偿相关损失，包括但不限于本网站的法律费用、名誉损失、及向第三方支付的补偿金等。</p>');
			msg.push('<h5>第八章、 协议终止及账户的暂停、注销或终止</h5>');
			msg.push('<p>1. 除非本网站终止本协议或者贵方申请终止本协议且经本网站同意，否则本协议始终有效。在贵方违反了本协议、相关规则，或在相关法律法规、政府部门的要求下，本网站有权通过站内信、电子邮件通知等方式终止本协议、关闭贵方的账户或者限制贵方使用本网站。但本网站的终止行为不能免除贵方根据本协议或在本网站生成的其他协议项下的还未履行完毕的义务。</p>');
			msg.push('<p>2. 贵方若发现有第三人冒用或盗用贵方的用户账户及密码，或其他任何未经合法授权的情形，应立即以有效方式通知本网站，要求本网站暂停相关服务，否则由此产生的一切责任由贵方本人承担。同时，贵方理解本网站对贵方的请求采取行动需要合理期限，在此之前，本网站对第三人使用该服务所导致的损失不承担任何责任。</p>');
			msg.push('<p>3. 贵方决定不再使用用户账户时，应首先清偿所有应付款项（包括但不限于借款本金、利息、罚息、违约金、服务费、管理费等），再将用户账户中的可用款项（如有）全部提现或者向本网站发出其它合法的支付指令，并向本网站申请注销该用户账户，经本网站审核同意后可正式注销用户账户。会员死亡或被宣告死亡的，其在本协议项下的各项权利义务由其继承人承担。若会员丧失全部或部分民事权利能力或民事行为能力，本网站有权根据有效法律文书（包括但不限于生效的法院判决等）或其法定监护人的指示处置与用户账户相关的款项。</p>');
			msg.push('<p>4. 本网站有权基于单方独立判断，在认为可能发生危害交易安全等情形时，不经通知而先行暂停、中断或终止向贵方提供本协议项下的全部或部分会员服务，并将注册资料移除或删除，且无需对贵方或任何第三方承担任何责任。前述情形包括但不限于：</p>');
			msg.push('<p>（1） 本网站认为贵方提供的个人资料不具有真实性、有效性或完整性；</p>');
			msg.push('<p>（2） 本网站发现异常交易或有疑义或有违法之虞时；</p>');
			msg.push('<p>（3） 本网站认为贵方的账户涉嫌洗钱、套现、传销、被冒用或其他本网站认为有风险之情形；</p>');
			msg.push('<p>（4） 本网站认为贵方已经违反本协议中规定的各类规则及精神；</p>');
			msg.push('<p>（5） 本网站基于交易安全等原因，根据其单独判断需先行暂停、中断或终止向贵方提供本协议项下的全部或部分会员服务，并将注册资料移除或删除的其他情形。</p>');
			msg.push('<p>5. 贵方同意在必要时，本网站无需进行事先通知即有权终止提供用户账户服务，并可能立即暂停、关闭或删除贵方的用户账户及该用户账户中的所有相关资料及档案，并将贵方滞留在这些账户的全部合法资金退回到贵方的银行账户。</p>');
			msg.push('<p>6. 贵方同意，用户账户的暂停、中断或终止不代表贵方责任的终止，贵方仍应对贵方使用本网站服务期间的行为承担可能的违约或损害赔偿责任，同时本网站仍可保有贵方的相关信息。</p>');
			msg.push('<p>7. 若贵方使用第三方网站账号注册本网站用户账户，则贵方应对贵方本网站用户账户所对应的第三方网站账号拥有合法的使用权，如贵方因故对该第三方网站账号丧失使用权的，则本网站可停止为贵方的该用户账户提供服务。但如该用户账户尚存有余额的，本网站将会为贵方妥善保管。此时，如贵方欲取回其原有余额，本网站将提供更换本网站账户名的服务，即贵方可把贵方原本网站账户下余额转移到贵方另外合法注册的本网站账户中；如因故无法自助完成更换账户名，贵方可以向本网站提出以银行账户接受原有资金的请求，经核验属实后，本网站可配合贵方将原有资金转移到以贵方真实姓名登记的银行账户下。</p>');
			msg.push('<h5>第九章、 通知</h5>');
			msg.push('<p>本协议项下的通知如以公示方式作出，一经在本网站公示即视为已经送达。除此之外，其他向贵方个人发布的具有专属性的通知将由本网站向贵方在注册时提供的电子邮箱，或本网站在贵方的个人账户中为贵方设置的站内消息系统栏，或贵方在注册后在本网站绑定的手机发送，一经发送即视为已经送达。请贵方密切关注贵方的电子邮箱 、站内消息系统栏中的邮件、信息及手机中的短信信息。贵方同意本网站出于向贵方提供服务之目的，可以向贵方的电子邮箱、站内消息系统栏和手机发送有关通知或提醒；若贵方不愿意接收，请在本网站相应系统板块进行设置。但贵方同时同意并确认，若贵方设置了不接收有关通知或提醒，则贵方有可能收不到该等通知信息，贵方不得以贵方未收到或未阅读该等通知信息主张相关通知未送达于贵方。</p>');
			msg.push('<h5>第十章、 适用法律和管辖</h5>');
			msg.push('<p>本协议签订地为深圳市福田区，因本网站所提供服务而产生的争议均适用中华人民共和国法律，并由协议签订地人民法院管辖。</p>');
			msg.push('<h5>第十一章、 其他</h5>');
			msg.push('<p>本网站对本协议拥有最终的解释权。本协议及本网站有关页面的相关名词可互相引用参照，如有不同理解，则以本协议条款为准。此外，若本协议的部分条款被认定为无效或者无法实施时，本协议中的其他条款仍然有效。</p>');
			msg.push('</div>');
			$.Dialogs({
			    "id" : "diglog_wrapper",
			    "overlay" : true,
			    "cls" : "dialog-wrapper popbox-bankrank",
			    "closebtn" : ".quit,span.close",
			    "auto" : false,
			    "msg" :msg.join(""),
			    "openfun":function(){
			    	api.call('/api/user/getIdentityInfoByUser.do',{

			    	},function(_rel){
			    		var result  = _rel.result,
			    			userName = result.userName,
			    			userMobile = result.userMobile,
			    			identityCard = result.identityCard;
			    		$(".name").text(userName);
			    		$(".register_phone").text(userMobile);
			    		$(".identify_num").text(identityCard);
			    	});
			    }
			});
		});

		//密码输入框
		$(".bank-pwd").each(function(index, el) {
			$(el).find("input").each(function(index, el) {
				var _this = $(el);
				_this.on("keyup",function(event){
					var self = $(this);

					if(event.which == 8){
						self.text("");
						self.prev().focus();
					}else{
						self.next().focus();
					}
				});
			});	
		});


 		//第三部-设置
 		$(".set_btn").on("click",function(){
 			var _this = $(this),
 				bank_pwd = _this.parents(".contThree").find(".bank-pwd"),
 				compare_array = [],
 				error_msg = _this.parents(".contThree").find(".error-msg em")

 			$.each(bank_pwd,function(index,value){
 				var pwd_item = $(this),
 					pwd_array = [];
 				$.each(pwd_item.find("input"),function(k,v){
 					pwd_array.push($(v).val());
 				});
 				compare_array.push(pwd_array.join(""));


 			});

 			if(compare_array[0].length != 6 || compare_array[1].length != 6){
 				error_msg.text("请设置交易密码，保障资金安全");
 				return false;
 			}
 			error_msg.text("");
			if(compare_array[0] != compare_array[1]){
				error_msg.html("两次输入的密码不一致，请重新输入");
				return false;
			}
			error_msg.text("");

			//调用接口
			api.call('/api/user/setPayPassword.do',{
				'payPwd':compare_array[0]
			},function(data){
				K.gotohref("/my/personCenter.html");
			});
 		})

 		//第三部-跳过
 		$(".step_over").on("click",function(){
 			K.gotohref("/my/personCenter.html");	
 		});

 	},
 	valid_check:function(){
 		var user_pwd  = $("#user_pwd"),
 			phone_num = $("#phone_num");

 		//检测手机号码
 		if(!(phone_num && phone_num.val() != '')){
 			return "请输入手机号码";
 		}

 		if(!K.is_phone($.trim(phone_num.val()))){
 			return "手机号码格式不正确，请重新输入";
 		}

 		//验证注册密码
 		if(!(user_pwd && user_pwd.val() != '')){
 			return "请输入登陆密码";
 		}

 		if(!K.pwd_valid_check($.trim(user_pwd.val()))){
 			return "密码过于简单，请设置字母+数字的密码";
 		}


 	},
 	sendMobileCode:function(phone_num){
 		$.extend(data_transport,{
 			'mobile': phone_num
 		});
 		$.ajax({
 			url: '/api/user/sendSmsCodeByRegister',
 			type: 'post',
 			data: data_transport,
 			success:function(result){
 				if(result.code == 0){
 					$("#identify_code").html("验证码已发至手机"+phone_num);
 				}else{
 					$("#identify_code").html("<em>验证码发送失败</em>");
 				}
 			}
 		});
 	}
 }

 register.init();