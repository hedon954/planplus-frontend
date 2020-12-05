const app = getApp()

Page({

    data: {
        username: app.data.username,
        password: app.data.password,
        userInfo: {},
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


        // 用户首次进入小程序，同步百度APP登录态
        swan.login({
            success: res => {
                console.log('login success', res);

                // 获取用户手机号或用户信息
                // 待补

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
                            swan.showModal({
                                title: '成功',
                                content: res
                            });
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
            }
        });


    },

    /**
     * 登录操作
     */
    loginSubmit(){
        console.log(this.data.username);
        console.log(this.data.password);
        swan.request({
            url: 'https://www.hedon.wang/project/login/login',
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




    getuserinfo(e) {
        console.log(e)
        if (e.detail.encryptedData) {
            swan.showModal({
                title: '获取成功',
                content: JSON.stringify(e)
            });
        }
        else {
            swan.showModal({
                title: '获取失败',
                content: JSON.stringify(e)
            });
        }
    }
});