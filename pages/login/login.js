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
        swan.request({
            url: 'http://182.61.131.18:10030/project/user/login?phoneNumber='+this.data.phoneNumber + '&password='+this.data.password,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                // phoneNumber: "15623205156",
                // password: "hedon"
            },
            success: res => {
                console.log('request success', res);

                //成功的话就跳转
                swan.redirectTo({
                    url: '/pages/user-info/user-info?userId='+res.data.data.userId
                });
                // swan.showModal({
                //     title: '请求到的数据',
                //     // content:res.code,
                //     content: JSON.stringify(res.data),
                //     showCancel: true
                // });
            },
            fail: err => {
                swan.showToast({
                    title: JSON.stringify(err)
                });
                console.log('request fail', err);
            },
            // complete: () => {
            //     this.setData('loading', false);
            // }
        });
    },

    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    }
});