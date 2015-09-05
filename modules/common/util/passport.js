/**
 * @function : 登陆
 * @author : ZY
 */
var $ = require("jquery");


require("cookie");

Function.prototype.bindFunc = function(pObject) {
    if (typeof(pObject) != "object") {
        return false;
    }
    var __method = this;
    return function() {
        return __method.apply(pObject, arguments);
    }
};

var passport = {
    version:0.1,
    username: false,    //用户名input
    pwd: false, //密码input
    pcInput: false, //记录密码input
    doLogin: function() {
        // 必须判断一下，避免连续两次点击
        // if (this.eInterval)
        //     return;

        return this.loginHandle(this.username, this.pwd,this.loginFailCall.bindFunc(this), this.loginSuccessCall.bindFunc(this));
    },
    /**
     *登陆接口
     * @param loginInfo {object}
     * loginInfo.account    用户名
     * loginInfo.loginPwd   登录密码
     * loginInfo.deviceId       (可选) 设备唯一标识
     * loginInfo.deviceModel    (可选) 设备型号，如iPhone
     * loginInfo.systemVersion  (可选) 系统版本，如8.1
     * loginInfo.deviceToken    (可选) 推送的token
     * loginInfo.resolution     (可选) 设备分辨率，如1242*2208
     */
    loginHandle:function(username, pwd, lfc, lsc){
        debugger;
        var loginInfo = {
            'accoun':username,
            'loginPwd':pwd,
            'appVersion':0.1,
            'source':'web',
            'deviceId':"",
            'deviceModel':"",
            'systemVersion':"",
            'deviceToken':"",
            'resolution':""
        }

        $.ajax({
            url:"/api/user/login",
            type:"POST",
            data:loginInfo,
            dataType:"json",
            success:function(_ret){
                debugger;
                if(_ret.code == "0"){
                    //登陆成功
                    $.extend(loginInfo, _ret.data.result);
                    saveLoginInfo(loginInfo);
                    lsc(loginInfo);

                }else{
                    lfc(loginInfo);
                }
            },
            error:function(a,b,c){
                //请求失败
                lfc(loginInfo);
            }
        });
    },
    loginFailCall:function(){

    },
    //登陆成功后的回调函数
    loginSuccessCall:function(loginResult){
        //种入cookie
        this.saveLoginInfo(loginResult);

        //判断是否跳转
    },
    /**
    * 将登陆成功之后的信息以cookie形式保存
    * @param userinfo {object}
    */
    saveLoginInfo:function (userinfo) {

        if(!userinfo){
            return;
        }

        var options = { path: '/' };
        if(this.pcInput){
            options.expires=7;
        }

        for(var key in userinfo){
            if(userinfo.hasOwnProperty(key)){
                $.cookie(key, userinfo[key], options);
            }
        }

    },
    /**
     * 获取用户登陆后保存的信息
     * @param key {String}
     * @returns {String}
     */
    getUserInfoItem:function(key){
        return $.cookie(key);
    }
};

module.exports = passport;