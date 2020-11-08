/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        taskChanged: false,
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDQ5ODgxNjEsInVzZXJfbmFtZSI6IjE1NjIzMjA1MTU2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI5NGVjODUwNy0xODMxLTQ5MWMtYjY2NS03ZTdkMjZjY2UzZDkiLCJjbGllbnRfaWQiOiJwbGFucGx1cyIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.ItYzJaLyTSSXnE0MWx2VqNJXTw6v7mXe0RJmf1RG-Dc'

    },

    setAccessToken:function(param){
        this.data.access_token = param;
    },

    setTaskChanged: function(param){
        this.data.taskChanged = param;
    },

    onLaunch(options) {
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
