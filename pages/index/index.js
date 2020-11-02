/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        currentUserId: null,
        access_token: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 页面加载
     */
    onLoad(options) {
        console.log("options:"+options.access_token)
        //检查是否已经登录
        swan.request({
            url: 'http://localhost:9527/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+options.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                console.log(res);
                //已登录
                if(res.data.code == '1000'){
                    //设置当前用户ID
                    this.setData({
                        currentUserId: res.data.data,
                        access_token: options.access_token
                    })
                    console.log("hhhhh"+res.data)
                    //读取当前用户数据
                    swan.request({

                        url: 'http://localhost:9527/project/user/info',
                        method: 'GET',
                        header:{
                            'Authorization': 'bearer '+this.data.access_token
                        },
                        responseType: 'text',
                        success: res => {
                            console.log(res);
                            //已登录
                            if(res.data.code == '1000'){
                                //设置当前用户ID
                                this.setData({
                                    userInfo: res.data.data
                                })
                            }
                        },
                    })
                    console.log("当前用户ID："+this.data.currentUserId)
                    console.log("当前用户信息："+this.data.userInfo)
                    console.log("当前token:"+this.data.access_token)
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
            }
        })

    },
})
