
const app = getApp()

Page({
    data: {
        phoneNumber: "15623205156",
        password: "hedon",
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo')
    },
    onLoad() {
        // 监听页面加载的生命周期函数
    },

    /**
     * 绑定手机号输入框
     */
    bindPhoneNumberInput(e){
        this.setData({
            phoneNumber: e.detail.value
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
        console.log(this.data.phoneNumber);
        console.log(this.data.password);
        swan.switchTab({
            url: '/pages/home/home'
        }),
        swan.request({
            url: 'http://localhost:9527/project/login/login',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                phoneNumber: this.data.phoneNumber,
                password: this.data.password
            },

            success: res => {
                console.log(res.data)
                if(res.data.code == 1000){
                    app.setAccessToken(res.data.data.access_token)
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
});