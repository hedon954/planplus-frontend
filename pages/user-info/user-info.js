const app = getApp();

Page({
    data: {
        currentUserId: null,
        userId:1,
        userNickname:"kk",
        userGender:-1,
        userBirthday:"",
        userAvatarUrl:"",
        userGenderText:"未知",
        userHasBaiduInfo : 0,
        userAge:"",
        commonUseOperationList: [
            {
                title: '所有任务',
                function: 'goToAllTask',
                imgSrc: '/images/checklist.png',
            }
        ],
        otherUseOperationList: [
            {
                title: '新手指南',
                function: 'goToUserHelp',
                imgSrc: '/images/guide.png',
            },
            {
                title: '使用帮助',
                function: 'goToHelpPage',
                imgSrc: '/images/help.png',
            },
            {
                title: '开发计划',
                function: 'goToDevelopTimeLine',
                imgSrc: '/images/feedback.png',
            },
            {
                title: '使用反馈',
                function: 'goToFeedback',
                imgSrc: '/images/feedback.png',
            },
        ],
    },


    /**
     * 跳转到图片界面
     */
    goToUserHelp: function() {
        swan.navigateTo({
            url: '../../pages/user-help/user-help'
        });
    },

    /**
     * 跳转到帮助页面
     */
    goToHelpPage:function(){
        swan.navigateTo({
            url: '../../pages/help/help'
        });
    },

    /**
     * 跳转到详情页面
     */
    goToDetail:function(){
        if(this.data.userHasBaiduInfo == 1){
            swan.navigateTo({
                url: '../../pages/user-info-detail/user-info-detail'
            });
        }
    },

    goToDevelopTimeLine:function(){
        swan.navigateTo({
            url: '../../pages/develop-timeline/develop-timeline'
        })
    },

    /**
     * 跳转到反馈页面
     */
    goToFeedback:function(){
        swan.navigateTo({
            url:'../../pages/feedback/feedback'
        });
    },

    /**
     * 跳转到所有任务页面
     */
    goToAllTask:function(){
        swan.navigateTo({
            url:'../../pages/all-tasks/all-tasks'
        });
    },

    /**
     * 页面加载时
     */
    onLoad: function () {
        this.getInfo();
    },

    getInfo:function(){
        //读取当前用户数据
        swan.request({
            // url: 'http://localhost:9527/project/user/info',
            url: 'https://www.hedon.wang/project/user/info',
            method: 'GET',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            responseType: 'text',
            success:res=>{
                this.setData(
                    {
                        userNickname:res.data.data.userNickname,
                        userAvatarUrl:res.data.data.userAvatarUrl,
                        userGender:res.data.data.userGender,
                        userAge:this.getAge(res.data.data.userBirthday.substring(0,10))+"岁",
                        userHasBaiduInfo: res.data.data.userHasBaiduInfo
                    }
                )
                switch(this.data.userGender)
                {
                    case 0:
                        this.setData(
                            {
                               userGenderText:"女",
                            }
                        );
                        break;
                    default:
                        this.setData(
                            {
                                userGenderText:"男",
                            }
                        );
                        break;
                }
            }
        })
    },

    //计算年龄
    getAge:function(strAge) {
        var birArr = strAge.split("-");
        var birYear = birArr[0];
        var birMonth = birArr[1];
        var birDay = birArr[2];

        d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1; //记得加1
        var nowDay = d.getDate();
        var returnAge;

        if (birArr == null) {
            return false
        };
        var d = new Date(birYear, birMonth - 1, birDay);
        if (d.getFullYear() == birYear && (d.getMonth() + 1) == birMonth && d.getDate() == birDay) {
            if (nowYear == birYear) {
                returnAge = 0;
            } else {
                var ageDiff = nowYear - birYear;
                if (ageDiff > 0) {
                    if (nowMonth == birMonth) {
                        var dayDiff = nowDay - birDay;
                        if (dayDiff < 0) {
                            returnAge = ageDiff - 1;
                        } else {
                            returnAge = ageDiff;
                        }
                    } else {
                        var monthDiff = nowMonth - birMonth;
                        if (monthDiff < 0) {
                            returnAge = ageDiff - 1;
                        } else {
                            returnAge = ageDiff;
                        }
                    }
                } else {
                    return  "出生日期晚于今天，数据有误"; //返回-1 表示出生日期输入错误 晚于今天
                }
            }
            return returnAge;
        } else {
            return ("输入的日期格式错误！");
        }
    },

    /**
     * 页面加载时
     */
    onShow: function() {
        console.log("user-info onshow")
        if(app.data.infoChanged){
            this.getInfo();
            app.setInfoChanged(false);
        }
    },

    /**
     * 退出登录
     */
    logout: function(){
        app.setAccessToken("");
        app.setInfoChanged(true);
        //跳转到登录界面
        swan.reLaunch({
            url: '/pages/login/login'
        })
    },

    /**
     * 同步百度信息
     */
    synchronizeUserInfo(e) {
        swan.request({
            url: 'https://www.hedon.wang/project/user/info',
            method: 'PUT',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            data:{
                userNickname: e.detail.userInfo.nickName,
                userAvatarUrl: e.detail.userInfo.avatarUrl
            },
            responseType: 'text',
            success:res=>{
                if(res.data.code == 1000){
                    this.getInfo()
                }
            }
        })
    },
});