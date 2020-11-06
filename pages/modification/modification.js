const app = getApp();
const myDate = new Date();

Page({
    data: {
        taskId: 0,
        content: "", //任务内容
        startDate: '', //任务开始日期
        startTime: '', //任务开始时间
        endDate: '', //任务结束日期
        endTime: '', //任务结束时间
        place: '', //任务地点
        frequencyList: [{ //任务频率列表，作为选择器显示内容的范围
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
        frequencyIndex: 0, //表示选择器中选中值在列表中的下标
        frequency: 0, //任务频率
        aheadTimeList: [{ //提前提醒时间列表，作为选择器显示内容的范围
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
        aheadTimeIndex: 0, //表示选择器中选中值在列表中的下标
        aheadIndexMap: [5, 10, 20, 30, 60, 120, 300], //下标与频率值（以分钟为单位）的映射
        aheadTime: 5, //提前提醒时间
        startDateStart: '', //开始时间的日期起点
        startDateDisplay: '', //打开日期选择器时默认选中（显示）的日期/开始日期
        startTimeStart: '', //开始时间的时间起点
        startTimeDisplay: '', //打开时间选择器时默认选中（显示）的时间/开始时间
        endDateStart: '', //结束时间的日期起点
        endDateDisplay: '', //打开日期选择器时默认选中（显示）的日期/结束日期
        endTimeStart: '', //结束时间的时间起点
        endTimeDisplay: '', //打开时间选择器时默认选中（显示）的时间/结束时间
    },
    onLoad(options) {
        console.log(options);
        console.log(options.taskId);
        // console.log(myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate());
        // console.log(myDate.getHours() + ':' + myDate.getMinutes());
        this.setData({
            taskId: options.taskId
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
                        //给任务信息赋值
                        content: response['taskContent'],
                        place: response['taskPlace'],
                        startDate: response['taskStartTime'].substring(0, 10),
                        startTime: response['taskStartTime'].substring(11, 16),
                        endDate: response['taskPredictedFinishTime'].substring(0, 10),
                        endTime: response['taskPredictedFinishTime'].substring(11, 16),
                        frequency: response['taskRate'],
                        frequencyIndex: response['taskRate'],
                        aheadTime: response['taskAdvanceRemindTIme']
                    });
                    //初始化日期和时间选择器相关变量
                    var nowPlusFiveMinutes = myDate.getHours() + ":" + myDate.getMinutes();
                    var tmp1 = timeCal(nowPlusFiveMinutes, 5);
                    nowPlusFiveMinutes = tmp1[0];

                    var tmp2 = timeCal(nowPlusFiveMinutes, 1);
                    var nowPlusSixMinutes = tmp2[0];

                    var today = myDate.toLocaleDateString().replace(/\//g, '-');
                    console.log('今天是：' + today);
                    var tomorrow = this.dateCal(today, 1+tmp[1]);
                    console.log('明天是：' + tomorrow);
                    var nextday = this.dateCal(this.data.startDate, 1); //任务开始的后一天
                    this.setData({
                        startDateStart: today,
                        startDateDisplay: tomorrow,
                        startTimeStart: nowPlusFiveMinutes,
                        startTimeDisplay: this.timeCal(nowPlusFiveMinutes, 1)[0],
                        endDateStart: this.data.startDate,
                        endDateDisplay: nextday,
                        endTimeStart: this.data.startTime,
                        endTimeDisplay: this.timeCal(this.data.startTime, 1)[0]
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    //日期加减
    dateCal(paramDate, n) {
        let dateStr = paramDate.replace(/\//g, '-');
        let date = new Date(dateStr);
        date.setDate(date.getDate() + n);
        return date.toLocaleDateString().replace(/\//g, '-');
    },
    //时间（时：分）加减
    timeCal(paramTime, n) {
        let mm = parseInt(paramTime.substring(3));
        let hh = parseInt(paramTime.substring(0, 2));
        let carryIn = 0; //表示日期是否需要进位
        if(mm + n < 60) {
            mm += n;
        } else {
            mm = (mm + n) % 60;
            if(hh < 23) {
                hh += 1;
            } else {
                hh = '00';
                carryIn = 1;
            }
        }
        return [`${hh}:${mm}`, carryIn];
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
