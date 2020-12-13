Page({
    data: {
        btns: ['所有任务', '使用帮助', '反馈'],
        opts: ['goToAllTask', 'goToHelpPage', 'goToFeedback'],
      },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        console.log('加载。。。');
        swan.showModal({
            // 提示的标题
            title: '加载',
        });
    },

    onPullDownRefresh: function() {
        // 监听用户下拉动作
        swan.startPullDownRefresh({
            success: res => {
                swan.showNavigationBarLoading();
                this.onLoad();
                setTimeout(() => {
                    swan.hideNavigationBarLoading();
                    swan.stopPullDownRefresh();
                }, 1000);
            },
            fail: res => {
                swan.showToast({
                    // 提示的内容
                    title: '刷新失败',
                    // 图标，有效值"success"、"loading"、"none"。
                    icon: 'none',
                    duration: 2000,
                });
            },
        });
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },

    goToAllTask: function() {
        console.log('所有任务');
    },

    goToHelpPage: function() {
        console.log('使用帮助');
    },

    goToFeedback: function() {
        console.log('反馈');
    },

    logout: function() {
        console.log('退出登录');
    }
});