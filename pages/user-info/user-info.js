Page({
    data: {
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


    onLoad: function (options) {
        console.log(options);
        //先检查是否有登录
        if(options.userId == undefined || options.userId == null){
            //没有登录就提示信息，并跳转到登录界面
            swan.showModal({
                title: '未登录',
                content: '请先登录！'
            });
            swan.redirectTo({
                url: '/pages/login/login'
            });
        }else{
            //有登录的话就拿出 id，查询用户信息
            const userId = options.userId;
            swan.request({
                url: 'http://182.61.131.18:10030/project/user/'+userId,
                method:"GET",
                header: {
                    'content-type': 'application/json'
                },
                dataType: 'json',
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
            });
        }
        // 监听页面加载的生命周期函数

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