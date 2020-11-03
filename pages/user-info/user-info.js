const app = getApp();

Page({
    data: {
        currentUserId: null,
        userId:1,
        userNickname:"kk",
        userGender:-1,
        userBirthday:"",
        userAvatarUrl:"",
        userGenderText:""
    },

    goToDetail:function(id){
        swan.navigateTo({
            url: '../../pages/user-info-detail/user-info-detail'
        });
    },

    getUserInfo:function(e){
        swan.request({
            url: 'http://127.0.0.1:10030/project/user/2',
            method:"GET",
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
            }
        });
    },


    onLoad: function () {
        console.log("App里的token是："+app.data.access_token)
        //检查是否已经登录
        swan.request({
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

    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    }
});