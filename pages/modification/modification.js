const app = getApp();
const myDate = new Date();

Page({
    data: {
        taskId: 0,
        content: "", //任务内容
        startDate: '', //开始日期
        startTime: '', //开始时间
        endDate: '', //结束日期
        endTime: '', //结束时间
        place: '', //任务地点
        frequencyList: [{
            id: '0',
            name:'仅一次'
        }, {
            id: '1',
            name: '每天'
        }, {
            id: '2',
            name:'每周'
        }, {
            id: '3',
            name: '每月'
        }],
        frequencyIndex: 0,
        frequency: 0,
        aheadTimeList: [{
            id: '0',
            name:'5分钟'
        }, {
            id: '1',
            name: '10分钟'
        }, {
            id: '2',
            name:'20分钟'
        }, {
            id: '3',
            name: '30分钟'
        }, {
            id: '4',
            name:'1小时'
        }, {
            id: '5',
            name: '2小时'
        }, {
            id: '6',
            name:'5小时'
        }],
        aheadTimeIndex: 0,
        aheadIndexMap: [5, 10, 20, 30, 60, 120, 300],
        aheadTime: 5, //提前提醒时间
        // startDateStart: '', //开始时间的日期起点
        // startTimeStart: '', //开始时间的时间起点
        // endDatestart: '', //结束时间的日期起点
        // endTimeStart: '', //结束时间的时间起点
    },
    onLoad(options) {
        console.log(options);
        console.log(options.taskId);
        // console.log(myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate());
        // console.log(myDate.getHours() + ':' + myDate.getMinutes());
        this.setData({
            taskId: options.taskId
            // startDateStart: myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate(),
            // startTimeStart: myDate.getHours() + ':' + myDate.getMinutes()
        });
        swan.request({
            url: 'http://localhost:9527/project/task/single/' + this.data.taskId,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;

                    for(let i = 0; i < this.data.aheadIndexMap.length; i++) {
                        if(response['taskAdvanceRemindTime'] == this.data.aheadIndexMap[i]) {
                            this.setData('aheadTimeIndex', i);
                            break;
                        }
                    }
                    console.log('开始赋值');

                    this.setData({
                        content: response['taskContent'],
                        place: response['taskPlace'],
                        startDate: response['taskStartTime'].substring(0, 10),
                        startTime: response['taskStartTime'].substring(11, 16),
                        endDate: response['taskPredictedFinishTime'].substring(0, 10),
                        endTime: response['taskPredictedFinishTime'].substring(11, 16),
                        frequency: response['taskRate'],
                        frequencyIndex: response['taskRate'],
                        aheadTime: response['taskAdvanceRemindTIme'],
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    //日期修改
    dateChangeDay(e) {
        console.log('picker-date changed，值为', e.detail.value);
        console.log(e.currentTarget.id);
        if(e.currentTarget.id == 'startD') {
            this.setData(
                'startDate', e.detail.value
            );
        } else if(e.currentTarget.id == 'endD') {
            this.setData(
                'endDate', e.detail.value
            );
        }
        console.log(this.data.startDate);
    },

    //时间修改
    timeChange(e) {
        console.log('picker-time changed，值为', e.detail.value);
        if(e.currentTarget.id == 'startT') {
            this.setData(
                'startTime', e.detail.value
            );
        } else {
            this.setData(
                'endTime', e.detail.value
            );
        }
    },

    //频率和提前提醒时间修改
    selectorChange(e) {
        if(e.currentTarget.id == 'frq') {
            this.setData({
                frequencyIndex: e.detail.value,
                frequency: e.detail.value
            });
            console.log(e.detail.value);
        } else if(e.currentTarget.id == 'ahd') {
            console.log(this.data.aheadIndexMap[e.detail.value]);
            this.setData({
                aheadTimeIndex: e.detail.value,
                aheadTime: this.data.aheadIndexMap[e.detail.value]
            })
        }
    },

    contentInput(e) {
        this.setData('content', e.detail.value);
    },
    placeInput(e) {
        this.setData('place', e.detail.value);
    },

    //保存修改
    save() {
        console.log(this.data.content);
        swan.request({
            url: 'http://localhost:9527/project/task/modify/' + this.data.taskId,
            method: 'PUT',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            data: {
                taskContent: this.data.content,
                taskStartTime: this.data.startDate + 'T' + this.data.startTime + ':00.000',
                taskPredictedFinishTime: this.data.endDate + 'T' + this.data.endTime + ':00.000',
                taskPlace: this.data.place,
                taskRate: this.data.frequency,
                taskAdvanceRemindTime: this.data.aheadTime
            },
            success: res => {
                try {
                    console.log('保存成功。。。');
                    swan.navigateBack({

                    });

                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    delete() {
        swan.request({
            url: 'http://localhost:9527/project/task/delete/' + this.data.taskId,
            method: 'DELETE',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    console.log('删除成功。。。');
                    swan.navigateBack({

                    });

                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    }
});
