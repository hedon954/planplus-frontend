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
        swan.setPageInfo({
            title: '任务总览——PlanPlus时间管理大师',
            keywords: 'PlanPlus,时间管理,待办,所有任务,任务列表,任务总览',
            description: '该界面提供的是对所创建任务的一个总览功能，可以查看所有任务也可以查看所有的待办以及草稿箱',
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
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 10) +" "+response[i]['taskStartTime'].substring(11, 16);
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
     * 获取任务
     */
    getTasksByActiveName: function(param) {
        swan.request({
            url: 'https://www.hedon.wang/project/task/' + param,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    for(var i = 0; i < response.length; i++) {
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 10) +" "+response[i]['taskStartTime'].substring(11, 16);
                    };
                    this.setData({
                        tasks: null
                    });
                    this.setData({
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
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 10) +" "+response[i]['taskStartTime'].substring(11, 16);
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

    //跳转至详情页
    jumpToDetail: function(e) {
        console.log("跳转至详情页");
        let taskId = e.currentTarget.id;
        console.log(taskId);
        // let cpn = this.selectComponent(`#${e.currentTarget.id}`); //组件id不能是纯数字
        // console.log(cpn);
        swan.navigateTo({
            url: `/pages/modification/modification?taskId=${e.currentTarget.id}`
        });
    },


    //删除任务
    delete: function(e) {
        console.log("删除任务：" + JSON.stringify(e))
        console.log("删除任务：" + this.data.activeName);
        var taskId = e.target.id;
        console.log("要删除的id：" + taskId)
        //弹出模态框，待用户确认操作
        swan.showModal({
            title: '温馨提示',
            content: '您即将删除该任务',
            success: res => {
                //点击确定后，删除任务
                if(res.confirm) {
                    swan.request({
                        url: 'https://www.hedon.wang/project/task/delete/' + taskId,
                        method: 'DELETE',
                        header: {
                            'Authorization': 'bearer ' + app.data.access_token
                        },
                        success: res => {
                            if(res.data.code == 1000) {
                                swan.showToast({
                                    title: '已删除',
                                    icon: 'success',
                                    duration: 1000,
                                });
                            }else{
                                swan.showToast({
                                    title: '删除失败',
                                    icon: 'none',
                                    duration: 1000,
                                });
                            }
                        },
                        fail: res =>{
                            swan.showToast({
                                title: res,
                                icon: 'none',
                                duration: 1000,
                            });
                        },
                        complete: res =>{
                            this.getTasksByActiveName(this.data.activeName);
                        }
                    });
                }
            },
        });
    },

});