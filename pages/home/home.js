const app = getApp();

Page({
    data: {
        tasks: [],
        activeName: '',
        endTimeList: [],
        countDownList: [],
        timeout: 0 //定时器
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
                    var startTimeList = [];
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 19);
                        response[i]['taskStartTime'] = startTimeString;
                    }
                    this.setData({
                        tasks: response,
                        endTimeList: startTimeList
                    });

                    // this.getTimeSpan();
                    while(    setTimeout(this.getTimeSpan(this.data.endTimeList), 1000) >0){

                    }

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
                    if(e.detail.name == 'today') {
                        this.getTimeSpan();
                    } else {
                        this.setData({countDownList: []});
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

    //倒计时
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
    },
    // 获取时间差
    getTimeSpan: function(list) {
        console.log("进来了。。。")
        let nowTime = new Date().getTime();//现在时间（时间戳）
        // let list = this.data.endTimeList;
        let tmpList = [];
        let minTime = 24 * 60 * 60 * 1000;
        for(var i = 0; i < list.length; i++) {
            console.log("进入循环。。。")
            let endTime = new Date(list[i]).getTime();//结束时间（时间戳）
            let time = endTime - nowTime;//剩余时间，以毫秒为单位
            let formatTime = this.timeFormat(time);
            tmpList.push(formatTime.hh + ':' + formatTime.mm + ':' + formatTime.ss);
            console.log("跳出循环。。。")
            minTime = time < minTime? time: minTime;
        }
        console.log("结束循环。。。")
        this.setData({
            countDownList: tmpList
        });
        return minTime;
        // if(minTime > 0) {
        //     setTimeout(this.getTimeSpan, 2000);
        // }
        // setTimeout(this.getTimeSpan, 1000);
        // this.getTimeSpan();
    },
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
    }
});
