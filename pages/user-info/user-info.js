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

    goToDetail:function(){
        swan.navigateTo({
            url: '../../pages/user-info-detail/user-info-detail'
        });
    },

    getuserInfo:function(){
        swan.request({
            //检查是否已经登录
            url: 'http://localhost:9527/project/login/checkLogin',
            // url: 'http://182.61.131.18:9527/project/login/checkLogin',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            responseType: 'text',
            success: res => {
                console.log(res);
                //已登录
                if(res.data.code == '1000'){
                    //设置当前用户ID
                    this.setData({
                        currentUserId: res.data.data,
                    })
                    console.log("hhhhh"+res.data)
                    //读取当前用户数据
                    swan.request({

                        url: 'http://localhost:9527/project/user/info',
                        // url: 'http://182.61.131.18:9527/project/user/info',
                        method: 'GET',
                        header:{
                            'Authorization': 'bearer '+app.data.access_token
                        },
                        responseType: 'text',
                        success:res=>{
                            console.log("①");
                            console.log(res.data.data);
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
                                case 1:
                                    this.setData(
                                        {
                                            userGenderText:"男",
                                        }
                                    );
                                    break;
                                default:
                                    this.setData(
                                        {
                                            userGenderText:"未知",
                                        }
                                    );
                                    break;
                            }
                        }
                    })
                    console.log("当前用户ID："+this.data.currentUserId)
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
                    })
                }
            },
            fail: res => {
                 //未登录
                 swan.showModal({
                    // 提示的标题
                    title: '身份过期',
                    // 提示的内容
                    content: '身份过期，请先登录！',
                    // 是否显示取消按钮 。
                    showCancel: false,

                });
            }
        })
    }
});