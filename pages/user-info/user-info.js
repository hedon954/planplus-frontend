const app = getApp();

Page({
    data: {
        currentUserId: null,
        userId:1,
        userNickname:"kk",
        userGender:-1,
        userBirthday:"",
        userAvatarUrl:"http://localhost:9527/img/1/1.png",
        userGenderText:"未知",
        userAge:"",
    },


    onLoad: function () {
        console.log("App里的token是："+app.data.access_token)
        this.getuserInfo();
    },

    onShow: function() {
        // 监听页面显示的生命周期函数
        if(app.data.infoChanged){
            this.getuserInfo();
        }
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
        swan.navigateTo({
            url: '../../pages/user-info-detail/user-info-detail'
        });
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
            url: 'http://182.61.131.18:9527/project/user/info',
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
        // 监听页面显示的生命周期函数
            this.setData({hasHiddenTabBar: false});
            swan.showTabBar({
                //animation: true, // animation 为 true 时，建议在真机上看效果，工具暂不支持
                success: res => {
                    console.log('showTabBar success');
                },
                fail: err => {
                    console.log('showTabBar fail', err);
                }
            })
            if(app.data.infoChanged){
                this.getInfo();
                app.setInfoChanged(fasle);
            }
    },

    logout:function(){
        this.setData({
            access_token:"",
        })
        //跳转到登录界面
        swan.redirectTo({
            url: '/pages/login/login'
        })
    },
});