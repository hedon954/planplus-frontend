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

    goToDetail:function(id){
        swan.navigateTo({
            url: '../../pages/user-info-detail/user-info-detail'
        });
    },


    /**
     * 页面加载时
     */
    onLoad: function () {
        //读取当前用户数据
        swan.request({
            url: 'http://localhost:9527/project/user/info',
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
    }
});