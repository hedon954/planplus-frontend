const app = getApp();
const myDate = new Date();

Page({
    data: {
        subScribeId: app.data.subScribeId, //订阅ID
        formId: '',                        //表单ID，订阅通知的时候需要用到
        showTaskDelayModal: false,         //推迟任务模态框
        showTaskOperationModal: false,     //操作按钮模态框
        taskId: 0,
        content: "",                       //任务内容
        startDate: '',                     //任务开始日期
        startTime: '',                     //任务开始时间
        endDate: '',                       //任务结束日期
        endTime: '',                       //任务结束时间
        place: '',                         //任务地点
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
        frequencyIndex: 0,  //表示选择器中选中值在列表中的下标
        frequency: 0,       //任务频率
        aheadTimeList: [{  //提前提醒时间列表，作为选择器显示内容的范围
            id: '0',
            name: '准时提醒'
        }, {
            id: '1',
            name:'5分钟'
        }, {
            id: '2',
            name: '10分钟'
        }, {
            id: '3',
            name:'20分钟'
        }, {
            id: '4',
            name: '30分钟'
        }, {
            id: '5',
            name:'1小时'
        }, {
            id: '6',
            name: '2小时'
        }, {
            id: '7',
            name:'5小时'
        }],
        aheadTimeIndex: 0, //表示选择器中选中值在列表中的下标
        aheadIndexMap: [0, 5, 10, 20, 30, 60, 120, 300], //下标与频率值（以分钟为单位）的映射
        aheadTime: 5, //提前提醒时间
        startDateStart: '', //开始时间的日期起点
        startDateDisplay: '', //打开日期选择器时默认选中（显示）的日期/开始日期
        startTimeStart: '', //开始时间的时间起点
        startTimeDisplay: '', //打开时间选择器时默认选中（显示）的时间/开始时间
        endDateStart: '', //结束时间的日期起点
        endDateDisplay: '', //打开日期选择器时默认选中（显示）的日期/结束日期
        endTimeStart: '', //结束时间的时间起点
        endTimeDisplay: '', //打开时间选择器时默认选中（显示）的时间/结束时间

        mutable: true, //当前页面所有控件是否可编辑
        visible: false, //当前页面的按钮是否可见（除结束按钮和删除按钮）
        endBtnVisible: true, //结束按钮是否可见
    },
    onLoad(options) {
        console.log(options);
        console.log(options.taskId);
        // console.log(myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate());
        // console.log(myDate.getHours() + ':' + myDate.getMinutes());
        this.setData({
            taskId: options.taskId,
            showTaskDelayModal: false
        });
        app.setTaskChanged(false);
        swan.request({
            url: 'https://www.hedon.wang/project/task/single/' + this.data.taskId,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                try {
                    var response = res.data.data;
                    console.log(res);
                    for(let i = 0; i < this.data.aheadIndexMap.length; i++) {
                        if(response['taskAdvanceRemindTime'] == this.data.aheadIndexMap[i]) {
                            this.setData('aheadTimeIndex', i);
                            break;
                        }
                    }
                    console.log('开始赋值');

                    console.log("提前提醒时间taskAdvanceRemindTime：" + response['taskAdvanceRemindTime'])
                    console.log("提前提醒时间aheadTimeIndex" + this.data.aheadTimeIndex)

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
                        aheadTime: response['taskAdvanceRemindTime']
                    });

                    console.log("提前提醒时间aheadTime" + this.data.aheadTime)

                    console.log("结束时间：++++++++++++++");
                    console.log(response['taskPredictedFinishTime'].substring(0, 10));
                    console.log(response['taskPredictedFinishTime'].substring(11, 16));
                    console.log("分界线===================");
                    console.log(this.data.endDate);
                    console.log(this.data.endTime);
                    console.log("结束时间：+++++++++++++++");


                    /**
                    * 判断当前任务状态，
                    * 若为进行中1或已结束2，则禁止当前页面所有编辑操作并隐藏相应按钮，
                    * 后续步骤“限定时间日期选择器起始值”也不再执行
                    */
                   console.log('返回的taskStatus的类型' + typeof response['taskStatus']);
                   console.log(response['taskStatus']);
                   if (response['taskStatus'] == 1) {
                       this.setData({
                           mutable: false,
                           visible: false,
                           endBtnVisible: true
                       });
                       return;
                   } else if(response['taskStatus'] == 2) {
                       this.setData({
                           mutable: false,
                           visible: false,
                           endBtnVisible: false
                       });
                       return;
                   } else {
                       this.setData({
                           mutable: true,
                           visible: true,
                           endBtnVisible: false
                       });
                   }


                    //限定时间日期选择器起始值
                    var now = myDate.getHours() + ":" + myDate.getMinutes();
                    var today = myDate.toLocaleDateString().replace(/\//g, '-');
                    console.log('现在是：'+now);
                    console.log("一分钟后："+this.timeCal(now, 1));
                    this.setData({
                        startDateStart: today,
                        startDateDisplay: this.dateCal(today, 1),
                        startTimeStart: now,
                        startTimeDisplay: this.timeCal(now, 1),
                        endDateStart: this.data.startDate,
                        endDateDisplay: this.dateCal(this.data.startDate, 1),
                        endTimeStart: this.data.startTime,
                        endTimeDisplay: this.timeCal(this.data.startTime, 1)
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    onShow(){
        this.setData({
            subScribeId: app.data.subScribeId
        })
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
        // let mm = parseInt(paramTime.substring(3));
        // let hh = parseInt(paramTime.substring(0, 2));
        let hh = parseInt(paramTime.split(':')[0]);
        let mm = parseInt(paramTime.split(':')[1])
        if(mm + n < 60) {
            mm += n;
        } else {
            mm = (mm + n) % 60;
            if(hh < 23) {
                hh += 1;
            } else {
                hh = '00';
            }
        }
        return `${hh}:${mm}`;
    },

    //日期修改
    dateChangeDay(e) {
        console.log('picker-date changed，值为', e.detail.value);
        console.log(e.currentTarget.id);
        if(e.currentTarget.id == 'startD') {
            this.setData(
                'startDate', e.detail.value
            );
            let today = myDate.toLocaleDateString().replace(/\//g, '-');
            if(e.detail.value != today) {
                this.setData('startTimeStart', '00:00');
            }
            this.setData({
                endDateStart: this.data.startDate,
                endDateDisplay: this.dateCal(this.data.startDate, 1),
                endTimeStart: this.data.startTime,
                endTimeDisplay: this.timeCal(this.data.startTime, 1)
            });
        } else if(e.currentTarget.id == 'endD') {
            this.setData(
                'endDate', e.detail.value
            );
            if(e.detail.value != this.data.startDate) {
                this.setData('endTimeStart', '00:00');
            }
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
            this.setData({
                endDateStart: this.data.startDate,
                endDateDisplay: this.dateCal(this.data.startDate, 1),
                endTimeStart: this.data.startTime,
                endTimeDisplay: this.timeCal(this.data.startTime, 1)
            });
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

    //字符串('yyyy-MM-dd hh:mm')转日期对象
    strToDate: function(str) {
        //月份需减1
        // console.log(new Date(str.substring(0, 4), str.substring(5, 7) - 1, str.substring(8, 10), str.substring(11, 13), str.substring(14, 16)));
        return new Date(str.substring(0, 4), str.substring(5, 7) - 1, str.substring(8, 10), str.substring(11, 13), str.substring(14, 16));
    },

    //检验开始时间和结束时间是否有效
    timeValid: function(time1, time2) {
        var oDate1 = this.strToDate(time1);
        var oDate2 = this.strToDate(time2);
        if(oDate1.getTime() <= oDate2.getTime()) {
            return true;
        } else{
            return false;
        }
    },

    //将任务保存至草稿箱
    draft() {
        console.log('将任务保存至草稿箱。。。')
        this.closeOperationsModal();

        //弹出模态框，待用户确认操作
        swan.showModal({
            title: '温馨提示',
            content: '您即将把任务移动至草稿箱',
            success: res => {
                //点击确定后，保存任务至草稿箱
                if(res.confirm) {
                    swan.request({
                        url: 'https://www.hedon.wang/project/task/draft/' + this.data.taskId,
                        method: 'PUT',
                        header: {
                            'Authorization': 'bearer ' + app.data.access_token
                        },
                        success: res => {
                            try {
                                console.log('成功保存至草稿箱。。。');
                                app.setTaskChanged(true);
                                swan.showToast({
                                    title: '已保存至草稿箱',
                                    icon: 'success',
                                    image: '',
                                    duration: 1000,
                                });

                                //任务保存至草稿箱后，自动返回主界面
                                setTimeout(function() {
                                    swan.navigateBack({

                                    });
                                }, 800);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        },
                    });
                }
            },
        });
    },

    //删除任务
    delete() {
        this.closeOperationsModal();

        //弹出模态框，待用户确认操作
        swan.showModal({
            title: '温馨提示',
            content: '您即将删除该任务',
            success: res => {
                //点击确定后，删除任务
                if(res.confirm) {
                    swan.request({
                        url: 'https://www.hedon.wang/project/task/delete/' + this.data.taskId,
                        method: 'DELETE',
                        header: {
                            'Authorization': 'bearer ' + app.data.access_token
                        },
                        success: res => {
                            try {
                                console.log('删除成功。。。');
                                app.setTaskChanged(true);
                                swan.showToast({
                                    title: '任务已删除',
                                    icon: 'success',
                                    image: '',
                                    duration: 1000,
                                });

                                //任务删除后，自动返回主界面
                                setTimeout(function() {
                                    swan.navigateBack({

                                    });
                                }, 800);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        },
                    });
                } else {
                    this.closeOperationsModal();
                }
            },
        });


    },

    //开始任务
    startTask(e) {
        console.log('开始任务。。。')
        //弹出模态框，待用户确认操作
        swan.showModal({
            title: '温馨提示',
            content: '您即将开始该任务',
            success: res => {
                //若点击确定，则开始任务
                if(res.confirm) {
                    swan.request({
                        url: 'https://www.hedon.wang/project/task/start/' + this.data.taskId +
                        "?formId="+e.detail.formId,
                        method: 'PUT',
                        header: {
                            'Authorization': 'bearer ' + app.data.access_token
                        },
                        success: res => {
                            try {
                                console.log('任务已开始。。。');
                                app.setTaskChanged(true);
                                swan.showToast({
                                    // 提示的内容
                                    title: '任务已开始',
                                    icon: 'success',
                                    image: '',
                                    duration: 1000,
                                });

                                //任务已开始，禁止编辑功能
                                this.setData({
                                    mutable: false,
                                    visible: false,
                                    endBtnVisible: true
                                });

                                //开始任务后，自动返回主界面
                                setTimeout(function() {
                                    swan.navigateBack({

                                    });
                                }, 800);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        },
                    });
                }
            },
        });

    },

    //结束任务
    finish(e) {
        console.log('结束任务。。。');
        console.log(e.detail.formId);

        //弹出模态框，待用户确认操作
        swan.showModal({
            title: '温馨提示',
            content: '您即将结束该任务',
            success: res => {
                //若点击确定，则结束任务
                if(res.confirm) {
                    swan.request({
                        url: 'https://www.hedon.wang/project/task/finish/' + this.data.taskId +
                        "?fromId="+e.detail.formId,
                        method: 'PUT',
                        header: {
                            'Authorization': 'bearer ' + app.data.access_token
                        },
                        success: res => {
                            try {
                                console.log('任务已结束。。。');
                                console.log(res);
                                app.setTaskChanged(true);
                                swan.showToast({
                                    // 提示的内容
                                    title: '恭喜你完成任务！',
                                    icon: 'success',
                                    image: '',
                                    duration: 2000,
                                });

                                //任务已结束，禁止编辑功能
                                this.setData({
                                    mutable: false,
                                    visible: false,
                                    endBtnVisible: false
                                });

                                //结束任务后，自动返回主界面
                                setTimeout(function() {
                                    swan.navigateBack({

                                    });
                                }, 800);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        },
                    });
                }
            },
        });

    },

    //保存修改
    save(e) {
        this.closeOperationsModal();

        //判断任务内容和任务开始时间是否为空
        if(this.data.content == null || this.data.content == ''
        || this.data.startDate == null || this.data.startDate == ''
        || this.data.startTime == null || this.data.startTime == '') {
            swan.showToast({
                title: '缺少任务内容或开始时间',
                icon: 'none',
                duration: 2400,
            });
            return;
        }

        console.log("save form id = " + e.detail.formId);
        console.log(this.data.content);
        let begin = this.data.startDate + " " + this.data.startTime;
        let end = this.data.endDate + " " + this.data.endTime;
        if(!this.timeValid(begin, end)) {
            swan.showToast({
                title: '结束时间需晚于开始时间',
                icon: 'none',
                duration: 3000
            });
            return;
        }
        swan.request({
            url: 'https://www.hedon.wang/project/task/modify/' + this.data.taskId,
            method: 'PUT',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            data: {
                taskFormId: e.detail.formId,
                taskContent: this.data.content,
                taskStartTime: this.data.startDate + 'T' + this.data.startTime + ':00.000',
                taskPredictedFinishTime: this.data.endDate + 'T' + this.data.endTime + ':00.000',
                taskPlace: this.data.place,
                taskRate: this.data.frequency,
                taskAdvanceRemindTime: this.data.aheadTime,
                taskStatus: 0
            },
            success: res => {
                console.log(res.data)
                try {
                    console.log('保存成功。。。');
                    app.setTaskChanged(true);
                    //修改订阅号
                    app.setSubScribeId(res.data.data.subScribeId);
                    this.setData({
                        subScribeId: app.data.subScribeId
                    })
                    swan.showToast({
                        // 提示的内容
                        title: '已保存修改',
                        icon: 'success',
                        image: '',
                        duration: 2000,
                    });
                    setTimeout(function() {
                        swan.navigateBack({

                        });
                    }, 800);

                }
                catch (error) {
                    swan.showModal({
                        // 提示的标题
                        title: '保存失败',
                        // 提示的内容
                        content: error,
                    });
                    console.log(error);
                }
            },
        });
    },

    //推迟任务
    delay(e) {
        this.closeOperationsModal();
        //获取formId
        console.log("delay formId = " + e.detail.formId)
        this.setData({
            formId: e.detail.formId
        });
        this.setData('showTaskDelayModal', true);
        console.log(this.data.showTaskDelayModal);
    },

    //关闭模态框
    closeModal() {
        this.setData('showTaskDelayModal', false);
    },

    delayConfirm(e) {
        console.log(e)
        console.log("推迟任务。。。");
        console.log(e.currentTarget.id);
        console.log(this.data.taskId);
        swan.request({
            url: 'https://www.hedon.wang/project/task/delay/' + this.data.taskId + "?delayTime="+e.currentTarget.id+"&formId="+this.data.formId,
            method: 'PUT',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            success: res => {
                console.log(res);
                try {
                    console.log(`任务已推迟${e.currentTarget.id}分钟。。。`);
                    app.setTaskChanged(true);
                    this.setData('showTaskDelayModal', false);
                    //存储新的 subScribeId， 防止产生相同的 formId
                    app.setSubScribeId(res.data.data.subScribeId)
                    this.setData({
                        subScribeId: app.data.subScribeId
                    })
                    swan.showToast({
                        title: '任务已推迟',
                        icon: 'success',
                        duration: 1000,
                    });
                    setTimeout(function() {
                        swan.navigateBack({

                        });
                    }, 800);
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    //打开操作选项模态框
    showOperationsModal() {
        this.setData('showTaskOperationModal', true);
    },

    //关闭操作选项模态框
    closeOperationsModal() {
        console.log("closeOperationsModal")
        if(this.data.showTaskOperationModal==true){
            this.setData('showTaskOperationModal', false);
        }
    },
});
