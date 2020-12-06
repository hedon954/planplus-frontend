const app = getApp();

Page({
    /**
     * 数据
     */
    data: {
        subScribeId: app.data.subScribeId,
        showVerifyModal: false, //是否显示自定义模态框
        tasks: [], //任务列表
        activeName: '', //当前选中的tab-item名称
        isToday: true,
        endTimeList: [], //定时器结束时间——即各任务开始时间
        countDownList: [], //倒计时时间
        maxTimeLeft: 0, //各个任务中倒计时剩余的最大值
        deleteStyleList: [], //删除线样式
        /**
         * 单个任务属性
         */
        taskId: null,
        taskContent: "放飞自我",
        taskPlace: "穹顶之下",
        taskRate: 2,
        taskStartTime: "2020-11-18T23:00:00.826000",
        taskPredictedFinishTime: "2020-11-18T23:10:24.826000",
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

        /**
         * 语音识别部分
         */
        showVoiceRecognizePanel: false, //是否显示语音识别面板
        voiceRecognizeContent: "", //语音识别到的内容

        /**
         * 标记各任务是否已经结束
         */
        hasStarted: [],
    },

    /**
     * 当页面加载时
     */
    onLoad: function() {
        console.log("read app access token in home: "+ app.data.access_token)
        //先检查是否已登录
        this.checkLoginOrNot();
        //已登录->查询今日任务
        console.log('fafffffffffffffffffffffffffffffffffffffffffffffffffff'+app.data.preTab);
        this.setData({
            // activeName: 'today',
            // isToday: true
            activeName: (app.data.preTab == '')? 'today': app.data.preTab,
            isToday: (app.data.preTab == '' || app.data.preTab == 'today')? true: false
        });
        //查询今日任务
        // this.getTodayTasks()
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'+this.data.activeName+this.data.isToday);
        this.getTasksByParam(this.data.activeName);
    },

    /**
     * 页面每次展示都要执行的函数
     */
    onShow: function() {
        this.setData({
            // activeName: 'today',
            // isToday: true,
            activeName: (app.data.preTab == '')? 'today': app.data.preTab,
            isToday: (app.data.preTab == '' || app.data.preTab == 'today')? true: false,
            subScribeId: app.data.subScribeId
        });
        console.log("onShow...")
        if(!app.data.taskChanged) {
            return;
        }
        // //读取今日任务
        // this.getTodayTasks()
        console.log('onshow:hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'+this.data.activeName+this.data.isToday);
        this.getTasksByParam(this.data.activeName);
    },


    /**
     * 检查是否已登录
     */
    checkLoginOrNot: function(){
        //先检查用户是否已经登录
        swan.request({
            url: 'https://www.hedon.wang/project/login/checkLogin',
            // url: 'http://localhost:443/project/login/checkLogin',
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
                        title: '身份过期',
                        content: '身份过期，请先登录！',
                        showCancel: false,
                    });
                    // 跳转到登录界面
                    swan.redirectTo({
                        url: '/pages/login/login'
                    });
                    return;
                }
            },
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
                    url: 'https://www.hedon.wang/project/user/getUserOpenIdAndSessionKey?code='+res.code,
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
     * 按输入参数获取任务
     */
    getTasksByParam: function(param) {
        console.log('进入函数'+param);
        this.setData('isToday', (param == 'today' )? true: false);
        console.log(this.data.isToday);
        swan.request({
            url: 'https://www.hedon.wang/project/task/' + param,
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
                    var delStyleList = []; //临时存放删除线样式
                    var hasStartedList = []; //临时存放是否结束标志
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);


                        //判断是否为待办任务，若是，则显示日期
                        if(this.data.activeName == 'todo') {
                            console.log('这是todo。。。。。。。。。。。。')
                            if(response[i]['taskStartTime'].substring(0, 16) !=
                                response[i]['taskPredictedFinishTime'].substring(0, 16)) {
                                response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 16).replace(/T/, ' ') + '-' + response[i]['taskPredictedFinishTime'].substring(11, 16);
                            } else {
                                response[i]['taskStartTime'] = response[i]['taskPredictedFinishTime'].substring(0, 16).replace(/T/, ' ');
                            }
                        } else {
                            //判断任务开始时间和结束时间是否一致
                            if(startTimeString != response[i]['taskPredictedFinishTime'].substring(11, 16)) {
                                response[i]['taskStartTime'] = startTimeString + '-' + response[i]['taskPredictedFinishTime'].substring(11, 16);
                            } else {
                                response[i]['taskStartTime'] = startTimeString;
                            }
                        }

                        //判断任务地点是否为空，若为空，则显示“无”
                        response[i]['taskPlace'] = (response[i]['taskPlace'] == '')? '无': response[i]['taskPlace'];

                        console.log('新加的玩意儿：'+response[i]['taskStartTime']);

                        //判断任务是否已开始
                        if(response[i]['taskStatus'] != 0) {
                            hasStartedList.push(true);
                        } else {
                            hasStartedList.push(false);
                        }

                        //为已结束任务添加删除线
                        if(response[i]['taskStatus'] == 2) {
                            delStyleList.push("text-decoration:line-through");
                        } else {
                            delStyleList.push('');
                        }
                    }
                    this.setData({
                        tasks: response,
                        // endTimeList: startTimeList,
                        deleteStyleList: delStyleList,
                        hasStarted: hasStartedList
                    });

                    console.log('hhafhafhaihfiahfiahf'+this.data.isToday);
                    if(this.data.isToday==true) {
                        this.setData({
                            endTimeList: startTimeList,
                        });
                        //每隔一秒刷新倒计时，直至所有倒计时都为0
                        this.interval = setInterval(() => {
                            if(this.getTimeSpan(this.data.endTimeList, this.data.hasStarted) <= 0) {
                                this.interval && clearInterval(this.interval);
                            }
                        }, 1000);
                    }

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
    getTasks: function(e) {
        // this.setData('isToday', (e.detail.name == 'today' )? true: false);
        this.setData({
            isToday: (e.detail.name == 'today' )? true: false,
            activeName: e.detail.name,
            tasks: []
        });
        swan.request({
            url: 'https://www.hedon.wang/project/task/' + e.detail.name,
            method: 'GET',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            // success: res => {
            //     try {
            //         var response = res.data.data;
            //         for(var i = 0; i < response.length; i++) {
            //             response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(11, 16);
            //         }
            //         this.setData({
            //             activeName: e.detail.name,
            //             tasks: response
            //         });
            //     }
            //     catch (error) {
            //         console.log(error);
            //     }
            // }
            success: res => {
                try {
                    var response = res.data.data;
                    //防止引用被修改
                    response = JSON.parse(JSON.stringify(response));
                    var startTimeString = '';
                    var startTimeList = []; //临时存放定时器结束时间，即任务开始时间
                    var delStyleList = []; //临时存放删除线样式
                    var hasStartedList = []; //临时存放是否结束标志
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);


                        console.log('新加的玩意儿：'+this.data.activeName);
                        //判断是否为待办任务，若是，则显示日期
                        if(this.data.activeName == 'todo') {
                            console.log('这是todo。。。。。。。。。。。。')
                            if(response[i]['taskStartTime'].substring(0, 16) !=
                                response[i]['taskPredictedFinishTime'].substring(0, 16)) {
                                response[i]['taskStartTime'] = response[i]['taskStartTime'].substring(0, 16).replace(/T/, ' ') + '-' + response[i]['taskPredictedFinishTime'].substring(11, 16);
                            } else {
                                response[i]['taskStartTime'] = response[i]['taskPredictedFinishTime'].substring(0, 16).replace(/T/, ' ');
                            }
                        } else {
                            //判断任务开始时间和结束时间是否一致
                            if(startTimeString != response[i]['taskPredictedFinishTime'].substring(11, 16)) {
                                response[i]['taskStartTime'] = startTimeString + '-' + response[i]['taskPredictedFinishTime'].substring(11, 16);
                            } else {
                                response[i]['taskStartTime'] = startTimeString;
                            }
                        }

                        //判断任务地点是否为空，若为空，则显示“无”
                        response[i]['taskPlace'] = (response[i]['taskPlace'] == '')? '无': response[i]['taskPlace'];


                        console.log('新加的玩意儿：'+response[i]['taskStartTime']);

                        //判断任务是否已开始
                        if(response[i]['taskStatus'] != 0) {
                            hasStartedList.push(true);
                        } else {
                            hasStartedList.push(false);
                        }

                        //为已结束任务添加删除线
                        if(response[i]['taskStatus'] == 2) {
                            delStyleList.push("text-decoration:line-through");
                        } else {
                            delStyleList.push('');
                        }
                    }
                    this.setData({
                        tasks: response,
                        // endTimeList: startTimeList,
                        deleteStyleList: delStyleList,
                        hasStarted: hasStartedList
                    });

                    console.log('hhafhafhaihfiahfiahf'+this.data.isToday);
                    if(this.data.isToday) {
                        this.setData({
                            endTimeList: startTimeList,
                        });
                        //每隔一秒刷新倒计时，直至所有倒计时都为0
                        this.interval = setInterval(() => {
                            if(this.getTimeSpan(this.data.endTimeList, this.data.hasStarted) <= 0) {
                                this.interval && clearInterval(this.interval);
                            }
                        }, 1000);
                    }

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
            url: 'https://www.hedon.wang/project/task/today',
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
                    var delStyleList = []; //临时存放删除线样式
                    var hasStartedList = []; //临时存放是否结束标志
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);
                        response[i]['taskStartTime'] = startTimeString;

                        //判断任务开始时间和结束时间是否一致
                        if(startTimeString != response[i]['taskPredictedFinishTime'].substring(11, 16)) {
                            response[i]['taskStartTime'] = startTimeString + '-' + response[i]['taskPredictedFinishTime'].substring(11, 16)
                        }
                        console.log('新加的玩意儿：'+response[i]['taskStartTime']);

                        //判断任务地点是否为空，若为空，则显示“无”
                        response[i]['taskPlace'] = (response[i]['taskPlace'] == '')? '无': response[i]['taskPlace'];

                        //判断任务是否已开始
                        if(response[i]['taskStatus'] != 0) {
                            hasStartedList.push(true);
                        } else {
                            hasStartedList.push(false);
                        }

                        //为已结束任务添加删除线
                        if(response[i]['taskStatus'] == 2) {
                            delStyleList.push("text-decoration:line-through");
                        } else {
                            delStyleList.push('');
                        }
                    }
                    this.setData({
                        tasks: response,
                        endTimeList: startTimeList,
                        deleteStyleList: delStyleList,
                        hasStarted: hasStartedList
                    });

                    //每隔一秒刷新倒计时，直至所有倒计时都为0
                    this.interval = setInterval(() => {
                        if(this.getTimeSpan(this.data.endTimeList, this.data.hasStarted) <= 0) {
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
    getTimeSpan: function(list, started) {
        // console.log("进来了。。。")
        let offset = new Date().getTimezoneOffset();
        let nowTime = new Date().getTime() + offset * 60 * 1000;//现在时间（时间戳）
        let tmpList = []; //临时存放倒计时列表中的各个元素
        let maxTime = 0;
        for(var i = 0; i < list.length; i++) {

            //如果任务已经开始，就不进行倒计时
            if(started[i] == true) {
                tmpList.push("00:00:00");
                continue;
            }

            // console.log("进入循环。。。")
            let endTime = new Date(list[i]).getTime() + offset * 60 * 1000;//结束时间（时间戳）
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

    /**
     * 通过一句话创建任务
     */
    createTask: function(e){

        console.log("订阅结果：" + e.detail.message);

        if(e.detail.message != 'success' &&
           e.detail.message != '调用成功' &&
           e.detail.message != 'succ'){
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
            url: 'https://www.hedon.wang/project/task/createBySentence',
            // url: 'http://localhost:9527/project/task/createBySentence',
            method: 'POST',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            data: {
                taskFormId: e.detail.formId,
                taskInfo:this.data.voiceRecognizeContent
            },
            success: res => {
                //创建成功
                if(res.data.code == '1000'){
                    //任务信息体
                    let didaTask = res.data.data.didaTask
                    console.log("res = " + res.data.data.didaTask)
                    //刷新订阅ID，防止每次的 formID 都一样
                    app.setSubScribeId(res.data.data.subScribeId)
                    this.setData({
                        subScribeId: app.data.subScribeId
                    })
                    console.log("app's subScribeId = " + app.data.subScribeId);
                    console.log("home's subScribeId = " + this.data.subScribeId);
                    //获取剩余时间
                    let timeLeft = this.getTimeLeft(didaTask.taskRemindTime);
                    //初始化参数
                    this.setData({
                        taskId: didaTask.taskId,
                        taskRemindStr: `将在${timeLeft}后提醒你${didaTask.taskContent}\r\n`,
                        taskRemarkStr: `[备注]在${didaTask.taskPlace},${didaTask.taskStartTime.substring(0,10) +' ' +didaTask.taskStartTime.substring(11,16)}\r\n`,
                        predictedConsumedTimeStr: '',
                        conflictTaskStr: ''
                    });
                    //预测耗时
                    if(this.data.hasPredicedTime){
                        this.setData({
                            predictedConsumedTimeStr: '预计耗时：' + '2h' + '\r\n'
                        })
                    };
                    //时间冲突
                    if(this.data.timeConflict){
                        this.setData({
                            conflictTaskStr: '小程序检测出您在该时间段内有任务\r\n'
                        })
                    }

                    //将voiceRecognizeContent置空
                    this.setData({
                        voiceRecognizeContent: ''
                    });

                    //显示模态框进行提示
                    swan.showModal({
                        title: '创建成功',
                        content:
                        // '将在'+'30分钟'+'后提醒你'+'吃饭'+'\r\n'
                        this.data.taskRemindStr
                        // +'[备注]在'+'银泰'+'20:00'+'\r\n'
                        + this.data.taskRemarkStr
                        // +'预计耗时：'+'30min'+'\r\n'
                        + this.data.predictedConsumedTimeStr
                        // +'小程序检测出您在该时间段内有'+'学习'+'任务',
                        + this.data.conflictTaskStr,
                        showCancel: true,
                        cancelText: '修改',
                        cancelColor: '#ff0000',
                        confirmText: '确定',
                        success: res=>{
                            //重新读取所有任务
                            // this.getTodayTasks()
                            this.getTasksByParam(this.data.activeName);
                            if(res.cancel){
                                //跳转到详情页
                                swan.navigateTo({
                                    url:'/pages/modification/modification?taskId='+this.data.taskId
                                });
                            }
                        }
                    });
                }else{
                    swan.showModal({
                        title: '创建失败',
                        content: res.data.message,
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#',
                    });
                }

            }
        });
    },

    //创建任务，显示模态框，确认任务信息；已废弃
    verifyTask: function(e) {

        //判断任务内容和任务开始时间是否为空
        if(this.data.taskContent == null || this.data.taskContent == ''
        || this.data.taskStartTime == null || this.data.taskStartTime == '') {
            swan.showToast({
                title: '缺少任务内容或开始时间',
                icon: 'none',
                image: '',
                duration: 2400,
            });
            return;
        }

        //判断任务开始时间和结束时间是否有效
        if(!this.timeValid(this.data.taskStartTime, this.data.taskPredictedFinishTime)) {
            swan.showToast({
                title: '任务开始时间需早于结束时间',
                icon: 'none',
                duration: 2400,
            });
            return;
        }


        console.log("订阅结果：" + e.detail.message);

        if(e.detail.message != 'success' &&
           e.detail.message != '调用成功' &&
           e.detail.message != 'succ'){
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
            url: 'https://www.hedon.wang/project/task/create',
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
                    let timeLeft = this.getTimeLeft(res.data.data.taskRemindTime);
                    //初始化参数
                    this.setData({
                        taskId: res.data.data.taskId,
                        taskRemindStr: `将在${timeLeft}后提醒你${this.data.taskContent}\r\n`,
                        taskRemarkStr: `[备注]在${this.data.taskPlace},${this.data.taskStartTime.substring(0,10) +' ' +this.data.taskStartTime.substring(11,16)}\r\n`,
                        predictedConsumedTimeStr: '',
                        conflictTaskStr: ''
                    });
                    //预测耗时
                    if(this.data.hasPredicedTime){
                        this.setData({
                            predictedConsumedTimeStr: '预计耗时：' + '2h' + '\r\n'
                        })
                    };
                    //时间冲突
                    if(this.data.timeConflict){
                        this.setData({
                            conflictTaskStr: '小程序检测出您在该时间段内有任务\r\n'
                        })
                    }
                    //显示模态框进行提示
                    swan.showModal({
                        title: '创建成功',
                        content:
                        // '将在'+'30分钟'+'后提醒你'+'吃饭'+'\r\n'
                        this.data.taskRemindStr
                        // +'[备注]在'+'银泰'+'20:00'+'\r\n'
                        + this.data.taskRemarkStr
                        // +'预计耗时：'+'30min'+'\r\n'
                        + this.data.predictedConsumedTimeStr
                        // +'小程序检测出您在该时间段内有'+'学习'+'任务',
                        + this.data.conflictTaskStr,
                        showCancel: true,
                        cancelText: '修改',
                        cancelColor: '#ff0000',
                        confirmText: '确定',
                        success: res=>{
                            //重新读取所有任务
                            this.getTodayTasks()
                            if(res.cancel){
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

    //检验开始时间和结束时间是否有效
    timeValid: function(time1, time2) {
        var oDate1 = new Date(time1);
        var oDate2 = new Date(time2);
        if(oDate1.getTime() <= oDate2.getTime()) {
            return true;
        } else{
            return false;
        }
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
        app.setPreTab(this.data.activeName);
        swan.navigateTo({
            url: `/pages/modification/modification?taskId=${e.currentTarget.id}`
        });
    },


    //字符串('yyyy-MM-dd hh:mm')转日期对象
    strToDate: function(str) {
        //月份需减1
        return new Date(str.substring(0, 4), str.substring(5, 7) - 1, str.substring(8, 10), str.substring(11, 13), str.substring(14, 16));
    },


    //计算剩余时间
    getTimeLeft: function(start){
        let nowTime  = new Date().getTime();
        let startTime = this.strToDate(start).getTime();
        let minutes = (startTime - nowTime)/1000/60;
        let hour = parseInt(minutes / 60) ;
        let minute = parseInt(minutes % 60);
        if(hour > 0){
            return hour+'小时'+ minute +'分钟';
        }
        if(hour == 0){
            return minute +'分钟';
        }
    },

    //语音识别输入
    voiceRecognize: function() {
        console.log("开始语音识别。。。");
        this.setData("showVoiceRecognizePanel", true);
        // this.getVoiceRecognizeContent("hh");
    },
    //获取语音识别内容
    getVoiceRecognizeContent: function(e) {
        console.log("识别到的内容。。。")
        //去除结尾的句号
        var content = e.content.substring(0, e.content.length - 1);
        this.setData("voiceRecognizeContent", this.data.voiceRecognizeContent + content);
    },
    //关闭语音识别面板
    cancelendVoiceRecognize: function() {
        console.log("关闭语音识别面板。。。");
    },
    //多行文本框输入内容改变时
    taskSentenceChange: function(e) {
        this.setData("voiceRecognizeContent", e.detail.value);
    },


    //下拉刷新
    onPullDownRefresh: function() {
        // 监听用户下拉动作
        swan.startPullDownRefresh({
            success: res => {
                swan.showNavigationBarLoading();
                this.onLoad();
                setTimeout(() => {
                    swan.hideNavigationBarLoading();
                    swan.stopPullDownRefresh();
                }, 800);
            },
            fail: res => {
                swan.showToast({
                    title: '刷新失败',
                    icon: 'none',
                    duration: 2000,
                });
            },
        });
    },
});
