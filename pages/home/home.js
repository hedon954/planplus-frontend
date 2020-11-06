const app = getApp();

Page({
    data: {
        tasks: [], //任务列表
        activeName: '', //当前选中的tab-item名称
        endTimeList: [], //定时器结束时间——即各任务开始时间
        countDownList: [], //倒计时时间
        maxTimeLeft: 0 //各个任务中倒计时剩余的最大值
    },

    onLoad: function() {
        swan.request({
            url: 'http://localhost:9527/project/task/today',
            // url: 'http://10.133.171.1:9527/project/task/today',
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
                    var startTimeList = []; //临时存放定时器结束时间，即任务开始时间
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 19);
                        response[i]['taskStartTime'] = startTimeString;
                    }
                    this.setData({
                        tasks: response,
                        endTimeList: startTimeList
                    });

                    //每隔一秒刷新倒计时，直至所有倒计时都为0
                    // let tmp = 0;
                    // while(this.data.maxTime>0){
                    //     tmp = setTimeout(this.getTimeSpan(this.data.endTimeList), 1000);
                    //     this.setData({maxTimeLeft: tmp});
                    // }

                    console.log("回来了。。。")
                    console.log(this.data.countDownList);
                    // this.countDown();
                    // setTimeout(this.countDown, 1000);
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    getTasks: function(e) {
        swan.request({
            url: 'http://localhost:9527/project/task/' + e.detail.name,
            // url: 'http://10.133.171.1:9527/project/task/' + e.detail.name,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
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

                    //如果为今天，则显示倒计时；如果为明天，则不显示
                    // if(e.detail.name == 'today') {
                    //     let tmp = 0;
                    //     while(this.data.maxTime>0){
                    //         tmp = setTimeout(this.getTimeSpan(this.data.endTimeList), 1000);
                    //         this.setData({maxTimeLeft: tmp});
                    //     }
                    // }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },


    // 获取时间差
    getTimeSpan: function(list) {
        console.log("进来了。。。")
        let nowTime = new Date().getTime();//现在时间（时间戳）
        // let list = this.data.endTimeList;
        let tmpList = []; //临时存放倒计时列表中的各个元素
        let maxTime = 0;
        for(var i = 0; i < list.length; i++) {
            console.log("进入循环。。。")
            let endTime = new Date(list[i]).getTime();//结束时间（时间戳）
            let time = endTime - nowTime;//剩余时间，以毫秒为单位
            let formatTime = this.timeFormat(time);
            tmpList.push(formatTime.hh + ':' + formatTime.mm + ':' + formatTime.ss);
            console.log("跳出循环。。。")
            maxTime = time > maxTime? time: maxTime;
        }
        console.log("结束循环。。。")
        this.setData({
            countDownList: tmpList
        });
        return maxTime;
    },

    //格式化时间
    timeFormat: function(time) {
        let ss = parseInt(time / 1000);
        let mm = 0;
        let hh = 0;
        if (ss > 60) {
            mm = parseInt(ss / 60);
            ss = parseInt(ss % 60);
            if (mm > 60) {
                hh = parseInt(mm / 60);
                mm = parseInt(mm % 60);
            }
        }
        ss = ss > 9 ? ss : `0${ss}`;
        mm = mm > 9 ? mm : `0${mm}`;
        hh = hh > 9 ? hh : `0${hh}`;
        return { ss, mm, hh };
    },

    //显示模态框，确认任务信息
    verifyTask: function() {
        swan.showModal({
            title: '待确认任务',
            content: "【滴答】将在1小时3分钟后提醒你吃饭" + "备注：在锅内锅外，明晚9:00，吃饭",
            confirmColor: '#ff1111',
            success: res => {
                if(res.confirm) {
                    console.log("确认");
                } else {
                    console.log("取消");
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
    },

    //最初的倒计时，已废弃
    countDown: function() {
        var that = this;
        var tmpList = that.data.countDownList;
        tmpList = JSON.parse(JSON.stringify(tmpList));
        console.log(tmpList);
        var hour = 0, min = 0, sec = 0;
        for(var i = 0; i < tmpList.length; i++) {
            hour = parseInt(tmpList[i].substring(0, 2));
            min = parseInt(tmpList[i].substring(3, 5));
            sec = parseInt(tmpList[i].substring(6, 8));
            console.log("倒计时函数");
            if(sec > 0) {
                sec--;
            } else {
                sec = 59;
                if(min > 0) {
                    min--;
                } else {
                    min = 59;
                    if(hour > 0) {
                        hour--;
                    } else {
                        min = 0; sec = 0;
                    }
                }
            }
            hour = this.timeFormat(hour);
            min = this.timeFormat(min);
            sec = this.timeFormat(sec);
            tmpList[i] = (hour + ':' + min + ':' + sec);
        }
        if(hour>0 || min>0 || sec>0) {
            this.setData({countDownList: tmpList});
            console.log(this);
            // setTimeout(this.countDown, 1000);
        }

        console.log(this.data.countDownList);
        // setTimeout(this.countDown, 1000);
        // this.countDown();
    }


});
