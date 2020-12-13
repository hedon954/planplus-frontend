
const app = getApp()

Page({
    data: {
        username: app.data.username,
        password: app.data.password,
        userInfo: {},
        hasLoginBaidu: true,
        writeFinished: false,
        canIUseLoginButton: true
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

        // 判断是否可以通过 button 配置 open-type 进行登录
        if (!swan.canIUse('button.open-type.login')) {
            console.log("不可以使用 open-type 的 login")
            this.setData({
                canIUseLoginButton: false
            });
        }

        //用户首次进入小程序，检查是否已经登录百度用户
        this.isLoginSync();
        if(this.data.hasLoginBaidu == false){
            return;
        }

        /**
         * 获取 Login Code
         */
        if(this.data.canIUseLoginButton){
            swan.getLoginCode({
                success: res => {
                    this.setData({
                        hasLoginBaidu: true,
                    })
                    console.log('open-type:login success', res);
                    /**
                     * 登陆成功后要发送请求到后端，
                     * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                     * 因为发送信息需要用户的openId
                     */
                    this.sendLoginCodeToBack(res.code)
                }
            })
        }else{
            swan.login({
                success: res => {
                    this.setData({
                        hasLoginBaidu: true,
                    })
                    console.log('swan.login success', res);
                    /**
                     * 登陆成功后要发送请求到后端，
                     * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                     * 因为发送信息需要用户的openId
                     */
                    this.sendLoginCodeToBack(res.code)
                }
            });
        }


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
            this.setData({
                hasLoginBaidu: false
            })
            swan.showToast({
                title: '请先在百度APP登陆百度账号！',
                icon: 'none',
                duration: 3000
            });

        }
    },

    /**
     * 登陆成功后要发送请求到后端，
     * 利用这个仅有10s有效期的code去获取openId和sessionKey，
     * 因为发送信息需要用户的openId
     */
    sendLoginCodeToBack: function(param){
        swan.request({
            url: 'https://www.hedon.wang/project/login/getUserOpenIdAndSessionKeyAndUnionId?code='+param,
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


    /**
     * 登录百度账号
     */
    loginBaidu(e){
        if (swan.canIUse('getLoginCode')) {
            swan.getLoginCode({
                success:res =>{
                    this.setData({
                        hasLoginBaidu: true
                    })
                    console.log('login success', res);
                    /**
                     * 登陆成功后要发送请求到后端，
                     * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                     * 因为发送信息需要用户的openId
                     */
                    this.sendLoginCodeToBack(res.code)
                },
                fail: err => {
                    console.log('login fail', err);
                    this.setData({
                        hasLoginBaidu: false
                    })
                }
            })
        }
        else {
            swan.login({
                success:res =>{
                    this.setData({
                        hasLoginBaidu: true
                    })
                    console.log('login success', res);
                    /**
                     * 登陆成功后要发送请求到后端，
                     * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                     * 因为发送信息需要用户的openId
                     */
                    this.sendLoginCodeToBack(res.code)
                },
                fail: err => {
                    console.log('login fail', err);
                    this.setData({
                        hasLoginBaidu: false
                    })
                }
            })
        }
    },


    /**
     * 登录操作
     */
    loginSubmit(){
        swan.showToast({
            title: '登录中...',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        this.sleep(500);
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
    },

    onShow:function(){
        swan.setPageInfo({
            title: '登录界面——PlanPlus时间管理大师',
            keywords: 'PlanPlus,时间管理,登录,信息同步',
            description: '本应用的登录界面',
            releaseDate: '',
            image: ['../../images/planplus.png'],
            video: ''
        });
    }
});