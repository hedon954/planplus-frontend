
const app = getApp()

Page({
    data: {
        username: app.data.username,
        password: app.data.password,
        userInfo: {},
        hasLoginBaidu: true,
        writeFinished: false
    },
    /**
     * 监听页面加载的生命周期函数
     */
    onLoad() {

        //先检查用户是否已经登录
        swan.request({
            url: 'https://www.hedon.wang/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                //已登录
                if(res.data.code == 1000){
                    console.log("hhhhh"+res.data)
                    //成功的话就跳转
                    swan.switchTab({
                        url: '/pages/home/home'
                    });
                    return;
                }
            }
        })

        //用户首次进入小程序，检查是否已经登录百度用户
        // this.isLoginSync();
        // if(this.data.hasLoginBaidu == false){
        //     return;
        // }


        //同步百度APP登录态
        swan.login({
            success: res => {
                this.setData({
                    hasLoginBaidu: true
                })
                console.log('login success', res);
                /**
                 * 登陆成功后要发送请求到后端，
                 * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                 * 因为发送信息需要用户的openId
                 */
                swan.request({
                    url: 'https://www.hedon.wang/project/login/getUserOpenIdAndSessionKeyAndUnionId?code='+res.code,
                    method: 'POST',
                    header:{
                        'Content-Type': 'Application/x-www-form-urlencoded',
                    },
                    responseType: 'text',
                    success: res=>{
                        console.log("百度登陆")
                        console.log(res.data)
                        if(res.data.code == 1000){
                            this.setData({
                                username: res.data.data.userUnionId,
                                password: "123456"
                            })
                            app.setIsNewUser(res.data.data.isNewUser)
                            console.log("从数据库中读取数据：isNewUser：" + res.data.data.isNewUser)
                        }
                    },
                    fail: res=>{
                        console.log(res);
                        swan.showModal({
                            title: '失败',
                            content: res
                        });
                    }
                });
            },
            fail: err => {
                console.log('login fail', err);
                this.setData({
                    hasLoginBaidu: false
                })
            }
        });
    },

    /**
     * 检查是否已登录百度APP
     */
    isLoginSync() {
        let res = swan.isLoginSync();
        if (res.isLogin) {
            this.setData({
                hasLoginBaidu: true
            })
            console.log('isLoginSync success', res);
        }
        else {
            console.log('isLoginSync fail', res.message);
            swan.showToast({
                title: '请先在百度APP登陆百度账号！',
                icon: 'none',
                duration: 3000
            });
        }
    },


    /**
     * 登录百度账号
     */
    loginBaidu(e){
        //同步百度APP登录态
        swan.login({
            success: res => {
                this.setData({
                    hasLoginBaidu: true
                })
                console.log('login success', res);
                /**
                 * 登陆成功后要发送请求到后端，
                 * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                 * 因为发送信息需要用户的openId
                 */
                swan.request({
                    url: 'https://www.hedon.wang/project/login/getUserOpenIdAndSessionKeyAndUnionId?code='+res.code,
                    method: 'POST',
                    header:{
                        'Content-Type': 'Application/x-www-form-urlencoded',
                    },
                    responseType: 'text',
                    success: res=>{
                        console.log("百度登陆")
                        console.log(res.data)
                        if(res.data.code == 1000){
                            this.setData({
                                username: res.data.data.userUnionId,
                                password: "123456"
                            })
                            app.setIsNewUser(res.data.data.isNewUser)
                            console.log("从数据库中读取数据：isNewUser：" + res.data.data.isNewUser)
                        }
                    },
                    fail: res=>{
                        console.log(res);
                        swan.showModal({
                            title: '失败',
                            content: res
                        });
                    }
                });
            },
            fail: err => {
                console.log('login fail', err);
                this.setData({
                    hasLoginBaidu: false
                })
            }
        });
    },


    /**
     * 登录操作
     */
    loginSubmit(){
        swan.showToast({
            // 提示的内容
            title: '登录中...',
            // 图标，有效值"success"、"loading"、"none"。
            icon: 'loading',
            // 提示的延迟时间，单位毫秒。
            duration: 1000,
            // 是否显示透明蒙层，防止触摸穿透。
            mask: true
        });
        console.log(this.data.username);
        console.log(this.data.password);
        swan.request({
            url: 'https://www.hedon.wang/project/login/login',
            // url: 'http://localhost:443/project/login/login',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                username: this.data.username,
                password: this.data.password
            },

            success: res => {
                console.log(res.data)
                if(res.data.code == 1000){
                    app.setAccessToken(res.data.data.access_token)
                    app.setUsername(this.data.username)
                    app.setPassword(this.data.password)
                    swan.setStorageSync("access_token",res.data.data.access_token);
                    this.setData({
                        writeFinished: true
                    })
                    console.log("写完了")
                    //成功的话就跳转
                    swan.switchTab({
                        url: '/pages/home/home'
                    });
                }
                else{
                    swan.showToast({
                        title: JSON.stringify(res.data.message)
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

    /**
     * 获取用户信息
     */
    getUserInfo(e) {
        var jump = this.data.writeFinished
        //如果是新用户，那就同步百度信息
        if(app.data.isNewUser == 1){
            swan.request({
                url: 'https://www.hedon.wang/project/user/info',
                method: 'PUT',
                header:{
                    'Authorization': 'bearer '+app.data.access_token
                },
                data:{
                    userNickname: e.detail.userInfo.nickName,
                    userAvatarUrl: e.detail.userInfo.avatarUrl
                },
                responseType: 'text',
                success:res=>{
                    console.log(res)
                    if(res.data.code == 1000){
                        console.log("同步用户百度信息成功")

                    }

                }
            })
        }
        //成功的话就跳转
        swan.switchTab({
            url: '/pages/home/home'
        });

    },

    /**
     * 绑定手机号输入框
     */
    bindPhoneNumberInput(e){
        this.setData({
            username: e.detail.value
        })
    },

    /**
     * 绑定密码输入框
     */
    bindPasswordInput(e){
        this.setData({
            password: e.detail.value
        })
    },


    /**跳转到注册页面 */
    jumpToRegister:function(){
        swan.navigateTo({
            url:'../../pages/register/register'
        });
    },

    /**跳转到找回密码界面 */
    jumpToForgotPassword:function(){
        swan.navigateTo({
            url:'../../pages/forgot-password/forgot-password'
        });
    },


    /**
     * 睡眠
     */
    sleep: function(numberMillis) {
        let now = new Date();
        var exitTime = now.getTime() + numberMillis
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
            return;
        }
    }
});