const app = getApp();

Page({
    data: {
        tasks: [], //任务列表
        activeName: 'all', //当前选中的tab-item名称
        isToday:false,
        /**
         * 单个任务属性
         */
        taskId: null,
        taskContent: "天上公鸡叫",
        taskPlace: "妈妈地上跑",
        taskRate: 2,
        taskStartTime: "2020-11-12T12:56:00.826000",
        taskPredictedFinishTime: "2020-11-12T13:30:24.826000",
        taskAdvanceRemindTime: 10,

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.getAllTasks();
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
    },



    /**
     * 获取任务
     */
    getTasks: function(e) {
        swan.request({
            url: 'https://www.hedon.wang/project/task/' + e.detail.name,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    for(var i = 0; i < response.length; i++) {
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 16);
                    }
                    this.setData({
                        activeName: e.detail.name,
                        tasks: response
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

    /**
     * 获取所有任务
     */
    getAllTasks: function() {
        swan.request({
            url: 'https://www.hedon.wang/project/task/all',
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    for(var i = 0; i < response.length; i++) {
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 16);
                    }
                    this.setData({
                        activeName: "all",
                        tasks: response
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

});