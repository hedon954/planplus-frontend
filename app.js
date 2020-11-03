/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDQ2NzU2MTUsInVzZXJfbmFtZSI6IjE1NjIzMjA1MTU2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiIzZjZhZGYzYS1mYzZlLTRjMjMtYWNhNC1kZTFjNWQ4MGEyODIiLCJjbGllbnRfaWQiOiJwbGFucGx1cyIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.oEj0003YE66sZm1Awwl77P2DAMzwj7vK0O601FXjci4'
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
