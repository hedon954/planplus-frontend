/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDQ1ODYzNzAsInVzZXJfbmFtZSI6IjE1NjIzMjA1MTU2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiJhYWMyOGJjNi0wMjRiLTQzNGUtODM1ZC04MTZlNjYwOTQ4MjYiLCJjbGllbnRfaWQiOiJwbGFucGx1cyIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.aGOMuK_kcFcWlB9G7CHQNovCsS_T1K0XKzB5G9WH6sU'
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
