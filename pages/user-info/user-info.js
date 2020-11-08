Page({
    data: {
        userId:1,
        userNickname:"kk",
        userGender:-1,
        userBirthday:"",
        userAvatarUrl:"",
        userGenderText:"未知"
    },

    goToDetail:function(id){
        swan.navigateTo({
            url: '../../pages/user-info-detail/user-info-detail'
        });
    },


    onLoad: function () {
        // 监听页面加载的生命周期函数
        swan.request({
            url: 'http://127.0.0.1:10030/project/user/2',
            method:"GET",
            success:res=>{
                this.setData(
                    {
                        userNickname:res.data.data.userNickname,
                        userAvatarUrl:res.data.data.userAvatarUrl,
                        userGender:res.data.data.userGender,
                        userBirthday:res.data.data.userBirthday,
                    }
                )
                console.log(this.data.userAvatarUrl);
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