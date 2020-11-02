Page({
    data: {
        tasks: []
    },

    login: function() {
        swan.request({
            url: 'http://localhost:10030/project/task/today',
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + this.data.access_token
            },
            success: res => {
                try {
                    swan.showModal({
                        title: '请求到的数据',
                        content: JSON.stringify(res.data),
                        showCancel: false
                    });
                    this.setData({tasks: res.data});
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

    getTasks: function(e) {
        swan.request({
            url: 'http://localhost:10030/project/task/' + e.detail.name,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + this.data.access_token
            },
            success: res => {
                try {
                    swan.showModal({
                        title: '请求到的数据',
                        content: JSON.stringify(res.data),
                        showCancel: false
                    });
                    this.setData({activeName: e.detail.name
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
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
