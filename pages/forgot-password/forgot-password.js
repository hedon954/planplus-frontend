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

    onLoad: function () {
        // 监听页面加载的生命周期函数
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