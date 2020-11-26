const app = getApp();

Page({
    data: {
        content: "",
        email: ""
    },

    /**
     * 发送反馈
     */
    feedback:function(){
        if(this.data.content == ""){
            swan.showModal({
                // 提示的标题
                title: '反馈失败',
                // 提示的内容
                content: '请输入反馈内容后再进行反馈！',
                // 是否显示取消按钮 。
                showCancel: false,
                // 确定按钮的文字，最多 4 个字符。
                confirmText: '确定',
            });
            return;
        }
        swan.request({
            url: 'http://localhost:9527/project/mail/feedback',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                content: this.data.content,
                email: this.data.email
            },
            success: res=>{
                if(res.data.code == 1000){
                    swan.showToast({
                        // 提示的内容
                        title: '谢谢您的反馈！',
                        // 图标，有效值"success"、"loading"、"none"。
                        icon: 'success',
                        // 提示的延迟时间，单位毫秒。
                        duration: 1000,
                        mask: false
                    });
                }else{
                    swan.showToast({
                        // 提示的内容
                        title: res.data.message,
                        // 图标，有效值"success"、"loading"、"none"。
                        icon: 'none',
                        // 提示的延迟时间，单位毫秒。
                        duration: 100,
                        // 是否显示透明蒙层，防止触摸穿透。
                        mask: false
                    });
                }
            },
            fail: err=>{
                swan.showToast({
                    title: JSON.stringify(err)
                });
            }
        });
    },


    /**
     * 获取反馈信息
     */
    feedbackContentInput:function(e){
        this.setData({
            content: e.detail.value
        })
    },

    /**
     * 获取反馈者邮箱
     */
    feedbackEmailInput:function(e){
        this.setData({
            email: e.detail.value
        })
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