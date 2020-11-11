/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        subScribeId: 0,
        taskChanged: false,
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDUzMTU4NTcsInVzZXJfbmFtZSI6IjE1NjIzMjA1MTU2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiI1YWEzNDMyNS00ODJiLTQ5YjMtYjljNi0wNjMzYjY1YzNjYTEiLCJjbGllbnRfaWQiOiJwbGFucGx1cyIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.rigsgm49RXMHjR20knLOqeU0Y9hAlYk5tCT-Fq52BGk1'
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
