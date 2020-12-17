const app = getApp();

Component({
    properties: {
        taskId:{
            type: Number,
        },
        content: {
            type: String,
            value: ''
        },
        time: {
            type: String,
            value: ''
        },
        place: {
            type: String,
            value: ''
        },
        countDownTime: {
            type: String,
            value: ''
        },
        isToday: {
            type: Boolean,
            value: true
        },
        delStyle: {
            type: String,
            value: ''
        },
        isStart: {
            type: Number,
        },
        formSubScribeId: {
            type: String,
            value: ''
        },
        countFontColor: {
            type: String,
            value: ''
        },
        activeName:{
            type: String,
            value: ''
        },
        taskStatus: {
            type: Number,
        }
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        handleTap(e) {
            swan.navigateTo({
                url: `/pages/modification/modification?taskId=`+this.properties.taskId
            });
        },
        handleStartEnd(e) {

            var taskStatus = this.properties.taskStatus;
            var formId = e.detail.formId;
            var taskId = this.properties.taskId;
            // var formId = e.detail.formId;
            console.log("formId :" + e.detail.formId)

            // console.log("formId:" + formId);
            console.log("taskId:" + this.properties.taskId);
            console.log("taskStatus:" + taskStatus);


            if(taskStatus == 0) {
                console.log("准备开始任务");
                swan.showModal({
                    title: '温馨提示',
                    content: '您即将开始该任务',
                    success: res => {
                        //若点击确定，则开始任务
                        if(res.confirm) {
                            swan.request({
                                url: 'https://www.hedon.wang/project/task/start/' + taskId +
                                "?formId="+formId,
                                method: 'PUT',
                                header: {
                                    'Authorization': 'bearer ' + app.data.access_token
                                },
                                success: res => {
                                    if(res.data.code == 1000) {
                                        this.triggerEvent("handleStartEnd");
                                        console.log('任务已开始。。。');
                                        //刷新订阅ID，防止每次的 formID 都一样
                                        app.setSubScribeId(res.data.data.subScribeId)
                                        this.setData({
                                            subScribeId: app.data.subScribeId
                                        })
                                        swan.showToast({
                                            title: '奥利给！',
                                            icon: 'success',
                                            duration: 1000,
                                        });
                                    } else {
                                        swan.showToast({
                                            title: '请重试',
                                            icon: 'none',
                                            duration: 1000,
                                        });
                                    }
                                },
                                fail: res => {
                                    swan.showToast({
                                        title: res,
                                        icon: 'none',
                                        duration: 1000,
                                    });
                                }
                            });
                        }
                    },
                });

            } else if(taskStatus == 1) {

                console.log('结束任务。。。');
                //弹出模态框，待用户确认操作
                swan.showModal({
                    title: '温馨提示',
                    content: '您即将结束该任务',
                    success: res => {
                        //若点击确定，则结束任务
                        if(res.confirm) {
                            swan.request({
                                url: 'https://www.hedon.wang/project/task/finish/' + taskId +
                                "?formId="+formId,
                                method: 'PUT',
                                header: {
                                    'Authorization': 'bearer ' + app.data.access_token
                                },
                                success: res => {
                                    if(res.data.code == 1000) {
                                        this.triggerEvent("handleStartEnd");
                                        //刷新订阅ID，防止每次的 formID 都一样
                                        app.setSubScribeId(res.data.data.subScribeId);
                                        this.setData({
                                            subScribeId: app.data.subScribeId
                                        });

                                        swan.showToast({
                                            // 提示的内容
                                            title: '恭喜你！',
                                            icon: 'success',
                                            image: '',
                                            duration: 2000,
                                        });
                                    } else{
                                        swan.showToast({
                                            title: '请重试',
                                            icon: 'none',
                                            duration: 1000,
                                        });
                                    }
                                },
                                fail: res => {
                                    swan.showToast({
                                        title: res,
                                        icon: 'none',
                                        duration: 1000,
                                    });
                                }
                            });
                        }
                    },
                });
            }
        },
        handleDelete() {
            swan.showModal({
                title: '温馨提示',
                content: '您即将删除该任务',
                success: res => {
                    //点击确定后，删除任务
                    if(res.confirm) {
                        swan.request({
                            url: 'https://www.hedon.wang/project/task/delete/' + this.properties.taskId,
                            method: 'DELETE',
                            header: {
                                'Authorization': 'bearer ' + app.data.access_token
                            },
                            success: res => {
                                if(res.data.code == 1000) {
                                    // this.getTasksByParam(this.data.activeName);
                                    this.triggerEvent("handleDelete");
                                    swan.showToast({
                                        title: '已删除',
                                        icon: 'success',
                                        duration: 1000,
                                    });
                                }else{
                                    swan.showToast({
                                        title: '请重试',
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
                            }
                        });
                    }
                },
            });
            // var myEventDetail = {} // detail对象，提供给事件监听函数
            // var myEventOption = {bubbles:false} // 触发事件的选项
            // this.triggerEvent("handleDelete",myEventDetail,myEventOption);
        }
    }
});