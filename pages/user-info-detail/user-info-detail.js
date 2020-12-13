const app = getApp();

Page({
    data: {
        currentUserId: null,
        userId:1,
        userNickname:"",
        userGender:2,
        userBirthday:'2000-03-14',
        userBirthdayText:'2000-03-14',
        userAvatarUrl:"",
        userGenderText:"未知",
        filePath: '',
        selector: [{
            id: '0',
            name:'女'
        }, {
            id: '1',
            name:'男'
        }],
        rangeKey: ['男'],
    },

    dateChange(e) {
        console.log('picker-date changed，值为', e.detail.value);
        this.setData({
            userBirthday: e.detail.value,
            userBirthdayText: e.detail.value,
        });
    },

    nicknameChange(e) {
        this.setData(
            'userNickname', e.detail.value
        );
    },

    btnComfirm(e){
        if(this.data.userNickname!=""){
            swan.request({

                // url: 'http://localhost:9527/project/user/info',
                url: 'https://www.hedon.wang/project/user/info',
                method: 'PUT',
                header:{
                    'Authorization': 'bearer '+app.data.access_token
                },
                data:{
                    userNickname:this.data.userNickname,
                    userGender:this.data.userGender,
                    userBirthday:this.data.userBirthday.substring(0,10)+"T00:00:00",
                },
                responseType: 'text',
                success:res=>{
                    console.log("dsfsfsdf"+res.data.code)
                    if(res.data.code == 1000){
                        swan.showToast({
                        title: '修改成功'
                        })
                        app.setInfoChanged(true);
                    }
                }
            })
        }else{
            swan.showToast({
                icon:'none',
                title: '信息不能为空'
                })
        }
        console.log("当前用户ID："+this.data.currentUserId)

    },

    genderChange(e) {
        console.log('gender changed，值为', e.detail.value);
        this.setData(
            'userGender', e.detail.value,
        );
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
    },

    onLoad: function(){
        this.getInfo();
    },

    getInfo:function(){
        //读取当前用户数据
        swan.request({
            url: 'https://www.hedon.wang/project/user/info',
            method: 'GET',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            responseType: 'text',
            success:res=>{
                console.log("成功获取数据");
                console.log(res.data.data);

                this.setData(
                    {
                        userNickname:res.data.data.userNickname,
                        userAvatarUrl:res.data.data.userAvatarUrl,
                        userGender:res.data.data.userGender,
                        userBirthday:res.data.data.userBirthday.substring(0,10),
                        userBirthdayText: res.data.data.userBirthday.substring(0, 10),
                    }
                );
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

    chooseImage() {
        swan.showModal({
            title: '等待更新',
            content:"暂不可更换头像，敬请等待更新！",
            showCancel: false,
            confirmText: '确定',
        })
        return;
        swan.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: res => {
                this.setData('filePath', res.tempFilePaths[0]);
                swan.showModal({
                    title:"上传头像",
                    content:"是否确认上传该头像?",
                    showCancel: true,
                    cancelText: '取消',
                    confirmText: '确定',
                    success: res=>{
                        //上传头像
                        if(res.confirm){
                            this.uploadAvatar();
                        }
                    }
                })
            }
        });
    },

    uploadAvatar:function(){
        const filePath = this.getData('filePath');
        if (!filePath) {
            swan.showToast({
                title: '请先上传图片',
                icon: 'none'
            });
        }
        swan.uploadFile({
            url: 'http://localhost:9527/project/user/avatar',
            filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
                'Authorization': 'bearer ' + app.data.access_token,
            },
            formData: {
                'user': 'test'
            },
            success: res => {
                swan.showToast({
                    title: '上传成功',
                    icon: 'none'
                });
                console.log('uploadFile success', res);
                this.setData({filePath});
            },
            fail: err => {
                console.log('uploadFile fail', err);
                swan.showToast({
                    title: '上传失败',
                    icon: 'none'
                });
            }
        });

    },

    onShow:function(){
        swan.setPageInfo({
            title: '个人信息修改——PlanPlus时间管理大师',
            keywords: 'PlanPlus,时间管理,待办,个人信息,信息修改',
            description: '在本界面可以查看个人信息的详细情况并对包括昵称、性别生日、等信息进行修改',
            releaseDate: '',
            image: '',
            video: ''
        });
    }


});