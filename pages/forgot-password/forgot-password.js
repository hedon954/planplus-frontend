Page({
    data: {
        promptText: '获取',
        countDown: 60,
        username:"",
        ban: "",
        identificationCode:"",
        password:"",
        confirmPwd:"",
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


        //发送请求，获取验证码
        swan.request({
            // url: 'http://localhost:443/project/code/getPasswordBack',
            url: 'https://www.hedon.wang/project/code/getPasswordBack',
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
                        icon: 'success',
                        image: '',
                        duration: 2000,
                    })


                    //60秒不能重新发送
                    this.setData({
                        promptText:this.data.countDown + 's',
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
                promptText: '获取',
                countDown: 60,
                ban: ""
            });
            return 0;
        }
        this.setData('promptText', this.data.countDown + 's');
        return n;
    },


    /**
     * 设置新密码
     */
    getPasswordBack:function(){

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

        swan.request({
            // url: 'http://localhost:443/project/login/register',
            url: 'https://www.hedon.wang/project/login/getPasswordBack',
            method: 'POST',
            data:{
                username:this.data.username,
                password:this.data.password,
                code: this.data.identificationCode
            },
            responseType: 'text',
            success:res=>{
                console.log(res.data)
                console.log("修改密码成功");
                if(res.data.code == 1000){

                    swan.showToast({
                        title: '修改密码成功',
                        icon: 'success',
                        image: '',
                        duration: 2000,
                    })

                    //跳回到登录界面
                    swan.navigateBack({
                        // 返回的页面数，如果 delta 大于现有页面数，则返回到首页1。
                        delta: 0,
                    });

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