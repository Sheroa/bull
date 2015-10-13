/**
 * @function : 登陆
 * @author : ZY
 */
var $ = require("jquery"),
    data_transport = require('common/core_data'),
    api = require('api/api'),
    K = require("./Keeper");

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
    pcInput: false, //记录密码input,
    loginMsg:false,
    loginRedirectUrl:'',
    doLogin: function() {
        // 必须判断一下，避免连续两次点击
        // if (this.eInterval)
        //     return;
        var tmp = this.getParm("return_to");
        if(tmp){
            this.loginRedirectUrl = tmp;
        }else{

            if(location.href.indexOf("index.html")>0){
                this.loginRedirectUrl = '/index.html';
            }else{
                this.loginRedirectUrl = '/my/personCenter.html';
            }

        }
        return this.loginHandle(this.username, this.pwd,this.loginFailCall.bindFunc(this), this.loginSuccessCall.bindFunc(this));
    },
    doLogout:function(){

        var user_info =  JSON.parse($.cookie('ppinf')),
            user_id = user_info.userId,
            user_token = user_info.token;

        $.extend(data_transport, {
            "userId":user_id,
            "token":user_token
        });

        require('api/api').call('/api/user/logout',data_transport,function(_rel){
            var options = {path:'/'};
            $.cookie("ppinf","",options);
            location.reload(true);
        });
        
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
        var loginInfo = {
            'account':username,
            'loginPwd':pwd,
            'appVersion':0.1,
            'source':'web',
            'deviceId':"",
            'deviceModel':"",
            'systemVersion':"",
            'deviceToken':"",
            'resolution':""
        },
        self = this;

        api.call('/api/user/login',loginInfo,function(_rel){
            lsc(_rel.result);
        },function(_rel){
            lfc(_rel.msg);
        });
    },
    loginFailCall:function(msg){
        this.showMsg(msg);
    },
    //登陆成功后的回调函数
    loginSuccessCall:function(loginResult){

        var self = this;

        //清空错误信息
        this.showMsg("");

        //种入cookie
        this.saveLoginInfo(loginResult);

        //判断是否跳转
        if (this.loginRedirectUrl != "") {
            //如果是自动跳转，需要判断是否是mail登录用户，然后判断本域的用户登录
            if (document.location.href == this.loginRedirectUrl) {
                document.location.reload();
            } else {
                self.gotohref(this.loginRedirectUrl);
            }
        } else {
            //不需要自动跳转，就画卡片 Cookie验证成功后再生成下面的服务文字
            // this.getBottomRow();
            // this.drawPassportCard();
            // //同时重绘其它的卡片
            // for (i = 0; i < PassportCardList.length; i++) {
            //     if (i == this.curCardIndex) {
            //         continue;
            //     }
            //     PassportCardList[i].parsePassportCookie();
            //     PassportCardList[i].getBottomRow();
            //     PassportCardList[i].drawPassportCard();
            // }
        }
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
        $.cookie("ppinf", JSON.stringify(userinfo), options);

        // for(var key in userinfo){
        //     if(userinfo.hasOwnProperty(key)){
        //         $.cookie(key, userinfo[key], options);
        //     }
        // }

    },
    /**
     * 获取用户登陆后保存的信息
     * @param key {String}
     * @returns {String}
     */
    getUserInfoItem:function(key){
        return $.cookie("ppinf")[key];
    },
    showMsg: function(msg) {
        if (!this.loginMsg)
            return;
        this.loginMsg.html(msg);
    },
    getParm: function(o) {
        var params, url = window.location.toString();
            var arr = url.split("?"),
                parms = arr[1],
                params = null;
            if (parms && parms.indexOf("&")) {
                params = {};
                var parmList = parms.split("&");
                $.each(parmList, function(key, val) {
                    if (val && val.indexOf("=")) {
                        var parmarr = val.split("=");
                        if ($.type(o) == "string" && o == parmarr[0]) {
                            params = parmarr[1] == null ? '' : parmarr[1];
                            return params;
                        } else {
                            params[parmarr[0]] = parmarr[1];
                        }
                    }
                });
            }
        return params;
    },

};

window.passport = passport;

module.exports = passport;