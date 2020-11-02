const app = getApp();

Page({
    data: {
        tasks: [],
        activeName: '',
        hours: '',
        minutes: '',
        seconds: ''
    },

    onLoad: function() {
        swan.request({
            url: 'http://localhost:9527/project/task/today',
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    //防止引用被修改
                    response = JSON.parse(JSON.stringify(response));
                    var startTimeString = '';
                    for(var i = 0; i < response.length; i++) {
                        startTimeString = response[i]['taskStartTime'].substring(11, 19);
                        response[i]['taskStartTime'] = startTimeString;
                    }
                    this.setData({tasks: response});
                    console.log("hhhhhhhhhhhhhhhhh");
                    // console.log(res.data.data[0]['taskStartTime'].replace('T', ' '));
                    console.log(res.data.data[0]['taskStartTime'].replace('T', ' ').substring(0, 19));
                    // setTimeout(this.countDown(res.data.data[0]['taskStartTime'].substring(0, 19)), 1000);
                    this.countDown(res.data.data[0]['taskStartTime'].substring(0, 19));

                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

    getTasks: function(e) {
        swan.request({
            url: 'http://localhost:9527/project/task/' + e.detail.name,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + this.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    for(var i = 0; i < response.length; i++) {
                        response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(11, 19);
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

    // 倒计时
    countDown: function(endTimeSting) {
        console.log("进来了。。。")
        var that=this;
        var nowTime = new Date().getTime();//现在时间（时间戳）
        var endTime = new Date(endTimeSting).getTime();//结束时间（时间戳）
        var time = (endTime-nowTime)/1000;//距离结束的毫秒数
        // 获取时、分、秒
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 50 * 24) % 3600 % 60);
        // console.log(hou + "," + min + "," + sec)
        hou = that.timeFormin(hou);
        min = that.timeFormin(min);
        sec = that.timeFormin(sec);
        that.setData({
          hours: that.timeFormat(hou),
          minutes: that.timeFormat(min),
          seconds: that.timeFormat(sec)
        });
        // // 每1000ms刷新一次
        // setTimeout(this.countDown(endTimeSting), 1000);
        if(time>0) {
            setTimeout(this.countDown(endTimeSting), 1000);
        }
        console.log("出去了。。。")
    },
    //小于10的格式化函数（2变成02）
    timeFormat: function(param) {
        return param < 10 ? '0' + param : param;
    },
    //小于0的格式化函数（不会出现负数）
    timeFormin: function(param) {
        return param < 0 ? 0: param;
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
