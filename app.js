/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        username: "",
        password: "",
        subScribeId: 0,
        taskChanged: false,
        preTab: '', //home页面，记录进入修改界面之前tab的状态（今日or明日）
        preTab2: '', //all-tasks页面，记录进入修改界面之前tab的状态（今日or明日）
        access_token:'',
        infoChanged:false,
        isNewUser: 0
    },

    setAccessToken:function(param){
        this.data.access_token = param;
    },

    setTaskChanged: function(param){
        this.data.taskChanged = param;
    },

    setPreTab: function(param){
        this.data.preTab = param;
    },

    setPreTab2: function(param){
        this.data.preTab2 = param;
    },

    setSubScribeId:function(param){
        this.data.subScribeId = param;
    },

    setInfoChanged: function(param){
        this.data.infoChanged = param;
    },

    setUsername:function(param){
        this.data.username = param;
    },

    setPassword:function(param){
        this.data.password = param;
    },

    setIsNewUser:function(param){
        this.data.isNewUser = param;
    },

    onLaunch(options) {
        this.data.subScribeId = Math.random() + Math.random() + Math.random();
        this.data.access_token = swan.getStorageSync("access_token");
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
