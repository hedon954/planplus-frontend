/**
 * 实例化  app
 */
const app = getApp();

/**
 * 当前页面
 */
Page({

    /**
     * 数据
     */
    data:{

    },

    /**
     * 页面加载
     */
    onLoad() {
        //先检查用户是否已经登录
        swan.request({
            url: 'http://10.133.171.1:9527/project/login/checkLogin',
            // url: 'http://182.61.131.18:9527/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                console.log(res);
                //已登录
                if(res.data.code == '1000'){
                    console.log("hhhhh"+res.data)
                }else{
                    //未登录
                    swan.showModal({
                        // 提示的标题
                        title: '身份过期',
                        // 提示的内容
                        content: '身份过期，请先登录！',
                        // 是否显示取消按钮 。
                        showCancel: false,
                    });
                    // 跳转到登录界面
                    swan.redirectTo({
                        url: '/pages/login/login'
                    })
                }
            },
            fail: res => {
                 //未登录
                 swan.showModal({
                    // 提示的标题
                    title: '身份过期',
                    // 提示的内容
                    content: '身份过期，请先登录！',
                    // 是否显示取消按钮 。
                    showCancel: false,
                });
                // 跳转到登录界面
                swan.redirectTo({
                    url: '/pages/login/login'
                })
            }
        });

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
                    url: 'http://10.133.171.1:9527/project/user/getUserOpenIdAndSessionKey?code='+res.code,
                    method: 'POST',
                    header:{
                        'Content-Type': 'Application/x-www-form-urlencoded',
                        'Authorization': 'bearer ' + app.data.access_token
                    },
                    responseType: 'text',
                    success: res=>{
                        console.log(res);
                        swan.showModal({
                            title: '成功',
                            content: res
                        });
                        this.setData({
                            hasLogin: 'yes'
                        })
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
     * 页面显示
     */
    onShow() {
        // 用户进入小程序检测小程序在手百的登陆态是否有效
        swan.checkSession({
            success: res => {
                console.log('用户的登陆态有效', res);
            },
            fail: err => {
                // 小程序的登陆态失效，需要再次登录
                swan.login({
                    success: res => {
                        console.log('login success', res);
                        /**
                         * 登陆成功后要发送请求到后端，
                         * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                         * 因为发送信息需要用户的openId
                         */
                        swan.request({
                            url: 'http://10.133.171.1:9527/project/user/getUserOpenIdAndSessionKey?code='+res.code,
                            method: 'POST',
                            header:{
                                'Content-Type': 'Application/x-www-form-urlencoded',
                                'Authorization': 'bearer ' + app.data.access_token
                            },
                            responseType: 'text',
                            success: res=>{
                                console.log(res);
                                swan.showModal({
                                    title: '成功',
                                    content: res
                                });
                                this.setData({
                                    hasLogin: 'yes'
                                })
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
            }
        });
    },


    /**
     * 临时方法：跳转到 home 界面
     * 后面会删掉
     */
    jumpToHome(e){
        swan.navigateTo({
            url: '/pages/home/home'
        });
    },

    formSubmit(e) {
        console.log(e)
        swan.showModal({
            title: '表单数据',
            content: JSON.stringify(e.detail.message) + '/' +JSON.stringify(e.detail.status),
            confirmText: '确定',
            showCancel: false
        });
    }
});
