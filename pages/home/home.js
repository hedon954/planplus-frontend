var app = getApp();

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
        realStartTimeList: [], //定时器开始时间——即各任务实际开始时间
        countDownList: [], //倒计时时间
        maxTimeLeft: 0, //各个任务中倒计时剩余的最大值
        deleteStyleList: [], //删除线样式
        fontStyleList: [], //计时字体颜色样式
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
        isNewUser: 1,

        /**
         * 存放每个任务的状态，用于切换开始/结束/完成按钮以及倒计时/计时
         */
        statusList: [],

        /**
         * 计时列表，记录任务已开始时间，仅针对正在进行中的任务
         */
        countList: [],
    },

    /**
     * 当页面加载时
     */
    onLoad: function() {
        //先检查是否已登录
        this.checkLoginOrNot();
        //已登录->查询今日任务
        this.setData({
            activeName: (app.data.preTab == '')? 'today': app.data.preTab,
            isToday: (app.data.preTab == '' || app.data.preTab == 'today')? true: false
        });
        //查询今日任务
        this.getTasksByParam(this.data.activeName);
    },

    onReady: function(){
        //检查是否有新版本
        const updateManager = swan.getUpdateManager();
        updateManager.onCheckForUpdate(res=>{
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                swan.showModal({
                    title: '更新提醒',
                    content: '最新版已上线啦！\r\n点击右上角的三个点重启小程序就可以更新~',
                    showCancel: false,
                    confirmText: '确定',
                });
            }
        })
        //检查是否为新用户
        console.log("isNewUser" + app.data.isNewUser)
        if(app.data.isNewUser == 1){
            swan.showModal({
                title: '欢迎来到 PlanPlus',
                content: '请问是否需要进入用户指引界面？',
                showCancel: true,
                cancelText: '不需要',
                confirmText: '需要',
                success: res => {
                    if(res.confirm){
                        this.setUserToOld();
                        app.setIsNewUser(0);
                        swan.navigateTo({
                            url: '/pages/user-help-steps/user-help-steps'
                        });
                    }
                    if(res.cancel){
                        this.setUserToOld();
                        app.setIsNewUser(0);
                    }
                },
            });
        }
    },

    /**
     * 页面每次展示都要执行的函数
     */
    onShow: function() {
        swan.setPageInfo({
            title: '主界面——PlanPlus时间管理大师',
            keywords: 'PlanPlus,时间管理,待办,创建任务,查看待办,主界面',
            description: '该界面是小程序的主要操作界面，该页面的功能包括任务的创建、今日明日任务的查询，还可以对所有的待办事项进行查看',
            releaseDate: '',
            image: '',
            video: ''
        });

        this.setData({
            // activeName: 'today',
            // isToday: true,
            activeName: (app.data.preTab == '')? 'today': app.data.preTab,
            isToday: (app.data.preTab == '' || app.data.preTab == 'today')? true: false,
            subScribeId: app.data.subScribeId
        });
        console.log("onShow...")
        // if(!app.data.taskChanged) {
        //     return;
        // }
        // //读取今日任务
        // this.getTodayTasks()
        console.log('onshow:hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'+this.data.activeName+this.data.isToday);
        this.getTasksByParam(this.data.activeName);
    },

    /**
     * 页面隐藏时执行的函数
     */
    onHide: function(){
        app.setPreTab(this.data.activeName);
    },

    /**
     * 将用户设置为老用户
     */
    setUserToOld:function(){
        swan.request({
            url: 'https://www.hedon.wang/project/user/setUserToOld',
            // url: 'http://localhost:443/project/user/setUserToOld',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'PUT',
            responseType: 'text',
            success: res => {
                console.log(res);
                //已登录
                if(res.data.code == 1000){
                    console.log("setUserToOld 发送成功")
                    this.setData({
                        isNewUser: 0
                    })
                }else{
                    console.log("setUserToOld 发送错误")
                }
            }
        });
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
                    console.log(res.data)
                    this.setData({
                        isNewUser: res.data.data.new
                    })
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
                if(res.data.code == 1000){
                    var response = res.data.data;


                    var startTimeString = '';
                    var startTimeList = [];         //临时存放定时器结束时间，即任务开始时间
                    var startRealTimeList = [];     //临时存放定时器开始时间，即任务实际开始时间
                    var delStyleList = [];          //临时存放删除线样式
                    var fontColorList = [];         //临时存放计时颜色
                    var hasStartedList = [];        //临时存放是否结束标志
                    var statusTmpList = [];         //临时存放任务状态

                    for(var i = 0; i < response.length; i++) {

                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);
                        statusTmpList.push(response[i]['taskStatus']);

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

                        //为进行中任务计时添加颜色
                        if(response[i]['taskStatus'] == 1) {
                            fontColorList.push("color: #ababab");
                            startRealTimeList.push(response[i]['taskRealStartTime'].substring(0, 19));
                        } else {
                            fontColorList.push("color: #f68686");
                            startRealTimeList.push("");
                        }
                    }

                    this.setData({
                        tasks: response,
                        deleteStyleList: delStyleList,
                        fontStyleList: fontColorList,
                        hasStarted: hasStartedList,
                        statusList: statusTmpList
                    });


                    if(this.data.isToday==true) {
                        this.setData({
                            endTimeList: startTimeList,
                            realStartTimeList: startRealTimeList
                        });
                        //每隔一秒刷新倒计时，直至所有倒计时都为0
                        this.interval = setInterval(() => {
                            if(this.getTimeSpan(this.data.endTimeList, this.data.realStartTimeList, this.data.hasStarted, this.data.statusList) <= 0 && !this.data.statusList.includes(1)) {
                                this.interval && clearInterval(this.interval);
                            }
                        }, 1000);
                    }

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

            success: res => {
                try {
                    var response = res.data.data;
                    //防止引用被修改
                    response = JSON.parse(JSON.stringify(response));
                    var startTimeString = '';
                    var startTimeList = []; //临时存放定时器结束时间，即任务开始时间
                    var startRealTimeList = []; //临时存放定时器开始时间，即任务实际开始时间
                    var delStyleList = []; //临时存放删除线样式
                    var fontColorList = []; //临时存放计时颜色
                    var hasStartedList = []; //临时存放是否结束标志
                    var statusTmpList = []; //临时存放任务状态
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);

                        statusTmpList.push(response[i]['taskStatus']);

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

                        //为进行中任务计时添加颜色
                        if(response[i]['taskStatus'] == 1) {
                            fontColorList.push("color: #ababab");
                            startRealTimeList.push(response[i]['taskRealStartTime'].substring(0, 19));
                        } else {
                            fontColorList.push("color: #f68686");
                            startRealTimeList.push("");
                        }
                    }
                    this.setData({
                        tasks: response,
                        // endTimeList: startTimeList,
                        deleteStyleList: delStyleList,
                        fontStyleList: fontColorList,
                        hasStarted: hasStartedList,
                        statusList: statusTmpList
                    });

                    console.log('hhafhafhaihfiahfiahf'+this.data.isToday);
                    if(this.data.isToday) {
                        this.setData({
                            endTimeList: startTimeList,
                            realStartTimeList: startRealTimeList
                        });
                        //每隔一秒刷新倒计时，直至所有倒计时都为0
                        this.interval = setInterval(() => {
                            if(this.getTimeSpan(this.data.endTimeList, this.data.realStartTimeList, this.data.hasStarted, this.data.statusList) <= 0 && !this.data.statusList.includes(1)) {
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
                    var startRealTimeList = []; //临时存放定时器开始时间，即任务实际开始时间
                    var delStyleList = []; //临时存放删除线样式
                    var fontColorList = []; //临时存放计时颜色
                    var hasStartedList = []; //临时存放是否结束标志
                    var statusTmpList = []; //临时存放任务状态
                    for(var i = 0; i < response.length; i++) {
                        startTimeList.push(response[i]['taskStartTime'].substring(0, 19));
                        startTimeString = response[i]['taskStartTime'].substring(11, 16);
                        response[i]['taskStartTime'] = startTimeString;

                        statusTmpList.push(response[i]['taskStatus']);

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

                        //为进行中任务计时添加颜色
                        if(response[i]['taskStatus'] == 1) {
                            fontColorList.push("color: #ababab");
                            startRealTimeList.push(response[i]['taskRealStartTime'].substring(0, 19));
                        } else {
                            fontColorList.push("color: #f68686")
                            startRealTimeList.push("");
                        }
                    }
                    this.setData({
                        tasks: response,
                        endTimeList: startTimeList,
                        realStartTimeList: startRealTimeList,
                        deleteStyleList: delStyleList,
                        fontStyleList: fontColorList,
                        hasStarted: hasStartedList,
                        statusList: statusTmpList
                    });

                    //每隔一秒刷新倒计时，直至所有倒计时都为0
                    this.interval = setInterval(() => {
                        if(this.getTimeSpan(this.data.endTimeList, this.data.realStartTimeList, this.data.hasStarted, this.data.statusList) <= 0 && !this.data.statusList.includes(1)) {
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
    getTimeSpan: function(endTimeList, realStartTimeList, started, status) {

        let offset = new Date().getTimezoneOffset();
        let nowTime = new Date().getTime() + offset * 60 * 1000;//现在时间（时间戳）
        let tmpList = []; //临时存放倒计时列表中的各个元素
        let countTmpList = []; //临时存放计时列表中的各个元素
        let maxTime = 0;
        for(var i = 0; i < endTimeList.length; i++) {

            //如果任务已经开始，就不进行倒计时
            if(started[i] == true && status[i] != 1) {
                tmpList.push("");
                countTmpList.push("");
                // console.log("不计时。。。")
                continue;
            } else if(started[i] == true && status[i] == 1) {
                tmpList.push("");

                // console.log("准备计算已开始时间。。，");

                //计算任务已开始时间
                let startTime = new Date(realStartTimeList[i]).getTime() + offset * 60 * 1000;//开始时间（时间戳）
                let time = nowTime - startTime;//已开始时间，以毫秒为单位
                let formatTime = this.timeFormat(time);

                countTmpList.push(formatTime.hh + ':' + formatTime.mm + ':' + formatTime.ss);

                continue;
            }

            // console.log("进入循环。。。")
            let endTime = new Date(endTimeList[i]).getTime() + offset * 60 * 1000;//结束时间（时间戳）
            let time = endTime - nowTime;//剩余时间，以毫秒为单位
            let formatTime = this.timeFormat(time);

            //若倒计时为00：00：00，则不显示
            if(formatTime.hh == '00' && formatTime.mm == '00' && formatTime.ss == '00') {
                tmpList.push("");
            } else {
                tmpList.push(formatTime.hh + ':' + formatTime.mm + ':' + formatTime.ss);
            }

            countTmpList.push("");
            // console.log("=================================================");

            // console.log("跳出循环。。。")
            maxTime = time > maxTime? time: maxTime;
        }
        // console.log("结束循环。。。")
        this.setData({
            countDownList: tmpList,
            countList: countTmpList
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
        //请求授权订阅
        if(e.detail.message != 'success' &&
           e.detail.message != '调用成功' &&
           e.detail.message != 'succ'){
            swan.showToast({
                title: '请授权！',
                icon: 'none',
            });
            return;
        }
        console.log("formId = " + e.detail.formId)
        //发送请求
        swan.request({
            url: 'https://www.hedon.wang/project/task/createBySentence',
            method: 'POST',
            header: {
                'Authorization': 'bearer ' + app.data.access_token
            },
            data: {
                taskFormId: e.detail.formId,
                taskInfo:this.data.voiceRecognizeContent
            },
            success: res => {
                console.log("创建完任务之后："+res.data.data);
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
                        // taskRemarkStr: `[地点]${didaTask.taskPlace}\r\n`,
                        predictedConsumedTimeStr: '',
                        conflictTaskStr: ''
                    });
                    //预测耗时
                    if(res.data.data.hasPredicted == 1){
                        this.setData({
                            predictedConsumedTimeStr: '==================\r\n======耗时推荐=====\r\n：' + res.data.data.timeConsuming + '（根据您以往数据进行推荐）\r\n'
                        })
                    };
                    //时间冲突
                    if(res.data.data.hasConflict == 1){
                        this.setData({
                            conflictTaskStr: '==================\r\n======冲突检测=====\r\n检测出该时间段内有以下任务：\r\n' + res.data.data.conflictTasks + '\r\n'
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
                        content: res.data.message +".",
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#',
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


    //重新读取列表
    updateList: function(e) {
        this.getTasksByParam(this.data.activeName);
    },
});
