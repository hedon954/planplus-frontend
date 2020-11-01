/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 页面加载
     */
    onLoad(options) {
        console.log(options);
        //先检查是否有登录
        if(options.userId == undefined || options.userId == null){
            //没有登录就提示信息，并跳转到登录界面
            swan.showModal({
                title: '未登录',
                content: '请先登录！'
            });
            swan.redirectTo({
                url: '/pages/login/login'
            });
        }else{
            //有登录的话就拿出 id，查询用户信息
            const userId = options.userId;
            swan.request({
                url: 'http://182.61.131.18:10030/project/user/'+ userId,
                header: {
                    'content-type': 'application/json'
                },
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: res => {
                    console.log('request success', res);
                    this.setData({
                        userInfo: res.data.data
                    })
                },
                fail: err => {
                    swan.showToast({
                        title: JSON.stringify(err)
                    });
                    console.log('request fail', err);
                }
            });
        }

        // 监听页面加载的生命周期函数


    },
    getUserInfo(e) {

        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
})
