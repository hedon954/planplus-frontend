const app = getApp();

Page({
    data: {
        content: "",
        email: ""
    },

    /**
     * 发送反馈
     */
    feedback:function(){
        if(this.data.content == ""){
            swan.showModal({
                // 提示的标题
                title: '反馈失败',
                // 提示的内容
                content: '请输入反馈内容后再进行反馈！',
                // 是否显示取消按钮 。
                showCancel: false,
                // 确定按钮的文字，最多 4 个字符。
                confirmText: '确定',
            });
            return;
        }
        swan.request({
            // url: 'http://localhost/project/mail/feedback',
            url: 'https://www.hedon.wang/mail/feedback',
            header: {
                'Authorization': 'bearer '+app.data.access_token
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                content: this.data.content,
                email: this.data.email
            },
            success: res=>{
                if(res.data.code == 1000){
                    swan.showToast({
                        // 提示的内容
                        title: '谢谢您的反馈！',
                        // 图标，有效值"success"、"loading"、"none"。
                        icon: 'success',
                        // 提示的延迟时间，单位毫秒。
                        duration: 1000,
                        mask: false
                    });
                    this.setData({
                        content: "",
                        email: ""
                    })
                }else{
                    swan.showToast({
                        // 提示的内容
                        title: res.data.message,
                        // 图标，有效值"success"、"loading"、"none"。
                        icon: 'none',
                        // 提示的延迟时间，单位毫秒。
                        duration: 1000,
                        // 是否显示透明蒙层，防止触摸穿透。
                        mask: false
                    });
                }
            },
            //失败一般是服务器崩溃了，这里先这样反馈，体验友好一点
            fail: err=>{
                swan.showToast({
                    // 提示的内容
                    title: '谢谢您的反馈！',
                    // 图标，有效值"success"、"loading"、"none"。
                    icon: 'success',
                    // 提示的延迟时间，单位毫秒。
                    duration: 1000,
                    mask: false
                });
                this.setData({
                    content: "",
                    email: ""
                })
            }
        });
    },


    /**
     * 获取反馈信息
     */
    feedbackContentInput:function(e){
        this.setData({
            content: e.detail.value
        })
    },

    /**
     * 获取反馈者邮箱
     */
    feedbackEmailInput:function(e){
        this.setData({
            email: e.detail.value
        })
    },

    onShow:function(){
        swan.setPageInfo({
            title: '反馈界面——PlanPlus时间管理大师',
            keywords: 'PlanPlus,时间管理,待办,使用反馈,反馈意见',
            description: '反馈界面主要是用于让用户反馈在使用过程中所遇到的一些问题，也可以对本应用提出一些宝贵的建议',
            releaseDate: '',
            image: '',
            video: ''
        });
    }
});