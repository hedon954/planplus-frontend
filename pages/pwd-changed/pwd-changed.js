const app = getApp();

Page({
    data: {
        newPassword:"",
        newPasswordConfirm:"",
        oldPassword:"",
    },

    bindNewPwdInput(e) {
        this.setData({
            newPassword: e.detail.value
        });
    },

    bindOldPwdInput(e) {
        this.setData({
            oldPassword: e.detail.value
        });
    },

    bindnewPasswordConfirm(e) {
        this.setData({
            newPasswordConfirm: e.detail.value
        });
    },

    btnConfirm:function(){
        if(this.data.oldPassword!=""&&this.data.newPassword!=""&&this.data.newPasswordConfirm!=""){
            if(this.data.newPassword!=this.data.newPasswordConfirm)
            {
                swan.showToast({
                    title: '两次输入的新密码不一致',
                    icon:'none',
                });
            }
            else{
                console.log("kkkkkkkkkkkk");
                swan.request({
                    url: 'http://182.61.131.18:9527/project/user/pwd',
                    // url: 'http://localhost:9527/project/user/pwd',
                        method: 'PUT',
                        header:{
                            'Authorization': 'bearer '+app.data.access_token
                        },
                        data:{
                            oldPwd:this.data.oldPassword,
                            newPwd:this.data.newPassword,
                        },
                        responseType: 'text',
                        success:res=>{
                            console.log("成功获取数据");
                            if(res.data.code == 1000){
                                swan.showToast({
                                title: '修改成功'
                                })
                            }
                            else{
                                swan.showToast({
                                    title: '修改失败'
                                })
                            }
                            this.setData({
                                oldPassword:"",
                                newPassword:"",
                                newPasswordConfirm:"",
                            })
                        }
                });
            }
        }
        else{
            swan.showToast({
                title: '密码不能为空',
                icon:'none',
            });
        }

    },

    onLoad: function () {
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