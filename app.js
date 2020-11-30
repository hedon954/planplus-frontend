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
        access_token:'',
        infoChanged:false,
    },

    setAccessToken:function(param){
        this.data.access_token = param;
    },

    setTaskChanged: function(param){
        this.data.taskChanged = param;
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
