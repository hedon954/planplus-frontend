const app = getApp();

Page({
    data: {

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        swan.setPageInfo({
            title: '帮助页面——PlanPlus时间管理大师',
            keywords: '帮助,PlanPlus,时间管理,介绍,简介',
            description: '这是一个使用帮助界面，对该小程序的的功能和操作进行了简略的介绍，能够帮助用户更好的理解和使用它',
            releaseDate: '',
            image: '',
            video: ''
        });
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