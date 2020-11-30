const app = getApp();

Page({
    data: {
        promptText: '获取验证码',
        countDown: 60,
        username:"",
        identificationCode:"",
        password:"",
        confirmPwd:"",
    },

    getVerificationCode: function() {

        this.setData('promptText', this.data.countDown + '秒后重新获取');

        this.interval = setInterval(() => {
            if(this.count(this.data.countDown) <= 0) {
                this.interval && clearInterval(this.interval);
            }
        }, 1000);

    },

    count: function(n) {
        n -= 1;
        this.setData('countDown', n);
        if(n <= 0) {
            this.setData({
                promptText: '获取验证码',
                countDown: 60
            });
            return 0;
        }
        this.setData('promptText', this.data.countDown + '秒后重新获取');
        return n;
    },

    /**
     * 用户名：手机或邮箱
     */
    bindUsernameInput(e) {
        this.setData({
            username: e.detail.value
        });
    },

    /**
     * 验证码
     */
    bindIdentificationCodeInput(e) {
        this.setData({
            identificationCode: e.detail.value
        });
    },

    /**
     * 密码
     */
    bindPasswordInput(e) {
        this.setData({
            password: e.detail.value
        });
    },

    /**
     * 确认密码
     */
    bindConfirmPasswordInput(e){
        this.setData({
            confirmPwd: e.detail.value
        });
    },

    registerComfirm:function(){
        swan.request({
            url: 'http://localhost:9527/project/login/registerByPhoneAndPwd',
            method: 'POST',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            data:{
                phoneNumber:this.data.phoneNumber,
                password:this.data.password,
            },
            responseType: 'text',
            success:res=>{
                console.log("注册成功");
                if(res.data.code == 1000){
                    swan.showToast({
                    title: '注册成功'
                    })
                }
                else{
                    swan.showToast({
                        title: '注册失败'
                    })
                }
                this.setData({
                    phoneNumber:"",
                    password:"",
                    identificationCode:"",
                })
            }
        });
    }

});