const app = getApp();

Page({
    /**
     * 数据
     */
    data: {
        subScribeId: app.data.subScribeId,
        showVerifyModal: false, //是否显示自定义模态框
        tasks: [], //任务列表
        activeName: 'today', //当前选中的tab-item名称
        isToday: true,
        endTimeList: [], //定时器结束时间——即各任务开始时间
        countDownList: [], //倒计时时间
        maxTimeLeft: 0, //各个任务中倒计时剩余的最大值
        /**
         * 单个任务属性
         */
        taskId: null,
        taskContent: "吃老佛爷的咸蛋",
        taskPlace: "阿里爸爸说",
        taskRate: 2,
        taskStartTime: "2020-11-12T08:00:00.826000",
        taskPredictedFinishTime: "2020-11-12T09:30:24.826000",
        taskAdvanceRemindTime: 10,
        /**
         * 任务提醒模态框需要的数据
         */
        taskRemindStr: '',
        taskRemarkStr: '',
        /**
         * 根据后台是否有数据给出预测时间
         */
        hasPredicedTime: false,
        predictedConsumedTimeStr: '',
        /**
         * 新建任务所在时间段是否已存在任务，用于确定是否显示自定义模态框的警告区域
         */
        timeConflict: false,
        conflictTaskStr: '',
    },

    /**
     * 当页面加载时
     */
    onLoad: function() {
        console.log("read app access token in home: "+ app.data.access_token)
        //先检查是否已登录
        this.checkLoginOrNot();
        //已登录->查询今日任务
        this.setData({
            activeName: 'today',
            isToday: true
        });
        //查询今日任务
        this.getTodayTasks()
    },

    /**
     * 页面每次展示都要执行的函数
     */
    onShow: function() {
        this.setData({
            activeName: 'today',
            isToday: true
        });
        console.log("onShow...")
        if(!app.data.taskChanged) {
            return;
        }
        //读取今日任务
        this.getTodayTasks()
    },


    /**
     * 检查是否已登录
     */
    checkLoginOrNot: function(){
        //先检查用户是否已经登录
        swan.request({
            url: 'http://182.61.131.18:9527/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                console.log(res);
                console.log("ssssssssssss" + typeof res.data.code)
                //已登录
                if(res.data.code == '1000'){
                    console.log("hhhhh"+res.data)
                }else{
                    //未登录
                    swan.showModal({
                        // 提示的标题
                        title: '身份过期',
                        // 提示的内容
                        content: '身份过期，请先登录！',
                        // 是否显示取消按钮 。
                        showCancel: false,
                    });
                    // 跳转到登录界面
                    swan.redirectTo({
                        url: '/pages/login/login'
                    });
                    return;
                }
            },
            // fail: res => {
            //      //未登录
            //      swan.showModal({
            //         // 提示的标题
            //         title: '身份过期',
            //         // 提示的内容
            //         content: '身份过期，请先登录！',
            //         // 是否显示取消按钮 。
            //         showCancel: false,
            //     });
            //     // 跳转到登录界面
            //     swan.redirectTo({
            //         url: '/pages/login/login'
            //     })
            // }
        });

        // 用户首次进入小程序，同步百度APP登录态
        swan.login({
            success: res => {
                console.log('login success', res);

                // 获取用户手机号或用户信息
                // 待补

                /**
                 * 登陆成功后要发送请求到后端，
                 * 利用这个仅有10s有效期的code去获取openId和sessionKey，
                 * 因为发送信息需要用户的openId
                 */
                swan.request({
                    url: 'http://182.61.131.18:9527/project/user/getUserOpenIdAndSessionKey?code='+res.code,
                    method: 'POST',
                    header:{
                        'Content-Type': 'Application/x-www-form-urlencoded',
                        'Authorization': 'bearer ' + app.data.access_token
                    },
                    responseType: 'text',
                    success: res=>{
                        console.log(res);
                        swan.showModal({
                            title: '成功',
                            content: res
                        });
                        this.setData({
                            hasLogin: 'yes'
                        })
                    },
                    fail: res=>{
                        console.log(res);
                        swan.showModal({
                            title: '失败',
                            content: res
                        });
                    }
                });
            },
            fail: err => {
                console.log('login fail', err);
            }
        });
    },


    /**
     * 获取所有任务
     */
    getTasks: function(e) {
        this.setData('isToday', (e.detail.name == 'today' )? true: false);
        swan.request({
            url: 'http://182.61.131.18:9527/project/task/' + e.detail.name,
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
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },

    /**
     * 读取今天所有任务
     */
    getTodayTasks: function(){
        swan.request({
            url: 'http://182.61.131.18:9527/project/task/today',
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
                    this.interval = setInterval(() => {
                        if(this.getTimeSpan(this.data.endTimeList) <= 0) {
                            this.interval && clearInterval(this.interval);
                        }
                    }, 1000);
                }
                catch (error) {
                    console.log(error);
                }
            },
        });
    },

    // 获取时间差
    getTimeSpan: function(list) {
        // console.log("进来了。。。")
        let nowTime = new Date().getTime();//现在时间（时间戳）
        let tmpList = []; //临时存放倒计时列表中的各个元素
        let maxTime = 0;
        for(var i = 0; i < list.length; i++) {
            // console.log("进入循环。。。")
            let endTime = new Date(list[i]).getTime();//结束时间（时间戳）
            let time = endTime - nowTime;//剩余时间，以毫秒为单位
            let formatTime = this.timeFormat(time);
            tmpList.push(formatTime.hh + ':' + formatTime.mm + ':' + formatTime.ss);
            // console.log("跳出循环。。。")
            maxTime = time > maxTime? time: maxTime;
        }
        // console.log("结束循环。。。")
        this.setData({
            countDownList: tmpList
        });
        return maxTime;
    },


    //格式化时间
    timeFormat: function(time) {
        if(time <= 0) {
            ss = '00';
            mm = '00';
            hh = '00';
            return {ss, mm, hh};
        }
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

    //创建任务，显示模态框，确认任务信息
    verifyTask(e) {
        console.log("订阅结果：" + e.detail.message);

        if(e.detail.message != 'success' && e.detail.message != '调用成功'){
            swan.showToast({
                // 提示的内容
                title: '任务创建失败，请授权通知功能',
                // 图标，有效值"success"、"loading"、"none"。
                icon: 'none',
            });
            return;
        }
        console.log("formId = " + e.detail.formId)
        swan.request({
            url: 'http://182.61.131.18:9527/project/task/create',
            method: 'POST',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            data: {
                taskFormId: e.detail.formId,
                taskContent: this.data.taskContent,
                taskPlace: this.data.taskPlace,
                taskRate: this.data.taskRate,
                taskStartTime: this.data.taskStartTime,
                taskPredictedFinishTime: this.data.taskPredictedFinishTime,
                taskAdvanceRemindTime: this.data.taskAdvanceRemindTime
            },
            success: res => {
                //创建成功
                if(res.data.code == '1000'){
                    console.log("res = " + res.data.data.taskId)
                    //刷新订阅ID，防止每次的 formID 都一样
                    app.setSubScribeId(res.data.data.subScribeId)
                    this.setData({
                        subScribeId: app.data.subScribeId
                    })
                    console.log("app's subScribeId = " + app.data.subScribeId);
                    console.log("home's subScribeId = " + this.data.subScribeId);
                    //获取剩余时间
                    let timeLeft = this.getTimeLeft(this.data.taskStartTime);
                    //初始化参数
                    this.setData({
                        taskId: res.data.data.taskId,
                        taskRemindStr: `将在${timeLeft}后提醒你${this.data.taskContent}`,
                        taskRemarkStr: `[备注]在${this.data.taskPlace},${this.data.taskStartTime.substring(0,10) +' ' +this.data.taskStartTime.substring(11,16)}`,
                        predictedConsumedTimeStr: '',
                        conflictTaskStr: ''
                    });
                    //预测耗时
                    if(this.data.hasPredicedTime){
                        this.setData({
                            predictedConsumedTimeStr: '预计耗时：' + '2h'
                        })
                    };
                    //时间冲突
                    if(this.data.timeConflict){
                        this.setData({
                            conflictTaskStr: '小程序检测出您在该时间段内有任务'
                        })
                    }
                    //显示模态框进行提示
                    swan.showModal({
                        title: '创建成功',
                        content:
                        // '将在'+'30分钟'+'后提醒你'+'吃饭'+'\r\n'
                        this.data.taskRemindStr
                        // +'[备注]在'+'银泰'+'20:00'+'\r\n'
                        + this.data.taskRemarkStr + '\r\n'
                        // +'预计耗时：'+'30min'+'\r\n'
                        + this.data.predictedConsumedTimeStr + '\r\n'
                        // +'小程序检测出您在该时间段内有'+'学习'+'任务',
                        + this.data.conflictTaskStr  + '\r\n',
                        showCancel: true,
                        cancelText: '确定',
                        confirmText: '修改',
                        success: res=>{
                            //重新读取所有任务
                            this.getTodayTasks()
                            if(res.confirm){
                                //跳转到详情页
                                swan.navigateTo({
                                    url:'/pages/modification/modification?taskId='+this.data.taskId
                                });
                            }
                        }
                    });
                }

            }
        });
    },

    //关闭模态框
    closeModal: function() {
        this.setData('showVerifyModal', false);
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

    //计算剩余时间
    getTimeLeft(start){
        let nowTime  = new Date().getTime();
        let startTime = new Date(start).getTime();
        let minutes = (startTime - nowTime)/1000/60;
        let hour = parseInt(minutes / 60) ;
        let minute = parseInt(minutes % 60);
        if(hour > 0){
            return hour+'小时'+ minute +'分钟';
        }
        if(hour == 0){
            return minute +'分钟';
        }
    }

});
