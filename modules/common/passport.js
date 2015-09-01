/**
 * @function : 登陆
 * @author : ZY
 */
var $ = require("jquery");

var passport = {
    version:0.1,
    usernameInput: false,    //用户名input
    passwdInput: false, //密码input
    pcInput: false, //记录密码input
    doLogin: function() {
        // 必须判断一下，避免连续两次点击
        if (this.eInterval)
            return;


        this.intervalCount = 0;

        this.username = $.trim(this.usernameInput.val());
        var username = this.username;
        var password = $.trim(this.passwdInput.val());
        var captcha = $.trim(this.captchaInput ? this.captchaInput.val() : false);

        var pc = 0;
        if (this.pcInput && this.pcInput.prop("checked") == true)
            pc = 1;

        if (username == "") {
            this.reportMsg('1');
            this.usernameInput.focus();
            return false;
        }

        //如果autopad不为空，则限制只能输入本域的用户
        if (this.autopad != "") {
            var dpostfix = email.substr(email.lastIndexOf('@') + 1);
            if (this.autopad.lastIndexOf(dpostfix) < 0) {
                this.reportMsg('3', this.autopad);
                this.usernameInput.focus();
                this.passwdInput.value = "";
                return false;
            }
        }
        if (password == "") {
            this.reportMsg('4');
            this.passwdInput.value = "";
            this.passwdInput.focus();
            return false;
        }
        if (this.usePost == 1) {
            login_status = "";
            login_error_result = "";
            login_need_captcha = false;

            return this.doPost();
        }
        //显示Passport等待状态框，执行后将破坏 document.forms
        this.drawPassportWait(this.waitInfo); //？执行后破坏 document.forms 不是很理解这句话
        return this.loginHandle(username, password, pc, this.sElement, this.loginFailCall.bindFunc(this), this.loginSuccessCall.bindFunc(this));
    },
};

/**
 *登陆接口
 * @param loginInfo {object}
 * loginInfo.account	用户名
 * loginInfo.loginPwd	登录密码
 * loginInfo.deviceId	    (可选) 设备唯一标识
 * loginInfo.deviceModel	(可选) 设备型号，如iPhone
 * loginInfo.systemVersion	(可选) 系统版本，如8.1
 * loginInfo.deviceToken	(可选) 推送的token
 * loginInfo.resolution	    (可选) 设备分辨率，如1242*2208
 *
 * @param callbacks  回调
 * callbacks.onLoginSuccess
 * callbacks.onLoginError
 * callbacks.onRequestError
 */
passport.login = function ( loginInfo ,callbacks){

    var param= $.extend({
        accoun:"",
        loginPwd:"",
        deviceId:"",
        deviceModel:"",
        systemVersion:"",
        systemVersion:"",
        deviceToken:"",
        resolution:""
    },loginInfo);

    $.ajax({
        url:"",
        type:"POST",
        data:param,
        dataType:"json",
        success:function(_ret){
            if(_ret.code == "0"){
                //登陆成功
                $.extend(loginInfo, _ret.data.result);
                saveLoginInfo(loginInfo);

                if(typeof  callbacks.onLoginSuccess == "function"){
                    callbacks.onLoginSuccess(loginInfo);
                }

            }else{
                if(typeof  callbacks.onLoginError == "function"){
                    callbacks.onLoginError(loginInfo);
                }
            }
        },
        error:function(a,b,c){
            //请求失败
            if(typeof  callbacks.onRequestError == "function"){
                callbacks.onRequestError(a,b,c);
            }
        }
    });
};


/**
 * 将登陆成功之后的信息以cookie形式保存
 * @param userinfo {object}
 */
passport.saveLoginInfo = function (userinfo) {

    if(!userinfo){
        return;
    }

    var options = { path: '/' };
    if(userinfo.__remober){
        options.expires=7;
    }

    for(var key in userinfo){
        if(userinfo.hasOwnProperty(key)){
            $.cookie(key, userinfo[key], options);
        }
    }

};


/**
 * 获取用户登陆后保存的信息
 * @param key {String}
 * @returns {String}
 */
passport.getUserInfoItem = function(key){
    return $.cookie(key);
};


/**
 * 用户界面登陆操作
 * @param usernameSelector  用户名录入框选择器
 * @param pwdSelector       密码录入框选择器
 * @param loginBtnSelector  登陆按钮选择器
 * @param rememberSelector  记住登陆状态选择器
 */
passport.uiLogin = function (usernameSelector, pwdSelector, loginBtnSelector,rememberSelector) {

    var $nameinput = $(usernameSelector);
    var $pwdinput  = $(pwdSelector);
    var $loginbtn  = $(loginBtnSelector);
    var $rememberinput = $(rememberSelector);

    var loginCallbacks = {
        onLoginSuccess: function(userinfo){
            alert("登陆成功！")
        },
        onLoginError: function(userinfo) {
            alert("登陆失败");
        },
        onRequestError: function(a,b,c) {
            alert("请求失败！");
        }
    };

    $loginbtn.click(function(){
        passport.login({
            accoun: $nameinput.val(),
            loginPwd: $pwdinput.val(),
            __remember: $rememberinput.is(":checked")
        }, loginCallbacks);
    });
};

module.exports = passport;