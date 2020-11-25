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
        userAge:"18岁",
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

    setConstellation:function(){
        var birthday = new Date()
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
    }
});