/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        access_token:null
    },

    setData:function(param){
        this.data.access_token = param
    },

    onLaunch(options) {
        // do something when launch
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
