/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
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

    onLaunch(options) {
        this.data.subScribeId = Math.random() + Math.random() + Math.random();
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
