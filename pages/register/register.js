const app = getApp();

Page({
    data: {
        promptText: '获取验证码',
        countDown: 60,
        username:"",
        ban: "",
        identificationCode:"",
        password:"",
        confirmPwd:"",
    },

    /**
     * 检查两次密码是否相同
     */
    checkPwd: function(){
        if(this.data.password == this.data.confirmPwd){
            console.log("两次密码一致");
            return true;
        }else{
            console.log("两次密码不一致");
            return false;
        }
    },

    /**
     * 获取验证码
     */
    getVerificationCode() {
        //检查邮箱是否为空
        if(this.data.username.trim() == ""){
            swan.showToast({
                title: '用户名不能为空',
                icon: 'none',
                image: '',
                duration: 2000,
            });
            return;
        }

        //检查密码是否为空
        if(this.data.password.trim() == ""){
            swan.showToast({
                title: '密码不能为空',
                icon: 'none',
                image: '',
                duration: 2000,
            });
            return;
        }
        //判断两次密码是否一致
        if(!this.checkPwd()){
            swan.showToast({
                title: '两次密码不一致',
                icon: 'none',
                image: '',
                duration: 2000,
            });
            return;
        }



        //发送请求，获取验证码
        swan.request({
            url: 'http://localhost:443/project/code/register',
            method: 'POST',
            data:{
                username:this.data.username,
                password:this.data.password,
            },
            responseType: 'text',
            success:res=>{
                if(res.data.code == 1000){
                    swan.showToast({
                        title: '请查收验证码',
                        icon: 'none',
                        image: '',
                        duration: 2000,
                    })


                    //60秒不能重新发送
                    this.setData({
                        promptText:this.data.countDown + '秒后重新获取',
                        ban: "disabled"
                    });

                    this.interval = setInterval(() => {
                        if(this.count(this.data.countDown) <= 0) {
                            this.interval && clearInterval(this.interval);
                        }
                    }, 1000);

                }
                else{
                    swan.showToast({
                        title: res.data.message,
                        icon: 'none',
                        image: '',
                        duration: 2000,
                    })
                }

            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
        });

    },

    count: function(n) {
        n -= 1;
        this.setData('countDown', n);
        if(n <= 0) {
            this.setData({
                promptText: '获取验证码',
                countDown: 60,
                ban: ""
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
            url: 'http://localhost:443/project/login/register',
            method: 'POST',
            data:{
                username:this.data.username,
                password:this.data.password,
                code: this.data.identificationCode
            },
            responseType: 'text',
            success:res=>{
                console.log("注册成功");
                if(res.data.code == 1000){

                    swan.showToast({
                        title: '注册成功',
                        icon: 'success',
                        image: '',
                        duration: 2000,
                    })
                }
                else{
                    swan.showToast({
                        title: res.data.message,
                        icon: 'none',
                        image: '',
                        duration: 2000,
                    })
                }
            }
        });
    }

});