
const app = getApp()

Page({
    data: {
        username: app.data.username,
        password: app.data.password,
        userInfo: {},
    },
    onLoad() {
        // 监听页面加载的生命周期函数
        //先检查用户是否已经登录
        swan.request({
            url: 'https://www.hedon.wang/project/login/checkLogin',
            // url: 'http://localhost:443/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                console.log(res);
                console.log("ssssssssssss" + typeof res.data.code)
                //已登录
                if(res.data.code == 1000){
                    console.log("hhhhh"+res.data)
                    //成功的话就跳转
                    swan.switchTab({
                        url: '/pages/home/home'
                    });
                }
            }
        })
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

    /**
     * 登录操作
     */
    loginSubmit(){
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
});